<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="navTitle" bgColor="#fff" :border="true" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_add.png"></image>
			</view>
		</u-navbar>
		<view v-if="isLoading">
			<u-loading-icon text="加载中" textSize="18" :vertical="true" size="32"></u-loading-icon>
		</view>
		<view v-else>
			<u-cell-group class="sign-out" :border="false">
				<u-cell :title="costInfo.chargeName+'的费用'" size="large">
					<image class="user-head" slot="icon" src="/static/img/icon_user_default.png"></image>
					<u-tag v-if="costInfo.status==1" slot="value" text="未报销" bgColor="rgba(242, 245, 249, 1)"
						borderColor="rgba(242, 245, 249, 1)" color="rgb(102, 102, 102)" size="mini">
					</u-tag>
					<u-tag v-if="costInfo.status==2" slot="value" text="报销中" bgColor="rgba(235, 244, 255, 1)"
						borderColor="rgba(235, 244, 255, 1)" color="rgba(0, 114, 255, 1)" size="mini">
					</u-tag>
					<u-tag v-if="costInfo.status==3" slot="value" text="已报销" bgColor="rgba(247, 252, 244, 1)"
						borderColor="rgba(247, 252, 244, 1)" color="rgba(103, 194, 58, 1)" size="mini">
					</u-tag>
				</u-cell>
			</u-cell-group>

			<view class="card">
				<view class="card-pa">
					<u-cell title="基本信息"></u-cell>
					<u--form labelWidth="75">
						<u-form-item label="项目编号">
							<text>{{costInfo.projectCode}}</text>
						</u-form-item>
						<u-form-item label="项目名称">
							<text>{{costInfo.projectName}}</text>
						</u-form-item>
						<u-form-item label="费用名称">
							<text>{{costInfo.expenseName}}</text>
						</u-form-item>
						<u-form-item label="费用金额">
							<text>￥{{costInfo.amounts}}</text>
						</u-form-item>
						<u-form-item label="费用类型">
							<text>{{costInfo.expenseTypeName}}</text>
						</u-form-item>
						<u-form-item label="发生时间">
							<text>{{costInfo.happenTime}}</text>
						</u-form-item>
					</u--form>
				</view>
			</view>
			<view class="card">
				<view class="card-pa">
					<u-cell title="附件"></u-cell>
					<view v-if="fileList.length==0">
						<text class="none-file">暂无</text>
					</view>
					<u-upload v-else :fileList="fileList" name="6" :maxCount="fileList.length" :deletable="false"
						multiple width="58" height="58" style="margin: 10px 5px 0 0;">

						<image src="/static/img/workbench/icon_upload.png" mode="widthFix"
							style="width: 58px;height: 58px;"></image>
					</u-upload>
				</view>
			</view>

			<view class="card">
				<view class="card-pa">
					<u-cell title="系统信息"></u-cell>
					<u--form labelWidth="75">
						<u-form-item label="录入人员">
							<text>{{costInfo.createBy}}</text>
						</u-form-item>
						<u-form-item label="创建时间">
							<text>{{costInfo.createTime}}</text>
						</u-form-item>
						<u-form-item label="更新时间">
							<text>{{costInfo.updateTime}}</text>
						</u-form-item>
					</u--form>
				</view>
			</view>
		</view>
		<u-tabbar :value="numTabbar" @change="changeTabbar" :fixed="true" :placeholder="true"
			:safeAreaInsetBottom="true" v-if="costInfo.status==1">
			<u-tabbar-item v-if="costInfo.status==1" text="发起报销">
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/workbench/icon_launch.png">
				</image>
			</u-tabbar-item>
			<u-tabbar-item v-if="costInfo.status==1" text="编辑记录">
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/workbench/icon_edit.png">
				</image>
			</u-tabbar-item>
			<u-tabbar-item v-if="costInfo.status==1" text="删除记录">
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/workbench/icon_delete.png">
				</image>
			</u-tabbar-item>
			<!-- <u-tabbar-item v-if="costInfo.status==2" text="查看报销详情">
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/workbench/icon_view_details.png" ></image>
			</u-tabbar-item> -->
		</u-tabbar>

		<u-modal :show="showDelete" title="删除确认" content='确定要删除该条记录吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		costManageDelete
	} from "@/util/interface.js"
	import {
		isEmpty
	} from "@/util/common.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				costInfo: {},
				navTitle: "费用详情",
				status: 1,
				numTabbar: "",
				showDelete: false,
				isLoading: true,
				fileList: [
					//{url:"http://192.168.196.37:81/group1/M00/00/03/wKjEJWKsGhuAOEYhAAD7inVR1dk156.jpg"}
				]
			}
		},
		onLoad() {
			this.getData();
		},
		onShow() {
			this.getData();
		},
		onUnload() {
			//uni.$emit('return', true);
		},
		methods: {
			getData() {
				this.isLoading = true;
				let feeDetail = uni.getStorageSync("feeDetails");
				this.costInfo = feeDetail
				this.navTitle = this.costInfo.expenseName;
				if (!isEmpty(feeDetail.mapList)) {
					let arr = [];
					for (let i = 0; i < feeDetail.mapList.length; i++) {
						arr.push({
							url: feeDetail.mapList[i].url,
							id: feeDetail.mapList[i].fileId
						})
						if (i == (feeDetail.mapList.length - 1)) {
							this.isLoading = false;
							this.fileList = arr;
						}
					}
				} else {
					this.isLoading = false;
				}
			},
			changeTabbar(name) {
				console.log(name)
				//this.numTabbar=name;

				if (this.costInfo.status == 1) {
					if (name == 0) {
						let lstCheck = [];
						lstCheck.push(this.costInfo)
						uni.setStorageSync('lstCheck', lstCheck) //1*60*60*24*7
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/addReimburse?type=1&returnPageNumber=1"
						})
					}
					if (name == 1) {
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/costManagement/addCost?isUpdate=true&returnPageNumber=1"
						})
					}
					if (name == 2) {
						this.showDelete = true
					}
				} else {
					// if(name==0){
					// 	uni.navigateTo({
					// 		url: "/pages/workbench/accountingManagement/reimburseManagement/addReimburse"
					// 	})
					// }
				}

			},
			confirmDelete() {
				let data = '?id=' + this.costInfo.id
				costManageDelete(data, res => {
					if (res.code == 200 && res.success) {
						this.showDelete = false
						this.$refs.uToast.show({
							type: 'success',
							message: "删除成功",
						})
						uni.$emit('return', true);
						uni.navigateBack();
					} else {
						uni.$u.toast(res.message);
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
					url: "/pages/workbench/accountingManagement/costManagement/addCost"
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.u-grid-item {
		margin-top: 16px;
	}

	.u-loading-icon {
		margin-top: 30px;
	}

	.grid-title {
		color: rgba(0, 0, 0, 0.45);
		font-size: 14px;
	}

	.logo {
		width: 24px;
		height: 24px;
	}

	.grid-value {
		color: rgba(0, 0, 0, 0.6);
		font-size: 14px;
	}

	.user-head {
		width: 58px;
		height: 58px;
	}

	/deep/.sign-out {
		background: #fff;

		.u-line {
			border: none !important;
		}

		.logo {
			width: 18px;
			height: 18px;
		}

		.u-cell__title-text {
			color: rgba(48, 49, 51, 1);
			font-size: 17px;
			font-weight: bold;
		}
	}

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

			.none-file {
				display: block;
				margin: 10px 0px;
				color: #747988;
				font-size: 14px;
			}
		}
	}




	/deep/ {
		.u-tabbar-item__text {
			font-size: 12px;

			span {
				//color: rgba(0, 85, 255, 0.8);
			}
		}

		.u-modal__content__text {
			text-align: center;
		}

		.u-page__item__slot-icon {
			width: 24px;
			height: 24px;
		}

		.u-border-top {
			border: none;
		}
	}

	/deep/.u-modal__content__text {
		text-align: center;
	}
</style>
