<template>
	<view>
		<u-navbar class="navbar" :title="detail.name" :border="true" safeAreaInsetTop fixed placeholder
			@leftClick="leftClick" @rightClick="rigthClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/assist/detail_more.png"></image>
			</view>
		</u-navbar>

		<view class="title">
			<u-cell :label="detail.customerName||'-'">
				<view slot="icon" class="logo-icon">
					<view class="logo-icon-txt">
						{{detail.name||'-'}}
					</view>
				</view>
				<view slot="title" class="u-slot-title">
					<text class="u-cell-text">{{detail.name||'-'}}</text>
					<u-tag v-if="getDictLabel(sys_customer_contact_role,detail.roleValue)"
						:text="getDictLabel(sys_customer_contact_role,detail.roleValue)"
						bgColor="rgba(235, 244, 255, 1)" borderColor="rgba(235, 244, 255, 1)"
						color="rgba(0, 114, 255, 1)" size="mini"></u-tag>
				</view>
			</u-cell>
			<u--form labelWidth="75">
				<u-form-item label="手机号码">
					<text>{{detail.phoneNumber||'-'}}</text>
				</u-form-item>
				<!-- <u-form-item label="下次跟进">
					<text>2019-04-01 17:27</text>
				</u-form-item> -->
			</u--form>
		</view>
		<view class="card-detail">
			<view class="card">
				<view class="card-pa">
					<u-cell title="基本信息"></u-cell>
					<u--form labelWidth="90">
						<u-form-item label="联系人姓名">
							<text>{{detail.name || '-'}}</text>
						</u-form-item>
						<u-form-item label="性别">
							<text>{{getDictLabel(sex,detail.sex) || '-'}}</text>
						</u-form-item>
						<u-form-item label="部门职务">
							<text>{{detail.position || '-'}}</text>
						</u-form-item>
						<u-form-item label="关联客户">
							<text>{{detail.customerName || '-'}}</text>
						</u-form-item>
						<u-form-item label="角色">
							<text>{{getDictLabel(sys_customer_contact_role,detail.roleValue) || '-'}}</text>
						</u-form-item>
						<u-form-item label="手机号码">
							<text>{{detail.phoneNumber || '-'}}</text>
						</u-form-item>
						<u-form-item label="电子邮箱">
							<text>{{detail.email || '-'}}</text>
						</u-form-item>
						<u-form-item label="所在地区">
							<text>{{detail.area || '-'}}</text>
						</u-form-item>
						<u-form-item label="详细地址" @click="gotoMap(detail.address)" class="remark-label">
							<text style="color:#2979ff">
								<u-icon name="map-fill" color="#2979ff" size="20" style="display: inline-block;"
									v-if="detail.address"></u-icon>
								{{detail.address || '-'}}
							</text>
						</u-form-item>
						<u-form-item label="备注信息" class="remark-label">
							<text class="remark-content">{{detail.remark || '-'}}</text>

						</u-form-item>
					</u--form>
				</view>
			</view>
			<view class="card">
				<view class="card-pa">
					<u-cell title="系统信息"></u-cell>
					<u--form labelWidth="90">
						<!-- <u-form-item label="系统编号">
							<text>LXR20190324010001</text>
						</u-form-item>
						<u-form-item label="负责人员">
							<text>赵小刚</text>
						</u-form-item> -->
						<u-form-item label="创建人员">
							<text>{{detail.createBy || '-'}}</text>

						</u-form-item>
						<!-- <u-form-item label="所属部门">
							<text>销售一部</text>
						</u-form-item>
						<u-form-item label="前归属人">
							<text>赵小刚</text>
						</u-form-item> -->
						<u-form-item label="创建时间">
							<text>{{detail.createTime || '-'}}</text>
						</u-form-item>
						<u-form-item label="更新时间">
							<text>{{detail.updateTime || '-'}}</text>
						</u-form-item>
						<u-form-item label="更新时间">
							<text>{{detail.updateTime||'-'}}</text>
						</u-form-item>
						<!-- <u-form-item label="最后跟进">
							<text>2019-03-15 17:27</text>
						</u-form-item>
						<u-form-item label="下次跟进">
							<text>2019-03-15 17:27</text>
						</u-form-item>
						<u-form-item label="最后联系">
							<text>2019-03-15 17:27</text>
						</u-form-item> -->
					</u--form>
				</view>
			</view>
			<view class="card"></view>
		</view>
		<u-tabbar :value="numTabbar" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true"
			@change="changeTabbar">

			<u-tabbar-item text="写新跟进">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/detail_follow_up.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="拨打电话">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/detail_telephone.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="发送短信">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/contacts_sendSMS.png"></image>
			</u-tabbar-item>
		</u-tabbar>
		<u-action-sheet title="更多" :show="showAction" :closeOnClickOverlay="true" :round="24" @close="showAction=false">
			<u-grid :border="false" col="5" @click="clickGrid">
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_user.png"></image>
					</view>
					<text class="grid-text">新增联系人</text>
				</u-grid-item>
				<!-- <u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_add_related.png"></image>
					</view>
					<text class="grid-text">添加相关</text>
				</u-grid-item> -->
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_map.png"></image>
					</view>
					<text class="grid-text">地图导航</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_edit.png"></image>
					</view>
					<text class="grid-text">编辑联系人</text>
				</u-grid-item>

				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_delete.png"></image>
					</view>
					<text class="grid-text">删除联系人</text>
				</u-grid-item>
			</u-grid>
		</u-action-sheet>

		<u-modal :show="showDelete" title="删除确认" content='确定要删除该联系人吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
	</view>
