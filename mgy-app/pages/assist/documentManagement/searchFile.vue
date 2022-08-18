<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="项目名称" bgColor="rgba(244, 246, 250, 1)" v-model="searchValue"
					:clearabled="true" @change="searchChange" @blur="blurSearch" @clear='clear'></u-search>
				<text class="sticky-txt" @click="clickCancel">取消</text>
			</view>

		</u-sticky>
		<u--form v-if="show" labelPosition="left" ref="form1" labelWidth="150">
			<u-form-item label="按指定内容搜索" ref="item1"></u-form-item>
			<view class="filter-content" v-for="(item,index) in lst" :key="index">
				<view class='filter-content-detail-item-default' @click="gotoSearchFileByType(item.type)">
					<view style=" position: relative;top: -5px;">
						<image class="logo" :src="item.src"></image>
						<text> {{item.name}} </text>
					</view>
				</view>
			</view>
			<u-form-item label="搜索历史" ref="item1">
				<text class="item-txt" @click="remove">清除记录</text>
			</u-form-item>
			<view class="filter-content" v-for="(item,index) in lstCache" :key="index">
				<view class='filter-content-detail-item-default'>
					<text @click="select(item)"> {{item}} </text>
				</view>
			</view>
		</u--form>
		<view class="top-height" v-if="!show">
			<view v-for="(item, index) in list" :key="item.id">
				<u-cell :title="item.name" :label="item.createBy + '    ' + item.createTime" @click="openFile(item)">
					<view slot="icon" class="folder-icon">
						<image v-if="[0,1].includes(item.fileFormat)" class="logo-folder"
							src="/static/img/assist/icon_file_xls.png"></image>
						<image v-if="[2,3].includes(item.fileFormat)" class="logo-folder"
							src="/static/img/assist/icon_file_doc.png"></image>
						<image v-if="item.fileFormat==4" class="logo-folder" src="/static/img/assist/icon_file_pdf.png">
						</image>
						<image v-if="[5,6,7].includes(item.fileFormat)" class="logo-folder"
							src="/static/img/assist/icon_file_png.png"></image>
						<image v-if="item.fileFormat==8" class="logo-folder" src="/static/img/assist/icon_file_rar.png">
						</image>
						<image v-if="item.fileFormat==9" class="logo-folder" src="/static/img/assist/icon_file_txt.png">
						</image>
						<image v-if="!item.fileFormat && item.type==0" class="logo-folder"
							src="/static/img/assist/icon_file_folder.png"></image>
					</view>
				</u-cell>
			</view>

			<view class="initLoading">
				<u-loading-icon v-if="isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
			</view>
			<view class="empty" v-if="isShowEmpty">
				<u-empty text="暂无文件" width="84" height="84" icon="/static/img/icon_PDF.png"></u-empty>
			</view>
			<u-loadmore v-if="isShowLoadMore" :status="queryPageStatus" :loading-text="loadingText"
				:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
		</view>
		<!-- <u-empty
			width="84"
			height="84"
			text="没有找到相关文件"
			icon="/static/img/assist/search_empty.png"
		></u-empty> -->

	</view>
</template>

