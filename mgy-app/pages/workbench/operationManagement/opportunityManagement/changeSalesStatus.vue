<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }" class="css-container">
		<u-navbar title="变更销售状态" left-text="关闭" leftIcon="" bgColor="#fff" @leftClick="leftClick"></u-navbar>
		<view class="content" v-if="saleStatusNormalList.length>0">
			<view class="tips">勾选完成才能切换下一状态</view>
			<u-steps :current="currentStep" direction="column" dot>
				<u-steps-item title="" v-for="(item,index) in saleStatusNormalList">
					<view slot="desc" class="step-item">
						<view :class="{'operate-disable':(currentStep !=index) || isComplete}"></view>
						<view class="form-item">
							<view class="qus-title">
								<text>{{item.saleStatus}}</text>
							</view>
							<u-collapse v-if="item.quotaList.length>0">
								<u-collapse-item v-for="(item1,index1) in item.quotaList">
									<view slot="title" class="u-page__item__title__slot-title">
										<!-- v-model="item1.complete" -->
										<u-checkbox v-model="item1.complete" :customStyle="{marginBottom: '8px'}"
											:label="item1.quota" shape="circle" :checked='item1.complete'
											@change="(s)=>{checkboxChange(s,index,index1)}" />
									</view>
									<u-cell title="">
										<view slot="title" class="u-slot-title upload-cell">
											<view v-if="item1.attachmentId" style="color:#909399;">
												已上传 <text
													style="color:#0072FF;">{{item1.attachmentId.split(',').length}}</text>
												个附件
											</view>
											<text style="color:#909399;" v-else>上传附件</text>
											<u-upload :fileList="fileList" :maxCount="20" multiple
												@afterRead="(e)=>{afterRead(e,index,index1)}" @delete="deletePic"
												:previewImage="false" class="css-upload"></u-upload>
										</view>
										<view slot="value" class="u-slot-title">
											<image src="/static/img/business/icon-upload.png" mode=""
												style="width:20px;height:20px;"></image>
										</view>
									</u-cell>
									<u-cell title="">
										<view slot="title" class="u-slot-title">
											<u--input placeholder="输入凭证" border="none"
												v-model="saleStatusNormalList[index].quotaList[index1].evidence">
											</u--input>
										</view>
									</u-cell>
								</u-collapse-item>
							</u-collapse>
						</view>
						<u-row customStyle="margin-bottom: 10px" justify="end">
							<u-col span="3.8">
								<view>
									<u-button type="primary" size="small" text="保存" :disabled="saveBtnDisable"
										shape="circle" color="#0072FF"
										customStyle="width:87px;height:28px;color:#fff;font-size:14px;"
										@click="save(index)"></u-button>
								</view>
							</u-col>
						</u-row>
					</view>
				</u-steps-item>
			</u-steps>
			<view class="lose-order" @tap.stop="handleLoseOrder">
				{{saleStatusText}}
			</view>
		</view>
		<view v-else style="padding-top: 40px;">
			<u-loading-icon text="加载中" textSize="14"></u-loading-icon>
		</view>
	</view>
</template>