</template>

<script>
	import {
		getContactDetail,
		deleteContact
	} from "@/util/interface.js"
	import {
		toMap
	} from "@/util/map.js"
	export default {
		data() {
			return {
				id: '',
				detail: {},
				numTabbar: "",
				showAction: false,
				sex: [],
				sys_customer_contact_role: [],
				showDelete: false
			}
		},
		onLoad(options) {
			this.sex = getApp().globalData.sex; //性别
			this.sys_customer_contact_role = getApp().globalData.sys_customer_contact_role; //客户状态
			this.id = options.id || ''
			this.getDetail()
		},
		onShow() {
			uni.$once('return', res => {
				if (res) {
					this.getDetail();
				}
			})
		},
		methods: {
			gotoMap() {
				const address = this.detail.area + this.detail.address;
				console.log('address:', address);
				if (!address || [undefined, null, 'undefined', 'null'].includes(address)) {
					return
				}
				toMap(address);
			},
			getDetail() {
				const data = "?id=" + this.id;
				getContactDetail(data, res => {
					if (res.code == 200 && res.success) {
						this.detail = res.result;
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//返回上一级
			leftClick() {
				uni.navigateBack();
			},
			//右上角
			rigthClick() {
				if (this.showAction) {
					this.showAction = false
				} else {
					this.showAction = true
				}
			},
			//更多==》点击选择
			clickGrid(name) {
				this.showAction = false;
				switch (name) {
					case 0: //新增联系人
						uni.navigateTo({
							url: "/pages/assist/customerManagement/newContact?returnPageNumber=2&type=2&customerId=" +
								this.detail.customerId + "&customerName=" + this.detail.customerName,
						})
						break;
					case 1: //地图导航
						// uni.navigateTo({
						// 	url: "/pages/map/index"
						// })
						const address = this.detail.area + this.detail.address;
						console.log('address:', address);
						if (!address || [undefined, null, 'undefined', 'null'].includes(address)) {
							uni.$u.toast('没有该联系人的地址信息');
							return
						}
						toMap(address);
						break;
					case 2: //编辑联系人
						uni.navigateTo({
							url: "/pages/assist/customerManagement/newContact?returnPageNumber=1&type=2&isupdata=true&id=" +
								this.id,
						})
						break;
					case 3: //删除客户
						this.showDelete = true;
						break;
					default:
						break;
				}
			},
			// 拨打电话
			phone() {
				uni.makePhoneCall({
					phoneNumber: this.detail.phoneNumber
				}).catch((e) => {
					// console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
				})
			},
			callMyInviter() { //发短信

				var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);

				msg.to = [this.detail.phoneNumber];

				msg.body = '';

				plus.messaging.sendMessage(msg);

			},
			//底部按钮
			changeTabbar(name) {
				if (name == 0) { //写新跟进
					const params = {
						id: this.detail.customerId,
						name: this.detail.customerName
					}
					uni.navigateTo({
						url: "/pages/assist/customerManagement/newFollowUp?type=add&needJump=" + true +
							"&params=" +
							JSON.stringify(
								params)
					})
				}
				if (name == 1) { //拨打电话
					this.phone();
				}
				if (name == 2) { //发送短信
					this.callMyInviter();
				}
			},
			getDictLabel(dict, value) {
				if (!dict || !value) return '';
				const find = dict.find((fi) => fi.value == value);
				return find ? find.label : '';
			},
			confirmDelete() {
				const data = '?id=' + this.detail.id;
				deleteContact(data, res => {
					if (res.code == 200 && res.success) {
						uni.$u.toast("删除成功");
						setTimeout(() => {
							uni.navigateBack();
						}, 1000)
					} else {
						uni.$u.toast(res.message);
					}
				})
			}

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

	/deep/.title {
		background: #fff;
		padding: 8px 16px 16px;

		.u-line {
			border: none !important;
		}

		.u-cell__body {
			padding: 10px 0px 0px;
		}

		.u-cell-text {
			font-size: 18px;
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

		.u-form-item__body {
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
	}

	.card-detail {
		.card {
			padding: 8px 0 0;

			.card-pa {
				padding: 0 16px 16px;
				background: #fff;

				//border-radius: 10px;
				/deep/.u-cell__body {
					padding: 10px 0 0;

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

				/deep/.u-line {
					border: none !important;
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
			}

		}
	}

	/deep/ {
		.u-page__item__slot-icon {
			width: 24px;
			height: 24px;
		}

		.u-tabbar-item__text {
			font-size: 12px;

			span {
				//color: rgba(0, 85, 255, 0.8);
			}
		}
	}

	/deep/ {
		.grid-img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			background: rgba(247, 248, 250, 1);

			.logo {
				width: 24px;
				height: 24px;
				top: 13px;
			}
		}

		.u-grid {
			padding: 16px 16px 32px;
		}

		.grid-text {
			font-size: 12px;
			color: rgba(0, 0, 0, 0.65);
			padding: 20rpx 0 20rpx 0rpx;
			/* #ifndef APP-PLUS */
			box-sizing: border-box;
			/* #endif */
		}
	}

	.remark-label {
		/deep/.u-form-item__body__left {
			align-items: flex-start;
		}
	}

	.remark-content {
		word-break: break-all;
	}
</style>
