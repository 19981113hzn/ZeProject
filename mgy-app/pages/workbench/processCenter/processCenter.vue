<template>
	<view style="border-top: 1px solid;border-top-color: rgba(0, 0, 0, 0.05);">
		<view  class="card">
			<view class="card-bg">
				<view class="card-pa">
					<!-- <u-cell title="基本资料"></u-cell> -->
					<view>
						<u-grid :border="false" col="5" @click="clickGrid">
							<u-grid-item v-for="(listItem,listIndex) in listBasic" :key="listIndex">
								<u--image :src="listItem.src" width="46px" height="46px"></u--image>
								<text class="grid-text">{{listItem.title}}</text>
							</u-grid-item>
						</u-grid>
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
						src: '/static/img/workbench/icon_to-dealt.png',
						title: '待办'
					},
					{
						src: '/static/img/workbench/icon_to_be_read.png',
						title: '待阅'
					},
					{
						src: '/static/img/workbench/icon_done.png',
						title: '已办'
					},
					{
						src: '/static/img/workbench/icon_read.png',
						title: '已阅'
					},
					{
						src: '/static/img/workbench/icon_my_application.png',
						title: '我的申请'
					},
				],
			}
		},
		methods: {
			clickGrid(name) {
				if (name == 0) {//待办(10)
					uni.navigateTo({
						url: "/pages/workbench/processCenter/needToBeDealtWith?type=1"
					})
				}
				if (name == 1) { //待阅(5)
					uni.navigateTo({
						url: "/pages/workbench/processCenter/toBeRead?type=1"
					})
				}
				if (name == 2) { //已办(30)
					uni.navigateTo({
						url: "/pages/workbench/processCenter/needToBeDealtWith?type=2"
					})
				}
				if (name == 3) { //已阅(46)
					uni.navigateTo({
						url: "/pages/workbench/processCenter/toBeRead?type=2"
					})
				}
				if (name == 4) { //我的申请
					uni.navigateTo({
						url: "/pages/workbench/processCenter/myApplication"
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: rgba(242, 245, 249, 1);
	}
	.card {
		margin: 16px 16px 0 16px;
		border-radius: 10px;
		background: #fff;
		.card-bg {
			width: 100%;
			.card-pa{
				padding:10px;
				/deep/.u-cell__body{
					padding: 10px 0px;					
					.u-cell__title-text{
						font-size: 16px;
						color: rgba(0, 0, 0, 0.85);
					}
				}
				/deep/.u-grid{
					margin-top: 16px;
				}
				.grid-text {
					font-size: 14px;
					color: rgba(48, 49, 51, 1);
					padding: 10rpx 0 20rpx 0rpx;
					/* #ifndef APP-PLUS */
					box-sizing: border-box;
					/* #endif */
				}
			}
		}
	}
</style>
