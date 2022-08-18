<!--
 * @Author: wush wush@example.com
 * @Date: 2022-07-11 15:23:19
 * @LastEditors: wush wush@example.com
 * @LastEditTime: 2022-07-14 17:57:28
 * @FilePath: \mgy-app\pages\news\news.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<view>
		<u-navbar leftIcon="" title="消息" :border="true" bgColor="#fff"></u-navbar>
		<view class="main-top">
			<u-cell-group class="sign-out" :border="false">
				<u-cell title="待办事项" isLink size="large" @click="toBeDealWith1()">
					<image class="logo" slot="icon" src="/static/img/news/icon_news_dealt.png"></image>
					<text v-if="unDoNum > 0" slot="value" class="u-slot-value">{{unDoNum > 99 ? '99+':unDoNum}}</text>
				</u-cell>
			</u-cell-group>
			<u-cell-group class="sign-out" :border="false">
				<u-cell title="待阅消息" isLink size="large" @click="toBeRead1()">
					<image class="logo" slot="icon" src="/static/img/news/icon_news_read.png"></image>
					<text v-if="unReadNumm > 0" slot="value" class="u-slot-value-spot"></text>
				</u-cell>
			</u-cell-group>
			<u-cell-group class="sign-out" :border="false">
				<u-cell title="系统消息" isLink size="large" @click="toSysNew()">
					<image class="logo" slot="icon" src="/static/img/news/icon_news_sys.png"></image>
					<text v-if="msgUnReadNum > 0" slot="value" class="u-slot-value-spot"></text>
				</u-cell>
			</u-cell-group>
			<!-- <u-cell-group class="sign-out" :border="false">
				<u-cell title="已阅消息" isLink size="large" @click="toBeRead2()">
					<image class="logo" slot="icon" src="/static/img/news/icon_nor.png"></image>
				</u-cell>
			</u-cell-group>
			<u-cell-group class="sign-out" :border="false">
				<u-cell title="已办消息" isLink size="large" @click="toBeDealWith2()">
					<image class="logo" slot="icon" src="/static/img/news/icon_nor.png"></image>
				</u-cell>
			</u-cell-group> -->
		</view>
	</view>
</template>

<script>
	import {getUndoMsgNum} from "@/util/interface.js"
	export default {
		data() {
			return {
				msgUnReadNum: 0,
				unDoNum: 0,
				unReadNumm: 0,
			}
		},
		created(){
			this.getData();
		},
		methods: {
			getData(){
				let userInfo= this.$cache.get('_userInfo');
				getUndoMsgNum(userInfo.id,res=>{
					if (res.code == 200 && res.success) {
						this.msgUnReadNum=res.result.msgUnReadNum;
						this.unDoNum=res.result.unDoNum;
						this.unReadNumm=res.result.unReadNumm;
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			toBeDealWith1() {
				uni.navigateTo({
					url: "../workbench/processCenter/needToBeDealtWith?type=1"
				})
			},
			toBeRead1() {
				uni.navigateTo({
					url: "../workbench/processCenter/toBeRead?type=1"
				})
			},
			toBeRead2() {
				uni.navigateTo({
					url: "../workbench/processCenter/toBeRead?type=2"
				})
			},
			toBeDealWith2() {
				uni.navigateTo({
					url: "../workbench/processCenter/needToBeDealtWith?type=2"
				})
			},
			toSysNew(){
				uni.navigateTo({
					url: "/pages/news/sysNews"
				})
			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1) !important;
	}
	.main-top {
		margin: 58px auto 0 auto;
	}

	/deep/.sign-out {
		margin-top: 20rpx;
		background: #fff;

		.u-line {
			border: none !important;
		}

		.logo {
			width: 18px;
			height: 18px;
		}

		.u-slot-value {
			line-height: 17px;
			text-align: center;
			font-size: 10px;
			padding: 0 5px;
			height: 17px;
			color: #FFFFFF;
			border-radius: 100px;
			background-color: rgba(255, 77, 79, 1);
		}

		.u-slot-value-spot {
			background-color: rgba(255, 77, 79, 1);
			border-radius: 50%;
			width: 6px;
			height: 6px;
			line-height: 17px;
			// padding: 0 5px;
			// margin-top: 12px;
			// margin-right: 4px;
			display: block;
		}
	}
</style>
