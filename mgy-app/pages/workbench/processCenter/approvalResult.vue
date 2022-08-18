<template>
	<view  :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="navTitle"  bgColor="#fff" leftIcon="">
		</u-navbar>
		<view class="user-sty">
			<u--image :src="imgSrc" width="44px" height="44px"  shape="circle"></u--image>
			<text class="txt-size">{{name}}</text>
		</view>
		<view style="padding: 40px 105px 16px;">
			<u-button
				color="rgba(0, 114, 255, 1)" 
				shape="circle" 
				text="返回待办"  
			@click="gotoNeedToBeDealtWith"></u-button>
		</view>
		<view style="padding: 16px 105px 16px;">
			<u-button
				class="details"
				color="rgba(241, 243, 246, 1)" 
				shape="circle" 
				text="查看详情"  
			@click="seeDetails"></u-button>
		</view>
	</view>
</template>

<script>
	
	import {isEmpty} from "@/util/common.js"
	export default {
		data() {
			return {
				statusBarHeight:getApp().globalData.statusBarHeight+44,//状态栏高度
				navTitle:"通过",
				type:0,//1通过 2驳回
				imgSrc:'/static/img/icon_adopt_result.png',
				name:"已通过",
				bizCode:"",//报销申请:SUMEXPENSE 产品报价:PRODUCTQUOTE 回款管理:COLLECTION 付款管理:PAYMENT 开票申请:INVOICING
			}
		},
		onLoad(option){
			let type=isEmpty(option.type)?false:option.type;
			this.bizCode= isEmpty(option.bizCode) ? false : option.bizCode;
			this.type=type;
			if(type==1){
				this.navTitle="通过";
				this.name="已通过"
			}
			else if(type==2){
				this.navTitle="审批驳回"
				this.name="已驳回"
			}
		},
		methods: {
			gotoNeedToBeDealtWith(){
				uni.$emit('return', true);
				uni.redirectTo({
					url: "/pages/workbench/processCenter/needToBeDealtWith?type=1"
				})
			},
			seeDetails(){
				if(this.bizCode=="PRODUCTQUOTE"){
					let detail = uni.getStorageSync("reimbursDetails");
					uni.redirectTo({
						url: "/pages/workbench/accountingManagement/quotationManagement/detail?id="+detail.bizId
					})
				}else{ //报销申请
					uni.redirectTo({
						url: "/pages/workbench/accountingManagement/reimburseManagement/reimbursementDetails"
					})
				}
				
			},
			
		}
	}
</script>

<style lang="scss">
.user-sty{
	display: block;
	//float: right;
	margin-top: 56px;
	/deep/.u-image{
		margin: auto;
	}
	.txt-size{
		margin: auto;
		display: block;
		line-height: 30px;
		width: 55px;
		margin-top: 10px;
		color: rgba(48, 49, 51, 1);
		font-size: 18px;
	}
}
/deep/.u-button{
	.u-button__text{
		font-size: 16px !important;
	}
	
}
/deep/.details{
	.u-button__text{
		font-size: 16px !important;
		color:rgba(96, 98, 102, 1) !important ;
	}
}
</style>