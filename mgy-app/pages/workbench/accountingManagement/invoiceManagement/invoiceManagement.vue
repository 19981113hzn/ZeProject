<template>
	<view>
		<view class="container-view">
			<view v-if="tabbarNum==0">
				<myInvoice></myInvoice>
				<!-- 我的发票 -->
			</view>
			<view v-if="tabbarNum==1">
				<invoiceApply></invoiceApply>
				<!-- 开票申请 -->
			</view>
			<view v-if="tabbarNum==2">
				<myRise></myRise>
				<!-- 我的抬头 -->
			</view>
			<u-modal :show="showMessage" @confirm="showMessage=false" :closeOnClickOverlay="true" title="系统提示"
				:content='contentMessage'></u-modal>
		</view>
		<u-tabbar :value="tabbarNum" @change="change1" :safeAreaInsetBottom="false">
			<u-tabbar-item text="我的发票">
				<image class="u-page__item__slot-icon" slot="active-icon" src="/static/img/invoice/icon_wdfp.png"></image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/invoice/icon_wdfp1.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="开票申请">
				<image class="u-page__item__slot-icon" slot="active-icon" src="/static/img/invoice/icon_kpsq1.png">
				</image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/invoice/icon_kpsq.png">
				</image>
			</u-tabbar-item>
			<u-tabbar-item text="我的抬头" badgeStyle="top: 6px;right:2px;">
				<image class="u-page__item__slot-icon" slot="active-icon" src="/static/img/invoice/icon_wdtt1.png"></image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/invoice/icon_wdtt.png"></image>
			</u-tabbar-item>
		</u-tabbar>
		
	</view>
</template>

<script>
	import myInvoice from "pages/workbench/accountingManagement/invoiceManagement/myInvoice/myInvoice";
	import myRise from "pages/workbench/accountingManagement/invoiceManagement/myRise/myRise";
	import invoiceApply from "pages/workbench/accountingManagement/invoiceManagement/invoiceApply/invoiceApply";
	export default {
		components: {
			myInvoice,
			myRise,
			invoiceApply
		},
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				navbarName:"我的发票",
				tabbarNum: 0,
			}
		},
		methods: {
			leftClick(){
				uni.navigateBack();
			},
			change1(name){
				this.tabbarNum = name
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
		.bGrid{
			justify-content: center !important;
			padding: 0px 8px 8px;
			.u-grid-item{
				width:32% !important;
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
