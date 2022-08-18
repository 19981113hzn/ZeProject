<template>
	<view class="content" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="商机管理" bgColor="#fff" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>

		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="搜索" bgColor="rgba(244, 246, 250, 1)" :clearabled="true"
					@change="searchChange"></u-search>
				<text class="sticky-txt" @click="clickScreen">筛选</text>
			</view>
		</u-sticky>

		<view class="list">
			<view class="list_item" @click="showBusiness">
				<view class="left">
					<text class="left_bord"></text>
					<text class="text">目标客户</text>
					<text class="percent">10%</text>
				</view>
				<view class="right">
					<text style="font-size: 11px;padding-right: 8px; color: #909399">¥10,000.00/10个</text>
					<u-icon v-if="select" size="20" name="arrow-down"></u-icon>
					<u-icon v-else size="20" name="arrow-right"></u-icon>
				</view>
			</view>

			<!-- 卡片区域 -->
			<view v-if="select">
				<view class="card" v-for="(item, index) in lstBusiness" :key="index">
					<view class="card-pa">
						<view>
							<u-cell title="商机标题">
								<text slot="value" class="u-slot-value" @tap.stop = 'gotoDetail(item)'>潜在商机</text>
							</u-cell>

							<u--form labelWidth="100">
								<u-form-item label="负责人员">
									<text style="margin-left: -30px;">赵小刚</text>
								</u-form-item>
								<u-form-item label="预计销售金额">
									<text>¥ 10,000.00</text>
								</u-form-item>
								<u-form-item label="预计签单日期">
									<text>2019-04-01</text>
								</u-form-item>
							</u--form>
						</view>
						<u-tabs :list="listTabs" :scrollable="false" lineColor="transparent" @click="businessInfo=item"
							@change="clickTabs"></u-tabs>
					</view>
				</view>
			</view>

			<u-loading-icon v-if="!isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
			<u-empty v-if="lstBusiness.length==0 && isLoading" mode="data"
				icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		</view>
		<u-action-sheet title="更多" :show="showAction" :closeOnClickOverlay="true" :round="24" @close="showAction=false">
			<u-grid :border="false" col="5" @click="clickGrid">
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/business/more_transfer.png"></image>
					</view>
					<text class="grid-text">转移商机</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/business/more_competitor.png"></image>
					</view>
					<text class="grid-text">添加协作</text>

				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/business/more_change.png"></image>
					</view>
					<text class="grid-text">变更状态</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/business/more_addPrice.png"></image>
					</view>
					<text class="grid-text">添加报价</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/business/more_file.png"></image>
					</view>
					<text class="grid-text">相关附件</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/business/more_edit.png"></image>
					</view>
					<text class="grid-text">编辑商机</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/business/more_delete.png"></image>
					</view>
					<text class="grid-text">删除商机</text>
				</u-grid-item>
			</u-grid>
		</u-action-sheet>

	</view>
</template>

