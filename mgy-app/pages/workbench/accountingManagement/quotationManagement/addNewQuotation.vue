<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>
		<u--form :model="quotationInfo" ref="form1" labelPosition="left" labelWidth="80">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }"
					scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true">
					<view class="top-height">
						<u-form-item label="报价标题" prop="quotationInfo.name" :required="true" ref="item1">
							<u--input v-model="quotationInfo.name" border="none" placeholder="请填写" clearable
								:disabled="isDisabled" disabledColor="#ffffff" maxlength="30" @input="searchChange">
							</u--input>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="关联客户" prop="customerName" :required="true" ref="item1" style="margin-bottom: 12px;"
							@click="gotorelatedCustomers(); hideKeyboard()">
							<u--input v-model="customerName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					
					<view class="top-height">
						<view v-for="(item,index) in quotationInfo.vars" :key="index">
							<u-form-item v-if="item.variableName!='money'" :label="item.variableNameCn">
								<u--input v-model="item.variableValue" border="none" placeholder="请填写" clearable
									maxlength="30"></u--input>
							</u-form-item>
						</view>
					</view>
					
					<view class="top-height">
						<u-form-item label="产品报价" prop="relatedProduct"  borderBottom :required="true" ref="item1" 
							@click="gotorelatedProduct(); hideKeyboard()">
							<u--input v-model="relatedProduct" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view v-if="quotationInfo.productQuoteRecordList.length>0" class="isFill" style="background: #fff;">
						<view class="main-card">
							<u-grid :border="false" col="3">
								<u-grid-item>
									<text class="grid-text">{{quotaData.totalProdSort}}种</text>
									<text class="grid-text">产品品类</text>
								</u-grid-item>
								<u-grid-item>
									<text class="grid-text">{{quotaData.totalCount}}个</text>
									<text class="grid-text">产品总数量</text>
								</u-grid-item>
								<u-grid-item>
									<text class="grid-text">￥{{quotaData.totalPrice}}</text>
									<text class="grid-text">产品总金额</text>
								</u-grid-item>
							</u-grid>
							<u-grid :border="false" col="2" class="bGrid">
								<u-grid-item>
									<text class="grid-text">{{quotaData.discount}}%</text>
									<text class="grid-text">整单折扣</text>
								</u-grid-item>
								<u-grid-item>
									<text class="grid-text">￥{{quotaData.offerTotalPrice}}</text>
									<text class="grid-text">报价金额</text>
								</u-grid-item>
							</u-grid>
						</view>
						<view class="prod-item" v-for="(item,index) in quotationInfo.productQuoteRecordList">
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
					<view class="top-height"></view>
				</scroll-view>
			</view>
			<view class="foot-height">
				<view style="padding: 0 16px;">
					<u-row justify="space-around">
						<u-col span='5.5'>
							<u-form-item>
								<u-button color="#EBF4FF" :plain="true" type="info"  customStyle="background:#EBF4FF;border:1px solid EBF4FF !important; color:#0072FF;" shape="circle" text="保存" @click="save(0)">
								</u-button>
							</u-form-item>
						</u-col>
						<u-col span='5.5'>
							<u-form-item>
								<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="提交审批" @click="save(1)">
								</u-button>
							</u-form-item>
						</u-col>
					</u-row>
					
				</view>
			</view>
	
	</u--form>
	<u-modal :content="modalContent" :show="showModal" :title="modalTitle" showCancelButton closeOnClickOverlay
		@confirm="confirmModal" @cancel="showModal=false" @close="showModal=false"></u-modal>
	</view>
</template>

