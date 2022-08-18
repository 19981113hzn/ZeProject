<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="选择费用" bgColor="#fff" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-checkbox-group v-model="checkValue" placement="column" @change="checkboxChange">
					<u-checkbox labelSize="16" iconSize="16" labelColor="rgba(51, 51, 51, 1)" label="全选" name="1">
					</u-checkbox>
				</u-checkbox-group>
				<text class="sticky-txt" @click="clickScreen">已选<span
						style="color: rgba(58, 125, 255, 1);">{{checkboxValue.length}}</span>条</text>
				<u-search :show-action="false" placeholder="项目名称" bgColor="rgba(244, 246, 250, 1)" v-model="searchValue"
					:clearabled="true" @change="searchChange"></u-search>
			</view>
		</u-sticky>
		<u-checkbox-group v-model="checkboxValue" placement="column" @change="checkboxChange1">

			<view class="card" v-for="(item, index) in lstCostManage" :key="index">

				<view class="card-pa">
					<u-cell :title="item.expenseName">
						<u-checkbox slot="icon" :key="index" label="" :name="index">
						</u-checkbox>
					</u-cell>
					<u--form labelWidth="75">
						<u-form-item label="负责人员">
							<text>{{item.chargeName}}</text>
						</u-form-item>
						<u-form-item label="项目名称">
							<text>{{item.projectName}}</text>
						</u-form-item>
						<u-form-item label="费用金额">
							<text>￥{{item.amounts}}</text>
						</u-form-item>
						<u-form-item label="发生时间">
							<text>{{item.happenTime}}</text>
						</u-form-item>

					</u--form>

				</view>

			</view>
		</u-checkbox-group>
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<u-loadmore v-if="lstCostManage.length>0" :status="status" :loading-text="loadingText"
			:loadmore-text="loadmoreText" :nomore-text="nomoreText" />

		<u-tabbar>
			<u-tabbar-item class="tab-reset" text="取消" @click="clickReset">
				<text></text>
			</u-tabbar-item>
			<u-tabbar-item class="tab-confirm" text="确认" @click="clickConfirm"></u-tabbar-item>
		</u-tabbar>

	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getListCostManage,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				searchValue: "",
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				pageNo: 1,
				maxPage: 1,
				lstCostManage: [],
				checkValue: [],
				checkboxValue: [],
				lstCheck: [],
				isLoading: false,
			}
		},
		onLoad() {
			let lstCheckCost = uni.getStorageSync("lstCheck")
			this.lstCheck = lstCheckCost;
			this.getTopHeight();
			this.getCostManage()
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getCostManage();
		},
		onShow() {
			uni.$once('return', res => {
				if (res) {
					this.pageNo = 1
					this.getCostManage();
				}
			})
		},
		methods: {
			getCostManage() {
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					"&projectName=" + this.searchValue //项目名称
					+
					"&sign=1" //当sign为null时: 查询全部， 1时：我的费用，2时： 下属费用
					+
					"&status=1";
				getListCostManage(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.lstCostManage = res.result.records;
						} else {
							this.lstCostManage = this.lstCostManage.concat(res.result.records)
						}
						this.checkboxValue = [];
						for (let i = 0; i < this.lstCheck.length; i++) {
							let id = this.lstCheck[i].id;
							for (let j = 0; j < this.lstCostManage.length; j++) {
								if (id == this.lstCostManage[j].id) {
									this.checkboxValue.push(j);
									break;
								}
							}
						}
						if (this.checkboxValue.length == this.lstCostManage.length) {
							this.checkValue = ["1"]
						} else {
							this.checkValue = []
						}
						this.maxPage = res.result.pages
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
				this.getCostManage();
			},
			checkboxChange(n) {
				this.checkValue = n
				this.lstCheck = [];
				if (isEmpty(this.checkValue)) { //取消全选
					this.checkboxValue = [];
				} else {
					for (let i = 0; i < this.lstCostManage.length; i++) {
						this.checkboxValue.push(i)
						this.lstCheck.push(this.lstCostManage[i])
					}
				}
				console.log(this.lstCheck)
				//console.log('change1', n);
			},
			checkboxChange1(n) {
				this.checkboxValue = n;
				this.lstCheck = [];
				for (let i in n) {
					this.lstCheck.push(this.lstCostManage[n[i]])
				}
				if (this.checkboxValue.length == this.lstCostManage.length) {
					this.checkValue = ["1"]
				} else {
					this.checkValue = []
				}
				console.log(this.lstCheck)
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
			//返回上一级
			leftClick() {
				uni.navigateBack();
			},
			//新建费用单
			rightClick() {
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/costManagement/addCost?returnPageNumber=1"
				})
			},
			//确认按钮
			clickConfirm() {
				uni.setStorageSync('lstCheck', this.lstCheck) //1*60*60*24*7
				uni.$emit('resultCheckCost', true);
				uni.navigateBack();
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
			width: 60%;
			float: right;
		}

		.sticky-txt {
			font-size: 16px;
			color: rgba(51, 51, 51, 1);
			line-height: 48px;
		}

		.u-checkbox-group--column {
			display: inline-block;
			flex-direction: row;
			width: 64px;
		}
	}

	/deep/ {
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

		.u-tabbar-item__text {
			font-size: 18px;
		}

		.u-tabbar__placeholder {
			height: 60px !important;
		}

		.u-tabbar__content__item-wrapper {
			height: 40px;
			padding: 3px 16px 16px;
		}

		.tab-confirm {

			// background: #2979ff;
			// border-radius: 32px;
			.u-tabbar-item__text span {
				color: #fff;
				font-size: 17px;
			}

			.u-tabbar-item__text {
				background: #2979ff;
				width: 95%;
				text-align: center;
				height: 40px;
				line-height: 40px;
				border-radius: 24px;
				margin-left: 5px;
			}
		}

		.tab-reset {

			// background: rgba(247, 249, 252, 1);
			// border-radius: 32px;
			span {
				font-size: 17px;
				color: rgba(0, 85, 255, 0.8);
			}

			.u-tabbar-item__text {
				background: rgba(247, 249, 252, 1);
				width: 95%;
				text-align: center;
				height: 40px;
				line-height: 40px;
				border-radius: 24px;
				margin-right: 5px;
			}
		}

		.u-border-top {
			border: none !important;
			height: 60px;
		}
	}



	.u-loading-icon {
		margin-top: 30px;
	}

	.logo {
		width: 24px;
		height: 24px;
	}
</style>
