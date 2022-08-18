<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>

		<u--form ref="form1" labelPosition="left" labelWidth="80">

			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'110px' }"
					scroll-y="true" :scroll-top="scrollTop" @scroll="scroll" scroll-with-animation="true">

					<view class="top-height">
						<u-form-item label="报销人员" borderBottom>
							<view class="top-user">
								<image class="user-head" src="/static/img/workbench/icon_user_head.png"></image>
								<text class="user-name">{{userInfo.realname}}</text>
							</view>
						</u-form-item>
						<u-form-item label="报销部门" @click="clickSelectDepartment(); hideKeyboard()">
							<u--input v-model="departName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon v-if="lstDepartment[0].length>1" slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view class="top-height">
						<view v-for="(item,index) in sumExpenseInfo.vars" :key="index">
							<u-form-item v-if="item.variableName!='money'" :label="item.variableNameCn">
								<u--input v-model="item.variableValue" border="none" placeholder="请填写" clearable
									maxlength="30"></u--input>
							</u-form-item>
						</view>
					</view>
					<view class="top-height">
						<u-form-item label="备注信息"></u-form-item>
						<u--textarea v-model="sumExpenseInfo.memo" border="none" placeholder="请输入备注信息" maxlength="300">
						</u--textarea>
					</view>
					<view class="top-height">
						<u-form-item label="选择费用" :required="true" @click="clickSelectCost(); hideKeyboard()">
							<u--input v-model="selectFees" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view class="card" v-for="(item, index) in lstCheckCost" :key="index">
						<view class="card-pa">
							<u-cell :title="item.expenseName">
								<image class="logo" slot="icon" src="/static/img/workbench/icon_delete_cost.png"
									@click="deleteCost(index)"></image>
								<!-- <text slot="value" class="u-slot-value" >未报销</text> -->

							</u-cell>
							<u-form-item label="负责人员">
								<text>{{item.chargeName}}</text>
							</u-form-item>
							<u-form-item label="项目名称">
								<text>{{item.projectName}}</text>
							</u-form-item>
							<u-form-item label="费用金额">
								<text>￥{{item.amounts}}</text>
							</u-form-item>
							<u-form-item label="发生时间">
								<text>{{item.happenTime}}</text>
							</u-form-item>
						</view>
					</view>


				</scroll-view>
			</view>

			<view class="foot-height">
				<view style="padding: 0 16px;">
					<u-form-item label="报销金额合计" ref="item1" labelWidth="110">
						<u--input v-model="amounts" border="none" placeholder="￥000.00" clearable maxlength="30">
						</u--input>
					</u-form-item>
					<u-form-item>
						<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="提交" @click="saveSumExpense">
						</u-button>
					</u-form-item>
				</view>
			</view>
		</u--form>
		<movable-area class="movableArea" :style="{ 'top': statusBarHeight + 'px','bottom':'110px' }">
			<movable-view class="movableView" direction="all" x="620rpx" y="1100rpx">
				<image class="to-head" src="/static/img/workbench/icon_tohead.png" mode="widthFix" @click="backtop">
				</image>
			</movable-view>
		</movable-area>
		<u-modal :content="modalContent" :show="showModal" :title="modalTitle" showCancelButton closeOnClickOverlay
			@confirm="confirmModal" @cancel="showModal=false" @close="showModal=false"></u-modal>

		<u-picker :show="showDepartmentPicker" :columns="lstDepartment" keyName="name" closeOnClickOverlay
			@close="showDepartmentPicker=false" @cancel="showDepartmentPicker=false" @confirm="confirmDepartment">
		</u-picker>


	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		js_date_time
	} from "@/util/js_DateTime.js"
	import {
		sumExpenseAdd,
		sumExpenseEdit,
		getProcessStartVariables,
		getProcessVariables
	} from "@/util/interface.js"
	export default {
		data() {

			return {
				userInfo: {},
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				old: { //之前的滚动条距离顶部的距离
					scrollTop: 0,
				},
				navTitle: "新建报销单",
				modalContent: "",
				modalTitle: "",
				showModal: false,
				sumExpenseInfo: {
					costIds: "", //报销费用（多个id以逗号隔开）	
					applyId: "", //报销人员ID
					amounts: "", //申请金额	
					departId: "", //报销部门ID
					memo: "", //备注
					orgId: "", //组织ID
					formId: "1536603313596440577",
					vars: [],
				},
				showDepartmentPicker: false,
				departName: "",
				lstDepartment: [],
				lstCheckCost: [],
				selectFees: '',
				amounts: '',
				lstGateWayVariable: [],
				editDetails: {},
				type: 0, //1费用管理发起报销单  2已撤销发起的编辑
				returnPageNumber: 1,
				isClick: false, //防止重复点击保存按钮
			}
		},
		onLoad(option) {
			let type = isEmpty(option.type) ? 0 : option.type;
			this.type = type;
			this.returnPageNumber = isEmpty(option.returnPageNumber) ? 1 : parseInt(option.returnPageNumber);
			if (type == 1 || type == 0) { //费用管理发起报销单
				this.getStartVariables();
				this.getData();
			} else if (type == 2) { //已撤销发起的编辑
				this.navTitle = "编辑报销单";
				let detail = uni.getStorageSync("reimbursDetails");
				this.editDetails = detail
				this.sumExpenseInfo.memo = detail.memo
				//console.log(detail);
				this.getEditStartVariables()
				this.getData();

			}

			this.userInfo = this.$cache.get('_userInfo') //getApp().globalData.userInfo;
			this.sumExpenseInfo.applyId = this.userInfo.id;
			this.sumExpenseInfo.orgId = this.userInfo.orgId;
			let arrid = this.userInfo.deptIds.split(",");
			let arrName = this.userInfo.deptNames.split(",");
			let lstDept = [];
			for (let i in arrid) {
				lstDept.push({
					id: arrid[i],
					name: arrName[i]
				})
			}
			this.lstDepartment.push(lstDept);
			if (type == 2) {
				this.departName = this.editDetails.departName;
				let data = this.lstDepartment[0].find(item => item.name == this.editDetails.departName)
				this.sumExpenseInfo.departId = data.id;
				console.log(this.sumExpenseInfo)
			} else {
				this.departName = this.lstDepartment[0][0].name;
				this.sumExpenseInfo.departId = this.lstDepartment[0][0].id;
			}


			console.log(lstDept)
		},
		onShow() {
			uni.$once('resultCheckCost', res => {
				uni.$emit('resultCheckCost', false);
				if (res) {
					this.getData();
				}
			})
		},
		methods: {
			getData() {
				let lstCheckCost = uni.getStorageSync("lstCheck")
				var num = 0;
				for (var i = 0; i < lstCheckCost.length; i++) {
					num += Number(lstCheckCost[i].amounts)
				}
				this.sumExpenseInfo.amounts = num.toFixed(2)
				this.amounts = isEmpty(this.sumExpenseInfo.amounts) ? '' : '￥' + this.sumExpenseInfo.amounts
				this.lstCheckCost = lstCheckCost;
				this.selectFees = this.lstCheckCost.length > 0 ? "已选" + this.lstCheckCost.length + "条" : ''
			},
			getEditStartVariables() {
				getProcessVariables(this.editDetails.procInstId, res => {
					if (res.code == 200 && res.success) {
						for (let i = 0; i < res.result.length; i++) {
							let item = res.result[i]
							let info = {
								variableName: item.variableName,
								variableValue: item.value,
								variableNameCn: item.variableNameCn
							}
							this.sumExpenseInfo.vars.push(info)
						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getStartVariables() {
				getProcessStartVariables("1536603313596440577", res => {
					if (res.code == 200 && res.success) {
						for (let i = 0; i < res.result.length; i++) {
							let item = res.result[i]
							let info = {
								variableName: item.variableName,
								variableValue: "",
								variableNameCn: item.variableNameCn
							}
							this.sumExpenseInfo.vars.push(info)
						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//取消按钮
			leftClick() {
				this.showModal = true;
				this.modalTitle = "是否取消";
				this.modalContent = "资料尚未提交，是否取消编辑？"
				//uni.navigateBack() 
			},
			//取消按钮 ==》弹出确认按钮
			confirmModal() {
				uni.navigateBack({
					delta: this.returnPageNumber
				});
			},
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop; // 吧滚动条的高度事实给到old.scrollTop 
			},
			//回到顶部
			backtop() {
				console.log("回到顶部")
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});

			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			//选择费用
			clickSelectCost() {
				uni.setStorageSync('lstCheck', this.lstCheckCost) //1*60*60*24*7
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/reimburseManagement/selectCost"
				})
			},
			//选择报销部门
			clickSelectDepartment() {
				if (this.lstDepartment[0].length > 1) {
					this.showDepartmentPicker = true;
				}
			},
			//选择报销部门 ===> 确认
			confirmDepartment(e) {
				this.departName = e.value[0].name;
				this.sumExpenseInfo.departId = e.value[0].id;
				this.showDepartmentPicker = false;
			},
			//移除费用选项
			deleteCost(index) {
				console.log(index)
				this.sumExpenseInfo.amounts = (this.sumExpenseInfo.amounts - this.lstCheckCost[index].amounts).toFixed(2)
				this.amounts = isEmpty(this.sumExpenseInfo.amounts) ? '' : '￥' + this.sumExpenseInfo.amounts
				this.lstCheckCost.splice(index, 1);
				// this.lstCheckCost=lstCheckCost;
				this.selectFees = this.lstCheckCost.length > 0 ? "已选" + this.lstCheckCost.length + "条" : ''
			},
			//提交按钮
			saveSumExpense() {
				console.log(this.sumExpenseInfo)
				if (this.lstCheckCost.length > 0) {
					if (!this.isClick) {
						this.isClick = true;
						for (let j = 0; j < this.sumExpenseInfo.vars.length; j++) {
							let item = this.sumExpenseInfo.vars[j]
							if (item.variableName == 'money') {
								item.variableValue = this.sumExpenseInfo.amounts;
								break;
							}
						}
						let costId = "";
						for (let i = 0; i < this.lstCheckCost.length; i++) {
							let id = this.lstCheckCost[i].id
							costId = costId + (isEmpty(costId) ? ("" + id) : ("," + id))
						}
						this.sumExpenseInfo.costIds = costId;
						if (this.type == 2) {
							this.editDetails.memo = this.sumExpenseInfo.memo
							this.editDetails.costIds = this.sumExpenseInfo.costIds;
							this.editDetails.amounts = this.sumExpenseInfo.amounts
							this.editDetails.applyId = this.sumExpenseInfo.applyId
							this.editDetails.orgId = this.sumExpenseInfo.orgId
							this.editDetails.departId = this.sumExpenseInfo.departId
							this.editDetails.status = 1;
							this.editDetails.vars = this.sumExpenseInfo.vars
							sumExpenseEdit(this.editDetails, res => {
								if (res.code == 200 && res.success) {
									uni.$u.toast(res.message);
									uni.removeStorageSync("lstCheck")
									uni.$emit('returnExpense', true);
									uni.redirectTo({
										url: "/pages/workbench/accountingManagement/reimburseManagement/reimbursementDetails"
									})
								} else {
									uni.$u.toast(res.message);
									this.isClick = false;
								}
							})
							console.log(this.editDetails)
						} else {
							sumExpenseAdd(this.sumExpenseInfo, res => {
								if (res.code == 200 && res.success) {
									uni.$u.toast(res.message);
									uni.removeStorageSync("lstCheck")
									uni.$emit('returnExpense', true);
									uni.redirectTo({
										url: "/pages/workbench/accountingManagement/reimburseManagement/reimburseManagement"
									})
								} else {
									uni.$u.toast(res.message);
									this.isClick = false;
								}
							})
							console.log(this.sumExpenseInfo)
						}

					}
					console.log(this.lstCheckCost)
				} else {
					uni.$u.toast("请选择费用");
					return;
				}


			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	/deep/.navbar {
		.u-navbar__content__left__text span,
		.u-navbar__content__right__text {
			color: #2979ff;
		}
	}

	/deep/.top-height {
		margin-top: 10px;
		background: #fff;
		padding: 0 16px;

		.u-form-item__body__left__content__required {
			right: 6px;
			float: right;
			left: unset;
		}

		.uni-input-placeholder {
			text-align: right;
		}

		.u-input__content__field-wrapper__field {
			text-align: right !important;
		}

		.u-textarea {
			padding: unset;
		}

		.u-textarea__field {
			height: 80px !important;
		}

		.uni-textarea-wrapper {
			height: 70px;
		}

		.top-user {
			position: absolute;
			right: 16px;

			.user-head {
				width: 38px;
				height: 38px;
				position: relative;
				top: 2px;
				right: 6px;
			}

			.user-name {
				position: relative;
				top: -12px;
			}
		}
	}

	/deep/ {
		.scrool-more {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}

		.uni-scroll-view-content {
			height: unset;
		}

		.foot-height {
			position: absolute;
			bottom: 0px;
			width: 100%;
			height: 110px;
			background: #fff;
			border-top: 1px solid #f0f4f9;

			.uni-input-placeholder {
				text-align: right;
				color: rgba(0, 114, 255, 1) !important;
			}

			.u-input__content__field-wrapper__field {
				text-align: right !important;
				color: rgba(0, 114, 255, 1) !important;
			}
		}
	}

	.card {
		padding: 0 16px 16px;
		background: #fff;

		/deep/.u-cell {
			border-top: 1px solid rgba(240, 244, 249, 1);

			.u-line {
				border-bottom: none !important;
			}

			.u-cell__body {
				padding: 16px 0px 0px;

				.u-cell__title-text {
					font-size: 16px;
					font-weight: bold;
					color: rgba(48, 49, 51, 1);
				}

				.u-cell__left-icon-wrap {
					margin-right: 8px;
				}

				.logo {
					width: 24px;
					height: 24px;
				}

			}
		}

		/deep/.u-form-item__body {
			padding: 10px 0 0;

			.u-form-item__body__left__content__label {
				font-size: 14px;
				color: rgba(116, 121, 136, 1);
			}

			.u-form-item__body__right__content__slot {
				font-size: 14px;
				color: rgba(48, 49, 51, 1);
			}
		}

		.card-pa-view {
			line-height: 30px;
			height: 30px;

			.card-title {
				display: block;
				width: 80%;
				float: left;
			}

			.card-state {
				display: block;
				width: 17%;
				float: right;
				color: #D1372C;
			}
		}

		.txt-size {
			display: block;
			margin-top: 5px;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.65);
		}


	}

	.movableArea {
		position: fixed;
		top: 0px;
		bottom: 110px;
		left: 0;
		width: 100%;
		height: 75%;
		pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素

		.movableView {
			pointer-events: auto; //可以点击
			width: 96rpx;
			height: 96rpx;
			border-radius: 50%;

			.to-head {
				width: 48px;
				height: 48px;
			}
		}
	}
</style>