<script>
	import {
		js_date_time,
		GetNowFormatDate
	} from "@/util/js_DateTime.js"
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getProcessStartVariablesByBizCode,
		addproductQuote,
		getProductQuoteById,
		getProductQuoteRecord,
		editproductQuote,
		
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				navTitle: "新建报价",
				quotationInfo:{
					name:"",
					customerId:"",
					discount:0,
					productQuoteRecordList:[],
					vars: [],
				},
				customerName: "", //关联客户
				relatedProduct: "",
				contactName:"",
				customerName:"",
				isClick: false, //防止重复点击保存按钮
				isDisabled:false,
				quotaData:{
					totalProdSort:0,//产品品类
					totalCount:0,//产品总数量
					totalPrice:0,//产品总金额
					discount:0,//整单折扣(%)
					offerTotalPrice:0,//报价金额(元)
				},
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
				modalContent: "",
				modalTitle: "",
				showModal: false,
				returnPageNumber:1,
				id:"",
			}
		},
		onLoad(option) {
			this.id= option.id || "";			
			
			if(!isEmpty(this.id)){
				this.getUpdata()
			}else{
				this.getStartVariables();
			}
		},
		onShow() {
			uni.$once('returnOffer', res => {
				if (res) {
					let lst = this.$cache.get('_saveQuotaList');
					let quotaData = this.$cache.get('_quotaData');
					this.quotaData = quotaData
					this.quotationInfo.productQuoteRecordList = lst
					this.relatedProduct =  this.quotationInfo.productQuoteRecordList.length + "个产品报价"
					this.quotationInfo.discount=this.quotaData.discount
					console.log(lst)
				}
			});
			uni.$once('returnCustomer', res => {
				console.log(res)
				this.customerName = res.customerName; //客户名称
				this.quotationInfo.customerId = res.customerId; //客户ID
			});
		},
		methods: {
			getStartVariables() {
				getProcessStartVariablesByBizCode("PRODUCTQUOTE", res => {
					if (res.code == 200 && res.success) {
						for (let i = 0; i < res.result.length; i++) {
							let item = res.result[i]
							let info = {
								variableName: item.variableName,
								variableValue:item.value,
								variableNameCn: item.variableNameCn,
								variableType:item.variableType
							}
							this.quotationInfo.vars.push(info)
						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//取消按钮
			leftClick() {
				this.showModal = true;
				this.modalTitle = "是否取消";
				this.modalContent = "资料尚未提交，是否取消编辑？"
				//uni.navigateBack() 
			},
			//取消按钮 ==》弹出确认按钮
			confirmModal() {
				uni.navigateBack({
					delta: this.returnPageNumber
				});
			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			getUpdata(){
				getProductQuoteById("?id="+this.id,res=>{
					if (res.code == 200 && res.success) {
						this.quotaData = {
							totalProdSort:res.result.quoteNum,//产品品类
							totalCount:res.result.productNum,//产品总数量
							totalPrice:res.result.quoteAmount,//产品总金额
							discount:res.result.discount,//整单折扣(%)
							offerTotalPrice:res.result.productAmount,//报价金额(元)
						}
						this.quotationInfo.id=res.result.id,
						this.quotationInfo.discount=res.result.discount;
						this.quotationInfo.name= res.result.name;
						this.customerName = res.result.customerName; //客户名称
						this.quotationInfo.customerId = res.result.customerId; //客户ID
						
						this.quotationInfo.vars = JSON.parse(res.result.vars)
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
						this.quotationInfo.productQuoteRecordList = res.result.records
						this.relatedProduct =  this.quotationInfo.productQuoteRecordList.length + "个产品报价"
						
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//验证数据
			validateField() {
				if (isEmpty(this.quotationInfo.name)) {
					uni.$u.toast("报价标题不能为空");
					return false;
				}
				if (isEmpty(this.quotationInfo.customerId)) {
					uni.$u.toast("请选择关联客户");
					return false;
				}
				if (isEmpty(this.relatedProduct)) {
					uni.$u.toast("请选择产品报价");
					return false;
				}
				return true;
			},
			// 关联产品
			gotorelatedProduct() {
				// uni.navigateTo({
				// 	url: "/pages/product/productManagement/relatedProduct" + '?isAddOpp=1'
				// })
				if (isEmpty(this.id)) {
					uni.navigateTo({
						url: "/pages/product/productManagement/relatedProduct" + '?isAddOpp=1'
					})
				} else {
					this.$cache.set('_quotaProdList',this.quotationInfo.productQuoteRecordList)
					uni.navigateTo({
						url: "/pages/workbench/operationManagement/opportunityManagement/confirmQuotation?returnNumber=1&isAddOpp=3&discount="+this.quotaData.discount
					})
				}
			},
			//关联客户
			gotorelatedCustomers() {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/relatedCustomers?customerId=" + this.quotationInfo
						.customerId
				})
			},
			//保存 或 提交审批
			save(type){
				this.quotationInfo.operate=type
				if (this.validateField() && !this.isClick) {
					console.log(this.quotationInfo)
					let request;
					if(!isEmpty(this.quotationInfo.id)){
						request=editproductQuote
					}else{
						request=addproductQuote
					}
					request(this.quotationInfo,res=>{
						if (res.code == 200 && res.success) {
							uni.$u.toast(res.message);
							uni.$emit('returnQuotation', true);
							setTimeout(() => {
								uni.navigateBack({
									delta: this.returnPageNumber
								})
							}, 800)
						} else {
							uni.$u.toast(res.message);
							this.isClick = false;
						}
					})
				}
				
			},
			
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	/deep/.top-height {
		margin-top: 10px;
		background: #fff;

		// padding: 0 16px;
		.u-form-item {
			padding: 0 16px;
		}

		.u-form-item__body__left__content__required {
			right: 6px;
			float: right;
			left: unset;
		}

		.uni-input-placeholder {
			text-align: right;
		}

		.u-input__content__field-wrapper__field {
			text-align: right !important;
		}

		.u-textarea {
			padding: unset;
		}

		.u-textarea__field {
			height: 80px !important;
		}

		.uni-textarea-wrapper {
			height: 70px;
		}

		.u-upload {
			padding: 0 0 16px;
		}

		.top-user-gx {
			position: absolute;
			right: 16px;

			.user-gx {
				width: 24px;
				height: 24px;
				position: relative;
				top: 2px;
				right: 6px;
			}

			.user-gx-name {
				position: relative;
				top: -5px;
				color: rgba(0, 114, 255, 1);
			}
		}

		.top-user {
			position: absolute;
			right: 32px;

			.user-head {
				width: 38px;
				height: 38px;
				position: relative;
				top: 2px;
				right: 6px;
			}

			.user-name {
				position: relative;
				top: -12px;
			}
		}

		.u-switch {
			position: absolute;
			right: 16px;
		}

		.addContact {
			width: 100%;
			text-align: center;

			.contact-people {
				color: rgba(0, 114, 255, 1);
				font-size: 16px;
				position: relative;
				top: -5px;
			}

			.contact-star {
				color: #f56c6c;
				line-height: 20px;
				font-size: 20px;
				position: relative;
				left: 4px;
				top: -1px;

			}
		}

		.logo {
			width: 24px;
			height: 24px;
		}

		.primary-contact {
			.u-cell__body {
				padding: 10px 16px;

				.u-cell-text {
					font-size: 16px;
					font-weight: bold;
					color: rgba(48, 49, 51, 1);
					margin-left: 8px;
					float: left;
				}

				.u-fade-enter-active {
					width: 75px;
					display: block;
					float: left;
				}

				.u-tag-wrapper {
					position: relative;
					width: 73px;
					text-align: center;
					left: 14px;
				}

				.logo {
					width: 24px;
					height: 24px;
				}

				.logo-delete {
					width: 24px;
					height: 24px;
					right: 18px;
				}

				.logo-icon {
					background: rgba(0, 114, 255, 1);
					width: 40px;
					height: 40px;
					border-radius: 8px;

					.logo-icon-txt {
						font-size: 14px;
						text-align: center;
						border-radius: 5px;
						padding: 4px;
						color: #fff;
						line-height: 32px;
					}
				}
			}

			.u-form-item__body {
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

		.u-textarea__field {
			padding: 0 16px;
		}

		.swot-bg {
			height: 90px;
			/* border: 1px solid; */
			padding: 0 16px 16px;

			.card {
				border: 0.5px solid;
				height: 74px;
				border-radius: 4px;
				border-color: rgba(0, 114, 255, 0.8000);

				.card-title {
					display: block;
					background: rgba(239, 246, 255, 1);
					height: 37px;
					border-bottom: 1px solid;
					border-bottom-color: rgba(0, 114, 255, 0.8000);
					border-radius: 4px 4px 0 0;

					.card-title_1 {
						width: 35%;
						height: 37px;
						border-right: 1px solid;
						border-right-color: rgba(0, 114, 255, 0.8000);
						text-align: center;
						line-height: 37px;
						float: left;
						color: rgba(96, 98, 102, 1);
					}

					.card-title_2 {
						width: 64%;
						height: 37px;
						text-align: center;
						line-height: 37px;
						float: right;
						color: rgba(96, 98, 102, 1);
					}
				}

				.card-value {
					display: block;
					height: 37px;
					color: rgba(48, 49, 51, 1);
					text-align: center;
					line-height: 37px;

					.card-value_1 {
						width: 35%;
						height: 37px;
						border-right: 1px solid;
						border-right-color: rgba(0, 114, 255, 0.8000);
						float: left;
					}

					.card-value_2 {
						width: 64%;
						height: 37px;
						float: right;
					}
				}
			}
		}
	}

	/deep/ {
		.scrool-more {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}

		.uni-scroll-view-content {
			height: unset;
		}

		.foot-height {
			position: absolute;
			bottom: 0px;
			width: 100%;
			height: 72px;
			background: #fff;
			border-top: 1px solid #f0f4f9;

			.uni-input-placeholder {
				text-align: right;
				color: rgba(0, 114, 255, 1) !important;
			}

			.u-input__content__field-wrapper__field {
				text-align: right !important;
				color: rgba(0, 114, 255, 1) !important;
			}
		}
	}
	/deep/.main-card {
		box-sizing: border-box;
		width: 95%;
		height: 145px;
		background: #fff;
		margin: 0 auto;
		padding-top: 12px;
		border-bottom: 1px solid #F0F4F9;
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
	.prod-item:last-child{
		border-bottom: none;
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
	
</style>
