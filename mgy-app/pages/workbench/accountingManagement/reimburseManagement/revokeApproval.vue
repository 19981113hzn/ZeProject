<template>
	<view class="container" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="navTitle" bgColor="#fff" @leftClick="leftClick">

		</u-navbar>
		<u--form labelPosition="left" labelWidth="80">
			<view v-if="type==1" class="top-height">
				<u-form-item label="撤销原因" :required="true"></u-form-item>
				<u--textarea v-model="content" border="none" placeholder="请填写撤销原因" maxlength="300"></u--textarea>
			</view>
			<view v-if="type==2" class="top-height">
				<u-form-item label="驳回原因" :required="true"></u-form-item>
				<u--textarea v-model="rejectContent" border="none" placeholder="请填写驳回原因" maxlength="300"></u--textarea>
			</view>
			<view v-if="type==3" class="top-height">
				<u-form-item label="留言意见"></u-form-item>
				<u--textarea v-model="contentContent" border="none" placeholder="请填写留言意见" maxlength="300"></u--textarea>
			</view>
			<view v-if="type==3" class="top-height">
				<u-form-item label="通知人员">
					<u-switch disabled v-model="isMessageReminder" inactiveColor="rgba(192, 196, 204, 1)"></u-switch>
				</u-form-item>
				<view v-if="isMessageReminder">
					<view class="filter-content" v-for="(item,index) in lstUser" :key="index">
						<view style="padding: 0 5px;">
							<text class='filter-content-detail-item-default' :style="{'background-color':item.isSelected?'rgba(0, 114, 255, 0.05)':'rgba(247, 249, 252, 1)',
							'color':item.isSelected?'rgba(0, 114, 255, 1)':'rgba(48, 49, 51, 1)',
							'border-color':item.isSelected?'rgb(0, 114, 255)':'none',
							'border': item.isSelected?'1px solid':'none'}" @click="selectItem(index)">
								{{item.name}}
							</text>
						</view>
					</view>
					<view v-if="isMore" class="filter-content">
						<view style="padding: 0 5px;">
							<text class='filter-content-detail-item-default' :style="{'background-color':isJump?'rgba(0, 114, 255, 0.05)':'rgba(247, 249, 252, 1)',
								'color':isJump?'rgba(0, 114, 255, 1)':'rgba(48, 49, 51, 1)',
								'border-color':isJump?'rgb(0, 114, 255)':'none',
								'border': isJump?'1px solid':'none'}" @click="seeMore(index)">
								{{isJump?'已选'+lstSelectUser.length+'人>':'更多'}}
							</text>
						</view>
					</view>
				</view>
			</view>
		</u--form>
		<view style="padding: 40px 16px 16px;">
			<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="确认" @click="save"></u-button>
		</view>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getUserListByUserId,
		sumExpenseOperate
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				content: "", //撤销原因
				type: 3, //1撤销  2驳回  3通过
				procInstId: "",
				collectionId: "",
				navTitle: "撤销审批",
				isMore: true, //更多
				isJump: false, //跳转
				lstUser: [],
				lstSelectUser: [],
				total: 0,
				defaultSelectedIndex: [], //选择的id
				contentContent: "", //备注信息
				rejectContent: "", //驳回原因
				detail: {},
				isMessageReminder: false,
				bizCode:"",//报销申请:SUMEXPENSE 产品报价:PRODUCTQUOTE 回款管理:COLLECTION 付款管理:PAYMENT 开票申请:INVOICING
			}
		},
		onLoad(option) {
			let type = isEmpty(option.type) ? false : option.type;
			this.procInstId = isEmpty(option.procInstId) ? "" : option.procInstId;
			this.collectionId = isEmpty(option.collectionId) ? "" : option.collectionId;
			this.bizCode= isEmpty(option.bizCode) ? false : option.bizCode;
			this.type = type
			if (this.type == 1) {
				this.navTitle = "撤销审批"
			} else if (this.type == 2) {
				this.navTitle = "审批驳回"
			} else if (this.type == 3) {
				this.detail = uni.getStorageSync("reimbursDetails");
				this.isMessageReminder = this.detail.curCopyto ? true : false
				this.navTitle = "通过"
				this.getUserList(5, 1);
			}
		},
		onShow() {
			uni.$once('resultSelectUser', res => {
				uni.$emit('resultSelectUser', false);
				if (res) {
					let lstSelectUser = uni.getStorageSync("lstSelectUser")
					let defaultSelectedIndex = [];
					let lst = [];
					if (lstSelectUser.length > 4) {
						for (let i = 0; i < lstSelectUser.length; i++) {
							if (i < 5) {
								lst.push(lstSelectUser[i])
							}
							if (lstSelectUser[i].isSelected) {
								defaultSelectedIndex.push(lstSelectUser[i].value)
							}
						}
						this.lstUser = lst;
						this.isJump = true;
						this.defaultSelectedIndex = defaultSelectedIndex
					} else {
						for (let i = 0; i < lstSelectUser.length; i++) {
							lst.push(lstSelectUser[i])
							if (lstSelectUser[i].isSelected) {
								defaultSelectedIndex.push(lstSelectUser[i].value)
							}
							for (let j = 0; j < this.lstUser.length; j++) {
								if (lstSelectUser[i].value == this.lstUser[j].value) {
									this.lstUser.splice(j, 1);
								}
							}
						}
						let num = 5 - lstSelectUser.length;
						for (let j = 0; j < num; j++) {
							lst.push(this.lstUser[j])
						}
						this.lstUser = lst;
						this.defaultSelectedIndex = defaultSelectedIndex
					}
					this.lstSelectUser = lstSelectUser;
					console.log(this.lstSelectUser)
					console.log(this.defaultSelectedIndex)
				}
			})
		},
		methods: {
			leftClick() {
				uni.navigateBack();
			},
			getUserList(pageSize, type) {
				let data = "?realname=" + "" +
					"&pageNo=" + "1" +
					"&pageSize=" + pageSize;
				getUserListByUserId(data, res => {
					if (res.code == 200 && res.success) {
						let data = [];
						for (let j = 0; j < res.result.records.length; j++) {
							data.push({
								name: res.result.records[j].realname,
								value: res.result.records[j].id,
								isSelected: false,
								id: res.result.records[j].id
							})
						}
						if (type == 1) {
							this.lstUser = data;
							this.total = res.result.total;
						} else {
							this.lstUser = this.lstUser.concat(data);
							this.isMore = false;
						}

					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			selectItem(index) {
				let value = this.lstUser[index].value;
				if (this.lstUser[index].isSelected) {
					this.lstUser[index].isSelected = false;
					var num = this.defaultSelectedIndex.indexOf(value);
					if (num > -1) {
						this.defaultSelectedIndex.splice(num, 1);
					}
					for (let i = 0; i < this.lstSelectUser.length; i++) {
						if (this.lstSelectUser[i].value == value) {
							this.lstSelectUser.splice(i, 1);
						}
					}
				} else {
					this.lstUser[index].isSelected = true;
					this.defaultSelectedIndex.push(value);
					this.lstSelectUser.push(this.lstUser[index])

				}
			},
			seeMore() {
				//this.getUserList(this.total);
				let lst = isEmpty(this.lstSelectUser) ? this.lstUser : this.lstSelectUser
				uni.setStorageSync('lstSelectUser', lst) //1*60*60*24*7
				//uni.setStorageSync('indexSelectUser',index)//1*60*60*24*7
				uni.navigateTo({
					url: "/pages/filter-all/select-more?total=" + parseInt(this.total)
				});
			},
			save() {
				if (this.type == 1) {
					if (isEmpty(this.content)) {
						uni.$u.toast('请填写撤销原因');
						return;
					} else {
						let data = {
							operate: "0",
							content: this.content,
							procInstId: this.procInstId ? this.procInstId : this.collectionId
						}
						sumExpenseOperate(data, res => {
							if (res.code == 200 && res.success) {
								uni.$u.toast("撤销成功");
								uni.$emit('return', true);
								// 从回款管理撤销
								if(this.collectionId){
										uni.navigateTo({
										url: "/pages/workbench/accountingManagement/collectionManagement/collectionManagement"
									})
								}
								else if(this.bizCode=="PRODUCTQUOTE"){
									uni.$emit('returnQuotation', true);
									uni.redirectTo({
										url: "/pages/workbench/accountingManagement/quotationManagement/quotationManagement"
									})
								}else{
										uni.navigateTo({
										url: "/pages/workbench/accountingManagement/reimburseManagement/reimburseManagement"
									})
								}
								
							} else {
								uni.$u.toast(res.message);
							}
						})
					}

				}
				if (this.type == 2) { //驳回
					if (isEmpty(this.rejectContent)) {
						uni.$u.toast('请填写驳回原因');
						return;
					} else {
						let data = {
							operate: "3",
							content: this.rejectContent,
							procInstId: this.procInstId
						}
						sumExpenseOperate(data, res => {
							if (res.code == 200 && res.success) {								
								uni.redirectTo({
									url: "/pages/workbench/processCenter/approvalResult?type=2&bizCode="+this.bizCode
								});
							} else {
								uni.$u.toast(res.message);
							}
						})
					}
				}
				if (this.type == 3) { //通过
					if (this.detail.curLeaveMsg) { //当前任务是否留言必填	
						if (isEmpty(this.contentContent)) {
							uni.$u.toast("留言意见是必填");
							return false;
						} else {
							let data = {
								operate: "1",
								content: this.contentContent,
								copyTo: this.defaultSelectedIndex,
								procInstId: this.procInstId
							}
							sumExpenseOperate(data, res => {
								if (res.code == 200 && res.success) {
									uni.redirectTo({
										url: "/pages/workbench/processCenter/approvalResult?type=1&bizCode="+this.bizCode
									});
								} else {
									uni.$u.toast(res.message);
								}
							})
						}
					} else {
						let data = {
							operate: "1",
							content: this.contentContent,
							copyTo: this.defaultSelectedIndex,
							procInstId: this.procInstId
						}
						sumExpenseOperate(data, res => {
							if (res.code == 200 && res.success) {
								uni.redirectTo({
									url: "/pages/workbench/processCenter/approvalResult?type=1&bizCode="+this.bizCode
								});
							} else {
								uni.$u.toast(res.message);
							}
						})
					}
				}
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.container {
		.top-height {
			margin-top: 10px;
			background: #fff;
			padding: 0 16px;

			/deep/.u-form-item__body__left__content__required {
				right: 6px;
				float: right;
				left: unset;
			}

			/deep/.u-switch {
				position: absolute;
				right: 16px;
			}
		}

		.title {
			font-size: 14px;
			color: #909399;
			display: block;
			margin-top: 20px;
		}

		/deep/.u-cell {
			border: none;

			.u-cell__body {
				padding: 16px 0;
			}

			.u-line {
				border: none !important;
			}
		}
	
	.filter-content-detail-item-default {
			background-color: #FFFFFF;
			color: #666666;
			//padding: 5px 15px;
			border-radius: 20px;
			// margin-right: 2%;
			margin-bottom: 10px;
			display: inline-block;
			font-size: 14px;
			line-height: 35px;
			text-align: center;
			width: 100%;
		}

		.filter-content {
			width: 33.33%;
			display: inline-block;
		}
	}
</style>
