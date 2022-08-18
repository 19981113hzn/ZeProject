<template>
	<view class="content" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="回款管理" bgColor="#fff" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="输入合同标题查询" bgColor="rgba(244, 246, 250, 1)"
					v-model="selectInfo.contractName" :clearabled="true" @change="searchChange"></u-search>
				<text class="sticky-txt" @click="clickScreen">筛选</text>
			</view>
		</u-sticky>
		<view class="card" v-for="(item, index) in collectionLst" :key="index">
			<view class="card-pa" @click="gotoManageDetail(item)">
				<u-cell :title="item.contractName ? item.contractName : '合同标题'">
					<!-- 流程状态 1-申请 2-审批 3-通过 4-不通过 5-驳回 6-撤销 -->
					<u-tag v-if="item.status==3" slot="value" text="已通过" bgColor="rgba(243, 255, 237, 1)"
						borderColor="rgba(243, 255, 237, 1)" color="rgba(103, 194, 58, 1)" size="mini">
					</u-tag>
					<u-tag v-if="item.status==1 || item.status==2" slot="value" text="待审批"
						bgColor="rgba(235, 244, 255, 1)" borderColor="rgba(235, 244, 255, 1)"
						color="rgba(0, 114, 255, 1)" size="mini">
					</u-tag>
					<u-tag v-if="item.status==6" slot="value" text="已撤销" bgColor="rgba(241, 245, 250, 1)"
						borderColor="rgba(241, 245, 250, 1)" color="rgba(144, 147, 153, 1)" size="mini">
					</u-tag>
					<u-tag v-if="item.status==5" slot="value" text="被驳回" bgColor="rgba(255, 248, 242, 1)"
						borderColor="rgba(255, 248, 242, 1)" color="rgba(255, 147, 48, 1)" size="mini">
					</u-tag>
				</u-cell>
				<view class="">
					<u-row>
						<u-col span="20">
							<u--form labelWidth="65">
								<u-row>
									<u-col span="4.5">
										<u-form-item label="回款日期">

											<text>{{item.returnTime ? item.returnTime : '2022-04-01'}}</text>
										</u-form-item>
									</u-col>
									<u-col span="4.5">
										<u-form-item label="回款期次">
											<text>第{{item.period}}期</text>
										</u-form-item>
									</u-col>
								</u-row>
								<u-row>
									<u-col span="4.5">
										<u-form-item label="回款金额">
											<text>￥{{item.amount}}</text>
										</u-form-item>
									</u-col>
									<u-col span="4.5">
										<u-form-item label="付款方式">
											<text>{{item.payType_dictText}}</text>
										</u-form-item>
									</u-col>
								</u-row>
							</u--form>
						</u-col>
					</u-row>
				</view>

			</view>

		</view>
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<u-empty v-if="collectionLst.length==0 && isLoading" mode="data"
			icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<!-- <u-loadmore v-if="collectionLst.length>0" :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" /> -->
	</view>
</template>

