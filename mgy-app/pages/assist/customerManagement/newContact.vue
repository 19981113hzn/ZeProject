<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>

		<u--form :model="itemInfo" ref="form1" :rules="rules" labelPosition="left" labelWidth="80">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }"
					scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true">
					<view class="top-height">
						<u-form-item label="联系人姓名" prop="name" :required="true" ref="item1" labelWidth="95">
							<u--input v-model="itemInfo.name" border="none" placeholder="请填写" clearable maxlength="30">
							</u--input>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="关联客户" prop="customerName" :required="true" ref="item1" borderBottom
							@click="gotorelatedCustomers(); hideKeyboard()">
							<u--input v-model="customerName" border="none" placeholder="请选择(注:带出不能编辑)" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon v-if="customerName==''" slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="性别" prop="sexName" ref="item1" borderBottom
							@click="clickExpense('sex'); hideKeyboard()">
							<u--input v-model="sexName" border="none" placeholder="请选择" disabled disabledColor="#ffffff"
								clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="角色" prop="sys_customer_contact_roleName" :required="true" ref="item1"
							labelWidth="50" borderBottom
							@click="clickExpense('sys_customer_contact_role'); hideKeyboard()">
							<u--input v-model="sys_customer_contact_roleName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="生日" prop="birthday" ref="item1" borderBottom
							@click="showDatePicker = true; hideKeyboard()">
							<u--input v-model="itemInfo.birthday" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="部门职称" prop="position" ref="item1" borderBottom>
							<u--input v-model="itemInfo.position" border="none" placeholder="请填写"
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
						</u-form-item>
						<u-form-item label="手机号码" prop="phoneNumber" :required="true" ref="item1" borderBottom>
							<u--input v-model="itemInfo.phoneNumber" type="number" border="none" placeholder="请填写"
								disabledColor="#ffffff" clearable maxlength="11"></u--input>
						</u-form-item>
						<u-form-item label="电子邮箱" prop="email" ref="item1" borderBottom labelWidth="105">
							<u--input v-model="itemInfo.email" border="none" placeholder="请填写" disabledColor="#ffffff"
								clearable maxlength="30"></u--input>
						</u-form-item>
						<u-form-item label="所在地区" prop="areaName" borderBottom ref="item1"
							@click="showArea = true; hideKeyboard()">
							<u--input v-model="areaName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="详细地址" prop="address" ref="item1">
							<u--input v-model="itemInfo.address" border="none" placeholder="请填写" disabledColor="#ffffff"
								clearable maxlength="30"></u--input>
							<!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
						</u-form-item>
					</view>

					<view class="top-height">
						<u-form-item label="备注信息" prop="remark" ref="item1"></u-form-item>
						<u--textarea v-model="itemInfo.remark" border="none" placeholder="请输入备注信息" maxlength="300">
						</u--textarea>
					</view>

					<view class="top-height"></view>
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
		<u-datetime-picker :show="showDatePicker" v-model="datetime" mode="date" :minDate="minDate" :maxDate="maxDate"
			:formatter="formatter" closeOnClickOverlay @close="showDatePicker=false" @cancel="showDatePicker=false"
			@confirm="confirm"></u-datetime-picker>
		<u-picker :show="showArea" @close="showArea=false" keyName="label" @cancel="showArea=false" ref="uPicker"
			:columns="areaLst" @confirm="confirmArea" @change="changeHandler"></u-picker>

		<u-picker :show="showPicker" :columns="lstExpense_type" keyName="label" closeOnClickOverlay
			:defaultIndex="defaultIndex" @close="showPicker=false" @cancel="showPicker=false"
			@confirm="confirmExpense_type"></u-picker>

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
	import area from "../../../util/area.json"
	import {
		sysCustomerContactAdd,
		getContactDetail,
		sysCustomerContactEdit
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				navTitle: "新建联系人",
				itemInfo: {
					sex: "", //性别(字典表 sex)
					roleValue: "", //	角色 (字典表sys_customer_contact_role)
					birthday: "", //	生日	
					position: "", //	部门职务
					phoneNumber: "", //	手机号码不能为空
					name: "", //	联系人姓名
					isPrimary: "", //	是否首要联系人
					remark: "", //	备注	
					address: "", //	详细地址	
					area: "", //	所在地区
					areaCode: "", //	所在地区code	
					email: "", //	电子邮箱	
					customerId: "", //	客户id
					// id:"",//	id

					// latitude:"",//	经度
					// longitude:"",//:"",//	纬度		false	
					// number:"",//


					// uploadUrlId:"",//	附件id


				},
				bizOpptyId:"",
				showDatePicker: false,
				minDate: "",
				maxDate: "",
				datetime: js_date_time(new Date()),
				showPicker: false,
				lstExpense_type: [],
				defaultIndex: [],
				selectType: '', //选择项的类型
				sex: [], //性别
				sexName: "", //性别名称
				sys_customer_contact_role: [], //角色
				sys_customer_contact_roleName: [], //角色名称
				showArea: false,
				areaLst: [], //地区
				areaName: "",
				customerName: "", //关联客户的名称
				customerId: "", //关联客户的Id
				type: 0, //  1 新增客户进入  
				returnPageNumber: 1, //
				isupdata: false, //是否修改
				isCreateNext: false,
				modalContent: "",
				modalTitle: "",
				showModal: false,
				isClick: false, //防止重复点击保存按钮
				rules: {
					'phoneNumber': [{
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
			}
		},
		onLoad(option) {
			this.bizOpptyId = option.bizOpptyId || '';
			this.type = isEmpty(option.type) ? 0 : option.type;
			this.customerName = isEmpty(option.customerName) ? '' : option.customerName; //关联客户的名称
			this.customerId = isEmpty(option.customerId) ? '' : option.customerId; //关联客户的Id
			this.itemInfo.customerId = this.customerId;
			this.itemInfo.id = option.id || '';
			this.returnPageNumber = isEmpty(option.returnPageNumber) ? 1 : parseInt(option.returnPageNumber);
			this.isupdata = isEmpty(option.isupdata) ? false : option.isupdata;

			this.sex.push(getApp().globalData.sex) //性别
			this.sys_customer_contact_role.push(getApp().globalData.sys_customer_contact_role) //角色
			//所属地区
			this.areaLst.push(area)
			this.areaLst.push(area[0].children)
			this.areaLst.push(area[0].children[0].children)
			console.log(this.areaLst);


			let date = new Date()
			date.setFullYear(date.getFullYear() - 100);
			this.minDate = Date.parse(new Date(date));
			this.maxDate = Date.parse(new Date());
			if (this.isupdata) {
				this.navTitle = "编辑联系人"
				this.getUpdateData();
			}
		},
		methods: {
			leftClick() {
				this.showModal = true;
				this.modalTitle = "是否取消";
				this.modalContent = "资料尚未提交，是否取消编辑？"
			},
			getUpdateData() {
				if (this.type == 1) {
					let contactDetails = uni.getStorageSync('contactDetails');
					this.itemInfo = contactDetails;
					this.backfillData();
				} else if (this.type == 2) {
					const data = "?id=" + this.itemInfo.id;
					getContactDetail(data, res => {
						if (res.code == 200 && res.success) {
							this.itemInfo = res.result;
							this.customerName = res.result.customerName; //关联客户的名称
							this.customerId = res.result.customerId; //关联客户的Id
							this.backfillData();
							//this.detail = res.result;
						} else {
							uni.$u.toast(res.message);
						}
					})
				}
			},
			backfillData() {
				if (this.itemInfo.sex) {
					this.sex[0].forEach(v => {
						if (v.value == this.itemInfo.sex.toString()) {
							this.sexName = v.label
						}
					})
				}
				//	角色 (字典表sys_customer_contact_role)
				if (this.itemInfo.roleValue) {
					this.sys_customer_contact_role[0].forEach(v => {
						if (v.value == this.itemInfo.roleValue) {
							this.sys_customer_contact_roleName = v.label
						}
					})
				}

				this.areaName = this.itemInfo.area; //	所在地区
			},
			changeHandler(e) {
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					indexs,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e
				if (columnIndex === 0) {
					// picker为选择器this实例，变化第二列对应的选项
					// 注释 获取城市要有下标 
					// 而 一个对象的字符串 例:const aa ="1":[{name:"222"}] 
					// 获取需要 aaa["1"]对应 所以需要下面这样写
					picker.setColumnValues(1, area[index].children)
					let arr = isEmpty(area[indexs[0]].children[indexs[1]].children) ? [] : area[indexs[0]].children[indexs[
						1]].children
					picker.setColumnValues(2, arr)
				}
				if (columnIndex === 1) {
					let arr = isEmpty(area[indexs[0]].children[indexs[1]].children) ? [] : area[indexs[0]].children[indexs[
						1]].children
					picker.setColumnValues(2, arr)
				}
				//console.log(e)
			},
			confirmArea(e) {
				console.log(e.value)
				let item = e.value;
				this.itemInfo.area = item[0].label +
					(isEmpty(item[1]) ? '' : "," + item[1].label) +
					(isEmpty(item[2]) ? '' : "," + item[2].label) //	所在地区
				this.itemInfo.areaCode = item[0].value +
					(isEmpty(item[1]) ? '' : "," + item[1].value) +
					(isEmpty(item[2]) ? '' : "," + item[2].value) //	所在地区code	
				this.areaName = item[0].label +
					(isEmpty(item[1]) ? '' : "/" + item[1].label) +
					(isEmpty(item[2]) ? '' : "/" + item[2].label) //	所在地区
				this.showArea = false;
			},
			//取消按钮 ==》弹出确认按钮
			confirmModal() {
				uni.navigateBack();
			},
			clickExpense(type) {
				this.selectType = type
				switch (type) {
					case 'sex': //性别
						this.lstExpense_type = this.sex;
						this.showPicker = true;
						break;
					case 'sys_customer_contact_role': //角色
						this.lstExpense_type = this.sys_customer_contact_role;
						this.showPicker = true;
						break;


					case 'chargeUser':
						uni.navigateTo({
							url: "/pages/filter-all/select-more?total=1000" + "&title=负责人员" +
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
						this.itemInfo.sex = e.value[0].value + '';
						this.sexName = e.value[0].label;
						break;


					case 'sys_customer_contact_role': //角色
						this.itemInfo.roleValue = e.value[0].value + '';
						this.sys_customer_contact_roleName = e.value[0].label;
						break;
				}

				this.showPicker = false;
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
				return value
			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			//关联客户
			gotorelatedCustomers() {
				if (!isEmpty(this.customerName)) {
					//新增客户过来不能进行点击跳转
				} else {
					uni.navigateTo({
						url: "/pages/assist/customerManagement/relatedCustomers?customerId=" + this.customerId
					})
				}
			},
			//跟进时间  确认按钮
			confirm(e) {
				const timeFormat = uni.$u.timeFormat;
				this.itemInfo.birthday = timeFormat(e.value, 'yyyy-mm-dd');
				//this.$set(this.itemInfo, "datetime",datetime);
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
			//验证数据
			validateField() {
				if (isEmpty(this.itemInfo.name)) {
					uni.$u.toast("联系人姓名不能为空");
					return false;
				}
				if (isEmpty(this.customerName)) {
					uni.$u.toast("关联客户不能为空");
					return false;
				}
				if (isEmpty(this.sys_customer_contact_roleName)) {
					uni.$u.toast("角色不能为空");
					return false;
				}
				if (isEmpty(this.itemInfo.phoneNumber)) {
					uni.$u.toast("手机号码不能为空");
					return false;
				}
				if (!uni.$u.test.mobile(this.itemInfo.phoneNumber)) {
					uni.$u.toast('手机号码不正确');
					return false;
				}
				return true;
			},
			//保存
			save() {
				if (this.validateField() && !this.isClick) {
					this.isClick = true;
					if (this.type == 1) {
						this.itemInfo.sys_customer_contact_roleName = this.sys_customer_contact_roleName;
						console.log(this.itemInfo)
						uni.$emit('returnContact', this.itemInfo);
						uni.navigateBack({
							delta: this.returnPageNumber
						});
					}
					if (this.type == 2) {
						let sysCustomerContactFormModel = {
							contact: this.itemInfo,
							task: {}
						}
						if(this.bizOpptyId){
							sysCustomerContactFormModel.businessCode = 'BizOppty';
							sysCustomerContactFormModel.businessId = this.bizOpptyId;
						}
						if (this.isupdata) { //编辑
							sysCustomerContactEdit(sysCustomerContactFormModel, res => {
								if (res.code == 200 && res.success) {
									uni.showToast({
										title: res.message
									});
									// this.empty();
									uni.$emit('return', true);
									setTimeout(() => {
										uni.navigateBack({
											delta: this.returnPageNumber
										})
									}, 1000)

								} else {
									uni.$u.toast(res.message);
									this.isClick = false;
								}
							})
						} else { //新增
							sysCustomerContactAdd(sysCustomerContactFormModel, res => {
								if (res.code == 200 && res.success) {
									uni.showToast({
										title: res.message
									});
									// this.empty();
									uni.$emit('return', true);
									setTimeout(() => {
										uni.navigateBack({
											delta: this.returnPageNumber
										})
									}, 1000)
								} else {
									uni.$u.toast(res.message);
									this.isClick = false;
								}
							})
						}
					}
				}

				// uni.navigateBack();
				// uni.$u.toast("保存成功");
				// uni.$emit('return', true);
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
		}

		.logo {
			width: 24px;
			height: 24px;
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
