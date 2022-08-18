<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="资源分析" bgColor="#fff" @leftClick="leftClick"></u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999" >
			<u-tabs :list="listTabs" :scrollable="false" lineWidth="59" @click="clickTabs" :current="current"
			lineColor="#0072FF"
			:activeStyle="{
			       color: '#0072FF',
			   }"></u-tabs>
		</u-sticky>
		<view style="flex: auto; height:auto!important;">
			<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight+48 + 'px','bottom':'72px' }"
				scroll-y="true" scroll-with-animation="true" @scrolltolower="scrollLoadMoreData" :scroll-top="scrollTop">
				
				<view v-if="!isNone">
					<view v-if="current==0 || current==2">
					    <u-swipe-action autoClose>
							<view class="card" v-for="(item, index) in currentList" :key="index">
								<u-swipe-action-item
								  :options="options1"
								   @click="bindClick(item.id);"
								>
								<view class="card-bg" @tap.stop="gotoDetail(item.id)">
									<u--text class="txt" :lines="3" :text="item.content"></u--text>
								</view>
								</u-swipe-action-item>
							</view>
					        
					    </u-swipe-action>
					</view>
					<view v-if="current==1">
					    <u-swipe-action>
							<view class="card" v-for="(item, index) in currentList" :key="index">
								<u-swipe-action-item
									:options="options1"
									@click="bindClick(item.id)"
								>
									<view class="card-bg" @tap.stop="gotoDetail(item.id)">
										<u--text class="txt-xz" :text="'协助人:'+(item.assistNames || '')"></u--text>
										<u--text class="txt" :lines="2" :text="item.content"></u--text>
									</view>
								</u-swipe-action-item>  
							</view>
					    </u-swipe-action>
					</view>
					<u-loading-icon v-if="!isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
					<u-empty v-if="currentList.length==0 && isLoading" mode="data"
						icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
					<u-loadmore v-if="currentList.length>0" :status="status" :loading-text="loadingText"
						:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
				</view>
				<view v-if="isNone">
					<u-empty  text="暂无资源" width="84" height="84"
						icon="/static/img/icon_PDF.png">
						<u-button color="rgba(0, 114, 255, 1)" shape="circle"
						:style="{marginTop:19+'px'}" text="去添加" @click="gotoNewResource">	</u-button>
					</u-empty>
				</view>
				
			</scroll-view>
		</view>
		<view class="foot-height" v-if="!isNone">
			<view style="padding: 16px 126px;">
				<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="添加" @click="gotoNewResource">
				</u-button>
			</view>
		</view>
		
		
		<view>
			
			
		</view>
		
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getBlueprintPersonalList,
		deleteBlueprintPersonalById,
		getBlueprintContractorList,
		deleteBlueprintContractorById,
		getBlueprintCompanyList,
		deleteBlueprintCompanyById,
		
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				scrollTop:0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				listTabs: [{
					name: '个人资源',
				}, {
					name: '公司资源',
				}, {
					name: '厂商资源'
				}],
				current: 0,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isLoading:false,
				isNone:false,
				options1: [{
					//text: '删除',
					icon: "/static/img/blueprint/blue_delete.png",
					iconSize:24,
					style: {
						backgroundColor: '#f56c6c'
					}
				}],
				blueprintId:"",
				yearValue:"",
				pageNo:1,
				maxPage: 1,
				currentList:[],
				selectIndex:0,
			}
		},
		onLoad(option) {
			this.blueprintId = option.blueprintId || "";
			this.yearValue = option.yearValue || "";
			this.current = parseInt(option.type) || 0;
			this.getData();
			this.getTopHeight();
		},
		onShow(){
			uni.$once('returnResources', res => {
				this.current=parseInt(res);
				this.pageNo=1;
				this.scrollTop=0;
				this.currentList=[];
				this.getData();
			})
		},
		methods: {
			getData(){
				this.isLoading = false;
				this.isNone=false;
				let request;
				switch (this.current) {
					case 0:
						request = getBlueprintPersonalList;
						break;
					case 1:
						request = getBlueprintCompanyList;
						break;
					case 2:
						request = getBlueprintContractorList;
						break;
				}
				let params="?pageNo="+this.pageNo+"&pageSize=10&blueId="+this.blueprintId
				request(params,res=>{
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.currentList = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.currentList = this.currentList.concat(res.result.records)
						}
						if(this.currentList.length==0){
							this.isNone=true;
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
			leftClick(){
				uni.navigateBack();
			},
			scrollLoadMoreData(){
				if (this.pageNo >= this.maxPage) return;
				this.status = 'loading';
				this.pageNo = this.pageNo + 1;
				this.getData();
			},
			clickTabs(item) {
				this.current = item.index
				this.pageNo=1;
				this.getData();
			},
			//添加
			gotoNewResource(){
				uni.redirectTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/addResources?type="+this.current +"&blueprintId="+this.blueprintId +"&yearValue="+this.yearValue
				})
			},
			//详情
			gotoDetail(id){
				uni.redirectTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/addResources?type="+this.current +"&id="+id+"&blueprintId="+this.blueprintId +"&yearValue="+this.yearValue
				})
			},
			//点击删除
			bindClick(e){
				console.log(e);
				let request;
				switch (this.current) {
					case 0:
						request = deleteBlueprintPersonalById;
						break;
					case 1:
						request = deleteBlueprintCompanyById;
						break;
					case 2:
						request = deleteBlueprintContractorById
						break;
				}
				let params="?id=" + e
				request(params,res=>{
					if (res.code == 200 && res.success) {
						uni.showToast({
							title: res.message
						});
						this.pageNo=1;
						this.scrollTop=0;
						this.currentList=[];
						this.getData();
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}
	/deep/.u-tabs__wrapper {
		border-bottom: 1px solid;
		border-bottom-color: #eee;
		background: #fff;
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
	/deep/{
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
			padding: 8px 16px 0px;
			.u-swipe-action-item{
				border-radius: 4px;
			}
			.card-bg{
				padding: 16px;
				background: #fff;
				.txt-xz .u-text__value{
					color: #909399 !important;
					font-size: 14px !important;
				}
				.txt{
					color: #606266 !important;
					font-size: 15px !important;
				}
			}
		}
	
	}

</style>
