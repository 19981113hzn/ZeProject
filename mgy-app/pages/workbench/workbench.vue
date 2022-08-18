<template>
	<view>
		<u-navbar leftIcon="" title="工作台" :border="true" bgColor="#E7F3FF"></u-navbar>
		<view class="main-top">
			<u-row gutter="10" customStyle="margin-bottom: 10px">
				<u-col span="6">
					<view class="card-bg" @click="gotoAccounting">
						<view class="card-bg-size">
							<u--image :showLoading="true" src="/static/img/workbench/icon_finance.png" width="48px"
								height="48px"></u--image>
							<text>财务管理</text>
						</view>
					</view>
				</u-col>
				<u-col span="6">
					<view class="card-bg" style="background-color: rgb(225 227 231);">
						<view class="card-bg-size">
							<u--image :showLoading="true" src="/static/img/workbench/icon_project.png" width="48px"
								height="48px"></u--image>
							<text>项目管理</text>
						</view>
					</view>
				</u-col>
			</u-row>
			<u-row gutter="10" customStyle="margin-bottom: 10px">
				<u-col span="6">
					<view class="card-bg" style="background-color: rgb(225 227 231);">
						<view class="card-bg-size">
							<u--image :showLoading="true" src="/static/img/workbench/icon_schedule.png" width="48px"
								height="48px"></u--image>
							<text>日程管理</text>
						</view>
					</view>
				</u-col>
				<u-col span="6">
					<view class="card-bg" @click="gotoOperation">
						<view class="card-bg-size">
							<u--image :showLoading="true" src="/static/img/workbench/icon_management.png" width="48px"
								height="48px"></u--image>
							<text>经营管理</text>
						</view>
					</view>
				</u-col>
			</u-row>
			<view class="technological" @click="gotoProcessCenter">流程中心</view>
			<view class="card" v-if="TaskList.length>0">
				<view class="card-main-bg">
					<view class="card-main-pa">
						<u-cell title="待我处理" isLink @click="gotoNeedDealtWith"></u-cell>
						<view style="flex: auto; height:auto!important;">
							<scroll-view
								:style="{ 'top': (statusBarHeight+48) + 'px','bottom':'60px','height': '271px' }" scroll-y="true"
								:scroll-top="scrollTop" scroll-with-animation="true" 	@scrolltolower="scrollLoadMoreData">
								<view v-for="(item,Index) in TaskList" :key="Index">
									<view class="card-main" @click="gotoDetail(item)" :style="{'border-left-color':
									((Index+1)%4==0?'rgba(73, 190, 245, 1)':
									((Index+1)%4==3?'rgba(251, 91, 88, 1)':
									((Index+1)%4==2?'rgba(80, 159, 247, 1)':'rgba(254, 189, 51, 1)')))}">
										<u-cell>
											<view slot="title" class="u-slot-title">
												<!-- <image class="logo" src="/static/img/workbench/icon_read_news.png"></image> -->
												<text class="card-main-txt">{{item.applyName+'的'+item.processName}}</text>
											</view>
											<u-tag v-if="item.processStatus==1" slot="value" text="发起申请"
												bgColor="rgba(255, 248, 242, 1)" borderColor="rgba(255, 248, 242, 1)"
												color="rgba(255, 147, 48, 1)" size="mini">
											</u-tag>
											<u-tag v-if="item.processStatus==2" slot="value" text="待审批"
												bgColor="rgba(235, 244, 255, 1)" borderColor="rgba(235, 244, 255, 1)"
												color="rgba(0, 114, 255, 1)" size="mini">
											</u-tag>
											<u-tag v-if="item.processStatus==3" slot="value" text="通过"
												bgColor="rgba(243, 255, 237, 1)" borderColor="rgba(243, 255, 237, 1)"
												color="rgba(103, 194, 58, 1)" size="mini">
											</u-tag>
											<u-tag v-if="item.processStatus==4" slot="value" text="不通过"
												bgColor="rgba(241, 245, 250, 1)" borderColor="rgba(241, 245, 250, 1)"
												color="rgba(144, 147, 153, 1)" size="mini">
											</u-tag>
											<u-tag v-if="item.processStatus==5" slot="value" text="驳回"
												bgColor="rgba(255, 248, 242, 1)" borderColor="rgba(255, 248, 242, 1)"
												color="rgba(255, 147, 48, 1)" size="mini">
											</u-tag>
											<u-tag v-if="item.processStatus==6" slot="value" text="已撤销"
												bgColor="rgba(241, 245, 250, 1)" borderColor="rgba(241, 245, 250, 1)"
												color="rgba(144, 147, 153, 1)" size="mini">
											</u-tag>
											<view slot="label" class="u-slot-label">
												<text class="card-main-txt">接收时间：{{item.receiveTime}}</text>
											</view>
										</u-cell>
									</view>
								</view>
								<u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
								<u-empty v-if="TaskList.length==0 && isLoading" mode="data"
									icon="http://cdn.uviewui.com/uview/empty/data.png">
								</u-empty>
								<u-loadmore v-if="TaskList.length>0" :status="status" :loading-text="loadingText"
									:loadmore-text="loadmoreText" :nomore-text="nomoreText" />
							</scroll-view>
						</view>
					</view>

				</view>
			</view>
			
			<view style="height: 60px;"></view>
		</view>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getTodoTaskList,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				scrollTop: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				isLoading: false,
				pageNo: 1,
				maxPage: 1,
				TaskList: [],
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
			}
		},
		created() {
			this.getData();
			this.getTopHeight()
		},
		activated() {
			this.getData();
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getData();
			
		},
		methods: {
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
			scrollLoadMoreData(){
				if (this.pageNo >= this.maxPage) return;
				this.status = 'loading';
				this.pageNo = this.pageNo + 1;
				this.getData();
			},
			//待办
			getData() {
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
				;
				getTodoTaskList(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.TaskList = res.result.records;
						} else {
							this.TaskList = this.TaskList.concat(res.result.records)
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
			//待我处理
			gotoDetail(item) {
				uni.setStorageSync('reimbursDetails', item)
				
				if(item.bizCode=="SUMEXPENSE"){ //报销申请
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/reimburseManagement/reimbursementDetails?isNeedWith=true"
					})
				}
				else if(item.bizCode=="COLLECTION"){ //回款管理
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/collectionManagement/collectionDetail?isNeedWith=true"
					})
				}
				else if(item.bizCode=="PRODUCTQUOTE"){ //产品报价
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/quotationManagement/detail?isNeedWith=true&id="+item.bizId
					})
				}
			},
			//跳转到待办列表
			gotoNeedDealtWith(){
				uni.navigateTo({
					url: "/pages/workbench/processCenter/needToBeDealtWith?type=1"
				})
			},
			//经营管理
			gotoOperation(){
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationManagement"
				})
			},
			//流程中心
			gotoProcessCenter() {
				uni.navigateTo({
					url: "/pages/workbench/processCenter/processCenter"
				})
			},
			//财务管理
			gotoAccounting() {
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/accountingManagement"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.main-top {
		margin: 58px auto 0 auto;
		padding: 0 16px;
	}
	/deep/.scrool-more {
			// position: absolute;
			// left: 0;
			// right: 0;
			// top: 0;
			// bottom: 0;
		}
	.card-bg {
		background: #fff;
		height: 100px;
		border-radius: 15px;

		.card-bg-size {
			width: 66px;
			margin: 10px auto;
		}

		/deep/.u-image {
			margin: auto auto 5px;
		}

		text {
			//font-size: 14px;
			color: rgba(48, 49, 51, 1);
			text-align: center;
			display: block;
		}
	}

	.technological {
		background: #509FF7FF;
		height: 56px;
		border-radius: 15px;
		text-align: center;
		line-height: 56px;
		//font-size: 14px;
	}

	.card {
		padding: 16px 0 0 0;

		.card-main-bg {
			width: 100%;
			border-radius: 8px;
			background: #fff;

			.card-main-pa {
				padding: 0 16px 10px;

				/deep/.u-cell__body {
					padding: 10px 0px;
					background:#fff;
					.u-cell__title-text {
						//font-size: 16px;
						color: rgba(48, 49, 51, 1);
					}

				}

				/deep/.u-line {
					border-bottom: none !important;
				}

				.card-main {
					height: 56px;
					border-left: 3px solid;
					border-left-color: rgba(254, 189, 51, 1);
					margin-top: 10px;

					.card-main-txt {
						display: block;
						line-height: 28px;
						font-size: 14px;
						color: rgba(96, 98, 102, 1);
					}

					/deep/.u-cell__body {
						padding: 0px 0px 10px 15px;

						.u-cell__title-text {
							//font-size: 16px;
							color: rgba(48, 49, 51, 1);
						}

					}
				}
			}
		}
	}
</style>
