<template>
	<view>
		<u-navbar class="navbar" title="跟进详情" :border="true" safeAreaInsetTop fixed placeholder @leftClick="leftClick">
		</u-navbar>
		<view class="dynamic-bg">
			<u-cell>
				<image class="logo" slot="icon"
					:src="detail.createAvatar?detail.createAvatar:'/static/img/icon_user_default.png'"></image>
				<!-- <text slot="value" class="u-slot-value" >未报销</text> -->
				<view slot="title" class="u-slot-title">
					<text class="u-cell-text">{{detail.createName}}</text>
					<text class="text-tag">{{detail.position}}</text>
				</view>
				<view slot="value" class="u-slot-value">
					<text>{{detail.connectTime}}</text>
				</view>
			</u-cell>
			<u--text class="title-name" :text="`跟进 (${detail.connectType_dictText || '-'})`"></u--text>
			<u--text class="title-content remark-content" :text="detail.content"></u--text>
			<u-cell :title="`来自${getSourceName()}：${fromName}`">

			</u-cell>
		</view>
		<view class="main-content">
			<u-tabs :list="lsyTabs" @click="clickTabs" :scrollable="false" lineWidth="59"
				lineColor="rgba(0, 114, 255, 1)" :activeStyle="{
			    color: 'rgba(0, 114, 255, 1)',
				fontWeight: 'bold',
			    }"></u-tabs>
		</view>
		<view v-if="current==0">
			<u-empty v-if="!detail.recordComments||!detail.recordComments.length" mode="data"
				icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
			<view class="card-detail" v-else>
				<view v-for="(item, index) in detail.recordComments" :key="index">
					<u-cell :border="false">
						<image class="logo" slot="icon"
							:src="item.avatar?item.avatar:'/static/img/icon_user_default.png'"></image>
						<!-- <text slot="value" class="u-slot-value" >未报销</text> -->
						<view slot="title" class="u-slot-title">
							<text class="u-cell-text">{{item.username}}</text>
							<!-- <text class="text-tag">销售经理</text> -->
						</view>
						<view slot="value" class="u-slot-value">
							<text>{{item.createTime}}</text>
						</view>
					</u-cell>
					<u--text class="title-content remark-content" :text="item.comment"></u--text>
				</view>
			</view>
		</view>
		<view v-if="current==1">
			<view class="card-detail">
				<view class="card">
					<view class="card-pa">
						<!-- <u-cell title="基本信息"></u-cell> -->
						<u--form labelWidth="75">
							<u-form-item label="跟进类型">
								<text>{{`${getSourceName()}跟进`}}</text>
							</u-form-item>
							<u-form-item label="跟进方式">
								<text>{{detail.connectType_dictText}}</text>
							</u-form-item>
							<u-form-item label="跟进时间">
								<text>{{detail.connectTime}}</text>
							</u-form-item>
							<u-form-item label="跟进描述" class="remark-label">
								<text class="remark-content">{{detail.content}}</text>
							</u-form-item>
							<u-form-item label="客户名称">
								<text style="color: rgba(0, 114, 255, 1);"
									@click="leftClick">{{fromName || '-'}}</text>
							</u-form-item>
							<u-form-item label="客户状态">
								<text>{{statusText || '-'}}</text>
							</u-form-item>
							<!-- <u-form-item label="联系人">
								<text style="color: rgba(0, 114, 255, 1);">李小红</text>
							</u-form-item> -->
							<u-form-item label="相关附件">
								<template v-if="detail.attachmentList">
									<text style="color: rgba(0, 114, 255, 1);"
										v-for="(item,index) in detail.attachmentList" :key="index"
										@click="toPreviewFiles(item.url)">{{item.name}}</text>
								</template>
								<template v-else>
									<text>-</text>
								</template>
							</u-form-item>
							<u-form-item label="评论数量">
								<text>{{detail.recordComments && detail.recordComments.length}}条</text>
							</u-form-item>
							<u-form-item label="跟进人员">
								<text>{{detail.createName}}</text>
							</u-form-item>
							<u-form-item label="创建时间">
								<text>{{detail.createTime}}</text>
							</u-form-item>
						</u--form>
					</view>
				</view>
			</view>
		</view>
		<u-tabbar :value="numTabbar" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true"
			@change="changeTabbar">

			<u-tabbar-item text="发布评论">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/follow_detail_comment.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="编辑记录" v-if="clueStatus!=4">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/follow_detail_edit.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="删除记录">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/follow_detail_detele.png"></image>
			</u-tabbar-item>
		</u-tabbar>
		<u-modal :show="showPostComments" title="发布评论" closeOnClickOverlay confirmText="发布" showCancelButton
			@confirm="confirmPostComments" @cancel="showPostComments=false" @close="showPostComments=false">
			<u--textarea v-model="newCommentText" placeholder="请输入评论"></u--textarea>
			<!-- <u--textarea v-model="itemInfo.projectName" border="none" placeholder="请输入备注信息" maxlength="300"></u--textarea> -->
		</u-modal>

		<u-modal :show="showDelete" title="删除确认" content='确定要删除该跟进记录吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
	</view>
