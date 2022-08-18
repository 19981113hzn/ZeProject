<template>
	<!-- <view style="border-top: 1px solid;border-top-color: rgba(0, 0, 0, 0.05);"> -->
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="财务管理" bgColor="#fff" @leftClick="leftClick"></u-navbar>
		<view class="card">
			<view class="card-bg">
				<view class="card-pa">
					<!-- <u-cell title="基本资料"></u-cell> -->
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				listBasic: [{
						src: '/static/img/workbench/icon_cost_logo.png',
						title: '费用管理'
					},
					{
						src: '/static/img/workbench/icon_reimbursement.png',
						title: '报销管理'
					},
					{
						src: '/static/img/workbench/ico_bjgl.png',
						title: '报价管理'
					},
					{
						src: '/static/img/workbench/icon_cashreback.png',
						title: '回款计划'
					},
					{
						src: '/static/img/workbench/icon_cashManage.png',
						title: '回款管理'
					},
					{
						src: '/static/img/workbench/icon_fkjh.png',
						title: '付款计划'
					},
					{
						src: '/static/img/workbench/icon_fkgl.png',
						title: '付款管理'
					},
					{
						src: '/static/img/workbench/icon_invoice.png',
						title: '发票管理'
					},
				],
			}
		},
		methods: {
			clickGrid(name) {
				if (name == 0) { //费用管理
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/costManagement/costManagement"
					})
				}
				if (name == 1) { //报销管理
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/reimburseManagement/reimburseManagement"
					})
				}
				if (name == 2) { //报价管理
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/quotationManagement/quotationManagement"
					})
				}
				if (name == 3) { //回款计划
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/cashtransferSchemes/cashtransferSchemes"
					})
				}
				if (name == 4) { //回款管理
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/collectionManagement/collectionManagement"
					})
				}
				if (name == 5) { //付款计划
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/paymentSchemes/paymentSchemes"
					})
				}
				if (name == 6) { //付款管理
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/paymentManagement/paymentManagement"
					})
				}
				if (name == 7) { //发票管理
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/invoiceManagement/invoiceManagement"
					})
				}
			},
			leftClick() {
				uni.redirectTo({
					url: "../../main/main?istype=2"
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.card {
		margin: 16px 16px 0 16px;
		border-radius: 10px;
		background: #fff;

		.card-bg {
			width: 100%;

			.card-pa {
				padding: 10px;

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
