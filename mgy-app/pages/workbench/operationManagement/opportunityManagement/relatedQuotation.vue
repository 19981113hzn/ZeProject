<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="关联报价" bgColor="#fff" @leftClick="leftClick">

		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="搜索" bgColor="rgba(244, 246, 250, 1)"
					v-model="selectInfo.name" :clearabled="true" @change="searchChange"></u-search>
			</view>
		</u-sticky>
		<u--form ref="form1" labelPosition="left" labelWidth="75">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': (statusBarHeight+48)  + 'px','bottom':'72px' }"
					scroll-y="true" scroll-with-animation="true" @scrolltolower="scrollBottom">
					<u-radio-group v-model="radiovalue1" placement="column" @change="groupChange">
						<view class="card" v-for="(item, index) in lstProductQuote" :key="index">
							<view class="card-pa" @click="gotoDetail(item)">
								<u-cell :title="item.name">
									<u-radio slot="value" :customStyle="{
										position: 'absolute',
										right: '32px'
									}" :key="index" label="" :name="item.id" size="20" iconSize="20"> </u-radio>
								</u-cell>
								<u--form labelWidth="75">
									<u-form-item label="产品总额">
										<text style="color: rgb(0, 114, 255);">￥{{item.productAmount}}</text>
									</u-form-item>
									<u-row>
										<u-col span="5">
											<u-form-item label="产品记录">
												<text>{{item.quoteNum}}条</text>
											</u-form-item>
										</u-col>
										<u-col span="6">
											<u-form-item label="产品总数">
												<text>{{item.productNum}}个</text>
											</u-form-item>
										</u-col>
									</u-row>
						
								</u--form>
						
							</view>
						
						</view>
						
						<!-- <view class="card" v-for="(item, index) in lstCustomer" :key="index">
							<view class="card-pa">
								<u-cell :title="item.name">
									
								</u-cell>
								<u-form-item label="系统编号">
									<text>{{item.reimburseNo}}</text>
									<u-radio :customStyle="{   
										position: 'absolute',
										right: '32px'
									}" :key="index" label="" :name="item.id" size="25" iconSize="20"> </u-radio>
								</u-form-item>
								<u-form-item label="客户归属">
									<text>{{item.responsiblePersonName}}</text>
								</u-form-item>

							</view>
						</view> -->
					</u-radio-group>
					<u-empty v-if="lstProductQuote.length==0 && isLoading" mode="data"
						icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
					<u-loadmore v-if="lstProductQuote.length>0" :status="status" :loading-text="loadingText"
						:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
				</scroll-view>
			</view>
			<!-- <u-loading-icon v-if="!isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon> -->

			<view class="foot-height">
				<view style="padding: 0 16px;">
					<u-form-item>
						<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="确认" @click="save"></u-button>
					</u-form-item>
				</view>
			</view>
		</u--form>

	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getproductQuoteList
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				radiovalue1: '',
				pageNo: 1,
				maxPage: 1,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isLoading: '', //加载中
				selectInfo: {
					name: '',
					listType: "0",
					status: "",
					startTime: "", //开始时间
					endTime: "", //结束时间
				},
				lstProductQuote: [],
				productQuoteName: '',
				productQuoteId: '', //系统编码
				returnPageNumber:1,
			}
		},
		onLoad(option) {
			console.log(option);
			this.radiovalue1 =option.productQuoteId || ""
			console.log(this.radiovalue1);
			this.getData()
		},
		methods: {
			// 组件触底事件
			scrollBottom() {
				console.log('到达底部了');
				if (this.pageNo >= this.maxPage) return;
				this.status = 'loading';
				this.pageNo = this.pageNo + 1;
				this.getData();
			},
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
			// 搜索
			searchChange() {
				this.pageNo = 1
				this.getData()
			},
			// 获取列表
			getData() {
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					"&name=" + this.selectInfo.name //报销单号
					+
					(isEmpty(this.selectInfo.listType)?'':"&listType=" + this.selectInfo.listType) //当sign为null时: 查询全部， 1时：我的报销单，2时： 下属报销单
					+
					(isEmpty(this.selectInfo.status)?'':"&status=" + this.selectInfo.status) //状态（1,2,3（待定））状态（1,2,3（待定））
					+
					(isEmpty(this.selectInfo.startTime)?'':"&startTime=" + this.selectInfo.startTime) //开始时间
					+
					(isEmpty(this.selectInfo.endTime)?'':"&endTime=" + this.selectInfo.endTime )//结束时间
				;
				getproductQuoteList(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.lstProductQuote = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.lstProductQuote = this.lstProductQuote.concat(res.result.records)
						}
						this.maxPage = isEmpty(res.result) ? this.maxPage : res.result.pages
						if (this.pageNo >= this.maxPage) this.status = 'nomore';
						else this.status = 'loading';
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			},
			leftClick() {
				uni.navigateBack();
			},

			groupChange(e) {
				// console.log(e);
				this.radiovalue1 = e
				const findResult = this.lstProductQuote.find((x) => x.id === e)
				if(!isEmpty(findResult)){
					this.productQuoteName = findResult.name
				}
			},
			save() {
				if(!isEmpty(this.radiovalue1)){
					let data={
						productQuoteName:this.productQuoteName,
						productQuoteId:this.radiovalue1
					}
					console.log(data)
					uni.$emit('returnProductQuote', data);
					uni.navigateBack({
						delta: this.returnPageNumber
					});
				}else{
					uni.$u.toast("请先选择报价");
				}
			}

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

		.card-pa {
			padding: 0 16px 16px;
			background: #fff;
			border-radius: 10px;

			// /deep/.u-line {
			// 	border: none !important;
			// }

			/deep/.u-cell__body {
				padding: 16px 0px 11px;

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
