<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="添加协作" bgColor="#fff" @leftClick="leftClick">
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="人员名称" bgColor="rgba(244, 246, 250, 1)" v-model="searchValue"
					:clearabled="true" @change="searchChange"></u-search>
			</view>
		</u-sticky>
		<view style="flex: auto; height:auto!important;padding: 16px 16px 0;">
			<scroll-view class="scrool-more" :style="{'top': (statusBarHeight+70) +'px','bottom':'104px' }"
				scroll-y="true" :scroll-top="scrollTop" @scroll="scroll" scroll-with-animation="true">

				<view class="filter-content" v-for="(item,index) in lstUser" :key="index">
					<view style="padding: 0 5px;">
						<text class='filter-content-detail-item-default' :style="{'background-color':item.isSelected?'rgba(0, 114, 255, 0.05)':'rgba(247, 249, 252, 1)',
						'color':item.isSelected?'rgba(0, 114, 255, 1)':'rgba(48, 49, 51, 1)',
						'border-color':item.isSelected?'rgb(0, 114, 255)':'none',
						'border': item.isSelected?'1px solid':'none'}" @click="selectItem(index)">
							{{item.name}}
						</text>
					</view>
				</view>
				<u-empty v-if="lstUser.length==0" mode="data"
					icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
			</scroll-view>
		</view>
		<view class="foot-height">
			<view class="select-text">
				<view class="content" v-for="(item,index) in seeLst" :key="index">
					<view style="padding: 0 5px;">
						<text class='content-detail-item-default' :style="{'background-color':'rgba(247, 249, 252, 1)',
						'color':'rgba(48, 49, 51, 1)',
						'border-color':'none',
						'border':'none'}">
							{{item.name}}
						</text>
					</view>
				</view>
				<view class="content" v-if="selectLst.length>3">
					<view style="padding: 0 5px;">
						<text class='content-detail-item-default' :style="{'background-color':'rgba(247, 249, 252, 1)',
						'color':'rgba(48, 49, 51, 1)',
						'border-color':'none',
						'border':'none'}">
							......
						</text>
					</view>
				</view>
				<text class="select-txt">已选 <span style="color: rgba(0, 114, 255, 1);">{{selectLst.length}}</span>
					人</text>
			</view>
			<view style="padding:12px 16px 16px">
				<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="confirmSelect"></u-button>
			</view>
		</view>
		<movable-area class="movableArea" :style="{ 'top': (statusBarHeight+76) + 'px','bottom':'104px' }">
			<movable-view class="movableView" direction="all" x="620rpx" y="800rpx">
				<image class="to-head" src="/static/img/workbench/icon_tohead.png" mode="widthFix" @click="backtop">
				</image>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getUserListByUserId,
		getUserListByName,
		getCooperationList,
		addCooperation,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				old: { //之前的滚动条距离顶部的距离
					scrollTop: 0,
				},
				searchValue: "",
				lstUser: [],
				lstOldUser: [],
				lstSelectUser: [],
				selectLst: [],
				seeLst: [], //显示的数据
				total: 0,
				isMutiple: false,
				type: '', //区分要使用哪个查询用户的接口，默认getUserListByUserId，转移客户选择时需要用到
				needFilter: false,
				isLoading:false,
				bizOpptyId:"",
			}
		},
		onLoad(option) {
			console.log('option参数', option)
			this.bizOpptyId = option.id;
			let total = isEmpty(option.total) ? 1000 : option.total;
			this.total = total;
			//this.lstSelectUser = uni.getStorageSync("lstSelectUser")
			if (option.type) this.type = option.type;
			if (option.needFilter) this.needFilter = option.needFilter;
			this.getData();
			
			this.getTopHeight();
		},
		onUnload() {

		},
		methods: {
			//返回上一级
			leftClick() {
				uni.$emit('resultSelectUser', false);
				uni.navigateBack();
			},
			getData(){
				getCooperationList("?bizOpptyId="+this.bizOpptyId,res=>{
					if (res.code == 200 && res.success) {
						this.lstSelectUser =[];
						for(let i=0;i< res.result.length;i++){
							this.lstSelectUser.push({
								id: res.result[i].cooperationUserId,
								isSelected: true,
								name: res.result[i].cooperationUserName,
								value: res.result[i].cooperationUserId,
							})
						}
						this.getUserList();
					} else {
						uni.$u.toast(res.message);
					}
				})
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
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop; // 吧滚动条的高度事实给到old.scrollTop 
			},
			//负责人员
			getUserList() {
				this.isLoading=true;
				this.type === 'responsible' ? this.getResponsible() : this.getAll();
			},
			// 查询所有
			getAll() {
				let data = "?realname=" + "" +
					"&pageNo=" + "1" +
					"&pageSize=" + this.total;
				getUserListByUserId(data, res => {
					this.dataDeal(res)
				})
			},
			// 查询负责部门下的人
			getResponsible() {
				getUserListByName('', res => {
					const userInfo = uni.getStorageSync('_userInfo').data;
					// 转移客户的时候需要过滤掉自己
					const records = this.needFilter ? res.result.records.filter(fi => fi.id != userInfo.id) : res.result.records;
					res.result.records = records;
					this.dataDeal(res);
				})
			},
			dataDeal(res) {
				if (res.code == 200 && res.success) {
					let lst = [];
					for (let j = 0; j < res.result.records.length; j++) {
						let isSelected = false;
						for (let i = 0; i < this.lstSelectUser.length; i++) {
							if ((this.lstSelectUser[i].value == res.result.records[j].id) &&
								this.lstSelectUser[i].isSelected) {
								isSelected = true;
								let arr = {
									name: res.result.records[j].realname,
									value: res.result.records[j].id,
									id: res.result.records[j].id,
									isSelected: isSelected
								}
								this.selectLst.push(arr)
								if (this.selectLst.length < 4) {
									this.seeLst.push(arr)
								}
							}
						}
						lst.push({
							name: res.result.records[j].realname,
							value: res.result.records[j].id,
							id: res.result.records[j].id,
							isSelected: isSelected
						})
					}
					this.lstUser = lst;
					this.lstOldUser = this.lstUser
				} else {
					uni.$u.toast(res.message);
				}
				this.isLoading=false;
			},
			//选择按钮
			selectItem(index) {
				let value = this.lstUser[index].value;
				if (this.lstUser[index].isSelected) {
					this.lstUser[index].isSelected = false;
					for (let i = 0; i < this.selectLst.length; i++) {
						if (this.selectLst[i].value == value) {
							if (i < 3) {
								this.seeLst.splice(i, 1);
								if (this.selectLst.length > 3) {
									this.seeLst.push(this.selectLst[3])
								}
							}
							this.selectLst.splice(i, 1);
							return;
						}
					}
				} else {
					this.lstUser[index].isSelected = true;
					this.selectLst.push(this.lstUser[index])
					if (this.selectLst.length < 4) {
						this.seeLst.push(this.lstUser[index])
					}
					//this.lstScreen[index].defaultSelectedIndex.push(value);
				}
				// console.log(this.selectLst)
				

			},
			//回到顶部
			backtop() {
				console.log("回到顶部")
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});

			},
			//确认按钮
			confirmSelect() {
				
				console.log(this.selectLst)
				let SelectedIndex = "";
				for (let k = 0; k < this.selectLst.length; k++) {
					SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + this.selectLst[k].id
				}
				let data={
					bizOpptyId:this.bizOpptyId,
					cooperationUserId:SelectedIndex
				}
				console.log(data)
				addCooperation(data,res=>{
					if (res.code == 200 && res.success) {
						uni.$emit('return', true);
						uni.showToast({
							title: '添加成功'
						});
						setTimeout(() => {
							uni.navigateBack()
						}, 800)
					} else {
						uni.$u.toast(res.message);
					}
				})
				
				// uni.setStorageSync('lstSelectUser', this.selectLst) //1*60*60*24*7
				// uni.$emit('resultSelectUser', true);
				//uni.navigateBack();
			},
			//根据名称进行模糊搜索
			searchChange() {
				let arr = []
				let filters = this.lstOldUser.filter(item => item.name.indexOf(this.searchValue) > -1)
				this.lstUser = filters;
				//console.log(filters)
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
		padding: 12px 16px 0;
	}

	.select-text {
		height: 25px;
		padding: 10px 0px 0 10px;

		.content-detail-item-default {
			background-color: #FFFFFF;
			color: #666666;
			//padding: 5px 15px;
			border-radius: 20px;
			// margin-right: 2%;
			margin-bottom: 10px;
			display: inline-block;
			font-size: 14px;
			line-height: 22px;
			padding: 0 5px;
			text-align: center;
			width: 100%;
		}

		.content {
			margin-right: 10px;
			display: inline-block;
		}

		.select-txt {
			width: 80px;
			float: right;
		}
	}

	.filter-content-detail-item-default {
		background-color: #FFFFFF;
		color: #666666;
		//padding: 5px 15px;
		border-radius: 20px;
		// margin-right: 2%;
		margin-bottom: 10px;
		display: inline-block;
		font-size: 14px;
		line-height: 35px;
		text-align: center;
		width: 100%;
	}

	.filter-content {
		width: 33.33%;
		display: inline-block;
	}


	.scrool-more {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: #fff;
		padding: 16px 16px 0;
		width: unset;
	}

	.foot-height {
		position: absolute;
		bottom: 0px;
		width: 100%;
		height: 104px;
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

	.movableArea {
		position: fixed;
		top: 0px;
		bottom: 64px;
		left: 0;
		width: 100%;
		height: 70%;
		pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素

		.movableView {
			pointer-events: auto; //可以点击
			width: 96rpx;
			height: 96rpx;
			border-radius: 50%;

			.to-head {
				width: 48px;
				height: 48px;
			}
		}
	}
</style>
