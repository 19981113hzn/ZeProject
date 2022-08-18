<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="navTitle"  bgColor="#fff" @leftClick="leftClick" >			
		</u-navbar>
		<view  class="card" v-for="(item, index) in readList" :key="index">
			<view class="card-bg" @click="gotoDetail(item)">
				<view class="card-pa">
					<u-cell >
						<view slot="title" class="u-slot-title">
							<image class="logo" src="/static/img/workbench/icon_read_news.png"></image>
							<text class="u-cell-text">{{item.titile}}</text>
						</view>
						<view slot="value" class="u-slot-value">
							<view v-if="item.readFlag==0" class="spot" :style="{'background-color':'rgba(255, 77, 79, 1)'}"></view>
						</view>
						<view slot="label" class="u-slot-label">
							<image class="logo" src="/static/img/workbench/icon_read_times.png"></image>
							<text class="slot_label">{{item.sendTime}}</text>
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
	import {getMyAnnouncementSend,editMyAnnouncementSend} from "@/util/interface.js"
	export default {
		data() {
			return {
				navTitle:"",
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
			this.navTitle="系统消息";	
			this.getData();
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getData();
		},
		onShow() {
			this.pageNo = 1;
			this.getData();		
		},
		methods: {
			getData(){
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
				;
				getMyAnnouncementSend(data, res => {
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
			//返回上一级
			leftClick(){
				uni.navigateBack();
			},
			gotoDetail(item) {
				let url=item.appOpenPage//"/pages/assist/documentManagement/documentManagement"
				editMyAnnouncementSend(item.id,res=>{
					if(res.code==200 && res.success){
						this.pageNo = 1;
						this.getData();
						uni.navigateTo({
							url: url
						})
					}else{
						uni.$u.toast(res.message);
					}
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
