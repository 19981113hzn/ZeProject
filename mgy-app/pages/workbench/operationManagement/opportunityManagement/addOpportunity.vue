<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>
		<u--form :model="opportunityInfo" ref="form1" labelPosition="left" labelWidth="80">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }"
					scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true">
					<view class="top-height">
						<u-form-item label="商机标题" prop="opportunityInfo.name" :required="true" ref="item1">
							<u--input v-model="opportunityInfo.name" border="none" placeholder="请填写" clearable
								:disabled="isDisabled" disabledColor="#ffffff" maxlength="30" @input="searchChange">
							</u--input>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="关联客户" prop="customerName" :required="true" ref="item1" borderBottom
							@click="gotorelatedCustomers(); hideKeyboard()">
							<u--input v-model="customerName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="主要联系人" prop="contactName" ref="item1" borderBottom
							@click="gotorelatedContact(); hideKeyboard()">
							<u--input v-model="contactName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="预计销售金额(元)" prop="opportunityInfo.expectSaleAmount" labelWidth="125"
							borderBottom>
							<u--input v-model="opportunityInfo.expectSaleAmount" border="none" placeholder="请填写"
								clearable maxlength="30" type="number">
							</u--input>
						</u-form-item>
						<u-form-item label="预计签单日期" prop="expectSigningDate" ref="item1" borderBottom labelWidth="105"
							@click="clickDatePicker(1); hideKeyboard()">
							<u--input v-model="opportunityInfo.expectSigningDate" border="none" placeholder="请选择"
								disabled disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="更改销售状态" prop="contactName" ref="item1" :required="true" borderBottom
							labelWidth="110" @click="gotochangeSalesStatus(); hideKeyboard()">
							<u--input v-model="selectSaleStatus.saleStatus" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="关联报价" prop="productQuoteName" ref="item1"
							@click="gotorelatedProduct(); hideKeyboard()">
							<u--input v-model="productQuoteName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="商机来源" prop="bizOpptySourceName" ref="item1" borderBottom
							@click="clickExpense('biz_oppty_source'); hideKeyboard()">
							<u--input v-model="bizOpptySourceName" border="none" placeholder="请选择" disabled
								disabledColor="'#ffffff'" clearable maxlength="30">
							</u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="成交机率" prop="transactionProbabilityName" ref="item1" borderBottom
							@click="clickExpense('transaction_probability'); hideKeyboard()">
							<u--input v-model="transactionProbabilityName" border="none" placeholder="请选择" disabled
								disabledColor="'#ffffff'" clearable maxlength="30">
							</u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="SWOT分析" ref="item1" labelWidth="150"
							@click="SWOTAnalysis(); hideKeyboard()">
							<u--input border="none" disabled disabledColor="#ffffff" clearable maxlength="30">
							</u--input>
							<!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
							<u--image v-if="!isAnalysis" src="/static/img/assist/follw_up_add.png" width="24px"
								height="24px"></u--image>
							<u--image v-if="isAnalysis" src="/static/img/assist/follow_up_reduce.png" width="24px"
								height="24px"></u--image>
						</u-form-item>
						<view v-if="isAnalysis">
							<u-form-item label="分析结果" prop="remark" ref="item1"></u-form-item>
							<view class="swot-bg" @click="gotoSWOTAnalysis">
								<view class="card">
									<view class="card-title">
										<view class="card-title_1">类型</view>
										<view class="card-title_2">建议</view>
									</view>
									<view class="card-value">
										<view class="card-value_1">{{opportunityInfo.swotType}}</view>
										<view class="card-value_2">{{opportunityInfo.swotPropose}}</view>
									</view>
								</view>
							</view>
						</view>

					</view>
					<view class="top-height">
						<u-form-item label="归属人员" prop="belongingPersonnel" :required="true" ref="item1" borderBottom
							@click="clickExpense('chargeUser');isBelongingPersonnel=true; hideKeyboard()">
							<view class="top-user">
								<image class="user-head" src="/static/img/workbench/icon_user_head.png"></image>
								<text class="user-name">{{belongingPersonnel}}</text>
							</view>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="所属部门" prop="departName" ref="item1" borderBottom
							@click="showDepartPicker=true; hideKeyboard()">
							<u--input v-model="departName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="备注信息" prop="remark" ref="item1"></u-form-item>
						<u--textarea v-model="opportunityInfo.remark" border="none" placeholder="请输入备注信息"
							maxlength="300">
						</u--textarea>
					</view>
					<view class="top-height">
						<u-form-item label="创建下次跟进任务" ref="item1" borderBottom labelWidth="150"
							@click="createNextFollowUpTask(); hideKeyboard()">
							<u--input border="none" disabled disabledColor="#ffffff" clearable maxlength="30">
							</u--input>
							<!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
							<u--image v-if="!isCreateNext" src="/static/img/assist/follw_up_add.png" width="24px"
								height="24px"></u--image>
							<u--image v-if="isCreateNext" src="/static/img/assist/follow_up_reduce.png" width="24px"
								height="24px"></u--image>
						</u-form-item>
						<view v-if="isCreateNext">
							<u-form-item label="跟进时间" prop="task.connectTime" ref="item1" :required="true"
								@click="clickDatePicker(2); hideKeyboard()" borderBottom>
								<u--input v-model="opportunityInfo.contactTask.connectTime" border="none"
									placeholder="请选择" clearable disabled disabledColor="#ffffff"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="跟进内容" prop="contactTask.content" ref="item1" borderBottom>
								<u--input v-model="opportunityInfo.contactTask.content" border="none" placeholder="请填写"
									clearable>
								</u--input>
							</u-form-item>
							<u-form-item label="跟进人员" prop="sysUserName" :required="true" ref="item1" borderBottom
								@click="clickExpense('chargeUser');isBelongingPersonnel=false; hideKeyboard()">
								<view class="top-user">
									<image class="user-head" src="/static/img/workbench/icon_user_head.png"></image>
									<text class="user-name">{{sysUserName}}</text>

								</view>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="任务提醒" prop="advance_noticeName" ref="item1" borderBottom
								@click="clickExpense('advance_notice'); hideKeyboard()">
								<u--input v-model="advance_noticeName" border="none" placeholder="请选择" disabled
									disabledColor="#ffffff" clearable maxlength="30"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="提醒方式" prop="reminder_modeName" ref="item1" borderBottom
								@click="clickExpense('reminder_mode'); hideKeyboard()">
								<u--input v-model="reminder_modeName" border="none" placeholder="请选择" disabled
									disabledColor="#ffffff" clearable maxlength="30"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
						</view>
					</view>
					<view class="top-height"></view>
				</scroll-view>
			</view>
			<view class="foot-height">
				<view style="padding: 0 16px;">
					<u-form-item>
						<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="saveBizOppty">
						</u-button>
					</u-form-item>
				</view>
			</view>
	
	</u--form>
		
		<u-picker :show="showPicker" :columns="lstExpense_type" keyName="label" closeOnClickOverlay
			@close="showPicker=false" @cancel="showPicker=false" @confirm="confirmExpense_type"></u-picker>
		<u-picker :show="showDepartPicker" :columns="lstDepart" keyName="departName" closeOnClickOverlay
			@close="showDepartPicker=false" @cancel="showDepartPicker=false" @confirm="confirmDepart"></u-picker>
		<u-datetime-picker :show="showDatePicker" v-model="datetime" :mode="dateMode" :minDate="minDate"
			:maxDate="maxDate" closeOnClickOverlay @close="showDatePicker=false" @cancel="showDatePicker=false"
			@confirm="confirm">
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
		addBizOppty,
		getbizOpptySaleStatus,
		checkBizOpptyName,
		getBizOpptyInfo,
		getBelongDepart,
		editBizOppty
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				navTitle: "新建商机",
				opportunityInfo: {
					name: "", //商机标题
					customerId: "", //客户ID
					contactId: "", //联系人Id
					expectSaleAmount: "", //预计销售金额	
					expectSigningDate: "", //预计签单日期
					bizOpptySource: "", //商机来源 字典：biz_oppty_source
					transactionProbability: "", //成交几率 字典：transaction_probability
					belongUserId: "", //归属人员ID
					belongDepartId: "", //所属部门ID
					remark: "", //备注信息
					swotPropose: "", //SWOT建议
					swotType: "", //SWOT类型
					saleStatusEnd: [], //销售状态-结束
					saleStatusNormalList: [], //销售状态-正常列表
					productQuoteDetailList: [], //产品报价单详情
					contactTask: { //跟进任务
						advanceNoticeCode: "", //	提前通知时间,字典表advance_notice
						emailNotification: 0, //	是否邮件通知 0否 1是
						smsNotification: 0, //	是否短信通知 0否 1是
						systemNotification: 0, //	是否系统通知 0否 1是
						connectTime: "", //	跟进时间	
						content: "", //	跟进内容	
						sysUserId: "", //跟进人员
					},
					productQuoteId:"",//产品报价ID
				},
				customerIndex: "",
				customerName: "", //关联客户
				contactName: "", //主要联系人
				contactIndex: "",
				productQuoteName: "",
				sysUserName: "", //跟进人员
				belongingPersonnel: "", //归属人员
				isBelongingPersonnel: true,
				isCreateNext: false,
				isAnalysis: false,
				showDatePicker: false,
				isExpectSigningDate: true, //默认是预计签单日期
				minDate: "",
				maxDate: "",
				datetime: js_date_time(new Date()),
				biz_oppty_source: [],
				bizOpptySourceName: "", //商机来源
				transaction_probability: [],
				transactionProbabilityName: "", //成交几率
				modalContent: "",
				modalTitle: "",
				showModal: false,
				returnPageNumber: 1,
				showPicker: false,
				lstExpense_type: [],
				reminder_mode: [
					[{
							value: "systemNotification",
							label: "系统消息"
						},
						{
							value: "emailNotification",
							label: "邮件通知"
						},
						{
							value: "smsNotification",
							label: "短信通知"
						},
					],
				], //提醒方式
				reminder_modeName: "", ////提醒方式名称
				advance_notice: [], //任务提醒
				advance_noticeName: "", //任务提醒名称
				isClick: false, //防止重复点击保存按钮
				saleStatusNormalList: [], //销售状态列表
				selectSaleStatus: {}, //选中的销售状态
				selectedProducts: [],
				dateMode:"date",
				bizOpptyId:"",
				lstDepart:[],
				showDepartPicker:false,
				departName:"",
				departId:"",
				isDisabled:false,
			}
		},
		onLoad(option) {
			console.log(option);
			this.bizOpptyId=option.id || "";
			this.transaction_probability.push(getApp().globalData.transaction_probability) //成交几率
			this.biz_oppty_source.push(getApp().globalData.biz_oppty_source) //商机来源
			this.advance_notice.push(getApp().globalData.advance_notice) //任务提醒

			let date = new Date()
			date.setFullYear(date.getFullYear() + 10);
			this.minDate = Date.parse(new Date());
			this.maxDate = Date.parse(new Date(date));

			this.userInfo = this.$cache.get('_userInfo')
			this.opportunityInfo.belongUserId = this.userInfo.id //	归属人员ID
			this.getDepartData(this.opportunityInfo.belongUserId);
			this.belongingPersonnel = this.userInfo.realname //归属人员
			this.sysUserName = this.userInfo.realname //跟进人员名称
			this.opportunityInfo.contactTask.sysUserId = this.userInfo.id


			if (!isEmpty(this.bizOpptyId)) { //编辑回填数据
				this.navTitle = "编辑商机"
				this.isDisabled = true
				this.getUpdata();
			}
		},
		onShow() {
			// this.selectedProducts = uni.getStorageSync("select_list")
			// console.log(this.selectedProducts);
			uni.$once('returnCustomer', res => {
				console.log(res)
				this.customerName = res.customerName; //客户名称
				this.opportunityInfo.customerId = res.customerId; //客户ID
				this.contactName = ""; //联系人名称
				this.opportunityInfo.contactId = ""; //联系人ID
			});
			uni.$once('returnContact', res => {
				console.log(res)
				this.contactName = res.contactName; //联系人名称
				this.opportunityInfo.contactId = res.contactId; //联系人ID
			});
			uni.$once('returnSWOT', res => {
				console.log(res)
				this.opportunityInfo.swotPropose = res.swotPropose; //SWOT建议
				this.opportunityInfo.swotType = res.swotType; //SWOT类型
				this.isAnalysis = true;
			});
			// uni.$once('returnOffer', res => {
			// 	if (res) {
			// 		let lst = this.$cache.get('_saveQuotaList');
			// 		this.opportunityInfo.productQuoteDetailList = lst
			// 		this.relatedProduct = "已关联" + this.opportunityInfo.productQuoteDetailList.length + "产品"
			// 		console.log(lst)
			// 	}
			// });
			uni.$once('returnProductQuote', res => {
				this.opportunityInfo.productQuoteId = res.productQuoteId
				this.productQuoteName = res.productQuoteName
			});
			uni.$once('returnSalesStatus', res => {
				if (res) {
					this.saleStatusNormalList = this.$cache.get('_sjSalesStatusData');
					let arr = [];
					if (this.saleStatusNormalList.saleStatusEnd.complete) {
						this.selectSaleStatus = this.saleStatusNormalList.saleStatusEnd
					} else {
						for (let i = 0; i < this.saleStatusNormalList.saleStatusNormalList.length; i++) {
							let item = this.saleStatusNormalList.saleStatusNormalList[i]
							if (item.complete) {
								arr.push(item)
							}
						}
						if(arr.length == 0){
							//this.saleStatusNormalList.saleStatusNormalList[0].complete=true;
							this.selectSaleStatus = this.saleStatusNormalList.saleStatusNormalList[0]
						}else{
							this.selectSaleStatus = arr[arr.length - 1];
						}
					}

				}

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
						this.opportunityInfo.belongUserId = chargeId
						this.getDepartData(this.opportunityInfo.belongUserId);
					} else {
						this.sysUserName = UserName
						this.opportunityInfo.contactTask.sysUserId = chargeId
					}

				}
			})
		},
		methods: {
			getUpdata() {
				let params = '/' + this.bizOpptyId;
				getBizOpptyInfo(params, res => {
					if (res.code == 200 && res.success) {
						console.log('详情-res:', res)
						let data = res.result;

						this.belongingPersonnel = data.belongUserName
						this.opportunityInfo.belongUserId = data.belongUserId
						this.getDepartData(this.opportunityInfo.belongUserId);

						this.opportunityInfo.id = data.id;
						this.opportunityInfo.name = data.name
						this.customerName = data.customerName; //客户名称
						this.opportunityInfo.customerId = data.customerId; //客户ID
						this.contactName = data.contactName; //联系人名称
						this.opportunityInfo.contactId = data.contactId; //联系人ID
						this.opportunityInfo.expectSaleAmount = data.expectSaleAmount; //预计销售金额
						this.opportunityInfo.expectSigningDate = isEmpty(data.expectSigningDate) ? '' : data
							.expectSigningDate.substring(0, 10); //预计销售金额

						this.selectSaleStatus.saleStatus = data.saleStatus //销售状态

						this.opportunityInfo.swotPropose = data.swotPropose; //SWOT建议
						this.opportunityInfo.swotType = data.swotType; //SWOT类型
						this.isAnalysis = true;

						this.opportunityInfo.remark = data.remark; //备注信息

						this.biz_oppty_source[0].forEach(v => { //商机来源
							if (v.value == data.bizOpptySource) {
								this.opportunityInfo.bizOpptySource = data.bizOpptySource;
								this.bizOpptySourceName = v.label;
							}
						})

						this.transaction_probability[0].forEach(v => { //商机来源
							if (v.value == data.transactionProbability) {
								this.opportunityInfo.transactionProbability = data.transactionProbability;
								this.transactionProbabilityName = v.label;
							}
						})
						
						this.opportunityInfo.productQuoteId = data.productQuoteId
						this.productQuoteName=data.productQuoteName
						
						this.transaction_probability[0].forEach(v => { //所属部门
							if (v.value == data.belongDepartId) {
								this.departName=data.belongDepart;
								this.opportunityInfo.belongDepartId=data.belongDepartId;
							}
						})
						
					}
				})
			},
			getDepartData(id) {
				this.lstDepart = [];
				getBelongDepart(id, res => {
					if (res.code == 200 && res.success) {
						this.lstDepart.push(res.result);
						this.departName = res.result.length == 0 ? '' : res.result[0].departName;
						this.opportunityInfo.belongDepartId = res.result.length == 0 ? '' : res.result[0].departId;
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			confirmDepart(e) {
				//console.log(e);
				this.departName = e.value[0].departName;
				this.opportunityInfo.belongDepartId = e.value[0].departId;
				this.showDepartPicker = false;
			},
			searchChange() {
				if (!this.isDisabled) {
					checkBizOpptyName("?name=" + this.opportunityInfo.name, res => {
						if (res.code == 200 && res.success) {

						} else {
							uni.$u.toast(res.message);
						}
					})
				}

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
			clickExpense(type) {
				this.selectType = type
				switch (type) {
					case 'biz_oppty_source': //商机来源
						this.lstExpense_type = this.biz_oppty_source;
						this.showPicker = true;
						break;

					case 'transaction_probability': //成交几率
						this.lstExpense_type = this.transaction_probability;
						this.showPicker = true;
						break;

					case 'advance_notice': //任务提醒
						this.lstExpense_type = this.advance_notice;
						this.showPicker = true;
						break;

					case 'reminder_mode': //提醒方式
						this.lstExpense_type = this.reminder_mode;
						this.showPicker = true;
						break;

					case 'chargeUser':
						let title = this.isBelongingPersonnel ? '归属人员' : '跟进人员'
						uni.navigateTo({
							url: "/pages/filter-all/select-more?total=1000" + "&title=" + title + '&isMutiple=true'
						});
						break;

				}
			},
			// 确认按钮
			confirmExpense_type(e) {
				console.log(e);
				let type = this.selectType
				switch (type) {
					case 'biz_oppty_source': //商机来源
						this.opportunityInfo.bizOpptySource = e.value[0].value + '';
						this.bizOpptySourceName = e.value[0].label;
						break;

					case 'transaction_probability': //成交几率
						this.opportunityInfo.transactionProbability = e.value[0].value + '';
						this.transactionProbabilityName = e.value[0].label;
						break;
					case 'advance_notice': //任务提醒
						this.opportunityInfo.contactTask.advanceNoticeCode = e.value[0].value + '';
						this.advance_noticeName = e.value[0].label;
						break;

					case 'reminder_mode': //提醒方式
						if (e.value[0].value == 'systemNotification') { //是否系统通知
							this.opportunityInfo.contactTask.systemNotification = 1;
							this.opportunityInfo.contactTask.smsNotification = 0;
							this.opportunityInfo.contactTask.emailNotification = 0;
						} else if (e.value[0].value == 'smsNotification') { //是否短信通知 
							this.opportunityInfo.contactTask.smsNotification = 1;
							this.opportunityInfo.contactTask.systemNotification = 0;
							this.opportunityInfo.contactTask.emailNotification = 0;
						} else if (e.value[0].value == 'emailNotification') { //是否邮件通知 0否 1是
							this.opportunityInfo.contactTask.emailNotification = 1;
							this.opportunityInfo.contactTask.systemNotification = 0;
							this.opportunityInfo.contactTask.smsNotification = 0;
						}
						this.reminder_modeName = e.value[0].label;
						break;

				}

				this.showPicker = false;
			},
			//关联客户
			gotorelatedCustomers() {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/relatedCustomers?customerId=" + this.opportunityInfo
						.customerId
				})
			},
			//更改销售状态
			gotochangeSalesStatus() {
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/opportunityManagement/changeSalesStatus?bizOpptyId=" +
						this.bizOpptyId
				})
			},
			// 关联产品
			gotorelatedProduct() {
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/opportunityManagement/relatedQuotation?productQuoteId=" + this.opportunityInfo.productQuoteId
				})
				// if (isEmpty(this.bizOpptyId)) {
				// 	uni.navigateTo({
				// 		url: "/pages/product/productManagement/relatedProduct" + '?isAddOpp=1'
				// 	})
				// } else {
				// 	uni.navigateTo({
				// 		url: "/pages/workbench/operationManagement/opportunityManagement/confirmQuotation?returnNumber=1&bizOpptyId=" +
				// 			this.bizOpptyId
				// 	})
				// }

			},
			// 主要联系人
			gotorelatedContact() {
				if (isEmpty(this.opportunityInfo.customerId)) {
					uni.$u.toast("请先选择关联客户");
					return false;
				} else {
					uni.navigateTo({
						url: "/pages/assist/businessManagement/relatedContact?contactId=" + this.opportunityInfo
							.contactId + "&customerId=" + this.opportunityInfo.customerId
					})
				}

			},
			clickDatePicker(type) {

				if (type == 1) {
					this.datetime = this.opportunityInfo.expectSigningDate
					this.isExpectSigningDate = true
					this.dateMode = 'date'
				} else {
					this.datetime = this.opportunityInfo.contactTask.connectTime
					this.isExpectSigningDate = false
					this.dateMode = 'datetime'
				}
				this.showDatePicker = true;
			},
			//确认按钮
			confirm(e) {
				const timeFormat = uni.$u.timeFormat;
				if (this.isExpectSigningDate) {
					this.opportunityInfo.expectSigningDate = timeFormat(e.value, 'yyyy-mm-dd');
				} else {
					this.opportunityInfo.contactTask.connectTime = timeFormat(e.value, 'yyyy-mm-dd hh:MM');
				}

				this.showDatePicker = false;
				//console.log(e)
			},
			//创建下次跟进任务
			createNextFollowUpTask() {
				if (this.isCreateNext) {
					this.isCreateNext = false
				} else {
					this.isCreateNext = true
				}
			},
			//SWOTAnalysis
			SWOTAnalysis() {
				if (!this.isAnalysis) {
					uni.navigateTo({
						url: '/pages/workbench/operationManagement/opportunityManagement/SWOTAnalysis'
					})
				} else {
					this.isAnalysis = false;
					this.opportunityInfo.swotPropose = ""; //SWOT建议
					this.opportunityInfo.swotType = ""; //SWOT类型
				}
			},
			gotoSWOTAnalysis() {
				uni.navigateTo({
					url: '/pages/workbench/operationManagement/opportunityManagement/SWOTAnalysis'
				})
			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			//验证数据
			validateField() {
				if (isEmpty(this.opportunityInfo.name)) {
					uni.$u.toast("商机标题不能为空");
					return false;
				}
				if (isEmpty(this.opportunityInfo.customerId)) {
					uni.$u.toast("请选择关联客户");
					return false;
				}
				if (this.isCreateNext) {
					if (isEmpty(this.opportunityInfo.contactTask.connectTime)) {
						uni.$u.toast("跟进时间不能为空");
						return false;
					}
					if (isEmpty(this.opportunityInfo.contactTask.sysUserId)) {
						uni.$u.toast("跟进人员不能为空");
						return false;
					}
				} else {
					this.opportunityInfo.contactTask = null
				}
				return true;
			},
			saveBizOppty() {
				this.opportunityInfo.saleStatusEnd = this.saleStatusNormalList.saleStatusEnd
				this.opportunityInfo.saleStatusNormalList = this.saleStatusNormalList.saleStatusNormalList
				if (this.validateField() && !this.isClick) {
					this.isClick = true;
					console.log(this.opportunityInfo)
					if (!isEmpty(this.bizOpptyId)) {
						//let data={};
						if (isEmpty(this.opportunityInfo.saleStatusEnd)) {
							let {
								saleStatusEnd,
								...data
							} = this.opportunityInfo;
							this.opportunityInfo = data
							//console.log(data)
						}
						if (isEmpty(this.opportunityInfo.saleStatusNormalList)) {
							let {
								saleStatusNormalList,
								...data
							} = this.opportunityInfo;
							this.opportunityInfo = data
							//console.log(data)
						}
						// if (isEmpty(this.opportunityInfo.productQuoteDetailList)) {
						// 	let {
						// 		productQuoteDetailList,
						// 		...data
						// 	} = this.opportunityInfo;
						// 	this.opportunityInfo = data
						// 	console.log(data)
						// }
						console.log(this.opportunityInfo)
						editBizOppty(this.opportunityInfo,res=>{
							if (res.code == 200 && res.success) {
								uni.$u.toast(res.message);
								this.$cache.delete('_sjSalesStatusData')
								// this.empty();
								uni.$emit('return', true);
								uni.navigateBack({
									delta: this.returnPageNumber
								})
							} else {
								uni.$u.toast(res.message);
								this.isClick = false;
							}
						})
					} else {
						addBizOppty(this.opportunityInfo, res => {
							if (res.code == 200 && res.success) {
								uni.$u.toast(res.message);
								this.$cache.delete('_sjSalesStatusData')
								// this.empty();
								uni.$emit('return', true);
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

			}
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

		// padding: 0 16px;
		.u-form-item {
			padding: 0 16px;
		}

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
