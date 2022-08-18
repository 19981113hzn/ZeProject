<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }" class="css-container">
		<u-navbar title="确认报价" bgColor="#fff" @leftClick="leftClick"></u-navbar>
		<view class="sjd-quota">
			<view class="header">
				<u-grid :border="false" col="3">
					<u-grid-item>
						<text class="grid-text">{{totalProdSort}}种</text>
						<text class="grid-text">产品品类</text>
					</u-grid-item>
					<u-grid-item>
						<text class="grid-text">{{totalCount}}个</text>
						<text class="grid-text">产品总数量</text>
					</u-grid-item>
					<u-grid-item>
						<text class="grid-text">¥ {{totalPrice}}</text>
						<text class="grid-text">产品总金额</text>
					</u-grid-item>
				</u-grid>
			</view>
			<view class="content" v-if='list.length>0'>
				<!-- <u-checkbox-group class="checkbox" v-model="checkboxValue" placement="column" @change="groupChange"> -->
					<view class="prod-item" v-for="(item,index) in list">
						<u-cell :title="item.name">
							<view slot="value" class="u-slot-value">
								<!-- <u-checkbox class="radio" shape="square" label="" :name="index" :key="index"
									iconSize="15" size="20">
								</u-checkbox> -->
							</view>
						</u-cell>
						<view class="yearPrice">¥{{item.price}}元/年</view>
						<u-row customStyle="margin-bottom: 10px">
							<u-col span="2.5">
								<view class="i-key">单价 (元)</view>
							</u-col>
							<u-col span="3.5">
								<view>
									
									<u--input
										placeholder=""
										customStyle='padding:0;padding-left:5px;width:93px;height:28px;'
										v-model="list[index].salePrice"
										class="dib"
										type="number"
										@change="inputChange(index)"
									  ></u--input>
								</view>
							</u-col>
							<u-col span="2">
								<view class="i-key tac">数量</view>
							</u-col>
							<u-col span="4">
								<view>
									
									<u-number-box v-model="list[index].quantity" @change="(value)=>{numberChange(value,index)}" color="#909399" bgColor="#fff" class="dib"></u-number-box>
								</view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10px">
							<u-col span="2.5">
								<view class="i-key">折扣 (%)</view>
							</u-col>
							<u-col span="2">
								<view>
									
									<u--input
										placeholder=""
										customStyle='padding:0;padding-left:5px;width:66px;height:28px;'
										v-model="list[index].discount"
										class="dib"
										type="number"
										maxlength="3"
										@change="inputChange(index)"
									  ></u--input>
								</view>
							</u-col>
							<u-col span="4">
								<view class="i-key tac">总价 (元)</view>
							</u-col>
							<u-col span="3.5">
								<view>
									<u--input
										placeholder=""
										customStyle='padding:0;padding-left:5px;width:93px;height:28px;'
										:value="list[index].amount"
										class="dib"
										disabled
									  ></u--input>
								</view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10px">
							<u-col span="1.5">
								<view class="i-key">礼品</view>
							</u-col>
							<u-col span="4.5">
								<view>
									
									<u--input
										placeholder=""
										customStyle='padding:0;padding-left:5px;width:123px;height:28px;'
										v-model="list[index].gift"
										class="dib"
									  ></u--input>
								</view>
							</u-col>
							<u-col span="1.5">
								<view class="i-key tac">备注</view>
							</u-col>
							<u-col span="4.5">
								<view>
									<u--input
										placeholder=""
										customStyle='padding:0;padding-left:5px;width:123px;height:28px;'
										v-model="list[index].remark"
										class="dib"
									  ></u--input>
								</view>
							</u-col>
						</u-row>
					</view>
				<!-- </u-checkbox-group> -->
			</view>
			<view class="calSave">
				<u-row customStyle="margin-bottom: 10px">
					<u-col span="7">
						<view>
							<u-row customStyle="margin-bottom: 10px">
								<u-col span="5">整单折扣(%)
								</u-col>
								<u-col span="5">
									<u--input
										placeholder=""
										customStyle='padding:0;padding-left:5px;width:94px;height:28px;border:none;border-bottom:1px solid #C6CAD0;border-radius:0;'
										v-model="discount"
										class="dib"
										type="number"
										maxlength="3"
										@input='discountAllChange'
									></u--input>
								</u-col>
							</u-row>
							
						</view>
						<view>
							报价金额(元) <text style="color:rgba(0, 114, 255, 1);font-size: 14px;margin-left: 11px;">{{offerTotalPrice}}</text>
						</view>
					</u-col>
					<u-col span="5">
						<view>
							<u-button type="primary" text="保存" @click="save" shape="circle" customStyle="width:135px;height:40px;font-size:15px;"></u-button>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
	</view>
