<template>
	<view class="content" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="供应商"  bgColor="#fff" @leftClick="leftClick" @rightClick="rightClick">
			<view  class="u-nav-slot"
		        slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="请输入关键词查询" bgColor="rgba(244, 246, 250, 1)"
				v-model="selectInfo.name" :clearabled="true" @change="searchChange"></u-search>
				<text class="sticky-txt" @click="clickScreen">筛选</text>
			</view>
		</u-sticky>
		<view>
			<view class="card" v-for="(item, index) in lstCostManage":key="index">
				<view class="card-pa" @click="gotoFeeDetail(item)">
					<view class="card_top">
						<view class="companyType">
							<view class="logo-icon-txt">
								{{item.name.slice(0,4)}}
							</view>
						</view>
						
						<view class="contentBox">
							<view class="company_title">
								{{item.name}}
							</view>
							<view class="desBox">
								<view class="company_type">{{item.companyOrgTypeName || '未知公司类型'}}</view>
								<view :class="item.supplierLevel == 'A'? 'company_des':'company_des_B'" v-if="item.supplierLevel_dictText">{{item.supplierLevel_dictText}}</view>
								<view class="company_des" style="color:#909399;background-color: #F1F5FA;" v-else>未设置级别</view>
							</view>
							
						</view>
						<view class="ico"><icon type="next" size="16"/></view>
					</view>
					<view class="addressBox">
					<view @click.stop="gotoMap(item.area)"  class="hasArea">
						<image class="logo_tips" src="/static/img/icon_dq.png" ></image>
						{{item.area || '暂无所在地区' }}
					</view>
					<image class="logo_tips" src="/static/img/icon_rygm.png" ></image>
					{{item.staffNumRange_dictText || '暂无人员规模' }}
					</view>
					
					<view class="line"></view>
					
					<u--form labelWidth="75" class="chargeNameBox">
						<image class="logo_tips" src="/static/img/icon_fzry.png"></image>
						<u-form-item label="负责人员:">
							<text>{{item.chargeUserName || '-'}}</text>
						</u-form-item>
					</u--form>
				</view>
			</view>
		</view>
		
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
		<u-empty
			v-if="lstCostManage.length==0 && isLoading"
			mode="data"
			icon="http://cdn.uviewui.com/uview/empty/data.png"
		></u-empty>
		<u-loadmore
			v-if="lstCostManage.length>0"
			:status="status"  
			:loading-text="loadingText" 
			:loadmore-text="loadmoreText" 
			:nomore-text="nomoreText" />
	</view>
</template>