<script>
	import {
		GetNowFormatDate
	} from "@/util/js_DateTime.js"
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getDictItemsByCode,
		getCollectionList,
		getPlanItemList
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				topheight: 0,
				collectionLst: [],
				lstScreen: [{
						type: 1, //1多选  2选择时间 3收入费用
						title: "回款分类",
						defaultSelectedIndex: [],
						isMutiple: false, //是否多选
						lst: [{
								name: "全部回款计划",
								value: "0"
							},
							{
								name: "我的回款",
								value: "1"
							},
							{
								name: "下属回款",
								value: "2"
							}
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "审核状态",
						defaultSelectedIndex: [],
						isMutiple: false,
						lst: [{
								name: "全部",
								value: "1"
							},
							{
								name: "已通过",
								value: "2"
							},
							{
								name: "待审批",
								value: "3"
							},
							{
								name: "已撤销",
								value: "4"
							},
							{
								name: "被驳回",
								value: "4"
							},
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "逾期状态",
						defaultSelectedIndex: [],
						isMutiple: false,
						lst: [{
								name: "全部",
								value: "1"
							},
							{
								name: "正常",
								value: "2"
							},
							{
								name: "逾期",
								value: "3"
							},

						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "付款方式",
						defaultSelectedIndex: [],
						isMutiple: false,
						lst: [{
								name: "对公账户",
								value: "1"
							},
							{
								name: "对私账户",
								value: "2"
							},
							{
								name: "现金",
								value: "3"
							},

						]
					},


				],
				pageNo: 1,
				maxPage: 1,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isLoading: false, //加载中
				selectInfo: {
					contractName: '',
					listType: '', //列表类型 0-全部 1-我的 2-下属,示例值(0)
					status: "", //审批状态	
					startTime: "", //开始时间
					endTime: "", //结束时间
					overdueStatus: "", //逾期状态	
					payType: "", //付款方式	
					planItemId: "", //回款计划期项id	
				}
			}
		},
		onLoad() {
			// this.getUserList()
			this.getDictItems('approval_status');
			// this.getDictItems('overdue_status');
			this.getDictItems('pay_type');
			this.getDataList()
			this.getTopHeight();
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getDataList();
		},
		onShow() {
			this.pageNo = 1;
			uni.$once('result', res => {
				for (let i = 0; i < res.length; i++) {
					let item = res[i];
					if (item.title == "回款分类") {
						this.selectInfo.listType = item.defaultSelectedIndex;
					}
					if (item.title == "审核状态") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.status = SelectedIndex;
					}
					if (item.title == "逾期状态") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.overdueStatus = SelectedIndex;
					}
					if (item.title == "付款方式") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.payType = SelectedIndex;
					}
				}
				console.log(res)
				this.getDataList();
			});
			// 编辑回款单
			uni.$once('returnPlanItem', res => {
				if (res) {
					this.pageNo = 1;
					this.getDataList();
				}
			});
			// 删除回款单
			uni.$once('returnRecord', res => {
				if (res) {
					this.pageNo = 1;
					this.getDataList();
				}
			})
			// 提交审批
			uni.$once('returnExpense', res => {
				if (res) {
					this.pageNo = 1;
					this.getDataList();
				}
			})
		},

		// 获取回款计划列表数据

		methods: {
			//刷新页面
			refresh() {
				uni.redirectTo({
					url: '/pages/workbench/accountingManagement/reimburseManagement/reimburseManagement'
				});
			},
			// 搜索
			searchChange() {
				this.pageNo = 1
				this.getDataList();
			},
			getDataList() {
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					"&contractName	=" + this.selectInfo.contractName //合同名称
					+
					"&listType=" + this.selectInfo.listType //列表类型 0-全部 1-我的 2-下属,示例值(0)	
					+
					"&status=" + this.selectInfo.status //审批状态	
					+
					"&startTime=" + this.selectInfo.startTime //开始时间	
					+
					"&endTime=" + this.selectInfo.endTime //结束时间	
					+
					"&overdueStatus=" + this.selectInfo.overdueStatus //逾期状态	
					+
					"&payType=" + this.selectInfo.payType //付款方式	
					+
					"&planItemId=" + this.selectInfo.planItemId //付款方式	

				;
				console.log('筛选条件', data)
				getCollectionList(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res)
						if (this.pageNo == 1) {
							this.collectionLst = res.result.records;
						} else {
							this.collectionLst = this.collectionLst.concat(res.result.records)
						}
						this.maxPage = res.result.pages
						console.log(this.maxPage);
						if (this.pageNo >= this.maxPage) this.status = 'nomore';
						else this.status = 'loading';
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			},


			//状态查询
			getDictItems(dictCode) {
				let data = "?dictCode=" + dictCode
				getDictItemsByCode(data, res => {
					if (res.code == 200 && res.success) {
						getApp().globalData[dictCode] = res.result
						let arr = [];
						arr.push(res.result)
						getApp().globalData.lstExpense_type = arr;
						let lst = [];
						if (dictCode == 'approval_status' || dictCode == 'overdue_status') {
							lst = [{
								name: '全部',
								value: ''
							}];
						} else {
							lst = []
						}
						for (let j = 0; j < res.result.length; j++) {
							lst.push({
								name: res.result[j].text,
								value: res.result[j].value
							})
						}
						for (let i = 0; i < this.lstScreen.length; i++) {
							if (this.lstScreen[i].title == "审核状态" && dictCode == 'approval_status') {
								this.lstScreen[i].lst = lst;

							}
							if (this.lstScreen[i].title == "逾期状态" && dictCode == 'overdue_status') {
								this.lstScreen[i].lst = lst;
							}
							if (this.lstScreen[i].title == "付款方式" && dictCode == 'pay_type') {
								this.lstScreen[i].lst = lst;
							}
						}
					} else {
						uni.$u.toast(res.message);
					}
					console.log(res)
				})
			},
			// 搜索
			searchChange() {
				this.pageNo = 1
				this.getDataList();
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
			gotoManageDetail(item) {
				uni.setStorageSync('collectionItem', item)
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/collectionManagement/collectionDetail"
				})
			},
			clickScreen() {
				if (!this.firstTime) {
					this.firstTime = true;
					uni.setStorageSync('_lstScreen', this.lstScreen) //1*60*60*24*7
					uni.setStorageSync('OldLstScreen', this.lstScreen) //1*60*60*24*7
				}
				uni.navigateTo({
					url: "/pages/filter-all/filter-all?type=2"
				});
			},
			//返回上一级
			leftClick() {
				uni.redirectTo({
					url: "/pages/workbench/accountingManagement/accountingManagement"
				})
				//uni.navigateBack()
			},

			rightClick() {
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/cashtransferSchemes/addCollectionRecord?returnPageNumber=1"
				})
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
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

	/deep/ {
		.u-tabs__wrapper__nav__item {
			width: 50%;
		}

		.u-tabs__wrapper__nav {
			border-bottom: 1px solid;
			border-bottom-color: rgba(0, 0, 0, 0.05);
			background: #fff;
		}

		.u-button {
			width: 50%;
			float: left;
			border-radius: none !important;
		}

		.uni-button {
			border-radius: none !important;
		}
	}

	.card {
		padding: 8px 16px 0 16px;

		.card-pa {
			padding: 0 16px 16px;
			background: #fff;
			border-radius: 10px;

			/deep/.u-cell__body {
				padding: 10px 0px;


				.u-cell__title-text {
					font-size: 16px;
					font-weight: bold;
					color: rgba(48, 49, 51, 1);
				}

				.logo {
					width: 24px;
					height: 24px;
				}
			}

			// /deep/.u-line{
			// 	border: none !important;
			// }

			/deep/.u-form-item__body {
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

			.card-pa-view {
				line-height: 30px;
				height: 30px;

				.card-title {
					display: block;
					width: 80%;
					float: left;
				}

				.card-state {
					display: block;
					width: 17%;
					float: right;
					color: #D1372C;
				}
			}

			.txt-size {
				display: block;
				margin-top: 5px;
				font-size: 14px;
				color: rgba(0, 0, 0, 0.65);
			}
		}

	}

	.u-loading-icon {
		margin-top: 30px;
	}

	.logo {
		width: 24px;
		height: 24px;
	}
</style>
