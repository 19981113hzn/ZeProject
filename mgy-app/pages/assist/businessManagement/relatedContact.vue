<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="选择主要联系人" bgColor="#fff" @leftClick="leftClick">

		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="搜索" bgColor="rgba(244, 246, 250, 1)"
					v-model="selectInfo.name" :clearabled="true" @change="searchChange"></u-search>
			</view>
		</u-sticky>
		<u-empty v-if="!contactsList.length" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<view v-else>
			<u-radio-group v-model="radiovalue1" placement="column" @change="groupChange">
				<view class="card" v-for="(item, index) in contactsList" :key="index">
					<view class="card-pa">
						<view class="contact_name">
							{{item.name}}
						</view>
						<view class="contact_method">
							<view class="name">{{item.name}}</view>
							<view class="phone">{{item.phoneNumber}}</view>
						</view>
						<u-radio class="check" :key="index" label="" :name="item.id" size="22" iconSize="18"> </u-radio>

					</view>
				</view>
			</u-radio-group>
		</view>
		<u-loadmore v-if="contactsList.length>0" :status="status" :loading-text="loadingText"
			:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getContactsList
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				searchValue: "",
				radiovalue1: '',
				pageNo: 1,
				contactsList: [],
				pageNo: 1,
				maxPage: 1,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isPrimary: true, //是否为主要联系人
				selectInfo: {
					name: '', //联系人姓名
					phoneNumber: "", //联系人电话
					customerId:"",//客户ID
				},
				contactIndex: '',
				contactName: '',
				returnPageNumber:1,
			}
		},
		onLoad(option) {
			this.radiovalue1 =option.contactId || ""
			this.selectInfo.customerId=option.customerId || ""
			//this.getTopHeight();
			// if (option.contactIndex) {
			// 	this.radiovalue1 = Number(option.contactIndex)
			// 	console.log(this.radiovalue1);

			// }
			this.getContactsData()
		},
		onShow() {
			// uni.$once('return', res => {
			// 	if (res) {
			// 		this.pageNo = 1;
			// 		this.maxPage = 1;
			// 		this.refresh();
			// 	}
			// })
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo += 1;
			this.getContactsData();
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
			// 获取联系人列表
			getContactsData() {
				let data = 
					"?pageSize=15&pageNo=" + this.pageNo +
					(!isEmpty(this.selectInfo.name) ? ("&name=" + this.selectInfo.name) :
						"") //联系人名称/搜索
					+
					(!isEmpty(this.selectInfo.phoneNumber) ? ("&phoneNumber=" + this.selectInfo.phoneNumber) :
						"")
					+
					(!isEmpty(this.selectInfo.customerId) ? ("&customerId=" + this.selectInfo.customerId) :"")
					
				getContactsList(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.contactsList = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.contactsList = this.contactsList.concat(res.result.records)
						}
						const findResult = this.contactsList.find((x) => x.id === this.radiovalue1)
						if(!isEmpty(findResult)){
							this.contactName = findResult.name
						}
						this.maxPage = isEmpty(res.result) ? this.maxPage : res.result.pages
						if (this.pageNo >= this.maxPage) this.status = 'nomore';
						else this.status = 'loading';
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			// 搜索
			searchChange() {
				this.pageNo = 1
				this.getContactsData()
			},
			leftClick() {
				uni.navigateBack();
			},
			groupChange(e) {
				// console.log(e);
				const findResult = this.contactsList.find((x) => x.id === e)
				if(!isEmpty(findResult)){
					this.contactName = findResult.name
				}
				let data={
					contactName:this.contactName,
					contactId:e
				}
				uni.$emit('returnContact', data);
				uni.navigateBack({
					delta: this.returnPageNumber
				});
				// this.radiovalue1 = e
				// this.contactIndex = e
				// this.contactName = this.contactsList[e].name
				// uni.navigateTo({
				// 	url: `../../workbench/operationManagement/opportunityManagement/addOpportunity?contactName=${this.contactName}&contactIndex=${this.contactIndex}`
				// })

			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.sticky-title {
		height: 48px;
		background: #fff;
		border-top: 1px solid;
		border-top-color: rgba(0, 0, 0, 0.05);
		padding: 0 16px;

		/deep/.u-search {
			margin-top: 8px !important;
		}
	}

	/deep/ {
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

			.uni-input-placeholder {
				text-align: right;
				color: rgba(0, 114, 255, 1) !important;
			}

			.u-input__content__field-wrapper__field {
				text-align: right !important;
				color: rgba(0, 114, 255, 1) !important;
			}
		}
	}

	.card {
		padding: 8px 16px 0 16px;
		background-color: #fff;

		.card-pa {
			position: relative;
			// padding: 5px 16px 0 16px;
			background: #fff;
			display: flex;
			border-bottom: 1px solid #F0F4F9;

			.contact_name {
				width: 46px;
				height: 46px;
				line-height: 46px;
				font-size: 16px;
				color: #fff;
				text-align: center;
				// margin-bottom: 4px;
				background: #0072FF;
				border-radius: 8px;
				opacity: 1;
			}

			// border-radius: 10px;
			.contact_method {
				padding-left: 12px;
				padding-bottom: 14px;

				.name {
					padding-bottom: 4px;
					color: #303133;
					font-size: 16px;
					font-weight: bold;
				}

				.phone {
					color: #606266;
					font-family: PingFang SC-Regular;
					font-size: 13px;
				}
			}

			.check {
				position: absolute;
				right: 0;
				top: 10px;
			}

			/deep/.u-line {
				border: none !important;
			}

			/deep/.u-cell__body {
				padding: 16px 0px 0;

				.u-cell__title-text {
					font-size: 16px;
					font-weight: bold;
					color: rgba(48, 49, 51, 1);
				}

				.logo {
					width: 30px;
					height: 30px;
				}
			}

			/deep/.u-form-item__body {
				padding: 10px 0 0;

				.u-form-item__body__left__content__label {
					font-size: 14px;
					color: rgba(116, 121, 136, 1);
				}

				.u-form-item__body__right__content__slot {
					font-size: 14px;
					color: rgba(48, 49, 51, 1);
				}
			}

			.card-pa-view {
				line-height: 30px;
				height: 30px;

				.card-title {
					display: block;
					width: 80%;
					float: left;
				}

				.card-state {
					display: block;
					width: 17%;
					float: right;
					color: #D1372C;
				}
			}

			.txt-size {
				display: block;
				margin-top: 5px;
				font-size: 14px;
				color: rgba(0, 0, 0, 0.65);
			}
		}

	}
</style>
