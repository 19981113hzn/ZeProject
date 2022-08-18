<template>
	<view>
		<u--form :model="itemInfo" ref="form1" labelPosition="left" labelWidth="80">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': '0px','bottom':'72px' }" scroll-y="true"
					:scroll-top="scrollTop" scroll-with-animation="true">

					<view class="top-height">
						<u-form-item label="接收对象" prop="projectName" :required="true" ref="item1">
							<view class="top-user" @click="toSelectUser">
								<image class="user-head" src="/static/img/workbench/icon_user_head.png"></image>
								<text class="user-name">{{selectUserName||'请选择'}}</text>

							</view>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<!-- 暂时不做 -->
					<!-- <text class="title-name">转移相关</text>
					<view class="top-height top-bg">
						 <u-checkbox-group
							v-model="checkboxValue1"
							@change="checkboxChange"
							placement="column"
							iconPlacement="right"
						>
						<u-cell :title="item.name" v-for="(item, index) in checkboxList1" :key="index">
							<u-checkbox
								slot="value"
								:key="index"
								label=""
								:name="index"
							>
							</u-checkbox>
						</u-cell>
							</u-checkbox>
						</u-checkbox-group>
					</view>
					<text class="title-name">如需变更客户相关记录归属人员请勾选相关选项</text> -->
					<!-- <view class="top-height">
						<u-form-item label="备注信息" prop="memo" ref="item1"></u-form-item>
						<u--textarea v-model="itemInfo.projectName" border="none" placeholder="请输入备注信息" maxlength="300"></u--textarea>
					</view> -->


				</scroll-view>
			</view>
			<view class="foot-height">
				<view style="padding: 0 16px;">
					<u-form-item>
						<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="save"></u-button>
					</u-form-item>
				</view>
			</view>
		</u--form>
	</view>
</template>

<script>
	import {
		customerTransfer,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				disabled: false,
				itemInfo: {
					name: "赵小刚",
					projectName: "",
					happenTime: "",
					value: false,
				},
				checkboxValue1: [],
				// 基本案列数据
				checkboxList1: [{
						name: '商机',
						disabled: false
					},
					{
						name: '订单',
						disabled: false
					},
					{
						name: '费用',
						disabled: false
					},
					{
						name: '发票',
						disabled: false
					}
				],
				lstSelectUser: [],
				selectUserName: ''
			}
		},
		onLoad(options) {
			this.id = options.id;
			uni.removeStorageSync('lstSelectUser');
		},
		onShow() {
			uni.$once('resultSelectUser', res => {
				if (res) {
					this.lstSelectUser = uni.getStorageSync("lstSelectUser")
					console.log('lstSelectUser', this.lstSelectUser[0])
					this.selectUserName = this.lstSelectUser[0].name;
				}
			})
		},
		methods: {
			save() {
				if (!this.lstSelectUser.length) return uni.$u.toast('请选择接收对象');
				const userId = this.lstSelectUser[0].id;
				const id = this.id;
				const data = {
					userId,
					id: [id]
				};
				customerTransfer(data, res => {
					if (res.code == 200 && res.success) {
						uni.$emit('return', true);
						uni.showToast({
							title: '转移成功'
						});
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			toSelectUser() {
				uni.navigateTo({
					url: "/pages/filter-all/select-more?total=1000" + "&title=接收对象" + '&isMutiple=false' +
						'&type=responsible&needFilter=' + true
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.title-name {
		font-size: 15px;
		line-height: 48px;
		margin-left: 16px;
		color: rgba(96, 98, 102, 1);
	}

	.top-bg {
		margin-top: 0px !important;
	}

	/deep/.top-height {
		margin-top: 10px;
		background: #fff;
		padding: 0 16px;

		.u-form-item__body__left__content__required {
			right: 6px;
			float: right;
			left: unset;
		}

		.uni-input-placeholder {
			text-align: right;
		}

		.u-input__content__field-wrapper__field {
			text-align: right !important;
		}

		.u-textarea {
			padding: unset;
		}

		.u-textarea__field {
			height: 80px !important;
		}

		.uni-textarea-wrapper {
			height: 70px;
		}

		.u-upload {
			padding: 0 0 16px;
		}

		.top-user {
			position: absolute;
			right: 32px;

			.user-head {
				width: 38px;
				height: 38px;
				position: relative;
				top: 2px;
				right: 6px;
			}

			.user-name {
				position: relative;
				top: -12px;
			}
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
</style>
