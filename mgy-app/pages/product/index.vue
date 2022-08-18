<template>

	<view class="content" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="产品列表" bgColor="#fff" @leftClick="leftClick" @rightClick="toChoose(prop)">
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
		</u-sticky>


		<view v-if="afterSelect" class="selected">
			<view class="cateInfo" v-for="(item,index) in selectListItem" :key="index" @click="toCategory">
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

		<!-- 产品列表 -->
		<view v-if="lstProduct.length > 0" class="card" v-for="(item, index) in lstProduct" :key="item.id">
			<view class="card-pa" @click="gotoProductDetail(item)">
				<view class="card_top">
					<view class="left_image">
						<image :src="getProductImage(item.imgUrl)"></image>
					</view>
					<view class="contentBox">
						<text>{{item.name}}</text>
						<text class="code">{{item.prodNo}}</text>
						<view class="product_info">
							<text class="price">¥{{item.price}}元/年</text>
							<image src="/static/img/icon_anniu (2).png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 分类列表 -->
		<!-- <view v-if="categoryList.length > 0" class="card" v-for="(item, index) in categoryList" :key="item.id">
			<view class="card-pa" @click="gotoProductDetail(item)">
				<view class="card_top">
					<view class="left_image">
						<image :src="getProductImage(item.imgUrl)"></image>
					</view>
					<view class="contentBox">
						<text>{{item.name}}</text>
						<text class="code">{{item.prodNo}}</text>
						<view class="product_info">
							<text class="price">¥{{item.price}}元/年</text>
							<image src="/static/img/icon_anniu (2).png"></image>
						</view>
					</view>
				</view>
			</view>
		</view> -->

		<u-empty v-if="lstProduct.length==0 && isLoading" mode="data"
			icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		<u-loadmore v-if="lstProduct.length>0" :status="status" :loading-text="loadingText"
			:loadmore-text="loadmoreText" :nomore-text="nomoreText" />
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
		getCategoryTreeList,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
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
				categoryList: [],
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

				}
			}
		},
		onLoad(option) {
			console.log(this.$cache.get('_userInfo'))
			console.log(this.$cache.get('_token'))
			this.getProduct()
			this.getCategory()
			this.getTopHeight();

			console.log(this.lstProduct);
			console.log(this.selectListItem)
		},
		onReachBottom() {
			// console.log(666);
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo = this.pageNo + 1;
			this.getProduct();
		},
		created() {
			uni.$on('selectSuccess', (data) => {
				console.log(data)
				this.id = data.id
				// console.log(this.id)
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
			}
		},
		methods: {
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
					url: `./productCategory?arr=${items}&prop=${JSON.stringify(prop)}`
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
					"&categoryId=" + this.selectInfo.categoryId //产品id
					+
					"&keyword=" + this.selectInfo.keyword //产品名称
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
						that.topheight = topPx / (uni.upx2px(topPx) /
							topPx) //px转rpx,这里必须转换为rpx,不然适配失败
					}
				})
			},

			toCategory() {
				// uni.navigateTo({
				// 	url: "./productCategory"
				// })
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


			// clickScreen(){
			// 	console.log('筛选')
			// 	if(!this.firstTime){
			// 		this.firstTime=true;
			// 		uni.setStorageSync('_lstScreen',this.lstScreen)//1*60*60*24*7
			// 		uni.setStorageSync('OldLstScreen',this.lstScreen)//1*60*60*24*7

			// 	}				
			// 	uni.navigateTo({
			// 		url:"/pages/filter-all/supplierSelect"
			// 	});
			// 	// uni.getLocation({
			// 	// 	type: 'gcj02', //返回可以用于uni.openLocation的经纬度
			// 	// 	success: function (res) {
			// 	// 		console.log('经纬度res',res)
			// 	// 		const latitude = res.latitude;
			// 	// 		const longitude = res.longitude;
			// 	// 		uni.openLocation({
			// 	// 			latitude: latitude,
			// 	// 			longitude: longitude,
			// 	// 			success: function () {
			// 	// 				console.log('success');
			// 	// 			}
			// 	// 		});
			// 	// 	}
			// 	// });
			// },
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

	// .selected {
	// padding: 8px 16px 8px 16px;
	// display: flex;
	// align-items: center;
	// background-color: #fff;

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
				align-items: center;

				.left_image {
					image {
						width: 90px;
						height: 90px;
					}
				}

				.contentBox {
					display: flex;
					flex: 1;
					flex-direction: column;
					justify-content: center;
					margin-left: 10px;

					.code {
						color: #909399;
						font-size: 12px;
						font-family: PingFang SC-Medium;
						padding: 5px 0;
					}

					.product_info {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.price {
							color: #0072FF;
							font-size: 15px;
							font-family: PingFang SC-Bold;
						}

						image {
							width: 24px;
							height: 24px;
						}
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


	// .content{
	// 	padding-bottom: 15px;
	// }
</style>
