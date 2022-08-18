<template>
	<view class="content" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="报销管理" bgColor="#fff" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="输入报销单号查询" bgColor="rgba(244, 246, 250, 1)"
					v-model="selectInfo.reimburseNo" :clearabled="true" @change="searchChange"></u-search>
				<text class="sticky-txt" @click="clickScreen">筛选</text>
			</view>

		</u-sticky>
		<view class="card" v-for="(item, index) in lstsumExpense" :key="index">
			<view class="card-pa" @click="gotoFeeDetail(item)">
				<u-cell :title="item.reimburseNo">
					<!-- <image class="logo" slot="icon" src="/static/img/workbench/icon_costManagement.png"></image> -->
					<!-- <text slot="value" class="u-slot-value" >未报销</text> -->
					<!-- 流程状态 1-申请 2-审批 3-通过 4-不通过 5-驳回 6-撤销 -->
					<u-tag v-if="item.status==3" slot="value" text="已通过" bgColor="rgba(243, 255, 237, 1)"
						borderColor="rgba(243, 255, 237, 1)" color="rgba(103, 194, 58, 1)" size="mini">
					</u-tag>
					<u-tag v-if="item.status==1 || item.status==2" slot="value" text="待审批" bgColor="rgba(235, 244, 255, 1)"
						borderColor="rgba(235, 244, 255, 1)" color="rgba(0, 114, 255, 1)" size="mini">
					</u-tag>
					<u-tag v-if="item.status==6" slot="value" text="已撤销" bgColor="rgba(241, 245, 250, 1)"
						borderColor="rgba(241, 245, 250, 1)" color="rgba(144, 147, 153, 1)" size="mini">
					</u-tag>
					<u-tag v-if="item.status==5" slot="value" text="被驳回" bgColor="rgba(255, 248, 242, 1)"
						borderColor="rgba(255, 248, 242, 1)" color="rgba(255, 147, 48, 1)" size="mini">
					</u-tag>
				</u-cell>
				<u--form labelWidth="75">
					<u-form-item label="报销人员">
						<text>{{item.applyMan}}</text>
					</u-form-item>
					<u-form-item label="费用金额">
						<text>￥{{item.amounts}}</text>
					</u-form-item>
					<u-form-item label="提交时间">
						<text>{{item.createTime}}</text>
					</u-form-item>

				</u--form>

			</view>

		</view>
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<u-empty v-if="lstsumExpense.length==0 && isLoading" mode="data"
			icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		<u-loadmore v-if="lstsumExpense.length>0" :status="status" :loading-text="loadingText"
			:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
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
		getListsumExpense,
		getUserListByUserId,
		getDepartListByName,
		getDictItemsByCode
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				topheight: 0,
				lstsumExpense: [],
				lstScreen: [{
						type: 1, //1多选  2选择时间 3收入费用
						title: "报销单分类",
						defaultSelectedIndex: "0",
						isMutiple: false, //是否多选
						lst: [{
								name: "全部报销单",
								value: "0"
							},
							{
								name: "我的报销单",
								value: "1"
							},
							{
								name: "下属报销单",
								value: "2"
							}
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "审核状态",
						defaultSelectedIndex: [],
						isMutiple: true,
						lst: [{
								name: "已通过",
								value: "1"
							},
							{
								name: "待审批",
								value: "2"
							},
							{
								name: "被驳回",
								value: "3"
							},
							{
								name: "已撤销",
								value: "4"
							},
						]
					},
					{
						type: 2, //1多选  2选择时间 3收入费用
						title: "提交时间",
						startTime: "",
						endTime: "",
					},
					{
						type: 3, //1多选  2选择时间 3收入费用
						title: "报销金额",
						minCost: "",
						maxCost: "",
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "报销人员",
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
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "报销部门",
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
				selectInfo: {
					reimburseNo: '',
					applyMan: '',
					sign: "0",
					status: "",
					startTime: "", //开始时间
					endTime: "", //结束时间
					minAmounts: "", //最低金额
					maxAmounts: "", //最高金额
				}
			}
		},
		onLoad() {
			console.log(5666);
			this.getsumExpenseData();
			this.getDepartList();
			this.getDictItems();
			this.getUserList()
			this.getTopHeight();
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getsumExpenseData();
		},
		onShow() {
			this.pageNo = 1;
			uni.$once('result', res => {
				for (let i = 0; i < res.length; i++) {
					let item = res[i];
					if (item.title == "报销单分类") {
						this.selectInfo.sign = item.defaultSelectedIndex;
					}
					if (item.title == "审核状态") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.status = SelectedIndex;
					}
					if (item.title == "提交时间") {
						this.selectInfo.startTime = item.startTime;
						this.selectInfo.endTime = item.endTime;
					}
					if (item.title == "报销金额") {
						if (item.minCost > item.maxCost) {
							this.selectInfo.minAmounts = item.maxCost;
							this.selectInfo.maxAmounts = item.minCost;
						} else {
							this.selectInfo.minAmounts = item.minCost;
							this.selectInfo.maxAmounts = item.maxCost;
						}
					}
					if (item.title == "报销人员") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.applyMan = SelectedIndex;
					}
				}
				console.log(res)
				this.getsumExpenseData();
			});
			uni.$once('returnExpense', res => {
				if (res) {
					this.pageNo = 1;
					this.getsumExpenseData();
				}
			})
		},
		methods: {
			//刷新页面
			refresh() {
				uni.redirectTo({
					url: '/pages/workbench/accountingManagement/reimburseManagement/reimburseManagement'
				});
			},
			getsumExpenseData() {
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					"&reimburseNo=" + this.selectInfo.reimburseNo //报销单号
					+
					"&applyMan=" + this.selectInfo.applyMan //报销人员
					+
					"&startTime=" + this.selectInfo.startTime //开始时间
					+
					"&endTime=" + this.selectInfo.endTime //结束时间
					+
					"&minAmounts=" + this.selectInfo.minAmounts //最小金额
					+
					"&maxAmounts=" + this.selectInfo.maxAmounts //最大金额
					+
					"&sign=" + this.selectInfo.sign //当sign为null时: 查询全部， 1时：我的报销单，2时： 下属报销单
					+
					"&status=" + this.selectInfo.status //状态（1,2,3（待定））状态（1,2,3（待定））
				;
				getListsumExpense(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.lstsumExpense = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.lstsumExpense = this.lstsumExpense.concat(res.result.records)
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
			//搜索
			searchChange() {
				this.pageNo = 1
				this.getsumExpenseData();
			},
			//报销人员
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
							if (this.lstScreen[i].title == "报销人员") {
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
			//审核状态
			getDictItems() {
				let data = "?dictCode=approval_status"
				getDictItemsByCode(data, res => {
					if (res.code == 200 && res.success) {
						let arr = [];
						arr.push(res.result)
						getApp().globalData.lstExpense_type = arr;
						let lst = [];
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
			//报销部门
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
						if (this.lstScreen[i].title == "报销部门") {
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
			gotoFeeDetail(item) {
				uni.setStorageSync('reimbursDetails', item)
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/reimburseManagement/reimbursementDetails"
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
					url:"/pages/workbench/accountingManagement/accountingManagement"
				})
				//uni.navigateBack()
			},
			//新建费用单
			rightClick() {
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/reimburseManagement/addReimburse?returnPageNumber=1"
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
