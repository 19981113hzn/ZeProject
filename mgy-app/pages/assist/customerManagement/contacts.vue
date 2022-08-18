<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="联系人" bgColor="#fff" :border="true" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<u-empty v-if="!contactsList.length" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<view class="main" v-else>
			<u-cell :label="item.phoneNumber" v-for="(item, index) in contactsList" :key="index"
				@click="detailContact(item.id)">
				<view slot="icon" class="logo-icon">
					<view class="logo-icon-txt">
						{{item.name}}
					</view>
				</view>
				<view slot="title" class="u-slot-title">
					<text class="u-cell-text">{{item.name}}</text>
					<u-tag v-if="item.isPrimary" text="首" bgColor="rgba(255, 248, 242, 1)"
						borderColor="rgba(255, 248, 242, 1)" color="rgba(255, 147, 48, 1)" size="mini"></u-tag>
				</view>
				<view slot="value" class="u-slot-value">
					<image class="logo-follow" src="/static/img/assist/contacts_follow_up.png"
						@click.stop="callMyInviter(item.phoneNumber)">
					</image>
					<image class="logo-phone" src="/static/img/assist/contacts_pople.png"
						@click.stop="phone(item.phoneNumber)"></image>
					<image class="logo" src="/static/img/assist/contacts_detail.png"
						@click.stop="detailContact(item.id)">
					</image>
				</view>

			</u-cell>
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
		getContactsList,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				id: '',
				contactsList: [],
				pageNo: 1,
				maxPage: 1,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
			}
		},
		onLoad(options) {
			this.id = options.id || '';
			this.customerName=options.customerName || '';
			this.getContacts();
		},
		onReachBottom() {
			if (this.pageNo >= this.maxPage) return;
			this.status = 'loading';
			this.pageNo += 1;
			this.getContacts();
		},
		onShow() {
			uni.$once('return', res => {
				if (res) {
					this.pageNo = 1;
					this.maxPage = 1;
					this.refresh();
				}
			})
		},
		methods: {
			refresh() {
				this.getContacts();
			},
			getContacts() {
				const data = "?customerId=" + this.id + "&pageSize=15&pageNo=" + this.pageNo;
				getContactsList(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.contactsList = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.contactsList = this.contactsList.concat(res.result.records)
						}
						this.maxPage = isEmpty(res.result) ? this.maxPage : res.result.pages
						if (this.pageNo >= this.maxPage) this.status = 'nomore';
						else this.status = 'loading';
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			clickScreen() {
				if (!this.firstTime) {
					this.firstTime = true;
					uni.setStorageSync('_lstScreen', this.lstScreen) //1*60*60*24*7
					uni.setStorageSync('OldLstScreen', this.lstScreen) //1*60*60*24*7
				}
				uni.navigateTo({
					url: "/pages/filter-all/filter-all?type=2"
				});
			},
			//返回上一级
			leftClick() {
				uni.navigateBack();
			},
			//右上角
			rightClick() {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/newContact?returnPageNumber=1&type=2&customerId="+this.id+"&customerName=" + this.customerName,
				})
				// uni.navigateTo({
				// 	url: "/pages/assist/customerManagement/newContact"
				// })
			},
			followContact() {

			},
			callMyInviter(phoneNumber) { //发短信

				var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);

				msg.to = [phoneNumber];

				msg.body = '';

				plus.messaging.sendMessage(msg);

			},
			// 拨打电话
			phone(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber
				}).catch((e) => {
					// console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
				})
			},
			//详情页
			detailContact(id) {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/contactsDetail?id=" + id
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.logo {
		width: 24px;
		height: 24px;
	}

	/deep/.main {
		background: #fff;

		.u-cell-text {
			font-size: 16px;
			font-weight: bold;
			color: rgba(48, 49, 51, 1);
			margin-left: 8px;
			float: left;
		}

		.u-cell__label {
			margin-left: 8px;
		}

		.u-fade-enter-active {
			display: block;
			margin-left: 14px;
			float: left;
		}

		.u-tag-wrapper {
			position: relative;
			text-align: center;

		}

		.logo-follow {
			width: 24px;
			height: 24px;
			right: 36px;
		}

		.logo-phone {
			width: 24px;
			height: 24px;
			right: 18px;
		}

		.logo-icon {
			background: rgba(0, 114, 255, 1);
			width: 46px;
			height: 46px;
			border-radius: 8px;

			.logo-icon-txt {
				font-size: 14px;
				text-align: center;
				border-radius: 5px;
				padding: 4px;
				color: #fff;
				line-height: 38px;
			}
		}
	}
</style>
