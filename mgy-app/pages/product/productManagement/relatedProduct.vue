<template>

	<view class="content" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="isQuota? '产品报价':'关联产品'" bgColor="#fff" @leftClick="leftClick" @rightClick="toChoose(prop)">
			<view class="u-nav-slot" slot="right">
				<image v-if="afterSelect" class="logo" src="/static/img/icon_fllan.png"></image>
				<image v-else class="logo" src="/static/img/icon_fl.png"></image>
			</view>
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="产品名称或编号" bgColor="rgba(244, 246, 250, 1)"
					v-model="selectInfo.keyword" :clearabled="true" @change="searchChange"></u-search>
			</view>
			<view v-if="afterSelect" class="selected">
				<view class="cateInfo" v-for="(item,index) in selectListItem" :key="index">
					<!-- 路径： -->
					<view class="all">
						全部 &nbsp;
					</view>
					<view v-for="(row,k) in item.path" :key="k">
						＞ {{row.name}}
					</view>
					<view>
						＞ {{item.name}}
					</view>
				</view>
			</view>
		</u-sticky>



		<!-- 有数据时 -->
		<view v-if="lstProduct.length > 0">
			<scroll-view class="scrool-more" scroll-y="true"
				:style="{ 'top': afterSelect ? (statusBarHeight+80)  + 'px' : (statusBarHeight+48)  + 'px','bottom':'72px' }"
				@scrolltolower=scrollBottom>
				<u-checkbox-group class="checkbox" v-model="checkboxValue1" placement="column" @change="groupChange">
					<view class="card" v-for="(item, index) in lstProduct" :key="index">
						<view class="card-pa">
							<view class="card_top">
								<view class="left_image">
									<image :src="getProductImage(item.imgUrl)"></image>
								</view>
								<view class="contentBox">
									<view>{{item.name}}</view>
									<view class="code">{{item.prodNo}}</view>
									<view class="product_info">
										<text class="price">¥{{item.price}}</text>
										<text style="font-size: 12px;">元/年</text>
									</view>
								</view>
								<u-checkbox class="radio" shape="square" label="" :name="index" :key="index"
									iconSize="15" size="20">
								</u-checkbox>
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="selected_product">
							<view class="text">
								<text>已选择</text>
								<text style="color: #0072FF;">{{checkboxValue1.length}}</text>
								<text>个产品</text>
							</view>
							<u-button type="primary" size="small" @click='nextStep'>下一步</u-button>
						</view>
					</view>
				</u-checkbox-group>
				<u-empty v-if="lstProduct.length==0 && isLoading" mode="data"
					icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
				<!-- <u-loadmore v-if="lstProduct.length>0" :status="status" :loading-text="loadingText"
					:loadmore-text="loadmoreText" :nomore-text="nomoreText" /> -->
			</scroll-view>
		</view>


	</view>


</template>

