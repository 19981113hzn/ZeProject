<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>
		<u--form :model="paymentForm" ref="form1" labelPosition="left" labelWidth="80">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }"
					scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true">
					<view class="top-height">
						<u-form-item label="付款日期" prop="paymentForm.payedTime" ref="item1" :required="true" borderBottom
							@click="clickDatePicker(1); hideKeyboard()">
							<u--input v-model="paymentForm.payedTime" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item class="amount" label="付款金额(元)" prop="paymentForm.amount" :required="true"
							labelWidth="125" borderBottom>
							<u--input v-model="paymentForm.amount" border="none" placeholder="请填写" clearable
								maxlength="30" type="digit">
							</u--input>
						</u-form-item>
						<u-form-item label="关联客户" prop="paymentForm.customerName" ref="item1" borderBottom
							@click="gotorelatedCustomers(); hideKeyboard()">
							<u--input v-model="paymentForm.customerName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="关联合同" prop="paymentForm.contractName" ref="item1" :required="true"
							borderBottom @click="gotorelatedContracts(); hideKeyboard()">
							<u--input v-model="paymentForm.contractName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<!-- <u-form-item label="关联合同" prop="paymentForm.contractName" :required="true" ref="item1"
							borderBottom @click="clickExpense('related_contract'); hideKeyboard()">
							<u--input v-model="paymentForm.contractName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item> -->
						<u-form-item label="付款期次" prop="period" ref="item1" :required="true" borderBottom
							@click="clickExpense('cash_plan_periods'); hideKeyboard()">
							<u--input v-model="period" border="none" placeholder="请选择" disabled disabledColor="#ffffff"
								clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="付款方式" prop="payType" ref="item1" borderBottom
							@click="clickExpense('pay_type'); hideKeyboard()">
							<u--input v-model="payType" border="none" placeholder="请选择" disabled disabledColor="#ffffff"
								clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="关联发票" prop="paymentForm.invoiceName" ref="item1" borderBottom
							@click="clickExpense(); hideKeyboard()">
							<u--input v-model="paymentForm.invoiceName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item class="collection_person" label="付款所属人" labelWidth="85" prop="belongingPersonnel"
							:required="true" ref="item1" borderBottom
							@click="clickExpense('chargeUser');isBelongingPersonnel=true;hideKeyboard()">
							<view class="top-user">
								<image class="user-head" src="/static/img/workbench/icon_user_head.png"></image>
								<text class="user-name">{{belongingPersonnel}}</text>
							</view>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="备注信息" prop="paymentForm.remark" ref="item1"></u-form-item>
						<u--textarea v-model="paymentForm.remark" border="none" placeholder="请输入备注信息" maxlength="300">
						</u--textarea>
					</view>
					<view class="top-height">
						<u-form-item label="通知人员" @click="clickUser();isBelongingPersonnel=false; hideKeyboard()">
							<u--input v-model="paymentForm.userName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view class="top-height"></view>
				</scroll-view>
			</view>
			<view class="foot-height">
				<view style="padding: 0 16px;">
					<u-form-item>
						<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="savePayment">
						</u-button>
					</u-form-item>
				</view>
			</view>

		</u--form>

		<u-picker :show="showPicker" :columns="lstExpense_type" keyName="label" closeOnClickOverlay
			@close="showPicker=false" @cancel="showPicker=false" @confirm="confirmExpense_type"></u-picker>
		<!-- <u-picker :show="showDepartPicker" :columns="lstDepart" keyName="departName" closeOnClickOverlay
			@close="showDepartPicker=false" @cancel="showDepartPicker=false" @confirm="confirmDepart"></u-picker> -->
		<u-datetime-picker :show="showDatePicker" v-model="datetime" mode="date" :minDate="minDate" :maxDate="maxDate"
			closeOnClickOverlay @close="showDatePicker=false" @cancel="showDatePicker=false" @confirm="confirm">
		</u-datetime-picker>
		<u-modal :content="modalContent" :show="showModal" :title="modalTitle" showCancelButton closeOnClickOverlay
			@confirm="confirmModal" @cancel="showModal=false" @close="showModal=false"></u-modal>
	</view>
</template>

