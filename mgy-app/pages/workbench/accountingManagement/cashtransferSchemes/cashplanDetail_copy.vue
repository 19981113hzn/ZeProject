<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="[合同标题]回款计划" @leftClick="leftClick"></u-navbar>

		<!-- <u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon> -->
		<view>
			<view class="header">
				<u-grid :border="false" col="2">
					<u-grid-item>
						<text class="grid-text">合同总金额</text>
						<text class="grid-text">￥10,000.00</text>
					</u-grid-item>
					<u-grid-item>
						<text class="grid-text">已回款金额</text>
						<text class="grid-text">￥5,000.00</text>
					</u-grid-item>
				</u-grid>
				<u-grid customStyle="padding:15px 0; border-bottom: 1px solid #eee;" :border="false" col="2">
					<u-grid-item>
						<text class="grid-text">合同总金额</text>
						<text class="grid-text">￥10,000.00</text>
					</u-grid-item>
					<u-grid-item>
						<text class="grid-text">已回款金额</text>
						<text class="grid-text">￥5,000.00</text>
					</u-grid-item>
				</u-grid>
				<view class="content-tab">
					<u-tabs :list="lsyTabs" @click="clickTabs" :scrollable="false" lineWidth="59"></u-tabs>
				</view>
			</view>

			<!-- <view class="main-head"></view> -->
			<!-- <view class="main-foot"></view> -->
			<!-- <view class="main-crad">
				<view class="main-crad-bg">
					<image class="card-money" src="/static/img/workbench/icon_money.png"></image>
					<text class="card-name">报销金额</text>
					<text class="card-num">¥{{numFilter(reimburseDetails.amounts)}}</text>
					<u-cell :title="reimburseDetails.SysDepart">
						<image class="icon-slot" slot="icon" src="/static/img/workbench/icon_department.png"></image>
					</u-cell>
					<u-cell :title="reimburseDetails.createTime">
						<image class="icon-slot" slot="icon" src="/static/img/workbench/icon_time.png"></image>
					</u-cell>
				</view>
			</view> -->

			<view v-if="current==0" class="main-card">
				<view class="card-title">
					基本信息
				</view>
				<u--form class="form_content" labelWidth="100">
					<u-form-item label="关联客户" borderBottom>
						<text style="color:#0072FF">深圳</text>
					</u-form-item>
					<u-form-item label="关联合同" borderBottom>
						<text style="color:#0072FF">合同标题</text>
					</u-form-item>
					<u-form-item label="总回款期数" borderBottom>
						<text>4期</text>
					</u-form-item>
					<u-form-item label="合同总金额" borderBottom>
						<text>￥10,000.00</text>
					</u-form-item>
					<u-form-item label="已回款金额" borderBottom>
						<text>￥2,500.00</text>
					</u-form-item>
					<u-form-item label="已回款占比" borderBottom>
						<text>25%</text>
					</u-form-item>
					<u-form-item label="未回款金额" borderBottom>
						<text>$7,500.00</text>
					</u-form-item>
					<u-form-item label="备注信息" borderBottom>
						<text>-</text>
					</u-form-item>
					<u-form-item label="创建时间" borderBottom>
						<text>2022.08.02 09:00</text>
					</u-form-item>
					<u-form-item label="更新时间" borderBottom>
						<text>2022.08.02 11:00 </text>
					</u-form-item>
				</u--form>
			</view>
			<view v-if="current==1">
				<view class="card" v-for="(item, index) in 10" :key="index">
					<view class="card-pa" @click="gotoCashDetail(item)">
						<u-cell title="合同标题">
							<u-tag slot="value" text="已完成" bgColor="rgba(255, 248, 242, 1)"
								borderColor="rgba(255, 248, 242, 1)" color="rgba(103, 194, 58, 1)" size="mini">
							</u-tag>
							<!-- <u-tag v-if="item.status==3" slot="value" text="已通过" bgColor="rgba(243, 255, 237, 1)"
								borderColor="rgba(243, 255, 237, 1)" color="rgba(103, 194, 58, 1)" size="mini">
							</u-tag>
							<u-tag v-if="item.status==1 || item.status==2" slot="value" text="待审批" bgColor="rgba(235, 244, 255, 1)"
								borderColor="rgba(235, 244, 255, 1)" color="rgba(0, 114, 255, 1)" size="mini">
							</u-tag>
							<u-tag v-if="item.status==6" slot="value" text="已撤销" bgColor="rgba(241, 245, 250, 1)"
								borderColor="rgba(241, 245, 250, 1)" color="rgba(144, 147, 153, 1)" size="mini">
							</u-tag>
							<u-tag v-if="item.status==5" slot="value" text="被驳回" bgColor="rgba(255, 248, 242, 1)"
								borderColor="rgba(255, 248, 242, 1)" color="rgba(255, 147, 48, 1)" size="mini">
							</u-tag> -->
						</u-cell>
						<u--form labelWidth="100">
							<u-form-item label="计划回款金额:">
								<text>￥2,500.00</text>
							</u-form-item>
							<u-form-item label="已回款金额:">
								<text>￥2,500.00</text>
							</u-form-item>
							<u-form-item label="未回款金额:">
								<text>￥0</text>
							</u-form-item>
						</u--form>

					</view>

				</view>
				<view class="initLoading">
					<u-loading-icon v-if="isLoading" text="加载中" textSize="16" :vertical="true"></u-loading-icon>
				</view>
				<!-- <u-loadmore v-if="isShowLoadMore" :status="queryPageStatus" :loading-text="loadingText"
					:loadmore-text="loadmoreText" :nomore-text="nomoreText" :margin-Top="20" :margin-Bottom="20" /> -->


			</view>


			<view class="bottom_select">
				<u-row customStyle="">
					<u-col span="4" @click="gotoCashPlan">
						<view>配置回款计划</view>
					</u-col>
					<u-col span="4">
						<view>添加回款记录</view>
					</u-col>
					<u-col span="4">
						<view>删除回款计划</view>
					</u-col>
				</u-row>
			</view>

			<!-- <view v-if="current==1">
				<view>
					<view class="card">
						<view class="card-pa">
							<u-cell title="基本信息"></u-cell>
							<u--form labelWidth="75">
								<u-form-item label="报销金额">
									<text>¥ {{numFilter(reimburseDetails.amounts)}}</text>
								</u-form-item>
								<u-form-item label="报销人员">
									<text>{{reimburseDetails.chargeName}}</text>
								</u-form-item>
								<u-form-item label="报销部门">
									<text>{{reimburseDetails.SysDepart}}</text>
								</u-form-item>
								<u-form-item label="备注信息">
									<text>{{reimburseDetails.memo}}</text>
								</u-form-item>
							</u--form>
						</view>
					</view>
					<view class="card">
						<view class="card-pa">
							<u-cell title="系统信息"></u-cell>
							<u--form labelWidth="75">
								<u-form-item label="报销单号">
									<text>{{reimburseDetails.reimburseNo}}</text>
								</u-form-item>
								<u-form-item label="创建人员">
									<text>{{reimburseDetails.createBy}}</text>
								</u-form-item>
								<u-form-item label="所属部门">
									<text>{{reimburseDetails.SysDepart}}</text>
								</u-form-item>
								<u-form-item label="创建时间">
									<text>{{reimburseDetails.createTime}}</text>
								</u-form-item>
							</u--form>
						</view>
					</view>
				</view>
			</view> -->
			<!-- <view v-if="current==2">
				<view class="cost-card" v-for="(item, index) in reimburseDetails.list" :key="index">
					<view class="card-pa">
						<u-cell :title="item.expenseTypeName">
							<image class="logo" slot="icon" src="/static/img/workbench/icon_costManagement.png"></image>
						</u-cell>
						<u--form labelWidth="75">
							<u-form-item label="负责人员">
								<text>{{item.chargeName}}</text>
							</u-form-item>
							<u-form-item label="项目名称">
								<text>{{item.projectName}}</text>
							</u-form-item>
							<u-form-item label="费用金额">
								<text>¥{{numFilter(item.amounts)}}</text>
							</u-form-item>
							<u-form-item label="发生时间">
								<text>{{item.createTime}}</text>
							</u-form-item>

						</u--form>

					</view>

				</view>
			</view> -->
			<!-- <u-tabbar v-if="reimburseDetails.status!=3 && !isDonedWith" :value="numTabbar" :fixed="true"
				:placeholder="true" :safeAreaInsetBottom="true" @change="changeTabbar">

				<u-tabbar-item v-if="isNeedWith" class="tab-adopt" text="通过">
					<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_adopt.png">
					</image>
				</u-tabbar-item>
				<u-tabbar-item v-if="isNeedWith" class="tab-reject" text="驳回">
					<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_reject.png">
					</image>
				</u-tabbar-item>
				<u-tabbar-item v-if="reimburseDetails.status==0 && !isNeedWith" text="删除记录"></u-tabbar-item>
				<u-tabbar-item v-if="(reimburseDetails.status==1 || reimburseDetails.status==2) && !isNeedWith"
					text="撤销审批">
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						src="/static/img/workbench/icon_revoke_approval.png"></image>
				</u-tabbar-item>
				<u-tabbar-item v-if="(reimburseDetails.status==6 || reimburseDetails.status==5) && !isNeedWith"
					text="编辑">
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						src="/static/img/workbench/icon_edit.png"></image>
				</u-tabbar-item>
				<u-tabbar-item v-if="(reimburseDetails.status==6 || reimburseDetails.status==5) && !isNeedWith"
					text="提交">
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						src="/static/img/workbench/icon_launch.png"></image>
				</u-tabbar-item>
				<u-tabbar-item v-if="(reimburseDetails.status==6 || reimburseDetails.status==5) && !isNeedWith"
					text="删除">
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						src="/static/img/workbench/icon_delete.png"></image>
				</u-tabbar-item>
			</u-tabbar> -->

		</view>
		<u-modal :show="showDelete" title="删除确认" content='确定要删除该条记录吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		processBusinessBasicInfo,
		getProcessTrace,
		sumExpenseOperate,
		sumExpenseEdit,
		sumExpenseDelete,
		getProcessStartVariables,
		getProcessVariables
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				lsyTabs: [{
					name: "资料详情"
				}, {
					name: "回款记录"
				}],
				showDelete: false,
				numTabbar: "",
				procInstId: "",
				reimbursId: "",
				current: 0,
				reimburseDetails: {},
				lstdynamic: [],
				isLoading: false, //加载中
				isNeedWith: false, //是否待办进来的页面
				isDonedWith: false, //是否已办进来的页面
				lstActiviti: [],
			}
		},
		onLoad(option) {
			console.log(option)
			let isNeedWith = isEmpty(option.isNeedWith) ? false : option.isNeedWith;
			let isDonedWith = isEmpty(option.isDonedWith) ? false : option.isDonedWith;
			this.isNeedWith = isNeedWith
			this.isDonedWith = isDonedWith
			let detail = uni.getStorageSync("reimbursDetails");
			this.procInstId = detail.procInstId
			this.reimbursId = detail.id
			// this.createTime=detail.createTime

			this.getData();

		},
		methods: {
			isWhether(value) {
				return isEmpty(value)

			},
			// 配置回款
			gotoCashPlan() {
				uni.navigateTo({
					url: '/pages/workbench/accountingManagement/cashtransferSchemes/addNextcashtransfer?create=0'
				})
			},
			getData() {
				this.isLoading = false;
				processBusinessBasicInfo(this.procInstId, res => {
					if (res.code == 200 && res.success) {
						this.reimburseDetails = res.result
						if (this.reimburseDetails.status == 6 || this.reimburseDetails.status == 5) {
							this.getStartVariables();
						}
						this.getTrace()
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			gotoCashDetail(item) {
				// uni.setStorageSync('reimbursDetails', item)
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/cashtransferSchemes/cashRecordDetail"
				})
			},
			getStartVariables() {
				getProcessVariables(this.procInstId, res => {
					if (res.code == 200 && res.success) {
						for (let i = 0; i < res.result.length; i++) {
							let item = res.result[i]
							let info = {
								variableName: item.variableName,
								variableValue: item.value,
								variableNameCn: item.variableNameCn
							}
							this.lstActiviti.push(info)
						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getTrace() {
				getProcessTrace(this.procInstId, res => {
					if (res.code == 200 && res.success) {
						this.lstdynamic = res.result.logList;
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			},
			numFilter(value) {
				// 截取当前数据到小数点后两位
				let tempVal = parseFloat(value).toFixed(3);
				let realVal = tempVal.substring(0, tempVal.length - 1);
				return realVal;
			},
			//返回上一级
			leftClick() {
				uni.navigateBack();
			},
			clickTabs(item) {
				this.current = item.index
			},
			changeTabbar(name) {
				// if (this.type == 0 && name == 0) { //通过  删除
				// 	this.showDelete = true
				// }
				// if (this.type == 1 && name == 0) { //待办 通过
				// 	uni.$u.toast("待办通过成功")
				// }
				// if (this.type == 1 && name == 1) { //待办 驳回
				// 	uni.$u.toast("待办驳回成功")
				// }
				if ((this.reimburseDetails.status == 1 || this.reimburseDetails.status == 2) && name == 0 && !this
					.isNeedWith) { //审批中  撤销审批
					//uni.$u.toast("审批中撤销审批成功")
					uni.navigateTo({
						url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=1&procInstId=" +
							this.procInstId
					})

				}
				if ((this.reimburseDetails.status == 6 || this.reimburseDetails.status == 5) && !this.isNeedWith) { //已撤销 
					if (name == 0) { //编辑报销单
						uni.setStorageSync('lstCheck', this.reimburseDetails.list)
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/addReimburse?type=2&returnPageNumber=1"
						})
					}
					if (name == 1) { //提交审批
						this.editResubmit();
					}
					if (name == 2) { //删除报销单
						this.showDelete = true
					}
				}
				if (this.isNeedWith) {
					if (name == 0) { //待办 通过
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=3&procInstId=" +
								this.procInstId
						})
					}
					if (name == 1) { //待办 驳回
						uni.navigateTo({
							url: "/pages/workbench/accountingManagement/reimburseManagement/revokeApproval?type=2&procInstId=" +
								this.procInstId
						})
					}
				}
			},
			//提交审批
			editResubmit() {
				let detail = uni.getStorageSync("reimbursDetails");
				let userInfo = this.$cache.get('_userInfo') //getApp().globalData.userInfo;
				detail.applyId = userInfo.id;
				detail.orgId = userInfo.orgId;
				let arrid = userInfo.deptIds.split(",");
				let arrName = userInfo.deptNames.split(",");
				let lstDept = [];
				for (let i in arrid) {
					lstDept.push({
						id: arrid[i],
						name: arrName[i]
					})
				}
				let data = lstDept.find(item => item.name == detail.departName)
				detail.departId = data.id;
				let costId = "";
				for (let i = 0; i < this.reimburseDetails.list.length; i++) {
					let id = this.reimburseDetails.list[i].id
					costId = costId + (isEmpty(costId) ? ("" + id) : ("," + id))
				}
				detail.costIds = costId;
				detail.status = 1;
				// for(let i=0;i<this.lstActiviti.length;i++){
				// 	this.lstActiviti[]
				// }
				detail.vars = this.lstActiviti;
				sumExpenseEdit(detail, res => {
					if (res.code == 200 && res.success) {
						//uni.$u.toast(res.message);
						uni.$emit('returnExpense', true);
						this.getData();
						this.$refs.uToast.show({
							type: 'success',
							message: "提交成功",
						})
						// uni.navigateBack({
						// 	delta:1
						// })							
					} else {
						uni.$u.toast(res.message);
					}
				})
				console.log(detail)
				// this.$refs.uToast.show({
				//     type:'success',
				//     message:"提交成功",
				// }) 
			},
			confirmDelete() {
				let data = '?id=' + this.reimbursId
				sumExpenseDelete(data, res => {
					if (res.code == 200 && res.success) {
						this.showDelete = false
						this.$refs.uToast.show({
							type: 'success',
							message: "删除成功",
						})
						uni.$emit('returnExpense', true);
						uni.navigateBack();
					} else {
						uni.$u.toast(res.message);
					}
				})
				// this.showDelete = false
				// this.$refs.uToast.show({
				// 	type: 'success',
				// 	message: "删除成功",
				// })
				// uni.navigateTo({
				// 	url: "/pages/workbench/accountingManagement/reimburseManagement/addReimburse"
				// })
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.header {
		background: #fff;
		font-size: 12px;
		// color: #eee;
		margin-bottom: 12px;
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
		padding-top: 15px;
	}


	/deep/.u-navbar__content .u-navbar__content__title {
		color: #000;
	}

	.main-card {
		// padding: 0 15px;

		// margin-top: 8px;
		.card-title {
			padding: 10px 15px;
		}

		.form_content {
			background-color: #fff;
			padding: 0 15px;
			// text-align: right;
		}

		/deep/.content {
			// display: flex;
			// flex-direction: column;
			// justify-content: center;
			// align-items: space-between;
			.u-form-item__body {
				display: inline-flex;
			}

			.u-form-item__body__left__content {
				// flex: 1;
			}

			.u-form-item__body__right__content {
				// text-align-last: justify;
				// width: 300px;
			}
		}


	}

	.card {
		padding: 8px 16px 0 16px;

		.card-pa {
			padding: 0 16px 16px;
			background: #fff;
			border-radius: 10px;

			/deep/.u-cell__body {
				// padding: 10px 0px;


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

			// /deep/.u-line{
			// 	border: none !important;
			// }

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
		}

	}


	.bottom_select {
		box-sizing: border-box;
		width: 100vw;
		color: rgba(96, 98, 102, 1);
		font-size: 14px;
		padding: 16px 0 20px 24px;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		box-shadow: 0px -5px 10px -5px rgba(32, 33, 36, .28);
	}
</style>
