<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="false" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>

		<view v-if="isUpdate && isLoading">
			<u-loading-icon text="加载中" textSize="18" :vertical="true" size="32"></u-loading-icon>
		</view>
		<view v-else>
			<u--form :model="itemInfo" ref="form1" labelPosition="left" labelWidth="105" id="myForm">
				<view class="top-height">
					<u-form-item label="公司名称" prop="name" :required="true" borderBottom ref="item1" labelWidth="85">
						<u--input v-model="itemInfo.name" border="none" placeholder="请输入公司名称" clearable
							disabledColor="#ffffff" maxlength="30" @input="searchChange" @blur="blurEven"
							@focus="focusEven"></u--input>
					</u-form-item>
					<u-form-item label="供应商级别" prop="supplierLevel" borderBottom ref="item1"
						@click="clickExpense('supplier_level'); hideKeyboard()">
						<u--input v-model="supplierLevelName" border="none" placeholder="请选择" clearable disabled
							disabledColor="#ffffff"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
				</view>
				<view class="top-height">
					<u-form-item label="纳税人识别号" prop="taxNumber" borderBottom ref="item1">
						<u--input v-model="itemInfo.taxNumber" border="none" placeholder="请填写" maxlength="30" clearable>
						</u--input>
					</u-form-item>
					<u-form-item label="经营状态" prop="operatingState" borderBottom ref="item1"
						@click="clickExpense('operating_state'); hideKeyboard()">
						<u--input v-model="operatingStateName" border="none" placeholder="请选择" clearable disabled
							disabledColor="#ffffff"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="企业类型" prop="companyOrgType" borderBottom ref="item1"
						@click="clickExpense('company_org_type'); hideKeyboard()">
						<u--input v-model="companyOrgTypeName" border="none" placeholder="请选择" clearable disabled
							disabledColor="#ffffff"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="人员规模" prop="staffNumRange" borderBottom ref="item1"
						@click="clickExpense('staff_num_range'); hideKeyboard()">
						<u--input v-model="staffNumRangeName" border="none" placeholder="请选择" clearable disabled
							disabledColor="#ffffff"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="是否小微企业" prop="isMicroEntStatus" borderBottom ref="item1">
						<u-switch slot="right" v-model="itemInfo.isMicroEntStatus" @change="change"></u-switch>
					</u-form-item>

				</view>

				<view class="top-height">
					<u-form-item label="所在地区" prop="area" borderBottom ref="item1"
						@click="showArea = true; hideKeyboard()">
						<u--input v-model="itemInfo.area" border="none" placeholder="请选择" disabled
							disabledColor="#ffffff" clearable maxlength="30"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="详细地址" prop="address" borderBottom ref="item1">
						<u--input v-model="itemInfo.address" border="none" placeholder="请填写" clearable maxlength="30">
						</u--input>
					</u-form-item>
				</view>

				<view class="top-height">
					<u-form-item label="负责人员" prop="chargeUser" borderBottom ref="item1"
						@click="clickExpense('chargeUser'); hideKeyboard()">
						<u--input v-model="chargeUserName" border="none" placeholder="请选择" clearable disabled
							disabledColor="#ffffff"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
				</view>

				<view class="top-height">
					<u-form-item label="公司介绍" prop="companyIntroduction" ref="item1"></u-form-item>
					<u--textarea v-model="itemInfo.companyIntroduction" border="none" placeholder="请输入公司介绍"
						maxlength="300" v-if="navTitle != '编辑供应商'"></u--textarea>
					<u-read-more :toggle="true" showHeight="100" closeText="展开" v-if="navTitle == '编辑供应商'">
						<rich-text :nodes="itemInfo.companyIntroduction" @load="load" class="richTextContent">
						</rich-text>
					</u-read-more>
				</view>
				<view class="top-height" v-if="!isUp">
					<!-- <view class="productNameBox">
						<view class="productNameTitle">产品名称</view>
						<u--input v-model="itemInfo.memo" border="none" placeholder="请填写" clearable
						 disabledColor="#ffffff" class="product"></u--input>
					</view> -->
					<view class="line"></view>
					<u-form-item label="产品介绍" prop="mainProduction" ref="item1"></u-form-item>
					<u--textarea v-model="itemInfo.mainProduction" border="none" placeholder="请输入竞争产品的介绍" maxlength="300" v-if="navTitle != '编辑供应商'"></u--textarea>
					<u-read-more :toggle="true" showHeight="70" closeText="展开" v-if="navTitle == '编辑供应商'">
							<rich-text :nodes="itemInfo.mainProduction" @load="load" class="richTextContent"></rich-text>
						</u-read-more>
				</view>

				<view class="top-height" v-if="!isUp">
					<u-form-item label="供应商优势" prop="advantage" ref="item1"></u-form-item>
					<u--textarea v-model="itemInfo.advantage" border="none" placeholder="请输入对手优势" maxlength="300"
						v-if="navTitle != '编辑供应商'"></u--textarea>
					<u-read-more :toggle="true" showHeight="70" closeText="展开" v-if="navTitle == '编辑供应商'">
						<rich-text :nodes="itemInfo.advantage" class="richTextContent"></rich-text>
					</u-read-more>
				</view>
				<view class="top-height" v-if="!isUp">
					<u-form-item label="供应商劣势" prop="disadvantage" ref="item1"></u-form-item>
					<u--textarea v-model="itemInfo.disadvantage" border="none" placeholder="请输入对手劣势" maxlength="300"
						v-if="navTitle != '编辑供应商'"></u--textarea>
					<u-read-more :toggle="true" showHeight="70" closeText="展开" v-if="navTitle == '编辑供应商'">
						<rich-text :nodes="itemInfo.disadvantage" class="richTextContent"></rich-text>
					</u-read-more>
				</view>
				<view class="top-height" v-if="!isUp">
					<u-form-item label="附件" prop="itemInfo.name" ref="item1"></u-form-item>
					<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="6" :maxCount="5"
						multiple width="55" height="55">
						<image src="/static/img/workbench/icon_upload.png" mode="widthFix"
							style="width: 55px;height: 55px;"></image>
					</u-upload>
				</view>
			</u--form>

			<view class="anniu" @click="upDown" v-if="!isUp">
				<view>收起</view>
				<image src="/static/img/icon_anniu.png" mode="widthFix"
					style="width: 16px;height: 16px;margin-left: 2px;"></image>
			</view>

			<view class="anniu" @click="upDown" v-if="isUp">
				<view>查看更多</view>
				<image src="/static/img/icon_anniu2.png" mode="widthFix"
					style="width: 16px;height: 16px;margin-left: 2px;"></image>
			</view>

			<view style="padding: 40px 16px 16px;" class="saveBtn">
				<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="saveCost"></u-button>
			</view>
		</view>

		<u-picker :show="showPicker" :columns="lstExpense_type" keyName="label" closeOnClickOverlay
			:defaultIndex="defaultIndex" @close="showPicker=false" @cancel="showPicker=false"
			@confirm="confirmExpense_type"></u-picker>
		<u-modal :content="modalContent" :show="showModal" :title="modalTitle" showCancelButton closeOnClickOverlay
			@confirm="confirmModal" @cancel="showModal=false" @close="showModal=false"></u-modal>
		<u-overlay :show="showOverlay">
			<view class="warp">
				<u-loading-icon color="#fff" text="加载中" textSize="18" size="32" :vertical="true"></u-loading-icon>
			</view>
		</u-overlay>

		<view class="searchTipsBox" v-if="shearchTipsShow">
			<view class="searchTipsList" v-for="item in companyList" :key="item.name" @click="getInfo(item)">
				<view class="companyName">{{item.name}}</view>
				<view class="companyName_mate ">公司名称匹配</view>
			</view>
		</view>

		<u-picker :show="showArea" @close="showArea=false" keyName="label" @cancel="showArea=false" ref="uPicker"
			:columns="areaLst" @confirm="confirmArea" @change="changeHandler"></u-picker>
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
		getDictItemsByCode,
		uploadPicture,
		uploadPicturePlus,
		uploadAttachment,
		deletePicture,
		supplierAdd,
		costManageEdit,
		getEnterpriseFuzzySearch,
		supplierEdit
	} from "@/util/interface.js"
	import area from "../../util/area.json"
	export default {
		data() {
			return {
				smallCompany: false,
				shearchTipsShow: false,
				companyList: [],
				companyListSeached: [],
				isUp: true,
				isUpdate: false,
				isLoading: false, //加载中
				disabled: false,
				navTitle: "新建供应商",
				userInfo: {},
				datetime: js_date_time(new Date()),
				showPicker: false,
				lstExpense_type: [],
				defaultIndex: [],
				expenseTypeName: "", //费用类型名称
				fileList: [],
				showOverlay: false,
				itemInfo: {
					chargeId: "", //负责人员
					// id: "",
					memo: "",//费用描述
					name: "",//供应商名称
					uploadUrlId:"",//上传附件id（多个用“,”隔开）
					companyIntroduction:'',
					mainProduction:'',
					advantage:'',
					disadvantage:'',
					area:'',
					areaCode:'',
					address: "",
					// industry: "",
					isMicroEnt: "",
					isMicroEntStatus: false,
					operatingState: "",
					staffNumRange: "",
					companyOrgType: "",
					supplierLevel: "",
					taxNumber: "",
					chargeUser: '',
					fileIdList: []
				},
				rawCostInfo: {}, //获取表单时的原始数据
				diffCostInfo: {}, //差异数据
				modalContent: "",
				modalTitle: "",
				showModal: false,
				deleteFile: [],
				editFile: [],

				supplier_level: [], //资质等级
				company_org_type: [], //有限公司
				staff_num_range: [], //人数
				is_micro_ent: [], //小微
				operating_state: [], //存续
				lstSelectUser: [], //负责人id
				isMicroEntName: "",
				operatingStateName: "",
				staffNumRangeName: "",
				companyOrgTypeName: "",
				supplierLevelName: "",
				chargeUserName: '',
				selectType: '',
				isSelected: false,
				showArea: false,
				areaLst: [], //地区
				areaName: ''
			}

		},
		onShow() {
			let lstSelectUser = uni.getStorageSync('lstSelectUser') //1*60*60*24*7
			console.log('lstSelectUser', lstSelectUser)
			if (lstSelectUser) {
				let chargeUserName = ''
				let chargeId = ''
				lstSelectUser.forEach(v => {
					chargeUserName = v.name
					console.log('回选人员', v)
					chargeId = v.id
				})
				this.chargeUserName = chargeUserName
				this.itemInfo.chargeId = chargeId
			}
		},
		onLoad(option) {
			this.supplier_level.push(getApp().globalData.supplier_level)
			this.company_org_type.push(getApp().globalData.company_org_type)
			this.staff_num_range.push(getApp().globalData.staff_num_range)
			this.is_micro_ent.push(getApp().globalData.is_micro_ent)
			this.operating_state.push(getApp().globalData.operating_state)

			//所属地区
			this.areaLst.push(area)
			this.areaLst.push(area[0].children)
			this.areaLst.push(area[0].children[0].children)

			if (option.comefrom == 'detail') {
				let dataDetailSupplier = uni.getStorageSync('dataDetailSupplierEdit')
				if (dataDetailSupplier) {
					this.navTitle = '编辑供应商'
					dataDetailSupplier = JSON.parse(JSON.stringify(dataDetailSupplier))
					// console.log('获取缓存', dataDetailSupplier)
					this.getInfo(dataDetailSupplier)
					this.chargeUserName = dataDetailSupplier.chargeUserName
					if (this.itemInfo.isMicroEnt == '1') {
						this.itemInfo.isMicroEntStatus = true
					}
				}
			}else{
				// console.log('新建-默认负责人',this.$cache.get('_userInfo'))
				let userInfo = this.$cache.get('_userInfo')
				this.chargeUserName = userInfo.realname
				this.itemInfo.chargeId = userInfo.id
			}
		},
		onUnload() {
			if (this.isUpdate) { //清空添加了，右不保存的图片数据
				for (let i = 0; i < this.editFile.length; i++) {
					let fileId = "?fileId=" + this.editFile[i].id
					deletePicture(fileId, res => {
						console.log(res)
						if (res.code == 200 && res.success) {

						} else {
							uni.$u.toast(res.message);
						}
					})
					if (i == (this.editFile.length - 1)) {
						this.editFile = [];
					}
				}
			}
		},
		methods: {
			load() {},
			getInfo(item) {
				this.shearchTipsShow = false
				this.isSelected = true
				let obj = {
					...this.itemInfo,
					...item
				}
				this.itemInfo = obj
				this.supplier_level[0].forEach(v => {
					if (v.value == this.itemInfo.supplierLevel) {
						this.supplierLevelName = v.label
					}
				})
				this.company_org_type[0].forEach(v => {
					if (v.value == this.itemInfo.companyOrgType) {
						this.companyOrgTypeName = v.label
					}
				})
				this.staff_num_range[0].forEach(v => {
					if (v.value == this.itemInfo.staffNumRange) {
						this.staffNumRangeName = v.label
					}
				})
				this.operating_state[0].forEach(v => {
					if (v.value == this.itemInfo.operatingState) {
						this.operatingStateName = v.label
					}
				})
				this.is_micro_ent[0].forEach(v => {
					if (v.value == this.itemInfo.isMicroEnt) {
						this.isMicroEntName = v.label
					}
				})

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
				if (this.itemInfo.name) {
					this.companyList = []
					let data = "?keyword=" + this.itemInfo.name; //企业名称
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
			change(e) {
				console.log('change', e);
			},
			upDown() {
				this.isUp = !this.isUp
			},

			// 删除图片
			deletePic(event) {
				console.log(event)
				let url = event.file.url;
				let id = event.file.id
				if (this.isUpdate) {
					this.deleteFile.push(event.file);
					let ids = "";
					this.fileList.splice(event.index, 1)
					for (let i = 0; i < this.fileList.length; i++) {
						ids = isEmpty(ids) ? this.fileList[i].id : (ids + ',' + this.fileList[i].id)
					}
					this.itemInfo.uploadUrlId = ids
				} else {
					let data = "?fileId=" + id
					deletePicture(data, res => {
						if (res.code == 200 && res.success) {
							let ids = "";
							this.fileList.splice(event.index, 1)
							for (let i = 0; i < this.fileList.length; i++) {
								ids = isEmpty(ids) ? this.fileList[i].id : (ids + ',' + this.fileList[i].id)
							}
							this.itemInfo.uploadUrlId = ids
							console.log(this.itemInfo)
						} else {
							uni.$u.toast(res.message);
						}
					})
				}
			},
			// 图片上传
			async afterRead(event) {
				let that = this;
				// that.showOverlay=true;
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)

				let filesList = []
				lists.forEach(v => {
					let name = v.url.split('/')
					let obj = {
						name: name[name.length - 1],
						uri: v.url,
					}
					filesList.push(obj)
				})

				let fileListLen = this.fileList.length
				lists.map((item) => {
					this.fileList.push({
						...item,
						//status: 'uploading',
						message: '上传中'
					})
				})
				that.showOverlay = false;

				uploadPicturePlus(filesList, res => {
					let resFiles = JSON.parse(res).result
					resFiles.forEach(item => {
						this.itemInfo.fileIdList.push(item.fileId)
					})
					console.log('图片上传结果', JSON.parse(res).result)
				})
			},
			//取消按钮
			leftClick() {
				this.showModal = true;
				this.modalTitle = "是否取消";
				this.modalContent = "资料尚未提交，是否取消编辑？"
				//uni.navigateBack() 
			},
			//取消按钮 ==》弹出确认按钮
			confirmModal() {
				uni.navigateBack();
			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},

			clickExpense(type) {
				this.selectType = type
				switch (type) {
					case 'operating_state':
						this.lstExpense_type = this.operating_state;
						this.showPicker = true;
						break;

					case 'supplier_level':
						this.lstExpense_type = this.supplier_level;
						this.showPicker = true;
						break;

					case 'company_org_type':
						this.lstExpense_type = this.company_org_type;
						this.showPicker = true;
						break;

					case 'staff_num_range':
						this.lstExpense_type = this.staff_num_range;
						this.showPicker = true;
						break;

					case 'is_micro_ent':
						this.lstExpense_type = this.is_micro_ent;
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
					case 'operating_state':
						this.itemInfo.operatingState = e.value[0].value + '';
						this.operatingStateName = e.value[0].label;
						break;

					case 'supplier_level':
						this.itemInfo.supplierLevel = e.value[0].value + '';
						this.supplierLevelName = e.value[0].label;
						break;

					case 'company_org_type':
						this.itemInfo.companyOrgType = e.value[0].value + '';
						this.companyOrgTypeName = e.value[0].label;
						break;

					case 'staff_num_range':
						this.itemInfo.staffNumRange = e.value[0].value + '';
						this.staffNumRangeName = e.value[0].label;
						break;

					case 'is_micro_ent':
						this.itemInfo.isMicroEnt = e.value[0].value + '';
						this.isMicroEntName = e.value[0].label;
						break;
				}

				this.showPicker = false;
			},
			//验证数据
			validateField() {
				if (isEmpty(this.itemInfo.name)) {
					uni.$u.toast("公司名称不能为空");
					return false;
				}
				return true;
			},
			//清空编辑的时候，添加了又删除了图片的数据
			deleteImg() {
				console.log(this.deleteFile)
				for (let i = 0; i < this.deleteFile.length; i++) {
					let fileId = "?fileId=" + this.deleteFile[i].id
					deletePicture(fileId, res => {
						console.log(res)
						if (res.code == 200 && res.success) {
							uni.showToast({
								title: "删除成功!"
							});
						} else {
							uni.$u.toast(res.message);
						}
					})
					if (i == (this.deleteFile.length - 1)) {
						this.deleteFile = [];
					}
				}
			},
			//比较差异的方法
			diffData() {
				// this.rawCostInfo={...this.itemInfo};//原始数据
				// this.diffCostInfo={};
				for (let k in this.rawCostInfo) {
					if (this.rawCostInfo[k] != this.itemInfo[k]) {
						if (!this.diffCostInfo) {
							this.diffCostInfo = {}
						}
						this.diffCostInfo[k] = this.itemInfo[k]
					}
				}
			},
			//保存(表单提交)
			saveCost(){
				if(this.validateField()){
					if(this.navTitle == '编辑供应商'){//修改
					this.itemInfo.isMicroEnt = this.itemInfo.isMicroEntStatus?'1':'0'
							supplierEdit(this.itemInfo,res=>{
								console.log(res)
								if(res.code==200 && res.success){	
									uni.showToast({
									    title: "修改成功!"
									});
									uni.$u.toast(res.message);
									this.deleteImg();
									uni.$emit('return', true);
									this.isUpdate=false;
									this.empty();
									uni.setStorageSync('feeDetails',res.result)
									uni.navigateBack({
										url: "/pages/supplier/detai"
									})							
								}else{
									uni.$u.toast(res.message);
								}
							})
					}
					// else{//新增
					// this.itemInfo.isMicroEnt = this.itemInfo.isMicroEntStatus?'1':'0'
					// delete this.itemInfo.id
					// delete this.itemInfo.industry
					
					// 	supplierAdd(this.itemInfo,res => {
					// 		if(res.code == 200 && res.success){
					// 			uni.showToast({
					// 				title: "修改成功!"
					// 			});
					// 			uni.$u.toast(res.message);
					// 			this.deleteImg();
					// 			uni.$emit('return', true);
					// 			this.isUpdate = false;
					// 			this.empty();
					// 			uni.setStorageSync('feeDetails', res.result)
					// 			uni.navigateBack({
					// 				url: "/pages/supplier/detai"
					// 			})
					// 		} else {
					// 			uni.$u.toast(res.message);
					// 		}
					// 	})
					// 	// }

					// } 
					else { //新增
						this.itemInfo.isMicroEnt = this.itemInfo.isMicroEntStatus ? '1' : '0'
						delete this.itemInfo.id
						delete this.itemInfo.industry

						if (this.itemInfo.companyIntroduction) this.itemInfo.companyIntroduction =
							`<p>${this.itemInfo.companyIntroduction}</p>`
						if (this.itemInfo.mainProduction) this.itemInfo.mainProduction =
							`<p>${this.itemInfo.mainProduction}</p>`
						if (this.itemInfo.advantage) this.itemInfo.advantage = `<p>${this.itemInfo.advantage}</p>`
						if (this.itemInfo.disadvantage) this.itemInfo.disadvantage = `<p>${this.itemInfo.disadvantage}</p>`

						if(this.itemInfo.companyOrgType == null){
							delete this.itemInfo.companyOrgType
						}
						if(this.itemInfo.staffNumRange == null){
							delete this.itemInfo.staffNumRange
						}
						var itemInfoCp=this.itemInfo;
						for(var key in itemInfoCp){
							if(itemInfoCp[key] == ''){
							  delete itemInfoCp[key]
							}
						}
						supplierAdd(itemInfoCp, res => {
							if (res.code == 200 && res.success) {
								uni.showToast({
									title: "新增成功!"
								});
								this.empty();
								setTimeout(() => {
									uni.$emit('return', true);
									uni.navigateBack({
										url: "/pages/supplier/index"
									})
								}, 500)
							} else {
								uni.$u.toast(res.message);
							}
						})
					}
				}
			},
			empty(){
				this.itemInfo={
					chargeId: "",//负责人员
					memo: "",//费用描述
					name: "",//供应商名称
					uploadUrlId:"",//上传附件id（多个用“,”隔开）
					companyIntroduction:'',
					mainProduction:'',
					advantage:'',
					disadvantage:'',
					area:'',
					address: "",
					id: '',
					// industry: "",
					isMicroEnt: "",
					isMicroEntStatus: false,
					operatingState: "",
					staffNumRange: "",
					companyOrgType: "",
					supplierLevel: "",
					taxNumber: "",
					chargeUser: ''
				};
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
					// picker.setColumnValues(2, area[indexs[0]].children[indexs[1]].children)
					let arr = isEmpty(area[indexs[0]].children[indexs[1]].children) ? [] : area[indexs[0]].children[indexs[
						1]].children
					picker.setColumnValues(2, arr)

				}
				if (columnIndex === 1) {
					// picker.setColumnValues(2, area[indexs[0]].children[indexs[1]].children)
					let arr = isEmpty(area[indexs[0]].children[indexs[1]].children) ? [] : area[indexs[0]].children[indexs[
						1]].children
					picker.setColumnValues(2, arr)

				}
				//console.log(e)
			},
			confirmArea(e) {
				console.log(e.value)
				let item = e.value;
				// this.itemInfo.area = item[0].label + "/" + item[1].label + "/" + item[2].label //	所在地区
				// this.itemInfo.areaCode = item[0].value + "/" + item[1].value + "/" + item[2]
				// 	.value //	所在地区code	
				// this.areaName = item[0].label + "/" + item[1].label + "/" + item[2].label //	所在地区

				this.itemInfo.area = item[0].label +
					(isEmpty(item[1]) ? '' : "/" + item[1].label) +
					(isEmpty(item[2]) ? '' : "/" + item[2].label) //	所在地区
				this.itemInfo.areaCode = item[0].value +
					(isEmpty(item[1]) ? '' : "/" + item[1].value) +
					(isEmpty(item[2]) ? '' : "/" + item[2].value) //	所在地区code	
				this.areaName = this.itemInfo.area //	所在地区
				this.showArea = false;
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
	}

	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

		/deep/.u-loading-icon--vertical .u-loading-icon__text {
			color: #fff !important;
		}
	}

	.u-loading-icon {
		margin-top: 30px;
	}

	.container-view {
		padding: 0 16px;

		/deep/.form-item-cell .u-form-item__body__right__content__slot {
			flex-direction: column;
			align-items: normal;
		}

		/deep/.u-cell {
			.u-line {
				border: none !important;
			}

			.u-cell__body {
				padding: 0;
			}

			.u-cell__value {
				color: rgba(0, 0, 0, 0.4);
			}
		}

	}

	.line {
		width: 100%;
		height: 1px;
		background: #F0F4F9;
		margin-bottom: 13px;
	}

	.product {
		margin: 13px 0 !important;
	}

	.productNameBox {
		display: flex;
		justify-content: flex-start;
		height: 36px;
		margin-bottom: 13px;
		padding-top: 13px;
		box-sizing: border-box;
	}

	.productNameTitle {
		height: 23px;
		lighting-color: 23px;
	}

	.anniu {
		width: 100%;
		height: 20px;
		font-size: 14px;
		font-weight: 500;
		color: #0072FF;
		line-height: 20px;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
		margin-bottom: 85px;
	}

	.searchTipsBox {
		width: 100%;
		padding: 0 16px;
		// background-color: #fcf9f5;
		position: fixed;
		top: 130px;
		left: 0;
		box-sizing: border-box;
		height: 200px;
		overflow-y: auto;
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

	.richTextContent {
		width: 100%;
	}
	.saveBtn{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: #FFFFFF;
		padding: 10px 16px 20px 16px !important;
	}
	.top-height .u-form-item:last-child /deep/ .u-line{
		border-bottom:none !important;
	}
</style>
