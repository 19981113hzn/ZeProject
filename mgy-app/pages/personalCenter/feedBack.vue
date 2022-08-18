<template>
	<view class="main" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar class="navbar" :title="navTitle" bgColor="#fff" @leftClick="leftClick"></u-navbar>

		<scroll-view class="content" scroll-y="true">
			<u--form v-model="form" ref="form">
				<!-- 反馈内容 -->
				<view class="feedBack">
					<u-form-item class="feedBack_content" label="反馈内容" prop="form.content" labelWidth="80" ref="item1">
					</u-form-item>
					<u--textarea type placeholder="请输入您需要反馈的内容" border="none" v-model="form.content" :maxlength="300"
						autoHeight count>
					</u--textarea>
				</view>
				<!-- 上传资料 -->
				<view class="upload">
					<u-form-item class="upload_content" label="上传资料" ref="item1" labelWidth="80">
					</u-form-item>
					<u-form-item label="" prop="form.img" ref="item1">
						<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="6" :maxCount="9"
							multiple width="55" height="55">
							<image src="/static/img/workbench/icon_upload.png" mode="widthFix"
								style="width: 55px;height: 55px;"></image>
						</u-upload>
					</u-form-item>
				</view>
				<!-- 联系方式 -->
				<view class="contact_method">
					<u-form-item class="contact_phone" label="联系方式" prop="form.contact" labelWidth="80" ref="item1">
					</u-form-item>
					<u--input class="input" placeholder="请填写" placehoderClass="plaClass" border="none"
						v-model="form.contact" maxlength="20">
					</u--input>
				</view>
			</u--form>

			<!-- 信息提示 -->
			<view class="info_warn">
				请留下您的联系方式(手机号码/微信号/QQ/邮箱)，反馈的相关问题我们会第一时间为您解答。
			</view>
			<!-- 提交表单 -->
			<view class="foot-height">
				<view style="padding: 0 16px;">
					<u-form-item>
						<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="提交" @click="submitForm">
						</u-button>
					</u-form-item>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		js_date_time,
		GetNowFormatDate
	} from "@/util/js_DateTime.js"
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		uploadPicturePlus,
		uploadAttachment,
		deleteAttachmemt,
		addFeedBack
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				value1: '反馈内容',
				navTitle: '意见反馈',
				form: {
					content: '',
					fileIdList: [],
					contact: ''
				},
				labelStyle: {
					color: '#C0C4CC'
				},
				fileList: [], //文件列表（回显）
				urlId: [], //提交到后台的图片路径
				isCheck: false, //防止多次点击提交
			}
		},
		methods: {
			// 删除图片
			deletePic({
				file
			}) {
				const findIndex = this.fileList.findIndex((fi) => fi.id == file.id);
				this.fileList.splice(findIndex, 1);
				const data = '/' + file.id;
				console.log(data);
				deleteAttachmemt(data);
			},
			async afterRead(event, index, index1) {
				console.log('event:', event);
				this.uploadToServer(event.file, index, index1);
				event.file = "";
			},
			deletePic() {},
			// 先上传到服务器
			uploadToServer(files, index, index1) {
				const data = files.map((mi, index) => {
					return {
						name: "image" + index,
						uri: mi.url
					}
				})
				console.log(data);
				uploadPicturePlus(data, response => {
					const data = JSON.parse(response)
					if (data.code == 200 && data.success) {
						this.fileList = data.result
						const url = data.result.map(item => {
							console.log(item);
							return item.fileId
						}).join(',')
						this.urlId = url
						console.log(this.urlId);
					} else {
						uni.$u.toast(data.message);
					}
				})
			},

			// 表单校验
			validateField() {
				if (isEmpty(this.form.content)) {
					uni.$u.toast("请输入反馈内容!");
					return false;
				}
				// if (isEmpty(this.fileList)) {
				// 	uni.$u.toast("请选择上传资料!");
				// 	return false;
				// }
				// if (isEmpty(this.form.contact)) {
				// 	uni.$u.toast("请填写联系方式!");
				// 	return false;
				// }
				// let reg_contact = /^(13[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
				// else {
				// 	if (!reg_contact.test(this.form.contact)) {
				// 		uni.$u.toast("请输入正确格式的手机号!");
				// 		return false
				// 	}
				// }
				return true;
			},

			// 提交表单
			submitForm() {
				if (this.validateField() && !this.isCheck) {
					this.isCheck = true
					console.log(this.urlId);
					let data = {
						clientType: 'APP',
						urlId: this.urlId,
						content: this.form.content,
						contact: this.form.contact
					}
					console.log(data);
					addFeedBack(data, res => {
						if (res.code == 200 && res.success) {
							console.log(res.result);
							uni.$u.toast("提交成功")
							setTimeout(() => {
								console.log(111);
								uni.navigateBack()
							}, 500)
						}
					})
				}
			},

			//返回上一级
			leftClick() {
				uni.navigateBack();
			},
		},
	}
</script>

<style lang="scss" scoped>
	.main {
		background-color: #F6F7FA;
		height: 100%;
	}

	.u-navbar__content {
		padding-bottom: 11px;
	}


	.content {

		.feedBack {
			display: flex;
			flex-direction: column;
			background-color: #fff;
			margin-top: 11px;
			padding-left: 16px;


			.feedBack_content {
				font-size: 16px;

				/deep/.u-form-item__body__left__content__label {
					color: #606266;
				}
			}

			/deep/.u-textarea {
				padding: 0;
				padding-bottom: 128px !important;
			}

			/deep/.u-textarea__count {
				padding-bottom: 12px;
				padding-right: 10px;
				color: #C0C4CC;
				font-size: 16px;
			}

			.count {
				text-align: right;
				padding: 82px 16px 16px 0;
				color: #C0C4CC;
			}


		}

		.upload {
			background-color: #fff;
			margin-top: 11px;
			padding-left: 16px;

			.upload_content {
				font-size: 16px;

				/deep/.u-form-item__body__left__content__label {
					color: #606266;
				}

			}

		}

		.contact_method {
			background-color: #fff;
			margin-top: 11px;
			display: flex;
			// justify-content: space-between;

			.contact_phone {
				width: 50%;
				// display: flex;
				// justify-content: center;
				// align-items: center;
				padding-left: 16px;
				font-size: 16px;
				padding-bottom: 5px;
				padding-top: 5px;



				// /deep/.u-form-item__body__left__content__label {
				// 	color: #606266;
				// }


			}

			.input {

				// width: 10%;
				/deep/.uni-input-placeholder .input-placeholder {
					width: 20%;
					// text-align: right;
				}

				/deep/.u-input__content__field-wrapper__field {
					text-align: right !important;
					padding-right: 10px;
				}
			}


		}




	}

	.info_warn {
		padding: 10px 16px 0px 16px;
		height: 400px;
		color: #909399;
		font-size: 12px;
		// background-color: #F6F7FA;
	}

	.foot-height {
		position: absolute;
		bottom: 0px;
		width: 100%;
		height: 72px;
		background: #fff;
		border-top: 1px solid #f0f4f9;

		.uni-input-placeholder {
			text-align: right;
			color: rgba(0, 114, 255, 1) !important;
		}

		.u-input__content__field-wrapper__field {
			text-align: right !important;
			color: rgba(0, 114, 255, 1) !important;
		}
	}

	/deep/.u-navbar__content__title {
		color: #303133;
		font-size: 17px;
	}

	// /deep/.plaClass {
	// 	text-align: right;
	// }
</style>