<script>
	import {GetNowFormatDate} from "@/util/js_DateTime.js"
	import {isEmpty} from "@/util/common.js"
	import {toMap} from "@/util/map.js"
	import {getDictItemsByCode,getUserListByUserId,getSupplierList} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight:0,
				statusBarHeight:getApp().globalData.statusBarHeight+44,//状态栏高度
				lstScreen:[
					{
						type:1,//1多选  2选择时间 3收入费用
						title:"供应商级别",
						defaultSelectedIndex:"",
						isMutiple:false, //是否多选
						lst:[
							{name:"全部",value:""},
							{name:"A(优质供应商)",value:"1"},
							{name:"B(普通供应商)",value:"2"}
						]
					},
					{
						type:2,//1多选  2选择时间 3收入费用
						title:"操作时间",
						startTime:"",
						endTime:"",
					},
					{
						type:1,//1多选  2选择时间 3收入费用
						title:"负责人员",
						defaultSelectedIndex:[],
						isMore:true,//是否显示更多按钮
						isMutiple:true,
						isRequired:true,//是否跳转页面
						moreTitle:"更多",
						total:"",//点击获取跟多的时候，需要获取，进行查询
						lst:[
							{name:"周小康",value:1},
						]
					},
					{
						type:1,//1多选  2选择时间 3收入费用
						title:"创建人员",
						defaultSelectedIndex :[],
						isMore:true,//是否显示更多按钮
						isMutiple:true,
						isRequired:true,//是否跳转页面
						moreTitle:"更多",
						total:"",//点击获取跟多的时候，需要获取，进行查询
						lst:[
							{name:"周小康2",value:1},
						]
					},
				],
				lstCostManage:[],
				status:"loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				pageNo:1,
				maxPage:1,
				firstTime:false,//第一次点击筛选
				isLoading:false,//加载中
				selectInfo:{
					name:"",//供应商名称
					supplierLevel:"", //供应商级别
					chargeMan:"",//负责人员
					createMan:"", //创建人员
					startTime:"",//开始时间
					endTime:"",//结束时间
				}
			}
		},
		onLoad(){
			this.getSupplier()
			this.getTopHeight();
			this.getUserList();
			this.getDictItems('supplier_level');
			this.getDictItems('company_org_type');
			this.getDictItems('staff_num_range');
			this.getDictItems('is_micro_ent');
			this.getDictItems('operating_state');
		},
		onReachBottom() {
			if(this.pageNo >= this.maxPage) return ;
			this.status = 'loading';
			this.pageNo = this.pageNo+1;
			this.getSupplier();
		},
		onShow() {
			this.pageNo=1;
		    uni.$once('result', res => {
			    for(let i=0;i<res.length;i++){
					let item=res[i];
					console.log(item)
					if(item.title=="供应商级别"){
						this.selectInfo.supplierLevel=item.defaultSelectedIndex;
					}
					if(item.title=="操作时间"){
						this.selectInfo.startTime=item.startTime;
						this.selectInfo.endTime=item.endTime;
					}
					if(item.title=="负责人员"){
						let SelectedIndex="";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length>0 ?",":"") +item.defaultSelectedIndex[k]
						}
						this.selectInfo.chargeMan=SelectedIndex;
					}
					if(item.title=="创建人员"){
						let SelectedIndex="";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length>0 ?",":"") +item.defaultSelectedIndex[k]
						}
						this.selectInfo.createMan=SelectedIndex;
					}
				}
				this.getSupplier();
		    })
			uni.$once('return', res => {
				if(res){
					this.getSupplier();
				}
			})
		},
		methods: {
			gotoMap(area){
				toMap(area)
			},
			getSupplier(){
				this.isLoading=false;
				let data="?pageNo="+this.pageNo//页码
				+"&pageSize="+"5"//页码大小
				+"&name="+this.selectInfo.name//供应商名称
				+"&supplierLevel="+this.selectInfo.supplierLevel//供应商级别
				+"&chargeIdList="+this.selectInfo.chargeMan//负责人员
				+"&createIdList="+this.selectInfo.createMan//创建人员
				+"&startTime="+this.selectInfo.startTime//开始时间
				+"&endTime="+this.selectInfo.endTime//结束时间
				;
				getSupplierList(data,res=>{
					if(res.code==200 && res.success){
						if(this.pageNo==1){
							this.lstCostManage=res.result.records;
						}else{
							this.lstCostManage=this.lstCostManage.concat(res.result.records)
						}
						let company_type = uni.getStorageSync('company_org_type')
						if(company_type){
							let company_org_type = JSON.parse(company_type)
							// 企业类型
							company_org_type.forEach((v,index) => {
								this.lstCostManage.forEach((y,idx) => {
									if (v.value == y.companyOrgType) {
										y.companyOrgTypeName = v.text
									}
								})
							})
						}else{
		
						}
						this.maxPage=res.result.pages
						if(this.pageNo >= this.maxPage) this.status = 'nomore';
						else this.status = 'loading';						
					}else{
						uni.$u.toast(res.message);
					}
					this.isLoading=true;
				})
			},
			//搜索
			searchChange(){
				this.pageNo=1
				this.getSupplier();
			},
			//供应商级别字典
			getDictItems(type){
				let data="?dictCode="+ type
				getDictItemsByCode(data,res=>{
					if(res.code==200 && res.success){
						getApp().globalData[type] = res.result;
						if(type != 'supplier_level'){
							uni.setStorageSync(type,JSON.stringify(res.result))
							return
						}
						let arr=[];
						arr.push(res.result)
						getApp().globalData.lstExpense_type=arr;
						let lst=[];
						for(let j=0;j<res.result.length;j++){
							lst.push({
								name:res.result[j].text,
								value:res.result[j].value
							})
						}
						for(let i=0;i<this.lstScreen.length;i++){
							if(this.lstScreen[i].title=="供应商级别"){
								this.lstScreen[i].lst=lst;
								this.lstScreen[i].lst.unshift({name:"全部级别",value:""},)
							}
						}
						uni.setStorageSync(type,JSON.stringify(res.result))
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			//负责人员
			getUserList(){
				let data="?realname="+""
				+"&pageNo="+"1"
				+"&pageSize="+"5"
				;
				getUserListByUserId(data,res=>{
					if(res.code==200 && res.success){
						let data=[];
						for(let j=0;j<res.result.records.length;j++){
							data.push({
								name:res.result.records[j].realname,
								value:res.result.records[j].id,
								id:res.result.records[j].id
							})
						}
						for(let i=0;i<this.lstScreen.length;i++){
							if(this.lstScreen[i].title=="负责人员"){
								this.lstScreen[i].lst=data;
								this.lstScreen[i].total=res.result.total;
								// this.chargeMan=data.length>0?data[0].value:"";
							}
							if(this.lstScreen[i].title=="创建人员"){
								this.lstScreen[i].lst=data;
								this.lstScreen[i].total=res.result.total;
							}
						}
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			getTopHeight(){
				let that=this;
				uni.getSystemInfo({
					success:function(e){
						//48为自定义导航高度，一般为44
						let topPx=getApp().globalData.statusBarHeight //顶部状态栏+沉浸式自定义顶部导航栏
						that.topheight=topPx/(uni.upx2px(topPx)/topPx)//px转rpx,这里必须转换为rpx,不然适配失败
					} 
				})
			},
			gotoFeeDetail(item){
				uni.navigateTo({
					url: "/pages/supplier/detail?id=" + item.id
				})
			},
			clickScreen(){
				if(!this.firstTime){
					this.firstTime=true;
					uni.setStorageSync('_lstScreen',this.lstScreen)//1*60*60*24*7
					uni.setStorageSync('OldLstScreen',this.lstScreen)//1*60*60*24*7
					
				}				
				uni.navigateTo({
					url:"/pages/filter-all/supplierSelect"
				});
			},
			
			leftClick(){
				uni.navigateBack();
			},
			
			rightClick(){
				uni.navigateTo({
					url: "/pages/supplier/addSupplier?comefrom=" + 'list'
				})
			}
		},
		// 按钮监听函数
		onNavigationBarButtonTap(e) {//不需要在<view>里面做任何操作，可直接引用
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color: rgba(242, 245, 249, 1);
	}
	.sticky-title{
		height: 48px;
		background: #fff;
		border-top: 1px solid;
		border-top-color: rgba(0, 0, 0, 0.05);
		padding: 0 16px;
		/deep/.u-search{
			margin-top: 8px !important;
			width: 85%;
		}
		.sticky-txt{
			float: right;
			font-size: 16px;
			color: rgba(48, 49, 51, 1);
			margin-top: -30px;
		}
	}
/deep/{
	.u-tabs__wrapper__nav__item{
		width: 50%;
	}
	.u-tabs__wrapper__nav{
		border-bottom: 1px solid;
		border-bottom-color: rgba(0,0,0,0.05);
		background: #fff;
	}
	.u-button{
		width: 50%;
		float: left;
		border-radius: none !important;
	}
	.uni-button{
		border-radius: none !important;
	}
}
.card{	
	padding: 8px 16px 0 16px;	
	.card-pa{
		padding:11px 11px 11px 16px;
		background: #fff;
		border-radius: 10px;
		/deep/.u-cell__body{
			padding: 10px 0px;					
			.u-cell__title-text{
				font-size: 16px;
				font-weight: bold;
				color: rgba(48, 49, 51, 1);
			}
			.logo {
				width:24px;
				height: 24px;
			}
		}
		/deep/.u-form-item__body{
			padding: 10px 0 0;
			.u-form-item__body__left__content__label{
				font-size: 14px;
				color:rgba(116, 121, 136, 1) ;
			}
			.u-form-item__body__right__content__slot{
				font-size: 14px;
				color:rgba(48, 49, 51, 1) ;
			}
		}
		.card-pa-view{
			line-height: 30px;
			height: 30px;
			.card-title{
				display: block;
				width: 80%;
				float: left;
			}
			.card-state{
				display: block;
				width: 17%;
				float: right;
				color: #D1372C;
			}
		}
		.txt-size{
			display: block;
			margin-top: 5px;
			font-size: 14px;
			color: rgba(0,0,0,0.65);
		}
	}
}
.u-loading-icon{
	margin-top: 30px;
}
.logo{
	width: 24px;
	height: 24px;
}
.logo_tips{
	width: 16px;
	height: 16px;
	margin: 0 6px;
}
.card_top{
	display: flex;
	margin-bottom: 11px;
	
	// .companyType{
	// 	width: 44px;
	// 	height: 44px;
	// 	padding: 8px;
	// 	box-sizing: border-box;
	// 	border-radius: 6px 6px 6px 6px;
	// 	background: #DFEDFF;
	// 	font-size: 13px;
	// 	color: #0072FF;
	// 	line-height: 15px;
	// 	font-weight: bold;
	// 	text-align: center;
	// }
	.companyType{
			background: rgba(223, 237, 255, 1);
			width: 44px;
			height: 44px;
			border-radius: 6px;
			display: flex;
			justify-content: center;
			align-items: center;
			justify-content: center;
			align-items: center;
			.logo-icon-txt{
				font-size: 13px;
				text-align: center;
				border-radius: 5px;
				padding: 4px;
				color: rgba(0, 114, 255, 1);
				font-weight: bold;
			}
	}
	.contentBox{
		flex: 1;
		margin-left: 10px;
		
		.company_title{
			margin-right: 10px;
			// height: 22px;
			font-size: 16px;
			font-weight: bold;
			color: #303133;
			line-height: 19px;
		}
		.desBox{
			display: flex;
			justify-content: flex-start;
			margin-top: 5px;
			
			.company_type{
				width: 73px;
				height: 20px;
				font-size: 12px;
				font-weight: 500;
				color: #909399;
				line-height: 20px;
			}
			.company_des,.company_des_B{
				height: 20px;
				font-size: 12px;
				font-weight: 500;
				color: #67C23A;
				// line-height: 20px;
				background: #F3FFED;
				border-radius: 4px 4px 4px 4px;
				padding: 2px 8px;
				box-sizing: border-box;
				margin-left: 10px;
				align-items: center;
			}
			.company_des_B{
				color: #0072FF;
				background: #EBF4FF;
			}
		}
	}
}
.addressBox{
	width: 100%;
	height: 19px;
	font-size: 12px;
	font-weight: 500;
	color: #606266;
	line-height: 19px;
	display: flex;
	justify-content: flex-start;
	margin: 11px 0;
	margin-top: 0;
	
	.address_ico{
		margin: 0 5px;
	}
}
.line{
		width: 100%;
		height: 1px;
		background: #F0F4F9;
	}
.chargeNameBox{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-top: 11px;
}
.chargeNameBox /deep/ .u-form-item__body{
	padding: 0 !important;
}
.u-loadmore{
	margin: 22px 0 5px 0 !important;
}
.content{
	padding-bottom: 15px;
}
.hasArea{
	margin: 0 10px 0 0;
	height: 19px;
	line-height: 19px;
	display: flex;
	align-items: center;
}
</style>
