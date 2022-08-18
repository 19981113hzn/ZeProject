<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="title" bgColor="#fff" @leftClick="leftClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo-icon" src="/static/img/assist/icon_file_search.png" @click="gotoSearchFile"></image>
				<image class="logo" src="/static/img/assist/icon_file_add.png" @click="newFile"></image>
			</view>
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="folder-title">
				<template v-if="routeTitleList.length<5">
					<template v-for="item,index in routeTitleList">
						<text class="folder-title-one"
							:style="{'color':index == routeTitleList.length-1?'#000':'rgba(144, 147, 153, 1)'}">{{item}}</text>
						<u-icon name="arrow-right" v-show="index != routeTitleList.length-1"></u-icon>
					</template>
				</template>
				<template v-else>
					<template v-for="item,index in routeTitleList.filter((i,index)=>(index<4))">
						<text class="folder-title-one"
							:style="{'color':index == routeTitleList.length-1?'#000':'rgba(144, 147, 153, 1)'}">{{item}}</text>
						<u-icon name="arrow-right"></u-icon>
					</template>
					<text class="folder-title-one">...</text>
					<u-icon name="arrow-right"></u-icon>
					<text class="folder-title-one"
						style="color:#000;">{{routeTitleList[routeTitleList.length-1]}}</text>
				</template>
			</view>
		</u-sticky>
		<view>
			<fileItem :list="list" @setFile="setFile" :current='current' :isLoading="isLoading"
				:isShowLoadMore="isShowLoadMore" :queryPageStatus="queryPageStatus" :isShowEmpty="isShowEmpty"
				:loadingText="loadingText" :loadmoreText="loadmoreText" :nomoreText="nomoreText" />
		</view>
		<view>
			<u-popup :show="showPopup" mode="bottom" round="13">
				<view class="file-more">
					<u-cell :title="targetItem.name" :label="targetItem.createTime" class="fm-header">
						<view slot="icon" class="folder-icon">
							<image v-if="[0,1].includes(targetItem.fileFormat)" class="logo-folder"
								src="/static/img/assist/icon_file_xls.png"></image>
							<image v-if="[2,3].includes(targetItem.fileFormat)" class="logo-folder"
								src="/static/img/assist/icon_file_doc.png"></image>
							<image v-if="targetItem.fileFormat==4" class="logo-folder"
								src="/static/img/assist/icon_file_pdf.png"></image>
							<image v-if="[5,6,7].includes(targetItem.fileFormat)" class="logo-folder"
								src="/static/img/assist/icon_file_png.png"></image>
							<image v-if="targetItem.fileFormat==8" class="logo-folder"
								src="/static/img/assist/icon_file_rar.png"></image>
							<image v-if="targetItem.fileFormat==9" class="logo-folder"
								src="/static/img/assist/icon_file_txt.png"></image>

							<image v-if="!targetItem.fileFormat && targetItem.type==0" class="logo-folder"
								src="/static/img/assist/icon_file_folder.png"></image>
						</view>
						<image class="popup-logo" slot="value" src="/static/img/assist/close.png"
							@click="showPopup=false"></image>
					</u-cell>
					<view class="folder-action">
						<u-cell class="folder-bottom" title="移动" label="" @click="gotoMovePosition">
							<view slot="icon" class="popup-icon">
								<image class="logo-folder" src="/static/img/assist/icon_yd.png"></image>
							</view>
						</u-cell>
						<u-cell v-if="targetItem.type==1 && targetItem.shareFlag==0" class="folder-bottom folder-bottom-radius" title="共享" label=""
							@click="gotosharedFiles">
							<view slot="icon" class="popup-icon">
								<image class="logo-folder" src="/static/img/assist/icon_gx.png"></image>
							</view>
						</u-cell>
						<u-cell v-if="targetItem.type==1 && targetItem.shareFlag==1"
							:class="current!=2 ? 'folder-bottom folder-bottom-radius' : 'folder-bottom'" title="取消共享"
							label="" @click="gotoCancelShared">
							<view slot="icon" class="popup-icon">
								<image class="logo-folder" src="/static/img/assist/icon_qxgx.png"></image>
							</view>
						</u-cell>
						<u-cell
							:class="( targetItem.type==0)?'folder-bottom folder-radius':'folder-bottom folder-bottom-radius'"
							title="重命名" label="" @click="handleShowRenameModal">
							<view slot="icon" class="popup-icon">
								<image class="logo-folder" src="/static/img/assist/icon_cmm.png"></image>
							</view>
						</u-cell>
						<u-cell v-if="targetItem.type==1" class="folder-bottom folder-radius" title="文件详情" label=""
							@click="gotoFileDetail">
							<view slot="icon" class="popup-icon">
								<image class="logo-folder" src="/static/img/assist/icon_cmm.png"></image>
							</view>
						</u-cell>
						<u-cell class="folder-last" title="删除" label="" @click="handleShowDelModal">
							<view slot="icon" class="popup-icon">
								<image class="logo-folder" src="/static/img/assist/icon_delete.png"></image>
							</view>
						</u-cell>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 删除确认 -->
		<view>
			<u-modal :show="showDelModal" @confirm="confirmDel" ref="uModal" :asyncClose="true" :showCancelButton="true"
				confirmText="确定" cancelColor="#0072FF" confirmColor="#FA5555" @cancel="showDelModal=false">
				<view class="slot-content">
					<view class="del-header">删除确认</view>
					<view class="del-content">确认要删除文件{{!targetItem.fileFormat?'夹':''}}: {{targetItem.name}}</view>
				</view>
			</u-modal>
		</view>
		<!-- 取消共享 -->
		<view>
			<u-modal :show="showCancelShared" @confirm="confirmCancelShared" ref="uModal" :asyncClose="true"
				:showCancelButton="true" confirmText="确定" cancelColor="#0072FF" confirmColor="#FA5555"
				@cancel="showCancelShared=false">
				<view class="slot-content">
					<view class="del-header">取消共享</view>
					<view class="del-content">确定要取消共享：{{targetItem.name}}</view>
				</view>
			</u-modal>
		</view>
		<!-- 重命名 -->
		<view>
			<u-modal :show="showRenameModal" @confirm="confirmRename" class="rename-modal" ref="uModal"
				:asyncClose="isAsyncClose" :showCancelButton="true" confirmText="确定" cancelColor="#606266"
				confirmColor="#000" @cancel="cancelRenameModal">
				<view class="rename-content">
					<view class="rename-header">重命名</view>
					<u--input placeholder="请输入" border="surround" :clearable="true" v-model="renameValue"></u--input>
				</view>
			</u-modal>
		</view>
		<view>
			<u-modal :show="showNewFile" @confirm="confirmNewFile" class="rename-modal" ref="uModal" :asyncClose="true"
				:showCancelButton="true" confirmText="确定" cancelColor="#606266" confirmColor="#000"
				@cancel="showNewFile=false">
				<view class="rename-content">
					<view class="rename-header">新建文件夹</view>
					<u--input placeholder="请输入文件夹名称" border="surround" :clearable="true" v-model="fileName">
					</u--input>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import {
		getDocumentList,
		getMyShareDocumentList,
		getShareDocumentList,
		deleteDocument,
		editFileOrFolder,
		documentAdd,
		unShareFile
	} from "@/util/interface.js"
	import {
		changeParam,
		isEmpty
	} from "@/util/common.js"
	import fileItem from './components/fileItem.vue'
	export default {
		components: {
			fileItem
		},
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				current: 0,
				isLoading: true,
				isShowEmpty: false,
				showPopup: false,
				showDelModal: false,
				showRenameModal: false,
				renameValue: "",
				isAsyncClose: false,
				fileName: "", //新建文件夹名称
				showNewFile: false, //新建文件夹
				showFilePopup: false, //文件==》更多
				// 搜索参数
				queryParams: {
					id: "",
					isMine: 1,
					pageNo: 1,
					pageSize: 12,
					publicFlag: 0
				},
				queryPageStatus: "loadmore",
				isShowLoadMore: false,
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				maxPage: 1,
				list: [],
				routeTitleList: [],
				id: "",
				title: "",
				// 操作参数 文件/文件夹
				targetItem: {
					name: "",
					createTime: "",
					fileFormat: null
				},
				showCancelShared: false, //取消共享
			}
		},
		onLoad(option) {
			let r = this.$cache.get('_routeTitle');
			this.routeTitleList = r ? r : [];
			this.title = option.title;
			this.current = option.current;
			this.id = option.id;
			this.getTopHeight()
			this.getList()
		},
		onReachBottom() {
			if (this.queryParams.pageNo >= this.maxPage) return;
			this.queryPageStatus = 'loading';
			this.queryParams.pageNo = this.queryParams.pageNo + 1;
			this.getList();
		},
		onBackPress(options) {
			if (options.from != 'backbutton') return
			console.log('options.from:', options.from)
			let r = this.$cache.get('_routeTitle');
			Array.isArray(r) && r.pop();
			this.$cache.set('_routeTitle', r)
			Array.isArray(r) && r.length ==2 && uni.$emit('return', true)
		},
		onShow() {
			uni.$once('return', res => {
				if (res) {
					this.initData();
				}
			})
		},
		methods: {
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
			getList() {
				let that = this;
				that.queryParams['isMine'] = that.current == "0" ? 1 : 0;
				that.queryParams['publicFlag'] = that.current == "1" ? 1 : 0;
				that.queryParams['id'] = that.id;
				let request;
				switch (that.current) {
					case "0":
						request = getDocumentList;
						break;
					case "1":
						request = getDocumentList;
						break;
					case "2":
						delete that.queryParams.isMine;
						delete that.queryParams.publicFlag;
						request = getMyShareDocumentList;
						break;
					case "3":
						delete that.queryParams.isMine;
						delete that.queryParams.publicFlag;
						request = getShareDocumentList;
						break;
				}
				let params = changeParam(that.queryParams);
				that.isLoading = true;
				request(params, res => {
					if (res.code == 200 && res.success) {
						let oldData = that['list'];
						that['list'] = [...oldData, ...res.result.records];
						that.maxPage = res.result.pages;
						that.isLoading = false;
						that.isShowEmpty = res.result.records.length > 0 ? false : true;
						this.isShowLoadMore = res.result.pages > 1;
						that.queryPageStatus = that.maxPage == that.queryParams.pageNo ? 'nomore' : (res.result
							.pages == 1 ? 'nomore' : 'loadmore');
					} else {
						uni.$u.toast(res.message);
					}
				}, error => {

				})
			},
			leftClick() {
				let r = this.$cache.get('_routeTitle');
				Array.isArray(r) && r.pop();
				this.$cache.set('_routeTitle', r)
					// Array.isArray(r) && r.length<3 && uni.$emit('return',true)
					!r && uni.$emit('return', true)
				uni.navigateBack();
			},
			initData() {
				this.isLoading = true;
				this.isShowEmpty = false;
				this.maxPage = 1;
				this.queryParams.pageNo = 1;
				this.queryPageStatus = 'loadmore'
				this.list = [];
				this.isAsyncClose = false;
				this.getList()
			},
			gotoFileDetail() {
				let id = this.current == 2 ? this.targetItem.documentId : this.targetItem.id;
				let str = `?id=${id}`;
				this.showPopup = false;
				uni.navigateTo({
					url: "/pages/assist/documentManagement/fileDetail" + str
				})
			},
			gotoSearchFile() {
				uni.navigateTo({
					url: "/pages/assist/documentManagement/searchFile?current=" + this.current +'&id='+this.id
				})
			},
			gotoMovePosition() {
				let title = this.current == 0 ? '我的文档' : (this.current == 1 ? '公共文档' : (this.current == 2 ? '我共享的' :
					'与我共享'));
				this.showPopup = false;
				uni.navigateTo({
					url: "/pages/assist/documentManagement/movePosition?title=" + title +
						"&returnPageNumber=1&id=" + this.targetItem.id + "&current=" + this.current

				})
			},
			gotosharedFiles() {
				console.log('targetItem:', this.targetItem)
				let id = this.current == 2 ? this.targetItem.documentId : this.targetItem.id;
				this.showPopup = false;
				uni.navigateTo({
					url: "/pages/assist/documentManagement/sharedFiles?returnPageNumber=1&id=" + id
				})
				// uni.navigateTo({
				// 	url: "/pages/assist/documentManagement/sharedFiles?returnPageNumber=1"
				// })
			},
			//取消共享
			gotoCancelShared() {
				console.log('targetItem:', this.targetItem)
				this.showPopup = false;
				this.showCancelShared = true;
			},
			confirmCancelShared() {
				let that = this;
				let data = [];
				let id = this.current == 2 ? this.targetItem.documentId : this.targetItem.id;
				data.push(id)
				unShareFile(data, res => {
					if (res.code == 200 && res.success) {
						that.showCancelShared = false;
						uni.showToast({
							title: "取消成功"
						});
						setTimeout(() => {
							that.initData();
						}, 800)
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			setFile(item) {
				this.targetItem = item; // 当前项所有参数
				this.showPopup = true;
			},
			handleShowDelModal() {
				this.showPopup = false;
				this.showDelModal = true;
			},
			confirmDel() {
				let that = this;
				let id = this.current == 2 ? this.targetItem.documentId : this.targetItem.id;
				deleteDocument(`/${id}`, res => {
					if (res.code == 200 && res.success) {
						this.showDelModal = false;
						uni.$u.toast("删除成功");
						setTimeout(() => {
							that.initData();
						}, 800)
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			handleShowRenameModal() {
				this.showPopup = false;
				this.showRenameModal = true;
			},
			cancelRenameModal() {
				this.renameValue = "";
				this.showRenameModal = false;
			},
			confirmRename() {
				if (!this.renameValue) {
					uni.$u.toast("请输入");
					return;
				}
				this.isAsyncClose = true;
				let params = {
					...this.targetItem,
					name: this.renameValue
				};
				editFileOrFolder(params, res => {
					if (res.code == 200 && res.success) {
						uni.$u.toast("修改成功");
						this.showNewFile = false; //新建文件夹
						this.initData()
					} else {
						uni.$u.toast(res.message);
					}
					this.showRenameModal = false;
					this.renameValue = "";
				})
			},
			newFile() {
				console.log(this.id)
				if (this.current == 0 || this.current == 1) {
					this.showNewFile = true; //新建文件夹
					this.fileName = "";
				} else {
					uni.$u.toast("共享列表不能新建文件夹");
				}
			},
			//确定 ==》新建文件夹
			confirmNewFile() {
				if (isEmpty(this.fileName)) {
					uni.$u.toast("文件夹名称不能为空");
					return false;
				} else {
					let data = {
						name: this.fileName, //名称
						pid: this.id, //
						publicFlag: (this.current == 1 ? 1 : 0), //是否公共文档
						shareFlag: 0, //	0-未共享 1-已共享
						type: 0, //类型：0-文件夹 1-文件
					}
					documentAdd(data, res => {
						if (res.code == 200 && res.success) {
							this.showNewFile = false; //新建文件夹
							uni.$u.toast("新建成功");
							this.initData();
						} else {
							uni.$u.toast(res.message);
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.logo {
		width: 24px;
		height: 24px;
	}

	.logo-icon {
		width: 24px;
		height: 24px;
		right: 12px;
	}

	.logo-folder {
		width: 34px;
		height: 34px;
	}

	.file-more {
		//height: 291px;
		border-radius: 13px 13px 0px 0px;
		background: #f3f4f6;
	}

	.del-header {
		text-align: center;
		margin-bottom: 16px;
		font-size: 17px;
	}

	.del-content {
		color: rgba(1, 1, 1, 0.6);
	}

	.folder-title {
		padding: 0 16px 10px;
		background: #fff;

		.folder-title-one {
			font-size: 14px;
			color: rgba(144, 147, 153, 1);
		}

		.folder-title-two {
			font-size: 14px;
			color: rgba(48, 49, 51, 1);
		}

		.u-icon--right {
			display: inline-block;

		}

		.u-icon__icon {
			color: rgba(144, 147, 153, 1) !important;
		}
	}

	/deep/ {
		.folder-icon {
			width: 50px;
		}

		.u-cell__label {
			margin-top: 5px;
			font-size: 12px;
			color: #909193;
			line-height: 18px;
		}

		.u-line {
			border: none !important;
		}

	}

	/deep/.u-tabs__wrapper {
		border-bottom: 1px solid;
		border-bottom-color: #eee;
		background: #fff;
	}

	/deep/ {
		.folder-icon {
			width: 50px;
		}

		.popup-logo {
			width: 30px;
			height: 30px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.u-cell__label {
			margin-top: 5px;
			font-size: 12px;
			color: #909193;
			line-height: 18px;
		}

		.u-line {
			border: none !important;
		}

		.fm-header {
			.u-cell__body {
				padding: 16px 16px 18px 21px;

				.folder-icon {
					width: 43px;
				}
			}

			.u-cell__title {
				.u-cell__title-text {
					font-weight: bold;
				}
			}

			.u-cell__label {
				margin-top: 0;
			}
		}

		.folder-action {
			//height: 217px;
			padding: 16px;
			box-sizing: border-box;
			font-size: 17px;
			border-top: 1px solid #eee;

			.u-cell {
				border-radius: 13px 13px 0 0;
				background: #fff;
			}

			.folder-bottom {
				border-bottom: 1px solid #eee;
			}

			.folder-bottom-radius {
				border-radius: 0px;
			}

			.folder-radius {
				background: #fff;
				border-radius: 0px 0px 13px 13px;
				margin-bottom: 16px;
			}

			.folder-last {
				border-radius: 13px;
				background: #fff;
			}

			// .u-cell:nth-child(1) {
			// 	border-bottom: 1px solid #eee;
			// }

			// .u-cell:nth-child(2) {
			// 	background: #fff;
			// 	border-radius: 0px 0px 13px 13px;
			// 	margin-bottom: 16px;
			// }

			// .u-cell:nth-child(3) {
			// 	border-radius: 13px;
			// 	background: #fff;
			// }

			.popup-icon {
				width: 24px;
				height: 24px;
				margin-right: 8px;

				.logo-folder {
					width: 24px;
					height: 24px;
				}
			}
		}

		.rename-modal {
			.u-modal__content {
				padding-left: 16px;
				padding-right: 16px;
			}

			.rename-header {
				text-align: center;
				margin-bottom: 16px;
				font-size: 17px;
			}

			.rename-content {
				width: 100%;
			}
		}

	}
</style>
