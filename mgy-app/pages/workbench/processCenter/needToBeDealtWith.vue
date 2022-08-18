<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="navTitle" bgColor="#fff" @leftClick="leftClick">

		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="请输入流程名称查询" bgColor="rgba(244, 246, 250, 1)"
					v-model="selectInfo.searchValue" :clearabled="true" @change="searchChange"></u-search>
				<text class="sticky-txt" @click="clickScreen">筛选</text>
			</view>

		</u-sticky>
		<u--form ref="form1" labelPosition="left" labelWidth="75">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more"
					:style="{ 'top': (statusBarHeight+48) + 'px','bottom':type==1?'0px':'0px' }" scroll-y="true"
					:scroll-top="scrollTop" scroll-with-animation="true" 	@scrolltolower="scrollLoadMoreData">
					<u-checkbox-group v-model="checkboxValue" placement="column" @change="checkboxChange">
						<view class="card" v-for="(item, index) in TaskList" :key="index">
							<view class="card-pa" @click="gotoDetail(item)">
								<u-cell :title="item.applyName+'的'+item.processName">
									<u-checkbox v-if="isBatch" slot="icon" :key="index" label="" :name="index">
									</u-checkbox>
									<image class="logo" slot="icon" src="/static/img/icon_user_default.png"></image>
									<!-- <text slot="value" class="u-slot-value" >未报销</text> -->
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
								</u-cell>
								<u--form labelWidth="75">
									<u-form-item label="发起部门">
										<text>{{item.applyDepartName}}</text>
									</u-form-item>
									<u-form-item label="当前节点">
									<text>{{item.curTaskdefName}}</text>
								</u-form-item>
									<u-form-item v-if="type == 1" label="接收时间">
										<text>{{item.receiveTime}}</text>
									</u-form-item>
									<u-form-item v-if="type == 2" label="处理时间">
										<text>{{item.handingTime}}</text>
									</u-form-item>
									<!-- <u-form-item label="报销单号">
									<text>BX202205307545</text>
								</u-form-item>
								<u-form-item label="报销金额">
									<text>¥ 1,000.00</text>
								</u-form-item>
								<u-form-item label="提交时间">
									<text>2019-03-15 17:27</text>
								</u-form-item> -->
								</u--form>

							</view>

						</view>
					</u-checkbox-group>
					<u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
					<u-empty v-if="TaskList.length==0 && isLoading" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
					</u-empty>
					<u-loadmore v-if="TaskList.length>0" :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
						:nomore-text="nomoreText" />
				</scroll-view>
			</view>

			<!-- <view v-if="type==1 && TaskList.length>0" class="foot-height">
				<view v-if="!isBatch" style="padding: 0 16px;">
					<u-button class="batch-reject" color="rgba(241, 243, 246, 1)" shape="circle" text="批量驳回"
						@click="clickBatch(1)"></u-button>
					<u-button class="batch-approval" color="rgba(0, 114, 255, 1)" shape="circle" text="批量审批"
						@click="clickBatch(2)"></u-button>
				</view>
				<view v-if="isBatch" style="padding: 0 16px;">
					<view class="all-box">
						<u-checkbox-group v-model="checkValue" placement="column" @change="checkboxChangeAll">
							<u-checkbox labelSize="16" iconSize="16" labelColor="rgba(51, 51, 51, 1)" label="全选"
								name="1">
							</u-checkbox>
						</u-checkbox-group>
						<text class="txt">已选<span
								style="color: rgba(58, 125, 255, 1);">{{checkboxValue.length}}</span>条</text>

					</view>
					<u--text class="cancel" text="取消" @click="clickBatch(3)"></u--text>
					<u-button class="batch-but" color="rgba(0, 114, 255, 1)" shape="circle"
						:text="isBatchApproval?'批量审批':'批量驳回'" @click="saveBatch()"></u-button>
				</view>
			
			</view> -->
			
		</u--form>
		

	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		GetNowFormatDate
	} from "@/util/js_DateTime.js"
	import {
		getUserListByUserId,
		getTodoTaskList,
		getDoneTaskList,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				type: 0, //1待办  2已办.
				navTitle: "我的待办",
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				TaskList: [], //列表数据
				scrollTop: 0,
				checkValue: [],
				checkboxValue: [],
				lstCheck: [],
				isBatch: false, //是否批量
				isBatchApproval: false, //是否批量审批
				firstTime: false, //第一次点击筛选
				isLoading: false, //加载中
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
					applyIds:"",//发起人
				}
			}
		},
		onLoad(option) {
			let type = isEmpty(option.type) ? false : option.type;
			this.type = type
			this.getUserList();
			if (type == 1) //待办
			{
				this.navTitle = "我的待办"
				this.getData();
			} else {
				this.navTitle = "我的已办";
				this.getDoneData();
			}
		},
		onReachBottom() {
			
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
				if (this.type == 1) {
					this.getData();
				}else{
					this.getDoneData();
				}
			})
			uni.$once('return', res => {
				if (res) {
					if (this.type == 1) {
						this.getData();
					}else{
						this.getDoneData();
					}
				}
			})

		},
		methods: {
			scrollLoadMoreData(){
				if (this.pageNo >= this.maxPage) return;
				this.status = 'loading';
				this.pageNo = this.pageNo + 1;
				if (this.type == 1) {
					this.getData();
				}else{
					this.getDoneData();
				}
			},
			//搜索
			searchChange() {
				this.pageNo = 1
				this.getData();
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
			//待办
			getData() {
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
			//已办
			getDoneData(){
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
				;
				getDoneTaskList(data, res => {
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
			clickBatch(item) {
				if (item == 3) {
					this.refresh();
				}
				if (item == 1) {
					this.isBatchApproval = false;
				}
				if (item == 2) {
					this.isBatchApproval = true
				}

				this.isBatch = true;
			},
			checkboxChangeAll(n) {
				this.checkValue = n
				this.lstCheck = [];
				if (isEmpty(this.checkValue)) { //取消全选
					this.checkboxValue = [];
				} else {
					for (let i = 0; i < this.TaskList.length; i++) {
						this.checkboxValue.push(i)
						this.lstCheck.push(i)
					}
				}
				console.log(this.lstCheck)
			},
			checkboxChange(n) {
				this.checkboxValue = n;
				this.lstCheck = [];
				for (let i in n) {
					this.lstCheck.push(i)
				}
				if (this.checkboxValue.length == this.TaskList.length) {
					this.checkValue = ["1"]
				} else {
					this.checkValue = []
				}
				console.log(this.lstCheck)
			},
			//刷新页面
			refresh() {
				uni.redirectTo({
					url: '/pages/workbench/processCenter/needToBeDealtWith?type=1'
				});
			},
			gotoDetail(item) {
				uni.setStorageSync('reimbursDetails', item)
				console.log(item)
				if(item.bizCode=="SUMEXPENSE"){ //报销申请
					if(this.type==1){
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/reimbursementDetails?isNeedWith=true"
						})
					}else{
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/reimbursementDetails?isDonedWith=true"
						})
					}
				}
				else if(item.bizCode=="COLLECTION"){ //回款管理
					if(this.type==1){
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/collectionManagement/collectionDetail?isNeedWith=true"
						})
					}else{
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/reimbursementDetails?isDonedWith=true"
						})
					}
				}
				else if(item.bizCode=="PRODUCTQUOTE"){ //产品报价
					if(this.type==1){
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/quotationManagement/detail?isNeedWith=true&id="+item.bizId
						})
					}else{
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/quotationManagement/detail?isDonedWith=true&id="+item.bizId
						})
					}
				}
				
				
			},
			//返回上一级
			leftClick() {
				uni.navigateBack();
			},


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

	.u-loading-icon {
		margin-top: 30px;
	}

	.logo {
		width: 24px;
		height: 24px;
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
					width: 30px;
					height: 30px;
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
			background: #fff;
			border-top: 1px solid #f0f4f9;

			.u-button {
				width: 47%;
				top: 16px;
			}

			.batch-reject {
				float: left;

				.u-button__text {
					font-size: 17px !important;
					color: rgba(96, 98, 102, 1);
				}
			}

			.batch-approval {
				float: right;

				.u-button__text {
					font-size: 17px !important;
				}
			}

			.all-box {
				width: 50%;
				margin-top: 10px;
				float: left;

				.txt {
					font-size: 16px;
					color: rgba(51, 51, 51, 1);
					line-height: 48px;
				}

				.u-checkbox-group--column {
					display: inline-block;
					flex-direction: row;
					width: 64px;
				}
			}

			.batch-but {
				width: 30%;
				float: right;

				.u-button__text {
					font-size: 17px !important;
				}
			}

			.cancel {
				width: 50px;
				line-height: 48px;
				margin-top: 10px !important;
				font-size: 17px;
				display: inline-block;

				.u-text__value {
					font-size: 17px !important;
					text-align: center !important;
					color: rgba(48, 49, 51, 1) !important;
				}
			}
		}
	}
</style>
