<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="navTitle"  bgColor="#fff" @leftClick="leftClick" >			
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="请输入流程名称查询" bgColor="rgba(244, 246, 250, 1)"
				v-model="selectInfo.searchValue" :clearabled="true" @change="searchChange"></u-search>
				<text class="sticky-txt" @click="clickScreen">筛选</text>
			</view>
			
		</u-sticky>
		<view  class="card" v-for="(item, index) in readList" :key="index">
			<view class="card-bg" @click="gotoDetail(item)">
				<view class="card-pa">
					<u-cell >
						<view slot="title" class="u-slot-title">
							<image class="logo" src="/static/img/workbench/icon_read_news.png"></image>
							<text class="u-cell-text">{{item.forwardUserName}}转发了{{item.applyName}}发起的《{{item.processName}}》给您查阅</text>
						</view>
						<view slot="value" class="u-slot-value">
							<view v-if="type==1" class="spot" :style="{'background-color':'rgba(255, 77, 79, 1)'}"></view>
						</view>
						<view slot="label" class="u-slot-label">
							<image class="logo" src="/static/img/workbench/icon_read_times.png"></image>
							<text class="slot_label">{{item.receiveTime}}</text>
						</view>
					</u-cell>
				</view>
			</view>
		</view>
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<u-empty v-if="readList.length==0 && isLoading" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<u-loadmore v-if="readList.length>0" :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" />
		
	</view>
</template>

<script>
	import {isEmpty} from "@/util/common.js"
	import {GetNowFormatDate} from "@/util/js_DateTime.js"
	import {getProcessNoticeList,updateIsReadByIds,getUserListByUserId} from "@/util/interface.js"
	export default {
		data() {
			return {
				navTitle:"",
				type:0,//1待阅，2已阅topheight:0,
				statusBarHeight:getApp().globalData.statusBarHeight+44,//状态栏高度
				topheight:0,
				firstTime:false,//第一次点击筛选
				isLoading:false,
				readList:[],
				lstScreen: [{
						type: 1, //1多选  2选择时间 3收入费用
						title: "发起人",
						defaultSelectedIndex: [],
						isMore: true, //是否显示更多按钮
						isMutiple: true,
						isRequired: true, //是否跳转页面
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
							{
								name: "周小康",
								value: 6
							},
							{
								name: "周小康",
								value: 7
							},
							{
								name: "周小康",
								value: 8
							},
						]
					},
					{
						type: 2, //1多选  2选择时间 3收入费用
						title: "接收时间",
						startTime: "",
						endTime: "",
					},
				
				],
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				pageNo: 1,
				maxPage: 1,
				selectInfo: {
					searchValue: "",
					startTime: "", //开始时间
					endTime: "", //结束时间
					applyIds:"",//
				}
			}
		},
		onLoad(option) {
			let type=isEmpty(option.type)?false:option.type;
			this.type=type
			if(type==1)//待办
			{
				this.navTitle="我的待阅";				
			}else{
				this.navTitle="我的已阅"
			}
			this.getUserList();
			this.getNoticeData();
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getNoticeData();
		},
		onShow() {
			this.pageNo = 1;
			uni.$once('result', res => {
				for (let i = 0; i < res.length; i++) {
					let item = res[i];
					if (item.title == "接收时间") {
						this.selectInfo.startTime = item.startTime;
						this.selectInfo.endTime = item.endTime;
					}
					if (item.title == "发起人") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.applyIds = SelectedIndex;
					}
				}
				console.log(res)
				this.getNoticeData();
			})
			this.getNoticeData();		
		},
		methods: {
			getNoticeData(){
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					"&applyIds="+this.selectInfo.applyIds//发起人id集合，逗号分隔	
					+
					"&processName=" + this.selectInfo.searchValue //流程名称
					+
					"&startTime=" + this.selectInfo.startTime //开始时间
					+
					"&endTime=" + this.selectInfo.endTime //结束时间
					+
					"&status="+(this.type==1?0:1) //状态 0-未读 1-已读	
				;
				getProcessNoticeList(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.readList = res.result.records;
						} else {
							this.readList = this.readList.concat(res.result.records)
						}
						this.maxPage = res.result.pages
						if (this.pageNo >= this.maxPage) this.status = 'nomore';
						else this.status = 'loading';
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			},
			//搜索
			searchChange() {
				this.pageNo = 1
				this.getNoticeData();
			},
			//全部筛选
			clickScreen() {
				if (!this.firstTime) {
					this.firstTime = true;
					uni.setStorageSync('_lstScreen', this.lstScreen) //1*60*60*24*7
					uni.setStorageSync('OldLstScreen', this.lstScreen) //1*60*60*24*7
			
				}
				uni.navigateTo({
					url: "/pages/filter-all/filter-all?type=3"
				});
			},
			//负责人员
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
							if (this.lstScreen[i].title == "发起人") {
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
			//返回上一级
			leftClick(){
				uni.navigateBack();
			},
			gotoDetail(item) {
				uni.setStorageSync('reimbursDetails', item)
				if(this.type==1){
					let ids=[];
					ids.push(item.id)
					updateIsReadByIds(ids,res=>{
						if(res.code==200 && res.success){
							console.log("阅读成功")
						}else{
							uni.$u.toast(res.message);
						}
					})
				}
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/reimburseManagement/reimbursementDetails?isDonedWith=true"
				})
				
			},
			
		},
		onNavigationBarButtonTap(e) { //不需要在<view>里面做任何操作，可直接引用
			if(this.once){
				this.showScreen=true;
				this.once=false
			}else{
				this.showScreen=false;
				this.once=true
			}
		},
	}
</script>

<style lang="scss">	
page{
		background-color: rgba(242, 245, 249, 1);
	}
	.logo{
		width: 18px;
		height: 18px;
		top: 4px;
		right: 4px;
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
	/deep/.card {
		padding: 8px 16px 0 16px;
		.card-bg {
			background: #fff;
			border-radius: 10px;
			.card-pa {
				.u-line{
					border: none !important;
				}
				.u-cell__body{
					font-size: 14px;
					color: rgba(48, 49, 51, 1);					
				}
				.slot_label{
					color: rgba(144, 147, 153, 1);
				}
				.u-text__value span{
					display: block;
					line-height: 22px;
					font-size: 14px;
					color: #000000;
				}
				.spot {
					background-color: rgba(255, 77, 79, 1);
					border-radius: 50%;
					width: 6px;
					height: 6px;
				}
				.txt-size {
					display: block;
					line-height: 30px;
					font-size: 14px;
					color: #909399;
				}
			}
		}
	}
		

</style>
