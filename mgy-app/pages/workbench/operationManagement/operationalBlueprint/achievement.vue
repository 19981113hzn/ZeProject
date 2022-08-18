<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }" class="container">
		<u-navbar title="业绩目标" bgColor="#fff" @leftClick="leftClick">
			<view class="u-nav-slot" slot="right">
				<!-- <image v-if="!isNone" class="logo-icon" src="/static/img/blueprint/blue_sx.png" 
				@click="clickScreen"></image> -->
				<image v-if="!isNone" class="logo" src="/static/img/icon_add.png" @click="gotoAddAchievement"></image>
			</view>
		</u-navbar>
		<view style="flex: auto; height:auto!important;">
			<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }" scroll-y="true"
				scroll-with-animation="true" @scrolltolower="scrollLoadMoreData" :scroll-top="scrollTop">

				<view v-if="!isNone">
					<u-collapse ref="collapseItem" accordion class="see-board" :isLink="false">
						<view style="padding-bottom: 8px;" :name="index1" v-for="(item1, index1) in lstBlueprintTargets"
							:key="index1">
							<u-collapse-item :title="item1.area">
								<view slot="title" class="u-slot-title">
									<text class="u-cell-text">{{item1.area}}</text>
									<text class="title-proportion">{{item1.data.length}}</text>
								</view>
								<!-- <view slot="value" class="u-slot-value">
									<text class="u-cell-text">￥{{item1.expectSaleAmountTotal}}/{{item1.total}}个</text>
								</view> -->
								<view class="u-collapse-content">
									<view class="card" v-for="(item2, index2) in item1.data" :key="index2">
										<view class="card-pa">
											<view @click="gotoDetail(item2)">
												<u-cell :title="item2.industry_dictText">
												</u-cell>
												<view class="charts">
													<view class="charts-box">
														<u-cell>
															<image class="logo_ico" slot="icon"
																src="/static/img/blueprint/blue_ndmb.png"></image>
															<view slot="title" class="u-slot-title">
																<text class="title-name">年度目标</text>
															</view>
														</u-cell>
														<view>
															<text class="txt-num">{{item2.totalAmount}}</text>
															<text class="txt">{{item2.unit_dictText}}</text>
														</view>
													</view>
													<view class="shuxian"></view>
													<view class="charts-box">
														<view style="margin-left: 50px;">
															<u-cell>
																<image class="logo_ico" slot="icon"
																	src="/static/img/blueprint/blue_mbkh.png"></image>
																<view slot="title" class="u-slot-title">
																	<text class="title-name">目标客户</text>
																</view>
															</u-cell>
															<view>
																<text class="txt-num">{{item2.customerNum}}</text>
																<text class="txt">个</text>
															</view>
														</view>
													</view>
												</view>
											</view>
										</view>

									</view>
								</view>
							</u-collapse-item>
						</view>
					</u-collapse>

				</view>
				<view v-if="isNone">
					<u-empty text="暂无蓝图" width="84" height="84" icon="/static/img/blueprint/blue_empty.png">
						<u-button color="rgba(0, 114, 255, 1)" shape="circle" :style="{marginTop:19+'px'}" text="去添加"
							@click="gotoAddAchievement"> </u-button>
					</u-empty>
				</view>

			</scroll-view>
		</view>
		<view class="foot-height" v-if="!isNone">
			<view style="padding: 16px 126px;">
				<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="添加" @click="gotoAddAchievement">
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getDictItemsByCode,
		getBlueprintTargetsList,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				scrollTop: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				lstBlueprintTargets: [],
				blueprintId: "", //销售作战蓝图ID
				yearValue:"",
				isNone: false,
				showYear: false,
				columnsYear: [],
				value1: Number(new Date()),
				pageNo: 1,
				maxPage: 1,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isLoading: false, //加载中
				firstTime: false,
				selectInfo: {
					sign: 0, //作战蓝图分类
					year: "", //目标年份
					userIdList: "", //所属人员
				},
			}
		},
		onLoad(option) {
			this.blueprintId = option.blueprintId || "";
			this.yearValue = option.yearValue || "";
			this.getDictItems('industry'); //目标行业
			this.getDictItems('amount_unit'); //目标单位
			// this.getTopHeight();
			// this.getUserList();
			this.getData();
		},
		onShow() {
			uni.$once('returnBlueprint', res => {
				if (res) {
					this.getData();
				}
			})
		},
		methods: {
			getData() {
				this.isLoading = false;
				this.isNone=false;
				let data = "?blueprintId=" + this.blueprintId
				getBlueprintTargetsList(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res);
						let result = isEmpty(res.result) ? [] : res.result;
						//this.lstBlueprintTargets = isEmpty(res.result) ? [] : res.result;
						this.lstBlueprintTargets = this.classify(result)
						if(result.length==0){
							this.isNone=true;
						}
						console.log(this.lstBlueprintTargets)
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			},
			//通过地区查重
			classify(arr) {
				let map = {};
				let myArr = [];
				for (let i = 0; i < arr.length; i++) {
					arr[i].area = arr[i].area.replace(/,/g, "")
					let totalAmount=0;
					let customerNum=0;
					for(let k=0;k<arr[i].monthlyList.length;k++){
						totalAmount += arr[i].monthlyList[k].amount;
						customerNum += arr[i].monthlyList[k].customerIds.length;
					}
					arr[i].totalAmount=totalAmount;
					arr[i].customerNum=customerNum;
					if (!map[arr[i].area]) {
						myArr.push({
							area: arr[i].area,
							data: [arr[i]]
						});
						map[arr[i].area] = arr[i]
					} else {
						for (let j = 0; j < myArr.length; j++) {
							if (arr[i].area === myArr[j].area) {
								myArr[j].data.push(arr[i]);
								break
							}
						}
					}
				}
				return myArr
			},
			scrollLoadMoreData() {
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
			//状态查询
			getDictItems(dictCode) {
				let data = "?dictCode=" + dictCode
				getDictItemsByCode(data, res => {
					if (res.code == 200 && res.success) {
						getApp().globalData[dictCode] = res.result;

					} else {
						uni.$u.toast(res.message);
					}
					console.log(res)
				})
			},
			//详情
			gotoDetail(item) {
				console.log(item)
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/achievementDetail?id="+item.id
				});
			},
			leftClick() {
				uni.navigateBack();
			},
			//添加
			gotoAddAchievement() {
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/addAchievement?blueprintId=" +
						this.blueprintId + '&yearValue=' + this.yearValue
				});
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

			.u-button__text {
				font-size: 16px !important;
			}
		}

		.card {
			padding: 8px 16px 0 16px;

			.card-pa {
				padding: 0 16px 0px;
				background: #fff;
				border-radius: 10px;

				.u-cell__body {
					padding: 10px 0px;

					.u-cell__title-text {
						font-size: 16px;
						line-height: 25px;
						font-weight: bold;
						color: rgba(48, 49, 51, 1);
					}

					.u-cell__label {
						font-size: 12px;
						line-height: 35px;
						color: rgba(96, 98, 102, 1);
					}

					.block {
						width: 100px;
						height: 5px;
						background: #f0f0f0;
						display: inline-block;
						border-radius: 6px;
						margin-left: 8px;
					}

					.block_bg {
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

		.u-empty {
			margin-top: 172px !important;

			.u-button--circle {
				width: 104px;
			}

			.u-button__text {
				font-size: 16px !important;
			}
		}

		.see-board {
			padding: 8px 16px 0 16px;

			.u-cell__body {
				background: #ffffff;
				border-radius: 4px;
			}

			.u-line {
				border: none !important;
			}

			.u-slot-title {
				.u-cell-text {
					font-size: 16px;
					font-weight: bold;
				}

				.title-proportion {
					margin-left: 10px;
					color: #909399;
					font-size: 16px;
				}
			}

			.u-slot-value {
				.u-cell-text {
					font-size: 14px;
					color: rgba(144, 147, 153, 1);
					line-height: 25px;
				}
			}

			.icon-img {
				width: 4px;
				height: 13px;
				border-radius: 3px;
				background: #0072ff;
				margin-right: 14px;
			}

			.logo {
				width: 24px;
				height: 24px;
				top: 8px;
			}

			.card {
				padding: 8px 0px 0 0px;

				.card-pa {
					border-radius: 4px;

					.u-line {
						border-bottom: 1px solid rgb(214, 215, 217) !important;
					}

					.logo_ico {
						width: 20px;
						height: 20px;
					}

					.u-cell__body {
						.u-cell__title-text {
							font-size: 14px;
							font-weight: normal;
							color: #606266;
						}
					}

					.charts {
						// height: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 12px;

						.u-line {
							border: none !important;
						}

						.shuxian {
							width: 1px;
							height: 65px;
							background: rgba(0, 0, 0, 0.1000);
							border-radius: 0px 0px 0px 0px;
							opacity: 1;
						}

						.charts-box {
							display: block;
							// flex-direction: column;
							// align-items: center;
							height: 91px;
							width: 50%;

							.u-cell {
								width: 100%;
								height: 40px;

							}

							.title-name {
								font-size: 12px;
								color: #909399;
							}

							.txt-num {
								height: 40px;
								font-size: 18px;
								font-weight: bold;
								color: rgba(48, 49, 51, 1);
							}

							.txt {
								margin-left: 4px;
								height: 40px;
							}
						}
					}
				}
			}

			.u-collapse-content {
				color: $u-tips-color;
				font-size: 14px;
			}

			.u-collapse-item__content {
				// height: 0;
				// transition: none;
				// display: flex;
				// flex-direction: column;
			}

			.u-collapse-item__content__text {
				padding: 0;
			}
		}

	}
</style>
