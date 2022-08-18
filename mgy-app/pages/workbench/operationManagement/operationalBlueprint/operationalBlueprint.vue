<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }" class="container">
		<u-navbar title="销售作战蓝图" bgColor="#fff" @leftClick="leftClick">
			<view class="u-nav-slot" slot="right">
				<image v-if="!isNone" class="logo-icon" src="/static/img/blueprint/blue_sx.png" 
				@click="clickScreen"></image>
				<image class="logo" src="/static/img/assist/icon_file_add.png" @click="gotoNewBlueprint"></image>
			</view>
		</u-navbar>
		<view style="flex: auto; height:auto!important;">
			<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }"
				scroll-y="true" scroll-with-animation="true" @scrolltolower="scrollLoadMoreData" :scroll-top="scrollTop">
				
				<view v-if="!isNone">
					<view class="card" v-for="(item, index) in lstBluePrint" :key="index">
						<view class="card-pa" @click="gotoSalesBattleBlueprint(item)">
							<u-cell :title="item.year+'年销售作战蓝图'">
								<view slot="label" class="u-slot-label">
									<text class="u-cell__label">{{item.userName}}&emsp; | &emsp;资料完善度</text>
									<view class="block">
										<view class="block_bg" 
										:style="{'width':(item.perfection || 0)+'px','background':'rgba(0, 114, 255, 1)'}"></view>
									</view>
									 <view class="text-group_2">
									  <text lines="1" class="text_10">{{(item.perfection || 0)+'%'}}</text>
									</view>
								</view>
							</u-cell>
						</view>
					</view>
					<u-loading-icon v-if="!isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
					<u-empty v-if="lstBluePrint.length==0 && isLoading" mode="data"
						icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
					<u-loadmore v-if="lstBluePrint.length>0" :status="status" :loading-text="loadingText"
						:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
						
				</view>
				<view v-if="isNone">
					<u-empty  text="暂无蓝图" width="84" height="84"
						icon="/static/img/blueprint/blue_empty.png">
						<u-button color="rgba(0, 114, 255, 1)" shape="circle"
						:style="{marginTop:19+'px'}" text="去新建" @click="gotoNewBlueprint">	</u-button>
					</u-empty>
				</view>
				 <u-datetime-picker :show="showYear" v-model="value1"  mode="year"></u-datetime-picker>
				
			</scroll-view>
		</view>
		<view class="foot-height" v-if="!isNone">
			<view style="padding: 16px 126px;">
				<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="添加" @click="gotoNewBlueprint">
				</u-button>
			</view>
		</view>
		<u-picker :show="showYear" :columns="columnsYear" closeOnClickOverlay title="选择年份"
			@close="showYear=false" @cancel="showYear=false" @confirm="confirmYear"></u-picker>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getBluePrintList,
		addBluePrint,
		getUserListByUserId
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				scrollTop:0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				lstBluePrint:[],
				isNone:false,
				showYear:false,
				columnsYear: [],
				value1: Number(new Date()),
				pageNo: 1,
				maxPage: 1,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isLoading: false, //加载中
				firstTime:false,
				lstScreen: [{
						type: 1, //1多选  2选择时间 3收入费用
						title: "作战蓝图分类",
						defaultSelectedIndex: "0",
						isMutiple: false, //是否多选
						lst: [{
								name: "全部作战蓝图",
								value: "0"
							},
							{
								name: "我的作战蓝图",
								value: "1"
							},
							{
								name: "下属作战蓝图",
								value: "2"
							},
						]
					},
					{
						type: 4, //1多选  2选择时间 3收入费用 4单选年份
						title: "目标年份",
						year:"",
						lst:[],
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "所属人员",
						defaultSelectedIndex: [],
						isMore: true,
						isMutiple: true,
						moreTitle: "更多",
						total: "", //点击获取跟多的时候，需要获取，进行查询
						lst: [{
								name: "周小康",
								value: 1
							},
							{
								name: "周小康",
								value: 2
							},
							{
								name: "周小康",
								value: 3
							},
							{
								name: "周小康",
								value: 4
							},
							{
								name: "周小康",
								value: 5
							},
						]
					},
				],
				selectInfo:{
					sign:0,//作战蓝图分类
					year:"",//目标年份
					userIdList:"",//所属人员
				},
			}
		},
		onLoad(){
			this.getYearData();
			this.getTopHeight();
			this.getUserList();
			this.getData();
		},
		onShow() {
			this.pageNo = 1;
			uni.$once('result', res => {
				console.log('onresult res', res);
				for (let i = 0; i < res.length; i++) {
					let item = res[i];
					if (item.title == "作战蓝图分类") {
						this.selectInfo.sign = item.defaultSelectedIndex;
					}
					if (item.title == "目标年份") {
						this.selectInfo.year = isEmpty(item.year) ?  '': item.year.slice(0, item.year.length-1);
					}
					if (item.title == "所属人员") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.userIdList = SelectedIndex;
					}
				}
				console.log('selectInfo:', this.selectInfo)
				this.getData();
			});
			
		},
		methods: {
			getData(){
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					(isEmpty(this.selectInfo.year)?"":("&year="+this.selectInfo.year))
					+
					"&listType="+this.selectInfo.sign
					+
					(!isEmpty(this.selectInfo.userIdList) ? ("&userIdList=" + this.selectInfo
							.userIdList) :
						'') //所属人员
				;
				getBluePrintList(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res);
						if (this.pageNo == 1) {
							this.lstBluePrint = isEmpty(res.result) ? [] : res.result.records;
							this.scrollTop=0
							if(!this.firstTime){
								this.isNone=this.lstBluePrint.length>0 ?false:true
							}
							
						} else {
							this.lstBluePrint = this.lstBluePrint.concat(res.result.records)
						}
						this.maxPage = isEmpty(res.result) ? this.maxPage : res.result.pages
						if (this.pageNo >= this.maxPage) this.status = 'nomore';
						else this.status = 'loading';
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			},
			scrollLoadMoreData(){
				if (this.pageNo >= this.maxPage) return;
				this.status = 'loading';
				this.pageNo = this.pageNo + 1;
				this.getData();
			},
			getTopHeight() {
				let that = this;
				uni.getSystemInfo({
					success: function(e) {
						//48为自定义导航高度，一般为44
						let topPx = getApp().globalData.statusBarHeight //顶部状态栏+沉浸式自定义顶部导航栏
						that.topheight = topPx / (uni.upx2px(topPx) / topPx) //px转rpx,这里必须转换为rpx,不然适配失败
					}
				})
			},
			getYearData() {
				let date = new Date()
				let year = date.getFullYear();
				let arr = [];
				for (let i = 0; i < 10; i++) {
					arr.push((year + i)+"年")
				}
				this.columnsYear.push(arr)
				for (let i = 0; i < this.lstScreen.length; i++) {
					if (this.lstScreen[i].title == "目标年份") {
						this.lstScreen[i].lst = arr;
					}
					// if (this.lstScreen[i].title == "客户级别" && dictCode == 'customer_level') {
					// 	this.lstScreen[i].lst = lst;
					// }
				}
			},
			//所属人员
			getUserList() {
				let data = "?realname=" + "" +
					"&pageNo=" + "1" +
					"&pageSize=" + "5";
				getUserListByUserId(data, res => {
					if (res.code == 200 && res.success) {
						let data = [];
						for (let j = 0; j < res.result.records.length; j++) {
							data.push({
								name: res.result.records[j].realname,
								value: res.result.records[j].id,
								id: res.result.records[j].id
							})
						}
						for (let i = 0; i < this.lstScreen.length; i++) {
							if (this.lstScreen[i].title == "所属人员") {
								this.lstScreen[i].lst = data;
								this.lstScreen[i].total = res.result.total;
								//this.chargeMan=data.length>0?data[0].value:"";
							}
						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			gotoNewBlueprint(){
				this.showYear=true;
			},
			confirmYear(e) {				
				let year = isEmpty(e.value[0]) ?  '': e.value[0].slice(0, e.value[0].length-1);
				let data={
					year:year,
					perfection:0,
				}
				console.log(data)
				if(!this.isClick){
					this.isClick = true;
					this.showYear = false;
					addBluePrint(data,res=>{
						this.isClick = false;
						if (res.code == 200 && res.success) {
							this.pageNo=1;
							this.getData();
							// setTimeout(() => {
							// 	this.gotoSalesBattleBlueprint(res.result);
							// }, 800)
						} else {
							uni.$u.toast(res.message);
						}
					})
				}
				
				
			},
			gotoSalesBattleBlueprint(item){
				let id=item.id
				let userName=item.userName
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/salesBattleBlueprint?id="+id +"&userName="+userName
				})
			},
			
			clickScreen(){
				if (!this.firstTime) {
					this.firstTime = true;
					uni.setStorageSync('_lstScreen', this.lstScreen) //1*60*60*24*7
					uni.setStorageSync('OldLstScreen', this.lstScreen) //1*60*60*24*7
				}
				uni.navigateTo({
					url: "/pages/filter-all/filter-all?type=5"
				});
			},
			leftClick(){
				uni.navigateBack()
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

	.logo-icon {
		width: 24px;
		height: 24px;
		right: 12px;
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
			//background: #fff;
			//border-top: 1px solid #f0f4f9;
			
			.uni-input-placeholder {
				text-align: right;
				color: rgba(0, 114, 255, 1) !important;
			}
			
			.u-input__content__field-wrapper__field {
				text-align: right !important;
				color: rgba(0, 114, 255, 1) !important;
			}
			.u-button__text{
				font-size: 16px !important;
			}
		}
		
		.card{
			padding: 8px 16px 0 16px;
			
			.card-pa {
				padding: 0 16px 0px;
				background: #fff;
				border-radius: 10px;
				.u-cell__body{
					padding: 10px 0px;
					.u-cell__title-text{
						font-size: 16px;
						line-height: 25px;
						font-weight: bold;
						color: rgba(48, 49, 51, 1);
					}
					.u-cell__label{
						font-size: 12px;
						line-height: 35px;
						color: rgba(96, 98, 102, 1);
					}
					.block{
						width: 100px;
						height: 5px;
						background: #f0f0f0;
						display: inline-block;
						border-radius: 6px;
						margin-left: 8px;
					}
					.block_bg{
						width: 50px;
						height: 5px;
						background-size: 100% 100%;
						float: left;
					}
					.text-group_2 {
						width: 54rpx;
						height: 62rpx;
						display: inline-block;
						flex-direction: column;
						justify-content: space-between;
						margin-left: 8px;
					}
					.text_10 {
						width: 54rpx;
						color: rgba(96, 98, 102, 1);
						font-size: 12px;
						text-align: left;
						white-space: nowrap;
					}
				}
				.u-line {
					border: none !important;
				}
			}
		}
		
		.u-empty{
			margin-top: 172px !important;
			.u-button--circle{
				width: 104px;
			}
			.u-button__text{
				font-size: 16px !important;
			}
		}
	}
</style>
