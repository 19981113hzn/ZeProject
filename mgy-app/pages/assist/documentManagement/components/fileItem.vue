<template>
	<view>
		
		<view v-for="(item, index) in list" :key="index">
			<template v-if="item.type==0">
				<u-cell :title="item.name || '-'" :label="(item.createBy || '-') + '    ' + (item.createTime || '-')" @click="gotoFileFolder(item)">
					<view slot="icon" class="folder-icon">
						<image class="logo-folder" src="/static/img/assist/icon_file_folder.png"></image>
					</view>
					<image class="logo" v-if="current!=3" slot="value" src="/static/img/assist/icon_file_folder_more.png"
						@tap.stop="setFile(item)"></image>
				</u-cell>
			</template>
			<template v-else>
				<u-cell :title="item.name || '-'" :label="item.createBy || '-'" @click="openFile(item)">
					<view slot="icon" class="folder-icon">
						<image v-if="[0,1].includes(item.fileFormat)" class="logo-folder" src="/static/img/assist/icon_file_xls.png"></image>
						<image v-if="[2,3].includes(item.fileFormat)" class="logo-folder" src="/static/img/assist/icon_file_doc.png"></image>
						<image v-if="item.fileFormat==4" class="logo-folder" src="/static/img/assist/icon_file_pdf.png"></image>
						<image v-if="[5,6,7].includes(item.fileFormat)" class="logo-folder" src="/static/img/assist/icon_file_png.png"></image>
						<image v-if="item.fileFormat==8" class="logo-folder" src="/static/img/assist/icon_file_rar.png"></image>
						<image v-if="item.fileFormat==9" class="logo-folder" src="/static/img/assist/icon_file_txt.png"></image>
					</view>
					<image v-if="current!=3" class="logo" slot="value" src="/static/img/assist/icon_file_folder_more.png"
						@tap.stop="setFile(item)"></image>
					<view slot="label" class="u-slot-label">
						<text class="u-cell__label">{{[0,1].includes(current) ? item.createBy:item.shareUserName}}&emsp;{{[0,1].includes(current) ? item.createTime:item.shareTime}}</text>
					</view>
				</u-cell>
			</template>
		</view>
		<view class="initLoading">
			<u-loading-icon v-if="isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
		</view>
		<view class="empty" v-if="isShowEmpty">
			<u-empty  text="暂无文件" width="84" height="84"
				icon="/static/img/icon_PDF.png"></u-empty>
		</view>
		<u-loadmore v-if="isShowLoadMore" :status="queryPageStatus" :loading-text="loadingText"
			:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
	</view>
</template>

<script>
	import {
		getDocumentInfo,
		editFileOrFolder
	}from '@/util/interface.js'
	import {
		changeParam
	} from "@/util/common.js"
	import Base64 from '@/util/base64.js';
	export default {
		data() {
			return {
			}
		},
		props:{
			list:{
				type:Array,
				default:[]
			},
			isLoading:true,
			isShowEmpty:false,
			current:'',
			loadingText:'',
			loadmoreText:'',
			nomoreText:'',
			queryPageStatus:'',
			isShowLoadMore:false,
			upperLevel:""
		},
		methods: {
			gotoFileFolder(item) {
				let r = this.$cache.get('_routeTitle');
				if(r){
					r.push(item.name)
				}else{
					r = [this.upperLevel,item.name]
				}
				this.$cache.set('_routeTitle', r)
				let str = `?title=${item.name}&current=${this.current}&id=${item.id}`
				uni.navigateTo({
					url: "/pages/assist/documentManagement/fileFolder" + str
				})
			},
			setFile(item){
				this.$emit('setFile',item)
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
			}
		}
	}
</script>

<style lang="scss">
	.logo {
		width: 24px;
		height: 24px;
		margin-right: 5px;
	}
	.empty{
		padding-top: 100px;
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
	.initLoading{
		padding-top: 20px;
	}
	.file-more {
		height: 291px;
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
			height: 217px;
			padding: 16px;
			box-sizing: border-box;
			font-size: 17px;
			border-top: 1px solid #eee;

			.u-cell {
				border-radius: 13px 13px 0 0;
				background: #fff;
			}

			.u-cell:nth-child(1) {
				border-bottom: 1px solid #eee;
			}

			.u-cell:nth-child(2) {
				background: #fff;
				border-radius: 0px 0px 13px 13px;
				margin-bottom: 16px;
			}

			.u-cell:nth-child(3) {
				border-radius: 13px;
				background: #fff;
			}

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

