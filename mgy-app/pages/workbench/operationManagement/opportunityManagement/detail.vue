<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }" class="container">
		<u-navbar :title="result.name || '-'" bgColor="#fff" @leftClick="leftClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/workbench/icon-more.png" @tap.stop="showHeaderAction=true"></image>
			</view>
		</u-navbar>
		<view class="sj-detail-card">
			<view style="margin-bottom: 8px;">
				<u-cell :title="result.name || '-'">
					<text slot="value" class="u-slot-value">{{result.bizOpptyType}}</text>
				</u-cell>

				<u--form labelWidth="100">
					<u-form-item label="首联系人">
						<text style="margin-left: -30px;">{{result.contactName|| '-'}}</text>
					</u-form-item>
					<u-form-item label="下次跟进">
						<text style="margin-left: -30px;">{{result.nextFollowTime|| '-'}}</text>
					</u-form-item>
				</u--form>
			</view>
			<view class="progress">
				<view class="prog-container">
					<view 
						v-for="(item,index) in saleStatusNormalList"
						@tap.stop="showStatusModal(index)"
						:class="{
						'prog-item':true,
						'prog-item-n-start':!item.complete && index ==0,
						'prog-item-n-middle':!item.complete && index !=0 && index != saleStatusNormalList.length-1,
						'prog-item-n-end':!item.complete && index == saleStatusNormalList.length-1 ,
						'prog-item-active-start':item.complete && index == 0 ,
						'prog-item-active-end':(isAllComplete && index == saleStatusNormalList.length-1) || (item.complete && index == saleStatusNormalList.length-1) ,
						'prog-item-active-middle':(isAllComplete && index !=0 && index != saleStatusNormalList.length-1) || (item.complete && index !=0 && index != saleStatusNormalList.length-1)}"
						><text>{{item.saleStatus}}</text></view>
				</view>
			</view>
		</view>
		<view class="card-cuntact">
			<u-cell title="联系人" value="更多" @click="gotoContacts"></u-cell>
			<view class="model_scrollx flex_row">
				<scroll-view class="uni-swiper-tab" scroll-x :style="'height:'+97+'px'">
					<view class="scrollx_items" v-for="(item, index) in contactList" :key="index"
						@click="toDetailContact(item.id)">
						<view class="logo-icon">
							<view class="logo-icon-txt">
								{{sliceString(item.name,0,2)}}
							</view>
						</view>
						<view class="logo-name">{{item.name.length>3?sliceString(item.name,0,3)+'...':item.name}}</view>
					</view>
		
					<view class="scrollx_items" @click="addContact">
						<view class="logo-icon logo-add">
							<view class="logo-icon-txt">
								+
							</view>
						</view>
						<view class="logo-name">添加</view>
					</view>
				</scroll-view>
			</view>
		
		</view>
		<u-tabs :list="listTabs" :scrollable="false" :current="current" lineWidth="59" @click="clickTabs"
			style="background-color: #fff;border-bottom:1px solid #F1F3F6;magin-bottom:10px;"></u-tabs>
		<view v-show='current == 0'>
			<view class="sj-info-card">
				<u-cell title="基本信息"></u-cell>
				<u--form labelWidth="100">
					<u-form-item label="商机标题">
						<text>{{result.name|| '-'}}</text>
					</u-form-item>
					<u-form-item label="关联客户">
						<text style="color:#0072FF">{{result.customerName|| '-'}}</text>
					</u-form-item>
					<u-form-item label="主要联系人">
						<text style="color:#0072FF">{{result.contactName|| '-'}}</text>
					</u-form-item>
					<u-form-item label="预计销售金额">
						<text>{{result.expectSaleAmount|| '-'}}</text>
					</u-form-item>
					<u-form-item label="预计签单日期">
						<text>{{result.expectSigningDate|| '-'}}</text>
					</u-form-item>
					<u-form-item label="销售状态">
						<text>{{result.saleStatus|| '-'}}</text>
					</u-form-item>
					<u-form-item label="成交机率">
						<text>{{result.transactionProbability|| '-'}}</text>
					</u-form-item>
					<u-form-item label="商机来源">
						<text>{{result.bizOpptySourceName|| '-'}}</text>
					</u-form-item>
					<u-form-item label="归属人员">
						<text>{{result.belongUserName|| '-'}}</text>
					</u-form-item>
					<u-form-item label="备注信息">
						<text>{{result.remark|| '-'}}</text>
					</u-form-item>

				</u--form>
			</view>
			<view class="sj-info-card">
				<u-cell title="系统信息"></u-cell>
				<u--form labelWidth="100">
					<u-form-item label="系统编号">
						<text >{{result.id|| '-'}}</text>
					</u-form-item>
					<u-form-item label="创建人员">
						<text>{{result.createdName|| '-'}}</text>
					</u-form-item>
					<u-form-item label="所属部门">
						<text>{{result.belongDepart|| '-'}}</text>
					</u-form-item>
					<u-form-item label="协作人员">
						<text>{{result.cooperaters|| '-'}}</text>
					</u-form-item>
					<u-form-item label="前归属人">
						<text >{{result.oldBelongUserName|| '-'}}</text>
					</u-form-item>
					<u-form-item label="前所属部门">
						<text >{{result.oldBelongDepart|| '-'}}</text>
					</u-form-item>
					<u-form-item label="创建时间">
						<text>{{result.createTime|| '-'}}</text>
					</u-form-item>
					<u-form-item label="更新时间">
						<text>{{result.updateTime|| '-'}}</text>
					</u-form-item>
					<u-form-item label="最后跟进">
						<text>{{result.lastFollowTime|| '-'}}</text>
					</u-form-item>
					<u-form-item label="下次跟进">
						<text>{{result.nextFollowTime|| '-'}}</text>
					</u-form-item>

				</u--form>
			</view>
		</view>
		<view v-show='current == 1'>
			<template v-if="recordList.length>0">
				<view class="sjd-record-item" v-for="(item,index) in recordList" @click="gotofollowUpDetail(item.id)">
					<u-cell :isLink="true">
						<view slot='title'>
							<image class="r-logo" src="/static/img/icon_user_default.png" mode=""   ></image>
							<text class="name">{{item.createName}}</text>
							<text class="position">{{item.createPost}}</text>
						</view>
					</u-cell>
					<u-cell :title="'跟进 ('+item.connectType_dictText+')'" titleStyle="font-size:15px;"></u-cell>
					<text class="content-text">{{item.content}}</text>
					<u-cell>
						<view slot='title'>
							<image class="time-logo" src="/static/img/business/icon-time.png" mode=""   ></image>
							<text class="time">{{item.createTime}}</text>
						</view>
						<view slot='value'>
							<image class="comment-logo" src="/static/img/business/icon-comment.png" mode=""   ></image>
							<text class="comment">{{item.recordComments.length}}</text>
						</view>
					</u-cell>
				</view>
			</template>
			<template v-else>
				<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" text='暂无记录'>
				</u-empty>
			</template>
			<view class="initLoading">
				<u-loading-icon v-if="isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
			</view>
			<u-loadmore v-if="isShowLoadMore" :status="queryPageStatus" :loading-text="loadingText"
				:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
		</view>
		<view v-show='current == 2' class="sjd-prod">
			<template v-if="!isShowProd">
				<view class="prod-null">
					<image class="no-logo" src="/static/img/business/icon-prod-null.png" mode=""></image>
					<view class="no-text">暂无报价</view>
					<!-- <u-button type="primary" size="small" text="去报价" @click="gotoProductQuotation" shape="circle"
						color="#0072FF" customStyle="width:104px;height:38px;color:#fff;font-size:16px;"></u-button> -->
				</view>
			</template>
			<template v-else>
				<view class="product-quotation">
					<u-grid :border="false" col="3">
						<u-grid-item>
							<text class="grid-text">{{productQuoteDetails.quoteNum}}种</text>
							<text class="grid-text">产品品类</text>
						</u-grid-item>
						<u-grid-item>
							<text class="grid-text">{{productQuoteDetails.productNum}}个</text>
							<text class="grid-text">产品总数量</text>
						</u-grid-item>
						<u-grid-item>
							<text class="grid-text">¥ {{productQuoteDetails.quoteAmount}}</text>
							<text class="grid-text">产品总金额</text>
						</u-grid-item>
					</u-grid>
					<u-grid :border="false" col="2">
						<u-grid-item>
							<text class="grid-text">{{productQuoteDetails.discount}}%</text>
							<text class="grid-text">整单折扣</text>
						</u-grid-item>
						<u-grid-item>
							<text class="grid-text">￥{{productQuoteDetails.productAmount}}</text>
							<text class="grid-text">报价金额</text>
						</u-grid-item>
					</u-grid>
				</view>
				<view class="related-prod">
					<view style="padding:0 16px 0 16px;">
						<u-cell icon="" title="关联产品" value=""></u-cell>
					</view>
					<view class="prod-item" v-for="(item,index) in prodList">
						<view class="prod-title">
							<text>{{item.name}}</text>
						</view>
						<view style="padding-bottom:16px;border-bottom:1px solid #F1F3F6;">
							<u-row justify="space-between" customStyle="margin-bottom:2px;">
								<u-col span="6">
									<view>
										<text class="cell-title">单价 (元)</text>
										<text class="cell-value">{{item.salePrice}}</text>
									</view>
								</u-col>
								<u-col span="6">
									<view>
										<text class="cell-title">数量 (个)</text>
										<text class="cell-value">{{item.quantity}}</text>
									</view>
								</u-col>
							</u-row>
							<u-row justify="space-between" customStyle="margin-bottom:2px;">
								<u-col span="6">
									<view>
										<text class="cell-title">折扣 (%)</text>
										<text class="cell-value">{{item.discount}}</text>
									</view>
								</u-col>
								<u-col span="6">
									<view>
										<text class="cell-title">总价 (%)</text>
										<text class="cell-value">{{item.amount}}</text>
									</view>
								</u-col>
							</u-row>
							<u-row justify="space-between">
								<u-col span="6">
									<view>
										<text class="cell-title">礼品</text>
										<text class="cell-value" style="padding-left:20px;">{{item.gift || '无'}}</text>
									</view>
								</u-col>
								<u-col span="6">
									<view>
										<text class="cell-title">备注</text>
										<text class="cell-value">{{item.remark || '无'}}</text>
									</view>
								</u-col>
							</u-row>
						</view>
					</view>
				</view>
			</template>
		</view>
		<view class="bottom-action">
			<u-grid :border="false" col="3" @click="clickGrid">
				<u-grid-item>
					<view class="sjd-grid-img">
						<image class="logo" src="/static/img/business/icon-follow.png"></image>
					</view>
					<text class="grid-text">写新跟进</text>
				</u-grid-item>
				<u-grid-item>
					<view class="sjd-grid-img">
						<image class="logo" src="/static/img/business/icon-update-status.png"></image>
					</view>
					<text class="grid-text">变更状态</text>
		
				</u-grid-item>
				<u-grid-item>
					<view class="sjd-grid-img">
						<image class="logo" src="/static/img/business/icon-edit.png"></image>
					</view>
					<text class="grid-text">编辑商机</text>
				</u-grid-item>
			</u-grid>
		</view>
		<u-action-sheet title="更多" :show="showHeaderAction" :closeOnClickOverlay="true" :round="24" @close="showHeaderAction=false">
			<u-grid :border="false" col="4" @click="clickHeaderMoreGrid" customStyle="padding-top:10px;">
				<u-grid-item v-if="isAdministrator">
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon-transform.png"></image>
					</view>
					<text class="grid-text">转移商机</text>
				</u-grid-item>
				<u-grid-item v-if="isAdministrator">
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon-add.png"></image>
					</view>
					<text class="grid-text">添加协作</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon-phone.png"></image>
					</view>
					<text class="grid-text">拨打电话</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon-quota.png"></image>
					</view>
					<text class="grid-text">添加报价</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon-file.png"></image>
					</view>
					<text class="grid-text">相关附件</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo-max" src="/static/img/workbench/icon-del.png"></image>
					</view>
					<text class="grid-text">删除商机</text>
				</u-grid-item>
			</u-grid>
		</u-action-sheet>
		<!-- 变更销售状态 -->
		<u-modal :show="showSaleStatusModal"  title="" :showConfirmButton="false" :showCancelButton="false">
			<view class="slot-content">
				<view class="form-item">
					<u-row customStyle="margin-bottom: 10px">
						<u-col span="11">
							<view class="qus-title">
								<text>{{saleStatusNormalList.length>0? saleStatusNormalList[saleStatusIndex].saleStatus : '-'}}</text>
							</view>
						</u-col>
						<u-col span="1">
							<image src="/static/img/assist/icon-close.png" mode="" @tap.stop="showSaleStatusModal=false" style="width:24px;height:24px;"></image>
						</u-col>
					</u-row>
					
					<u-collapse v-if="saleStatusNormalList.length>0">
						<u-collapse-item v-for="(item1,index1) in saleStatusNormalList[saleStatusIndex].quotaList">
							<view slot="title" class="u-page__item__title__slot-title">
									<!-- v-model="item1.complete" -->
								 <u-checkbox
									v-model="item1.complete"
								 	:customStyle="{marginBottom: '8px'}"
								 	:label="item1.quota"
								 	shape="circle"
									:checked='item1.complete'
									@change="(s)=>{checkboxChange(s,saleStatusIndex,index1)}"
								 />
							</view>
							<u-cell title="">
								<view slot="title" class="u-slot-title upload-cell">
									<view v-if="item1.attachmentId" style="color:#909399;">
										已上传 <text style="color:#0072FF;">{{item1.attachmentId.split(',').length}}</text> 个附件
									</view>
									<text style="color:#909399;" v-else>上传附件</text>
									<u-upload
										:fileList="fileList"
										:maxCount="20"
										multiple
										@afterRead="(e)=>{afterRead(e,saleStatusIndex,index1)}" 
										@delete="deletePic"
										:previewImage="false"
										class="css-upload"
									></u-upload>
								</view>
								<view slot="value" class="u-slot-title">
									<image src="/static/img/business/icon-upload.png" mode="" style="width:20px;height:20px;"></image>
								</view>
							</u-cell>
							<u-cell title="">
								<view slot="title" class="u-slot-title">
									 <u--input
									     placeholder="输入凭证"
									     border="none"
									     v-model="saleStatusNormalList[saleStatusIndex].quotaList[index1].evidence"
									   ></u--input>
								</view>
							</u-cell>
						</u-collapse-item>
					</u-collapse>
					<view>
						 <u-row customStyle="margin-bottom: 10px">
							<u-col span="8">
								<text style="color:#909399;font-size: 12px;">全部勾选完成才能切换状态</text>
							</u-col>
							<u-col span="4">
								<u-button
									type="primary" 
									size="small" 
									text="确定切换" 
									shape="circle" 
									color="#0072FF" 
									:loading="btnLoading"
									customStyle="width:87px;height:28px;color:#fff;font-size:14px;"
									@click="saveSaleStatus(saleStatusIndex)"
								></u-button>
							</u-col>
						</u-row>
						
						
					</view>
				</view>
			</view>
		</u-modal>
	<u-modal :show="showDelete" title="删除确认" content='确定要删除该商机吗？' @cancel="showDelete=false"
		@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
	</view>
	</view>
