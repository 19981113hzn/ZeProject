<template>
	<view class="content" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="回款计划" bgColor="#fff" @leftClick="leftClick" @rightClick="rightClick">
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
		<view class="card" v-for="(item, index) in lstCash" :key="index">
			<view class="card-pa" @click="gotoCashPlanDetail(item)">
				<u-cell :title="item.contractName ? item.contractName : '合同标题'">
					<u-tag v-if="item.status==1" slot="value" text="已完成" bgColor="rgba(243, 255, 237, 1)"
						borderColor="rgba(243, 255, 237, 1)" color="rgba(103, 194, 58, 1)" size="mini">
					</u-tag>
					<u-tag v-if="item.status==2" slot="value" text="未完成" bgColor="rgba(241, 245, 250, 1)"
						borderColor="rgba(241, 245, 250, 1)" color="rgba(144, 147, 153, 1)" size="mini">
					</u-tag>
					<u-tag v-if="item.status==3" slot="value" text="已逾期" bgColor="rgba(255, 248, 242, 1)"
						borderColor="rgba(255, 248, 242, 1)" color="rgba(255, 147, 48, 1)" size="mini">
					</u-tag>
					<!-- <u-tag slot="value" text="已完成" bgColor="rgba(255, 248, 242, 1)" borderColor="rgba(255, 248, 242, 1)"
						color="rgba(103, 194, 58, 1)" size="mini">
					</u-tag> -->
					<!-- <u-tag v-if="item.status==1 || item.status==2" slot="value" text="待审批" bgColor="rgba(235, 244, 255, 1)"
						borderColor="rgba(235, 244, 255, 1)" color="rgba(0, 114, 255, 1)" size="mini">
					</u-tag> -->
				</u-cell>
				<u--form labelWidth="80">
					<u-form-item label="回款总期次">
						<text>{{item.nums}}期</text>
					</u-form-item>
					<u-form-item label="合同总金额">
						<text>￥{{item.amount}}</text>
					</u-form-item>
					<u-form-item label="合同归属人">
						<text>{{item.userName ? item.userName : '李晓明'}}</text>
					</u-form-item>
				</u--form>

			</view>

		</view>
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<u-empty v-if="lstCash.length==0 && isLoading" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<u-loadmore v-if="lstCash.length>0" :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
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
		getUserListByUserId,
		getDepartListByName,
		getDictItemsByCode,
		getCashList
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				topheight: 0,
				lstCash: [],
				// lstsumExpense: [],
				lstScreen: [{
						type: 1, //1多选  2选择时间 3收入费用
						title: "回款计划分类",
						defaultSelectedIndex: "0",
						isMutiple: false, //是否多选
						lst: [{
								name: "全部回款计划",
								value: "0"
							},
							{
								name: "我的回款计划",
								value: "1"
							},
							{
								name: "下属回款计划",
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
								name: "已完成",
								value: "2"
							},
							{
								name: "未完成",
								value: "3"
							},
							{
								name: "已逾期",
								value: "4"
							},
						]
					},

					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "合同归属人员",
						defaultSelectedIndex: [],
						isMore: true,
						isMutiple: true,
						moreTitle: "更多",
						total: "", //点击获取跟多的时候，需要获取，进行查询
						lst: [{
								name: "赵小刚",
								value: 1
							},
							{
								name: "周小明",
								value: 2
							},
							{
								name: "郭小淘",
								value: 3
							},
							{
								name: "张小伟",
								value: 4
							},
							{
								name: "徐三",
								value: 5
							},
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "合同所属部门",
						defaultSelectedIndex: [],
						isMore: true,
						isMutiple: true,
						moreTitle: "更多",
						total: "", //点击获取跟多的时候，需要获取，进行查询
						lst: [{
								name: "总经办",
								value: 1
							},
							{
								name: "人事部",
								value: 2
							},
							{
								name: "行政部",
								value: 3
							},
							{
								name: "销售部",
								value: 4
							},
							{
								name: "市场部",
								value: 5
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
				key: '',
				selectInfo: {
					contractName: '',
					listType: "0",
					status: "",
					userId: '', //合同所属人员
					deptId: '', //合同所属部门
				}
			}
		},
		onLoad() {
			this.getDepartList();
			this.getDictItems('collection_payment_status');
			this.getDictItems('pay_type');
			this.getUserList();
			this.getCashSchemes();
			this.getTopHeight();
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getCashSchemes();
		},
		onShow() {
			this.pageNo = 1;
			uni.$once('result', res => {
				for (let i = 0; i < res.length; i++) {
					let item = res[i];
					if (item.title == "回款计划分类") {
						this.selectInfo.listType = item.defaultSelectedIndex;
					}
					if (item.title == "审核状态") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.status = SelectedIndex;
					}
					if (item.title == "合同归属人员") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.userId = SelectedIndex;
					}
				}
				this.getCashSchemes();
				console.log(res)
			});
			uni.$once('returnCollection', res => {
				this.pageNo = 1;
				this.getCashSchemes();
			})
			uni.$once('returnPlan', res => {
				this.pageNo = 1;
				this.getCashSchemes();
			})
		},

		// 获取回款计划列表数据

		methods: {
			// 刷新页面
			refresh() {
				uni.redirectTo({
					url: '/pages/workbench/accountingManagement/cashtransferSchemes/cashtransferSchemes'
				});
			},
			// 搜索
			searchChange() {
				this.pageNo = 1
				this.getCashSchemes();
			},

			getCashSchemes() {
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					"&key=" + this.selectInfo.contractName //搜素关键词
					+
					"&status=" + this.selectInfo.status //回款状态
					+
					"&listType=" + this.selectInfo.listType // 回款计划分类   0全部 1我的 2下属的
					+
					"&userId=" + this.selectInfo.userId //合同所属人员
					+
					"&deptId=" + this.selectInfo.deptId

				console.log('筛选条件', data)
				getCashList(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res)
						if (this.pageNo == 1) {
							this.lstCash = res.result.records;
						} else {
							this.lstCash = this.lstCash.concat(res.result.records)
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

			//审核状态
			getDictItems(dictCode) {
				let data = "?dictCode=" + dictCode
				getDictItemsByCode(data, res => {
					if (res.code == 200 && res.success) {
						let arr = [];
						arr.push(res.result)
						console.log(arr);
						getApp().globalData[dictCode] = res.result
						getApp().globalData.lstExpense_type = arr;
						let lst = [{
							name: '全部',
							value: ''
						}];
						for (let j = 0; j < res.result.length; j++) {
							lst.push({
								name: res.result[j].text,
								value: res.result[j].value
							})
						}
						for (let i = 0; i < this.lstScreen.length; i++) {
							if (this.lstScreen[i].title == "审核状态") {
								this.lstScreen[i].lst = lst;
							}
						}
					} else {
						uni.$u.toast(res.message);
					}
					console.log(res)
				})
			},

			//合同归属人员
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
							if (this.lstScreen[i].title == "合同归属人员") {
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

			//合同归属部门
			getDepartList() {
				let data = "?departName=" + "" +
					"&pageNo=" + "1" +
					"&pageSize=" + "5";
				getDepartListByName(data, res => {
					let lst = [];
					for (let j = 0; j < res.result.records.length; j++) {
						lst.push({
							name: res.result.records[j].departName,
							value: res.result.records[j].id
						})
					}
					for (let i = 0; i < this.lstScreen.length; i++) {
						if (this.lstScreen[i].title == "合同所属部门") {
							this.lstScreen[i].lst = lst;
							this.lstScreen[i].total = res.result.total;
						}
					}
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
			gotoCashPlanDetail(item) {
				console.log(item);
				uni.setStorageSync('cashSchemesDetails', item)
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/cashtransferSchemes/cashplanDetail"
				})
			},
			clickScreen() {
				if (!this.firstTime) {
					this.firstTime = true;
					uni.setStorageSync('_lstScreen', this.lstScreen) //1*60*60*24*7
					uni.setStorageSync('OldLstScreen', this.lstScreen) //1*60*60*24*7
				}
				uni.navigateTo({
					url: "/pages/filter-all/filter-all?type=6"
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
					url: "/pages/workbench/accountingManagement/cashtransferSchemes/addCashtransfer?returnPageNumber=1"
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