<script>
	import {
		js_date_time,
		GetNowFormatDate
	} from "@/util/js_DateTime.js"
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		addPayment,
		editPayment,
		getProcessStartVariablesByBizCode,
		getDictItemsByCode
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				navTitle: "添加付款记录",
				userName: "",
				assistId: "",
				isEditId: "",
				paymentForm: {
					itemId: '',
					payedTime: '',
					amount: '',
					customerId: '',
					customerName: '',
					contractId: '',
					contractName: '',
					period: '',
					planId: '',
					payType: '',
					invoiceName: '',
					remark: '',
					userId: '',
					projectId: '',
					userName: '',
					vars: []
				},
				lsu: [],
				period: "",
				payType: '',
				customerIndex: "",
				contactIndex: "",
				relatedProduct: "",
				belongingPersonnel: "", //归属人员
				isBelongingPersonnel: true,
				showDatePicker: false,
				ispayedTime: true, //默认是预计签单日期
				minDate: "",
				maxDate: "",
				datetime: js_date_time(new Date()),
				related_contract: [], //关联合同				
				cash_plan_periods: [], //付款期次				
				pay_type: [], //付款方式		
				modalContent: "",
				modalTitle: "",
				showModal: false,
				returnPageNumber: 1,
				showPicker: false,
				selectType: '',
				lstExpense_type: [],
				isClick: false, //防止重复点击保存按钮
				dateMode: "date",
				showDepartPicker: false,
				departName: "",
				departId: "",
				isDisabled: false,

			}
		},
		onLoad(option) {
			console.log(option);
			// this.returnPageNumber = option.returnPageNumber
			// 付款计划——添加付款记录
			// this.isAddId = option.addPaymentId || ""
			this.isEditId = option.editPaymentId || ""

			// 付款管理——编辑付款单
			if (this.isEditId) {
				this.navTitle = "编辑付款单"
				let editData = uni.getStorageSync("editItem")
				let lstActiviti = uni.getStorageSync("lstActiviti")
				this.paymentForm = editData
				this.paymentForm.payedTime = editData.time
				this.period = editData.period
				this.payType = editData.payTypeName
				this.belongingPersonnel = editData.userName ? editData.userName : editData.createBy
				this.paymentForm.vars = lstActiviti
			}
			this.getStartVariables()
			this.pay_type.push(getApp().globalData.pay_type)
			console.log(this.related_contract);
			this.userInfo = this.$cache.get('_userInfo')

			let date1 = new Date()
			let date2 = new Date()
			// console.log(date);
			date1.setFullYear(date1.getFullYear() - 10);
			date2.setFullYear(date2.getFullYear() + 10);
			this.minDate = Date.parse(new Date(date1));
			this.maxDate = Date.parse(new Date(date2));
		},
		onShow() {
			// this.selectedProducts = uni.getStorageSync("select_list")
			// console.log(this.selectedProducts);
			uni.$once('returnCustomer', res => {
				console.log(res)
				this.paymentForm.customerName = res.customerName; //客户名称
				this.paymentForm.customerId = res.customerId; //客户ID
			});
			uni.$once('returnContract', res => {
				console.log(res)
				this.paymentForm.contractName = res.contractName; //合同名称
				this.paymentForm.contractId = res.contractId; //合同ID
				this.getCollectionPeriod()
			});


			uni.$once('resultSelectUser', res => {
				let lstSelectUser = uni.getStorageSync('lstSelectUser') //1*60*60*24*7
				console.log('lstSelectUser', lstSelectUser)
				if (lstSelectUser) {
					let UserName = ''
					let chargeId = ''
					lstSelectUser.forEach(v => {
						UserName = v.name;
						console.log('跟进人员', v.name)
						chargeId = v.id;
					})
					if (this.isBelongingPersonnel) {
						this.belongingPersonnel = UserName
						// this.paymentForm.belongUserId = chargeId
						// this.getDepartData(this.paymentForm.belongUserId);
					} else {
						this.paymentForm.userName = "已选择" + lstSelectUser.length + "人"
						this.assistId = chargeId
					}

				}
			})
		},
		methods: {
			// 流程接口
			getStartVariables() {
				getProcessStartVariablesByBizCode("COLLECTION ", res => {
					if (res.code == 200 && res.success) {
						console.log(res.result);
						for (let i = 0; i < res.result.length; i++) {
							let item = res.result[i]
							let info = {
								variableName: item.variableName,
								variableValue: item.variableType,
								variableNameCn: item.variableNameCn
							}
							this.paymentForm.vars.push(info)

						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			clickUser() {
				uni.navigateTo({
					url: "/pages/filter-all/select-more?total=1000" + "&title=通知人员"
				});
			},

			leftClick() {
				this.showModal = true;
				this.modalTitle = "是否取消";
				this.modalContent = "资料尚未提交，是否取消编辑？";
			},
			//取消按钮 ==》弹出确认按钮
			confirmModal() {
				this.$cache.delete('_sjSalesStatusData')
				if (this.deleteContact) {
					this.confirmDelete();
				} else {
					uni.navigateBack({
						delta: this.returnPageNumber
					});
				}

			},

			// 查询付款期次
			getCollectionPeriod() {
				let data = "?contractId=" + this.paymentForm.contractId +
					"&pageNo=1&pageSize=10"
				getDictItemsByCode()
				// getDictItemsByCode(data, res => {
				// 	if (res.code == 200 && res.success) {
				// 		console.log(res.result.records);
				// 		let collectionInfo = res.result.records
				// 		this.lsu = collectionInfo.map(item => {
				// 			console.log(item);
				// 			return {
				// 				itemId: item.id,
				// 				label: `第${item.period}期`,
				// 				planId: item.planId,
				// 				value: item.period
				// 			}
				// 		})

				// 		console.log(this.lsu);
				// 	} else {
				// 		uni.$u.toast("该合同暂无期次");
				// 		let arr = []
				// 		arr.push({
				// 			label: '暂无期次',
				// 			value: ""
				// 		})
				// 		this.lsu = arr
				// 		console.log(this.lsu);


				// 	}
				// })


			},
			clickExpense(type) {
				this.selectType = type
				switch (type) {
					case 'related_contract': //关联合同
						this.lstExpense_type = this.related_contract;
						this.showPicker = true;
						break;

					case 'cash_plan_periods': //付款期次
						if (isEmpty(this.paymentForm.contractId)) {
							uni.$u.toast("请先选择关联合同");
							this.showPicker = false;
							return false;
						} else {
							this.lstExpense_type = []
							this.lstExpense_type.push(this.lsu)
							this.showPicker = true;
						}

						break;
					case 'pay_type': //付款方式
						this.lstExpense_type = this.pay_type;
						this.showPicker = true;
						break;

					case 'chargeUser': //付款所属人
						let title = '付款所属人'
						uni.navigateTo({
							url: "/pages/filter-all/select-more?total=1000" + "&title=" + title +
								'&isMutiple=true'
						});
						break;

				}
			},
			// 确认按钮
			confirmExpense_type(e) {
				console.log(e);
				let type = this.selectType
				switch (type) {
					case 'related_contract':
						// this.paymentForm.bizOpptySource = e.value[0].value + '';
						this.paymentForm.contractName = e.value[0].label;
						break;

					case 'cash_plan_periods':
						// this.paymentForm.transactionProbability = e.value[0].value + '';
						this.paymentForm.itemId = e.value[0].itemId;
						if (e.value[0].label == '暂无期次') {
							uni.$u.toast("请重新选择合同")
							this.period = e.value[0].value;
						} else {
							this.period = e.value[0].label;
						}
						this.paymentForm.period = e.value[0].value
						this.paymentForm.planId = e.value[0].planId;

						break;
					case 'pay_type':
						// this.paymentForm.transactionProbability = e.value[0].value + '';
						this.payType = e.value[0].label
						this.paymentForm.payType = e.value[0].value
						break;
				}
				this.showPicker = false;
			},
			//关联客户
			gotorelatedCustomers() {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/relatedCustomers?customerId=" + this
						.paymentForm
						.customerId
				})
			},
			//关联合同
			gotorelatedContracts() {
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/contractManagement/relatedContracts?contractId=" +
						this
						.paymentForm
						.contractId
				})
			},
			clickDatePicker(type) {

				if (type == 1) {
					this.datetime = this.paymentForm.payedTime
					this.ispayedTime = true
					this.dateMode = 'date'
				} else {
					this.datetime = this.paymentForm.contactTask.connectTime
					this.ispayedTime = false
					this.dateMode = 'datetime'
				}
				this.showDatePicker = true;
			},
			//确认按钮
			confirm(e) {
				const timeFormat = uni.$u.timeFormat;
				if (this.ispayedTime) {
					this.paymentForm.payedTime = timeFormat(e.value, 'yyyy-mm-dd');
				} else {
					this.paymentForm.contactTask.connectTime = timeFormat(e.value, 'yyyy-mm-dd hh:MM');
				}

				this.showDatePicker = false;
				//console.log(e)
			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			//验证数据
			validateField() {
				if (isEmpty(this.paymentForm.payedTime)) {
					uni.$u.toast("请选择付款日期");
					return false;
				}
				if (isEmpty(this.paymentForm.amount)) {
					uni.$u.toast("请填写付款金额");
					return false;
				}
				if (isEmpty(this.paymentForm.customerId)) {
					uni.$u.toast("请选择关联合同");
					return false;
				}
				if (isEmpty(this.period)) {
					uni.$u.toast("请选择付款期次");
					return false;
				}
				if (isEmpty(this.belongingPersonnel)) {
					uni.$u.toast("请选择付款所属人");
					return false;
				}
				return true;
			},

			savePayment() {
				if (this.validateField() && !this.isClick) {
					let data = this.paymentForm
					console.log(data);
					// 从付款计划详情和付款管理的添加按钮—添加付款单
					if (!this.isEditId) {
						addPayment(data, res => {
							if (res.code == 200 && res.success) {
								console.log(res);
								this.isClick = true;
								uni.$u.toast(res.message);
								uni.$emit('returnPlanItem', true);
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
						// 编辑付款单
						editPayment(data, res => {
							if (res.code == 200 && res.success) {
								console.log(res);
								this.isClick = true;
								uni.$u.toast(res.message);
								uni.$emit('returnPlanItem', true);
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
				// this.paymentForm.amount = Number(this.paymentForm.amount)
				// this.paymentForm.period = this.period

			},



			// 	}

			// }
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	/deep/.top-height {
		margin-top: 10px;
		background: #fff;

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

		// padding: 0 16px;
		.u-form-item {
			padding: 0 16px;
		}

		.amount {
			.u-form-item__body__left__content__required {
				right: 25px;
				float: right;
				left: unset;
			}
		}

		.collection_person {
			.u-form-item__body__left__content__required {
				right: -2px;
				float: right;
				left: unset;
			}
		}

		.u-form-item__body__left__content__required {
			// top: 0;
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

		.top-user-gx {
			position: absolute;
			right: 16px;

			.user-gx {
				width: 24px;
				height: 24px;
				position: relative;
				top: 2px;
				right: 6px;
			}

			.user-gx-name {
				position: relative;
				top: -5px;
				color: rgba(0, 114, 255, 1);
			}
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

		.u-switch {
			position: absolute;
			right: 16px;
		}

		.addContact {
			width: 100%;
			text-align: center;

			.contact-people {
				color: rgba(0, 114, 255, 1);
				font-size: 16px;
				position: relative;
				top: -5px;
			}

			.contact-star {
				color: #f56c6c;
				line-height: 20px;
				font-size: 20px;
				position: relative;
				left: 4px;
				top: -1px;

			}
		}

		.logo {
			width: 24px;
			height: 24px;
		}

		.primary-contact {
			.u-cell__body {
				padding: 10px 16px;

				.u-cell-text {
					font-size: 16px;
					font-weight: bold;
					color: rgba(48, 49, 51, 1);
					margin-left: 8px;
					float: left;
				}

				.u-fade-enter-active {
					width: 75px;
					display: block;
					float: left;
				}

				.u-tag-wrapper {
					position: relative;
					width: 73px;
					text-align: center;
					left: 14px;
				}

				.logo {
					width: 24px;
					height: 24px;
				}

				.logo-delete {
					width: 24px;
					height: 24px;
					right: 18px;
				}

				.logo-icon {
					background: rgba(0, 114, 255, 1);
					width: 40px;
					height: 40px;
					border-radius: 8px;

					.logo-icon-txt {
						font-size: 14px;
						text-align: center;
						border-radius: 5px;
						padding: 4px;
						color: #fff;
						line-height: 32px;
					}
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

		.u-textarea__field {
			padding: 0 16px;
		}

		.swot-bg {
			height: 90px;
			/* border: 1px solid; */
			padding: 0 16px 16px;

			.card {
				border: 0.5px solid;
				height: 74px;
				border-radius: 4px;
				border-color: rgba(0, 114, 255, 0.8000);

				.card-title {
					display: block;
					background: rgba(239, 246, 255, 1);
					height: 37px;
					border-bottom: 1px solid;
					border-bottom-color: rgba(0, 114, 255, 0.8000);
					border-radius: 4px 4px 0 0;

					.card-title_1 {
						width: 35%;
						height: 37px;
						border-right: 1px solid;
						border-right-color: rgba(0, 114, 255, 0.8000);
						text-align: center;
						line-height: 37px;
						float: left;
						color: rgba(96, 98, 102, 1);
					}

					.card-title_2 {
						width: 64%;
						height: 37px;
						text-align: center;
						line-height: 37px;
						float: right;
						color: rgba(96, 98, 102, 1);
					}
				}

				.card-value {
					display: block;
					height: 37px;
					color: rgba(48, 49, 51, 1);
					text-align: center;
					line-height: 37px;

					.card-value_1 {
						width: 35%;
						height: 37px;
						border-right: 1px solid;
						border-right-color: rgba(0, 114, 255, 0.8000);
						float: left;
					}

					.card-value_2 {
						width: 64%;
						height: 37px;
						float: right;
					}
				}
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
