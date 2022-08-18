<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>

		<u--form :model="form" ref="form1" labelPosition="left" labelWidth="80">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }"
					scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true">
					<view class="top-height">
						<u-form-item :label="(typeFrom || isClue) ? '跟进类型' : '跟进方式'" prop="connectType" borderBottom
							:required="true" ref="item1"
							@click="clickSelection('customer_contact_type'); hideKeyboard()">
							<u--input v-model="connectTypeName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="跟进时间" prop="happenTime" ref="item1" :required="typeFrom ? false : true"
							@click="showDatePicker = true; hideKeyboard()" borderBottom>
							<u--input v-model="form.connectTime" border="none" placeholder="请选择" clearable disabled
								disabledColor="#ffffff"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<!-- <u-form-item v-if="typeFrom" label="上传附件" prop="form.name" ref="item1" :required="false"
							@click="showUpload = true; hideKeyboard()" borderBottom>
							<u--input v-model="form.connectTime" border="none" placeholder="请选择" clearable disabled
									disabledColor="#ffffff">
								</u--input>
							<u-icon slot="right" name="arrow-right">
							</u-icon>
						</u-form-item> -->
						<!-- <u-form-item v-if="typeFrom" label="上传附件" prop="form.name" ref="item1" :required="false"
							@click="showUpload = true; hideKeyboard()" borderBottom>
							<u--input v-model="form.connectTime" border="none" placeholder="请选择" clearable disabled
								disabledColor="#ffffff">
							</u--input>
							
						</u-form-item> -->

						<u-form-item :label="(typeFrom || isClue) ? '跟进内容' : '跟进描述'" prop="content" ref="item1"
							:required="typeFrom  ? false : true">
						</u-form-item>
						<u--textarea v-model="form.content" border="none" placeholder="请输入跟进描述" maxlength="300">
						</u--textarea>
					</view>
					<view class="top-height">
						<u-form-item label="客户名称" :required="true" ref="item1" borderBottom>
							<u--input v-model="customerInfo.name" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
						</u-form-item>
						<u-form-item v-if="!typeFrom && isClue" label="线索状态" prop="clue_statusName" :required="true"
							ref="item1" @click="clickSelection('clue_status'); hideKeyboard()">
							<u--input v-model="clue_statusName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<!-- 商机跟进 -->
						<u-form-item v-else-if="typeFrom || businessCode=='BizOppty'" label="销售状态" prop="saleStatus"
							ref="item1" @click="toChangeSaleStatu(); hideKeyboard()">
							<u--input v-model="selectSaleStatus.saleStatus" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item v-else label="客户状态" prop="customerStatus" :required="true" ref="item1"
							@click="clickSelection('customer_status'); hideKeyboard()">
							<u--input v-model="customerStatusName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="附件" prop="form.name" ref="item1"></u-form-item>
						<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="6" :maxCount="5"
							multiple width="55" height="55">
							<image src="/static/img/workbench/icon_upload.png" mode="widthFix"
								style="width: 55px;height: 55px;"></image>
						</u-upload>
					</view>
					<view class="top-height">
						<u-form-item label="创建下次跟进任务" prop="projectName" ref="item1" borderBottom labelWidth="150"
							@click="createNextFollowUpTask(); hideKeyboard()">
							<u--input v-model="form.projectName" border="none" disabled disabledColor="#ffffff"
								clearable maxlength="30"></u--input>
							<!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
							<u--image v-if="!isCreateNext" src="/static/img/assist/follw_up_add.png" width="24px"
								height="24px"></u--image>
							<u--image v-if="isCreateNext" src="/static/img/assist/follow_up_reduce.png" width="24px"
								height="24px"></u--image>
						</u-form-item>
						<view v-if="isCreateNext">
							<u-form-item label="跟进时间" prop="connectTime" ref="item1" :required="true"
								@click="showNextDatePicker = true; hideKeyboard()" borderBottom>
								<u--input v-model="task.connectTime" border="none" placeholder="请选择" clearable disabled
									disabledColor="#ffffff"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="跟进内容" prop="content" ref="item1" borderBottom>
								<u--input v-model="task.content" border="none" placeholder="请填写" clearable
									disabledColor="#ffffff"></u--input>
							</u-form-item>
							<u-form-item label="跟进人员" prop="projectName" :required="true" ref="item1" borderBottom
								@click="toSelectUser">
								<view class="top-user" :class="[!canSelect?'top-user-disabled':'']">
									<image class="user-head" src="/static/img/workbench/icon_user_head.png">
									</image>
									<text class="user-name">{{selectUserName||userInfo.realname}}</text>
								</view>
								<u-icon slot="right" name="arrow-right" v-if="canSelect"></u-icon>
							</u-form-item>
							<u-form-item borderBottom :label="(typeFrom || isClue) ? '任务提醒' : '跟进提醒'"
								prop="advanceNoticeCode" :required="(typeFrom || isClue) ? false : true" ref="item1"
								@click="clickSelection('advance_notice'); hideKeyboard()">
								<u--input v-model="advanceNoticeCodeName" border="none" placeholder="请选择" disabled
									disabledColor="#ffffff" clearable maxlength="30"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item v-if="typeFrom || isClue " label="提醒方式" prop="reminder_modeName"
								@click="clickSelection('reminder_mode'); hideKeyboard()">
								<u--input v-model="reminder_modeName" border="none" placeholder="请选择" disabled
									disabledColor="#ffffff" clearable maxlength="30"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
						</view>
					</view>

				</scroll-view>
			</view>
			<view class="foot-height">
				<view style="padding: 0 16px;">
					<u-form-item>
						<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="save"
							:disabled="disabled" :loading="disabled">
						</u-button>
					</u-form-item>
				</view>
			</view>
		</u--form>
		<u-datetime-picker :show="showDatePicker" v-model="datetime" mode="datetime" :minDate="minDate"
			:maxDate="maxDate" :formatter="formatter" closeOnClickOverlay @close="showDatePicker=false"
			@cancel="showDatePicker=false" @confirm="confirm"></u-datetime-picker>

		<u-datetime-picker :show="showNextDatePicker" v-model="datetime" mode="datetime" :minDate="minDate"
			:maxDate="maxDate" :formatter="formatter" closeOnClickOverlay @close="showNextDatePicker=false"
			@cancel="showNextDatePicker=false" @confirm="confirm">
		</u-datetime-picker>


		<!-- <u-upload :show="showUpload" :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="6"
			:maxCount="5" multiple width="55" height="55">
		</u-upload> -->

		<u-modal :content="modalContent" :show="showModal" :title="modalTitle" showCancelButton closeOnClickOverlay
			@confirm="confirmModal" @cancel="showModal=false" @close="showModal=false"></u-modal>

		<u-picker :show="showPicker" :columns="columns" keyName="label" closeOnClickOverlay :defaultIndex="defaultIndex"
			@close="showPicker=false" @cancel="showPicker=false" @confirm="confirmSelection"></u-picker>
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
		uploadPicturePlus,
		uploadAttachment,
		getDictItemsByCode,
		addFollowRecord,
		editFollowRecord,
		getFollowRecordDetail,
		deleteAttachmemt,
		getBizOpptyInfo
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				canSelect: true,
				disabled: false,
				bizOpptyId: "",
				navTitle: "",
				showDatePicker: false,
				showNextDatePicker: false,
				showUpload: false,
				minDate: "",
				maxDate: "",
				sysUserName: "",
				datetime: js_date_time(new Date()),
				fileList: [
					//{url:"http://192.168.196.37:81/group1/M00/00/03/wKjEJWKsGhuAOEYhAAD7inVR1dk156.jpg"}
				],
				isCreateNext: false,
				modalContent: "",
				modalTitle: "",
				showModal: false,

				form: {},
				task: {},
				customerInfo: {},
				saleInfo: {},
				selectType: '',
				showPicker: false,
				columns: [],
				defaultIndex: [],
				customer_contact_type: [], //跟进类型
				connectTypeName: '',
				customer_status: [], //客户状态
				customerStatusName: '',
				sale_status: [], //销售状态
				saleStatusName: '',
				advance_notice: [], //跟进提醒
				advanceNoticeCodeName: '',
				userInfo: {},
				type: '',
				typeFrom: '',
				id: '',
				needJump: false,
				lstSelectUser: [],
				saleStatusNormalList: [], //销售状态列表
				selectSaleStatus: {},
				selectUserName: '',
				contactTask: { //跟进任务
					advanceNoticeCode: "", //	提前通知时间,字典表advance_notice
					emailNotification: 0, //	是否邮件通知 0否 1是
					smsNotification: 0, //	是否短信通知 0否 1是
					systemNotification: 0, //	是否系统通知 0否 1是
					connectTime: "", //	跟进时间	
					content: "", //	跟进内容	
					sysUserId: "", //跟进人员
				},

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
				isClue: false, //是否为线索
				isRecord: false, //是否为编辑记录
				bizOpptyId: "", //商机id
				clueSourceId: "", //线索id
				clueStatusId: "", //线索状态Id
				clue_status: [], //线索状态
				clue_statusName: "", //线索状态名称
				businessCode: "", //类型
			}
		},
		computed: {
			canSelect() {
				return Boolean(this.userInfo.departIds);
			}
		},
		onLoad(options) {
			let bizObj = options.params ? JSON.parse(options.params) : ''
			this.bizOpptyId = bizObj.bizOpptyId || ''
			this.type = options.type;
			this.typeFrom = options.addOpportunity || ''
			console.log(this.type);
			console.log(this.typeFrom);
			this.navTitle = this.type === 'add' ? '写新跟进' : '编辑跟进';
			if (options.params) {
				console.log(options.params);
				this.customerInfo = JSON.parse(options.params);
				this.saleInfo = JSON.parse(options.params);
				console.log(this.customerInfo);
			}
			if (options.id) this.id = options.id;
			if (options.needJump) this.needJump = options.needJump;
			this.businessCode = options.businessCode || ""
			//线索进入
			this.isClue = options.isClue || false
			if (this.isClue || this.businessCode == "ClueSource") {
				this.isClue = true
				let item = JSON.parse(options.params)
				this.clueSourceId = item.clueSourceId || ''
				this.customerInfo = {
					name: item.customerName,
					id: item.customerId,
				}
				this.clue_status.push(getApp().globalData.clue_status) //线索状态	
				this.clue_status[0].forEach(v => { //企业类型
					if (v.value == item.clueStatus) {
						this.clueStatusId = v.value;
						this.clue_statusName = v.label;
					}
				})
				this.userInfo = this.$cache.get('_userInfo')
				this.selectUserName = this.userInfo.realname //跟进人员名称
				this.contactTask.sysUserId = this.userInfo.id
			}
			///////结束//////

			// 从跟进详情的编辑记录进入

			if (this.businessCode == "BizOppty") {
				this.typeFrom = "0"
				let item = JSON.parse(options.params)
				console.log(item);
				//this.bizOpptyId = item.bizOpptyId || ''
				this.customerInfo = {
					name: item.customerName,
					id: item.customerId,
				}

				console.log(this.customerInfo);
				this.selectSaleStatus.saleStatus = item.bizStatus
				// this.sale_status.push(getApp().globalData.sale_status) //销售状态	
				// this.sale_status[0].forEach(v => {
				// 	if (v.value == item.sale_status) {
				// 		this.bizOpptyId = v.value;
				// 		this.selectSaleStatus.saleStatus = v.label;
				// 	}
				// })
				this.userInfo = this.$cache.get('_userInfo')
				this.selectUserName = this.userInfo.realname //跟进人员名称
				this.contactTask.sysUserId = this.userInfo.id
			}

			///////结束//////

			this.customer_contact_type.push(getApp().globalData.customer_contact_type) //跟进方式
			this.customer_status.push(getApp().globalData.customer_status) //客户状态
			this.sale_status.push(getApp().globalData.sale_status) //销售状态
			this.advance_notice.push(getApp().globalData.advance_notice) //跟进提醒

			if (this.type === 'edit') this.getDetail();
			// if (this.type === 'add') this.getDetail();


			let date = new Date()
			date.setFullYear(date.getFullYear() + 10);
			this.minDate = Date.parse(new Date());
			this.maxDate = Date.parse(new Date(date));

			uni.removeStorageSync('lstSelectUser');
			if (this.typeFrom) {
				this.getUpdata()
			}

		},
		onShow() {
			uni.$once('resultSelectUser', res => {
				if (res) {
					this.lstSelectUser = uni.getStorageSync("lstSelectUser")
					this.selectUserName = this.lstSelectUser[0].name;
					this.contactTask.sysUserId = this.lstSelectUser[0].id
				}
			})
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
						this.selectSaleStatus = arr.length == 0 ? this.saleStatusNormalList.saleStatusNormalList[
								0] :
							arr[arr.length - 1];
					}

				}

			});
			console.log(this.customer_status);
			// this.sale_status = uni.getStorageSync("sale_res")
			console.log(this.sale_status);
		},
		methods: {
			getUpdata() {
				let params = '/' + this.bizOpptyId;
				getBizOpptyInfo(params, res => {
					if (res.code == 200 && res.success) {
						console.log('详情-res:', res)
						let data = res.result;
						this.selectSaleStatus.saleStatus = data.saleStatus //销售状态
					}
				})
			},


			toChangeSaleStatu() {
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/opportunityManagement/changeSalesStatus?bizOpptyId=" +
						this.bizOpptyId
				})
			},
			getDetail() {
				const data = "?id=" + this.id;
				getFollowRecordDetail(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res);
						this.form = res.result;
						this.customerInfo = {
							id: this.form.customerId,
							name: this.form.customerName
						}
						this.connectTypeName = this.getDictLabel(this.customer_contact_type[0], this.form
							.connectType);
						this.customerStatusName = this.getDictLabel(this.customer_status[0], this.form
							.customerStatus);
						if (res.result.attachmentList && res.result.attachmentList.length) {
							this.fileList = res.result.attachmentList;
						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			leftClick() {
				this.showModal = true;
				this.modalTitle = "是否取消";
				this.modalContent = "资料尚未提交，是否取消编辑？"
			},
			//取消按钮 ==》弹出确认按钮
			confirmModal() {
				uni.navigateBack();
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				}
				if (type === 'month') {
					return `${value}月`
				}
				if (type === 'day') {
					return `${value}日`
				}
				if (type === 'hour') {
					return `${value}时`
				}
				if (type === 'minute') {
					return `${value}分`
				}
				return value
			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			//跟进时间  确认按钮
			confirm(e) {
				const timeFormat = uni.$u.timeFormat;
				if (this.showDatePicker) {
					this.form.connectTime = timeFormat(e.value, 'yyyy-mm-dd hh:MM');
					this.showDatePicker = false;
				}
				if (this.showNextDatePicker) {
					this.task.connectTime = timeFormat(e.value, 'yyyy-mm-dd hh:MM');
					this.showNextDatePicker = false;
				}
			},
			// 删除图片
			deletePic({
				file
			}) {
				const findIndex = this.fileList.findIndex((fi) => fi.id == file.id);
				this.fileList.splice(findIndex, 1);
				const data = '/' + file.id;
				deleteAttachmemt(data);
			},
			// 新增图片
			async afterRead(event) {
				console.log('event:', event);
				this.uploadToServer(event.file);
			},
			// 先上传到服务器
			uploadToServer(files) {
				const data = files.map((mi, index) => {
					return {
						name: "image" + index,
						uri: mi.url
					}
				})
				uploadPicturePlus(data, response => {
					const data = JSON.parse(response)
					if (data.code == 200 && data.success) {
						console.log(data.result);
						this.uploadByBusiness(data.result);
					} else {
						uni.$u.toast(data.message);
					}
				})
			},
			// 上传到服务器后拿到附件id再调用业务相关的接口
			uploadByBusiness(result) {
				const fileIdList = result.map(mi => mi.fileId);
				let formData = {
					businessCode: 'Customer',
					businessId: this.customerInfo.id,
					fileIdList,
					contentType: 'application/x-www-form-urlencoded',
				}
				uploadAttachment(formData, res => {
					if (res.code == 200 && res.success) {
						this.fileList = res.result;
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//创建下次跟进任务
			createNextFollowUpTask() {
				if (this.isCreateNext) {
					this.isCreateNext = false
				} else {
					this.isCreateNext = true
				}
			},
			//验证数据
			validateField() {
				if (isEmpty(this.form.connectType)) {
					if (this.typeFrom || this.isClue) {
						uni.$u.toast("请选择跟进类型");
						return false;
					} else {

						uni.$u.toast("请选择跟进方式");
						return false;
					}
				}
				if (isEmpty(this.form.connectTime)) {
					uni.$u.toast("请选择跟进时间");
					return false;
				}
				if (isEmpty(this.form.content)) {
					if (this.typeFrom || this.isClue) {
						uni.$u.toast("请输入跟进内容");
						return false;
					} else {

						uni.$u.toast("请输入跟进描述");
						return false;
					}
				}
				if (this.isClue) {
					if (isEmpty(this.clue_statusName)) {
						uni.$u.toast("请选择线索状态");
						return false;
					}
				}
				// if (!this.typeFrom) {
				// 	if (isEmpty(this.form.saleStatus)) {
				// 		uni.$u.toast("请选择销售状态");
				// 		return false;
				// 	}
				// } else if (isEmpty(this.form.customerStatus)) {
				// 	uni.$u.toast("请选择客户状态");
				// 	return false;
				// }
				if (isEmpty(this.form.customerStatus) && this.typeFrom != 0) {
					uni.$u.toast("请选择客户状态");
					return false;

				}

				if (this.isCreateNext) {
					if (isEmpty(this.task.connectTime)) {
						uni.$u.toast("请选择下次跟进时间");
						return false;
					}
					if (isEmpty(this.task.advanceNoticeCode) && !this.isClue) {
						uni.$u.toast("请选择跟进提醒");
						return false;
					}
					if (isEmpty(this.selectUserName) && this.isClue) {
						uni.$u.toast("请选择跟进人员");
						return false;
					}
				}
				return true;
			},
			//保存
			save() {
				// console.log(this.fileList);
				// return;
				if (this.validateField()) {
					let params = {};
					if (!this.isClue) {
						const {
							connectTime,
							connectType,
							content,
							customerStatus,
							saleStatus
						} = this.form;
						const customerContactRecord = {
							connectTime: connectTime + ':00',
							connectType,
							content,
							customerStatus,
							saleStatus
						}
						if (this.typeFrom) {
							customerContactRecord.businessCode = 'BizOppty';
							customerContactRecord.bizOpptyId = this.bizOpptyId
						} else {

							customerContactRecord.businessCode = 'Customer';
						}
						customerContactRecord.customerId = this.customerInfo.id;

						if (this.fileList.length) customerContactRecord.attachmentId = this.fileList.map(mi => mi.id).join(
							',');
						if (this.type === 'edit') customerContactRecord.id = this.form.id;

						params = {
							customerContactRecord
						}
						console.log(params);
						if (this.isCreateNext) {
							const {
								advanceNoticeCode,
								connectTime,
								content
							} = this.task;
							const task = {
								advanceNoticeCode,
								connectTime: connectTime + ':00',
								content
							};
							task.customerId = this.customerInfo.id;
							task.saleId = this.saleInfo.id;
							task.sysUserId = this.selectUserName ? this.lstSelectUser[0].id : this.userInfo.id;
							task.systemNotification = true;
							task.emailNotification = false;
							task.smsNotification = false;
							if (this.typeFrom) {
								task.businessCode = 'BizOppty'
								task.businessId = this.bizOpptyId;
							} else {
								task.businessCode = 'Customer'
								task.businessId = this.customerInfo.id;
							}

							params.task = task;
						}

					} else { //线索
						let customerContactRecord = {
							connectTime: this.form.connectTime + ':00',
							connectType: this.form.connectType,
							content: this.form.content,
							customerId: this.customerInfo.id, //客户id
							clueSourceStatus: this.clueStatusId, //线索状态Id
							businessCode: 'ClueSource',
							clueSourceId: this.clueSourceId, //线索id
						}
						params.customerContactRecord = customerContactRecord
						if (this.isCreateNext) {
							let task = {
								connectTime: this.task.connectTime,
								content: this.task.content,
								sysUserId: this.contactTask.sysUserId,
								advanceNoticeCode: this.task.advanceNoticeCode,
								systemNotification: this.contactTask.systemNotification,
								smsNotification: this.contactTask.smsNotification,
								emailNotification: this.contactTask.emailNotification,
								businessCode: 'ClueSource',
								businessId: this.clueSourceId, //线索id
							}
							params.task = task;
						}
					}
					console.log(params)
					this.disabled = true;
					this.type === 'add' ? addFollowRecord(params, res => this.callbackFn(res)) : editFollowRecord(params,
						res => this
						.callbackFn(
							res))
				}
				// uni.navigateBack();
				// uni.$u.toast("保存成功");
			},
			callbackFn(res) {
				if (res.code == 200 && res.success) {
					const title = this.type === 'add' ? '跟进成功' : '编辑成功';
					uni.showToast({
						title
					});
					uni.$emit('return', true);
					setTimeout(() => {
						this.disabled = false;
						if (this.needJump) {
							uni.redirectTo({
								url: "/pages/assist/customerManagement/customerDetails?id=" +
									this.customerInfo.id
							})
							return;
						}
						uni.navigateBack();
					}, 1000)
				} else {
					this.disabled = false;
					uni.$u.toast(res.message);
				}
			},
			clickSelection(type) {
				this.selectType = type
				switch (type) {
					case 'customer_contact_type':
						this.columns = this.customer_contact_type;
						this.showPicker = true;
						break;
					case 'customer_status':
						this.columns = this.customer_status;
						this.showPicker = true;
						break;
					case 'sale_status':
						this.columns = this.sale_status;
						this.showPicker = true;
						break;
					case 'advance_notice':
						this.columns = this.advance_notice;
						this.showPicker = true;
						break;
					case 'reminder_mode': //提醒方式
						this.columns = this.reminder_mode;
						this.showPicker = true;
						break;
					case 'chargeUser':
						let title = this.isBelongingPersonnel ? '归属人员' : '跟进人员'
						uni.navigateTo({
							url: "/pages/filter-all/select-more?total=1000" + "&title=" + title + '&isMutiple=true'
						});
						break;

					case 'clue_status': //线索状态
						this.columns = this.clue_status;
						this.showPicker = true;
						break;
				}
			},
			// 确认按钮
			confirmSelection(e) {
				const type = this.selectType
				switch (type) {
					case 'customer_contact_type': //性别
						this.form.connectType = e.value[0].value + '';
						this.connectTypeName = e.value[0].label;
						break;
					case 'customer_status': //客户状态
						this.form.customerStatus = e.value[0].value + '';
						this.customerStatusName = e.value[0].label;
						break;
						// case 'sale_status': //销售状态
						// 	this.form.sale_status = e.value[0].value + '';
						// 	this.saleStatusName = e.value[0].label;
						// 	break;
					case 'advance_notice': //任务提醒
						this.task.advanceNoticeCode = e.value[0].value + '';
						this.advanceNoticeCodeName = e.value[0].label;
						break;
					case 'reminder_mode': //提醒方式
						if (e.value[0].value == 'systemNotification') { //是否系统通知
							this.contactTask.systemNotification = 1;
							this.contactTask.smsNotification = 0;
							this.contactTask.emailNotification = 0;
						} else if (e.value[0].value == 'smsNotification') { //是否短信通知 
							this.contactTask.smsNotification = 1;
							this.contactTask.systemNotification = 0;
							this.contactTask.emailNotification = 0;
						} else if (e.value[0].value == 'emailNotification') { //是否邮件通知 0否 1是
							this.contactTask.emailNotification = 1;
							this.contactTask.systemNotification = 0;
							this.contactTask.smsNotification = 0;
						}
						this.reminder_modeName = e.value[0].label;
						break;

					case 'clue_status': //线索状态
						this.clueStatusId = e.value[0].value + '';
						this.clue_statusName = e.value[0].label;
						break;
				}

				this.showPicker = false;
			},
			//状态查询
			getDictItems(dictCode, receiveObj) {
				let data = "?dictCode=" + dictCode
				getDictItemsByCode(data, res => {
					if (res.code == 200 && res.success) {
						receiveObj.push(res.result);
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getDictLabel(dict, value) {
				if (!dict || !value) return '';
				const find = dict.find((fi) => fi.value == value);
				return find ? find.label : '';
			},
			toSelectUser() {
				if (!this.canSelect) return;
				uni.navigateTo({
					url: "/pages/filter-all/select-more?total=1000" + "&title=跟进人员" + '&isMutiple=false' +
						'&type=responsible'
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);


		/deep/.u-upload {
			.u-upload__wrap {
				.u-upload__button {
					// display: none;
					width: 24px;
					height: 24px;
				}
			}

		}

		/deep/.uicon-camera-fill {
			display: none;
		}

		/deep/.u-cell {
			.u-cell__body {
				padding: 0;
			}



			.u-line {
				display: none;
			}
		}

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

		.top-user-disabled {
			right: 16px;
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