</template>

<script>
	import {
		getBizOpptyInfo,
		getbizOpptySaleStatus,
		getFollowRecordsList,
		getContactsList,
		getProductQuoteDetail,
		deleteBizOppty,
		uploadPicturePlus,
		upbizOpptySaleStatus,
		uploadAttachment,
		checkDepartCharge,
		getProductQuoteById,
		getProductQuoteRecord
	} from '@/util/interface.js'
	import {
		changeParam,isEmpty
	} from "@/util/common.js"
	export default {
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				showSaleStatusModal:false,
				showDelete:false,
				fileList:[],
				listTabs: [{
					name: '资料详情',
				}, {
					name: '跟进记录'
				}, {
					name: '产品报价'
				}],
				current: 0,
				isShowProd:false,
				prodList:[],
				productQuoteDetails:{},
				result:{},
				saleStatusIndex:1,//当前操作索引
				saleStatusNormalList:[],
				attachmentId:"",
				saleStatusEnd:{},
				btnLoading:false,
				isAllComplete:false,
				recordList:[],
				pageNo:1,
				pageSize:10,
				maxPage:1,
				queryPageStatus: "loadmore",
				isShowLoadMore: false,
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isShowEmpty:false,
				contactList:[],
				isLoading:true,
				phoneNumber:"",
				//产品报价
				totalCount:0,
				totalPrice:0,
				offerTotalPrice:0,
				showAction:false,
				showHeaderAction:false,
				id:"",
				isAdministrator:false,
			}
		},
		// onShow(option) {
		// 	uni.$once('return', res => {
		// 		if (res) {
		// 			this.initData(option);
		// 		}
		// 	})
		// },
		onLoad(option) {
			this.initData(option);
			uni.$on('return', res => {
				if (res) {
					this.initData(option);
				}
			})
			uni.$on('returnQuota', res => {
				if (res) {
					this.getProductQuoteDetail();
				}
			})
			uni.$on('returnSalesStatus', res => {
				if (res) {
					this.getbizOpptySaleStatus();
				}
			})
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.queryPageStatus = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getFollowRecordsList();
		},
		methods: {
			leftClick() {
				uni.navigateBack();
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
			showStatusModal(index){
				if(this.saleStatusEnd.complete)return;
				if(index>0 && !this.saleStatusNormalList[index-1].complete)return;
				if(this.saleStatusNormalList[index].complete)return;
				this.saleStatusIndex = index;
				this.showSaleStatusModal = true;
			},
			// 新增图片
			async afterRead(event,index,index1) {
				console.log('event:', event);
				this.uploadToServer(event.file,index,index1);
				event.file = "";
			},
			deletePic(){},
			// 先上传到服务器
			uploadToServer(files,index,index1) {
				const data = files.map((mi, index) => {
					return {
						name: "image" + index,
						uri: mi.url
					}
				})
				uploadPicturePlus(data, response => {
					const data = JSON.parse(response)
					if (data.code == 200 && data.success) {
						this.uploadByBusiness(data.result,index,index1);
					} else {
						uni.$u.toast(data.message);
					}
				})
			},
			// 上传到服务器后拿到附件id再调用业务相关的接口
			uploadByBusiness(result,index,index1) {
				const fileIdList = result.map(mi => mi.fileId);
				let formData = {
					businessCode: 'BizOppty',
					businessId: this.bizOpptyId || '',
					fileIdList,
					contentType: 'application/x-www-form-urlencoded',
				}
				uploadAttachment(formData, res => {
					if (res.code == 200 && res.success) {
						uni.$u.toast("上传成功");
						this.fileList = res.result;
						this.attachmentId = this.fileList.map(i=>(i.fileId)).join(',')
						let cId = this.saleStatusNormalList[index].quotaList[index1].attachmentId;
						this.saleStatusNormalList[index].quotaList[index1].attachmentId = cId? (cId + ','+ this.attachmentId) : this.attachmentId;
						this.attachmentId = '';
						this.fileList = [];
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			initData(option){
				this.id = option.id;
				this.getDetailInfo();
				this.getbizOpptySaleStatus();
				this.getFollowRecordsList();
				//this.getProductQuoteDetail();
				
			},
			checkboxChange(s,index,index1){
				console.log('s,index,index1:',s,index,index1)
				this.saleStatusNormalList[index].quotaList[index1].complete = s;
				console.log('change~~saleStatusNormalList:',this.saleStatusNormalList)
			},
			clickTabs(item) {
				this.current = item.index;
				item.index == 1 && this.getFollowRecordsList();
			},
			//联系人==》更多
			gotoContacts() {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/contacts?id=" + this.result.customerId + "&customerName=" + this.result.customerName
				})
			},
			addContact() {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/newContact?returnPageNumber=1&type=2&customerId=" + this.result.customerId
					 + "&customerName=" + this.result.customerName,
				})
			},
			getContactsList(){
				let params = {
					customerId:this.result.customerId
				}
				getContactsList(changeParam(params),res=>{
					if(res.code == 200 && res.success){
						console.log('联系人列表-res:',res)
						this.contactList = res.result.records;
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			getProductQuoteDetail(){
				let params = {
					bizOpptyId:this.id
				}
				getProductQuoteDetail(changeParam(params),res=>{
					if(res.code == 200 && res.success){
						console.log('报价单详情-res:',res)
						this.isShowProd = Array.isArray(res.result) && res.result.length>0;
						this.prodList = res.result || [];
						if(this.prodList.length == 0)return;
						
						let p = this.prodList.reduce((c,i)=>(c+(i.salePrice || 0)*(i.quantity || 0)),0);
						this.totalPrice = Number.isNaN(p)? '0.00':p.toFixed(2);
						this.totalCount = this.prodList.reduce((c,i)=>(c + i.quantity),0);
						let o = this.prodList.reduce((c,i)=>(c+ Number(i.amount)),0)
						this.offerTotalPrice = Number.isNaN(o)? "0.00":o.toFixed((2))
						
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			editQuota(){
				this.$cache.delete('_saveQuotaList');
				//跳转产品-确认报价
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/opportunityManagement/confirmQuotation?returnNumber=1&bizOpptyId="+this.id +'&type=edit'
				})
			},
			//截取前四位的字符串
			sliceString(stringObject, start, end) {
				if (!stringObject) return;
				return stringObject ? stringObject.slice(start, end) : ''
			},
			//去联系人详情页
			toDetailContact(id) {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/contactsDetail?id=" + id
				})
			},
			gotofollowUpDetail(id) {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/followUpDetail?id=" + id+ '&businessCode=BizOppty&statusText='+this.result.saleStatus
				})
			},
			getFollowRecordsList(){
				this.isLoading = true;
				let params = {
					bizOpptyId:this.id,
					businessCode:"BizOppty",
					pageNo:this.pageNo,
					pageSize:this.pageSize
				}
				getFollowRecordsList(changeParam(params),res=>{
					if(res.code == 200 && res.success){
						console.log('跟进记录-res:',res)
						this.recordList = res.result.records;
						this.isLoading = false;
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			saveSaleStatus(index){//更新销售状态
				let s = this.saleStatusNormalList[index].quotaList.some(i=>(!i.complete));//校验存在未勾选
				if(s){//false
					uni.$u.toast("全部勾选完成才能切换状态");
					return;
				}
				this.btnLoading = true;
				this.saleStatusNormalList[index].complete = true;
				let params = {bizOpptyId:this.id,saleStatusNormalList:this.saleStatusNormalList,saleStatusEnd:this.saleStatusEnd}
				if(this.isNewOperate){
					uni.$u.toast("保存成功");
					console.log('保存数据:',params)
					this.$cache.set('_sjSalesStatusData',params);
					this.currentStep = index + 1;
					this.voucherValue = "";
					this.attachmentId = "";
					return;
				}
				upbizOpptySaleStatus(params,res=>{
					if(res.code == 200){
						uni.$u.toast("保存成功");
						this.getbizOpptySaleStatus();
						this.showSaleStatusModal = false;
					}else{
						uni.$u.toast(res.message);
					}
					this.btnLoading = false;
				})
			},
			getbizOpptySaleStatus(){
				let params = '?bizOpptyId='+this.id;
				getbizOpptySaleStatus(params,res=>{
					if(res.code == 200 && res.success){
						console.log('销售状态-res:',res)
						this.saleStatusNormalList = res.result.saleStatusNormalList;
						this.saleStatusEnd = res.result.saleStatusEnd;
						this.isAllComplete = res.result.saleStatusEnd.complete || res.result.saleStatusNormalList[res.result.saleStatusNormalList.length-1].complete;
					}
				})
			},
			getDetailInfo() {
				let params = '/' + this.id;
				getBizOpptyInfo(params, res => {
					if (res.code == 200 && res.success) {
						console.log('详情-res:', res)
						this.result = res.result;
						this.getContactsList();
						this.getProductQuoteById();
					}
				})
			},
			clickHeaderMoreGrid(name){
				this.showHeaderAction = false;
				name = this.isAdministrator ?  name + 2 : name;
				switch (name) {
					case 0: //拨打电话
						uni.makePhoneCall({
							phoneNumber:this.result.contactPhone
						}).catch((e) => {
							// console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
						})
						break;
					case 1: // 添加报价
						if(this.result.quoteNum>0){
							uni.navigateTo({ //有报价就直接跳去确认报价
								url: "/pages/workbench/operationManagement/opportunityManagement/confirmQuotation?bizOpptyId="+this.id + "&returnNumber=1&type=edit"
							})
						}else{
							uni.navigateTo({ //跳去关联产品
								url: "/pages/product/productManagement/relatedProduct?quota=1&bizOpptyId="+this.id
							})
						}
						break;
					case 2: // 相关附件
						uni.navigateTo({
							url: "/pages/assist/documentManagement/relevantAttachments?id="+this.id+"&businessCode=BizOppty"
						})
						break;
					case 3: // 删除商机
						this.showDelete = true;
						break;
					default:
						break;
				}
			},
			confirmDelete(){
				deleteBizOppty('/'+this.id,res=>{
					if(res.code == 200 && res.success){
						setTimeout(()=>{
							uni.navigateBack();
						},1000)
					}
					uni.$u.toast(res.message);
				})
			},
			clickGrid(name) {
				this.showAction = false;
				switch (name) {
					case 0: //写新跟进
						const params = {
							bizOpptyId: this.id,
							customerName: this.result.customerName,
							customerId:this.result.customerId,
						}
						uni.navigateTo({
							// url: "/pages/assist/customerManagement/newFollowUp?type=add&addOpportunity=0"
							url: "/pages/assist/customerManagement/newFollowUp?type=add&businessCode=BizOppty&params=" +
								JSON.stringify(
									params)
						})
						break;
					case 1: // 变更销售状态
						uni.navigateTo({
							url: "/pages/workbench/operationManagement/opportunityManagement/changeSalesStatus?bizOpptyId=" + this.id
						})
						break;
					case 2: //编辑商机
						uni.navigateTo({
							url: "/pages/workbench/operationManagement/opportunityManagement/addOpportunity?returnPageNumber=1&id="+ this.id
						 })
						break;
					default:
						break;
				}
			},
			gotoProductQuotation() {
				this.$cache.set("_bizOpptyId",this.id);
				//跳去关联产品
				uni.navigateTo({
					url: "/pages/product/productManagement/relatedProduct?quota=1&bizOpptyId=" + this.id +'&type=add'
				})
			},
			getProductQuoteById(){
				getProductQuoteById("?id="+this.result.productQuoteId,res=>{
					if (res.code == 200 && res.success) {
						this.productQuoteDetails = res.result
						// if (this.productQuoteDetails.status == 6 || this.productQuoteDetails.status == 5) {
						// 	this.getStartVariables();
						// }
						this.getProductQuoteRecordData()
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getProductQuoteRecordData(){
				let that=this;
				getProductQuoteRecord("?pageNo=1&pageSize=1000&quoteId="+that.result.productQuoteId,res=>{
					if (res.code == 200 && res.success) {
						that.prodList = isEmpty(res.result.records) ? []: res.result.records
						that.isShowProd =that.prodList.length==0?false:true
						
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		background: #F2F4F6;
		padding-bottom: 60px;
		min-height: 700px;
		// overflow-x: hidden;
		.logo {
			width: 24px;
			height: 24px;
		}	
		.logo-max {
			width: 50px;
			height: 50px;
		}

		.progress {
			width: 375px;
			overflow-y: auto;

			.prog-container {
				width: 840px;
			}

			.prog-item {
				display: inline-block;
				width: 132px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				font-size: 14px;
				margin-right: 3px;
				opacity: 1;
				position: relative;
			}

			.prog-item-n-start {
				color: #606266;
				background: url(../../../../static/img/workbench/n-1.png) no-repeat;
				background-size: 100% 100%;
			}
			.prog-item-n-middle {
				color: #606266;
				background: url(../../../../static/img/workbench/n-2.png) no-repeat;
				background-size: 100% 100%;
			}
			.prog-item-n-end {
				color: #606266;
				background: url(../../../../static/img/workbench/n-3.png) no-repeat;
				background-size: 100% 100%;
			}
			.prog-item-active-start {
				color: #fff;
				background: url(../../../../static/img/workbench/f-1.png) no-repeat;
				background-size: 100% 100%;
			}
			.prog-item-active-middle {
				color: #fff;
				background: url(../../../../static/img/workbench/f-2.png) no-repeat;
				background-size: 100% 100%;
			}
			.prog-item-active-end {
				color: #fff;
				background: url(../../../../static/img/workbench/f-3.png) no-repeat;
				background-size: 100% 100%;
			}
		}

		.sj-info-card {
			background-color: #fff;
			margin-bottom: 12px;
		}

		.bottom-action {
			width: 100%;
			height: 59px;
			background: #FFFFFF;
			border-radius: 0px 0px 0px 0px;
			// box-shadow:  0px -5px 10px -5px rgba(32, 33, 36, .28);
			border-top:1px solid #F2F5F9;
			position: fixed;
			left: 0;
			bottom: 0;
		}

		.sjd-record-item {
			border-bottom: 1px solid #F1F3F6;
			padding-bottom: 10px;
			background: #fff;
			margin-bottom: 0;

			.r-logo {
				width: 22px;
				height: 22px;
				vertical-align: middle;
				border: 1px solid rgba(228, 235, 244, 0.5000);
			}

			.name {
				color: #606266;
				font-size: 14px;
				margin-right: 6px;
				margin-left: 6px;
			}

			.position {
				color: #909399;
				font-size: 12px;
			}

			.content-text {
				color: #606266;
				font-size: 14px;
			}

			.time-logo {
				width: 18px;
				height: 18px;
				vertical-align: middle;
			}

			.time {
				margin-left: 4px;
				font-size: 12px;
				color: #909399;
			}

			.comment-logo {
				width: 14px;
				height: 14px;
				vertical-align: middle;
			}

			.comment {
				font-size: 12px;
				margin-left: 3px;
				color: #606266;
			}
		}

		.sjd-prod {
			background: #F1F3F6;

			.prod-null {
				padding-top: 30px;
				padding-bottom: 30px;

				.no-logo {
					display: block;
					width: 228px;
					height: 130px;
					margin: 0 auto;
				}

				.no-text {
					color: rgba(96, 98, 102, 0.6);
					font-size: 15px;
					text-align: center;
					margin-bottom: 20px;

				}
			}

			.product-quotation {
				background: #fff;
				margin-bottom: 12px;
				padding-bottom: 16px;
				border-bottom: 1px solid #F1F3F6;
			}

			.related-prod {
				background: #fff;
			}

			.prod-item {
				padding: 16px;

				.prod-title {
					margin-bottom: 12px;
					padding-left: 10px;
					font-size: 15px;
					font-weight: bold;
					color: #303133;
					position: relative;

					&::before {
						content: "";
						width: 4px;
						height: 13px;
						background: #0072FF;
						border-radius: 3px 3px 3px 3px;
						opacity: 1;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						left: 0px;
					}
				}

				.cell-title {
					font-size: 14px;
					color: #747988;
					margin-right: 16px;
				}

				.cell-value {
					color: #303133;
					font-size: 14px;
				}
			}
		}
	}

	/deep/ .sj-detail-card,
	/deep/ .sj-info-card,
	/deep/ .sjd-record-item {
		box-sizing: border-box;
		padding: 0 16px 16px 16px;
		background: #fff;
		margin-bottom: 16px;

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

	/deep/ {
		.sjd-grid-img {
			width: 24px;
			height: 24px;

			.logo {
				width: 24px;
				height: 24px;
				top: 11px;
			}
		}

		.u-grid {
			padding-top: 0px;
		}

		.grid-text {
			font-size: 12px;
			font-weight: bold;
			color: #606266;
			padding: 20rpx 0 20rpx 0rpx;
			/* #ifndef APP-PLUS */
			box-sizing: border-box;
			/* #endif */
		}
	}

	/deep/ .sjd-prod {
		.u-grid {

			// padding-top: 5px;
			.u-grid-item:last-child {
				heigh: 58px !important;
			}
		}

		.grid-text {
			font-size: 15px;
			color: #909399;
			padding: 40rpx 0 5rpx 0rpx;
			/* #ifndef APP-PLUS */
			box-sizing: border-box;
			/* #endif */
		}

		.grid-text:first-child {
			color: #303133;
			font-weight: bold;
		}

		.grid-text:last-child {
			padding-top: 2px;
			font-size: 12px;
			font-weight: normal;
		}

		.related-prod {
			.u-cell__body {
				padding-left: 0px;
			}

			.u-cell__title-text {
				font-size: 15px;
				color: #606266;
			}
		}
	}

	/deep/.u-tabs__wrapper__nav__item__text {
		color: #606266 !important;
	}
	/deep/.card-cuntact {
		margin-top: 10px;
		padding: 0px 16px 0px;
		background: #FFFFFF;
		margin-bottom: 12px;
	
		.u-cell__body {
			padding: 12px 0px;
	
			.u-cell__value {
				font-size: 13px;
				color: rgba(96, 98, 102, 1);
			}
	
			.u-cell__title-text {
				font-size: 16px;
				color: rgba(48, 49, 51, 1);
			}
		}
	
		/* 左右滑动 */
		.model_scrollx {
			justify-content: space-between;
			//padding: 16px 0;
		}
	
		.uni-swiper-tab {
			white-space: nowrap;
		}
	
		.scrollx_items {
			padding: 16px 16px 0 0;
			text-align: center;
			display: inline-block;
			width: 60px;
			box-sizing: border-box;
	
			//margin-left: 30rpx;
			.logo-name {
				font-size: 12px;
				line-height: 28px;
				width: 46px;
				text-align: center;
			}
		}
	
		.logo-icon {
			background: rgba(0, 114, 255, 1);
			width: 46px;
			height: 46px;
			border-radius: 8px;
	
			.logo-icon-txt {
				font-size: 14px;
				text-align: center;
				border-radius: 5px;
				padding: 4px;
				color: #fff;
				line-height: 38px;
			}
		}
	
		.logo-add {
			background: rgba(248, 248, 250, 1);
			border: 1px solid rgba(232, 234, 239, 1);
	
			.logo-icon-txt {
				font-size: 28px;
				text-align: center;
				border-radius: 5px;
				padding: 4px;
				color: rgba(189, 188, 191, 1);
				line-height: 38px;
			}
		}
	
		/* 左右滑动 */
	
	
	}
	
	.form-item{
		position: relative;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
		padding: 12px 16px 0px 10px;
		margin-left: 5px;
		width:327px;
		background: #fff;
		border-radius: 6px;
		margin-bottom: 8px;
		.qus-title{
			width: 200px;
			margin-bottom: 12px;
			padding-left: 10px;
			font-size: 15px;
			margin-left: 8px;
			font-weight: bold;
			color:#303133;
			position: relative;
			margin-bottom:10px ;
			&::before{
				content:"";
				width: 4px;
				height: 13px;
				background: #0072FF;
				border-radius: 3px 3px 3px 3px;
				opacity: 1;
				position: absolute;
				top:50%;
				transform: translateY(-50%);
				left:0px;
			}
		}
		.operate-disable{
			height: 100%;
			width: 100%;
			position: absolute;
			left: 0;
			top:0;
			z-index:10;
			border-radius: 6px;
			background:#F1F3F6;
			opacity: 0.4;
		}
	}
	/deep/ {
		.u-cell__body{
			padding-left: 0;
			padding-bottom: 4px;
			padding-right: 0;
		}
		.u-steps-item__wrapper{
			background: #F1F3F6;
			// margin-left: 4px;
		}
		.upload-cell{
			position: relative;
		}
		.css-upload{
			width: 100% !important;
			height:40px !important;
			position: absolute;
			left: 0;
			top:-12px;
			.u-icon__icon{
				display: none;
			}
			.u-upload__button{
				width: 100% !important;
				height:40px !important;
				background: transparent;
			}
		}
		.uni-input-input{
			font-size: 15px;
		}
		.uni-input-placeholder{
			color:#909399 !important;
			font-size: 15px;
		}
		.u-collapse-item__content__text{
			padding-left: 0;
			padding-right: 0;
		}
		.u-collapse-items> .u-line{
			display: none !important;
		}
		.u-collapse{
			margin-bottom: 12px;
		}
	}

/deep/ {
	.u-modal__content{
		padding-top: 5px !important;
		padding-bottom: 16px !important;
	}
}
</style>