<script>
	import {
		getDocumentList,
		getMyShareDocumentList,
		getShareDocumentList,
		getDocumentInfo
	} from "@/util/interface.js"
	import {
		changeParam
	} from "@/util/common.js"
	import Base64 from '@/util/base64.js';
	export default {
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight, //状态栏高度
				searchValue: "",
				current: "",
				lst: [{
						name: "表格",
						src: '/static/img/assist/icon_file_xls.png',
						type: 0
					},
					{
						name: "文档",
						src: '/static/img/assist/icon_file_doc.png',
						type: 1
					},
					{
						name: "PDF",
						src: '/static/img/assist/icon_file_pdf.png',
						type: 2
					},
					{
						name: "图片",
						src: '/static/img/assist/icon_file_png.png',
						type: 3
					},
					{
						name: "文件夹",
						src: '/static/img/assist/icon_file_folder.png',
						type: 4
					},
					{
						name: "压缩包",
						src: '/static/img/assist/icon_file_rar.png',
						type: 5
					},
					{
						name: "TXT",
						src: '/static/img/assist/icon_file_txt.png',
						type: 6
					},
				],
				lstCache: [],
				show: true,
				// 搜索参数
				queryParams: {
					isMine: 1,
					pageNo: 1,
					pageSize: 10,
					publicFlag: 0,
					name: '', //名称
				},
				fileFormatStr: "",
				myFileList: [], //我的文档
				publicFileList: [], //公共文档
				myShareList: [], // 我共享的文档
				shareWithMeList: [], //与我共享的文档
				isLoading: false,
				isShowEmpty: false,
				queryPageStatus: "loadmore",
				isShowLoadMore: false,
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				maxPage: 1,
				id: "",
			}
		},
		onLoad(option) {
			this.current = parseInt(option.current) || 0;
			this.id = option.id || ""
			this.getTopHeight();
			this.lstCache = this.$cache.get('_lstCache');
		},
		onReachBottom() {
			if (this.queryParams.pageNo >= this.maxPage) return;
			this.queryPageStatus = 'loading';
			this.queryParams.pageNo = this.queryParams.pageNo + 1;
			this.getList(2);
		},
		methods: {
			getTopHeight() {
				let that = this;
				uni.getSystemInfo({
					success: function(e) {
						//48为自定义导航高度，一般为44
						let topPx = 0 //getApp().globalData.statusBarHeight //顶部状态栏+沉浸式自定义顶部导航栏
						that.topheight = topPx / (uni.upx2px(topPx) / topPx) //px转rpx,这里必须转换为rpx,不然适配失败
					}
				})
			},
			clickCancel() {
				uni.navigateBack();
			},
			gotoSearchFileByType(type) {
				uni.navigateTo({
					url: "/pages/assist/documentManagement/searchFileByType?returnPageNumber=1&type=" + type +
						"&current=" + this.current + '&id=' + this.id
				})
			},
			searchChange() {
				this.show = false;
				this.queryParams.name = this.searchValue;
				if (!this.searchValue) {
					this.show = true;
					this.initData();
				} else {
					this.getList(1);
				}

			},
			select(name) {
				this.searchValue = name;
				this.searchChange()
			},
			blurSearch() {
				if (this.lstCache) {
					var a = this.lstCache.indexOf(this.searchValue);
					if (a == -1) {
						this.lstCache.push(this.searchValue)
						this.$cache.set('_lstCache', this.lstCache)
					}
				} else {
					this.lstCache = [];
					this.lstCache.push(this.searchValue)
					this.$cache.set('_lstCache', this.lstCache)
				}

			},
			remove() {
				this.$cache.delete('_lstCache');
				this.lstCache = [];
			},
			clear() {
				this.show = true;
				this.initData();
			},
			initData() {
				this.$cache.delete('_routeTitle');
				this.isLoading = true;
				this.isShowEmpty = false;
				this.maxPage = 1;
				this.queryParams.pageNo = 1;
				this.queryParams.isMine = 1;
				this.queryParams.publicFlag = 0;
				this.queryPageStatus = 'loadmore'
				this.myFileList = [];
				this.publicFileList = [];
				this.myShareList = [];
				this.shareWithMeList = [];
			},
			getList(type) {
				let that = this;
				that.queryParams['isMine'] = that.current == 0 ? 1 : 0;
				that.queryParams['publicFlag'] = that.current == 1 ? 1 : 0;
				that.queryParams['id'] = that.id;
				let request, currentLst;
				switch (that.current) {
					case 0:
						request = getDocumentList;
						currentLst = 'myFileList';
						break;
					case 1:
						request = getDocumentList;
						currentLst = 'publicFileList';
						break;
					case 2:
						delete that.queryParams.isMine;
						delete that.queryParams.publicFlag;
						request = getMyShareDocumentList;
						currentLst = 'myShareList';
						break;
					case 3:
						delete that.queryParams.isMine;
						delete that.queryParams.publicFlag;
						request = getShareDocumentList;
						currentLst = 'shareWithMeList';
						break;
				}
				let params = changeParam(that
					.queryParams); //'"?isMine=0&pageNo=1&pageSize=10&publicFlag=1&fileFormatStr=5&6&7&name="'//
				that.isLoading = true;
				request(params, res => {
					if (res.code == 200 && res.success) {
						if (type == 1) {
							that[currentLst] = res.result.records;
						} else {
							let oldData = that[currentLst];
							that[currentLst] = [...oldData, ...res.result.records];
						}
						that.maxPage = res.result.pages;
						that.isLoading = false;
						that.isShowEmpty = res.result.records.length > 0 ? false : true;
						that.isShowLoadMore = res.result.pages > 1;
						that.queryPageStatus = that.maxPage == that.queryParams.pageNo ? 'nomore' : (res.result
							.pages == 1 ? 'nomore' : 'loadmore');
						that.list = that[currentLst]
					} else {
						uni.$u.toast(res.message);
					}
				}, error => {

				})
			},
			openFile(item) {
				if (item.type == 0) {
					this.gotoFileFolder(item);
				} else {
					this.getDocumentInfo([2, 3].includes(this.current) ? item.documentId : item.id);
				}
			},
			gotoFileFolder(item) {
				let r = this.$cache.get('_routeTitle');
				if (r) {
					r.push(item.name)
				} else {
					r = [this.upperLevel, item.name]
				}
				this.$cache.set('_routeTitle', r)
				let str = `?title=${item.name}&current=${this.current}&id=${item.id}`
				uni.navigateTo({
					url: "/pages/assist/documentManagement/fileFolder" + str
				})
			},
			getDocumentInfo(id) {
				let params = changeParam({
					id
				})
				getDocumentInfo(params, res => {
					if (res.code == 200 && res.success) {
						console.log('getDocumentInfo-res:', res)
						const {
							url,
							fileName
						} = res.result.fileMsgResp;
						let p =
							`?link=${Base64.encode(url)}&title=${fileName}&id=${res.result.id}&current=${this.current}`
						uni.navigateTo({
							url: "/pages/assist/documentManagement/openFile" + p
						})
					} else {
						uni.$u.toast(res.message);
					}
				}, error => {

				})
			}
		}
	}
