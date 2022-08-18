<template>
	<view class="container" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<luo-nav-bar midText='' rightText="取消" @leftClick="leftClick" @rightClick="rightClick">
			<view slot="mid" style="width: 100%;">
				<u-search :show-action="false" :searchIcon="src" placeholder="搜索文档" bgColor="rgba(244, 246, 250, 1)"
					v-model="searchValue" :clearabled="true" @change="searchChange"></u-search>
			</view>
		</luo-nav-bar>
		<view class="top-height">

			<view v-for="(item, index) in list" :key="item.id">
				<u-cell :title="item.name"
					:label="current!=2 ? (item.createBy + '    ' + item.createTime):(item.createUserName + '    ' + item.fileCreateTime)"
					@click="openFile(item)">
					<view slot="icon" class="folder-icon">
						<image class="logo-folder" :src="src"></image>
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
	</view>
</template>

<script>
	import luoNavBar from './components/luo-navBar.vue';
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
		components: {
			luoNavBar,
		},
		data() {
			return {
				searchValue: "",
				statusBarHeight: getApp().globalData.statusBarHeight, //状态栏高度
				current: 0,
				type: 0,
				src: "",
				lstUrl: [
					'/static/img/assist/icon_file_xls.png',
					"/static/img/assist/icon_file_doc.png",
					"/static/img/assist/icon_file_pdf.png",
					'/static/img/assist/icon_file_png.png',
					'/static/img/assist/icon_file_folder.png',
					'/static/img/assist/icon_file_rar.png',
					'/static/img/assist/icon_file_txt.png'
				],
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
			this.type = parseInt(option.type) || 0;
			this.current = parseInt(option.current) || 0;
			this.id = option.id || ""
			console.log(this.lstUrl)
			this.src = this.lstUrl[this.type]
			this.getType(1);

		},
		onReachBottom() {
			if (this.queryParams.pageNo >= this.maxPage) return;
			this.queryPageStatus = 'loading';
			this.queryParams.pageNo = this.queryParams.pageNo + 1;
			this.getType(2);
		},
		methods: {
			leftClick() {
				uni.navigateBack({

				})
			},
			rightClick() {
				uni.navigateBack({
					delta: 2
				})
			},
			searchChange() {
				this.queryParams.name = this.searchValue;
				this.getType(1);
			},
			getType(num) {
				switch (this.type) {
					case 0: //表格
						this.fileFormatStr = '0,1';
						break;
					case 1: //文档
						this.fileFormatStr = '2,3';
						break;
					case 2: //PDF
						this.fileFormatStr = '4';
						break;
					case 3: //图片
						this.fileFormatStr = '5,6,7';
						break;
					case 4: //文件夹
						this.queryParams.type = '0';
						this.fileFormatStr = "";
						break;
					case 5: //压缩包
						this.fileFormatStr = '8';
						break;
					case 6: //TXT
						this.fileFormatStr = '9';
						break;
				}
				this.getList(num);
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
				params = params + "&fileFormatStr=" + this.fileFormatStr
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
	.logo {
		width: 24px;
		height: 24px;
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
