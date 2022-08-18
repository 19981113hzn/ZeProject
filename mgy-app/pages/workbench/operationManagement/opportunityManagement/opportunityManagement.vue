<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="商机管理" bgColor="#fff" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search v-if="tabbarNum==0" :show-action="false" placeholder="客户名称" bgColor="rgba(244, 246, 250, 1)"
					v-model="selectInfo.searchValue" :clearabled="true" @change="searchChange"></u-search>
				<u-search v-if="tabbarNum==1" :show-action="false" placeholder="销售状态" bgColor="rgba(244, 246, 250, 1)"
					v-model="selectInfo.saleStatus" :clearabled="true" @change="searchChange"></u-search>
				<text class="sticky-txt" @click="clickScreen">筛选</text>
			</view>

		</u-sticky>
		<!-- 商机列表 -->
		<view v-if="tabbarNum==0">
			<view class="card" v-for="(item, index) in lstopportunity" :key="index">
				<view class="card-pa">
					<view @click="gotoDetail(item)">
						<u-cell :title="item.name">
							<!-- <image class="logo" slot="icon" src="/static/img/workbench/icon_costManagement.png"></image> -->
							<u-tag slot="value" :text="item.bizOpptyType" bgColor="rgba(243, 255, 237, 1)"
								borderColor="rgba(243, 255, 237, 1)" color="rgba(103, 194, 58, 1)" size="mini">
							</u-tag>
						</u-cell>
						<u--form labelWidth="105">
							<u-form-item label="商机负责人员">
								<text>{{item.belongUserName}}</text>
							</u-form-item>
							<u-form-item label="预计销售金额">
								<text>¥ {{item.expectSaleAmount}}</text>
							</u-form-item>
							<u-form-item label="预计签单日期">
								<text>{{item.expectSigningDate}}</text>
							</u-form-item>
						</u--form>
					</view>
					<u-tabs :list="listTabs" :scrollable="false" lineColor="transparent" @click="opportunityInfo=item"
						@change="clickTabs"></u-tabs>
				</view>

			</view>
			<u-loading-icon v-if="!isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
			<u-empty v-if="lstopportunity.length==0 && isLoading" mode="data"
				icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
			<u-loadmore v-if="lstopportunity.length>0" :status="status" :loading-text="loadingText"
				:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
		</view>
		<!-- 商机看板 -->
		<view v-if="tabbarNum==1">
			<view>
				<u-collapse ref="collapseItem" accordion class="see-board" :isLink="false" @change="openOrClose">
					<view style="padding-bottom: 15px;" :name="item1.saleStatus" v-for="(item1, index1) in boardList"
						:key="index1" @click="clickDemand(item1,index1)">
						<u-collapse-item :title="item1.saleStatus">
							<view slot="icon">
								<view class="icon-img"></view>
							</view>
							<view slot="title" class="u-slot-title">
								<text class="u-cell-text">{{item1.saleStatus}}</text>
								<text class="title-proportion">{{item1.proportion}}%</text>
							</view>
							<view slot="value" class="u-slot-value">
								<text class="u-cell-text">￥{{item1.expectSaleAmountTotal}}/{{item1.total}}个</text>
							</view>
							<view class="u-collapse-content" v-if="boardList">
								<view class="card" v-for="(item2, index2) in BoardlistDetail" :key="index2">
									<view class="card-pa">
										<view @click="gotoDetail(item2)">
											<u-cell :title="item2.name">
												<u-tag slot="value" text="潜在商机" bgColor="rgba(243, 255, 237, 1)"
													borderColor="rgba(243, 255, 237, 1)" color="rgba(103, 194, 58, 1)"
													size="mini">
												</u-tag>
											</u-cell>
											<u--form labelWidth="105">
												<u-form-item label="负责人员">
													<text>{{item2.belongUserName}}</text>
												</u-form-item>
												<u-form-item label="预计销售金额">
													<text>¥ {{item2.expectSaleAmount}}</text>
												</u-form-item>
												<u-form-item label="预计签单日期">
													<text>{{item2.expectSigningDate}}</text>
												</u-form-item>
											</u--form>
										</view>
										<u-tabs :list="listTabs" :scrollable="false" lineColor="transparent"
											@click="opportunityInfo=item2" @change="clickTabs"></u-tabs>
									</view>

								</view>
							</view>

						</u-collapse-item>
					</view>
				</u-collapse>
			</view>



		</view>
		<u-tabbar :value="tabbarNum" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true"
			@change="changeTabbar">
			<u-tabbar-item text="列表">
				<image class="u-page__item__slot-icon" slot="active-icon" src="/static/img/opportunity/icon-lb.png">
				</image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/opportunity/icon-lb2.png">
				</image>
			</u-tabbar-item>
			<u-tabbar-item text="看板">
				<image class="u-page__item__slot-icon" slot="active-icon" src="/static/img/opportunity/icon-kb2.png">
				</image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/opportunity/icon-kb.png">
				</image>
			</u-tabbar-item>
			</u-tabbar-item>
		</u-tabbar>
		<u-action-sheet title="更多" :show="showAction" :closeOnClickOverlay="true" :round="24" @close="showAction=false">
			<u-grid :border="false" col="5" @click="clickGrid">
				<u-grid-item v-if='isAdministrator'>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_user.png"></image>
					</view>
					<text class="grid-text">转移商机</text>
				</u-grid-item>
				<u-grid-item v-if='isAdministrator'>
					<view class="grid-img">
						<image class="logo" src="/static/img/opportunity/icon-tjxz.png"></image>
					</view>
					<text class="grid-text">添加协作</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/opportunity/icon-bgzt.png"></image>
					</view>
					<text class="grid-text">变更状态</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/opportunity/icon-tjbj.png"></image>
					</view>
					<text class="grid-text">添加报价</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/opportunity/icon-xgfj.png"></image>
					</view>
					<text class="grid-text">相关附件</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_delete.png"></image>
					</view>
					<text class="grid-text">编辑商机</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_delete.png"></image>
					</view>
					<text class="grid-text">删除商机</text>
				</u-grid-item>
			</u-grid>
		</u-action-sheet>
		<u-modal :show="showDelete" title="删除确认" content='确定要删除该商机吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
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
		getUserListByUserId,
		getbizOpptyList,
		getBizOpptyBoard,
		getBoardDetailList,
		deleteBizOppty,
		getSaleStatusDict,
		checkDepartCharge,
	} from "@/util/interface.js"
	export default {
		data() {
			let date = new Date()
			date.setFullYear(date.getFullYear() + 10);
			const minDate = Date.parse(new Date());
			const maxDate = Date.parse(new Date(date));
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				topheight: 0,
				tabbarNum: 0,
				// showBoard: false,
				BoardlistDetail: [], //看板详情列表
				selectInfo: {
					searchValue: "", //客户名称
					expectSigningStartTime: "", //预计签单开始时间
					expectSigningEndTime: "", //预计签单结束时间
					listType: "", //列表类型
					bizOpptySource: "", //商机来源
					transactionProbability: "", //成交几率
					belongUserIds: "", //归属人ID集合
					saleStatus: "", //销售状态

				},
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
				}, ],
				lstopportunity: [],
				opportunityInfo: {},
				lstScreen: [{
						type: 1, //1多选  2选择时间 3收入费用
						title: "商机分类",
						defaultSelectedIndex: "0",
						isMutiple: false, //是否多选
						lst: [{
								name: "全部商机",
								value: "0"
							},
							{
								name: "我的客户",
								value: "1"
							},
							{
								name: "下属商机",
								value: "2"
							},
							{
								name: "我协作的",
								value: "3"
							},
							{
								name: "下属协作",
								value: "4"
							},
							{
								name: "成交商机",
								value: "5"
							}
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "销售状态",
						defaultSelectedIndex: [],
						isMutiple: true, //是否多选
						lst: [{
								name: "目标客户",
								value: "0"
							},
							{
								name: "需求挖掘",
								value: "1"
							},
							{
								name: "需求明确",
								value: "2"
							}, {
								name: "方案交流",
								value: "3"
							},
							{
								name: "商务谈判",
								value: "4"
							},
							{
								name: "合同签订",
								value: "5"
							}
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "商机来源",
						defaultSelectedIndex: [],
						isMutiple: true,
						lst: [{
								name: "电话营销",
								value: "1"
							},
							{
								name: "主动来电",
								value: "2"
							},
							{
								name: "客户介绍",
								value: "3"
							},
							{
								name: "朋友介绍",
								value: "4"
							},
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "成交机率",
						defaultSelectedIndex: [],
						isMutiple: true, //是否多选
						lst: [{
								name: "10%",
								value: "10%"
							},
							{
								name: "20%",
								value: "20%"
							},
							{
								name: "30%",
								value: "30%"
							}
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "归属人员",
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
						type: 2, //1多选  2选择时间 3收入费用
						title: "预计签单日期",
						minDate: minDate,
						maxDate: maxDate,
						startTime: "",
						endTime: "",
					},
				],

				pageNo: 1,
				maxPage: 1,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isLoading: false, //加载中
				showAction: false,
				showDelete: false,
				boardList: [],
				lst: [{
						name: "目标客户",
						value: "¥10,000.00/10个",
						show: false
					},
					{
						name: "需求挖掘",
						value: "¥10,000.00/10个",
						show: false
					},
					{
						name: "需求明确",
						value: "¥10,000.00/10个",
						show: false
					},
					{
						name: "方案交流",
						value: "¥10,000.00/10个",
						show: false,
						show: false
					},
					{
						name: "商务谈判",
						value: "¥10,000.00/10个",
						show: false
					},
					{
						name: "合同签订",
						value: "¥10,000.00/10个",
						show: false
					},
					{
						name: "丢单",
						value: "¥10,000.00/10个",
						show: false
					},
				],
				isAdministrator: false, //true-部门负责人 false-普通人员
			}
		},
		onLoad() {
			this.getData();
			this.getBoardData()
			this.getDictItems('transaction_probability'); //成交几率
			this.getDictItems('biz_oppty_source'); //商机来源
			this.getDictItems('advance_notice'); //
			this.getDictItems('customer_contact_type');
			this.getDictItems('customer_status'); //客户状态
			this.getDictItems('sex'); //性别
			this.getDictItems('sys_customer_contact_role'); //角色
			this.getDictSaleStatus('sale_status'); //销售状态
			this.getUserList(); //归属人员
			this.getTopHeight();
			this.getcheckDepartCharge();

		},

		onShow() {
			uni.$once('result', res => {
				console.log('onresult res', res);
				for (let i = 0; i < res.length; i++) {
					let item = res[i];
					if (item.title == "商机分类") {
						this.selectInfo.listType = item.defaultSelectedIndex;
					}
					if (item.title == "销售状态") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.saleStatus = SelectedIndex;
					}
					if (item.title == "商机来源") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.bizOpptySource = SelectedIndex;
					}
					if (item.title == "成交机率") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.transactionProbability = SelectedIndex;
					}
					if (item.title == "归属人员") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.belongUserIds = SelectedIndex;
					}
					if (item.title == "预计签单日期") {
						this.selectInfo.expectSigningStartTime = item.startTime;
						this.selectInfo.expectSigningEndTime = item.endTime;
					}

				}
				console.log('selectInfo:', this.selectInfo)
				this.getData();
			});
			uni.$once('return', res => {
				if (res) {
					this.pageNo = 1;
					this.getData();
				}
			})

		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getData();
		},
		methods: {
			gotoDetail(item) {
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/opportunityManagement/detail?id=" + item.id
				})
			},

			// 获取商机看板数据
			getBoardData() {
				let data = "?pageNo=" + this.pageNo +
					"&pageSize=10" +

					(!isEmpty(this.selectInfo.saleStatus) ? ("&saleStatus=" + this.selectInfo
						.saleStatus) : "") //销售状态
				getBizOpptyBoard(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res);
						if (this.pageNo == 1) {
							this.boardList = isEmpty(res.result) ? [] : res.result;
						} else {
							this.boardList = this.boardList.concat(res.resul)
						}
						this.maxPage = isEmpty(res.result) ? this.maxPage : res.result.pages
						if (this.pageNo >= this.maxPage) this.status = 'nomore';
						else this.status = 'loading';
					} else {
						uni.$u.toast(res.message);
					}
					// this.boardList = res.result
					// console.log(this.BoardlistDetail);
					// this.boardList.map(el => el.showBoard = false)
					console.log(this.boardList);
				})
			},
			//状态查询
			getDictItems(dictCode) {
				let data = "?dictCode=" + dictCode
				getDictItemsByCode(data, res => {
					if (res.code == 200 && res.success) {
						getApp().globalData[dictCode] = res.result;
						let lst = [];
						for (let j = 0; j < res.result.length; j++) {
							lst.push({
								name: res.result[j].text,
								value: res.result[j].value
							})
							if (j == res.result.length - 1) {
								this.lstcustomer_status = lst
							}
						}
						for (let i = 0; i < this.lstScreen.length; i++) {

							if (this.lstScreen[i].title == "商机来源" && dictCode == 'biz_oppty_source') {
								this.lstScreen[i].lst = lst;
							}
							if (this.lstScreen[i].title == "成交机率" && dictCode == 'transaction_probability') {
								this.lstScreen[i].lst = lst;
							}
						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//归属人员
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
							if (this.lstScreen[i].title == "归属人员") {
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
			// 查询销售状态
			getDictSaleStatus(dictCode) {
				let data = "?dictCode=" + dictCode
				getSaleStatusDict(data, res => {
					if (res.code == 200 && res.success) {
						getApp().globalData[dictCode] = res.result;
						let lst = [];
						for (let j = 0; j < res.result.length; j++) {
							lst.push({
								name: res.result[j].text,
								value: res.result[j].value
							})
						}
						for (let i = 0; i < this.lstScreen.length; i++) {
							if (this.lstScreen[i].title == "销售状态") {
								this.lstScreen[i].lst = lst;
							}
						}
					} else {
						uni.$u.toast(res.message);
					}
					console.log(res);
					// uni.setStorageSync("sale_res", res.result)
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
			getcheckDepartCharge() {
				checkDepartCharge("", res => {
					if (res.code == 200 && res.success) {
						this.isAdministrator = res.result //true-部门负责人 false-普通人员
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//返回上一级
			leftClick() {
				uni.navigateBack();
			},
			rightClick() {
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/opportunityManagement/addOpportunity?returnPageNumber=1"
				})
			},
			getData() {
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					(!isEmpty(this.selectInfo.searchValue) ? ("&customerName=" + this.selectInfo.searchValue) : "") //客户名称
					+
					(!isEmpty(this.selectInfo.expectSigningStartTime) ? ("&expectSigningStartTime=" + this.selectInfo
						.expectSigningStartTime) : "") //预计签单开始时间
					+
					(!isEmpty(this.selectInfo.expectSigningEndTime) ? ("&expectSigningEndTime=" + this.selectInfo
						.expectSigningEndTime) : "") //预计签单结束时间
					+
					(!isEmpty(this.selectInfo.listType) ? ("&listType=" + this.selectInfo.listType) :
						"") //列表类型 0-全部商机 1-我的商机 2-下属商机 3-我协作的 4-下属协作 5-成交商机
					+
					(!isEmpty(this.selectInfo.bizOpptySource) ? ("&bizOpptySource=" + this.selectInfo.bizOpptySource) :
						"") //	商机来源
					+
					(!isEmpty(this.selectInfo.transactionProbability) ? ("&transactionProbability=" + this.selectInfo
						.transactionProbability) : "") //成交几率
					+
					(!isEmpty(this.selectInfo.belongUserIds) ? ("&belongUserIds=" + this.selectInfo
						.belongUserIds) : "") //归属人ID
					+
					(!isEmpty(this.selectInfo.saleStatus) ? ("&saleStatus=" + this.selectInfo
						.saleStatus) : "") //销售状态

				getbizOpptyList(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res);
						if (this.pageNo == 1) {
							this.lstopportunity = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.lstopportunity = this.lstopportunity.concat(res.result.records)
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
				if (this.tabbarNum == 0) {
					this.getData();
				} else {
					this.getBoardData()
				}
			},
			clickScreen() {
				if (!this.firstTime) {
					this.firstTime = true;
					uni.setStorageSync('_lstScreen', this.lstScreen) //1*60*60*24*7
					uni.setStorageSync('OldLstScreen', this.lstScreen) //1*60*60*24*7
				}
				uni.navigateTo({
					url: "/pages/filter-all/filter-all?type=4"
				});
			},
			changeTabbar(name) {
				this.tabbarNum = name
			},
			clickTabs(item) {
				console.log(item)
				console.log(this.opportunityInfo)
				switch (item.index) {
					case 0: //跟进
						const params = {
							bizOpptyId: this.opportunityInfo.id,
							customerName: this.opportunityInfo.customerName,
							customerId:this.opportunityInfo.customerId,
						}
						uni.navigateTo({
							// url: "/pages/assist/customerManagement/newFollowUp?type=add&addOpportunity=0"
							url: "/pages/assist/customerManagement/newFollowUp?type=add&businessCode=BizOppty&params=" +
								JSON.stringify(
									params)
						})
						break;
					case 1: //电话
						this.phone(this.opportunityInfo.contactPhone);
						break;
					case 2: //更多
						this.showAction = true;
						break;
					default:
						break;
				}
			},
			// 拨打电话
			phone(p) {
				uni.makePhoneCall({
					phoneNumber: p
				}).catch((e) => {
					// console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
				})
			},
			clickDemand(item, index) {
				// this.$refs.collapseItem[index].queryRect();
				let saleStatus = item.saleStatus
				let data = "?saleStatus=" + saleStatus +
					"&pageNo=" + this.pageNo +
					"&pageSize=5"
				getBoardDetailList(data, res => {
					this.BoardlistDetail = res.result
					console.log(this.BoardlistDetail);
				})
			},
			openOrClose() {
				console.log('change事件:1111')
			},

			//更多==》点击选择
			clickGrid(name) {
				this.showAction = false;
				name = this.isAdministrator ? name : name + 2
				switch (name) {

					case 0: //转移商机
						uni.navigateTo({
							url: "/pages/workbench/operationManagement/opportunityManagement/transferOpportunity?id=" +
								this.opportunityInfo.id
						})
						break;
					case 1: //添加协作
						uni.navigateTo({
							url: "/pages/workbench/operationManagement/opportunityManagement/addCollaboration?id=" +
								this.opportunityInfo.id
						})
						break;
					case 2: //变更状态
						uni.navigateTo({
							url: "/pages/workbench/operationManagement/opportunityManagement/changeSalesStatus?bizOpptyId=" +
								this.opportunityInfo.id
						})
						break;
					case 3: //添加报价
						if(this.opportunityInfo.quoteAmount>0){
							uni.navigateTo({ //有报价就直接跳去确认报价
								url: "/pages/workbench/operationManagement/opportunityManagement/confirmQuotation?bizOpptyId="+this.opportunityInfo.id + "&returnNumber=1&type=edit"
							})
						}else{
							uni.navigateTo({ //跳去关联产品
								url: "/pages/product/productManagement/relatedProduct?quota=1&bizOpptyId="+this.opportunityInfo.id + "&returnNumber=2&type=add"
							})
						}
						
						
						
						break;
					case 4: //相关附件
						uni.navigateTo({ 
							url: "/pages/assist/documentManagement/relevantAttachments?id="+this.opportunityInfo.id+"&businessCode=BizOppty"
						})
						
						break;
					case 5: //编辑商机
						uni.navigateTo({
							url: "/pages/workbench/operationManagement/opportunityManagement/addOpportunity?returnPageNumber=1&id=" +
								this.opportunityInfo.id
						})
						break;
					case 6: //删除商机
						this.showDelete = true;
						break;
					default:
						break;
				}
			},
			confirmDelete() {
				let data = this.opportunityInfo.id
				deleteBizOppty(data, res => {
					if (res.code == 200 && res.success) {
						this.showDelete = false
						uni.showToast({
							title: "删除成功!"
						});
						setTimeout(() => {
							this.pageNo = 1;
							this.getData();
						}, 800)

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

	.logo {
		width: 24px;
		height: 24px;
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
		.u-page__item__slot-icon {
			width: 24px;
			height: 24px;
		}

		.u-tabbar-item__text {
			font-size: 12px;

		}
	}

	/deep/.card {
		padding: 8px 16px 0 16px;

		.card-pa {
			padding: 0px 16px 0px;
			background: #fff;
			border-radius: 10px;

			.u-line {
				border: none !important;
			}

			.u-cell__body {
				padding: 10px 0px 0px;

				.u-cell__title-text {
					font-size: 16px;
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

	/deep/.see-board {
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
				color: rgba(0, 114, 255, 1);
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
			}
		}
	}

	/deep/ .u-page {
		padding: 0;

		&__item {

			&__title {
				color: $u-tips-color;
				background-color: $u-bg-color;
				padding: 15px;
				font-size: 15px;

				&__slot-title {
					color: $u-primary;
					font-size: 14px;
				}
			}
		}
	}

	.u-collapse-content {
		color: $u-tips-color;
		font-size: 14px;
	}

	/deep/.u-collapse-item__content {
		// height: 0;
		// transition: none;
		// display: flex;
		// flex-direction: column;
	}

	/deep/.u-collapse-item__content__text {
		padding: 0;
	}
</style>
