<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="线索管理" bgColor="#fff" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<u-overlay :show="ShowHidden" @click="ShowHidden = false" opacity=".01"
			:style="{ 'padding-top': statusBarHeight + 'px' }">
			<view class="arrivalNavigation" v-if="ShowHidden">
				<view class="d4"></view>
				<view class="sideNavigation">
					<u-cell title="新建线索" @click.native.stop="newClue">
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
			<view class="card" v-for="(item, index) in lstClue" :key="index">
				<view class="card-pa">
					<view @click="gotoDetail(item)">
						<u-cell :title="item.contacts">
							<view slot="icon" class="logo-icon">
								<view class="logo-icon-txt">
									{{sliceString(item.contacts,0,2)}}
								</view>
							</view>
							<!-- <image class="logo" slot="icon" src="/static/img/workbench/icon_costManagement.png"></image> -->
							<u-tag v-if="item.clueStatus==1" slot="value"
								text="未知"
								bgColor="rgba(241, 245, 250, 1)" borderColor="rgba(241, 245, 250, 1)"
								color="rgba(144, 147, 153, 1)" size="mini">
							</u-tag>
							<u-tag v-if="item.clueStatus==2 || item.clueStatus==3" slot="value" 
								:text="item.clueStatus==2?'初步意向':'下次邀约'"
								bgColor="rgba(235, 244, 255, 1)" borderColor="rgba(235, 244, 255, 1)"
								color="rgba(0, 114, 255, 1)" size="mini">
							</u-tag>
							<u-tag v-if="item.clueStatus==4" slot="value"
								text="已转客户"
								bgColor="rgba(239, 248, 235, 1)" borderColor="rgba(239, 248, 235, 1)"
								color="rgba(103, 194, 58, 1)" size="mini">
							</u-tag>
						</u-cell>
						<u--form labelWidth="75">
							<u-form-item label="手机号码">
								<text>{{item.phone}}</text>
							</u-form-item>
							<u-form-item label="客户名称">
								<text>{{item.customer || '-'}}</text>
							</u-form-item>
							<u-form-item label="负责人员">
								<text>{{item.chargeName || '-'}}</text>
							</u-form-item>
						</u--form>
					</view>
					<u-tabs :list="listTabs" :scrollable="false" lineColor="transparent" @click="clueInfo=item"
						@change="clickTabs"></u-tabs>
				</view>
			
			</view>
			<u-loading-icon v-if="!isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
			<u-empty v-if="lstClue.length==0 && isLoading" mode="data"
				icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
			<u-loadmore v-if="lstClue.length>0" :status="status" :loading-text="loadingText"
				:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
		</view>
		
		<u-action-sheet title="更多" :show="showAction" :closeOnClickOverlay="true" :round="24" @close="showAction=false">
			<u-grid :border="false" col="5" @click="clickGrid">
				<u-grid-item v-if="isStringEmpty(clueInfo.customerId)">
					<view class="grid-img">
						<image class="logo" src="/static/img/clue/clue_zwkh.png"></image>
					</view>
					<text class="grid-text">转为客户</text>
				</u-grid-item>
				<u-grid-item v-if="isStringEmpty(clueInfo.customerId)">
					<view class="grid-img">
						<image class="logo" src="/static/img/clue/clue_zwsj.png"></image>
					</view>
					<text class="grid-text">转为商机</text>
				</u-grid-item>
				<u-grid-item v-if="isStringEmpty(clueInfo.customerId)">
					<view class="grid-img">
						<image class="logo" src="/static/img/clue/clue_fsdx.png"></image>
					</view>
					<text class="grid-text">发送短信</text>
				</u-grid-item>
				<u-grid-item v-if="isStringEmpty(clueInfo.customerId)">
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_edit.png"></image>
					</view>
					<text class="grid-text">编辑线索</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_delete.png"></image>
					</view>
					<text class="grid-text">删除线索</text>
				</u-grid-item>
				<u-grid-item v-if="isStringEmpty(clueInfo.customerId)">
					<view class="grid-img">
						<image class="logo" src="/static/img/opportunity/icon-bgzt.png"></image>
					</view>
					<text class="grid-text">变更状态</text>
				</u-grid-item>
			</u-grid>
		</u-action-sheet>
		<u-modal :show="showDelete" title="删除确认" content='确定要删除该线索吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
		<u-overlay :show="showOverlay">
			<view class="warp">
				<u-loading-icon text="加载中" textSize="16" color="#fff" textColor="#fff" :vertical="true">
				</u-loading-icon>
			</view>
		</u-overlay>
		<u-action-sheet :actions="statusList" title="" :show="showStatusSheet" cancelText="取消" 
		@close="showStatusSheet=false" @select="selectStatus">
		</u-action-sheet>
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
		getClueSourcelist,
		getDictItemsByCode,
		getUserListByUserId,
		deleteClueSource,
		recognizeBusinessLicense,
		editClueSource
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				topheight: 0,
				tabbarNum: 0,
				ShowHidden: false,
				selectInfo: {
					searchValue: "", //客户名称
					sign:0,//0时: 查询全部， 1时：我的线索，2时： 下属的线索， 3时 已转客户
					startTime: "", //开始时间
					endTime: "", //结束时间
					clueStatus: "", //线索状态
					clueSource: "", //线索来源
					chargeId: "", //归属人ID集合
				},
				lstScreen: [{
						type: 1, //1多选  2选择时间 3收入费用
						title: "联系人分类",
						defaultSelectedIndex: "0",
						isMutiple: false, //是否多选
						lst: [{
								name: "全部线索",
								value: "0"
							},
							{
								name: "我的线索",
								value: "1"
							},
							{
								name: "下属的线索",
								value: "2"
							},
							{
								name: "已转为客户",
								value: "3"
							}
						]
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "线索来源",
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
						title: "线索状态",
						defaultSelectedIndex: [],
						isMutiple: true, //是否多选
						lst: [{
								name: "初步意向",
								value: "1"
							},
							{
								name: "下次邀约",
								value: "2"
							},
							{
								name: "已转客户",
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
				],
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
				pageNo: 1,
				maxPage: 1,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isLoading: false, //加载中
				showAction: false,
				showDelete: false,
				lstClue:[],
				clueInfo:{},
				firstTime:false,
				showOverlay: false, //ocr遮罩层
				showStatusSheet:false,
				statusList: [
					{
						name:'初步意向',
						value:2,
						color:'#007AFF',
						fontSize:'16'
					},
					{
						name:'下次邀约',
						value:3,
						color:'#007AFF',
						fontSize:'16'
					},
				],
			}
		},
		onLoad(){
			
			this.getDictItems('customer_contact_type'); //跟进方式
			this.getDictItems('sex'); //联系人性别
			this.getDictItems('clue_source'); //线索来源
			this.getDictItems('clue_status'); //线索状态
			this.getDictItems('advance_notice'); //任务提醒
			this.getDictItems('industry'); //所属行业
			this.getDictItems('customer_status'); //客户状态
			this.getDictItems('customer_type'); //客户类型
			this.getUserList();
			this.getTopHeight();
			this.getData();
		},
		onShow(){
			this.pageNo = 1;
			uni.$once('result', res => {
				console.log('onresult res', res);
				for (let i = 0; i < res.length; i++) {
					let item = res[i];
					if (item.title == "联系人分类") {
						this.selectInfo.sign = item.defaultSelectedIndex;
					}
					if (item.title == "线索来源") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.clueSource = SelectedIndex;
					}
					if (item.title == "线索状态") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.clueStatus = SelectedIndex;
					}
					if (item.title == "归属人员") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.chargeId = SelectedIndex;
					}
					if (item.title == "最后跟进时间") {
						this.selectInfo.startTime = item.startTime;
						this.selectInfo.endTime = item.endTime;
					}
				}
				console.log('selectInfo:', this.selectInfo)
				this.getData();
			});
			uni.$once('returnClue', res => {
				if (res) {
					this.pageNo = 1;
					this.getData();
					//this.refresh();
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
			gotoDetail(item){
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/culeManagement/detail?id="+item.id
				})
			},
			//截取前四位的字符串
			sliceString(stringObject, start, end) {
				return isEmpty(stringObject)?'':stringObject.slice(start, end)
			},
			//判断数据是否为空
			isStringEmpty(obj){
			    if(typeof obj=="undefined" || obj ==null || obj == ""){
			        return true;
			    }else{
			        return false;
			    }
			},
			//搜索
			searchChange() {
				this.pageNo = 1
				this.getData();
			},
			getData(){
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					(!isEmpty(this.selectInfo.searchValue) ? ("&customer=" + this.selectInfo.searchValue) :
						"") //客户名称/编号/地址查询
					+
					"&sign=" + this.selectInfo.sign //当sign为null时: 查询全部， 1时：我的，2时： 下属
					+
					(!isEmpty(this.selectInfo.clueSource) ? ("&clueSource=" + this.selectInfo.clueSource) :
						'') //线索来源
					+
					(!isEmpty(this.selectInfo.clueStatus) ? ("&clueStatus=" + this.selectInfo.clueStatus) :
						'') //线索状态
					+
					(!isEmpty(this.selectInfo.chargeId) ? ("&chargeId=" + this.selectInfo
							.chargeId) :
						'') //归属人员
					+
					(!isEmpty(this.selectInfo.startTime) ? ("&startTime=" + this.selectInfo
						.startTime) : "") //开始时间
					+
					(!isEmpty(this.selectInfo.endTime) ? ("&endTime=" + this.selectInfo
						.endTime) : "") //结束时间
				
				;
				getClueSourcelist(data,res=>{
					if (res.code == 200 && res.success) {
						console.log(res);
						if (this.pageNo == 1) {
							this.lstClue = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.lstClue = this.lstClue.concat(res.result.records)
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
			//返回上一级
			leftClick() {
				uni.navigateBack();
			},
			rightClick() {
				this.ShowHidden = true;
			},
			newClue(){
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/culeManagement/addClue?returnPageNumber=1"
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
									url: "/pages/workbench/operationManagement/culeManagement/addClue?returnPageNumber=1&isOCR=true"
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
			clickTabs(item) {
				console.log(item)
				console.log(this.customerInfo)
				switch (item.index) {
					case 0: //跟进
						const params = {
							clueSourceId: this.clueInfo.id,//线索id
							customerName: this.clueInfo.customer,//客户名称
							customerId:this.clueInfo.customerId,//客户id
							clueStatus:this.clueInfo.clueStatus,//线索状态
						}
						uni.navigateTo({
							url: "/pages/assist/customerManagement/newFollowUp?type=add&isClue=true&params=" + JSON.stringify(
								params)
						})
						break;
					case 1: //电话
						this.phone(this.clueInfo.phone);
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
							if (this.lstScreen[i].title == "线索来源" && dictCode == 'clue_source') {
								this.lstScreen[i].lst = lst;
							}
							if (this.lstScreen[i].title == "线索状态" && dictCode == 'clue_status') {
								this.lstScreen[i].lst = lst;
							}
						}
			
					} else {
						uni.$u.toast(res.message);
					}
					console.log(res)
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
			//更多==》点击选择
			clickGrid(name) {
				this.showAction = false;
				if(isEmpty(this.clueInfo.customerId)){  //未转客户的数据
					switch (name) {
						case 0: //转为客户
							let params = {
								id: this.clueInfo.id,//线索id
								customerName: this.clueInfo.customer,//客户名称
								customerId:this.clueInfo.customerId,//客户id
								contact:this.clueInfo.contacts,//首联系人
								phone:this.clueInfo.phone,//手机号码
								chargeId:this.clueInfo.chargeId,//归属人ID
								chargeName:this.clueInfo.chargeName//归属人名称
							}
							uni.navigateTo({
								url: "/pages/workbench/operationManagement/culeManagement/convertCustomer?isCustomer=true&params=" + JSON.stringify(params)
							})
							break;
						case 1: //转为商机
							let param = {
								id: this.clueInfo.id,//线索id
								customerName: this.clueInfo.customer,//客户名称
								customerId:this.clueInfo.customerId,//客户id
								contact:this.clueInfo.contacts,//首联系人
								phone:this.clueInfo.phone,//手机号码
								chargeId:this.clueInfo.chargeId,//归属人ID
								chargeName:this.clueInfo.chargeName//归属人名称
							}
							uni.navigateTo({
								url: "/pages/workbench/operationManagement/culeManagement/convertCustomer?isCustomer=false&params=" + JSON.stringify(param)
							})
							break;
						case 2: //发送短信
							this.callMyInviter(this.clueInfo.phone)
							break;
						case 3: //编辑线索
							uni.navigateTo({
								url: "/pages/workbench/operationManagement/culeManagement/addClue?returnPageNumber=1&id=" +
									this.clueInfo.id
							})
							break;
						case 4: //删除线索
							this.showDelete = true;
							break;
						case 5: //变更状态
							this.showStatusSheet = true;
							break;
						default:
							break;
					}
				}else{ //已转客户
					switch (name) {
						case 0: //删除线索
							this.showDelete = true;
							break;
					}
				}
				
			},
			callMyInviter(phoneNumber) { //发短信
			
				var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
			
				msg.to = [phoneNumber];
			
				msg.body = '';
			
				plus.messaging.sendMessage(msg);
			
			},
			//删除
			confirmDelete() {
				let data = '?id=' + this.clueInfo.id
				deleteClueSource(data, res => {
					if (res.code == 200 && res.success) {
						this.showDelete = false
						uni.showToast({
							title: "删除成功!"
						});
						this.pageNo = 1;
						this.getData();
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//变更状态
			selectStatus(e){
				let data={
					clue:{
						id:this.clueInfo.id,
						clueStatus:e.value
					},
					falg:false,
					task:null,
				}
				console.log(data)
				editClueSource(data,res=>{
					if (res.code == 200 && res.success) {
						uni.$u.toast(res.message);
						this.showStatusSheet=false;
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
					background: rgba(0, 114, 255, 1);
					width: 40px;
					height: 40px;
					border-radius: 8px;
					display: flex;
					justify-content: center;
					align-items: center;
	
					.logo-icon-txt {
						font-size: 14px;
						text-align: center;
						border-radius: 5px;
						padding: 4px;
						color: #FFF;
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
	
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
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
	
	
</style>
