<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="navbarName" bgColor="#fff" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="搜索" bgColor="rgba(244, 246, 250, 1)" :clearabled="true"
					v-model="selectInfo.customerName" @change="searchChange"></u-search>
			</view>
		</u-sticky>
		<view class="card" v-for="(item, index) in listSumCompany" :key="index">
			<view class="card-pa" @click="gotoRiseDetail(item)">
				<u-cell :title="item.customerName || '---'">
				</u-cell>
				<u--form labelWidth="42">
					<u-form-item label="类型">
						<text>{{item.type_dictText || '---'}}</text>
					</u-form-item>
					<u-form-item label="纳税人识别号" labelWidth="100">
						<text>{{item.taxpayerNumber || '---'}}</text>
					</u-form-item>
				</u--form>
			</view>
		</view>
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<u-empty v-if="listSumCompany.length==0 && isLoading" mode="data"
			icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		<u-loadmore v-if="listSumCompany.length>0" :status="status" :loading-text="loadingText"
			:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" />
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getListSumCompany,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				navbarName: "我的抬头",
				listSumCompany: [],
				pageNo: 1,
				maxPage: 1,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				isLoading: false, //加载中
				selectInfo: {
					customerName: '',
					applyMan: '',
					sign: "0",
					status: "",
				}

			}
		},
		created() {
			console.log('初始化');
			this.getsumCompanyData();
		},
		scrollBottom() {
			console.log("onReachBottom");
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getsumCompanyData();
		},
		methods: {
			//刷新页面
			refresh() {
				uni.redirectTo({
					url: '/pages/workbench/accountingManagement/invoiceManagement/invoiceManagement'
				});
			},
			getsumCompanyData() {
				console.log('getListSumCompany');
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					"&customerName=" + this.selectInfo.customerName //企业名称
				;
				getListSumCompany(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.listSumCompany = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.listSumCompany = this.listSumCompany.concat(res.result.records)
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
			//搜索
			searchChange() {
				this.pageNo = 1
				this.getsumCompanyData();
			},
			//跳转详情
			gotoRiseDetail(item) {
				console.log(123456, item);
				uni.setStorageSync('riseDetails', item)
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/invoiceManagement/myRise/riseDetail"
				})
			},
			leftClick() {
				uni.navigateBack();
			},
			//新建/编辑抬头
			rightClick() {
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/invoiceManagement/myRise/addRise?returnPageNumber=1"
				})
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #F2F5F9 !important;
	}

	.sticky-title {
		height: 48px;
		background: #fff;
		border-top: 1px solid;
		border-top-color: rgba(0, 0, 0, 0.05);
		padding: 0 16px;

		/deep/.u-search {
			margin-top: 8px !important;
			width: 100%;
		}
	}

	.u-nav-slot {
		padding: 10px 3px 10px 0;

		.logo {
			width: 24px;
			height: 24px;
		}

	}

	/deep/.u-navbar__content .u-navbar__content__title {
		color: #000 !important;
	}

	.card {
		padding: 8px 16px 0 16px;
		.card-pa {
			padding: 0 16px 16px;
			background: #fff;
			border-radius: 10px;

			/deep/.u-cell__body {
				padding: 10px 0px;

				.u-cell__title-text {
					font-size: 16px;
					font-weight: bold;
					color: rgba(48, 49, 51, 1);
				}

				.logo {
					width: 24px;
					height: 24px;
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
