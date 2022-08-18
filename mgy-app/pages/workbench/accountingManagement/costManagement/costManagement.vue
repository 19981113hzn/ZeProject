<template>
	<view class="content" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="费用管理" bgColor="#fff" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="项目名称" bgColor="rgba(244, 246, 250, 1)"
					v-model="selectInfo.searchValue" :clearabled="true" @change="searchChange"></u-search>
				<text class="sticky-txt" @click="clickScreen">筛选</text>
			</view>

		</u-sticky>
		<view class="card" v-for="(item, index) in lstCostManage" :key="index">

			<view class="card-pa" @click="gotoFeeDetail(item)">
				<u-cell :title="item.expenseName">
					<image class="logo" slot="icon" src="/static/img/workbench/icon_costManagement.png"></image>
					<!-- <text slot="value" class="u-slot-value" >未报销</text> -->
					<u-tag v-if="item.status==1" slot="value" text="未报销" bgColor="rgba(242, 245, 249, 1)"
						borderColor="rgba(242, 245, 249, 1)" color="rgb(102, 102, 102)" size="mini">
					</u-tag>
					<u-tag v-if="item.status==2" slot="value" text="报销中" bgColor="rgba(235, 244, 255, 1)"
						borderColor="rgba(235, 244, 255, 1)" color="rgba(0, 114, 255, 1)" size="mini">
					</u-tag>
					<u-tag v-if="item.status==3" slot="value" text="已报销" bgColor="rgba(247, 252, 244, 1)"
						borderColor="rgba(247, 252, 244, 1)" color="rgba(103, 194, 58, 1)" size="mini">
					</u-tag>
				</u-cell>
				<u--form labelWidth="75">
					<u-form-item label="负责人员">
						<text>{{item.chargeName}}</text>
					</u-form-item>
					<u-form-item label="项目名称">
						<text>{{item.projectName}}</text>
					</u-form-item>
					<u-form-item label="费用金额">
						<text>￥{{item.amounts}}</text>
					</u-form-item>
					<u-form-item label="发生时间">
						<text>{{item.happenTime}}</text>
					</u-form-item>

				</u--form>

			</view>

		</view>
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<u-empty v-if="lstCostManage.length==0 && isLoading" mode="data"
			icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		<u-loadmore v-if="lstCostManage.length>0" :status="status" :loading-text="loadingText"
			:loadmore-text="loadmoreText" :nomore-text="nomoreText" />
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
		getListCostManage,
		getDictItemsByCode,
		getUserListByUserId,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				lstScreen: [{
						type: 1, //1多选  2选择时间 3收入费用
						title: "费用分类",
						defaultSelectedIndex: "0",
						isMutiple: false, //是否多选
						lst: [{
								name: "全部费用",
								value: "0"
							},
							{
								name: "我的费用",
								value: "1"
							},
							{
								name: "下属费用",
								value: "2"
							}
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "费用类型",
						defaultSelectedIndex: [],
						isMutiple: true,
						lst: [{
								name: "我的费用",
								value: "2-1"
							},
							{
								name: "招待费",
								value: "2-2"
							},
							{
								name: "交通费",
								value: "2-3"
							},
							{
								name: "酒店费",
								value: "2-4"
							},
							{
								name: "通讯费",
								value: "2-5"
							},
							{
								name: "物流费",
								value: "2-6"
							},
							{
								name: "礼品费",
								value: "2-7"
							},
							{
								name: "其他",
								value: "2-8"
							},
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "报销状态",
						defaultSelectedIndex: [],
						isMutiple: true,
						lst: [{
								name: "未报销",
								value: "1"
							},
							{
								name: "报销中",
								value: "2"
							},
							{
								name: "已报销",
								value: "3"
							}
						]
					},
					{
						type: 2, //1多选  2选择时间 3收入费用
						title: "发生时间",
						startTime: "",
						endTime: "",
					},
					{
						type: 3, //1多选  2选择时间 3收入费用
						title: "费用金额",
						minCost: "",
						maxCost: "",
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "负责人员",
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
				],
				lstCostManage: [],
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				pageNo: 1,
				maxPage: 1,
				firstTime: false, //第一次点击筛选
				isLoading: false, //加载中
				selectInfo: {
					searchValue: "", //项目名称
					sign: '0', //费用分类
					chargeMan: "", //负责人员
					expenseType: "", //费用类型
					status: "", //报销状态
					startTime: "", //开始时间
					endTime: "", //结束时间
					minCost: "", //最低金额
					maxCost: "", //最高金额
				}
			}
		},
		onLoad() {
			console.log(1, this.$cache.get('_userInfo'))
			console.log(2, this.$cache.get('_token'))
			this.getTopHeight();
			this.getCostManage();
			this.getUserList();
			//if(isEmpty(getApp().globalData.lstExpense_type)){
			this.getDictItems('expense_type');
			this.getDictItems('expense_reimburse_type');
			// }else{
			// 	let lstExpense=getApp().globalData.lstExpense_type
			// 	let data=[];
			// 	for(let j=0;j<lstExpense.length;j++){
			// 		data.push({
			// 			name:lstExpense[j].text,
			// 			value:lstExpense[j].value
			// 		})
			// 	}
			// 	for(let i=0;i<this.lstScreen.length;i++){
			// 		if(this.lstScreen[i].title=="费用类型"){
			// 			this.lstScreen[i].lst=data;
			// 		}
			// 	}
			// }
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getCostManage();
		},
		onShow() {
			this.pageNo = 1;
			uni.$once('result', res => {
				for (let i = 0; i < res.length; i++) {
					let item = res[i];
					if (item.title == "费用分类") {
						this.selectInfo.sign = item.defaultSelectedIndex;
					}
					if (item.title == "费用类型") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.expenseType = SelectedIndex;
					}
					if (item.title == "报销状态") {
						this.selectInfo.status = item.defaultSelectedIndex;
					}
					if (item.title == "发生时间") {
						this.selectInfo.startTime = item.startTime;
						this.selectInfo.endTime = item.endTime;
					}
					if (item.title == "费用金额") {
						if (item.minCost > item.maxCost) {
							this.selectInfo.minCost = item.maxCost;
							this.selectInfo.maxCost = item.minCost;
						} else {
							this.selectInfo.minCost = item.minCost;
							this.selectInfo.maxCost = item.maxCost;
						}
					}
					if (item.title == "负责人员") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.chargeMan = SelectedIndex;
					}
				}
				console.log(res)
				this.getCostManage();
			})
			uni.$once('return', res => {
				if (res) {
					this.pageNo = 1;
					this.getCostManage();
				}
			})

		},
		methods: {
			//刷新页面
			refresh() {
				uni.redirectTo({
					url: '/pages/workbench/accountingManagement/costManagement/costManagement'
				});
			},
			getCostManage() {
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					"&projectName=" + this.selectInfo.searchValue //项目名称
					+
					"&chargeMan=" + this.selectInfo.chargeMan //负责人员
					+
					"&expenseType=" + this.selectInfo.expenseType //费用类型
					+
					"&startTime=" + this.selectInfo.startTime //开始时间
					+
					"&endTime=" + this.selectInfo.endTime //结束时间
					+
					"&minAmounts=" + this.selectInfo.minCost //最小金额	
					+
					"&maxAmounts=" + this.selectInfo.maxCost //最大金额
					+
					"&sign=" + this.selectInfo.sign //当sign为null时: 查询全部， 1时：我的费用，2时： 下属费用
					+
					"&status=" + this.selectInfo.status //状态（1,2,3（待定））状态（1,2,3（待定））
				;
				getListCostManage(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.lstCostManage = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.lstCostManage = this.lstCostManage.concat(res.result.records)
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
				this.getCostManage();
			},
			//费用类型
			getDictItems(dictCode) {
				let data = "?dictCode=" + dictCode
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
							if (this.lstScreen[i].title == "费用类型" && dictCode == 'expense_type') {
								this.lstScreen[i].lst = lst;
							}
							if (this.lstScreen[i].title == "报销状态" && dictCode == 'expense_reimburse_type') {
								this.lstScreen[i].lst = lst;
							}
						}
					} else {
						uni.$u.toast(res.message);
					}
					console.log(res)
				})
			},
			//负责人员
			getUserList() {
				let data = "?realname=" + "" +
					+"&pageNo=" + "1" +
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
							if (this.lstScreen[i].title == "负责人员") {
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
				uni.setStorageSync('feeDetails', item)
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/costManagement/feeDetails"
				})
			},
			clickScreen() {
				if (!this.firstTime) {
					this.firstTime = true;
					uni.setStorageSync('_lstScreen', this.lstScreen) //1*60*60*24*7
					uni.setStorageSync('OldLstScreen', this.lstScreen) //1*60*60*24*7

				}
				uni.navigateTo({
					url: "/pages/filter-all/filter-all?type=1"
				});
			},
			//返回上一级
			leftClick() {
				uni.redirectTo({
					url:"/pages/workbench/accountingManagement/accountingManagement"
				})
			},
			//新建费用单
			rightClick() {
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/costManagement/addCost?returnPageNumber=1"
				})
			}
		},
		// 按钮监听函数
		onNavigationBarButtonTap(e) { //不需要在<view>里面做任何操作，可直接引用

		}
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
