<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="选择位置" leftIcon="" bgColor="#fff" rightText="取消" :border="true" @leftClick="leftClick"
			@rightClick="rightClick">

		</u-navbar>

		<view style="flex: auto; height:auto!important;">
			<scroll-view class="scrool-more" :style="{ 'top': (statusBarHeight) + 'px','bottom':'72px'}" scroll-y="true"
				scroll-with-animation="true" @scrolltolower="scrollLoadMoreData">
				<view class="folder-title">
					<text class="folder-title-one" @click="getData(id,1)">{{title}}</text>
					<view v-for="(item, index) in folderCache" :key="index" style="display: inline-block;">
						<u-icon name="arrow-right"></u-icon>
						<text class="folder-title-two" @click="selectFolder(index)">{{item.name}}</text>
					</view>
					<!-- <u-icon name="arrow-right"></u-icon>
				 	<text class="folder-title-two">合同</text> -->
				</view>
				<u-empty v-if="isLast" width="84" height="84" text="暂无文件" icon="/static/img/assist/search_empty.png">
				</u-empty>
				<view v-else v-for="(item, index) in lstFile" :key="index" @click="gotoFile(item)">
					<u-cell :title="item.name" :label="item.createTime">
						<view slot="icon" class="folder-icon">
							<image class="logo-folder" src="/static/img/assist/icon_file_folder.png"></image>
						</view>
						<!-- <image v-if="item.children.length>0" class="logo" slot="value" src="/static/img/assist/move-right.png"
							@click.native.stop="setFile"></image> -->
					</u-cell>
				</view>

			</scroll-view>
		</view>

		<view class="foot-height">
			<u-button class="new-file" shape="circle" text="新建文件夹" @click="clickNewFile"></u-button>
			<u-button class="move-here" shape="circle" text="移动到此" @click="clickMoveHere"></u-button>
		</view>

		<u-modal :show="showNewFile" @confirm="confirmNewFile" class="rename-modal" ref="uModal"
			:showCancelButton="true" confirmText="确定" cancelColor="#606266" confirmColor="#000"
			@cancel="showNewFile=false">
			<view class="rename-content">
				<view class="rename-header">新建文件夹</view>
				<u--input placeholder="请输入文件夹名称" border="surround" :clearable="true" v-model="fileName"></u--input>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getDocumentFolderList,
		documentAdd,
		documentMove
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				lstFile: [],
				isLast: false, //是否最后一个文件
				folderCache: [], //文件缓存
				fileInfo: {},
				selectIndex: 0,
				title: '', //进入的文件名
				returnPageNumber: 1, //返回的页数
				showNewFile: false,
				fileName: "",
				id: "", //文件id(需移动的)
				current: 0
			}
		},
		onLoad(option) {
			this.title = option.title || '';
			this.id = option.id || '';
			this.returnPageNumber = parseInt(option.returnPageNumber) || 1;
			this.current = parseInt(option.current) || 0;
			// if(this.isFirst > 0){
			// 	this.lstFile=[
			// 		{name:"测试",id:1,isLast:true},
			// 		{name:"文件",id:1,isLast:true},
			// 	]
			// }
			this.getData('', 1);
		},
		methods: {
			getData(id, type) {
				let data = '?&isMine=' + (this.current == 0 ? 1 : 0) +
					'&publicFlag=' + (this.current == 1 ? 1 : 0) +
					(isEmpty(id) ? '' : '&id=' + id)
				getDocumentFolderList(data, res => {
					if (res.code == 200 && res.success) {
						if (type == 1) {
							this.lstFile = res.result
							this.fileInfo = {};
							this.folderCache = [];
							this.isLast = false;
						}
						if (type == 2) {
							this.lstFile = res.result
							// this.fileInfo={};
							// this.folderCache=[];
							// this.isLast=false;
						}

					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			leftClick() {
				uni.navigateBack();
			},
			rightClick() {
				uni.navigateBack({
					delta: this.returnPageNumber
				})
			},
			scrollLoadMoreData() {
				// if (this.pageNo >= this.maxPage) return;
				// this.status = 'loading';
				// this.pageNo = this.pageNo + 1;
				//this.getData();
			},
			gotoFile(item) {
				this.fileInfo = item;
				this.isFirst = 1;
				this.folderCache.push(item)
				if (item.children.length == 0) {
					this.isLast = true
				} else {
					this.lstFile = item.children
				}

			},
			selectFolder(index) {
				this.lstFile = this.folderCache[index].children;
				this.fileInfo = this.folderCache[index];
				let arr = [];
				this.isLast = false;
				for (let i = 0; i < this.folderCache.length; i++) {
					if (i <= index) {
						arr.push(this.folderCache[i])
					}
					if (i == this.folderCache.length - 1) {
						this.folderCache = arr
					}
				}
				//console.log(this.folderCache)
			},
			clickNewFile() {
				console.log(this.fileInfo.name)
				this.showNewFile = true; //新建文件夹
				this.fileName = "";
			},
			//确定 ==》新建文件夹
			confirmNewFile() {
				if (isEmpty(this.fileName)) {
					uni.$u.toast("文件夹名称不能为空");
					return false;
				} else {
					let data = {
						name: this.fileName, //名称
						pid: isEmpty(this.fileInfo.id) ? null : this.fileInfo.id, //父id
						publicFlag: 0, //是否公共文档
						shareFlag: 0, //	0-未共享 1-已共享
						type: 0, //类型：0-文件夹 1-文件
					}
					documentAdd(data, res => {
						if (res.code == 200 && res.success) {
							this.showNewFile = false; //新建文件夹
							uni.$u.toast("新建成功");
							setTimeout(() => {
								this.getData('', 1);
							}, 1000)
						} else {
							uni.$u.toast(res.message);
						}
					})
				}
			},
			clickMoveHere() {
				let arr = [];
				arr.push(this.id)
				let data = {
					id: this.fileInfo.id,
					idList: arr
				}
				console.log(data)
				documentMove(data, res => {
					if (res.code == 200 && res.success) {
						uni.showToast({
							title: "移动成功"
						});
						uni.$emit('return', true);
						setTimeout(() => {
							uni.navigateBack({
								delta: this.returnPageNumber
							})
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
	.logo {
		width: 24px;
		height: 24px;
	}

	.logo-folder {
		width: 34px;
		height: 34px;
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

		.folder-title {
			padding: 16px 16px 10px;
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

	/deep/ {
		.u-empty {
			margin-top: 150px !important;
		}

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
				width: 45%;
				height: 42px;
				top: 16px;
			}

			.new-file {
				float: left;
				margin-left: 16px;
				background: rgba(241, 243, 246, 1);
				color: rgba(96, 98, 102, 1);

				.u-button__text {
					font-size: 16px !important;
				}
			}

			.move-here {
				float: right;
				margin-right: 16px;
				background: rgba(0, 114, 255, 1);
				color: #fff;

				.u-button__text {
					font-size: 16px !important;
				}
			}

		}
	}
</style>
