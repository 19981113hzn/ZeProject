<template>
	<view class="detail">
		<u-navbar title="产品详情" bgColor="#fff" @leftClick="leftClick">
		</u-navbar>
		<!-- 详情轮播图 -->
		<swiper v-if="ProductDetails.imgUrl === null" class="swiper" :indicator-dots="true"
			indicator-color="rgba(221, 225, 232, 1)" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item>
				<view class="swiper-item">
					<image src="../../static/img/Frame 1556.png" mode=""></image>
				</view>
			</swiper-item>

		</swiper>
		<swiper v-else class="swiper" circular :indicator-dots="true" indicator-color="rgba(221, 225, 232, 1)"
			indicator-active-color="#0072FF" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in ImgPath" :key="index">
				<view class="swiper-item">
					<image :src="item"></image>
				</view>
			</swiper-item>
		</swiper>

		<!-- 内容主体 -->
		<!-- 有数据时 -->
		<view class="content" :style="{paddingTop: changePadding + 'px'}">
			<view class="name">
				<view style="padding-bottom: 10px; color: #909399; font-size: 14px;">产品名称</view>
				<view style="font-size: 15px;">{{ProductDetails.name}}</view>
			</view>
			<view class="number">
				<view style="padding-bottom: 10px; color: #909399; font-size: 14px;">产品编号</view>
				<view style="font-size: 15px;">{{ProductDetails.prodNo}}</view>
			</view>
			<view class="price">
				<view style="padding-bottom: 10px; color: #909399; font-size: 14px;">标准单价</view>
				<view style="font-size: 15px;">¥ {{ProductDetails.price}}</view>
			</view>
			<view class="spec">
				<view style="padding-bottom: 10px; color: #909399; font-size: 14px;">产品规格</view>
				<view style="font-size: 15px;">{{specValue}}</view>
			</view>
			<view class="size">
				<view style="padding-bottom: 10px; color: #909399; font-size: 14px;">产品尺寸（长*宽*高）</view>
				<view v-if="ProductDetails.length || ProductDetails.width || ProductDetails.height"
					style="font-size: 15px;">
					{{ProductDetails.length}}{{sizeValue}}*{{ProductDetails.width}}{{sizeValue}}*{{ProductDetails.height}}{{sizeValue}}
				</view>
				<view v-else style="font-size: 15px;">无</view>

			</view>
			<view class="attachment">
				<view style="color: #909399; font-size: 14px;">附件</view>
				<!-- <image v-if="this.documentList.length == 0" src="/static/img/icon_file.png"
					style="width: 34px; height: 34px;padding-top: 6px;"></image> -->
				<view v-if="this.documentList.length == 0" style="padding-top: 6px;">无</view>
				<view v-for="(item,index) in documentList" :key="index" class="attachmentDetail"
					style="font-size: 15px; color: #0072FF;" @click="showFileDetail(item.url)">
					<!-- 文件类型 -->
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

					</image>
					<view class="txt">
						<view class="txt_name">{{item.name}}</view>
						<view class="txt_detail">
							<text style="padding-right: 8px;">{{item.createBy}}</text>
							<text>{{item.createTime}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="remark">
				<view style="padding-bottom: 10px; color: #909399; font-size: 14px;">备注信息</view>
				<view v-if="ProductDetails.remark" style="font-size: 15px;word-break: break-all;">
					{{ProductDetails.remark}}
				</view>
				<view v-else style="font-size: 15px;">送价值1000元的赠品</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getProductDetail,
		getDictItemsByCode
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				hasImage: true,
				changePadding: 0,
				ProductDetails: {},
				isLoading: false, //加載中
				ImgPath: [], //图片数组
				documentList: [], //附件列表
				dictList: [],
				myValue: '',
				specValue: '',
				sizeValue: ''
			}
		},
		mounted() {

		},
		onLoad(option) {
			console.log(option.id)
			this.id = option.id
			this.getDetail()
		},
		onShow() {
			this.getDetail()
		},
		methods: {
			leftClick() {
				uni.navigateBack()
			},
			getDetail() {
				this.isLoading = false
				console.log('参数', this.id)
				const data = "?id=" + this.id;

				getProductDetail(data, res => {
					console.log(res)
					if (res.code == 200 && res.success) {
						this.ProductDetails = res.result
						// this.myValue = this.ProductDetails.specification
						this.documentList = res.result.documentList
						if (res.result.imgUrl) {
							this.ImgPath = res.result.imgUrl.split(',')
						}
						console.log(this.ImgPath);
						this.isLoading = true;
					} else {
						uni.$u.toast(res.message);
					}
					// let myValue = this.ProductDetails.specification
					// console.log(myValue);
					let spec = "?dictCode=product_specification"
					let size = "?dictCode=product_unit"
					// 枚举产品规格
					getDictItemsByCode(spec, res => {
						console.log(res);
						let num = []
						let mySpec = this.ProductDetails.specification
						console.log(mySpec);
						for (let key in res.result) {
							num.push(res.result[key])
							// 获取枚举数组
							for (let key in num) {
								if (num[key].value == mySpec) {
									this.specValue = num[key].text
									console.log(this.specValue);
								}
							}
						}
					})
					// 枚举产品尺寸
					getDictItemsByCode(size, res => {
						console.log(res);
						let num = []
						let mySize = this.ProductDetails.unit
						console.log(mySize);
						for (let key in res.result) {
							num.push(res.result[key])
							console.log(num);
							// 获取枚举数组
							for (let key in num) {
								if (num[key].value == mySize) {
									this.sizeValue = num[key].text
									console.log(this.sizeValue);
								}
							}
						}
					})
				})
			},
			// 文件预览
			showFileDetail(url) {
				console.log(111);
				console.log('预览地址', url)
				uni.downloadFile({
					url: url,
					success: function(res) {
						console.log(666);
						if (res.tempFilePath.indexOf(".png" || ".jpg") > -1) {
							var filePath = []
							filePath[0] = res.tempFilePath;
							// 预览图片 
							uni.previewImage({
								urls: filePath,
								success: function(res) {
									console.log('打开成功')
								},
								fail: function(res) {
									console.log(res)
								}
							})
						} else {
							var filePath = res.tempFilePath;
							uni.openDocument({
								filePath: filePath,
								success: function(res) {
									console.log('打开文档成功');
								}
							});
						}
					},
					fail: function(res) {
						console.log(res)
					}
				});

				// uni.navigateTo({
				// 	url: "/pages/review/index?url=" + url
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		height: 100%;

		.swiper {
			// display: flex;
			margin-top: 30px;
			// width: 375px;
			height: 375px;
			padding: 15px 0;

			.swiper-item {
				display: block;
				height: 375px;
				line-height: 375px;
				text-align: center;

				image {
					width: 100%;
					height: 100%;
				}
			}

		}

		.content {
			font-family: 'PingFang SC-Medium';
			padding: 5px 16px 0 16px;

			.name {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 20px;
			}

			.number {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 20px;
			}

			.price {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 20px;
			}

			.spec {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 20px;
			}

			.size {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 20px;
			}

			.attachment {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 20px;

				.attachmentDetail {
					display: flex;
					// justify-content: space-between;
					align-items: center;
					padding-top: 10px;
				}

				image {
					width: 34px;
					height: 34px;
					padding-right: 16px;
				}

				.txt {
					.txt_name {
						font-size: 14px;
						color: #303133;
					}

					.txt_detail {
						font-size: 12px;
						color: #909399;
					}
				}
			}

			.remark {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 20px;
			}
		}
	}

	// 有图片时content的样式
	// .changePadding {
	// 	padding-top: 65px;
	// }
</style>