</script>

<style lang="scss">
	.sticky-title {
		height: 48px;
		background: #fff;
		// border-top: 1px solid;
		// border-top-color: rgba(0, 0, 0, 0.05);
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

	.u-empty {
		margin-top: 150px !important;
	}

	.u-form {
		padding: 0 16px;

		.filter-content-detail-item-default {
			color: #666666;
			padding: 5px 15px;
			border-radius: 5px;
			margin-right: 10px;
			margin-top: 10px;
			display: inline-block;
			font-size: 14px;
			background-color: rgba(248, 249, 251, 1)
		}

		.filter-content {
			display: inline-block;
			//padding: 5px 15px;
		}

		.logo {
			width: 24px;
			height: 24px;
			right: 2px;
			top: 6px;
		}

		.item-txt {
			color: rgba(0, 114, 255, 1);
			font-size: 14px;
			position: absolute;
			right: 16px;
		}
	}

	/deep/.top-height {
		.u-line {
			border: none !important;
		}

		// margin-top: 20px;
		.folder-icon {
			width: 43px;
		}

		.logo {
			width: 24px;
			height: 24px;
			margin-right: 5px;
		}

		.logo-folder {
			width: 34px;
			height: 34px;
		}

		.initLoading {
			padding-top: 20px;
		}
	}
</style>
