<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px','display':'flex' }" class="container">
		<u-navbar :title="title" bgColor="#fff" @leftClick="leftClick">
			<view class="u-nav-slot" slot="right" v-if="current !=3">
				<image class="logo" src="/static/img/assist/detail_more.png"
					@tap.stop="showFileSetPopup=true"></image>
			</view>
		</u-navbar>
		<view style="width: 100vw;height: 100vh;">
			<webview :link="link" style="width:100%;height:550px;" :webview-styles="webviewStyles"/>
		</view>
		
		<view class="commentBottom">
			<u--input
				placeholder="我来说两句"
				shape='circle'
				border='none'
				@focus="focus"
				class="commentInput"
			  ></u--input>
			<text class="look" @click="focus">查看评论</text>
		</view>
		<view>
			<!-- 评论弹窗 -->
			<u-popup :show="showCommentPopup" mode="bottom" round="13" :closeable='true' @close="closeCommentPopup">
				<view class="commentHeader">
					<view class="commentTitle">全部评论</view>
				</view>
				<view class="commentList">
					<view class="commentItem" v-for="item in commentList">
						 <u-row customStyle="padding:0 10px 16px 22px">
							<u-col span="1.7">
								<view class="comment-icon">
									<image class="logo-folder" src="/static/img/icon_user_default.png"></image>
								</view>
							</u-col>
							<u-col span="10">
								<view class="rightComment">
									<view style="margin-bottom: 6px;">
										<text class="createBy">{{item.createBy}}</text>
										<text class="createTime">{{item.createTime}}</text>
									</view>
								</view>
								<view class="commentValue">
									{{item.comment}}
								</view>
							</u-col>
						</u-row>
					</view>
					<view class="noComment" v-if="commentList.length == 0">
						暂无评论
					</view>
				</view>
				<view class="commentPopupBottom">
					<u--input
						v-model="commentValue"
						placeholder="我来说两句"
						shape='circle'
						confirm-type="search" 
						border='none'
						@focus="focus"
						@confirm='setNewComment'
						class="commentInput"
					  ></u--input>
				</view>
			</u-popup>
		</view>
		<view>
			<!-- 文件 -->
			<u-popup :show="showFileSetPopup" mode="bottom" round="13">
				<view class="file-more">
					<u-cell :title="title" :label="targetItem.createTime" class="fm-header">
						<view slot="icon" class="folder-icon">
							<image class="logo-folder" src="/static/img/assist/icon_file_xls.png"></image>
						</view>
						<image class="popup-logo" slot="value" src="/static/img/assist/close.png"
							@click="showFileSetPopup=false"></image>
					</u-cell>
					<view class="folder-action">
						<u-cell class="folder-bottom" title="移动" label="" @click="gotoMovePosition">
							<view slot="icon" class="popup-icon">
								<image class="logo-folder" src="/static/img/assist/icon_yd.png"></image>
							</view>
						</u-cell>
						<u-cell class="folder-bottom folder-bottom-radius" title="共享" label="" @click="gotosharedFiles">
							<view slot="icon" class="popup-icon">
								<image class="logo-folder" src="/static/img/assist/icon_gx.png"></image>
							</view>
						</u-cell>
						<u-cell class="folder-bottom folder-bottom-radius" title="重命名" label=""
							@click="handleShowRenameModal">
							<view slot="icon" class="popup-icon">
								<image class="logo-folder" src="/static/img/assist/icon_cmm.png"></image>
							</view>
						</u-cell>
						<u-cell class="folder-bottom folder-radius" title="文件详情" label="" @click="gotoFileDetail">
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
					<view class="del-content">确认要删除文件: {{targetItem.name}} ？</view>
				</view>
			</u-modal>
		</view>
		<!-- 重命名 -->
		<view>
			<u-modal :show="showRenameModal" @confirm="confirmRename" class="rename-modal" ref="uModal"
				:asyncClose="true" :showCancelButton="true" confirmText="确定" cancelColor="#606266" confirmColor="#000"
				@cancel="cancelRenameModal">
				<view class="rename-content">
					<view class="rename-header">重命名</view>
					<u--input placeholder="请输入" border="surround" :clearable="true" v-model="renameValue"></u--input>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import {
		filePreview
	} from '@/util/request.js'
	import {
		getDocumentInfo,
		setNewComment,
		deleteDocument,
		editFileOrFolder
	}from '@/util/interface.js'
	import {
		changeParam
	} from "@/util/common.js"
	import webview from "./components/webview.vue"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				link:"",
				id:"",
				title:"",
				current:"",
				showFileSetPopup:false,
				showCommentPopup:false,
				showDelModal: false,
				showRenameModal: false,
				renameValue:"",
				commentValue:"",
				// 操作参数 文件/文件夹
				targetItem:{name:"",createTime:"",fileFormat:null},
				commentList:[],
				webviewStyles: { 
					progress: { 
						color: '#000' //喜欢什么颜色就换什么颜色
					} 
				} 
			}
		},
		components:{webview},
		onLoad(option) {
			this.id = option.id;
			this.title = option.title;
			this.current = option.current;
			this.link = filePreview(option.link,'物壹科技')
			console.log('*******',this.link)
			this.getDocumentInfo()
			// 获取webview对象
			// const currentWebview = this.$scope.$getAppWebview();
			// currentWebview && currentWebview.setStyle({
			//     width: '100%',// 宽
			//     height:'550px',// 高
			//     scalable: true,// 可缩放
			// 	top:160
			// })
		},
		methods: {
			leftClick() {
				uni.navigateBack();
			},
			gotoFileDetail(){
				let str = `?id=${this.id}`;
				uni.navigateTo({
					url: "/pages/assist/documentManagement/fileDetail" + str
				})
			},
			gotoMovePosition() {
				uni.navigateTo({
					url: "/pages/assist/documentManagement/movePosition?isFirst=0&returnPageNumber=1"
				})
			},
			gotosharedFiles() {
				uni.navigateTo({
					url: "/pages/assist/documentManagement/sharedFiles?returnPageNumber=1"
				})
			},
			handleShowDelModal() {
				this.showFileSetPopup = false;
				this.showDelModal = true;
			},
			confirmDel() {
				deleteDocument(`/${this.id}`,res=>{
					if(res.code == 200 && res.success){
						this.showDelModal = false;
						uni.$u.toast("删除成功");
						uni.$emit('return',true)
						setTimeout(()=>{
							uni.navigateBack();
						},1000)
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			handleShowRenameModal() {
				this.showFileSetPopup = false;
				this.showRenameModal = true;
			},
			cancelRenameModal(){
				this.renameValue = "";
				this.showRenameModal = false;
			},
			confirmRename() {
				if(!this.renameValue)return
				let params = {...this.targetItem,name:this.renameValue};
				editFileOrFolder(params,res=>{
					if(res.code == 200 && res.success){
						uni.$u.toast("修改成功");
						this.showNewFile = false; //新建文件夹
						this.title = this.renameValue;
					}else{
						uni.$u.toast(res.message);
					}
					this.showRenameModal = false;
					this.renameValue = "";
				})
			},
			focus(){
				this.showCommentPopup = true;
			},
			closeCommentPopup(){
				this.showCommentPopup = false;
				 this.commentValue = "";
			},
			setNewComment(){
				if(!this.commentValue) return;
				let params = {
				  "comment": this.commentValue,
				  "documentId": this.id
				}
				setNewComment(params,res=>{
					if(res.code == 200 & res.success){
						this.getDocumentInfo()
					}else{
						uni.$u.toast(res.message);
					}
					 this.commentValue = "";
				},error=>{
					
				})
			},
			getDocumentInfo(){
				let params = changeParam({id:this.id})
				getDocumentInfo(params,res=>{
					if(res.code == 200 & res.success){
						console.log('getDocumentInfo-res:',res)
						this.targetItem = res.result;
						this.commentList = res.result.commentList.map(i=>({...i,createTime:i.createTime.split(' ')[1]}));
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
	.container{
		box-sizing: border-box;
		height: 100vh;
		overflow: hidden;
	}
	.commentBottom{
		// background: #ccc;
		box-sizing: border-box;
		width: 100%;
		height: 60px;
		position: absolute;
		bottom:10px;
		left:0;
		padding-left: 16px;
		padding-top: 13px;
		.commentInput{
			display: inline-block;
			background: #F6F7FA;
			width: 270px;
			font-size: 16px;
			height: 28px;
			text-indent: 20px;
			margin-right: 16px;
		}
		.look{
			color:#606266;
			font-size: 14px;
		}
	}
	.commentTitle{
		height: 50px;
		line-height: 50px;
		text-align: center;
		font-size: 17px;
		font-weight: bold;
	}
	.commentPopupBottom{
		background: #fff;
		box-sizing: border-box;
		width: 100%;
		height: 58px;
		position: absolute;
		bottom:0;
		left:0;
		padding-left: 16px;
		padding-top: 13px;
		border-top: 1px solid #F6F7FA;
		.commentInput{
			background: #F6F7FA;
			width: 343px;
			font-size: 16px;
			height: 32px;
			text-indent: 20px;
		}
		.look{
			color:#606266;
			font-size: 14px;
		}
	}
	.commentList{
		box-sizing: border-box;
		padding-bottom: 50px;
		height: 500px;
		overflow-x:hidden ;
		.noComment{
			padding-top: 188px;
			font-size: 14px;
			color:#909399;
			text-align: center;
		}
		.commentItem{
			border-bottom: 1px solid #F6F7FA;
			.comment-icon{
				width: 28px;
				height: 28px;
			}
			.rightComment{
				padding-top: 5px;
				.createBy{
					margin-right: 4px;
					color:#606266;
					font-size: 14px;
				}
				.createTime{
					text-align: right;
					float: right;
					color:#909399;
					font-size: 12px;
				}
				.commentValue{
					color:#303133;
					font-size: 14px;
				}
			}
		}
	}
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