<script>
	import {
		getbizOpptySaleStatus,
		upbizOpptySaleStatus,
		uploadAttachment,
		uploadPicturePlus
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				currentStep: 0,
				isOperate: false,
				checkboxValue: [],
				voucherValue: "",
				attachmentId: "",
				fileList: [],
				saleStatusNormalList: [],
				saleStatusEnd: {},
				saleStatusText: "丢单",
				isNewOperate: true,
				bizOpptyId: undefined,
				saveBtnDisable: false,
				isComplete: false,
			}
		},
		onLoad(option) {
			this.bizOpptyId = option.bizOpptyId;
			this.isNewOperate = !option.bizOpptyId;
			this.getBizOpptyStatus();
		},
		methods: {
			leftClick() {
				uni.navigateBack();
				uni.$emit('returnSalesStatus', true);
			},
			checkboxChange(s, index, index1) {
				console.log('s,index,index1:', s, index, index1)
				this.saleStatusNormalList[index].quotaList[index1].complete = s;
				console.log('change~~saleStatusNormalList:', this.saleStatusNormalList)
			},
			// 新增图片
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
						this.uploadByBusiness(data.result, index, index1);
					} else {
						uni.$u.toast(data.message);
					}
				})
			},
			// 上传到服务器后拿到附件id再调用业务相关的接口
			uploadByBusiness(result, index, index1) {
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
						this.attachmentId = this.fileList.map(i => (i.id)).join(',')
						let cId = this.saleStatusNormalList[index].quotaList[index1].attachmentId;
						this.saleStatusNormalList[index].quotaList[index1].attachmentId = cId ? (cId + ',' + this
							.attachmentId) : this.attachmentId;
						this.attachmentId = '';
						this.fileList = [];
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getBizOpptyStatus() {
				let d = this.$cache.get('_sjSalesStatusData');
				let params = this.bizOpptyId ? '?bizOpptyId=' + this.bizOpptyId : "";
				getbizOpptySaleStatus(params, res => {
					if (res.code == 200) {
						console.log('res:', res)
						let result = d || res.result;
						this.$cache.set('_sjSalesStatusData', result);
						//this.saleStatusNormalList = result.saleStatusNormalList.filter(i => i.quotaList.length >0);
						this.saleStatusNormalList = result.saleStatusNormalList;
						this.saleStatusNormalList.splice(this.saleStatusNormalList.length-1, 1);
						this.saleStatusEnd = result.saleStatusEnd;
						this.saleStatusText = this.saleStatusEnd.complete ? "已丢单" : "丢单";
						//计算当前currentStep
						let step = 0;
						this.saleStatusNormalList.forEach(item => {
							step = item.complete ? step + 1 : step
						})
						this.currentStep = step;
						//是否已完成
						this.isComplete = result.saleStatusNormalList[result.saleStatusNormalList.length - 1]
							.complete || result.saleStatusEnd.complete;
						this.currentStep = this.isComplete ? result.saleStatusNormalList.length : step;

					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			save(index) { //更新销售状态
				let s = this.saleStatusNormalList[index].quotaList.some(i => (!i.complete)); //校验存在未勾选
				if (s) { //false
					uni.$u.toast("全部勾选完成才能切换状态");
					return;
				}
				this.saleStatusNormalList[index].complete = true;
				let params = {
					bizOpptyId: this.bizOpptyId,
					saleStatusNormalList: this.saleStatusNormalList,
					saleStatusEnd: this.saleStatusEnd
				}
				if (this.isNewOperate) {
					uni.$u.toast("保存成功");
					console.log('保存数据:', params)
					this.$cache.set('_sjSalesStatusData', params);
					this.currentStep = index + 1;
					this.voucherValue = "";
					this.attachmentId = "";
					return;
				}
				upbizOpptySaleStatus(params, res => {
					if (res.code == 200) {
						uni.$u.toast("保存成功");
						this.$cache.set('_sjSalesStatusData', params);
						this.currentStep = index + 1;
						this.voucherValue = "";
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			handleLoseOrder() {
				if (this.isComplete) return
				if (this.saleStatusEnd.complete) return;
				this.saleStatusEnd.complete = true;
				this.saleStatusEnd.saleStatus = "已丢单";
				let data = {
					bizOpptyId: this.bizOpptyId,
					saleStatusNormalList: this.saleStatusNormalList,
					saleStatusEnd: this.saleStatusEnd
				};
				if (this.isNewOperate) {
					this.$cache.set('_sjSalesStatusData', data);
					uni.$u.toast("丢单成功");

					this.isComplete = true;
					return;
				}
				upbizOpptySaleStatus(data, res => {
					if (res.code == 200) {
						uni.$u.toast("丢单成功");
						this.saleStatusText = "已丢单";
						this.isComplete = true;
						this.$cache.set('_sjSalesStatusData', data);
					} else {
						uni.$u.toast(res.message);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.css-container {
		min-height: 700px;
		background: #F1F3F6;

		.content {
			padding: 16px 16px 16px 0px;

			.tips {
				color: #909399;
				font-size: 14px;
				margin-left: 12px;
				margin-bottom: 16px;
			}

			.step-item {
				position: relative;
				/* #ifndef APP-PLUS */
				box-sizing: border-box;
				/* #endif */
				padding: 12px 16px 0px 10px;
				margin-left: 5px;
				width: 90%;
				background: #fff;
				border-radius: 6px;
				margin-bottom: 8px;

				.qus-title {
					width: 200px;
					margin-bottom: 12px;
					padding-left: 10px;
					font-size: 15px;
					margin-left: 8px;
					font-weight: bold;
					color: #303133;
					position: relative;
					margin-bottom: 10px;

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

				.operate-disable {
					height: 100%;
					width: 100%;
					position: absolute;
					left: 0;
					top: 0;
					z-index: 10;
					border-radius: 6px;
					background: #F1F3F6;
					opacity: 0.4;
				}
			}
		}

		.lose-order {
			width: 70px;
			height: 70px;
			line-height: 70px;
			font-size: 15px;
			color: rgba(0, 114, 255, 1);
			text-align: center;
			background: #FFFFFF;
			box-shadow: 0px 6px 18px 1px rgba(0, 32, 72, 0.1000);
			border-radius: 44px 44px 44px 44px;
			font-weight: bold;
			position: fixed;
			bottom: 20px;
			right: 30px;
			z-index: 18;
		}
	}

	/deep/ .u-steps-item__wrapper {
		background: #F1F3F6 !important;
	}

	/deep/ {
		.u-cell__body {
			padding-left: 0;
			padding-bottom: 4px;
			padding-right: 0;
		}

		.u-steps-item__wrapper {
			background: #F1F3F6 !important;
			// margin-left: 4px;
		}

		.upload-cell {
			position: relative;
		}

		.css-upload {
			width: 100% !important;
			height: 40px !important;
			position: absolute;
			left: 0;
			top: -12px;

			.u-icon__icon {
				display: none;
			}

			.u-upload__button {
				width: 100% !important;
				height: 40px !important;
				background: transparent;
			}
		}

		.uni-input-input {
			font-size: 15px;
		}

		.uni-input-placeholder {
			color: #909399 !important;
			font-size: 15px;
		}

		.u-collapse-item__content__text {
			padding-left: 0;
			padding-right: 0;
		}

		.u-collapse-items>.u-line {
			display: none !important;
		}

		.u-collapse {
			margin-bottom: 12px;
		}
	}
</style>
