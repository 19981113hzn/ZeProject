<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="发票申请" bgColor="rgba(0, 114, 255, 1)" @leftClick="leftClick">
			<view class="u-nav-slot" slot="left">
				<image class="logo" src="/static/img/icon_bark_left.png"></image>
			</view>
		</u-navbar>
		<u-loading-icon v-if="isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<view v-else>
			<u-cell-group class="sign-out" :border="false">
				<u-cell :title="invoicementDetails.applyName+'的开票'" size="large">
					<image class="user-head" slot="icon" src="/static/img/icon_user_default.png"></image>
					<!-- <image class="user-head" slot="icon" src="https://cdn.uviewui.com/uview/album/1.jpg"></image> -->
					<u-tag v-if="invoicementDetails.status==3" slot="value" text="已通过" bgColor="rgba(247, 252, 244, 1)"
						borderColor="rgba(247, 252, 244, 1)" color="rgba(103, 194, 58, 1)" size="mini">
					</u-tag>
					<u-tag v-if="invoicementDetails.status==2" slot="value" text="待审批" bgColor="rgba(235, 244, 255, 1)"
						borderColor="rgba(235, 244, 255, 1)" color="rgba(0, 114, 255, 1)" size="mini">
					</u-tag>
					<u-tag v-if="invoicementDetails.status==5" slot="value" text="被驳回" bgColor="rgba(255, 248, 242, 1)"
						borderColor="rgba(255, 248, 242, 1)" color="rgba(255, 147, 48, 1)" size="mini">
					</u-tag>
					<u-tag v-if="invoicementDetails.status==6" slot="value" text="已撤销" bgColor="rgba(241, 245, 250, 1)"
						borderColor="rgba(241, 245, 250, 1)" color="rgba(144, 147, 153, 1)" size="mini">
					</u-tag>
				</u-cell>
			</u-cell-group>
			<view class="main-head"></view>
			<view class="main-foot"></view>
			<view class="main-crad">
				<view class="main-crad-bg">
					<image class="card-money" src="/static/img/workbench/icon_collection.png"></image>
					<text class="card-name">开票合计金额</text>
					<text class="card-num">¥{{numFilter(invoicementDetails.amount)}}</text>
					<u-cell :title="invoicementDetails.invoiceTitle ? invoicementDetails.invoiceTitle : '-'">
						<image class="icon-slot" slot="icon" src="/static/img/workbench/icon_title.png"></image>
					</u-cell>
					<view class="card_title">
						<u-cell>
							<text slot="title">{{invoicementDetails.applyDepartName}}</text>
							<image class="icon-slot" slot="icon" src="/static/img/workbench/icon_periods.png"></image>
						</u-cell>
						<u-cell :title="invoicementDetails.createTime ? invoicementDetails.createTime : '-'">
							<image class="icon-slot" slot="icon" src="/static/img/workbench/icon_plantime.png"></image>
						</u-cell>
					</view>
				</view>
			</view>
			<view class="main-content">
				<u-tabs :list="lsyTabs" @click="clickTabs" :scrollable="false" lineWidth="59"></u-tabs>
			</view>

			<view v-if="current==0">
				<view class="main-card">
					<view class="card-dynamic" v-for="(item, index) in lstdynamic" :key="index">
						<text class="spot" :style="{
							'border-color':item.operate==1 ? 'none': ((invoicementDetails.status == 6 || invoicementDetails.status==5) ? 'rgba(144, 147, 153, 1)':'rgba(0, 114, 255, 1)'),
							'background':item.operate==1 ? 'none': ((invoicementDetails.status == 6 || invoicementDetails.status==5) ? 'rgba(144, 147, 153, 1)':'rgba(0, 114, 255, 1)'),
							'margin-top':lstdynamic.length>1 ? (item.operate==1?'-6px':'0px'):'0px'
							}"></text>
						<view class="card-step" :style="{
							'border-left':(lstdynamic.length-1)==index ? 'none' : '2px solid',
							'border-left-color':(lstdynamic.length-1)==index  ? 'none' : ((invoicementDetails.status == 6 || invoicementDetails.status==5) ? 'rgba(144, 147, 153, 1)' : 'rgba(0, 114, 255, 1)'),
							}">
							<view class="dynamic-bg">
								<u-cell value="2级审批人">
									<image class="logo" slot="icon" src="/static/img/icon_user_default.png"></image>
									<!-- <text slot="value" class="u-slot-value" >未报销</text> -->
									<view slot="title" class="u-slot-title">
										<text class="u-cell-text">{{item.operatorName}}</text>
										<text class="text-tag">{{item.post}}</text>
									</view>
								</u-cell>
								<u--text :text="'原因:'+(isWhether(item.remark) ?'无':item.remark)"></u--text>
								<u-cell :title="item.operateTime">
									<image class="logo" slot="icon" src="/static/img/workbench/icon_time_no.png">
									</image>
									<!-- <text slot="value" class="u-slot-value" >未报销</text> -->
									<view slot="value" class="u-slot-value">
										<text v-if="item.operate==1" class="u-cell-text"
											style="color: rgba(255, 147, 48, 1);">{{item.operateCn}}</text>
										<text v-if="item.operate==5" class="u-cell-text"
											style="color: rgba(250, 85, 85, 1);">{{item.operateCn}}</text>
										<text v-else-if="item.operate==3" class="u-cell-text"
											style="color: rgba(103, 194, 58, 1);">{{item.operateCn}}</text>
										<text v-else class="u-cell-text"
											style="color: rgba(144, 147, 153, 1);">{{item.operateCn}}</text>
									</view>
								</u-cell>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="current==1">
				<view>
					<view class="card">
						<view class="card-pa">
							<u-cell title="基本信息"></u-cell>
							<u--form labelWidth="105">
								<u-form-item label="申请部门">
									<text>{{invoicementDetails.applyDepartName || "-"}}</text>
								</u-form-item>
								<u-form-item label="申请人员">
									<text>{{invoicementDetails.applyName || "-"}}</text>
								</u-form-item>
								<u-form-item label="发票种类">
									<text>{{invoicementDetails.invoiceType ? "增值税专用发票" : "增值税普通发票" || "-"}}</text>
								</u-form-item>
								<u-form-item label="申请单号">
									<text>{{invoicementDetails.invoicingNo || "-"}}</text>
								</u-form-item>
								<u-form-item label="抬头名称">
									<text>{{invoicementDetails.invoiceTitle || "-"}}</text>
								</u-form-item>
								<u-form-item label="所属客户">
									<text>{{invoicementDetails.customerName || "-"}}</text>
								</u-form-item>
								<u-form-item label="纳税人识别号">
									<text>{{invoicementDetails.taxNumber || "-"}}</text>
								</u-form-item>
								<u-form-item label="详细地址">
									<text>{{invoicementDetails.address || "-"}}</text>
								</u-form-item>
								<u-form-item label="电话号码">
									<text>{{invoicementDetails.phone || "-"}}</text>
								</u-form-item>
								<u-form-item label="开户行">
									<text>{{invoicementDetails.bank || "-"}}</text>
								</u-form-item>
								<u-form-item label="银行账号">
									<text>{{invoicementDetails.bankAccount || "-"}}</text>
								</u-form-item>
								<u-form-item label="关联项目">
									<text>{{invoicementDetails.invoicingNo || "-"}}</text>
								</u-form-item>
								<u-form-item label="关联合同">
									<text>{{invoicementDetails.invoicingNo || "-"}}</text>
								</u-form-item>
								<u-form-item label="合计金额">
									<text>{{invoicementDetails.invoicingNo || "-"}}</text>
								</u-form-item>
								<u-form-item label="发票份数">
									<text>{{invoicementDetails.invoiceQuantity || "-"}}</text>
								</u-form-item>
								<u-form-item label="备注信息">
									<text>{{invoicementDetails.remark || "-"}}</text>
								</u-form-item>
							</u--form>
						</view>
					</view>

					<view class='invoice-detailed'>
						<view class='invoice-detailed-pa'>
							<text>开票明细</text>
						</view>
						<view class="uni-container">
							<!-- <uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据" -->
							<uni-table ref="table" border stripe  emptyText="暂无更多数据"
								@selection-change="selectionChange">
								<uni-tr>
									<uni-th width="60" align="center">名称</uni-th>
									<uni-th width="70" align="center">规格型号</uni-th>
									<uni-th width="50" align="center">单位</uni-th>
									<uni-th width="50" align="center">数量</uni-th>
									<uni-th width="50" align="center">金额</uni-th>
								</uni-tr>
								<uni-tr v-for="(item, index) in tableData" :key="index">
									<uni-td align="center">{{item.itemName}}</uni-td>
									<uni-td align="center">
										<view class="name">{{item.specification}}</view>
									</uni-td>
									<uni-td align="center">{{ item.unit }}</uni-td>
									<uni-td align="center">{{item.quantity}}</uni-td>
								</uni-tr>
							</uni-table>
							<view class="uni-pagination-box">
								<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
									@change="change" />
							</view>
						</view>

					</view>
					<view class="card">
						<view class="card-pa">
							<u-cell title="发票信息"></u-cell>
							<u--form labelWidth="75">
								<u-form-item label="发票代码">
									<text>{{invoicementDetails.invoiceCode || "-"}}</text>
								</u-form-item>
								<u-form-item label="发票号码">
									<text>{{invoicementDetails.invoiceNumber || "-"}}</text>
								</u-form-item>
								<u-form-item label="校验码">
									<text>{{invoicementDetails.checkCode || "-"}}</text>
								</u-form-item>
								<u-form-item label="开票日期">
									<text>{{invoicementDetails.invoiceDate || "-"}}</text>
								</u-form-item>
								<u-form-item label="价税合计">
									<text>{{invoicementDetails.totalAmount || "-"}}</text>
								</u-form-item>
							</u--form>
						</view>
					</view>
				</view>
			</view>
			<u-tabbar v-if="invoicementDetails.status!=-1 && !isDonedWith" :value="numTabbar" :fixed="true"
				:placeholder="true" :safeAreaInsetBottom="true" @change="changeTabbar">

				<u-tabbar-item v-if="isNeedWith || current==0" class="tab-adopt" text="通过">
					<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_adopt.png">
					</image>
				</u-tabbar-item>
				<u-tabbar-item v-if="isNeedWith || current==0" class="tab-reject" text="驳回">
					<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_reject.png">
					</image>
				</u-tabbar-item>
				<!-- <u-tabbar-item v-if="(invoicementDetails.status==3) && !isNeedWith" text="删除记录">
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						src="/static/img/workbench/icon_revoke_approval.png"></image>
				</u-tabbar-item> -->
				<u-tabbar-item v-if="(invoicementDetails.status==1 || invoicementDetails.status==3) && !isNeedWith && current==1"
					text="删除记录">
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						src="/static/img/workbench/icon_revoke_approval.png"></image>
				</u-tabbar-item>
				<u-tabbar-item v-if="(invoicementDetails.status==1 || invoicementDetails.status==2) && !isNeedWith && current==1"
					text="撤销审批">
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						src="/static/img/workbench/icon_revoke_approval.png"></image>
				</u-tabbar-item>
				<u-tabbar-item v-if="(invoicementDetails.status==6 || invoicementDetails.status==5) && !isNeedWith && current==1"
					text="编辑开票单">
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						src="/static/img/workbench/icon_edit.png"></image>
				</u-tabbar-item>
				<u-tabbar-item v-if="(invoicementDetails.status==6 || invoicementDetails.status==5) && !isNeedWith && current==1"
					text="提交审批">
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						src="/static/img/workbench/bjgl_tjsp.png"></image>
				</u-tabbar-item>
				<u-tabbar-item v-if="(invoicementDetails.status==6 || invoicementDetails.status==5) && !isNeedWith && current==1"
					text="删除开票单">
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						src="/static/img/workbench/icon_delete.png"></image>
				</u-tabbar-item>
			</u-tabbar>

		</view>
		<u-modal :show="showDelete" title="删除确认" content='确定要删除该条记录吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		invoiceMentDetailsInfo,
		getProcessTrace,
		sumExpenseOperate,
		sumExpenseEdit,
		sumExpenseDelete,
		getProcessStartVariables,
		getProcessVariables
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				lsyTabs: [{
					name: "审批动态"
				}, {
					name: "资料详情"
				}],
				showDelete: false,
				numTabbar: "",
				procInstId: "",
				reimbursId: "",
				current: 0,
				invoicementDetails: {},
				lstdynamic: [],
				isLoading: false, //加载中
				isNeedWith: false, //是否待办进来的页面
				isDonedWith: false, //是否已办进来的页面
				lstActiviti: [],
			}
		},
		onLoad(option) {
			console.log('option', option)
			let isNeedWith = isEmpty(option.isNeedWith) ? false : option.isNeedWith;
			let isDonedWith = isEmpty(option.isDonedWith) ? false : option.isDonedWith;
			this.isNeedWith = isNeedWith
			this.isDonedWith = isDonedWith
			let detail = uni.getStorageSync("invoicementDetails");
			this.procInstId = detail.id;
			this.reimbursId = detail.id;

			this.invoicementDetails = uni.getStorageSync("invoicementDetails");

			this.getData();

		},
		methods: {
			isWhether(value) {
				return isEmpty(value)
			},
			getData() {
				this.isLoading = false;
				let data = "?id=" + this.procInstId //页码
				;
				// invoiceMentDetailsInfo(this.procInstId, res => {
				invoiceMentDetailsInfo(data, res => {

					if (res.code == 200 && res.success) {
						this.invoicementDetails = res.result;
						if (this.invoicementDetails.status == 6 || this.invoicementDetails.status == 5) {
							// this.getStartVariables();
						}
						// this.getTrace()
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getStartVariables() {
				getProcessVariables(this.procInstId, res => {
					if (res.code == 200 && res.success) {
						for (let i = 0; i < res.result.length; i++) {
							let item = res.result[i]
							let info = {
								variableName: item.variableName,
								variableValue: item.value,
								variableNameCn: item.variableNameCn
							}
							this.lstActiviti.push(info)
						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getTrace() {
				getProcessTrace(this.procInstId, res => {
					if (res.code == 200 && res.success) {
						this.lstdynamic = res.result.logList;
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			},
			numFilter(value) {
				// 截取当前数据到小数点后两位
				let tempVal = parseFloat(value).toFixed(3);
				let realVal = tempVal.substring(0, tempVal.length - 1);
				return realVal;
			},
			//返回上一级
			leftClick() {
				uni.navigateBack();
			},
			clickTabs(item) {
				this.current = item.index
			},
			changeTabbar(name) {
				// if (this.type == 0 && name == 0) { //通过  删除
				// 	this.showDelete = true
				// }
				// if (this.type == 1 && name == 0) { //待办 通过
				// 	uni.$u.toast("待办通过成功")
				// }
				// if (this.type == 1 && name == 1) { //待办 驳回
				// 	uni.$u.toast("待办驳回成功")
				// }
				if ((this.invoicementDetails.status == 1 || this.invoicementDetails.status == 2) && name == 0 && !this
					.isNeedWith) { //审批中  撤销审批
					//uni.$u.toast("审批中撤销审批成功")
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=1&procInstId=" +
							this.procInstId
					})

				}
				if ((this.invoicementDetails.status == 6 || this.invoicementDetails.status == 5) && !this
					.isNeedWith) { //已撤销 
					if (name == 0) { //编辑报销单
						uni.setStorageSync('lstCheck', this.invoicementDetails.list)
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/addReimburse?type=2&returnPageNumber=1"
						})
					}
					if (name == 1) { //提交审批
						this.editResubmit();
					}
					if (name == 2) { //删除报销单
						this.showDelete = true
					}
				}
				if (this.isNeedWith) {
					if (name == 0) { //待办 通过
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=3&procInstId=" +
								this.procInstId
						})
					}
					if (name == 1) { //待办 驳回
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=2&procInstId=" +
								this.procInstId
						})
					}
				}
			},
			//提交审批
			editResubmit() {
				let detail = uni.getStorageSync("reimbursDetails");
				let userInfo = this.$cache.get('_userInfo') //getApp().globalData.userInfo;
				detail.applyId = userInfo.id;
				detail.orgId = userInfo.orgId;
				let arrid = userInfo.deptIds.split(",");
				let arrName = userInfo.deptNames.split(",");
				let lstDept = [];
				for (let i in arrid) {
					lstDept.push({
						id: arrid[i],
						name: arrName[i]
					})
				}
				let data = lstDept.find(item => item.name == detail.departName)
				detail.departId = data.id;
				let costId = "";
				for (let i = 0; i < this.invoicementDetails.list.length; i++) {
					let id = this.invoicementDetails.list[i].id
					costId = costId + (isEmpty(costId) ? ("" + id) : ("," + id))
				}
				detail.costIds = costId;
				detail.status = 1;
				// for(let i=0;i<this.lstActiviti.length;i++){
				// 	this.lstActiviti[]
				// }
				detail.vars = this.lstActiviti;
				sumExpenseEdit(detail, res => {
					if (res.code == 200 && res.success) {
						//uni.$u.toast(res.message);
						uni.$emit('returnExpense', true);
						this.getData();
						this.$refs.uToast.show({
							type: 'success',
							message: "提交成功",
						})
						// uni.navigateBack({
						// 	delta:1
						// })							
					} else {
						uni.$u.toast(res.message);
					}
				})
				console.log(detail)
				// this.$refs.uToast.show({
				//     type:'success',
				//     message:"提交成功",
				// }) 
			},
			confirmDelete() {
				let data = '?id=' + this.reimbursId
				sumExpenseDelete(data, res => {
					if (res.code == 200 && res.success) {
						this.showDelete = false
						this.$refs.uToast.show({
							type: 'success',
							message: "删除成功",
						})
						uni.$emit('returnExpense', true);
						uni.navigateBack();
					} else {
						uni.$u.toast(res.message);
					}
				})
				// this.showDelete = false
				// this.$refs.uToast.show({
				// 	type: 'success',
				// 	message: "删除成功",
				// })
				// uni.navigateTo({
				// 	url: "/pages/workbench/accountingManagement/reimburseManagement/addReimburse"
				// })
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.logo {
		width: 24px;
		height: 24px;
	}

	/deep/.u-navbar__content .u-navbar__content__title {
		color: #fff;
	}

	/deep/.sign-out {
		background: rgba(0, 114, 255, 1);

		.u-line {
			border: none !important;
		}

		.logo {
			width: 18px;
			height: 18px;
		}

		.u-cell__title-text {
			color: #fff;
			font-size: 17px;
		}

		.user-head {
			width: 58px;
			height: 58px;
			border-radius: 4px;
			margin-right: 10px;
		}
	}

	.main-head {
		height: 100px;
		background: rgba(0, 114, 255, 1);

	}

	.main-foot {
		height: 36px;
		background: rgba(0, 114, 255, 1);
		border-radius: 50%;
		margin-top: -18px;
	}

	/deep/.main-crad {
		padding: 0 16px;

		.main-crad-bg {
			background: #fff;
			height: 147px;
			border-radius: 4px;
			margin-top: -118px;
			padding: 16px 0 0 16px;

			.card-name {
				display: block;
				color: rgba(96, 98, 102, 1);
				font-size: 14px;
				line-height: 28px;
			}

			.card-num {
				font-size: 24px;
				line-height: 28px;
				font-weight: bold;
				color: rgba(0, 0, 0, 1);
			}

			.card_title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-right: 35px;
			}

			.u-cell__body {
				padding: 10px 0px 0;
			}

			.u-line {
				border: none !important;
			}

			.u-cell__title-text {
				color: rgba(96, 98, 102, 1);
				font-size: 15px;
			}

			.icon-slot {
				width: 24px;
				height: 24px;
				margin-right: 5px;
			}

			.card-money {
				width: 100px;
				height: 80px;
				display: block;
				float: right;
				position: relative;
				top: -15px;
			}
		}
	}

	/deep/.main-content {
		margin-top: 16px;
		background: #fff;
	}

	.main-card {
		margin-top: 8px;
	}

	/deep/.card-dynamic {
		padding: 0px 16px 0;

		.card-step {
			border-left: 2px solid;
			border-left-color: rgba(0, 114, 255, 1);
			padding: 0 0 8px 16px;

			.dynamic-bg {
				background: #fff;
				border-radius: 4px;

				.u-line {
					border: none !important;
				}

				.text-tag {
					margin-left: 8px;
					font-size: 14px;
					color: rgba(96, 98, 102, 1);
				}

				.u-cell__value {
					color: rgba(192, 196, 204, 1);
				}

				.u-cell__title .u-cell-text {
					font-size: 17px;
					color: rgba(48, 49, 51, 1);
				}

				.u-cell__title-text {
					color: rgba(144, 147, 153, 1);
				}

				.u-text {
					padding: 0 16px;
					width: unset;

					.u-text__value {
						color: rgba(144, 147, 153, 1) !important;
					}
				}
			}
		}

		.spot {
			border-radius: 50%;
			width: 6px;
			height: 6px;
			margin-left: -3px;
			display: block;
			border: 1px solid;
			border-color: rgba(0, 114, 255, 1);
			background: rgba(0, 114, 255, 1);
			float: left;
		}
	}

	.card {
		padding: 8px 0 0;

		.card-pa {
			padding: 16px 16px;
			background: #fff;

			//border-radius: 10px;
			/deep/.u-cell__body {
				padding: 10px 0 0;

				.u-cell__title-text {
					font-size: 16px;
					font-weight: bold;
					color: rgba(48, 49, 51, 1);
				}

				.logo {
					width: 24px;
					height: 24px;
				}
			}

			/deep/.u-line {
				border: none !important;
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
		}

	}

	.cost-card {
		.card-pa {
			padding: 0 16px 16px;
			background: #fff;
			border-top: 1px solid;
			border-top-color: #eee;

			/deep/.u-cell__body {
				padding: 10px 0 0;

				.u-cell__title-text {
					font-size: 16px;
					font-weight: bold;
					color: rgba(48, 49, 51, 1);
				}

				.logo {
					width: 24px;
					height: 24px;
				}
			}

			/deep/.u-line {
				border: none !important;
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
		}

	}





	/deep/ {
		.u-page__item__slot-icon {
			width: 24px;
			height: 24px;
		}

		.u-tabbar-item__text {
			font-size: 12px;

			span {
				//color: rgba(0, 85, 255, 0.8);
			}
		}

		.tab-adopt {
			span {
				color: rgba(0, 114, 255, 1);
				font-weight: bold;
				font-size: 14px;
			}
		}

		.tab-reject {
			span {
				color: rgba(250, 85, 85, 1);
				font-weight: bold;
				font-size: 14px;
			}
		}
	}

	/deep/.u-modal__content__text {
		text-align: center;
	}

	.u-loading-icon {
		margin-top: 30px;
	}

	.invoice-detailed {
		margin-top: 10px;
		
		.invoice-detailed-pa {
			padding: 16px 16px 8px;
			background: #FFFFFF;
		}
		/deep/.uni-container {
			width: 100%;
			height: 100px;
			padding: 10px 16px;
			background: #FFFFFF;
			border-radius: 0px 0px 0px 0px;
			opacity: 1;
			/deep/.uni-table-scroll {
			background: #F7F7F7;

			}
		}

	}
</style>