<script>
	import {
		GetNowFormatDate
	} from "@/util/js_DateTime.js"
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getProductList,
		getDictItemsByCode,
		getUserListByUserId,
		getCategoryTreeList
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				isQuota: false,
				id: '',
				afterSelect: '',
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				selectListItem: [],
				cateListItem: [],
				prop: {
					label: 'name',
					children: 'children',
					multiple: false,
					checkStrictly: true
				},
				lstProduct: [],
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				pageNo: 1,
				maxPage: 1,
				firstTime: false, //第一次点击筛选
				isLoading: false, //加载中
				selectInfo: {
					categoryId: "", //产品分类id	
					keyword: "", //产品名称
					status: 1, //状态，1-上架 2-下架

				},
				checkboxValue1: [],
				// 传递回上一页的数据
				selectProducts: [],
				bizOpptyId:"",
				type:'add',//1添加，0编辑
			}
		},
		onLoad(option) {
			console.log(this.$cache.get('_userInfo'))
			console.log(this.$cache.get('_token'))
			this.getProduct()
			this.getCategory()
			this.getTopHeight();
			this.isAddOpp = option.isAddOpp || 0;
			this.bizOpptyId = option.bizOpptyId;
			this.type = option.type;
			console.log(this.lstProduct);
			console.log(this.selectListItem)
			this.isQuota = option.quota == 1;
			if (option.selectIndex) {

				this.checkboxValue1 = option.selectIndex
			}
		},
		// onReachBottom() {
		// 	// console.log(666);
		// 	if (this.pageNo >= this.maxPage) return;
		// 	this.status = 'loading';
		// 	this.pageNo = this.pageNo + 1;
		// 	this.getProduct();
		// },
		created() {
			uni.$on('selectSuccess', (data) => {
				console.log(data)
				this.id = data.id
				console.log(this.id)
				this.$set(this, 'selectListItem', [...data.list])
			})
		},
		onShow() {
			this.pageNo = 1;
			console.log(this.id);
			if (this.id) {
				this.afterSelect = true
				console.log(this.afterSelect);
				let catedata = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					"&categoryId=" + this.id //产品id
				getProductList(catedata, res => {
					if (res.code == 200 && res.success) {
						console.log(res)
						if (this.pageNo == 1) {
							this.lstProduct = res.result.records;

						} else {
							this.lstProduct = this.lstProduct.concat(res.result.records)
						}
						this.maxPage = res.result.pages
						console.log(this.maxPage);
						if (this.pageNo >= this.maxPage) this.status = 'nomore';
						else this.status = 'loading';
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			}
		},
		methods: {
			// 组件触底事件
			scrollBottom() {
				console.log('到达底部了');
				if (this.pageNo >= this.maxPage) return;
				this.status = 'loading';
				this.pageNo = this.pageNo + 1;
				this.getProduct();
			},
			nextStep() {
				console.log('this.isQuota:',this.isQuota)
				
				if (this.isQuota) { //跳转产品-确认报价
					uni.navigateTo({
						url: "/pages/workbench/operationManagement/opportunityManagement/confirmQuotation?bizOpptyId="+this.bizOpptyId+'&type='+this.type
					})
				} else {
					// 提交关联产品
					console.log('选择完毕');
					uni.navigateTo({
						url: '../../workbench/operationManagement/opportunityManagement/confirmQuotation?isAddOpp=' +this.isAddOpp +'&type='+this.type +"&returnNumber=2"
					})
				}
			},
			groupChange(e) {
				this.checkboxValue1 = e
				e.forEach(item => {
					let selectItem = this.lstProduct[item]
					this.selectProducts.push(selectItem)
				})
				uni.setStorageSync("select_list", this.selectProducts)
				this.$cache.set('_quotaProdList',this.selectProducts)
				// let isSelect = uni.getStorageSync("select_list")
				this.selectProducts = []
				console.log('groupChange', e);
			},

			// 分类树形列表
			getCategory() {
				let data = ""
				getCategoryTreeList(data, res => {
					if (res.code == 200 && res.success) {
						this.cateListItem = res.result
						uni.setStorageSync('_cateList', this.cateListItem)
						console.log(this.cateListItem)
					}
				})
			},
			toChoose(prop) {

				let items = encodeURIComponent(JSON.stringify(this.selectListItem));

				// let items = JSON.stringify(this.selectListItem);

				console.log(items)
				uni.navigateTo({
					url: `../productCategory?arr=${items}&prop=${JSON.stringify(prop)}`
				})
			},
			clear() {
				this.selectListItem = [];
			},
			// 获取产品列表数据
			getProduct() {
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					"&categoryId=" + this.selectInfo.categoryId //产品名称
					+
					"&keyword=" + this.selectInfo.keyword //产品编号
					+
					"&status=" + this.selectInfo.status //产品价格
				;
				// console.log('筛选条件', data)
				getProductList(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res)
						if (this.pageNo == 1) {
							this.lstProduct = res.result.records;
							// this.loadingText = ''

						} else {
							this.lstProduct = this.lstProduct.concat(res.result.records)
						}
						this.maxPage = res.result.pages
						console.log(this.maxPage);
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
				console.log('搜索')
				this.pageNo = 1
				this.getProduct();
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

			gotoProductDetail(item) {
				// uni.setStorageSync('feeDetails',item)
				console.log('点击卡片', item)
				uni.navigateTo({
					// url: "/pages/workbench/accountingManagement/costManagement/feeDetails"
					// url: "/pages/product/detail?id=" + item.id
					url: "/pages/product/detail?id=" + item.id
				})
			},

			// 无数据时跳转到详情页
			// toDetail() {
			// 	uni.navigateTo({
			// 		url: "./detail"
			// 	})
			// },




			toDetail() {
				uni.navigateTo({
					url: "./detail"
				})
			},


			getProductImage(url) {
				return url ? url.split(',')[0] : '/static/img/Frame 1556.png';
			},


			//返回上一级
			leftClick() {
				// uni.navigateTo({
				// 	url: "../main/main"
				// })
				uni.navigateBack({

				})
			},
		},
		// 按钮监听函数
		onNavigationBarButtonTap(e) { //不需要在<view>里面做任何操作，可直接引用

		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: rgba(242, 245, 249, 1);
		font-family: PingFang SC-Bold;
	}

	.sticky-title {
		height: 48px;
		background: #fff;
		border-top: 1px solid;
		border-top-color: rgba(0, 0, 0, 0);
		padding: 0 16px;

		// margin-bottom: 12px;
		/deep/.u-search {
			margin-top: 8px !important;
			width: 100%;
		}
	}

	// .selected {
	// 	padding: 8px 16px 8px 16px;
	// 	display: flex;
	// 	align-items: center;
	// 	background-color: #fff;
	// }

	/deep/ {
		.u-tabs__wrapper__nav__item {
			width: 50%;
		}

		.u-tabs__wrapper__nav {
			border-bottom: 1px solid;
			border-bottom-color: rgba(0, 0, 0, 0.05);
			background: #fff;
		}

		.u-button {
			width: 50%;
			float: left;
			border-radius: none !important;
		}

		.uni-button {
			border-radius: none !important;
		}
	}



	.cateInfo {
		padding: 8px 16px 8px 16px;
		display: flex;
		align-items: center;
		background-color: #fff;
		font-size: 12px;
	}

	// }

	.card {
		padding: 8px 16px 8px 16px;
		background-color: #fff;

		.card-pa {
			.card_top {
				display: flex;
				justify-content: center;
				// align-items: center;

				.left_image {
					image {
						width: 90px;
						height: 90px;
					}
				}

				.contentBox {
					// display: flex;
					flex: 1;
					// flex-direction: column;
					// align-items: center;
					// justify-content: center;
					margin-left: 10px;

					.code {
						color: #909399;
						font-size: 12px;
						font-family: PingFang SC-Medium;
						padding: 4px 0 26px 0;
					}

					.product_info {
						color: #0072FF;

						.price {
							font-size: 15px;
							font-family: PingFang SC-Bold;
						}

						image {
							width: 24px;
							height: 24px;
						}
					}
				}

				.checkbox {
					position: relative;

					.radio {
						position: absolute;
						right: 2px;
						top: 33px;
					}
				}
			}
		}
	}

	.logo {
		width: 24px;
		height: 24px;
	}

	.children {
		color: #BBB2B2;
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

	.bottom {
		width: 100%;
		position: fixed;
		bottom: 0;
		padding: 20px 15px;

		background-color: #fff;

		.selected_product {
			display: flex;
			justify-content: space-around;
			align-items: center;

			.text {
				font-size: 14px;
				color: #606266;
				padding-right: 85px;
			}

			/deep/ {
				.u-button {
					width: 30%;
					border-radius: 32px;
					padding: 18px 0;
					background-color: #0072FF;
				}
			}
		}


	}
</style>
