<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-tabbar :value="tabbarNum" @change="change1" :safeAreaInsetBottom="false">
			<u-tabbar-item text="首页">
				<image class="u-page__item__slot-icon" slot="active-icon" src="/static/tabbar/icon_home1.png"></image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static//tabbar/icon_home.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="档案">
				<image class="u-page__item__slot-icon" slot="active-icon" src="/static/tabbar/icon_archives1.png">
				</image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static//tabbar/icon_archives.png">
				</image>
			</u-tabbar-item>
			<u-tabbar-item :text="tabbarName">
				<image class="u-page__item__slot-icon-logo" slot="active-icon" src="/static/tabbar/icon_workbench1.png">
				</image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static//tabbar/icon_workbench.png">
				</image>
			</u-tabbar-item>
			<!-- <u-tabbar-item text="消息" badge="5" badgeStyle="top: 6px;right:2px;"> -->
			<u-tabbar-item text="消息" badgeStyle="top: 6px;right:2px;">
				<image class="u-page__item__slot-icon" slot="active-icon" src="/static/tabbar/icon_news1.png"></image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static//tabbar/icon_news.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="我的">
				<image class="u-page__item__slot-icon" slot="active-icon" src="/static/tabbar/icon_my1.png"></image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static//tabbar/icon_my.png"></image>
			</u-tabbar-item>
		</u-tabbar>
		<view class="container-view">
			<view v-if="tabbarNum==0">
				<home></home>
				<!-- 首页 -->
			</view>
			<view v-if="tabbarNum==1">
				<assist></assist>
				<!-- 档案 -->
			</view>
			<view v-if="tabbarNum==2">
				<workbench></workbench>
				<!-- 工作台 -->
			</view>
			<view v-if="tabbarNum==3">
				<news></news>
				<!-- 消息 -->
			</view>
			<view v-if="tabbarNum==4">
				<personalCenter></personalCenter>
				<!-- 我的 -->
			</view>
			<u-modal :show="showMessage" @confirm="showMessage=false" :closeOnClickOverlay="true" title="系统提示"
				:content='contentMessage'></u-modal>
		</view>
	</view>
</template>

<script>
	import home from "../home/home.vue";
	import personalCenter from "../personalCenter/personalCenter.vue"
	import assist from "../assist/assist.vue"
	import workbench from '../workbench/workbench.vue'
	import news from '../news/news.vue'
	import {
		isEmpty,
		getQueryVariable,
		hidePageNavInWechatBrowser
	} from "@/util/common.js"
	import {
		OAuthCallback,
		oneclickLogin,
		getUserInfoByToken
	} from "@/util/interface.js"
	export default {
		components: {
			home, //这里是组件中name名称，在import引入的时候名称要一致
			personalCenter,
			assist,
			workbench,
			news
		},
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight, //状态栏高度
				tabbarNum: 0,
				show: true,
				invitation: {
					code: "",
					state: ""
				},
				tabbarName: "工作台",
				showMessage: false,
				contentMessage: "",
			}
		},
		onLoad(option) {
			this.tabbarNum=parseInt(option.istype) || 0;
			this.tabbarName=this.tabbarNum==2?'': '工作台'
			//this.change1(option.istype || 0)
			//this.getUserByToken();
			if (!isEmpty(this.$cache.get('_userInfo'))) {
				getApp().globalData.userInfo = this.$cache.get('_userInfo');
			} else {
				let that = this;
				if (!getApp().globalData.isApp) { //H5
					let paraString = window.location.href //还可以  window.location.search.substring()
					that.invitation.code = getQueryVariable(paraString, 'code')
					//"uhvcC6uu_MqUwd9mOX9xjKXpNEjHM3kIwaWRz4gRrKg"//getQueryVariable(paraString,'code') //code是url后面带的
					that.invitation.state = getQueryVariable(paraString, 'state')
					//"STATE"//getQueryVariable(paraString,'state') //code是url后面带的
					if (!isEmpty(that.invitation.code)) {
						OAuthCallback(that.invitation, res => {
							if (res.code == 200 && res.success) {
								that.$cache.set('_token', res.result.token) //1*60*60*24*7
								that.$cache.set('_userInfo', res.result.userInfo) //1*60*60*24*7
								getApp().globalData.userInfo = res.result.userInfo
							} else {
								that.showMessage = true;
								that.contentMessage = res.message
								//uni.$u.toast(res.message);
							}

						})
					}
				} else { //APP					
					uni.reLaunch({
						url: "/pages/login/login",
					})
				}
			}
		},
		onReady() {
			//微信浏览器环境下隐藏导航
			hidePageNavInWechatBrowser();
		},
		onShow() {
			// if(isEmpty(this.$cache.get('_token'))){
			// 	uni.reLaunch({
			// 		url:"/pages/login/login",
			// 	})
			// }
		},
		methods: {
			change1(name) {
				this.tabbarNum = name
				this.tabbarName = "工作台";
				if (name == 2) {
					this.tabbarName = "";
				}
			},
			getUserByToken() {
				let autelToken = uni.getStorageSync("_token");
				getUserInfoByToken('', res => {
					console.log(res)
					if (res.code == 200 && res.success) {
						// this.src=res.result;
						// this.captchaInfo.checkKey=checkKey
					} else {
						//uni.$u.toast(res.message);
					}

				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #E7F3FF;
	}

	/deep/.u-tabbar .u-tabbar__placeholder {
		height: 0;
		position: absolute;
	}

	.bg-img {
		position: absolute;
		display: flex;
		width: 100%;
		z-index: -1;
		overflow: hidden;
	}

	.container-view {
		z-index: 1;
	}

	.u-page__item__slot-icon {
		width: 24px;
		height: 24px;
	}

	.u-page__item__slot-icon-logo {
		width: 48px;
		height: 48px;
	}

	/deep/.u-tabbar-item__icon {
		.u-badge {
			right: 16px !important;
		}
	}

	/deep/.u-tabbar__content {
		background-color: #EDF1F7;
	}
</style>
