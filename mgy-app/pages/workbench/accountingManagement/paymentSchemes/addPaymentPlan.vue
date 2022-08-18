<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>

		<u--form v-model="formData" ref="form1" labelPosition="left" labelWidth="120">

			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'110px' }"
					scroll-y="true" :scroll-top="scrollTop" @scroll="scroll" scroll-with-animation="true">

					<view class="top-height">
						<u-form-item class="customer" label="客户名称" ref="item1" borderBottom @click="toRelatedCustomer"
							:required="true">
							<u--input v-model="formData.customerName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>

						</u-form-item>
						<u-form-item class="contractName" label="合同标题" prop="contractName" ref="item1" borderBottom
							:required="true" @click="gotorelatedContracts(); hideKeyboard()">
							<u--input v-model="formData.contractName" border="none" placeholder="请选择"
								disabledColor="#ffffff" maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item class="amount" label="合同总金额(元)" borderBottom :required="true">
							<u--input v-model="formData.amount" border="none" placeholder="请填写" disabledColor="#ffffff"
								clearable maxlength="30" type="digit"></u--input>
						</u-form-item>
						<u-form-item class="signTime" label="合同签订时间" prop="signTime" ref="item1"
							@click="clickDatePicker(1); hideKeyboard()" :required="true">
							<u--input v-model="formData.signTime" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<!-- 无数据时 -->
					<!-- <view v-if="formData.itemDtoList.length == 0 && this.EditId" class="main-card">
						<view class="card-title">
							付款计划
						</view>
						<view class="header">
							<u-grid :border="false" col="2">
								<u-grid-item>
									<text class="grid-text" style="font-size: 16px;">1期</text>
									<text class="grid-text" style="font-size: 13px;">总计划期次</text>
								</u-grid-item>
								<u-grid-item>

									<text class="grid-text" style="font-size: 16px;">￥0</text>
									<text class="grid-text" style="font-size: 13px;">总付款金额</text>
								</u-grid-item>
							</u-grid>

						</view>
						<view class="content" v-for="(item,index) in formData.itemDtoList" :key="index">
							<view class="prod-item">
								<u-cell customStyle="color: #303133;">
									<view slot="title">第1期</view>
									<view v-if="formData.itemDtoList.length>1" slot="right-icon"
										class="u-slot-value" @click="deletePlan(item,index)">
										<u-icon name="/static/img/icon_jian@2.png" size="24"></u-icon>
									</view>
								</u-cell>
								<view class="top-height">
									<u-form-item label="计划付款日期" prop="payTime" ref="item1" borderTop borderBottom
										labelWidth="130" :required="true"
										@click="clickDatePicker('plan_time'); hideKeyboard()">
										<u--input :data-index="index" v-model="item.payTime" border="none"
											placeholder="请选择" disabledColor="#ffffff" clearable maxlength="30">
										</u--input>
										<u-icon slot="right" name="arrow-right"></u-icon>
									</u-form-item>
									<u-form-item class="cashplan" prop="amount" label="计划付款金额(元)" borderBottom
										labelWidth="130" :required="true">
										<u--input v-model="item.amount" border="none" placeholder="请填写"
											disabledColor="#ffffff" maxlength="30" @input="onInput">
										</u--input>
									</u-form-item>
									<u-form-item label="备注信息" borderBottom>
										<u--input v-model="item.remark" border="none" placeholder="请填写"
											disabledColor="#ffffff" maxlength="30"></u--input>
									</u-form-item>
								</view>
							</view>
						</view>
						<view class="addCash" v-if="formData.itemDtoList.length > 0">
							<u-button customStyle="color: #0072FF; border:none;" icon="/static/img/icon_add.png"
								text="添加付款期数" iconColor="#0072FF" @click="addPeriods">
							</u-button>

						</view>
					</view> -->
					<!-- 有数据时 -->
					<view class="main-card">
						<view class="card-title">
							付款计划
						</view>
						<view class="header">
							<u-grid :border="false" col="2">
								<u-grid-item>
									<text class="grid-text"
										style="font-size: 16px;">{{formData.itemDtoList.length}}期</text>
									<text class="grid-text" style="font-size: 13px;">总计划期次</text>
								</u-grid-item>
								<u-grid-item>
									<text v-if="this.isEditId" class="grid-text"
										style="font-size: 16px;">￥{{formData.totalAmount ? formData.totalAmount : 0}}</text>
									<text v-else class="grid-text"
										style="font-size: 16px;">￥{{formData.totalAmount ? formData.totalAmount : 0}}</text>
									<text class="grid-text" style="font-size: 13px;">总付款金额</text>
								</u-grid-item>
							</u-grid>

						</view>
						<view class="content" v-for="(item,index) in formData.itemDtoList" :key="index">
							<view class="prod-item">
								<u-cell customStyle="color: #303133;">
									<view slot="title">第{{index+1}}期</view>
									<view v-if="formData.itemDtoList.length>1" slot="right-icon" class="u-slot-value"
										@click="deletePlan(item,index)">
										<u-icon name="/static/img/icon_jian@2.png" size="24"></u-icon>
									</view>
								</u-cell>
								<view class="top-height">
									<u-form-item label="计划付款日期" prop="payTime" ref="item1" borderTop borderBottom
										labelWidth="130" :required="true" @click="clickDatePicker(2); hideKeyboard()">
										<u--input :data-index="index" v-model="item.payTime" border="none"
											placeholder="请选择" disabledColor="#ffffff" disabled clearable maxlength="30">
										</u--input>
										<u-icon slot="right" name="arrow-right"></u-icon>
									</u-form-item>
									<u-form-item class="cashplan" prop="amount" label="计划付款金额(元)" borderBottom
										labelWidth="130" :required="true">
										<u--input v-model="item.amount" border="none" placeholder="请填写"
											disabledColor="#ffffff" maxlength="30" type="digit" @input="onInput">
										</u--input>
									</u-form-item>
									<u-form-item label="备注信息" borderBottom>
										<u--input v-model="item.remark" border="none" placeholder="请填写"
											disabledColor="#ffffff" maxlength="30"></u--input>
									</u-form-item>
								</view>
							</view>
						</view>
						<view class="addCash" v-if="formData.itemDtoList.length > 0">
							<u-button customStyle="color: #0072FF; border:none;" icon="/static/img/icon_add.png"
								text="添加付款期数" iconColor="#0072FF" @click="addPeriods">
							</u-button>

						</view>
					</view>
				</scroll-view>
			</view>

			<view class="foot-height">
				<view style="padding: 0 16px;">
					<u-form-item>
						<u-button customStyle="border-radius: 32px;" color="rgba(0, 114, 255, 1)" text="保存"
							@click="addPlanForm">
						</u-button>
					</u-form-item>
				</view>
			</view>
		</u--form>
		<u-modal :content="modalContent" :show="showModal" :title="modalTitle" showCancelButton closeOnClickOverlay
			@confirm="confirmModal" @cancel="showModal=false" @close="showModal=false"></u-modal>

		<u-picker :show="showPicker" :columns="lstPlan" keyName="label" closeOnClickOverlay :defaultIndex="defaultIndex"
			@close="showPicker=false" @cancel="showPicker=false" @confirm="confirmExpense_type"></u-picker>


		<u-datetime-picker :show="showDatePicker" v-model="datetime" :mode="dateMode" :minDate="minDate"
			:maxDate="maxDate" closeOnClickOverlay @close="showDatePicker=false" @cancel="showDatePicker=false"
			@confirm="confirm">
		</u-datetime-picker>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		js_date_time
	} from "@/util/js_DateTime.js"
	import {
		addPaymentPlan,
		editPaymentPlan
	} from "@/util/interface.js"
	export default {
		data() {

			return {
				userInfo: {},
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				old: { //之前的滚动条距离顶部的距离
					scrollTop: 0,
				},
				navTitle: "创建付款计划",
				modalContent: "",
				modalTitle: "",
				showModal: false,
				formData: {
					id: '',
					customerId: '',
					customerName: '',
					contractId: '',
					contractName: '',
					amount: '',
					totalAmount: '',
					signTime: '',
					itemDtoList: [{
						payTime: '',
						period: 1,
						amount: '',
						remark: ''
					}],
				},
				isEditId: '',
				plan_contractName: [],
				plan_customerName: [],
				customerName: '',
				contractName: '',
				selectType: '',
				payTime: '',
				signTime: '',
				minDate: "",
				maxDate: "",
				timeIndex: '',
				planItemIndex: '',
				datetime: js_date_time(new Date()),
				dateMode: "date",
				showDatePicker: false,
				showPicker: false,
				defaultIndex: [],
				lstPlan: [],
				amounts: '',
				returnPageNumber: 1,
				isClick: false, //防止重复点击保存按钮
			}
		},
		onLoad(option) {
			this.isEditId = option.editId
			let EditData = uni.getStorageSync('setPlanContent')
			let EditPlanItem = uni.getStorageSync('setPlanItem')

			//编辑
			if (this.isEditId) {
				this.formData.id = this.isEditId
				this.formData.customerName = EditData.customer ? EditData.customer.name : ''
				this.formData.contractName = EditData.contractName
				this.formData.amount = EditData.amount
				this.formData.signTime = EditData.signTime
				this.formData.itemDtoList = EditPlanItem
				let total = EditPlanItem.map((item, index) => {
					return item.amount
				})
				console.log(total)
				this.formData.totalAmount = total.reduce((accumulator, currentValue) => Number(accumulator) + Number(
					currentValue));
				console.log(this.formData.totalAmount);
			}
			uni.$once('returnCustomer', res => {
				console.log(res)
				this.formData.customerName = res.customerName; //客户名称
				this.formData.customerId = res.customerId; //客户id
				console.log(this.formData.customerId);
			});
			let date1 = new Date()
			let date2 = new Date()
			// console.log(date);
			date1.setFullYear(date1.getFullYear() - 10);
			date2.setFullYear(date2.getFullYear() + 10);
			this.minDate = Date.parse(new Date(date1));
			this.maxDate = Date.parse(new Date(date2));
		},
		onShow() {
			uni.$once('returnContract', res => {
				console.log(res)
				this.formData.contractName = res.contractName; //合同名称
				this.formData.contractId = res.contractId; //合同ID
				// this.getCollectionPeriod()
			});
		},
		methods: {
			onInput(e) {
				let total = this.formData.itemDtoList.map((item, index) => {
					return item.amount
				})
				this.formData.totalAmount = total.reduce((accumulator, currentValue) => Number(accumulator) + Number(
					currentValue));
				console.log(total);
			},
			//关联合同
			gotorelatedContracts() {
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/contractManagement/relatedContracts?contractId=" +
						this
						.formData
						.contractId
				})
			},
			// 查询客户名称
			toRelatedCustomer() {
				uni.navigateTo({
					url: '/pages/assist/customerManagement/relatedCustomers'
				})
			},
			// clickExpense(type) {
			// 	this.selectType = type
			// 	switch (type) {
			// 		case 'plan_contractName': //合同标题
			// 			this.lstPlan = this.plan_contractName;
			// 			this.showPicker = true;
			// 			break;

			// 			// case 'plan_contractName': //任务提醒
			// 			// 	this.lstPlan = this.plan_contractName;
			// 			// 	this.showPicker = true;
			// 			// 	break;
			// 	}
			// },

			addPeriods() {
				// 定义一个标识，通过标识判断是否能添加信息
				console.log('button_go');
				let statusType = true;

				this.formData.itemDtoList.forEach((item) => {
					// this.amounts = item.amount
					// if (this.amounts >= this.formData.amount) {
					// 	statusType = false;
					// }
					if (
						item.payTime == "" ||
						item.period == "" ||
						item.amount == ""
					) {

						this.$refs.uToast.show({
							message: '请完善资料后再添加'
						})
						statusType = false;
					}

				});
				if (statusType) {
					this.formData.itemDtoList.push({
						payTime: "",
						period: this.formData.itemDtoList.length + 1,
						amount: "",
						remark: ""
					});
				}
			},
			// 删除付款期数
			deletePlan(item, index) {
				this.formData.itemDtoList.splice(index, 1)
				let total = this.formData.itemDtoList.map((item, index) => {
					return item.amount
				})
				this.formData.totalAmount = total.reduce((accumulator, currentValue) => Number(accumulator) + Number(
					currentValue));
				console.log(total);
			},
			clickDatePicker(type) {
				this.selectType = type
				if (type == 1) {
					this.datetime = this.signTime
				} else {
					this.datetime = this.payTime
				}
				this.showDatePicker = true;
			},
			//确认按钮
			confirm(e) {
				console.log(e)
				const timeFormat = uni.$u.timeFormat;
				this.formData.itemDtoList.forEach((item, index) => {
					this.timeIndex = index
					console.log(this.timeIndex);
				})

				if (this.selectType == 1) {
					this.formData.signTime = timeFormat(e.value, 'yyyy-mm-dd')
				} else {
					console.log('666');
					this.formData.itemDtoList[this.timeIndex].payTime = timeFormat(e.value,
						'yyyy-mm-dd')
				}
				this.showDatePicker = false;
			},
			// 取消按钮
			leftClick() {
				this.showModal = true;
				this.modalTitle = "是否取消";
				this.modalContent = "资料尚未提交，是否取消编辑？"
				//uni.navigateBack() 
			},
			//取消按钮 ==》弹出确认按钮
			confirmModal() {
				uni.navigateBack({
					delta: this.returnPageNumber
				});
			},
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop; // 吧滚动条的高度事实给到old.scrollTop 
			},
			//回到顶部
			backtop() {
				console.log("回到顶部")
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});

			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},

			validateField() {
				if (isEmpty(this.formData.customerName)) {
					uni.$u.toast("请选择客户");
					return false;
				}
				if (isEmpty(this.formData.contractName)) {
					uni.$u.toast("合同标题不能为空");
					return false;
				}
				if (isEmpty(this.formData.amount)) {
					uni.$u.toast("合同总金额不能为空");
					return false;
				}
				if (isEmpty(this.formData.signTime)) {
					uni.$u.toast("请选择合同签订时间");
					return false;
				}
				return true;
			},
			// 保存
			addPlanForm() {
				if (this.validateField() && !this.isClick) {
					// this.isClick = true;
					if (this.formData.amount != this.formData.totalAmount) {
						uni.$u.toast("合同总金额与总付款金额不符")
					}

					if (!isEmpty(this.isEditId)) {
						editPaymentPlan(this.formData, res => {
							if (res.code == 200 && res.success) {
								this.isClick = true;
								uni.$u.toast(res.message);
								uni.$emit('returnPlan', true);
								setTimeout(() => {
									uni.navigateBack({
										delta: this.returnPageNumber
									})
								}, 800)

							} else {
								uni.$u.toast(res.message);
								this.isClick = false;
							}
						})
					} else {
						addPaymentPlan(this.formData, res => {
							if (res.code == 200 && res.success) {
								this.isClick = true;
								uni.$u.toast(res.message);
								uni.$emit('returnPlan', true);
								setTimeout(() => {
									uni.navigateBack({
										delta: this.returnPageNumber
									})
								}, 800)
							} else {
								uni.$u.toast(res.message);
								this.isClick = false;
							}
						})
					}


				}
			},
		},
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	/deep/.navbar {
		.u-navbar__content__left__text span,
		.u-navbar__content__right__text {
			color: #2979ff;
		}
	}

	/deep/.top-height {
		margin-top: 10px;
		background: #fff;
		padding: 0px 16px 5px 16px;
		color: #606266;

		.customer {
			.u-form-item__body__left__content__required {
				right: 80rpx;
				float: right;
				top: 2rpx;
			}
		}

		.contractName {
			.u-form-item__body__left__content__required {
				right: 80rpx;
				float: right;
				top: 2rpx;
			}
		}

		.amount {
			.u-form-item__body__left__content__required {
				right: 10rpx;
				float: right;
				top: 2rpx;
			}
		}

		.signTime {
			.u-form-item__body__left__content__required {
				right: 25rpx;
				float: right;
				top: 2rpx;
			}
		}

		.u-form-item__body__left__content__required {
			right: 23px;
			float: right;
			left: unset;
			top: 2rpx;
		}

		.cashplan {

			// right: 30px;
			.u-form-item__body__left__content__required {
				right: 0;
				float: right;
				left: unset;
				top: 2rpx;
			}

			// float: right;
			// left: 0;
		}

		// .addCash {
		// 	display: flex;
		// 	justify-content: center;
		// 	align-items: center;
		// 	padding: 15px 0;

		// }

		// .u-form-item__body__left__content__required {
		// 	right: 6px;
		// 	float: right;
		// 	left: unset;
		// }

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

		.top-user {
			position: absolute;
			right: 16px;

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

	.main-card {
		// padding: 0 15px;

		// margin-top: 8px;
		.card-title {
			padding: 14px 15px 12px 15px;
			color: #606266;
			font-size: 16px;
		}

		.header {
			background: #fff;
			// height: 73px;
			border-bottom: 1px solid #eee;
			// margin-bottom: 12px;
			padding: 15px 0;

		}

		.content {
			background-color: #fff;

			.top-height {
				/deep/.u-line {
					border: none;
				}
			}
		}



		// .form_content {
		// 	background-color: #fff;
		// 	padding: 0 15px;
		// 	// text-align: right;
		// }

		// /deep/.content {
		// 	// display: flex;
		// 	// flex-direction: column;
		// 	// justify-content: center;
		// 	// align-items: space-between;
		// 	.u-form-item__body {
		// 		display: inline-flex;
		// 	}

		// 	.u-form-item__body__left__content {
		// 		// flex: 1;
		// 	}

		// 	.u-form-item__body__right__content {
		// 		// text-align-last: justify;
		// 		// width: 300px;
		// 	}
		// }


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
			// height: 110px;
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

	.card {
		padding: 0 16px 16px;
		background: #fff;

		/deep/.u-cell {
			border-top: 1px solid rgba(240, 244, 249, 1);

			.u-line {
				border-bottom: none !important;
			}

			.u-cell__body {
				padding: 16px 0px 0px;

				.u-cell__title-text {
					font-size: 16px;
					font-weight: bold;
					color: rgba(48, 49, 51, 1);
				}

				.u-cell__left-icon-wrap {
					margin-right: 8px;
				}

				.logo {
					width: 24px;
					height: 24px;
				}

			}
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


	}

	.movableArea {
		position: fixed;
		top: 0px;
		bottom: 110px;
		left: 0;
		width: 100%;
		height: 75%;
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
