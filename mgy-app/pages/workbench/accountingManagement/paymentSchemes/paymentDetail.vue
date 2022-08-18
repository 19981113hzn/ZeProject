<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="付款计划" bgColor="rgba(0, 114, 255, 1)" @leftClick="leftClick">
			<view class="u-nav-slot" slot="left">
				<image class="logo" src="/static/img/icon_bark_left.png"></image>
			</view>
		</u-navbar>
		<u-loading-icon v-if="isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<view v-else>

			<view class="main-head"></view>
			<view class="main-foot"></view>
			<view class="main-card">

				<u-grid :border="false" col="3">
					<u-grid-item customStyle="padding-left:6px; justify-content:center;">
						<text class="grid-text">合同总金额(元)</text>
						<text class="grid-text">￥{{paymentPlanDetails.amount}}</text>
					</u-grid-item>
				</u-grid>
				<u-grid :border="false" col="3" class="bGrid">
					<u-grid-item>
						<text class="grid-text">已付款金额(元)</text>
						<text class="grid-text">{{paymentPlanDetails.payedAmount}}</text>
					</u-grid-item>
					<u-grid-item>
						<text class="grid-text">未付款金额(元)</text>
						<text class="grid-text">{{paymentPlanDetails.unPayAmount}}</text>
					</u-grid-item>
					<u-grid-item>
						<text class="grid-text">逾期付款金额</text>
						<text class="grid-text">{{paymentPlanDetails.exceededAmount}}</text>
					</u-grid-item>
				</u-grid>
			</view>
			<view class="main-content">
				<u-tabs :list="lsyTabs" @click="clickTabs" :scrollable="false" lineWidth="59"></u-tabs>
			</view>

			<view v-if="current==0" style="height: 100%">
				<view class="card">
					<view class="card-pa">
						<u-cell title="基本信息"></u-cell>
						<u--form labelWidth="100">
							<u-form-item label="关联客户">
								<text>{{paymentPlanDetails.customer ? paymentPlanDetails.customer.name : '暂无关联客户'}}</text>
							</u-form-item>
							<u-form-item label="关联合同">
								<text>{{paymentPlanDetails.contractName ? paymentPlanDetails.contractName : '合同标题'}}</text>
							</u-form-item>
							<u-form-item label="总付款期数">
								<text>{{paymentPlanDetails.nums}}期</text>
							</u-form-item>
							<u-form-item label="合同总金额">
								<text>¥ {{paymentPlanDetails.amount}}</text>
							</u-form-item>
							<u-form-item label="已付款金额">
								<text>¥ {{paymentPlanDetails.payedAmount}}</text>
							</u-form-item>
							<u-form-item label="已付款占比">
								<text>{{paymentPlanDetails.payedPercentage}}%</text>
							</u-form-item>
							<u-form-item label="未付款金额">
								<text>￥{{paymentPlanDetails.unPayAmount}}</text>
							</u-form-item>
							<u-form-item label="备注信息">
								<text>-</text>
							</u-form-item>
							<u-form-item label="创建时间">
								<text>{{paymentPlanDetails.createTime}}</text>
							</u-form-item>
							<u-form-item label="更新时间">
								<text>{{paymentPlanDetails.updateTime ? paymentPlanDetails.updateTime : '2019-04-01 17:27:30'}}</text>
							</u-form-item>
						</u--form>
					</view>
				</view>
			</view>
			<view v-if="current==1" style="padding-top: 10px;padding-bottom: 60px;">
				<view class="sjrecord-item" v-for="(item,index) in paymentPlanDetails.paymentPlanItemVOList">
					<view class="card-pa" @click="gotoPaymentRecordDetail(item)">
						<u-cell>
							<view slot="title" style="font-weight: bold;">
								<text>第{{index+1}}期付款计划：</text>
								<text>{{item.payTime}}</text>
							</view>
							<u-tag v-if="item.itemPayedStatus==2" slot="value" text="已完成"
								bgColor="rgba(243, 255, 237, 1)" borderColor="rgba(243, 255, 237, 1)"
								color="rgba(103, 194, 58, 1)" size="mini">
							</u-tag>
							<u-tag v-if="item.itemPayedStatus==1" slot="value" text="未完成"
								bgColor="rgba(241, 245, 250, 1)" borderColor="rgba(241, 245, 250, 1)"
								color="rgba(144, 147, 153, 1)" size="mini">
							</u-tag>
							<u-tag v-if="item.itemPayedStatus==3" slot="value" text="已逾期"
								bgColor="rgba(255, 248, 242, 1)" borderColor="rgba(255, 248, 242, 1)"
								color="rgba(255, 147, 48, 1)" size="mini">
							</u-tag>
						</u-cell>
						<u--form labelWidth="90">
							<u-form-item label="计划付款金额">
								<text>￥{{item.amount}}</text>

							</u-form-item>
							<u-form-item label="已付款金额">
								<text>￥{{item.payedAmount}}</text>
							</u-form-item>
							<u-form-item label="未付款金额">
								<text>￥{{item.itemUnPayAmount}}</text>

							</u-form-item>
						</u--form>

					</view>
				</view>
			</view>
		</view>
		<view class="bottomAction">
			<u-grid :border="false" col="3">
				<u-grid-item @click="gotoSetPayPlan">
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon_edit.png"></image>
					</view>
					<text class="grid-text" style="color:#606266;font-size: 12px;">配置付款计划</text>
				</u-grid-item>
				<u-grid-item @click="addPaymentRecord">
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon_tjhkjl.png"></image>
					</view>
					<text class="grid-text" style="color:#606266;font-size: 12px;">添加付款记录</text>
				</u-grid-item>
				<u-grid-item @click="showDelete=true">
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon_delete.png"></image>
					</view>
					<text class="grid-text" style="color:#606266;font-size: 12px;">删除付款计划</text>
				</u-grid-item>
			</u-grid>
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
		getPaymentPlanItem,
		deleteCashPlan
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				lsyTabs: [{
					name: "资料详情"
				}, {
					name: "付款记录"
				}],
				showDelete: false,
				current: 0,
				paymentId: '',
				nowTime: '',
				lastItemTime: '',
				paymentPlanDetails: {}, //付款计划详情
				cashRecordLists: [], //付款记录
				isLoading: false, //加载中
				pageNo: 1,
				returnPageNumber: 1,
			}
		},
		onLoad(option) {
			console.log(option);
			let detail = uni.getStorageSync("paymentDetails");
			this.paymentId = detail.id
			console.log(this.paymentId);

			this.getDetail();
			// this.getPlanItem();
		},
		onShow() {
			uni.$once('returnPlan', res => {
				if (res) {
					this.pageNo = 1;
					this.getDetail()
					// this.getPlanItem()
				}
			})
			uni.$once('returnPlanItem', res => {
				if (res) {
					this.pageNo = 1;
					this.getDetail()
					// this.getPlanItem()
				}
			})
		},
		methods: {
			// 付款计划详情
			getDetail() {
				let data = '?id=' + this.paymentId
				getPaymentPlanItem(data, res => {
					if (res.code == 200 && res.success) {
						this.paymentPlanDetails = res.result
						console.log(this.paymentPlanDetails);
					} else {
						uni.$u.toast(res.message);
					}
				})
			},

			// 配置付款计划
			gotoSetPayPlan() {
				uni.setStorageSync('setPlanContent', this.paymentPlanDetails)
				uni.setStorageSync('setPlanItem', this.paymentPlanDetails.paymentPlanItemVOList)
				uni.navigateTo({
					url: '/pages/workbench/accountingManagement/paymentSchemes/addPaymentPlan?editId=' + this
						.paymentId
				})
			},
			// 添加付款记录
			addPaymentRecord() {
				uni.navigateTo({
					url: '/pages/workbench/accountingManagement/paymentManagement/addPaymentRecord?returnPageNumber=2'
				})
			},
			// 删除付款计划
			confirmDelete() {
				let data = '?id=' + this.paymentId
				deleteCashPlan(data, res => {
					if (res.code == 200 && res.success) {
						this.showDelete = false
						this.$refs.uToast.show({
							type: 'success',
							message: "删除成功",
						})
						uni.$emit('returnCollection', true);
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/workbench/accountingManagement/cashtransferSchemes/cashtransferSchemes"
							})
							// uni.navigateBack({
							// 	delta: 1
							// })
						}, 800)
					} else {
						uni.$u.toast(res.message);
					}

				})
			},

			// 付款计划详情
			gotoPaymentRecordDetail(item) {
				console.log(item);
				uni.setStorageSync('paymentPlanItems', item.paymentPlanManageVoList)
				uni.navigateTo({
					url: '/pages/workbench/accountingManagement/paymentSchemes/paymentRecordDetail?Id=' +
						item.id

				})
			},

			//返回上一级
			leftClick() {
				uni.redirectTo({
					url: "/pages/workbench/accountingManagement/paymentSchemes/paymentSchemes"
				});
			},
			clickTabs(item) {
				this.current = item.index
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
			width: 36px;
			height: 36px;
			border-radius: 4px;
			margin-right: 10px;
		}
	}

	.main-head {
		height: 80px;
		background: rgba(0, 114, 255, 1);

	}

	.main-foot {
		height: 36px;
		background: rgba(0, 114, 255, 1);
		border-radius: 50%;
		margin-top: -18px;
	}

	/deep/.main-card {
		width: 96%;
		height: 130px;
		background: #fff;
		border-radius: 8px;
		margin: 0 auto;
		margin-top: -90px;

		.card_title {
			display: flex;
			flex-direction: column;
			// align-items: center;
			// justify-content: center;
			text-align: left;
			padding-left: 60rpx;
			padding-top: 30rpx;
		}

	}

	/deep/.main-content {
		margin-top: 16px;
		background: #fff;
	}

	/deep/ {
		.u-grid {
			padding-top: 0px;
			text-align: center;
		}

		.grid-text {
			padding: 20rpx 0 20rpx 0rpx;
			font-weight: bold;
			font-size: 16px;
			color: #000;
			/* #ifndef APP-PLUS */
			box-sizing: border-box;
			/* #endif */
		}
	}

	.u-grid-item .grid-text:nth-child(1) {
		color: #909399;
		font-size: 12px;
		padding-bottom: 0;
	}

	.u-grid-item .grid-text:nth-child(2) {
		padding-top: 5px;
		color: #303133;
		font-size: 16px;
	}

	.card {
		padding: 15px 0 0;
		background: #fff;
		// margin-bottom: 8px;

		.card-pa {
			padding: 0 16px 50px;
			background: #fff;
			height: 470px;
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

	.sjrecord-item {
		width: 92%;
		margin: 0 auto;
		background: #fff;
		border-radius: 8px;
		margin-bottom: 8px;
		box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.0800);

		.card-pa {
			border-radius: 8px;
			padding: 0 16px 16px;
			background: #fff;

			//border-radius: 10px;
			/deep/.u-cell__body {
				padding: 10px;
				padding-left: 0;

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

	/deep/ .cpRecord {
		.u-cell__body {
			padding-left: 0px !important;
		}
	}

	.prod-item {
		padding: 16px;
		padding-bottom: 0px;
		background: #fff;

		.prod-title {
			margin-bottom: 12px;
			padding-left: 10px;
			font-size: 15px;
			font-weight: bold;
			color: #303133;
			position: relative;

			&::before {
				content: "";
				width: 4px;
				height: 13px;
				background: #0072FF;
				border-radius: 3px 3px 3px 3px;
				opacity: 1;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				left: 0px;
			}
		}

		.cell-title {
			font-size: 14px;
			color: #747988;
			margin-right: 16px;
		}

		.cell-value {
			color: #303133;
			font-size: 14px;
		}
	}

	.bottomAction {
		box-sizing: border-box;
		background: #fff;
		width: 100%;
		// height: 59px;
		padding: 15px 0;
		position: fixed;
		left: 0;
		bottom: 0px;
		font-weight: normal !important;
		border-top: 1px solid #eee;

		image {
			width: 24px;
			height: 24px;
		}
	}

	/deep/ {
		.bGrid {
			justify-content: center !important;

			.u-grid-item {
				width: 32% !important;
			}
		}

		.grid-img {
			width: 24px;
			height: 24px;

			.logo {
				width: 24px;
				height: 24px;
				top: 11px;
			}
		}

		.u-grid {
			padding-top: 0px;
		}

		.grid-text {
			font-size: 12px;
			color: #606266;
			padding: 20rpx 0 20rpx 0rpx;
			/* #ifndef APP-PLUS */
			box-sizing: border-box;
			/* #endif */
		}
	}

	.logo-max {
		width: 24px;
		height: 24px;
	}
</style>
