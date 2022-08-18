<template>
	<view class="content" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="客户档案" bgColor="#fff" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<u-overlay :show="ShowHidden" @click="ShowHidden = false" opacity=".01"
			:style="{ 'padding-top': statusBarHeight + 'px' }">
			<view class="arrivalNavigation" v-if="ShowHidden">
				<view class="d4"></view>
				<view class="sideNavigation">
					<u-cell title="新建客户" @click.native.stop="newCustomer">
						<image class="logo" slot="icon" src="/static/img/assist/icon_new_cust.png"></image>
					</u-cell>
					<view class="liBottomBorder"></view>
					<u-cell title="拍照识别" @click.native.stop="chooseImage">
						<image class="logo" slot="icon" src="/static/img/assist/icon_ocr.png"></image>
					</u-cell>

				</view>
			</view>
		</u-overlay>


		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="客户名称" bgColor="rgba(244, 246, 250, 1)"
					v-model="selectInfo.searchValue" :clearabled="true" @change="searchChange"></u-search>
				<text class="sticky-txt" @click="clickScreen">筛选</text>
			</view>

		</u-sticky>
		<view :class="ShowHidden ? 'tl-show': ''">
			<view class="card" v-for="(item, index) in lstCustomer" :key="index">
				<view class="card-pa">
					<view @click="gotoDetail(item)">
						<u-cell :title="item.name">
							<view slot="icon" class="logo-icon">
								<view class="logo-icon-txt">
									{{sliceString(item.name,0,4)}}
								</view>
							</view>
							<!-- <image class="logo" slot="icon" src="/static/img/workbench/icon_costManagement.png"></image> -->
							<u-tag v-if="item.customerStatus==1" slot="value" :text="item.customerStatus_dictText"
								bgColor="rgba(255, 236, 216, 1)" borderColor="rgba(255, 236, 216, 1)"
								color="rgba(230, 162, 60, 1)" size="mini">
							</u-tag>
							<u-tag v-else-if="item.customerStatus==2" slot="value" :text="item.customerStatus_dictText"
								bgColor="rgba(222, 230, 245, 1)" borderColor="rgba(222, 230, 245, 1)"
								color="rgba(124, 154, 214, 1)" size="mini">
							</u-tag>
							<u-tag v-else-if="item.customerStatus==3" slot="value" :text="item.customerStatus_dictText"
								bgColor="rgba(229, 240, 255, 1)" borderColor="rgba(229, 240, 255, 1)"
								color="rgba(0, 114, 255, 1)" size="mini">
							</u-tag>
							<u-tag v-else-if="item.customerStatus==4" slot="value" :text="item.customerStatus_dictText"
								bgColor="rgba(234, 227, 241, 1)" borderColor="rgba(234, 227, 241, 1)"
								color="rgba(172, 145, 198, 1)" size="mini">
							</u-tag>
							<u-tag v-else-if="item.customerStatus==5" slot="value" :text="item.customerStatus_dictText"
								bgColor="rgba(220, 234, 239, 1)" borderColor="rgba(220, 234, 239, 1)"
								color="rgba(117, 173, 193, 1)" size="mini">
							</u-tag>
							<u-tag v-else-if="item.customerStatus==6" slot="value" :text="item.customerStatus_dictText"
								bgColor="rgba(239, 248, 235, 1)" borderColor="rgba(239, 248, 235, 1)"
								color="rgba(103, 194, 58, 1)" size="mini">
							</u-tag>
							<u-tag v-else-if="item.customerStatus==7" slot="value" :text="item.customerStatus_dictText"
								bgColor="rgba(241, 245, 250, 1)" borderColor="rgba(241, 245, 250, 1)"
								color="rgba(144, 147, 153, 1)" size="mini">
							</u-tag>
							</u-tag>
						</u-cell>
						<u--form labelWidth="75">
							<u-form-item label="负责人员">
								<text>{{item.responsiblePersonName}}</text>
							</u-form-item>
							<u-form-item label="客户级别">
								<text>{{item.customerLevel_dictText || '-'}}</text>
							</u-form-item>
							<u-form-item label="最后跟进">
								<text>{{item.lastContactTime || '-'}}</text>
							</u-form-item>
						</u--form>
					</view>
					<u-tabs :list="listTabs" :scrollable="false" lineColor="transparent" @click="customerInfo=item"
						@change="clickTabs"></u-tabs>
				</view>

			</view>
			<u-loading-icon v-if="!isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
			<u-empty v-if="lstCustomer.length==0 && isLoading" mode="data"
				icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
			<u-loadmore v-if="lstCustomer.length>0" :status="status" :loading-text="loadingText"
				:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
		</view>
		<u-action-sheet title="更多" :show="showAction" :closeOnClickOverlay="true" :round="24" @close="showAction=false">
			<u-grid :border="false" col="5" @click="clickGrid">
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_user.png"></image>
					</view>
					<text class="grid-text">转移客户</text>
				</u-grid-item>
				<u-grid-item v-if="customerInfo.collect==0">
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_follow.png"></image>
					</view>
					<text class="grid-text">重点关注</text>
				</u-grid-item>
				<u-grid-item v-if="customerInfo.collect==1">
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_cancel_following.png"></image>
					</view>
					<text class="grid-text">取消关注</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_edit.png"></image>
					</view>
					<text class="grid-text">编辑客户</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_delete.png"></image>
					</view>
					<text class="grid-text">删除客户</text>
				</u-grid-item>
			</u-grid>
		</u-action-sheet>
		<u-modal :show="showDelete" title="删除确认" content='确定要删除该客户吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
		<u-overlay :show="showOverlay">
			<view class="warp">
				<u-loading-icon text="加载中" textSize="16" color="#fff" textColor="#fff" :vertical="true">
				</u-loading-icon>
			</view>
		</u-overlay>
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
		getSysCustomer,
		getDictItemsByCode,
		getUserListByUserId,
		editCustomerCollect,
		customerDelete,
		recognizeBusinessLicense
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				topheight: 0,
				ShowHidden: false,
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
				showAction: false,
				lstCustomer: [],
				customerInfo: {}, //客户数据
				lstcustomer_status: [], //客户状态
				lstScreen: [{
						type: 1, //1多选  2选择时间 3收入费用
						title: "客户分类",
						defaultSelectedIndex: "",
						isMutiple: false, //是否多选
						lst: [{
								name: "全部分类",
								value: ""
							},
							{
								name: "我的客户",
								value: "1"
							},
							{
								name: "下属客户",
								value: "2"
							},
							{
								name: "关注客户",
								value: "3"
							}
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "客户类型",
						defaultSelectedIndex: "",
						isMutiple: false, //是否多选
						lst: [{
								name: "全部类型",
								value: ""
							},
							{
								name: "企业客户",
								value: "0"
							},
							{
								name: "个人客户",
								value: "1"
							}
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "客户状态",
						defaultSelectedIndex: [],
						isMutiple: true,
						lst: [{
								name: "了解产品",
								value: "1"
							},
							{
								name: "正在跟进",
								value: "2"
							},
							{
								name: "正在试用",
								value: "3"
							},
							{
								name: "准备购买",
								value: "4"
							},
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "客户级别",
						defaultSelectedIndex: [],
						isMutiple: true, //是否多选
						lst: [{
								name: "A(重点客户)",
								value: "1"
							},
							{
								name: "B(普通客户)",
								value: "2"
							},
							{
								name: "C(非优先客户)",
								value: "3"
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
						title: "最后跟进时间",

						startTime: "",
						endTime: "",
					},
					// {
					// 	type:1,//1多选  2选择时间 3收入费用
					// 	title:"所属部门",
					// 	defaultSelectedIndex:[],
					// 	isMore:true,
					// 	isMutiple:true,
					// 	moreTitle:"更多",
					// 	total:"",//点击获取跟多的时候，需要获取，进行查询
					// 	lst:[
					// 		{name:"总经办",value:1},
					// 		{name:"人事部",value:2},
					// 		{name:"行政部",value:3},
					// 		{name:"销售部",value:4},
					// 		{name:"市场部",value:5},
					// 	]
					// },
				],
				pageNo: 1,
				maxPage: 1,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isLoading: false, //加载中
				selectInfo: {
					searchValue: '',
					collect: "", //是否收藏 0否 1是
					customerStatus: '', //客户状态
					sign: "", //	1我的 2下属
					customerType: "", //客户类型
					// status:"",
					lastContactBeginTime: "", //开始时间
					lastContactEndTime: "", //结束时间
					// minAmounts:"",//最低金额
					// maxAmounts:"",//最高金额
				},
				showDelete: false,
				showOverlay: false, //ocr遮罩层
			}
		},
		onLoad() {
			this.getData();
			// this.getDepartList();
			this.getDictItems('customer_status'); //客户状态
			this.getDictItems('customer_type'); //客户类型
			this.getDictItems('customer_level'); //客户级别
			this.getDictItems('customer_source'); //客户来源
			this.getDictItems('company_org_type'); //企业类型
			this.getDictItems('operating_state'); //经营状态
			this.getDictItems('staff_num_range'); //人员规模
			this.getDictItems('advance_notice'); //任务提醒			
			this.getDictItems('is_micro_ent'); //是否小微企业
			this.getDictItems('customer_contact_type'); //跟进方式
			this.getDictItems('sex'); //联系人性别
			this.getDictItems('sys_customer_contact_role'); //联系人角色
			this.getDictItems('industry'); //所属行业
			this.getUserList(); //归属人员
			this.getTopHeight();
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getData();
		},
		onShow() {
			this.pageNo = 1;
			uni.$once('result', res => {
				console.log('onresult res', res);
				for (let i = 0; i < res.length; i++) {
					let item = res[i];
					if (item.title == "客户分类") {
						if (item.defaultSelectedIndex == "3") {
							this.selectInfo.collect = 1;
							this.selectInfo.sign = "";
						} else {
							this.selectInfo.sign = item.defaultSelectedIndex;
							this.selectInfo.collect = "";
						}

					}
					if (item.title == "客户类型") {
						this.selectInfo.customerType = item.defaultSelectedIndex;
					}
					if (item.title == "客户状态") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.customerStatus = SelectedIndex;
					}
					if (item.title == "客户级别") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.customerLevel = SelectedIndex;
					}
					if (item.title == "归属人员") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.responsiblePerson = SelectedIndex;
					}
					if (item.title == "最后跟进时间") {
						this.selectInfo.lastContactBeginTime = item.startTime;
						this.selectInfo.lastContactEndTime = item.endTime;
					}
				}
				console.log('selectInfo:', this.selectInfo)
				this.getData();
			});
			uni.$once('return', res => {
				if (res) {
					this.pageNo = 1;
					this.getData();
					//this.refresh();
				}
			})
		},
		methods: {
			//截取前四位的字符串
			sliceString(stringObject, start, end) {
				return isEmpty(stringObject)?'':stringObject.slice(start, end)
			},
			//查找状态值
			selectStatus(customerStatus) {
				let data = this.lstcustomer_status.find(item => item.value == customerStatus)
				return data.name;
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
							if (this.lstScreen[i].title == "客户状态" && dictCode == 'customer_status') {
								this.lstScreen[i].lst = lst;
							}
							if (this.lstScreen[i].title == "客户级别" && dictCode == 'customer_level') {
								this.lstScreen[i].lst = lst;
							}
							// if (this.lstScreen[i].title == "客户级别" && dictCode == 'customer_level') {
							// 	this.lstScreen[i].lst = lst;
							// }
						}

					} else {
						uni.$u.toast(res.message);
					}
					console.log(res)
				})
			},
			clickTabs(item) {
				console.log(item)
				console.log(this.customerInfo)
				switch (item.index) {
					case 0: //跟进
						const params = {
							id: this.customerInfo.id,
							name: this.customerInfo.name
						}
						uni.navigateTo({
							url: "/pages/assist/customerManagement/newFollowUp?type=add&params=" + JSON.stringify(
								params)
						})
						break;
					case 1: //电话
						this.phone(this.customerInfo.phoneNumber);
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
			//刷新页面
			refresh() {
				uni.redirectTo({
					url: '/pages/assist/customerManagement/customerManagement'
				});
			},
			getData() {
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					(!isEmpty(this.selectInfo.searchValue) ? ("&key=" + this.selectInfo.searchValue) :
						"") //客户名称/编号/地址查询
					+
					(!isEmpty(this.selectInfo.sign) ? ("&sign=" + this.selectInfo.sign) :
						"") //当sign为null时: 查询全部， 1时：我的，2时： 下属
					+
					(!isEmpty(this.selectInfo.collect) ? ("&collect=" + this.selectInfo.collect) : "") //是否收藏 0否 1是
					+
					(!isEmpty(this.selectInfo.customerType) ? ("&customerType=" + this.selectInfo.customerType) :
						'') //客户类型
					+
					(!isEmpty(this.selectInfo.customerStatus) ? ("&customerStatus=" + this.selectInfo.customerStatus) :
						'') //客户状态
					+
					(!isEmpty(this.selectInfo.customerLevel) ? ("&customerLevel=" + this.selectInfo.customerLevel) :
						'') //客户级别
					+
					(!isEmpty(this.selectInfo.responsiblePerson) ? ("&responsiblePerson=" + this.selectInfo
							.responsiblePerson) :
						'') //归属人员
					+
					(!isEmpty(this.selectInfo.lastContactBeginTime) ? ("&lastContactBeginTime=" + this.selectInfo
						.lastContactBeginTime) : "") //开始时间
					+
					(!isEmpty(this.selectInfo.lastContactEndTime) ? ("&lastContactEndTime=" + this.selectInfo
						.lastContactEndTime) : "") //结束时间

				;
				getSysCustomer(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res);
						if (this.pageNo == 1) {
							this.lstCustomer = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.lstCustomer = this.lstCustomer.concat(res.result.records)
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
				this.getData();
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
					url: "/pages/filter-all/filter-all?type=4"
				});
			},
			//返回上一级
			leftClick() {
				uni.navigateBack();
			},
			//右上角
			rightClick() {
				this.ShowHidden = true;
			},
			//新建客户
			newCustomer() {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/newCustomer?returnPageNumber=1"
				})
				this.ShowHidden = false;
			},
			//拍照识别
			chooseImage() {
				//手机真机操作测试才能调用摄像头，相册图片，网页上只能选择图片
				var _this = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择、摄像头
					success: function(res) {
						_this.showOverlay = true;
						console.log(res)
						console.log("路径", res.tempFiles[0].path)
						let path = res.tempFiles[0].path
						recognizeBusinessLicense(path, "file", {
							user: "test"
						}, ret => {
							console.log("接口返回数据", ret)
							let data = JSON.parse(ret)
							if (data.success && data.code == 200) {
								_this.showOverlay = false;
								let result = JSON.parse(data.result)
								uni.setStorageSync("OCRresult", result);
								uni.navigateTo({
									url: "/pages/assist/customerManagement/newCustomer?returnPageNumber=1&isOCR=true"
								})
								console.log(result)
							} else {
								uni.$u.toast(data.message);
							}
						})
						//_this.imgShow = res.tempFilePaths[0]
					}
				});
			},
			//更多==》点击选择
			clickGrid(name) {
				this.showAction = false;
				switch (name) {
					case 0: //转移客户
						uni.navigateTo({
							url: "/pages/assist/customerManagement/transferCustomers?id=" + this.customerInfo.id
						})
						break;
					case 1: //重点关注或者取消关注
						this.editCollect();
						break;
					case 2: //编辑客户
						uni.navigateTo({
							url: "/pages/assist/customerManagement/newCustomer?returnPageNumber=1&isUpdata=true&customerId=" +
								this.customerInfo.id
						})
						break;
					case 3: //
						this.showDelete = true;
						break;
					default:
						break;
				}
			},
			confirmDelete() {
				let data = '?id=' + this.customerInfo.id
				customerDelete(data, res => {
					if (res.code == 200 && res.success) {
						this.showDelete = false
						uni.showToast({
							title: "删除成功!"
						});
						this.refresh();
						// uni.$emit('return', true);
						// uni.navigateBack();
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//重点关注或者取消关注
			editCollect() {
				let data = {
					id: this.customerInfo.id,
					collect: (this.customerInfo.collect == 0 ? 1 : 0)
				}
				console.log(data)
				editCustomerCollect(data, res => {
					if (res.code == 200 && res.success) {
						uni.$u.toast(res.message);
						this.pageNo = 1;
						this.getData();
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//跳转详情页
			gotoDetail(item) {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/customerDetails?id=" + item.id
				})
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

	/deep/.card {
		padding: 8px 16px 0 16px;

		.card-pa {
			padding: 0 16px 0px;
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

	.u-loading-icon {
		margin-top: 30px;
	}

	.logo {
		width: 24px;
		height: 24px;
	}

	//从这里开始是弹出框的样式  不需要搜索框的 前面样式都不用加
	/deep/.arrivalNavigation {
		width: 250rpx;
		position: absolute;
		right: 20rpx;
		z-index: 999;

		.sideNavigation {
			width: 248rpx;
			background-color: #202020;
			color: #eee;
			border-radius: 10rpx;

			.u-cell__title-text {
				color: #fff;
			}

			.u-line {
				border: none !important;
			}

			.liBottomBorder {
				border-bottom: 0.1rpx solid;
				border-bottom-color: rgba(94, 94, 94, 1);
				width: 70px;
				margin-left: 45px;
			}

			.logo {
				width: 24px;
				height: 24px;
				right: 10px;
			}
		}

		.d4 {
			// position: absolute;
			//  	left: 140rpx;
			width: 0;
			height: 0;
			margin-left: 190rpx;
			margin-top: -20rpx;
			border-width: 20rpx;
			border-style: solid;
			border-color: transparent #333 transparent transparent;
			transform: rotate(90deg);
			/*顺时针旋转90°*/

		}
	}

	// 如果要显示遮罩层，那么用css控制底部的不允许滚动。
	.tl-show {
		overflow: hidden;
		position: fixed;
		height: 100%;
		width: 100%;
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

	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	/deep/.u-tabs__wrapper__nav__item__text {
		color: #606266 !important;
	}
</style>
