<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="第1期付款计划" @leftClick="leftClick"></u-navbar>
		<!-- <u-cell-group class="sign-out" :border="false">
			<u-cell title="赵小刚" size="large">
				<image class="user-head" slot="icon" src="/static/img/icon_user_default.png"></image>
				<u-tag slot="value" text="已通过" bgColor="rgba(247, 252, 244, 1)" borderColor="rgba(247, 252, 244, 1)"
					color="rgba(103, 194, 58, 1)" size="mini">
				</u-tag>
				<u-tag v-if="detail.status==3" slot="value" text="已通过" bgColor="rgba(247, 252, 244, 1)"
					borderColor="rgba(247, 252, 244, 1)" color="rgba(103, 194, 58, 1)" size="mini">
				</u-tag>
				<u-tag v-if="detail.status==1" slot="value" text="待审批" bgColor="rgba(235, 244, 255, 1)"
					borderColor="rgba(235, 244, 255, 1)" color="rgba(0, 114, 255, 1)" size="mini">
				</u-tag>
				<u-tag v-if="detail.status==5" slot="value" text="被驳回" bgColor="rgba(255, 248, 242, 1)"
					borderColor="rgba(255, 248, 242, 1)" color="rgba(255, 147, 48, 1)" size="mini">
				</u-tag>
				<u-tag v-if="detail.status==6" slot="value" text="已撤销" bgColor="rgba(241, 245, 250, 1)"
					borderColor="rgba(241, 245, 250, 1)" color="rgba(144, 147, 153, 1)" size="mini">
				</u-tag>
			</u-cell>
		</u-cell-group> -->
		<!-- <u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon> -->
		<view v-if="paymentRecordLists">
			<view class="card" v-for="(item, index) in paymentRecordLists" :key="index">
				<view class="card-pa">
					<u-cell-group :border="true">
						<u-cell :title="item.user.name ? item.user.name : '赵小刚'">
							<image class="user-head" slot="icon" src="/static/img/icon_user_default.png"></image>
							<u-tag v-if="item.status==3" slot="value" text="已通过" bgColor="rgba(247, 252, 244, 1)"
								borderColor="rgba(247, 252, 244, 1)" color="rgba(103, 194, 58, 1)" size="mini">
							</u-tag>
							<u-tag v-if="item.status==1 || item.status==2" slot="value" text="待审批"
								bgColor="rgba(235, 244, 255, 1)" borderColor="rgba(235, 244, 255, 1)"
								color="rgba(0, 114, 255, 1)" size="mini">
							</u-tag>
							<u-tag v-if="item.status==5" slot="value" text="被驳回" bgColor="rgba(255, 248, 242, 1)"
								borderColor="rgba(255, 248, 242, 1)" color="rgba(255, 147, 48, 1)" size="mini">
							</u-tag>
							<u-tag v-if="item.status==6" slot="value" text="已撤销" bgColor="rgba(241, 245, 250, 1)"
								borderColor="rgba(241, 245, 250, 1)" color="rgba(144, 147, 153, 1)" size="mini">
							</u-tag>
						</u-cell>

					</u-cell-group>

					<view class="record_detail">
						<u-row>
							<u-col span="20">
								<u--form labelWidth="65">
									<u-row>
										<u-col span="4.5">
											<u-form-item label="付款金额:">
												<text>￥{{item.amount}}</text>
											</u-form-item>
										</u-col>
										<u-col span="12">
											<u-form-item label="付款方式:">
												<text v-if="item.payType == 1">对公账户</text>
												<text v-if="item.payType == 2">对私账户</text>
												<text v-if="item.payType == 3">现金</text>
											</u-form-item>
										</u-col>
									</u-row>
									<u-row>
										<u-col span="4.5">
											<u-form-item label="审批状态:">
												<text v-if="item.status==3">已通过</text>
												<text v-if="item.status==1 || item.status==2">待审核</text>
												<text v-if="item.status==5">被驳回</text>
												<text v-if="item.status==6">已撤销</text>
											</u-form-item>
										</u-col>
										<u-col span="12">
											<u-form-item label="备注:" labelWidth="40">
												<text>{{item.remark}}</text>
											</u-form-item>
										</u-col>
									</u-row>
								</u--form>
							</u-col>
						</u-row>
					</view>

				</view>
			</view>
			<view class="initLoading">
				<u-loading-icon v-if="isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
			</view>
			<!-- <u-loadmore v-if="isShowLoadMore" :status="queryPageStatus" :loading-text="loadingText"
				:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" /> -->
		</view>
		<view v-if="paymentRecordLists == null" class="sjd-prod">
			<view class="prod-null">
				<image class="no-logo" src="/static/img/workbench/icon_PDF.png">
				</image>
				<view class="no-text">暂无记录</view>
				<u-button type="primary" size="small" text="去添加" @click="gotoAddPayment" shape="circle" color="#0072FF"
					customStyle="width:104px;height:38px;color:#fff;font-size:16px;"></u-button>
			</view>
		</view>
		<!-- <u-modal :show="showDelete" title="删除确认" content='确定要删除该条记录吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal> -->
		<!-- <u-toast ref="uToast"></u-toast> -->
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getCollectionList,
		getDictItemsByCode
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				showDelete: false,
				numTabbar: "",
				procInstId: "",
				paymentId: "",
				paymentRecordLists: [],
				current: 0,
				listTabs: [{
						name: '详情'
					},
					{
						name: '记录'
					}
				],
				lstdynamic: [],
				isLoading: false, //加载中
				showDetail: true

			}
		},
		onLoad(option) {
			this.paymentId = option.Id
			let data = uni.getStorageSync('paymentPlanItems')
			this.paymentRecordLists = data
			console.log(this.paymentRecordLists);
			this.getDictItems()
			// this.getCollection()
		},
		methods: {
			//获取付款记录详情列表
			// getCollection() {
			// 	let data = '?planItemId=' + this.paymentId
			// 	getCollectionList(data, res => {
			// 		if (res.code == 200 && res.success) {
			// 			this.paymentRecordLists = res.result.records
			// 			console.log(this.paymentRecordLists);
			// 		} else {
			// 			uni.$u.toast(res.message);
			// 		}
			// 	})
			// },

			// 付款方式字典查询
			getDictItems() {
				let data = "?dictCode=" + "pay_type"
				getDictItemsByCode(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res.result);

					} else {
						uni.$u.toast(res.message);
					}
					console.log(res)
				})
			},
			// 添加付款记录
			gotoAddPayment() {
				uni.redirectTo({
					url: "/pages/workbench/accountingManagement/paymentManagement/addPaymentRecord?returnPageNumber=3"
				})
			},

			// 返回上一级
			leftClick() {
				uni.redirectTo({
					url: "/pages/workbench/accountingManagement/paymentSchemes/paymentDetail"
				})
				//uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.header {
		background: #fff;
		font-size: 12px;
		// color: #eee;
		margin-bottom: 12px;
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
		padding-top: 15px;
	}


	/deep/.u-navbar__content .u-navbar__content__title {
		color: #000;
	}

	.main-card {
		// padding: 0 15px;

		// margin-top: 8px;
		.card-title {
			padding: 10px 15px;
		}

		.form_content {
			background-color: #fff;
			padding: 0 15px;
			// text-align: right;
		}

		/deep/.content {
			// display: flex;
			// flex-direction: column;
			// justify-content: center;
			// align-items: space-between;
			// .u-form-item__body {
			// 	display: inline-flex;
			// }

			.u-form-item__body__left__content {
				// flex: 1;
			}

			.u-form-item__body__right__content {
				// text-align-last: justify;
				// width: 300px;
			}
		}


	}

	.card {
		padding: 8px 16px 0 16px;

		.card-pa {
			padding: 0 16px 0s;
			background: #fff;
			border-radius: 10px;

			.user-head {
				width: 36px;
				height: 36px;
				border-radius: 4px;
				margin-right: 10px;
			}

			.record_detail {
				padding: 0 16px 20px;
			}

			/deep/.u-line {
				border: none !important;
			}

			/deep/.u-cell__body {
				// padding: 10px 0px;


				.u-cell__title-text {
					font-size: 16px;
					font-weight: bold;
					color: rgba(48, 49, 51, 1);
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

	.sjd-prod {
		// background: #F1F3F6;

		.prod-null {
			padding-top: 30%;
			// padding-bottom: 30px;

			.no-logo {
				display: block;
				width: 84px;
				height: 84px;
				margin: 0 auto;
			}

			.no-text {
				color: rgba(96, 98, 102, 0.6);
				font-size: 15px;
				text-align: center;
				margin-bottom: 20px;
				padding-top: 20px;
			}
		}
	}
</style>
