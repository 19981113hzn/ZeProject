<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="navbarName" bgColor="rgba(0, 114, 255, 1)" @leftClick="leftClick">
			<view class="u-nav-slot" slot="left">
				<image class="logo" src="/static/img/icon_bark_left.png"></image>
			</view>
		</u-navbar>
		<u-loading-icon v-if="isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<view v-else>
			<view class="main-head"></view>
			<view class="main-foot"></view>
			<view class="main-card">
				<view class="main-crad-bg">
					<u-grid :border="false" col="3">
						<u-grid-item>
							<view class="grid-img">
								<image class="logo" src="/static/img/invoice/fp_fpsm.png"></image>
							</view>
							<text class="grid-text">发票扫码</text>
						</u-grid-item>
						<u-grid-item>
							<view class="grid-img">
								<image class="logo" src="/static/img/invoice/fp_fppz.png"></image>
							</view>
							<text class="grid-text">发票拍照</text>
						</u-grid-item>
						<u-grid-item>
							<view class="grid-img">
								<image class="logo" src="/static/img/invoice/fp_ljsb.png"></image>
							</view>
							<text class="grid-text">链接识别</text>
						</u-grid-item>
					</u-grid>
					<u-grid :border="false" col="2" class="bGrid">
						<u-grid-item>
							<view class="grid-img">
								<image class="logo" src="/static/img/invoice/fp_sdlr.png"></image>
							</view>
							<text class="grid-text">手动录入</text>
						</u-grid-item>
						<u-grid-item>
							<view class="grid-img">
								<image class="logo" src="/static/img/invoice/fp_wzsb.png"></image>
							</view>
							<text class="grid-text">文件识别</text>
						</u-grid-item>
					</u-grid>
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
				navbarName: "我的发票",
			}
		},
		methods: {
			leftClick() {
				uni.navigateBack();
			}
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
			//height: 130px;
			background: #fff;
			border-radius: 8px;
			margin: 0 auto;
			margin-top: -90px;
		}

	}

	/deep/ {
		.u-grid {
			padding: 8px 8px 0px;
		}

		.grid-text {
			font-size: 12px;
			color: rgba(0, 0, 0, 0.65);
			padding: 16px 0 16px 0px;
			/* #ifndef APP-PLUS */
			box-sizing: border-box;
			/* #endif */
		}

		.bGrid {
			justify-content: center !important;
			padding: 0px 8px 8px;

			.u-grid-item {
				width: 32% !important;
			}

		}

		.grid-img {
			width: 28px;
			height: 28px;

			.logo {
				width: 28px;
				height: 28px;
				top: 11px;
			}
		}
	}

	.container-view {
		z-index: 1;
	}
</style>
