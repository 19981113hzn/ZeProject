<template>
	<view>
		<u-navbar leftIcon="" title="档案" :border="true" bgColor="#E7F3FF"></u-navbar>
		<view class="main-top">
			<view class="card">
				<view class="card-bg">
					<view class="card-pa">
						<u-cell title="基本资料"></u-cell>
						<view>
							<u-grid :border="false" col="4" @click="clickGrid">
								<u-grid-item v-for="(listItem,listIndex) in listBasic" :key="listIndex">
									<u--image :src="listItem.src" width="46px" height="46px"></u--image>
									<text class="grid-text">{{listItem.title}}</text>
								</u-grid-item>
							</u-grid>
						</view>
					</view>

				</view>
			</view>
			<view class="card">
				<view class="card-bg">
					<view class="card-pa">
						<u-cell title="文档中心"></u-cell>
						<view>
							<u-grid :border="false" col="4" @click="clickGridFile">
								<u-grid-item v-for="(listItem,listIndex) in listFile" :key="listIndex">
									<u--image :src="listItem.src" width="46px" height="46px"></u--image>
									<text class="grid-text">{{listItem.title}}</text>
								</u-grid-item>
							</u-grid>
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
				listBasic: [{
						src: '/static/img/assist/icon_assist_product.png',
						//src: '/static/img/assist/icon_assist_product_false.png',
						title: '产品档案'
					},
					{
						src: '/static/img/assist/icon_supplier.png',
						title: '供应商'
					},
					{
						src: '/static/img/assist/icon_competitor.png',
						title: '竞争对手'
					},
					{
						src: '/static/img/assist/icon_customer.png',
						title: '客户管理'
					}
				],
				listFile: [{
						src: '/static/img/assist/icon_list.png',
						title: '文档管理'
					},
					{
						// src: '/static/img/assist/icon_file.png',
						src: '/static/img/assist/icon_file_false.png',
						title: '文档申请'
					},
				]
			}
		},
		methods: {
			clickGrid(name) {
				switch (name) {
					case 0:
						uni.navigateTo({
							url: "/pages/product/index"
						})
						break;
					case 1:
						uni.navigateTo({
							url: "/pages/supplier/index"
						})
						break;
					case 2:
						uni.navigateTo({
							url: "/pages/competitor/index"
						})

						break;
					case 3: //客户档案
						uni.navigateTo({
							url: "/pages/assist/customerManagement/customerManagement"
						})
						break;
					default:
						break;
				}
			},
			clickGridFile(name) {
				switch (name) {
					case 0:
						uni.navigateTo({
							url: "/pages/assist/documentManagement/documentManagement"
						})
						break;
					default:
						break;
					case 2:
						uni.navigateTo({
							url: "/pages/competitor/index"
						})
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
	.main-top {
		margin: 42px auto 0 auto;
	}

	.card {
		padding: 16px 16px 0 16px;

		.card-bg {
			width: 100%;
			// height: 150px;
			// border: 1px solid;
			// border-color: rgba(0, 0, 0, 0.05);
			border-radius: 10px;
			background: #fff;

			.card-pa {
				padding: 0 16px 10px;

				/deep/.u-cell__body {
					padding: 10px 0px;

					.u-cell__title-text {
						font-size: 16px;
						color: rgba(0, 0, 0, 0.85);
					}
				}

				/deep/.u-grid {
					margin-top: 16px;
				}

				.grid-text {
					font-size: 12px;
					color: rgba(0, 0, 0, 0.65);
					padding: 10rpx 0 20rpx 0rpx;
					/* #ifndef APP-PLUS */
					box-sizing: border-box;
					/* #endif */
				}
			}
		}
	}
</style>
