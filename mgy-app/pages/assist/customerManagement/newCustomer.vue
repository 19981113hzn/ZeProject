<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>

		<u--form :model="itemInfo" ref="form1" labelPosition="left" labelWidth="80">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }"
					scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true">
					<view class="top-height" v-if="!isUpdata">
						<u-form-item label="客户名称" prop="customer.name" :required="true" ref="item1">
							<u--input v-model="customerForm.customer.name" border="none" placeholder="请填写客户的公司名称"
								clearable maxlength="30" @input="searchChange" @blur="blurEven" @focus="focusEven">
							</u--input>
						</u-form-item>
					</view>
					<view class="top-height" v-if="isUpdata && !isOCR">
						<u-form-item :label="customerForm.customer.name" prop="customer.name" labelWidth="200"
							ref="item1">
							<view class="top-user-gx" @click="getRefreshDate">
								<image class="user-gx" src="/static/img/assist/icon_gxsx.png"></image>
								<text class="user-gx-name">刷新工商信息</text>
							</view>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="所属行业" :required="true" prop="industryName" ref="item1" borderBottom
							@click="clickExpense('industry'); hideKeyboard()">
							<u--input v-model="industryName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="客户类型" prop="projectName" ref="item1" borderBottom>
							<u-radio-group v-model="IndustryRadio" @change="groupChange">
								<u-radio :customStyle="{marginRight: '16px'}" v-for="(item, index) in radiolist"
									:key="index" :label="item.label" :name="item.value">
								</u-radio>
							</u-radio-group>
						</u-form-item>
						<view :class="IndustryRadio==0 ? '': 'mark'">
							<u-form-item label="纳税人识别号" prop="customer.taxNumber" ref="item1" labelWidth="105"
								borderBottom>
								<u--input v-model="customerForm.customer.taxNumber" border="none" placeholder="请填写"
									:disabled="IndustryRadio==0 ?true: disabledRadio"
									:disabledColor="IndustryRadio==0 ?'#ffffff': disabledColor" clearable
									maxlength="20">
								</u--input>
							</u-form-item>
							<u-form-item label="经营状态" prop="operating_stateName" ref="item1" borderBottom
								@click="clickExpense('operating_state'); hideKeyboard()">
								<u--input v-model="operating_stateName" border="none" placeholder="请选择" disabled
									:disabledColor="IndustryRadio==0 ?'#ffffff': disabledColor" clearable
									maxlength="30">
								</u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="企业类型" prop="company_org_typeName" ref="item1" borderBottom
								@click="clickExpense('company_org_type'); hideKeyboard()">
								<u--input v-model="company_org_typeName" border="none" placeholder="请选择" disabled
									:disabledColor="IndustryRadio==0 ?'#ffffff': disabledColor" clearable
									maxlength="30">
								</u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="人员规模" prop="staff_num_rangeName" ref="item1" borderBottom
								@click="clickExpense('staff_num_range'); hideKeyboard()">
								<u--input v-model="staff_num_rangeName" border="none" placeholder="请选择" disabled
									:disabledColor="IndustryRadio==0 ?'#ffffff': disabledColor" clearable
									maxlength="30">
								</u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="是否小微企业" prop="customer.isMicroEnt" ref="item1" labelWidth="105">
								<u-switch :disabled="disabledRadio" v-model="isMicroEntStatus"
									@change="changeIsMicroEnt" inactiveColor="rgba(192, 196, 204, 1)"></u-switch>
							</u-form-item>
							
						</view>

					</view>
					<view class="top-height">
						<u-form-item label="所在地区" :required="true" prop="areaName" borderBottom ref="item1"
							@click="showArea = true; hideKeyboard()">
							<u--input v-model="areaName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="详细地址" prop="customer.address"  ref="item1">
							<u--input v-model="customerForm.customer.address" border="none" placeholder="请填写"
								clearable maxlength="30"></u--input>
							<!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
						</u-form-item>
					</view>
					<view class="see-more" v-if="!seeMore" @click="seeMore=true">
						<text>查看更多</text>
						<image class="logo" src="/static/img/assist/see_more.png"></image>
					</view>
					<view v-if="seeMore">
						<view class="top-height">
							<u-form-item label="客户状态" prop="customerStatusName" borderBottom ref="item1"
								@click="clickExpense('customer_status'); hideKeyboard()">
								<u--input v-model="customerStatusName" border="none" placeholder="请选择" disabled
									disabledColor="#ffffff" clearable maxlength="30"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="客户级别" prop="customer_levelName" borderBottom ref="item1"
								@click="clickExpense('customer_level'); hideKeyboard()">
								<u--input v-model="customer_levelName" border="none" placeholder="请选择" disabled
									disabledColor="#ffffff" clearable maxlength="30"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="客户来源" prop="customer_sourceName" ref="item1"
								@click="clickExpense('customer_source'); hideKeyboard()">
								<u--input v-model="customer_sourceName" border="none" placeholder="请选择" disabled
									disabledColor="#ffffff" clearable maxlength="30"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
						</view>
						<view class="top-height">
							<!-- <u-form-item label="归属人员" prop="projectName" ref="item1">
								<view class="top-user">
									<image class="user-head" src="/static/img/workbench/icon_user_head.png"></image>
									<text class="user-name">赵小刚</text>
								</view>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item> -->
							<u-form-item label="所属部门" prop="departmentName" ref="item1"
								@click="clickExpense('department'); hideKeyboard()">
								<u--input v-model="departmentName" border="none" placeholder="请选择" disabled
									disabledColor="#ffffff" clearable maxlength="30"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
						</view>
						<view class="top-height">
							
							<u-form-item label="备注信息" prop="customer.remark" ref="item1"></u-form-item>
							<u--textarea v-model="customerForm.customer.remark" border="none" placeholder="请输入备注信息"
								maxlength="300"></u--textarea>
						</view>
						<view class="see-more" @click="seeMore=false">
							<text>收起</text>
							<image class="logo" src="/static/img/assist/put_more.png"></image>
						</view>
					</view>
					<view class="top-height">
						<u-form-item v-if="!isAddContact" label="" prop="memo" ref="item1" @click="addContact">
							<view class="addContact">
								<image class="logo" src="/static/img/icon_add.png"></image>
								<text class="contact-people">新建首要联系人</text>
								<text class="contact-star">*</text>
							</view>
						</u-form-item>
						<view v-if="isAddContact" class="primary-contact">
							<u-cell>
								<view slot="icon" class="logo-icon">
									<view class="logo-icon-txt">
										{{sliceString(customerForm.contact.name,0,2)}}
									</view>
								</view>
								<view slot="title" class="u-slot-title">
									<text class="u-cell-text">{{customerForm.contact.name}}</text>
									<u-tag text="首要联系人" bgColor="rgba(255, 248, 242, 1)"
										borderColor="rgba(255, 248, 242, 1)" color="rgba(255, 147, 48, 1)" size="mini">
									</u-tag>
								</view>
								<view slot="value" class="u-slot-value">
									<image class="logo-delete" src="/static/img/assist/icon_delete_people.png"
										@click="deleteContactDate"></image>
									<image class="logo" src="/static/img/assist/icon_edit_people.png"
										@click="addContact"></image>
								</view>
							</u-cell>
							<u-form-item label="角色">
								<text>{{customerForm.contact.sys_customer_contact_roleName}}</text>
							</u-form-item>
							<u-form-item label="手机号">
								<text>{{customerForm.contact.phoneNumber}}</text>
							</u-form-item>
							<u-form-item></u-form-item>
						</view>
					</view>
					<view class="top-height">
						<u-form-item label="创建下次跟进任务" prop="projectName" ref="item1" borderBottom labelWidth="150"
							@click="createNextFollowUpTask(); hideKeyboard()">
							<u--input v-model="itemInfo.projectName" border="none" disabled disabledColor="#ffffff"
								clearable maxlength="30"></u--input>
							<!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
							<u--image v-if="!isCreateNext" src="/static/img/assist/follw_up_add.png" width="24px"
								height="24px"></u--image>
							<u--image v-if="isCreateNext" src="/static/img/assist/follow_up_reduce.png" width="24px"
								height="24px"></u--image>
						</u-form-item>
						<view v-if="isCreateNext">
							<u-form-item label="跟进时间" prop="task.connectTime" ref="item1" :required="true"
								@click="showDatePicker = true; hideKeyboard()" borderBottom>
								<u--input v-model="customerForm.task.connectTime" border="none" placeholder="请选择"
									clearable disabled disabledColor="#ffffff"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
							<u-form-item label="跟进内容" prop="task.content" ref="item1" borderBottom>
								<u--input v-model="customerForm.task.content" border="none" placeholder="请填写" clearable>
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
							<!-- <u-form-item label="创建人" prop="name" ref="item1" borderBottom>
								<u--input v-model="itemInfo.name" border="none" placeholder="请选择" :disabled="disabled"
									disabledColor="#ffffff" clearable maxlength="30"></u--input>
							</u-form-item> -->
							<!-- <u-form-item label="所属部门" prop="projectName" ref="item1">
								<u--input v-model="itemInfo.projectName" border="none" placeholder="请选择"
									:disabled="disabled" disabledColor="#ffffff" clearable maxlength="30"></u--input>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item> -->
						</view>
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

		<u-picker :show="showArea" @close="showArea=false" keyName="label" @cancel="showArea=false" ref="uPicker"
			:columns="areaLst" @confirm="confirmArea" @change="changeHandler"></u-picker>

		<u-picker :show="showPicker" :columns="lstExpense_type" keyName="label" closeOnClickOverlay
			:defaultIndex="defaultIndex" @close="showPicker=false" @cancel="showPicker=false"
			@confirm="confirmExpense_type"></u-picker>

		<u-datetime-picker :show="showDatePicker" v-model="datetime" mode="datetime" :minDate="minDate"
			:maxDate="maxDate" closeOnClickOverlay @close="showDatePicker=false" @cancel="showDatePicker=false"
			@confirm="confirm"></u-datetime-picker>

		<u-modal :content="modalContent" :show="showModal" :title="modalTitle" showCancelButton closeOnClickOverlay
			@confirm="confirmModal" @cancel="showModal=false" @close="showModal=false"></u-modal>

		<!-- <u-modal :show="showDelete" title="删除确认" content='确定要删除该联系人吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal> -->
		<view class="searchTipsBox" :style="{ 'top': 58+statusBarHeight + 'px'}" v-if="shearchTipsShow">
			<view class="searchTipsList" v-for="item in companyList" :key="item.taxNumber" @click="getInfo(item)">
				<view class="companyName">{{item.name}}</view>
				<view class="companyName_mate ">公司名称匹配</view>
			</view>
		</view>
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
		getEnterpriseFuzzySearch,
		customerAdd,
		customerEdit,
		deleteContact,
		getSysCustomerDetail,
		uploadPicture,
		deletePicture
	} from "@/util/interface.js"
	import area from "../../../util/area.json"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				disabled: false,
				navTitle: "新建客户",
				userInfo: {},
				isMicroEntStatus: false, //小微企业,字典表is_micro_ent
				customerForm: { //新增集合
					contact: { //联系人信息

					},
					customer: { //客户信息
						customerStatus: "", //	客户状态,字典表customer_status
						customerLevel: "", //	客户级别,字典表customer_level	
						customerSource: "", //	客户来源,字典表customer_source
						companyOrgType: "", //	企业类型,字典表company_org_type
						operatingState: "", //	经营状态,字典表operating_state
						staffNumRange: "", //	人员规模,字典表staff_num_range
						taxNumber: "", //	纳税人识别号
						name: "", //	客户名称	
						address: "", //	详细地址	
						isMicroEnt: "", //	小微企业,字典表is_micro_ent
						remark: "", //	备注	
						createById: "", //	创建人
						createUserName: "", //	创建人名称
						createTime: "", //	创建时间	
						deptId: "", //	所属部门ID	
						deptName: "", //	所属部门名称	
						area: "", //	所在地区	
						areaCode: "", //	所在地区code	
						customerType: "", //	客户类型,字典表customer_type	
						industry: "", //	所属行业,字典表 industry	
						industryText: "", //	行业字典值

						// collect:"",//	是否关注 0否 1是						
						// createById:"",//	创建人
						// createTime:"",//	创建时间	
						// createUserName:"",//	创建人名称
						// dayOfNotContact:"",//	未跟进天数
						// delTime:"",//
						// deptId:"",//	所属部门ID	
						// deptName:"",//	所属部门名称	
						// email:"",//	电子邮箱	
						// id:"",//	id

						// lastContactTime:"",//	最后跟进时间
						// latitude:"",//	经度	
						// longitude:"",//	纬度	
						// nextContactTime:"",//	下次跟进时间	
						// phoneNumber:"",//	手机号
						// previousDeptId:"",//	前所属部门ID	
						// previousDeptName:"",//	前所属部门名称
						// previousResponsiblePerson:"",//	前负责人Id
						// previousResponsiblePersonName:"",//	前责任人名称
						// reimburseNo:"",//	系统编号
						// responsiblePerson:"",//	负责人Id	
						// responsiblePersonName:"",//	责任人名称
						// updateById:"",//	更新人
						// updateTime:"",//	更新日期
					},
					task: { //下次跟进任务
						advanceNoticeCode: "", //	提前通知时间,字典表advance_notice
						emailNotification: "0", //	是否邮件通知 0否 1是
						smsNotification: "0", //	是否短信通知 0否 1是
						systemNotification: "0", //	是否系统通知 0否 1是
						connectTime: "", //	跟进时间	
						content: "", //	跟进内容	
						sysUserId: "", //跟进人员


						// customerId:"",//	客户id

						// id:"",//	id


					}
				},
				sysUserName: "", //跟进人员名称
				isAddContact: false, //是否点击新建首要联系人
				itemInfo: {
					name: "赵小刚",
					projectName: "",
					happenTime: "",
					value: false,
				},
				showDatePicker: false,
				minDate: "",
				maxDate: "",
				datetime: GetNowFormatDate('yyyy-mm-dd hh:MM'),
				showPicker: false,
				lstExpense_type: [],
				defaultIndex: [],
				selectType: '', //选择项的类型
				operating_state: [], //operating_state
				customer_status: [], //客户状态
				customerStatusName: "", //客户状态名称
				customer_level: [], //客户级别
				customer_levelName: "", //客户级别名称
				customer_source: [], //客户来源
				customer_sourceName: "", //客户来源名称
				company_org_type: [], //企业类型
				company_org_typeName: "", //企业类型名称
				operating_state: [], //经营状态
				operating_stateName: "", //经营状态名称
				staff_num_range: [], //人员规模
				staff_num_rangeName: "", //人员规模名称
				advance_notice: [], //任务提醒
				advance_noticeName: "", //任务提醒名称
				industry: [], //所属行业
				industryName: "", //所属行业名称
				showArea: false,
				areaLst: [], //地区
				areaName: "",
				is_micro_ent: [], //是否小微企业
				sys_customer_contact_role: [], //角色
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
				lstDepartment: [], //所属部门
				departmentName: "",

				isCreateNext: false,
				modalContent: "",
				modalTitle: "",
				showModal: false,
				seeMore: false, //查看更多
				IndustryRadio: "0", //所属行业
				disabledRadio: false,
				disabledColor: "rgba(240,240,240,0.6)",
				radiolist: [{
					name: '企业客户',
					index: '1',
				}, {
					name: '个人客户',
					index: '2',
				}],
				isSelected: false,
				shearchTipsShow: false, //显示
				companyList: [],
				companyListSeached: [],
				customerId: "", //客户id
				isUpdata: false,
				returnPageNumber: 1, //返回的页数
				deleteContact: false, //是否删除联系人
				isClick: false, //防止重复点击保存按钮
				isOCR: false, //是否ocr进入
			}
		},
		onLoad(option) {
			this.customerId = isEmpty(option.customerId) ? 0 : option.customerId; //客户id
			this.isUpdata = isEmpty(option.isUpdata) ? false : option.isUpdata;
			this.returnPageNumber = isEmpty(option.returnPageNumber) ? 1 : parseInt(option.returnPageNumber);
			this.isOCR = isEmpty(option.isOCR) ? false : option.isOCR;

			this.customer_status.push(getApp().globalData.customer_status) //客户状态
			this.customer_level.push(getApp().globalData.customer_level) //客户级别
			this.customer_source.push(getApp().globalData.customer_source) //客户来源
			this.company_org_type.push(getApp().globalData.company_org_type) //企业类型
			this.operating_state.push(getApp().globalData.operating_state) //经营状态
			this.staff_num_range.push(getApp().globalData.staff_num_range) //人员规模
			this.advance_notice.push(getApp().globalData.advance_notice) //任务提醒
			this.is_micro_ent.push(getApp().globalData.is_micro_ent) //任务提醒
			this.radiolist = getApp().globalData.customer_type //客户类型
			this.industry.push(getApp().globalData.industry) //所属行业
			this.sys_customer_contact_role.push(getApp().globalData.sys_customer_contact_role) //角色
			//所属地区
			this.areaLst.push(area)
			this.areaLst.push(area[0].children)
			this.areaLst.push(area[0].children[0].children)


			this.userInfo = this.$cache.get('_userInfo')
			this.customerForm.customer.createById = this.userInfo.id //	创建人
			this.customerForm.customer.createUserName = this.userInfo.realname //	创建人名称
			this.customerForm.customer.createTime = GetNowFormatDate('yyyy-mm-dd hh:MM:ss'); //	创建人名称
			this.customerForm.task.sysUserId = this.userInfo.id //	跟进人员
			this.sysUserName = this.userInfo.realname //跟进人员名称
			let arrid = this.userInfo.deptIds.split(",");
			let arrName = this.userInfo.deptNames.split(",");
			let lstDept = [];
			for (let i in arrid) {
				lstDept.push({
					value: arrid[i],
					label: arrName[i]
				})
			}
			this.lstDepartment.push(lstDept);
			this.departmentName = this.lstDepartment[0][0].label;
			this.customerForm.customer.deptId = this.lstDepartment[0][0].value; //	所属部门ID
			this.customerForm.customer.deptName = this.lstDepartment[0][0].value; //	所属部门名称	


			let date = new Date()
			date.setFullYear(date.getFullYear() + 10);
			this.minDate = Date.parse(new Date());
			this.maxDate = Date.parse(new Date(date));

			if (this.isUpdata) { // 编辑数据
				this.isAddContact = true;
				this.navTitle = "编辑客户"
				this.getUpdata();
			}
			if (this.isOCR) {
				this.getOCRData()
			}
		},
		onShow() {
			let _that = this;
			uni.$once('returnContact', res => {
				if (res) {
					console.log(res)
					_that.customerForm.contact = res;
					_that.customerForm.contact.isPrimary = 1
					_that.isAddContact = true;
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
					this.sysUserName = UserName
					this.customerForm.task.sysUserId = chargeId
					// this.chargeUserName = ''
					// let chargeId = ''
					// lstSelectUser.forEach(v=>{
					// 	this.chargeUserName += v.name + ','
					// 	console.log('回选人员',v)
					// 	chargeId  += v.id + ','
					// })
					// this.chargeUserName = this.chargeUserName.substr(0, this.chargeUserName.length - 1)
					// this.itemInfo.chargeId = chargeId.substr(0, this.chargeUserName.length - 1)
				}
			})
		},
		methods: {
			//截取前四位的字符串
			sliceString(stringObject, start, end) {
				if (!stringObject) return;
				return stringObject.slice(start, end)
			},
			//获取编辑的数据
			getUpdata() {
				console.log(this.customerId)
				let data = "?id=" + this.customerId
				getSysCustomerDetail(data, res => {
					if (res.code == 200 && res.success) {
						this.customerForm.contact = res.result.contact;
						this.customerForm.customer = res.result.customer;
						this.shearchTipsShow = false
						if (!isEmpty(res.result.task)) {
							this.customerForm.task = res.result.task;
						}
						this.sys_customer_contact_role[0].forEach(v => { //角色(联系人)
							if (v.value == this.customerForm.contact.roleValue) {
								this.customerForm.contact.sys_customer_contact_roleName = v.label
							}
						})
						this.IndustryRadio = (this.customerForm.customer.customerType).toString();
						this.operating_state[0].forEach(v => { //经营状态  
							if (v.value == this.customerForm.customer.operatingState) {
								this.operating_stateName = v.label
								this.customerForm.customer.operatingState = v.value
							}
						})
						this.staff_num_range[0].forEach(v => { //人员规模
							if (v.value == this.customerForm.customer.staffNumRange) {
								this.customerForm.customer.staffNumRange = v.value;
								this.staff_num_rangeName = v.label;
							}
						})
						this.company_org_type[0].forEach(v => { //企业类型
							if (v.value == this.customerForm.customer.companyOrgType) {
								this.customerForm.customer.companyOrgType = v.value;
								this.company_org_typeName = v.label;
							}
						})
						this.isMicroEntStatus = parseInt(this.customerForm.customer.isMicroEnt) == 0 ? false :
							true //是否小微企业
						this.areaName = this.customerForm.customer.area
						this.customer_status[0].forEach(v => { //客户状态
							if (v.value == this.customerForm.customer.customerStatus) {
								this.customerForm.customer.customerStatus = v.value;
								this.customerStatusName = v.label;
							}
						})
						this.customer_level[0].forEach(v => { //客户级别
							if (v.value == this.customerForm.customer.customerLevel) {
								this.customerForm.customer.customerLevel = v.value;
								this.customer_levelName = v.label;
							}
						})
						this.customer_source[0].forEach(v => { //客户来源
							if (v.value == this.customerForm.customer.customerSource) {
								this.customerForm.customer.customerSource = v.value;
								this.customer_sourceName = v.label;
							}
						})
						this.industry[0].forEach(v => { //客户来源
							if (v.value == this.customerForm.customer.industry) {
								this.customerForm.customer.industry = v.value;
								this.industryName = v.label;
							}
						})

					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//获取ocr的数据
			getOCRData() {
				let item = uni.getStorageSync("OCRresult");
				console.log("新增客户", item)
				this.customerForm.customer.name = item.companyName;
				this.customerForm.customer.taxNumber = item.creditCode;
				this.customerForm.customer.address = item.businessAddress;
				this.companyList = []
				this.getRefreshDate();
			},
			getRefreshDate(){
				let data = "?keyword=" + this.customerForm.customer.name; //企业名称
				getEnterpriseFuzzySearch(data, res => {
					console.log('企查查', res)
					if (res.code == 200 && res.result.length > 0) {
						this.companyList = res.result
						this.companyListSeached = res.result
						const findResult = this.companyList.find((x) => x.name === this.customerForm.customer.name)
						if(!isEmpty(findResult)){
							this.getInfo(findResult)
						}
						if (!this.isOCR) {
							setTimeout(() => {
								uni.$u.toast("已刷新工商信息");
							}, 800)
						}
						
						
					} else {
						this.companyList = []
						this.companyListSeached = []
					}
				})
			},
			//状态查询
			getDictItems(dictCode) {
				let data = "?dictCode=" + dictCode
				getDictItemsByCode(data, res => {
					if (res.code == 200 && res.success) {
						let lst = [];
						for (let j = 0; j < res.result.length; j++) {
							lst.push({
								name: res.result[j].text,
								value: res.result[j].value
							})
							if (j == res.result.length - 1) {
								this.lstcustomer_status = lst
							}
						}
					} else {
						uni.$u.toast(res.message);
					}
					console.log(res)
				})
			},
			leftClick() {
				this.showModal = true;
				this.modalTitle = "是否取消";
				this.modalContent = "资料尚未提交，是否取消编辑？";
				this.deleteContact = false; ////是否删除联系人
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
			//删除首要联系人
			deleteContactDate() {
				this.showModal = true;
				this.modalTitle = "删除确认";
				this.modalContent = "确定要删除该联系人吗？"
				this.deleteContact = true;

			},
			confirmDelete() {
				const data = '?id=' + this.customerForm.contact.id;
				deleteContact(data, res => {
					this.showModal = false;
					this.deleteContact = false;
					if (res.code == 200 && res.success) {
						uni.$u.toast("删除成功");
						this.isAddContact = false;
						this.customerForm.contact = {};
						// setTimeout(() => {
						// 	uni.navigateBack();
						// }, 1000)
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			clickExpense(type) {
				this.selectType = type
				switch (type) {
					case 'customer_status': //客户状态
						this.lstExpense_type = this.customer_status;
						this.showPicker = true;
						break;

					case 'customer_level': //客户级别
						this.lstExpense_type = this.customer_level;
						this.showPicker = true;
						break;

					case 'customer_source': //客户来源
						this.lstExpense_type = this.customer_source;
						this.showPicker = true;
						break;

					case 'company_org_type': //企业类型
						if (this.IndustryRadio == 0) {
							this.lstExpense_type = this.company_org_type;
							this.showPicker = true;
						}
						break;

					case 'operating_state': //经营状态
						if (this.IndustryRadio == 0) {
							this.lstExpense_type = this.operating_state;
							this.showPicker = true;
						}
						break;

					case 'staff_num_range': //人员规模
						if (this.IndustryRadio == 0) {
							this.lstExpense_type = this.staff_num_range;
							this.showPicker = true;
						}
						break;

					case 'advance_notice': //任务提醒
						this.lstExpense_type = this.advance_notice;
						this.showPicker = true;
						break;

					case 'reminder_mode': //提醒方式
						this.lstExpense_type = this.reminder_mode;
						this.showPicker = true;
						break;

					case 'department': //所属部门
						this.lstExpense_type = this.lstDepartment;
						this.showPicker = true;
						break;

					case 'industry': //所属行业
						this.lstExpense_type = this.industry;
						this.showPicker = true;
						break;



					case 'chargeUser':
						uni.navigateTo({
							url: "/pages/filter-all/select-more?total=1000" + "&title=负责人员" + '&isMutiple=true'
						});
						break;
				}
			},
			// 确认按钮
			confirmExpense_type(e) {
				let type = this.selectType
				switch (type) {
					case 'customer_status': //客户状态
						this.customerForm.customer.customerStatus = e.value[0].value + '';
						this.customerStatusName = e.value[0].label;
						break;

					case 'customer_level': //客户级别
						this.customerForm.customer.customerLevel = e.value[0].value + '';
						this.customer_levelName = e.value[0].label;
						break;

					case 'customer_source': //客户来源
						this.customerForm.customer.customerSource = e.value[0].value + '';
						this.customer_sourceName = e.value[0].label;
						break;

					case 'company_org_type': //企业类型
						this.customerForm.customer.companyOrgType = e.value[0].value + '';
						this.company_org_typeName = e.value[0].label;
						break;

					case 'operating_state': //经营状态
						this.customerForm.customer.operatingState = e.value[0].value + '';
						this.operating_stateName = e.value[0].label;
						break;

					case 'staff_num_range': //人员规模
						this.customerForm.customer.staffNumRange = e.value[0].value + '';
						this.staff_num_rangeName = e.value[0].label;
						break;

					case 'advance_notice': //任务提醒
						this.customerForm.task.advanceNoticeCode = e.value[0].value + '';
						this.advance_noticeName = e.value[0].label;
						break;

					case 'reminder_mode': //提醒方式
						if (e.value[0].value == 'systemNotification') { //是否系统通知
							this.customerForm.task.systemNotification = 1;
							this.customerForm.task.smsNotification = 0;
							this.customerForm.task.emailNotification = 0;
						} else if (e.value[0].value == 'smsNotification') { //是否短信通知 
							this.customerForm.task.smsNotification = 1;
							this.customerForm.task.systemNotification = 0;
							this.customerForm.task.emailNotification = 0;
						} else if (e.value[0].value == 'emailNotification') { //是否邮件通知 0否 1是
							this.customerForm.task.emailNotification = 1;
							this.customerForm.task.systemNotification = 0;
							this.customerForm.task.smsNotification = 0;
						}
						this.reminder_modeName = e.value[0].label;
						break;

					case 'department': //所属部门
						this.customerForm.customer.deptId = e.value[0].value + ''; //	所属部门ID
						this.customerForm.customer.deptName = e.value[0].label + ''; //	所属部门名称	
						this.departmentName = e.value[0].label;
						break;
					case 'industry': //所属行业
						this.customerForm.customer.industry = e.value[0].value + '';
						this.customerForm.customer.industryText = e.value[0].label;
						this.industryName = e.value[0].label;
						break;

					case 'is_micro_ent':
						this.itemInfo.isMicroEnt = e.value[0].value + '';
						this.isMicroEntName = e.value[0].label;
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
			focusEven() {
				this.isSelected = false
				if (this.companyListSeached.length > 0) {
					this.shearchTipsShow = true
				}
			},
			blurEven() {
				setTimeout(() => {
					this.shearchTipsShow = false
				}, 200)
			},
			searchChange() {
				if (this.isSelected) {
					return
				}
				this.getCompany()
			},
			getCompany() {
				if (this.customerForm.customer.name) {
					this.companyList = []
					let data = "?keyword=" + this.customerForm.customer.name; //企业名称
					getEnterpriseFuzzySearch(data, res => {
						console.log('企查查', res)
						if (res.code == 200 && res.result.length > 0) {
							this.companyList = res.result
							this.companyListSeached = res.result
							this.shearchTipsShow = true
						} else {
							this.companyList = []
							this.companyListSeached = []
							this.shearchTipsShow = false
						}
					})
				}
			},
			getInfo(item) {
				this.shearchTipsShow = false
				this.isSelected = true
				console.log(item)
				this.customerForm.customer.name = item.name;
				this.customerForm.customer.taxNumber = item.taxNumber;
				this.customerForm.customer.address = item.address;
				this.operating_state[0].forEach(v => { //经营状态
					if (v.value == item.operatingState) {
						this.operating_stateName = v.label
						this.customerForm.customer.operatingState = v.value
					}
				})
				this.staff_num_range[0].forEach(v => { //人员规模
					if (v.value == item.staffNumRange) {
						this.customerForm.customer.staffNumRange = v.value;
						this.staff_num_rangeName = v.label;
					}
				})
				this.company_org_type[0].forEach(v => { //企业类型
					if (v.value == item.companyOrgType) {
						this.customerForm.customer.companyOrgType = v.value;
						this.company_org_typeName = v.label;
					}
				})
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
				this.customerForm.customer.area = item[0].label +
					(isEmpty(item[1]) ? '' : "," + item[1].label) +
					(isEmpty(item[2]) ? '' : "," + item[2].label) //	所在地区
				this.customerForm.customer.areaCode = item[0].value +
					(isEmpty(item[1]) ? '' : "," + item[1].value) +
					(isEmpty(item[2]) ? '' : "," + item[2].value) //	所在地区code	
				this.areaName = item[0].label +
					(isEmpty(item[1]) ? '' : "/" + item[1].label) +
					(isEmpty(item[2]) ? '' : "/" + item[2].label) //	所在地区 //	所在地区
				this.showArea = false;
			},
			//是否小微企业
			changeIsMicroEnt(e) {
				//console.log(e)
				this.isMicroEntStatus = e;
			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			//跟进时间  确认按钮
			confirm(e) {
				const timeFormat = uni.$u.timeFormat;
				this.customerForm.task.connectTime = timeFormat(e.value, 'yyyy-mm-dd hh:MM');
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
			//新建首要联系人
			addContact() {
				if (!isEmpty(this.customerForm.customer.name)) {
					if (isEmpty(this.customerForm.contact.name)) {
						uni.navigateTo({
							url: "/pages/assist/customerManagement/newContact?returnPageNumber=1&type=1&customerName=" +
								this.customerForm.customer.name
						})
					} else {
						this.customerForm.contact.customerName = this.customerForm.customer.name;
						uni.setStorageSync('contactDetails', this.customerForm.contact)
						uni.navigateTo({
							url: "/pages/assist/customerManagement/newContact?returnPageNumber=1&type=1&isupdata=true&customerName=" +
								this.customerForm.customer.name
						})
					}

				} else {
					uni.$u.toast('请先填写客户名称');
				}

			},

			groupChange(e) {
				if (e == 0) {
					this.disabledRadio = false
				} else {
					this.disabledRadio = true
				}
				this.IndustryRadio = e;
				this.customerForm.customer.customerType = e
			},
			//验证数据
			validateField() {
				if (isEmpty(this.customerForm.customer.name)) {
					uni.$u.toast("客户名称不能为空");
					return false;
				}
				if (isEmpty(this.customerForm.contact.name)) {
					uni.$u.toast("联系人不能为空");
					return false;
				}
				if (this.isCreateNext) {
					if (isEmpty(this.customerForm.task.connectTime)) {
						uni.$u.toast("跟进时间不能为空");
						return false;
					}
					if (isEmpty(this.customerForm.task.sysUserId)) {
						uni.$u.toast("跟进人员不能为空");
						return false;
					}
				} else {
					this.customerForm.task = null
				}
				return true;
			},
			//保存
			save() {
				this.customerForm.customer.isMicroEnt = this.isMicroEntStatus ? '1' : '0'
				if (this.validateField() && !this.isClick) {
					this.isClick = true;
					console.log(this.customerForm)
					if (this.isUpdata) {
						customerEdit(this.customerForm, res => {
							if (res.code == 200 && res.success) {
								uni.$u.toast(res.message);
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
						customerAdd(this.customerForm, res => {
							if (res.code == 200 && res.success) {
								uni.$u.toast(res.message);
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
					}
				}

				//uni.navigateBack();
				//uni.$u.toast("保存成功");
				//customerAdd(data,res=>{

				//})
			},
			empty() {
				this.isAddContact = false;
				this.isMicroEntStatus = false, //小微企业,字典表is_micro_ent
					this.customerForm = { //新增集合
						contact: { //联系人信息

						},
						customer: { //客户信息
							customerStatus: "", //	客户状态,字典表customer_status
							customerLevel: "", //	客户级别,字典表customer_level	
							customerSource: "", //	客户来源,字典表customer_source
							companyOrgType: "", //	企业类型,字典表company_org_type
							operatingState: "", //	经营状态,字典表operating_state
							staffNumRange: "", //	人员规模,字典表staff_num_range
							taxNumber: "", //	纳税人识别号
							name: "", //	客户名称	
							address: "", //	详细地址	
							isMicroEnt: "", //	小微企业,字典表is_micro_ent
							remark: "", //	备注	
							createById: "", //	创建人
							createUserName: "", //	创建人名称
							createTime: "", //	创建时间	
							deptId: "", //	所属部门ID	
							deptName: "", //	所属部门名称	
							area: "", //	所在地区	
							areaCode: "", //	所在地区code	
							customerType: "", //	客户类型,字典表customer_type	
						},
						task: { //下次跟进任务
							advanceNoticeCode: "", //	提前通知时间,字典表advance_notice
							emailNotification: "0", //	是否邮件通知 0否 1是
							smsNotification: "0", //	是否短信通知 0否 1是
							systemNotification: "0", //	是否系统通知 0否 1是
							connectTime: "", //	跟进时间	
							content: "", //	跟进内容	
							sysUserId: "", //跟进人员
						}
					};
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
	}

	/deep/.u-radio-group--row {
		position: absolute !important;
		right: 0px !important;
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

	.see-more {
		height: 48px;
		text-align: center;
		color: rgba(0, 114, 255, 1);
		line-height: 48px;
		margin-top: 10px;
		font-size: 15px;

		.logo {
			width: 16px;
			height: 16px;
			top: 3px;
		}
	}

	/deep/.mark {

		position: relative;
		//height: 500rpx; 
		color: rgba(96, 98, 102, 0.5);
		background: rgba(0, 0, 0, 0.06);
		left: 0%;
		right: 0%;
		box-shadow: 2px -3px 0px -5px #FFFFFF;

		.u-form-item__body {
			.u-form-item__body__left__content__label {
				//font-size: 14px;
				color: rgba(96, 98, 102, 0.6);
			}

			.u-form-item__body__right__content__slot {
				//font-size: 14px;
				color: rgba(96, 98, 102, 0.6);
			}

			.u-icon__icon {
				color: rgba(96, 98, 102, 0.6) !important;
			}
		}
	}

	.searchTipsBox {
		width: 100%;
		padding: 0 16px;
		//background-color: #f5f1ed;
		//background-color: #fff;
		position: fixed;
		top: 100px;
		left: 0;
		box-sizing: border-box;
		height: 200px;
		overflow-y: auto;
		//box-shadow: 0px 1px 8px rgba(255,255,255,.7);
		background: #FFFFFF;
	    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.02);
		.searchTipsList {
			width: 100%;
			height: 20px;
			font-size: 14px;
			font-weight: 500;
			color: #606266;
			line-height: 20px;
			padding: 14px 0;
			display: flex;
			justify-content: space-between;

			.companyName_mate {
				width: 72px;
				height: 17px;
				font-size: 12px;
				font-weight: 500;
				color: #C0C4CC;
				line-height: 14px;
			}
		}
	}
</style>