</template>

<script>
	import {
		getFollowRecordDetail,
		customerAddComment,
		deleteFollowRecord
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				id: '',
				detail: {},
				lsyTabs: [{
					name: "评论列表"
				}, {
					name: "更多信息"
				}],
				current: 0,
				numTabbar: "",
				showPostComments: false,
				newCommentText: "",
				customer_contact_type: [],
				customer_status: [],
				showDelete: false,
				customerName: "",
				customerStatus: "",
				clueStatus:"",//线索状态
				fromName:"",
				statusText:"",
				businessCode:""
			}
		},
		onLoad(options) {
			this.customer_contact_type = getApp().globalData.customer_contact_type; //跟进方式
			this.customer_status = getApp().globalData.customer_status; //客户状态
			this.id = options.id || ''
			this.businessCode=options.businessCode || '';
			this.statusText = options.statusText;
			this.getDetail();
		},
		onShow() {
			uni.$once('return', res => {
				if (res) {
					this.getDetail();
					uni.$emit('return', true);
				}
			})
		},
		methods: {
			getDetail() {
				const data = "?id=" + this.id;
				getFollowRecordDetail(data, res => {
					if (res.code == 200 && res.success) {
						this.detail = res.result;
						let type={
							'ClueSource':['clueSourceName','clueSourceStatus'],
							'BizOppty':['bizOpptyName','bizStatusName']
						}
						this.fromName = this.detail[type[this.businessCode][0]]
						this.detail.connectType_dictText = this.customer_contact_type?this.customer_contact_type.find(fi => fi.value == this
							.detail.connectType).label:"";
						this.detail.customerStatus_dictText = this.customer_status?this.customer_status.find(fi => fi.value == this
							.detail.customerStatus).label:"";
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			leftClick() {
				uni.navigateBack();
			},
			clickTabs(item) {
				this.current = item.index
			},
			//底部按钮
			changeTabbar(name) {
				if(this.clueStatus!=4){
					if (name == 0) { //发布评论
						this.showPostComments = true;
					}
					if (name == 1) { //编辑记录
						const params = {
							bizOpptyId: this.detail.bizOpptyId, //商机id
							customerName: this.detail.createName, //客户名称
							customerId: this.detail.customerId, //客户id
							bizStatus: this.detail.bizStatusName, //销售状态
							clueStatus:this.detail.clueSourceStatus,//线索状态
						}
						uni.navigateTo({
							url: `/pages/assist/customerManagement/newFollowUp?type=edit&businessCode=${this.detail.businessCode}&id=${this.id}&params=${JSON.stringify(params)}`
						})
					}
					if (name == 2) { //删除记录
						this.showDelete = true;
					}
				}
				else{
					if (name == 0) { //发布评论
						this.showPostComments = true;
					}
					if (name == 1) { //删除记录
						this.showDelete = true;
					}
				}
				
			},
			//发布按钮
			confirmPostComments() {
				if (!this.newCommentText.trim()) return uni.$u.toast("请输入评论");
				const data = {
					businessCode: 'CustomerContactRecord',
					businessId: this.id,
					comment: this.newCommentText
				}
				customerAddComment(data, res => {
					if (res.code == 200 && res.success) {
						this.showPostComments = false;
						uni.$u.toast("发布成功");
						this.getDetail();
						this.newCommentText = '';
					} else {
						this.showPostComments = false;
						uni.$u.toast(res.message);
					}

				})

			},
			toPreviewFiles(url) {
				uni.navigateTo({
					url: "/pages/review/index?url=" + url
				})
			},
			confirmDelete() {
				const data = '?id=' + this.detail.id;
				deleteFollowRecord(data, res => {
					if (res.code == 200 && res.success) {
						uni.$emit('return', true);
						uni.$u.toast("删除成功");
						setTimeout(() => {
							uni.navigateBack();
						}, 1000)
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getSourceName() {
				let name = '';
				switch (this.detail.businessCode) {
					case 'Customer':
						name = '客户';
						break;
					case 'BizOppty':
						name = '商机';
						break;
					case 'ClueSource':
						name = '线索';
						break;
					default:
						name = '客户';
						break;
				}
				return name;
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

	/deep/.dynamic-bg {
		background: #fff;
		border-radius: 4px;

		.u-line {
			border: none !important;
		}

		.text-tag {
			margin-left: 8px;
			font-size: 12px;
			color: rgba(96, 98, 102, 1);
		}

		.u-cell__title .u-cell-text {
			font-size: 16px;
			color: rgba(96, 98, 102, 1);
			font-weight: bold !important;
		}

		.u-slot-value {
			color: rgba(144, 147, 153, 1);
		}

		.u-cell__title-text {
			color: rgba(144, 147, 153, 1);
			font-size: 14px;
		}

		.logo {
			width: 36px;
			height: 36px;
		}

		.u-text {
			padding: 0 16px;
			width: unset;
		}

		.icon-rigth {
			width: 16px;
			height: 16px;
		}

		.value-news {
			font-size: 14px;
			color: rgba(96, 98, 102, 1);
		}

		.icon-news {
			width: 14px;
			height: 14px;
			right: 3px;
			top: 1px;
		}

		.title-name {
			.u-text__value {
				font-size: 16px !important;
				font-weight: bold !important;
				color: rgba(48, 49, 51, 1) !important;
				margin-bottom: 10px;
			}

		}

		.title-content {
			.u-text__value {
				color: rgba(96, 98, 102, 1) !important;
			}

		}
	}

	.main-content {
		margin-top: 10px;
		background: #fff;
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

	/deep/.card-detail {
		padding: 0 16px 16px;
		background: #fff;
		border-top: 1px solid;
		border-top-color: #eee;

		.u-cell__body {
			padding: 16px 0 0px;

			.text-tag {
				margin-left: 8px;
				font-size: 12px;
				color: rgba(96, 98, 102, 1);
			}

			.u-cell__value {
				color: rgba(192, 196, 204, 1);
			}

			.u-cell__title .u-cell-text {
				font-size: 15px;
				font-weight: bold;
				color: rgba(96, 98, 102, 1);
			}

			.u-slot-value {
				color: rgba(144, 147, 153, 1);
			}

			.u-cell__title-text {
				color: rgba(144, 147, 153, 1);
			}

			.logo {
				width: 30px;
				height: 30px;
				right: 3px;
			}

		}

		.title-content {
			margin-top: 8px !important;

			.u-text__value {
				font-size: 14px;
				color: rgba(48, 49, 51, 1) !important;
				padding: 0 0 16px 35px !important;
			}

		}

		/deep/.u-line {
			border: none !important;
		}

		.card {
			padding: 8px 0 0;

			.card-pa {
				// padding: 0 16px 16px;
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

	.remark-label {
		/deep/.u-form-item__body__left {
			align-items: flex-start;
		}
	}

	.remark-content {
		word-break: break-all;
	}
</style>