<script>
	import {
		js_date_time
	} from "@/util/js_DateTime.js"
	import {
		getUserInfoByToken,
		getDictItemsByCode,
		getBusinessList,
		getSysCustomer
	} from "@/util/interface.js"
	export default {

		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44,
				topheight: 0,
				showAction: false,
				select: false,
				pageNo: 1,
				maxPage: 1,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isLoading: false,
				listTabs: [{
					name: '跟进',
					image: {
						direction: "left", // 方向 左右 {left / right}
						src: "/static/img/assist/icon_follow_up.png", //图片路径
						width: "16px",
						height: "16px",
					},
				}, {
					name: '电话',
					image: {
						direction: "left", // 方向 左右 {left / right}
						src: "/static/img/assist/icon_telephone.png", //图片路径
						width: "16px",
						height: "16px",
					},
				}, {
					name: '更多',
					image: {
						direction: "right", // 方向 左右 {left / right}
						src: "/static/img/assist/icon_more.png", //图片路径
						width: "16px",
						height: "16px",
					},
				}],
				businessInfo: {}, //客户数据
				lstBusiness: [],



			}
		},
		onLoad() {
			this.getTopHeight()
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getData();
		},
		onShow() {
			this.pageNo = 1
			this.getData()
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

			// 分页列表数据
			getData() {
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小

				// getBusinessList(data, res => {
				// 	if (res.code == 200 && res.success) {
				// 		if (this.pageNo == 1) {
				// 			this.lstBusiness = res.result.records;
				// 		} else {
				// 			this.lstBusiness = this.lstBusiness.concat(res.result.records)
				// 		}
				// 		this.maxPage = res.result.pages
				// 		if (this.pageNo >= this.maxPage) this.status = 'nomore';
				// 		else this.status = 'loading';
				// 	} else {
				// 		uni.$u.toast(res.message);
				// 	}
				// 	this.isLoading = true;
				// })

				// 商机分类接口暂时没写好，先用客户档案的接口调试
				getSysCustomer(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.lstBusiness = res.result.records;
						} else {
							this.lstBusiness = this.lstBusiness.concat(res.result.records)
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
			showBusiness() {
				console.log('展开');
				this.select = !this.select
			},
			//搜索
			searchChange() {
				console.log(666);
				// this.pageNo = 1
				// this.getData();
			},

			clickScreen() {
				console.log(111);
				// if (!this.firstTime) {
				// 	this.firstTime = true;
				// 	uni.setStorageSync('_lstScreen', this.lstScreen) //1*60*60*24*7
				// 	uni.setStorageSync('OldLstScreen', this.lstScreen) //1*60*60*24*7
				// }
				// uni.navigateTo({
				// 	url: "/pages/filter-all/filter-all?type=4"
				// });
			},
			// 标签栏
			clickTabs(item) {
				console.log(item)
				console.log(this.businessInfo)
				switch (item.index) {
					case 0: //跟进
						const params = {
							id: this.businessInfo.id,
							name: this.businessInfo.name
						}
						uni.navigateTo({
							url: "/pages/assist/customerManagement/newFollowUp?type=add&params=" + JSON.stringify(
								params)
						})
						break;
					case 1: //电话
						this.phone(this.businessInfo.phoneNumber);
						break;
					case 2: //更多
						this.showAction = true;
						break;
					default:
						break;
				}
			},

			//刷新页面
			refresh() {
				uni.redirectTo({
					url: '/pages/business/board/board'
				});
			},

			//返回上一级
			leftClick() {
				uni.navigateBack();
			},
			//右上角
			rightClick() {
				console.log(999);
				// this.ShowHidden = true;
			},
			// 更多 ==》点击选择
			clickGrid(name) {
				this.showAction = false;
				switch (name) {
					case 0: //转移客户
						uni.navigateTo({
							url: "/pages/assist/customerManagement/transferCustomers?id=" + this.businessInfo.id
						})
						break;
					case 1: //重点关注或者取消关注
						this.editCollect();
						break;
					case 2: //编辑客户
						uni.navigateTo({
							url: "/pages/assist/customerManagement/newCustomer?returnPageNumber=1&isUpdata=true&customerId=" +
								this.businessInfo.id
						})
						break;
					case 3: //
						this.showDelete = true;
						break;
					default:
						break;
				}
			},
			gotoDetail(item){
				console.log('item:',item)
				// uni.navigateTo({
				// 	url: "/pages/business/detail/detail?id=" + this.businessInfo.id
				// })
			}
		},



	}
</script>

<style scoped lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.content {
		.u-nav-slot {

			.logo {
				width: 24px;
				height: 24px;
				top: 3px;
			}
		}

		.sticky-title {
			height: 48px;
			background: #fff;
			border-top: 1px solid;
			border-top-color: rgba(0, 0, 0, 0.05);
			padding: 0 16px;

			/deep/.u-search {
				margin-top: 8px !important;
				width: 85%;
			}

			.sticky-txt {
				float: right;
				font-size: 16px;
				color: rgba(48, 49, 51, 1);
				margin-top: -30px;
			}
		}

		.list {
			padding: 8px 16px 0 16px;

			.list_item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 14px 10px;
				font-size: 16px;
				background-color: #fff;
				border-radius: 4px;
				text-align: center;

				.left {
					display: flex;
					align-items: center;

					.left_bord {
						display: inline-block;
						width: 4px;
						// height: 13px;
						background: #0072FF;
						border-radius: 3px 3px 3px 3px;
						opacity: 1;
						padding: 7.5px 0;
						margin-top: 5rpx;
					}

					.text {
						// width: 4px;
						// height: 13px;
						font-size: 16px;
						font-family: PingFang SC-Bold;
						font-weight: bold;
						color: #303133;
						padding-right: 6px;
						padding-left: 12px;
						border-left: #0072FF;
						border-radius: 3px 3px 3px 3px;
						opacity: 1;
					}

					.percent {
						color: #0072FF;
					}
				}

				.right {
					display: flex;
				}

			}
		}

		/deep/.card {
			padding: 8px 0 0 0;

			.card-pa {
				padding: 0 16px 0px;
				background: #fff;
				border-radius: 10px;

				.u-slot-value {
					// width: 44px;
					height: 15px;
					padding: 0 8px;
					font-size: 11px;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #67C23A;
					background-color: #F3FFED;
					line-height: 13px;

				}

				.u-line {
					border: none !important;
				}

				.u-cell__body {
					padding: 10px 0px 0px;

					.u-cell__title-text {
						color: #303133;
						font-size: 14px;
						font-weight: bold;
						color: rgba(48, 49, 51, 1);
					}

					.logo {
						width: 24px;
						height: 24px;
					}

					.logo-icon {
						background: rgba(223, 237, 255, 1);
						width: 40px;
						height: 40px;
						border-radius: 8px;
						display: flex;
						justify-content: center;
						align-items: center;

						.logo-icon-txt {
							font-size: 12px;
							text-align: center;
							border-radius: 5px;
							padding: 4px;
							color: rgba(0, 114, 255, 1);
							font-weight: bold;
						}
					}
				}

				.u-form-item__body {
					padding: 10px 0 0;
					// display: flex;

					.u-form-item__body__left__content__label {
						font-size: 14px;
						color: rgba(116, 121, 136, 1);
					}

					.u-form-item__body__right__content__slot {
						font-size: 14px;
						color: rgba(48, 49, 51, 1);
					}
				}

				.u-tabs__wrapper__nav {
					margin-top: 16px;
					border-bottom: none !important;
					border-top: 1px solid;
					border-top-color: rgba(0, 0, 0, 0.05);
				}
			}

		}
	}

	/deep/ {
		.grid-img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			background: rgba(247, 248, 250, 1);

			.logo {
				width: 24px;
				height: 24px;
				top: 13px;
			}
		}

		.u-grid {
			padding: 16px 16px 32px;
		}

		.grid-text {
			font-size: 12px;
			color: rgba(0, 0, 0, 0.65);
			padding: 20rpx 0 20rpx 0rpx;
			/* #ifndef APP-PLUS */
			box-sizing: border-box;
			/* #endif */
		}
	}

	/deep/.u-tabs__wrapper__nav__item__text {
		color: #606266 !important;
	}
</style>
