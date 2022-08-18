<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>
		<u--form :model="clueSourceForm" ref="form1" labelPosition="left" labelWidth="80" :rules="rules">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }"
					scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true">
					
					<view class="top-height">
						<u-form-item label="客户名称" prop="clue.customer" >
							<u--input v-model="clueSourceForm.clue.customer" border="none" placeholder="请填写" clearable
							 maxlength="30">
							</u--input>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="联系人姓名" prop="clue.contacts" :required="true" labelWidth="94" borderBottom>
							<u--input v-model="clueSourceForm.clue.contacts" border="none" placeholder="请填写" clearable
							 maxlength="30">
							</u--input>
						</u-form-item>
						<u-form-item label="性别" prop="sexName" ref="item1" borderBottom
							@click="clickExpense('sex'); hideKeyboard()">
							<u--input v-model="sexName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="手机号码" prop="clue.phone" :required="true" borderBottom>
							<u--input v-model="clueSourceForm.clue.phone" border="none" placeholder="请填写" clearable
							 maxlength="11" type="number">
							</u--input>
						</u-form-item>
						<u-form-item label="电子邮箱" prop="clue.email">
							<u--input v-model="clueSourceForm.clue.email" border="none" placeholder="请填写" clearable
							 maxlength="30">
							</u--input>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="线索来源" prop="clue_sourceName" ref="item1" borderBottom
							@click="clickExpense('clue_source'); hideKeyboard()">
							<u--input v-model="clue_sourceName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="线索状态" prop="clue_statusName" ref="item1"
							@click="clickExpense('clue_status'); hideKeyboard()">
							<u--input v-model="clue_statusName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<!-- <view class="top-height">
						<u-form-item label="备注信息" prop="clue.remark" ref="item1"></u-form-item>
						<u--textarea v-model="clueSourceForm.clue.remark" border="none" placeholder="请输入备注信息"
							maxlength="300">
						</u--textarea>
					</view> -->
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
								@click="clickDatePicker(); hideKeyboard()" borderBottom>
								<u--input v-model="clueSourceForm.task.connectTime" border="none"
									placeholder="请选择" clearable disabled disabledColor="#ffffff"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="跟进内容" prop="task.content" ref="item1" borderBottom>
								<u--input v-model="clueSourceForm.task.content" border="none" placeholder="请填写"
									clearable>
								</u--input>
							</u-form-item>
							<u-form-item label="跟进人员" prop="sysUserName" :required="true" ref="item1" borderBottom
								@click="clickExpense('chargeUser'); hideKeyboard()">
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
						<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="saveClueSource">
						</u-button>
					</u-form-item>
				</view>
			</view>
			
			
		</u--form>
		<u-picker :show="showPicker" :columns="lstExpense_type" keyName="label" closeOnClickOverlay
			:defaultIndex="defaultIndex" @close="showPicker=false" @cancel="showPicker=false"
			@confirm="confirmExpense_type"></u-picker>
		<u-datetime-picker :show="showDatePicker" v-model="datetime" mode="datetime" :minDate="minDate"
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
		addClueSource,
		editClueSource,
		getClueInfoById
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				navTitle: "新建线索",
				clueSourceForm:{
					clue:{ //客户线索
						customer:"",//客户姓名
						contacts:"",//联系人姓名
						sex:0,//性别(0-默认未知,1-男,2-女)
						phone:"",//电话
						email:"",//电子邮箱
						clueSource:"",//线索来源
						clueStatus:"",//线索状态
						chargeId:"",//负责人
					},
					falg:false,//是否创建跟进任务
					task:{ //跟进信息
						advanceNoticeCode: "", //	提前通知时间,字典表advance_notice
						emailNotification: 0, //	是否邮件通知 0否 1是
						smsNotification: 0, //	是否短信通知 0否 1是
						systemNotification: 0, //	是否系统通知 0否 1是
						connectTime: "", //	跟进时间	
						content: "", //	跟进内容	
						sysUserId: "", //跟进人员
					},
				},
				rules: {
					'clue.phone': [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],
				},
				showPicker: false,
				lstExpense_type: [],
				defaultIndex: [],
				selectType: '', //选择项的类型
				sex: [], //性别
				sexName: "", //性别名称
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
				clue_source:[],//线索来源
				clue_sourceName:"",//线索来源名称
				clue_status:[],//线索状态
				clue_statusName:"",//线索状态名称
				sysUserName: "", //跟进人员
				isCreateNext: false,
				showDatePicker: false,
				minDate: "",
				maxDate: "",
				datetime: js_date_time(new Date()),
				modalContent: "",
				modalTitle: "",
				showModal: false,
				returnPageNumber: 1,
				clueId:"",
				isOCR:false,
			}
		},
		onLoad(option){
			console.log(option);
			this.clueId=option.id || "";
			this.returnPageNumber= parseInt(option.returnPageNumber) || 1 ;
			this.isOCR = isEmpty(option.isOCR) ? false : option.isOCR;
			
			this.sex.push(getApp().globalData.sex) //性别
			this.clue_source.push(getApp().globalData.clue_source) //线索来源
			this.clue_status.push(getApp().globalData.clue_status) //线索状态			
			this.advance_notice.push(getApp().globalData.advance_notice) //任务提醒
			
			let date = new Date()
			date.setFullYear(date.getFullYear() + 10);
			this.minDate = Date.parse(new Date());
			this.maxDate = Date.parse(new Date(date));
			
			this.userInfo = this.$cache.get('_userInfo')
			this.sysUserName = this.userInfo.realname //跟进人员名称
			this.clueSourceForm.task.sysUserId = this.userInfo.id
			this.clueSourceForm.clue.chargeId = this.userInfo.id
			
			if (!isEmpty(this.clueId)) { //编辑回填数据
				this.navTitle = "编辑线索"
				this.isDisabled = true
				this.getUpdata();
			}
			if (this.isOCR) {
				let item = uni.getStorageSync("OCRresult");
				console.log("新增线索", item)
				this.clueSourceForm.clue.customer=isEmpty(item)? '' : item.companyName
			}
		},
		onShow() {
			uni.$once('resultSelectUser', res => {
				let lstSelectUser = uni.getStorageSync('lstSelectUser') //1*60*60*24*7
				console.log('lstSelectUser', lstSelectUser)
				if (lstSelectUser) {
					let UserName = ''
					let chargeId = ''
					lstSelectUser.forEach(v => {
						UserName = v.name;
						chargeId = v.id;
					})
					this.sysUserName = UserName
					this.clueSourceForm.task.sysUserId = chargeId
					// this.clueSourceForm.clue.chargeId = chargeId
				}
				
			})
		},
		methods: {
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			//创建下次跟进任务
			createNextFollowUpTask() {
				if (this.isCreateNext) {
					this.isCreateNext = false
				} else {
					this.isCreateNext = true
				}
			},
			leftClick() {
				this.showModal = true;
				this.modalTitle = "是否取消";
				this.modalContent = "资料尚未提交，是否取消编辑？";
			},
			//取消按钮 ==》弹出确认按钮
			confirmModal() {
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
					case 'sex': //性别
						this.lstExpense_type = this.sex;
						this.showPicker = true;
						break;
					
					case 'clue_source': //线索来源
						this.lstExpense_type = this.clue_source;
						this.showPicker = true;
						break;
						
					case 'clue_status': //线索状态
						this.lstExpense_type = this.clue_status;
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
						uni.navigateTo({
							url: "/pages/filter-all/select-more?total=1000" + "&title=跟进人员" +
								'&isMutiple=true'
						});
						break;
				}
			},
			// 确认按钮
			confirmExpense_type(e) {
				let type = this.selectType
				switch (type) {
					case 'sex': //性别
						this.clueSourceForm.clue.sex = e.value[0].value + '';
						this.sexName = e.value[0].label;
						break;
						
					case 'clue_source': //线索来源
						this.clueSourceForm.clue.clueSource = e.value[0].value + '';
						this.clue_sourceName = e.value[0].label;
						break;
						
					case 'clue_status': //线索状态
						this.clueSourceForm.clue.clueStatus = e.value[0].value + '';
						this.clue_statusName = e.value[0].label;
						break;
			
					case 'advance_notice': //任务提醒
						this.clueSourceForm.task.advanceNoticeCode = e.value[0].value + '';
						this.advance_noticeName = e.value[0].label;
						break;
					
					case 'reminder_mode': //提醒方式
						if (e.value[0].value == 'systemNotification') { //是否系统通知
							this.clueSourceForm.task.systemNotification = 1;
							this.clueSourceForm.task.smsNotification = 0;
							this.clueSourceForm.task.emailNotification = 0;
						} else if (e.value[0].value == 'smsNotification') { //是否短信通知 
							this.clueSourceForm.task.smsNotification = 1;
							this.clueSourceForm.task.systemNotification = 0;
							this.clueSourceForm.task.emailNotification = 0;
						} else if (e.value[0].value == 'emailNotification') { //是否邮件通知 0否 1是
							this.clueSourceForm.task.emailNotification = 1;
							this.clueSourceForm.task.systemNotification = 0;
							this.clueSourceForm.task.smsNotification = 0;
						}
						this.reminder_modeName = e.value[0].label;
						break;
				}
			
				this.showPicker = false;
			},
			clickDatePicker(type) {
				this.datetime =this.clueSourceForm.task.connectTime
				this.showDatePicker = true;
			},
			//确认按钮
			confirm(e) {
				const timeFormat = uni.$u.timeFormat;
				this.clueSourceForm.task.connectTime = timeFormat(e.value, 'yyyy-mm-dd hh:MM');
				this.showDatePicker = false;
				//console.log(e)
			},
			getUpdata(){
				let params = '?id=' + this.clueId;
				getClueInfoById(params,res=>{
					if (res.code == 200 && res.success) {
						console.log('详情-res:', res)
						let data = res.result;
						this.clueSourceForm.clue.id=data.id;
						this.clueSourceForm.clue.contacts=data.contacts;
						this.clueSourceForm.clue.phone=data.phone
						this.clueSourceForm.clue.customer=data.customer;//客户姓名
						this.clueSourceForm.clue.customerId =data.customerId //客户id（转为客户后填充）
						this.clueSourceForm.clue.email=data.email
						
						this.sex[0].forEach(v => { //性别
							if (v.value == data.sex) {
								this.clueSourceForm.clue.sex = v.value;
								this.sexName = v.label;
							}
						})
						
						this.clue_source[0].forEach(v => { //线索来源
							if (v.value == data.clueSource) {
								this.clueSourceForm.clue.clueSource = v.value;
								this.clue_sourceName = v.label;
							}
						})
						
						this.clue_status[0].forEach(v => { //线索状态
							if (v.value == data.clueStatus) {
								this.clueSourceForm.clue.clueStatus = v.value;
								this.clue_statusName = v.label;
							}
						})
						
						
					}else {
						uni.$u.toast(res.message);
					}
				})
			},
			//验证数据
			validateField(){
				
				// if (isEmpty(this.clueSourceForm.clue.customer)) {
				// 	uni.$u.toast("客户名称不能为空");
				// 	return false;
				// }
				if (isEmpty(this.clueSourceForm.clue.contacts)) {
					uni.$u.toast("联系人姓名不能为空");
					return false;
				}
				if (isEmpty(this.clueSourceForm.clue.phone)) {
					uni.$u.toast("手机号码不能为空");
					return false;
				}
				if (!uni.$u.test.mobile(this.clueSourceForm.clue.phone)) {
					uni.$u.toast('手机号码不正确');
					return false;
				}
				if (this.isCreateNext) {
					this.clueSourceForm.falg=true;
					if (isEmpty(this.clueSourceForm.task.connectTime)) {
						uni.$u.toast("跟进时间不能为空");
						return false;
					}
					if (isEmpty(this.clueSourceForm.task.sysUserId)) {
						uni.$u.toast("跟进人员不能为空");
						return false;
					}
				} else {
					this.clueSourceForm.task = null
				}
				return true;
			},
			//保存
			saveClueSource(){
				if (this.validateField() && !this.isClick) {
					this.isClick = true;
					console.log(this.clueSourceForm)
					if(!isEmpty(this.clueId)){
						editClueSource(this.clueSourceForm,res=>{
							if (res.code == 200 && res.success) {
								uni.$u.toast(res.message);
								uni.$emit('returnClue', true);
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
					}else{
						addClueSource(this.clueSourceForm,res=>{
							if (res.code == 200 && res.success) {
								uni.$u.toast(res.message);
								uni.$emit('returnClue', true);
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
		.u-form-item__body__right__message {
			display: block;
			text-align: right;
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
