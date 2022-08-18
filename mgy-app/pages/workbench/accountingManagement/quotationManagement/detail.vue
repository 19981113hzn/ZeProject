<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="navbarName" bgColor="rgba(0, 114, 255, 1)" @leftClick="leftClick">
			<view class="u-nav-slot" slot="left">
				<image class="logo" src="/static/img/icon_bark_left.png"></image>
			</view>
		</u-navbar>
		<u-loading-icon v-if="isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<view v-else>
			<u-cell-group class="sign-out" :border="false">
				<u-cell :title="productQuoteDetails.applyName+'的报价'" size="large">
					<image class="user-head" slot="icon" src="/static/img/icon_user_default.png"></image>
					<u-tag v-if="productQuoteDetails.status==3" slot="value" text="已通过" bgColor="rgba(247, 252, 244, 1)"
						borderColor="rgba(247, 252, 244, 1)" color="rgba(103, 194, 58, 1)" size="mini">
					</u-tag>
					<u-tag v-if="productQuoteDetails.status==1 || productQuoteDetails.status==2" slot="value" text="待审批" bgColor="rgba(235, 244, 255, 1)"
						borderColor="rgba(235, 244, 255, 1)" color="rgba(0, 114, 255, 1)" size="mini">
					</u-tag>
					<u-tag v-if="productQuoteDetails.status==5" slot="value" text="被驳回" bgColor="rgba(255, 248, 242, 1)"
						borderColor="rgba(255, 248, 242, 1)" color="rgba(255, 147, 48, 1)" size="mini">
					</u-tag>
					<u-tag v-if="productQuoteDetails.status==6 || productQuoteDetails.status==0" slot="value" :text="productQuoteDetails.status==6?'已撤销':'草稿'" bgColor="rgba(241, 245, 250, 1)"
						borderColor="rgba(241, 245, 250, 1)" color="rgba(144, 147, 153, 1)" size="mini">
					</u-tag>
				</u-cell>
			</u-cell-group>
			<view class="main-head"></view>
			<view class="main-foot"></view>
			<view class="main-card">
				<u-grid :border="false" col="3">
					<u-grid-item>
						<text class="grid-text">{{productQuoteDetails.quoteNum}}种</text>
						<text class="grid-text">产品品类</text>
					</u-grid-item>
					<u-grid-item>
						<text class="grid-text">{{productQuoteDetails.productNum}}个</text>
						<text class="grid-text">产品总数量</text>
					</u-grid-item>
					<u-grid-item>
						<text class="grid-text">￥{{productQuoteDetails.quoteAmount}}</text>
						<text class="grid-text">产品总金额</text>
					</u-grid-item>
				</u-grid>
				<u-grid :border="false" col="2" class="bGrid">
					<u-grid-item>
						<text class="grid-text">{{productQuoteDetails.discount}}%</text>
						<text class="grid-text">整单折扣</text>
					</u-grid-item>
					<u-grid-item>
						<text class="grid-text">￥{{productQuoteDetails.productAmount}}</text>
						<text class="grid-text">报价金额</text>
					</u-grid-item>
				</u-grid>
			</view>
			<view class="main-content" >
				<u-tabs v-if="productQuoteDetails.status==3" :list="lsyTabs" @click="clickTabs" :scrollable="false" lineWidth="59"></u-tabs>
			</view>

			<view v-if="current==0" style="padding-bottom: 8px;">
				<view class="card">
					<view class="card-pa">
						<u-cell title="基本信息"></u-cell>
						<u--form labelWidth="75">
							<u-form-item label="客户名称">
								<text>{{productQuoteDetails.customerName || '-'}}</text>
							</u-form-item>
							<u-form-item label="报价人员">
								<text>{{productQuoteDetails.applyName || '-'}}</text>
							</u-form-item>
							<u-form-item label="报价部门">
								<text>{{productQuoteDetails.deptName || '-'}}</text>
							</u-form-item>
						</u--form>
					</view>
				</view>
				<view style="padding-left: 16px;background: #fff;">
					<view style="padding:0 16px 0 0px;background: #fff;font-size:16px;">
						<u-cell icon="" title="产品记录" value="" class="cpRecord"></u-cell>
					</view>
				</view>
				<view class="prod-item" v-for="(item,index) in prodList">
					<view class="prod-title">
						<text>{{item.name}}</text>
					</view>
					<view style="color:#0072FF;font-size: 15px;height: 18px;line-height: 9px;">￥{{item.price}}元/年</view>
					<view style="padding-bottom:16px;border-bottom:1px solid #F1F3F6;">
						<u-row justify="space-between" customStyle="margin-bottom:2px;">
							<u-col span="6">
								<view>
									<text class="cell-title">单价 (元)</text>
									<text class="cell-value">{{item.salePrice}}</text>
								</view>
							</u-col>
							<u-col span="6">
								<view>
									<text class="cell-title">数量 (个)</text>
									<text class="cell-value">{{item.quantity}}</text>
								</view>
							</u-col>
						</u-row>
						<u-row justify="space-between" customStyle="margin-bottom:2px;">
							<u-col span="6">
								<view>
									<text class="cell-title">折扣 (%)</text>
									<text class="cell-value">{{item.discount}}</text>
								</view>
							</u-col>
							<u-col span="6">
								<view>
									<text class="cell-title">总价 (%)</text>
									<text class="cell-value">{{item.amount}}</text>
								</view>
							</u-col>
						</u-row>
						<u-row justify="space-between">
							<u-col span="6">
								<view>
									<text class="cell-title">礼品</text>
									<text class="cell-value" style="padding-left:20px;">{{item.gift || '无'}}</text>
								</view>
							</u-col>
							<u-col span="6">
								<view>
									<text class="cell-title">备注</text>
									<text class="cell-value">{{item.remark || '无'}}</text>
								</view>
							</u-col>
						</u-row>
					</view>
				</view>
			</view>
			<view v-if="current==1" style="padding-top: 10px;padding-bottom: 8px;">
				<view class="sjrecord-item" v-for="item in productQuoteOpptyVOList">
					<view class="card-pa">
						<u-cell :title="item.opptyName"></u-cell>
						<u--form labelWidth="95">
							<u-form-item label="商机负责人员">
								<text>{{item.belongUserName}}</text>
							</u-form-item>
							<u-form-item label="预计销售金额">
								<text>{{item.amount}}</text>
							</u-form-item>
							<u-form-item label="预计签单日期">
								<text>{{item.date}}</text>
							</u-form-item>
						</u--form>
					</view>
				</view>
				<u-empty v-if="productQuoteOpptyVOList.length==0" text="暂无记录" width="84" height="84" icon="/static/img/icon_PDF.png">
					
				</u-empty>
			</view>
			<view v-if="current==2" style="padding-top: 10px;padding-bottom: 8px;">
				<view class="sjrecord-item" v-for="item in productQuoteContractVOList">
					<view class="card-pa">
						<u-cell :title="item.contractName"></u-cell>
						<u--form labelWidth="75">
							<u-form-item label="合同金额">
								<text style="color:#0072FF;font-weight:bold;">{{item.contractAmount}}</text>
							</u-form-item>
							<u-form-item label="关联项目">
								<text>{{item.projectName}}</text>
							</u-form-item>
							<u-form-item label="负责人员">
								<text>{{item.chargeName}}</text>
							</u-form-item>
						</u--form>
					</view>
				</view>
				<u-empty v-if="productQuoteContractVOList.length==0" text="暂无记录" width="84" height="84" icon="/static/img/icon_PDF.png">
					
				</u-empty>
			</view>
		</view>
		<u-tabbar v-if="!isDonedWith" :value="numTabbar" :fixed="true"
			:placeholder="true" :safeAreaInsetBottom="true" @change="changeTabbar">
		
			<u-tabbar-item v-if="isNeedWith" class="tab-adopt" text="通过">
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_adopt.png">
				</image>
			</u-tabbar-item>
			<u-tabbar-item v-if="isNeedWith" class="tab-reject" text="驳回">
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_reject.png">
				</image>
			</u-tabbar-item>
			<u-tabbar-item v-if="(productQuoteDetails.status==1 || productQuoteDetails.status==2) && !isNeedWith" text="撤销审批">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/workbench/icon_revoke_approval.png"></image>
			</u-tabbar-item>
			<u-tabbar-item v-if="(productQuoteDetails.status==6 || productQuoteDetails.status==5 || productQuoteDetails.status==0) && !isNeedWith"
				text="编辑报价">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/workbench/icon_edit.png"></image>
			</u-tabbar-item>
			<u-tabbar-item v-if="(productQuoteDetails.status==6 || productQuoteDetails.status==5 || productQuoteDetails.status==0) && !isNeedWith"
				text="提交审批">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/workbench/bjgl_tjsp.png"></image>
			</u-tabbar-item>
			<u-tabbar-item v-if="(productQuoteDetails.status==6 || productQuoteDetails.status==5 || productQuoteDetails.status==0 || productQuoteDetails.status==3) && !isNeedWith"
				text="删除报价">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/workbench/icon_delete.png"></image>
			</u-tabbar-item>
		</u-tabbar>
		<u-modal :show="showDelete" title="删除确认" content='确定要删除该条记录吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
		
		<u-modal :show="showApproval" title="系统提示" content='是否确认提交审批？' @cancel="showApproval=false"
			@close="showApproval=false" @confirm="confirmApproval" showCancelButton closeOnClickOverlay></u-modal>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getProductQuoteById,
		getProcessVariables,
		getProductQuoteRecord,
		getRelRecordByBizCodeAndId,
		editproductQuote,
		deleteProductQuoteById,
		
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				lsyTabs: [{
					name: "产品记录"
				}, {
					name: "商机记录"
				}, {
					name: "合同记录"
				}],
				navbarName:"报价名称",
				current:0,
				isLoading: false, //加载中
				id:"",
				productQuoteDetails:{
					name:"赵小刚",
					status:1
				},
				lstActiviti:[],
				productQuoteContractVOList: [],
				productQuoteOpptyVOList: [],
				numTabbar: "",
				isNeedWith: false, //是否待办进来的页面
				isDonedWith: false, //是否已办进来的页面
				showApproval:false,
				showDelete:false,
				
				prodList:[
					// {
					// 	name:"尊贵钻石VIP年会员",
					// 	quantity:"100",
					// 	discount:"20",
					// 	amount:"10000",
					// 	gift:'哈哈',
					// 	price:"10,000.00",
					// 	remark:""
					// },
					// {
					// 	name:"尊贵钻石VIP年会员",
					// 	quantity:"100",
					// 	discount:"20",
					// 	amount:"10000",
					// 	gift:'哈哈',
					// 	price:"10,000.00",
					// 	remark:""
					// },
					],
				sjList:[
					{
						name:"商机标题",
						chargeName:"李小明",
						amount:"10,000.00",
						date:"2019-04-01"
					},{
						name:"商机标题",
						chargeName:"李小明",
						amount:"10,000.00",
						date:"2019-04-01"
					},{
						name:"商机标题",
						chargeName:"李小明",
						amount:"10,000.00",
						date:"2019-04-01"
					},
				],
				htList:[
					{
						name:"合同标题",
						chargeName:"李小明",
						item:"项目1",
						amount:"¥ 10,000.00"
					},{
						name:"合同标题",
						chargeName:"李小明",
						item:"项目1",
						amount:"¥ 10,000.00"
					},{
						name:"合同标题",
						chargeName:"李小明",
						item:"项目1",
						amount:"¥ 10,000.00"
					},
				]
			}
		},
		onLoad(option) {
			this.id=option.id || ""
			let isNeedWith = isEmpty(option.isNeedWith) ? false : option.isNeedWith;
			let isDonedWith = isEmpty(option.isDonedWith) ? false : option.isDonedWith;
			this.isNeedWith = isNeedWith
			this.isDonedWith = isDonedWith
			
			this.getData();
		},
		onShow() {
			uni.$once('returnQuotation', res => {
				if (res) {
					this.getData();
				}
			})
		},
		methods: {
			getData(){
				this.isLoading = false;
				getProductQuoteById("?id="+this.id,res=>{
					if (res.code == 200 && res.success) {
						this.productQuoteDetails = res.result
						this.navbarName=this.productQuoteDetails.name
						this.lstActiviti=JSON.parse(this.productQuoteDetails.vars)
						// if (this.productQuoteDetails.status == 6 || this.productQuoteDetails.status == 5) {
						// 	this.getStartVariables();
						// }
						this.getProductQuoteRecordData()
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getProductQuoteRecordData(){
				getProductQuoteRecord("?pageNo=1&pageSize=1000&quoteId="+this.id,res=>{
					if (res.code == 200 && res.success) {
						this.prodList = res.result.records
						
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getStartVariables() {
				getProcessVariables(this.productQuoteDetails.procInstId, res => {
					if (res.code == 200 && res.success) {
						for (let i = 0; i < res.result.length; i++) {
							let item = res.result[i]
							let info = {
								variableName: item.variableName,
								variableValue: item.value,
								variableNameCn: item.variableNameCn
							}
							this.lstActiviti.push(info)
						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			
			//返回上一级
			leftClick() {
				uni.$emit('returnQuotation', true);
				// uni.redirectTo({
				// 	url:"/pages/workbench/accountingManagement/quotationManagement/quotationManagement"
				// })
				uni.$emit('return', true);
				uni.navigateBack();
			},
			clickTabs(item) {
				this.current = item.index;
				if(this.current==1){ //商机记录
					if(this.productQuoteOpptyVOList.length==0){
						this.getRelRecordData("BizOppty")
					}
					
				}
				if(this.current==2){//合同记录
					if(this.productQuoteOpptyVOList.length==0){
						this.getRelRecordData("Contract")
					}
				}
			},
			getRelRecordData(bizCode){
				let parameter = "?bizCode="+bizCode+"&id="+this.id
				getRelRecordByBizCodeAndId(parameter,res=>{
					if (res.code == 200 && res.success) {
						if(bizCode=="BizOppty"){
							this.productQuoteOpptyVOList=isEmpty(res.result.productQuoteOpptyVOList)?[] : res.result.productQuoteOpptyVOList;
						}
						if(bizCode=="Contract"){
							this.productQuoteContractVOList= isEmpty(res.result.productQuoteContractVOList)?[] : res.result.productQuoteContractVOList;
						}
						
					} else {
						uni.$u.toast(res.message);
					}
					
				})
			},
			changeTabbar(name) {
				if ((this.productQuoteDetails.status == 1 || this.productQuoteDetails.status == 2) && name == 0 && !this.isNeedWith) { //审批中  撤销审批
					//uni.$u.toast("审批中撤销审批成功")
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=1&procInstId=" +
							this.productQuoteDetails.procInstId + "&bizCode=PRODUCTQUOTE"
					})
			
				}
				if ((this.productQuoteDetails.status == 6 || this.productQuoteDetails.status == 5 || this.productQuoteDetails.status == 0 || this.productQuoteDetails.status == 3) && !this.isNeedWith) { //已撤销 
					if (name == 0) {  //删除
						this.showDelete=true;
					}
					if (name == 1) {//编辑
						//this.editResubmit();
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/quotationManagement/addNewQuotation?returnPageNumber=1&id="+this.productQuoteDetails.id
						})
					}
					if (name == 2) { //提交审批
						this.showApproval = true
					}
				}
				if (this.isNeedWith) {
					if (name == 0) { //待办 通过
						uni.redirectTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=3&procInstId=" +
							this.productQuoteDetails.procInstId + "&bizCode=PRODUCTQUOTE"
						})
					}
					if (name == 1) { //待办 驳回
						uni.redirectTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=2&procInstId=" +
							this.productQuoteDetails.procInstId + "&bizCode=PRODUCTQUOTE"
						})
					}
				}
			},
			//提交审批
			confirmApproval() {
				let detail={
					id:this.productQuoteDetails.id,
					operate:1,
					vars:this.lstActiviti,
					productQuoteRecordList:this.prodList
				}
				editproductQuote(detail, res => {
					if (res.code == 200 && res.success) {
						this.showApproval = false
						uni.$u.toast("提交成功");
						uni.$emit('returnQuotation', true);
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 800)						
					} else {
						uni.$u.toast(res.message);
					}
				})
				console.log(detail)
				// this.$refs.uToast.show({
				//     type:'success',
				//     message:"提交成功",
				// }) 
			},
			//确认删除
			confirmDelete(){
				deleteProductQuoteById('?id='+this.productQuoteDetails.id,res=>{
					if(res.code == 200 && res.success){
						this.showDelete=false;
						uni.$u.toast(res.message);
						uni.$emit('returnQuotation', true);
						setTimeout(()=>{
							uni.navigateBack();
						},1000)
					}
					uni.$u.toast(res.message);
				})
			},
			
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
		
			
	}

	/deep/.main-content {
		margin-top: 16px;
		background: #fff;
	}
	
	/deep/{
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
	.u-grid-item .grid-text:nth-child(1){
		color:#303133;
		font-weight: bold;
		font-size: 16px;
		padding-bottom: 0;
	}
	
	.u-grid-item .grid-text:nth-child(2){
		padding-top: 5px;
		color:#909399;
		font-size: 13px;
	}
	.card {
		padding: 12px 0 0;
		background: #fff;
		margin-bottom: 8px;
		.card-pa {
			padding: 0 16px 16px;
			background: #fff;
	
			//border-radius: 10px;
			/deep/.u-cell__body {
				padding: 10px 0 0;
	
				.u-cell__title-text {
					font-size: 16px;
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
	
	.sjrecord-item{
		width:92%;
		margin:0 auto;
		background: #fff;
		border-radius: 8px;
		margin-bottom: 8px;
		box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.0800);
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
	/deep/ .cpRecord{
		.u-cell__body{
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
	.bottomAction{
		box-sizing: border-box;
		background: #fff;
		width:100%;
		height: 59px;
		padding-top: 10px;
		position: fixed;
		left: 0;
		bottom: 0px;
		font-weight: normal !important;
		
	}
	
	/deep/ {
		.bGrid{
			justify-content: center !important;
			.u-grid-item{
				width:32% !important;
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
/deep/ {
		.u-page__item__slot-icon {
			width: 24px;
			height: 24px;
		}

		.u-tabbar-item__text {
			font-size: 12px;

			span {
				//color: rgba(0, 85, 255, 0.8);
			}
		}

		.tab-adopt {
			span {
				color: rgba(0, 114, 255, 1);
				font-weight: bold;
				font-size: 14px;
			}
		}

		.tab-reject {
			span {
				color: rgba(250, 85, 85, 1);
				font-weight: bold;
				font-size: 14px;
			}
		}
	}
	.u-empty {
		margin-top: 80px !important;
	}
</style>
