<template>
	<view class="main">
		<u-navbar leftIcon="" rightIcon="setting" @rightClick="rightClick" bgColor="#fff"></u-navbar>
		<view class="main-top">
			<u-cell-group :border="false" class="head-group">
				<u-cell :title="userInfo.realname" isLink :label="userInfo.post" :border="false"
					url="/pages/personalCenter/personalHome">
					<u--image class="head-img" slot="icon" src="https://cdn.uviewui.com/uview/album/1.jpg"
						shape="square" radius="8px" width="78px" height="78px"></u--image>
				</u-cell>
			</u-cell-group>
			<u-cell-group class="sign-out" :border="false">
				<u-cell title="我的文档" isLink size="large">
					<!-- <u-icon slot="icon" size="18" name="setting"></u-icon> -->
					<u-icon slot="icon" size="18" name="error-circle"></u-icon>
				</u-cell>
				<u-cell title="企业信息" isLink size="large">
					<!-- <u-icon slot="icon" size="18" name="setting"></u-icon> -->
					<u-icon slot="icon" size="18" name="error-circle"></u-icon>
				</u-cell>
			</u-cell-group>
			<u-cell-group class="body-group" :border="false">
				<u-cell title="意见反馈" isLink size="large" url="/pages/personalCenter/feedBack">
					<!-- <u-icon slot="icon" size="18" name="setting"></u-icon> -->
					<!-- <u-icon slot="icon" size="18" name="error-circle"></u-icon> -->
				</u-cell>
				<u-cell title="关于应用" isLink size="large">
					<u-icon slot="icon" size="18" name="error-circle"></u-icon>
				</u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '/static/img/bg_home.png',
				tabbarNum: 0,
				userInfo: getApp().globalData.userInfo,
			}
		},
		created() {
			this.userInfo = getApp().globalData.userInfo;
		},
		methods: {
			change1(name) {
				this.tabbarNum = name
			},
			rightClick() {
				uni.navigateTo({
					url: "/pages/personalCenter/accountSettings/accountSettings"
				})

			},
			// toFeedBack() {
			// 	uni.navigateTo({
			// 		url: "./feedBack"
			// 	})
			// }

		}
	}
</script>

<style scoped lang="scss">
	.main {
		position: relative;
		height: 100%;
		background-color: #E7F3FF;
	}

	.main-top {
		margin: 42px auto 0 auto;
	}

	.bg-img {
		position: absolute;
		display: block;
		width: 100%;
		height: 100vh;
		z-index: -1;
	}

	.head-img {
		margin-right: 20rpx;
	}

	.u-cell-group {
		background: #fff !important;
	}

	/deep/.head-group {

		.u-cell__title-text {
			font-size: 18px;
			color: rgba(0, 0, 0, 0.85);
			font-weight: bold;
			line-height: 25px;
		}

		.u-cell__label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.45);
		}

		.u-cell {
			background: none !important;
		}
	}

	.body-group {
		margin-top: 28rpx;
		background: #fff;
	}

	/deep/.sign-out {
		margin-top: 20rpx;
		background: #fff;

	}
</style>
