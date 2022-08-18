<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="paymentDetails.contractName ? paymentDetails.contractName : '合同标题'"
			bgColor="rgba(0, 114, 255, 1)" @leftClick="leftClick">
			<view class="u-nav-slot" slot="left">
				<image class="logo" src="/static/img/icon_bark_left.png"></image>
			</view>
		</u-navbar>
		<!-- <u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon> -->
		<view>
			<u-cell-group class="sign-out" :border="false">
				<u-cell :title="paymentDetails.createBy + '的付款申请'" size="large">
					<!-- <image class="user-head" slot="icon" src="/static/img/icon_user_default.png"></image> -->
					<image class="user-head" slot="icon" src="https://cdn.uviewui.com/uview/album/1.jpg"></image>
					<u-tag v-if="paymentDetails.status==3" slot="value" text="已通过" bgColor="rgba(247, 252, 244, 1)"
						borderColor="rgba(247, 252, 244, 1)" color="rgba(103, 194, 58, 1)" size="mini">
					</u-tag>
					<u-tag v-if="paymentDetails.status==1 || paymentDetails.status==2" slot="value" text="待审批"
						bgColor="rgba(235, 244, 255, 1)" borderColor="rgba(235, 244, 255, 1)"
						color="rgba(0, 114, 255, 1)" size="mini">
					</u-tag>
					<u-tag v-if="paymentDetails.status==5" slot="value" text="被驳回" bgColor="rgba(255, 248, 242, 1)"
						borderColor="rgba(255, 248, 242, 1)" color="rgba(255, 147, 48, 1)" size="mini">
					</u-tag>
					<u-tag v-if="paymentDetails.status==6" slot="value" text="已撤销" bgColor="rgba(241, 245, 250, 1)"
						borderColor="rgba(241, 245, 250, 1)" color="rgba(144, 147, 153, 1)" size="mini">
					</u-tag>
				</u-cell>
			</u-cell-group>
			<view class="main-head"></view>
			<view class="main-foot"></view>
			<view class="main-crad">
				<view class="main-crad-bg">
					<image class="card-money" src="/static/img/workbench/icon_collection.png"></image>
					<text class="card-name">付款金额</text>
					<text class="card-num">¥ {{paymentDetails.amount}}</text>
					<u-cell :title="paymentDetails.contractName ? paymentDetails.contractName : '合同标题'">
						<image class="icon-slot" slot="icon" src="/static/img/workbench/icon_title.png"></image>
					</u-cell>
					<view class="card_title">
						<u-cell>
							<text slot="title">{{paymentDetails.period}}期(共{{paymentDetails.nums}}期)</text>
							<image class="icon-slot" slot="icon" src="/static/img/workbench/icon_periods.png"></image>
						</u-cell>
						<u-cell :title="paymentDetails.time ? paymentDetails.time : '2022-08-06'">
							<image class="icon-slot" slot="icon" src="/static/img/workbench/icon_plantime.png"></image>
						</u-cell>
					</view>

				</view>
			</view>
			<!-- <view class="main-content">
				<u-tabs :list="lsyTabs" @click="clickTabs" :scrollable="false" lineWidth="59"></u-tabs>
			</view> -->
			<view>
				<view>
					<view class="card">
						<view class="card-pa">
							<u-cell title="基本信息"></u-cell>
							<u--form labelWidth="100">
								<u-form-item label="付款日期">
									<text>{{paymentDetails.time ? paymentDetails.time : '2022-08-06'}}</text>
								</u-form-item>
								<u-form-item label="付款金额">
									<text>￥{{paymentDetails.amount}}</text>
								</u-form-item>
								<u-form-item label="关联客户">
									<text
										style="color: #0072FF;">{{paymentDetails.customerName ? paymentDetails.customerName : '-'}}</text>
								</u-form-item>
								<u-form-item label="关联合同">
									<text
										style="color: #0072FF;">{{paymentDetails.contractName ? paymentDetails.contractName : '-'}}</text>
								</u-form-item>
								<u-form-item label="付款期次">
									<text>{{paymentDetails.period}}期(共{{paymentDetails.nums}}期)</text>
								</u-form-item>
								<u-form-item label="付款计划">
									<text style="color: #0072FF;" @click="seePlan">查看计划</text>
								</u-form-item>
								<u-form-item label="付款方式">
									<text>{{paymentDetails.payTypeName}}</text>
								</u-form-item>
								<u-form-item label="逾期状态">
									<text>{{paymentDetails.overdueStatusName}}</text>
								</u-form-item>
								<u-form-item label="发票信息">
									<text>{{paymentDetails.invoiceName ? paymentDetails.invoiceName : '-'}}</text>
								</u-form-item>
								<u-form-item label="付款所属人员">
									<text>{{paymentDetails.userName ? paymentDetails.userName : '赵小刚'}}</text>
								</u-form-item>
								<u-form-item label="创建人员">
									<text>{{paymentDetails.createBy ? paymentDetails.createBy : '赵小刚'}}</text>
								</u-form-item>
							</u--form>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottomAction">
			<!-- 被驳回、已撤销 -->
			<u-grid customStyle="border-top: 1px solid #eee; padding-top: 10px"
				v-if="paymentDetails.status==5 || paymentDetails.status==6" :border="false" col="3">
				<u-grid-item @click="editPayment">
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon_planedit.png"></image>
					</view>
					<text class="grid-text" style="color:#606266;font-size: 12px;">编辑付款单</text>
				</u-grid-item>
				<u-grid-item @click="submitPayment">
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon_tjsp.png"></image>
					</view>
					<text class="grid-text" style="color:#606266;font-size: 12px;">提交审批</text>
				</u-grid-item>
				<u-grid-item @click="deleteRecord">
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon_plandelete.png"></image>
					</view>
					<text class="grid-text" style="color:#606266;font-size: 12px;">删除付款单</text>
				</u-grid-item>
			</u-grid>

			<!-- 待审批 -->
			<u-grid customStyle="border-top: 1px solid #eee; padding-top: 10px"
				v-if="paymentDetails.status==1 || paymentDetails.status==2" :border="false" col="1">
				<u-grid-item @click="revokeApproval">
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon_cshk.png"></image>
					</view>
					<text class="grid-text" style="color:#606266;font-size: 12px;">撤销审批</text>
				</u-grid-item>
			</u-grid>

			<!-- 已通过, 不能操作 -->
			<!-- <u-grid v-if="paymentDetails.status==3" :border="false" col="1">
				<u-grid-item @click="deleteRecord">
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon_planedit.png"></image>
					</view>
					<text class="grid-text" style="color:#606266;font-size: 12px;">删除记录</text>
				</u-grid-item>
			</u-grid> -->
			<!-- 代办 -->
			<u-tabbar v-if="isNeedWith">
				<u-tabbar :fixed="true" :placeholder="true" @change="changeTabbar">
					<u-tabbar-item text="通过">
						<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_adopt.png">
						</image>
					</u-tabbar-item>
					<u-tabbar-item class="tab-reject" text="驳回">
						<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_reject.png">
						</image>
					</u-tabbar-item>
				</u-tabbar>
			</u-tabbar>
		</view>


		<!-- <u-tarbar class="bottom">
			<u-tabbar :fixed="true" :placeholder="true" @change="changeTabbar">
				<u-tabbar-item v-if="isNeedWith"  text="通过">
					<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_adopt.png">
					</image>
				</u-tabbar-item>
				<u-tabbar-item v-if="isNeedWith" class="tab-reject" text="驳回">
					<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_reject.png">
					</image>
				</u-tabbar-item>
			</u-tabbar>
		</u-tarbar> -->
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
		getPaymentItem,
		deletePaymentRecord,
		editPayment,
		getProcessStartVariablesByBizCode,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				lsyTabs: [{
					name: "报销动态"
				}, {
					name: "资料详情"
				}, {
					name: "费用信息"
				}],
				paymentItemId: '',
				showDelete: false,
				numTabbar: "",
				procInstId: "",
				reimbursId: "",
				current: 0,
				paymentDetails: {},
				lstdynamic: [],
				isLoading: false, //加载中
				isNeedWith: false, //是否待办进来的页面
				isDonedWith: false, //是否已办进来的页面
				lstActiviti: [],
			}
		},
		onLoad(option) {
			console.log(option)
			let detail = uni.getStorageSync("paymentItem");
			this.paymentItemId = detail.id
			let isNeedWith = isEmpty(option.isNeedWith) ? false : option.isNeedWith;
			let isDonedWith = isEmpty(option.isDonedWith) ? false : option.isDonedWith;
			this.isNeedWith = isNeedWith
			this.isDonedWith = isDonedWith
			// let detail = uni.getStorageSync("reimbursDetails");
			// this.procInstId = detail.procInstId
			// this.reimbursId = detail.id
			// this.createTime=detail.createTime
			this.getData();

		},
		methods: {
			isWhether(value) {
				return isEmpty(value)
			},

			getData() {
				this.isLoading = false;
				let data = '?id=' + this.paymentItemId
				getPaymentItem(data, res => {
					if (res.code == 200 && res.success) {
						this.paymentDetails = res.result
						uni.setStorageSync("editItem", this.paymentDetails)
						console.log(this.paymentDetails);
						// if (this.paymentDetails.status == 6 || this.paymentDetails.status == 5) {
						// 	this.getStartVariables();
						// }
						// this.getTrace()
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			// 流程接口
			getStartVariables() {
				getProcessStartVariablesByBizCode("COLLECTION ", res => {
					if (res.code == 200 && res.success) {
						console.log(res.result);
						for (let i = 0; i < res.result.length; i++) {
							let item = res.result[i]
							let info = {
								variableName: item.variableName,
								variableValue: item.variableType,
								variableNameCn: item.variableNameCn
							}
							this.lstActiviti.vars.push(info)
						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},

			// 查看计划
			seePlan() {
				uni.navigateTo({
					url: '/pages/workbench/accountingManagement/paymentSchemes/paymentSchemes'
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

			// 撤销审批
			revokeApproval() {
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=1&collectionId=" +
						this.paymentItemId
				})
			},

			// 编辑付款单
			editPayment() {
				uni.setStorageSync("lstActiviti", this.lstActiviti)
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/paymentManagement/addPaymentRecord?editPaymentId=" +
						this.paymentItemId
				})
			},

			// 提交审批
			submitPayment() {
				let detail = uni.getStorageSync("editItem");
				detail.vars = this.lstActiviti
				editPayment(detail, res => {
					if (res.code == 200 && res.success) {
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
			},
			// 删除付款单
			deleteRecord() {
				let data = '?id=' + this.paymentItemId
				deletePaymentRecord(data, res => {
					if (res.code == 200 && res.success) {
						this.showDelete = false
						this.$refs.uToast.show({
							type: 'success',
							message: "删除成功",
						})
						uni.$emit('returnRecord', true);
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/workbench/accountingManagement/paymentManagement/paymentManagement"
							})
						}, 800)
					} else {
						uni.$u.toast(res.message);
					}

				})
			},
			// 通过、驳回
			changeTabbar(name) {
				if (name == 0) { //待办 通过
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=3&procInstId=" +
							this.paymentItemId
					})
				}
				if (name == 1) { //待办 驳回
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=2&procInstId=" +
							this.paymentItemId
					})
				}
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
			// height: 147px;
			border-radius: 4px;
			margin-top: -118px;
			padding: 16px 0 18px 16px;

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
		padding: 15px 0 0;

		.card-pa {
			padding: 0 16px 50px;
			background: #fff;
			height: 420px;
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



	.bottomAction {
		box-sizing: border-box;
		background: #fff;
		width: 100%;
		height: 80px;
		// line-height: 65px;
		padding: 15px 0;
		position: fixed;
		left: 0;
		bottom: 0px;
		font-weight: normal !important;

		image {
			width: 24px;
			height: 24px;
		}

		/deep/.u-tabbar__content {
			padding: 18px 0;
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
	}



	/deep/.u-modal__content__text {
		text-align: center;
	}

	.u-loading-icon {
		margin-top: 30px;
	}
</style>
