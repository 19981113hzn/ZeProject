<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }" class='file-detail-container'>
		<u-navbar title="文件详情"  bgColor="#fff" @leftClick="leftClick">
		</u-navbar>
		<view class="header">
			<image v-if="[0,1].includes(detail.fileFormat)" class="logo-folder"
				src="/static/img/assist/icon_file_xls.png"></image>
			<image v-if="[2,3].includes(detail.fileFormat)" class="logo-folder"
				src="/static/img/assist/icon_file_doc.png"></image>
			<image v-if="detail.fileFormat==4" class="logo-folder"
				src="/static/img/assist/icon_file_pdf.png"></image>
			<image v-if="[5,6,7].includes(detail.fileFormat)" class="logo-folder"
				src="/static/img/assist/icon_file_png.png"></image>
			<image v-if="detail.fileFormat==8" class="logo-folder"
				src="/static/img/assist/icon_file_rar.png"></image>
			<image v-if="detail.fileFormat==9" class="logo-folder"
				src="/static/img/assist/icon_file_txt.png"></image>
			
			<image v-if="!detail.fileFormat && detail.type==0" class="logo-folder"
				src="/static/img/assist/icon_file_folder.png"></image>
			<view class="title">{{detail.name || '-'}}</view>
			<view class="size">{{size}}</view>
		</view>
		<view class="middle-module">
			<u-cell title="上传人员">
				<view slot="value" class="upload-person">
					<image class="icon-mg"  src="/static/img/assist/icon_mg.png"></image>
					<text style="vertical-align: middle;color:#606266;">{{detail.uploadUserName || '-'}}</text>
				</view>
			</u-cell>
			<u-cell title="文件描述" :value="detail.name"></u-cell>
			<u-cell title="关联业务" :value="detail.businessName || '-'"></u-cell>
		</view>
		<view class="bottom-module">
			<u-cell title="上传时间" :value="detail.createTime || '-'"></u-cell>
			<u-cell title="更新时间" :value="detail.updateTime || '-'"></u-cell>
		</view>
	</view>
</template>

<script>
	import {
		getDocumentInfo
	}from '@/util/interface.js'
	import {
		changeParam,
		renderSize
	} from "@/util/common.js"
	export default {
		data() {
			return {
				statusBarHeight:getApp().globalData.statusBarHeight+44,//状态栏高度
				index:0,
				id:"",
				detail:{fileFormat:null,},
				size:""
			}
		},
		onLoad(option) {
			this.id = option.id;
			this.getDocumentInfo()
		},
		methods: {
			leftClick(){
				uni.navigateBack();
			},
			getDocumentInfo(){
				let params = changeParam({id:this.id})
				getDocumentInfo(params,res=>{
					console.log('getDocumentInfo-res:',res)
					this.detail = res.result;
					this.index = this.detail.fileFormat;
					this.size = renderSize(res.result.size)
				},error=>{
					
				})
			}
		}
	}
</script>

<style lang="scss">
.header{
	height: 193px;
	background: #fff;
	margin-bottom: 8px;
	padding-top: 47px;
	.logo-folder{
		display: block;
		width: 58px;
		height: 58px;
		margin:0 auto;
		margin-bottom: 11px;
	}
	.title{
		color:#303133;
		font-size: 16px;
		margin-bottom: 3px;
		text-align: center;
		font-weight: bold;
	}
	.size{
		color:#C0C4CC;
		text-align: center;
		font-size: 12px;
	}
}
.middle-module{
	background: #fff;
	margin-bottom: 8px;
	.upload-person{
		display: flex;
		align-items: center;
	}
	.icon-mg{
		width: 28px;
		height: 28px;
		margin-right: 8px;
	}
	
	
}
.bottom-module{
	background: #fff;
}
.file-detail-container{
	background: #F6F7FA;
}

/deep/ .middle-module{
	.u-cell__title-text{
		color:#909399;
	}
	.u-cell__value{
		color:#909399;
	}
}

/deep/ .bottom-module{
	.u-cell__title-text{
		color:#909399;
	}
	.u-cell__value{
		color:#606266;
	}
}
</style>
