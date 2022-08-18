<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="相关附件"  bgColor="#fff" :border="true" @leftClick="leftClick" @rightClick="rightClick">
			<view  class="u-nav-slot"
		        slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="搜索" bgColor="rgba(244, 246, 250, 1)"
				v-model="searchValue" :clearabled="true" @change="searchChange"></u-search>
			</view>
			
		</u-sticky>
		<view class="main-content" v-for="(item, index) in attachmentList" :key="index">
			<u-cell :title="item.name" @click="openFile(item)">
				<view slot="icon" class="folder-icon">
					<image v-if="[0,1].includes(item.fileFormat)" class="logo-folder" src="/static/img/assist/icon_file_xls.png"></image>
					<image v-if="[2,3].includes(item.fileFormat)" class="logo-folder" src="/static/img/assist/icon_file_doc.png"></image>
					<image v-if="item.fileFormat==4" class="logo-folder" src="/static/img/assist/icon_file_pdf.png"></image>
					<image v-if="[5,6,7].includes(item.fileFormat)" class="logo-folder" src="/static/img/assist/icon_file_png.png"></image>
					<image v-if="item.fileFormat==8" class="logo-folder" src="/static/img/assist/icon_file_rar.png"></image>
					<image v-if="item.fileFormat==9" class="logo-folder" src="/static/img/assist/icon_file_txt.png"></image>
				</view>
				<!-- <image class="logo" slot="value" src="/static/img/assist/icon_file_folder_more.png" ></image> -->
				<view slot="label" class="u-slot-label">
					<text class="u-cell__label">{{item.uploadUserName}}&emsp;{{item.createTime}}</text>
				</view>
			</u-cell>
		</view>
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
		<u-empty v-if="attachmentList.length==0 && isLoading" mode="data"
			icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		<u-loadmore v-if="attachmentList.length>0" :status="status" :loading-text="loadingText"
			:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
	</view>
</template>

<script>
	import {
		isEmpty,
		changeParam
	} from "@/util/common.js"
	import {
		getAttachmentsList,
		getDocumentInfo,
		uploadPicturePlus,
		uploadAttachment,
	} from "@/util/interface.js"
	import Base64 from '@/util/base64.js';
	export default {
		data() {
			return {
				statusBarHeight:getApp().globalData.statusBarHeight+44,//状态栏高度
				searchValue:"",
				topheight:0,
				attachmentList:[],
				pageNo: 1,
				maxPage: 1,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isLoading: false, //加载中
				id:"",//业务id
				businessCode:"",//业务编码， 客户-Customer 供应商-Supplier 竞争对手-Competitor 费用-Expense 产品库-Product 商机-BizOppty 线索-ClueSource
			}
		},
		onLoad(options){
			this.id = options.id;
			this.businessCode=options.businessCode
			this.getTopHeight();
			this.getAttachments();
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getAttachments();
		},
		methods: {
			//返回上一级
			leftClick(){
				uni.navigateBack();
			},
			//右上角
			rightClick(){
				this.handleUpload();
			},
			getTopHeight(){
				let that=this;
				uni.getSystemInfo({
					success:function(e){
						//48为自定义导航高度，一般为44
						let topPx=getApp().globalData.statusBarHeight //顶部状态栏+沉浸式自定义顶部导航栏
						that.topheight=topPx/(uni.upx2px(topPx)/topPx)//px转rpx,这里必须转换为rpx,不然适配失败
					}
				})
			},
			searchChange(){
				this.pageNo =1;
				this.getAttachments();
			},
			getAttachments() {
				this.isLoading = false;
				const data = "?businessCode="+this.businessCode
				+"&businessId=" + this.id 
				+ "&pageNo=" + this.pageNo 
				+ '&pageSize=' + 10
				+ '&name=' + this.searchValue;
				getAttachmentsList(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res);
						if (this.pageNo == 1) {
							this.attachmentList = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.attachmentList = this.attachmentList.concat(res.result.records)
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
			openFile(item) {
				this.getDocumentInfo([2,3].includes(this.current)? item.documentId:item.id);
			},
			getDocumentInfo(id){
				let params = changeParam({id})
				getDocumentInfo(params,res=>{
					if(res.code == 200 && res.success){
						console.log('getDocumentInfo-res:',res)
						const {url,fileName} = res.result.fileMsgResp;
						let p = `?link=${Base64.encode(url)}&title=${fileName}&id=${res.result.id}&current=${this.current}`
						uni.navigateTo({
							url: "/pages/assist/documentManagement/openFile"+ p
						})
					}else{
						uni.$u.toast(res.message);
					}
				},error=>{
					
				})
			},
			handleUpload() {
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						this.uploadToServer(res);
					}
				});
			},
			// 先上传到服务器
			uploadToServer(res) {
				const data = res.tempFilePaths.map((value, index) => {
					return {
						name: "image" + index,
						uri: value
					}
				})
				uploadPicturePlus(data, response => {
					const data = JSON.parse(response)
					if (data.code == 200 && data.success) {
						this.uploadByBusiness(data.result);
					} else {
						uni.$u.toast(data.message);
					}
				})
			},
			// 上传到服务器后拿到附件id再调用业务相关的接口
			uploadByBusiness(result) {
				const fileIdList = result.map(mi => mi.fileId);
				let formData = {
					businessCode: this.businessCode,
					businessId: this.id,
					fileIdList,
					contentType: 'application/x-www-form-urlencoded',
				}
				uploadAttachment(formData, res => {
					if (res.code == 200 && res.success) {
						uni.showToast({
							title: "上传成功!"
						});
						this.pageNo = 1;
						this.getAttachments();
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			
		}
	}
</script>

<style lang="scss">
page{
	background-color: rgba(242, 245, 249, 1);
}
.logo {
	width:24px;
	height: 24px;
}
.sticky-title{
	height: 48px;
	background: #fff;
	border-top: 1px solid;
	border-top-color: rgba(0, 0, 0, 0.05);
	padding: 0 16px;
	/deep/.u-search{
		margin-top: 8px !important;
	}
}
.initLoading{
		padding-top: 20px;
	}
	.empty{
		padding-top: 100px;
	}
/deep/.main-content{
	background: #FFFFFF;
	.logo-icon{
		width: 24px;
		height: 24px;
		right: 12px;
	}
	.logo-folder{
		width: 34px;
		height: 34px;
	}
	.folder-title{
		padding:0 16px 10px ;
		background: #fff;
		.folder-title-one{
			font-size: 14px;
			color: rgba(144, 147, 153, 1);
		}
		.folder-title-two{
			font-size: 14px;
			color: rgba(48, 49, 51, 1);
		}
	}
	.folder-icon{
		width: 50px;
	}
	.u-cell__label{
		margin-top: 5px;
		font-size: 12px;
		color: #909193;
		line-height: 18px;
	}
	.u-line {
		border: none !important;
	}
	
}
</style>
