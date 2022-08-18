<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="navbarName" bgColor="rgba(0, 114, 255, 1)" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="left">
				<image class="logo" src="/static/img/icon_bark_left.png"></image>
			</view>
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon／edit.png"></image>
			</view>
		</u-navbar>
		<u-loading-icon v-if="isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<view v-else>
			<view class="card">
				<view class="main-head"></view>
				<view class="main-foot"></view>
				<view class="main-card">
					<view class="main-crad-bg">
						<view class="card-pa">
							<text class="card-title">{{riseDetails.customerName || '---'}}</text>
							<u--form class="card-content-pa" labelWidth="95">
								<u-form-item label="抬头类型">
									<text>{{riseDetails.type_dictText || '---'}}</text>
								</u-form-item>
								<u-form-item label="抬头名称">
									<text>{{riseDetails.customerName || '---'}}</text>
								</u-form-item>
								<u-form-item label="所属客户">
									<text>{{riseDetails.customerName || '---'}}</text>
								</u-form-item>
								<u-form-item label="纳税人识别号">
									<text>{{riseDetails.taxpayerNumber || '---'}}</text>
								</u-form-item>
								<u-form-item label="单位地址">
									<text>{{riseDetails.address || '---'}}</text>
								</u-form-item>
								<u-form-item label="电话">
									<text>{{riseDetails.phone || '---'}}</text>
								</u-form-item>
								<u-form-item label="开户行">
									<text>{{riseDetails.bank || '---'}}</text>
								</u-form-item>
								<u-form-item label="银行账号">
									<text>{{riseDetails.bankAccount || '---'}}</text>
								</u-form-item>
								<u-form-item label="邮箱">
									<text>{{riseDetails.email || '---'}}</text>
								</u-form-item>
								<u-form-item label="备注">
									<text>{{riseDetails.remark || '---'}}</text>
								</u-form-item>
							</u--form>
							<!-- <image src="/static/img/workbench/riseerweima.png" class="rideImage"></image> -->
							<view style="padding: 40px 30px 16px;">
								<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="复制抬头信息" @click="saveCost">
								</u-button>
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				navbarName: "抬头详情",
				riseDetails: {},
			}
		},

		onLoad(option) {
			console.log(option)
			this.riseDetails = uni.getStorageSync("riseDetails");
			// this.getData();

		},
		methods: {
			leftClick() {
				uni.navigateBack();
			},
			rightClick() {
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/invoiceManagement/myRise/addRise?isUpdate=true&returnPageNumber=1"
				})
			},
			//复制表单内容到剪切板
			saveCost() {
				this.copyText = "抬头类型     " + this.riseDetails.type_dictText +
					"      抬头名称      " + this.riseDetails.customerName +
					"      所属客户      " + this.riseDetails.customerName +
					"      纳税人识别号      " + this.riseDetails.taxpayerNumber +
					"      单位地址      " + this.riseDetails.address +
					"      电话      " + this.riseDetails.phone +
					"      开户行      " + this.riseDetails.bank +
					"      银行账号      " + this.riseDetails.bankAccount +
					"      邮箱      " + this.riseDetails.email +
					"      备注      " + this.riseDetails.remark;
				uni.setClipboardData({
					data: this.copyText || this.text, //要保存的内容
					success: function() {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				});
			},
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #E7F3FF;
	}

	.logo {
		width: 24px;
		height: 24px;
	}

	/deep/.u-navbar__content .u-navbar__content__title {
		color: #fff;
	}

	.u-page__item__slot-icon {
		width: 24px;
		height: 24px;
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
		padding: 0 16px;

		.main-crad-bg {
			background: #fff;
			border-radius: 8px;
			margin: 0 auto;
			margin-top: -85px;
			padding: 24px;

			.card-pa {
				padding: 0 16px 16px;
				background: #fff;

				.card-title {
					font-size: 21px !important;
					font-family: PingFang SC-Bold;
					color: #2A2B2D;
					height: 58px;
					margin-bottom: 17px !important;
				}

				.card-content-pa {
					margin-top: 16px;

					// /deep/.u-form-item {
					// 	font-size: 20px !important;

					// 	/deep/.u-form-item__body {
					// 		font-size: 20px !important;
					// 		padding: 17px 24px 0;

					// 		/deep/.u-cell__body {
					// 			padding: 10px 0 0;
					// 			font-size: 20px;

					// 			.u-cell__title-text {
					// 				font-size: 20px;
					// 				font-weight: bold;
					// 				color: rgba(48, 49, 51, 1);
					// 			}

					// 			.logo {
					// 				width: 24px;
					// 				height: 24px;
					// 			}
					// 		}
					// 	}
					// }
					// /deep/.u-line {
					// 	border: none !important;
					// }
					/deep/.u-form-item {
						/deep/.u-form-item__body {
							padding: 10px 0 0;

							/deep/.u-form-item__body__left__content__label {
								font-size: 20px;
								color: rgba(116, 121, 136, 1);
							}

							/deep/.u-form-item__body__right__content__slot {
								font-size: 22px;
								color: rgba(48, 49, 51, 1);
							}
						}
					}
				}

				// /deep/.u-cell__body {
				// 	padding: 10px 0 0;
				// 	font-size: 20px;

				// 	.u-cell__title-text {
				// 		font-size: 20px;
				// 		font-weight: bold;
				// 		color: rgba(48, 49, 51, 1);
				// 	}

				// 	.logo {
				// 		width: 24px;
				// 		height: 24px;
				// 	}
				// }

				// /deep/.u-line {
				// 	border: none !important;
				// }

				// /deep/.u-form-item__body {
				// 	padding: 10px 0 0;

				// 	.u-form-item__body__left__content__label {
				// 		font-size: 22px;
				// 		color: rgba(116, 121, 136, 1);
				// 	}

				// 	.u-form-item__body__right__content__slot {
				// 		font-size: 22px;
				// 		color: rgba(48, 49, 51, 1);
				// 	}
				// }
			}
		}

	}
</style>