</template>

<script>
	import{
		updateProductQuote,
		getProductQuoteDetail
	} from "@/util/interface.js"
	import {
		changeParam
	} from "@/util/common.js"
	export default {
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				discount:undefined,
				list:[],
				selectProducts:[],
				checkboxValue: [],
				totalCount:0,
				totalPrice:0,
				totalProdSort:0,
				offerTotalPrice:0,
				bizOpptyId:"",
				selectIndex:"",
				returnNumber:1,
				id:"",
				checkedList:[],
				type:'add',
				isAddOpp:false,
			}
		},
		onLoad(option){
			this.isAddOpp = option.isAddOpp || 0;
			this.discount = option.discount || undefined;
			this.id = option.bizOpptyId || '';
			this.selectIndex = option.selectIndex;
			let bizOpptyId = this.$cache.get("_bizOpptyId");
			this.bizOpptyId = bizOpptyId;
			this.returnNumber = parseInt(option.returnNumber) || 2;
			let plist = this.$cache.get('_quotaProdList');
			this.type = option.type || '';
			console.log("plist:",plist)
			if(this.type =='edit'){
				this.getProductQuoteDetail();
			}else{
				this.list = plist.map(i=>({
					amount:i.price,
					//bizOpptyId,
					id: this.isAddOpp=='3' ? i.id : "",
					discount:i.discount || 0,
					gift:i.gift || "",
					name:i.name,
					price:i.price,
					prodNo:i.prodNo,
					productId:i.id,
					quantity:i.quantity || 1,
					remark:i.remark || "",
					salePrice:i.price,
					specification:i.specification || "",
					specification_dictText:i.specification_dictText || "",
					quoteId:i.quoteId || "",
				}))
				this.selectProducts = JSON.parse(JSON.stringify(this.list));
				this.totalCount = this.list.reduce((c,i)=>(c + i.quantity),0);
				this.totalProdSort = this.list.length;
				this.calPrice();
				this.checkboxValue = this.list.map((item,index)=>(index))
				this.checkedList = this.checkboxValue;
			}
		},
		methods: {
			leftClick() {
				uni.navigateBack();
			},
			discountAllChange(){// 整单折扣
				this.list.forEach(i=>{
					i.discount = this.discount;
					let a = i.salePrice*i.quantity*(1-i.discount/100);
					i.amount = a.toFixed(2);
				})
				let sList = this.checkedList.map(i=>this.list[i])
				let o = sList.reduce((c,i)=>(Number(c)+ Number(i.amount)),0)
				this.offerTotalPrice = Number.isNaN(o)? "0.00":o.toFixed((2))
				// console.log('更新-this.list:',this.list)
			},
			getProductQuoteDetail(){
				let params = {
					bizOpptyId:this.id
				}
				getProductQuoteDetail(changeParam(params),res=>{
					if(res.code == 200 && res.success){
						console.log('报价单详情-res:',res)
						this.isShowProd = Array.isArray(res.result) && res.result.length>0;
						this.list = res.result || [];
						if(this.list.length == 0)return;
						this.totalProdSort = this.list.length;
						this.totalCount = this.list.reduce((c,i)=>(c + i.quantity),0);
						this.calPrice();
						this.checkboxValue = this.list.map((item,index)=>(index))
						this.checkedList = this.checkboxValue;
						
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			calPrice(sList){
				let list = sList || this.list;
				let p = list.reduce((c,i)=>(c+(i.salePrice || 0)*(i.quantity || 0)),0);
				this.totalPrice = Number.isNaN(p)? '0.00':p.toFixed(2);
				let o = list.reduce((c,i)=>(Number(c)+ Number(i.amount)),0)
				this.offerTotalPrice = Number.isNaN(o)? "0.00":o.toFixed((2))
			},
			inputChange(index){//单价修改
				let cur = this.list[index];
				this.list[index].amount = ((Number(cur.salePrice || 0)*(1-(Number(cur.discount || 0))/100))*Number(cur.quantity)).toFixed(2);
				if(this.checkedList.includes(index)){
					let sList = this.checkedList.map(i=>this.list[i])
					this.calPrice(sList);
				}
			},
			numberChange(cb,index){
				console.log('numberChange:',cb,index)
				let cur = this.list[index];
				this.list[index].amount = ((Number(cur.salePrice || 0)*(1-(Number(cur.discount || 0))/100))*Number(cb.value)).toFixed(2);
				this.list[index].quantity = cb.value;
				if(this.checkedList.includes(index)){
					let sList = this.checkedList.map(i=>this.list[i])
					this.totalCount = sList.reduce((c,i)=>(c + i.quantity),0);
					this.calPrice(sList);
				}
			},
			groupChange(arr) {
				this.selectProducts = [];
				console.log('groupChange-arr:',arr)
				this.checkedList = arr;
				this.checkboxValue = arr;
				arr.forEach(item => {
					this.selectProducts.push(this.list[item])
				})
				console.log("this.selectProducts:",JSON.stringify(this.selectProducts))
				let p = this.selectProducts.reduce((c,i)=>(c+(i.salePrice || 0)*(i.quantity || 0)),0);
				this.totalPrice = Number.isNaN(p)? '0.00':p.toFixed(2);
				
				this.totalCount = this.selectProducts.reduce((c,i)=>(c + i.quantity),0);
				console.log('group变化后~this.totalCount:',this.totalCount)
				
				let o = this.selectProducts.reduce((c,i)=>(c+ Number(i.amount)),0)
				this.offerTotalPrice = Number.isNaN(o)? "0.00":o.toFixed((2))
				
				this.totalProdSort = this.selectProducts.length;
			},
			save(){
				// if(this.checkedList.length == 0){
				// 	uni.$u.toast('请勾选至少一项进行保存');
				// 	return;
				// }
				let cList = this.checkedList.map((i)=>this.list[i]);
				let sList = this.list.length == this.checkedList.length? this.list : cList;
				if(this.isAddOpp =='1' || this.isAddOpp =='3'){//新建商机 -产品报价逻辑
					this.$cache.set('_saveQuotaList',sList);
					let shuju={
						totalProdSort:this.totalProdSort,//产品品类
						totalCount:this.totalCount,//产品总数量
						totalPrice:this.totalPrice,//产品总金额
						discount:this.discount || 0,//整单折扣(%)
						offerTotalPrice:this.offerTotalPrice,//报价金额(元)
					}
					this.$cache.set('_quotaData',shuju);
					uni.$emit('returnOffer', true);
					uni.$u.toast('保存成功');
					if(this.isAddOpp =='1'){
						setTimeout(()=>{
							uni.navigateBack({delta:2});
						},1500)
					}
					if(this.isAddOpp =='3'){
						setTimeout(()=>{
							uni.navigateBack({delta:1});
						},1500)
					}
					return;		
				}
				// let params = {
				// 	bizOpptyId:this.id,
				// 	discount:this.discount,
				// 	productQuoteDetailList:sList
				// };
				// updateProductQuote(params,res=>{
				// 	if(res.code == 200 && res.success){
				// 		uni.$emit('returnQuota', true);
				// 		setTimeout(()=>{
				// 			uni.navigateBack({delta:this.returnNumber || 2});
				// 		},1500)
				// 	}
				// 	uni.$u.toast(res.message);
				// })
			},
		}
	}
</script>

<style lang="scss">

.sjd-quota{
	min-height: 600px;
	background: #F2F5F9;
	padding-bottom: 100px;
}
.header{
	background: #fff;
	height: 73px;
	margin-bottom: 12px;
	// padding-top: 15px;
}
.prod-item{
	padding: 16px;
	background: #fff;
	margin-bottom: 12px;
	.yearPrice{
		color:#0072FF;
		font-size:15px;
		margin-bottom: 8px;
	}
	.i-key{
		color:#606266;
		font-size: 15px;
	}
	.tac{
		text-align: center;
	}
}

.calSave{
	box-sizing: border-box;
	width: 100vw;
	color:rgba(96, 98, 102, 1);
	font-size: 14px;
	padding:16px;
	background: #fff;
	position: fixed;
	left: 0;
	bottom: 0;
	box-shadow:  0px -5px 10px -5px rgba(32, 33, 36, .28);
}
	
/deep/ {
	.u-cell__body{
		padding:0;
		padding-bottom: 5px;
	}
	.u-cell{
		.u-line{
			border: none !important;
		}
	}
	.u-number-box{
		border: 0.5px solid rgba(192, 196, 204, 0.6);
		border-radius: 3px;
	}
	.u-number-box__minus{
		border-right: 0.5px solid rgba(192, 196, 204, 0.6);
	}
	.u-number-box__plus{
		border-left: 0.5px solid rgba(192, 196, 204, 0.6);
	}
	.u-grid{
		// padding-top: 5px;
		.u-grid-item:last-child{
			heigh: 58px !important;
		}
	}
	.grid-text {
		font-size: 15px;
		color: #909399;
		padding: 30rpx 0 5rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
	.grid-text:first-child{
		color:#303133;
		font-weight: bold;
		font-size: 15px;
	}
	.grid-text:last-child{
		padding-top: 2px;
		font-size: 12px;
		font-weight: normal;
		color:#909399;
	}
	.related-prod{
		.u-cell__body {
			padding-left: 0px;
		}
		.u-cell__title-text{
			font-size: 15px;
			color:#606266;
		}
	}
}
</style>
