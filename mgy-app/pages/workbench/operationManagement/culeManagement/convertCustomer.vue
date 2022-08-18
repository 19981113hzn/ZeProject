<template>
	<view>
		<u-navbar class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>
		<u--form :model="clueSource" ref="form1" labelPosition="left" labelWidth="80" :rules="rules">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }"
					scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true">
					
					<view class="top-height" v-if="!isCustomer">
						<u-form-item label="商机标题" prop="bizOpptyName" :required="true" ref="item1">
							<u--input v-model="bizOpptyName" border="none" placeholder="请填写" clearable
							 maxlength="30">
							</u--input>
						</u-form-item>
					</view>
					
					<view class="top-height">
						<u-form-item prop="clueSource.customer" labelWidth="200">
							<view class="customer-name">
								<u--input v-model="clueSource.customer" border="none" placeholder="输入客户名称"
									clearable maxlength="30" @input="searchChange" @blur="blurEven" @focus="focusEven">
								</u--input>
							</view>
							<view class="top-user-gx" @click="getverifyDate">
								<image class="user-gx" src="/static/img/clue/clue_chac.png"></image>
								<text class="user-gx-name">查重</text>
							</view>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="所属行业" prop="industryName" ref="item1" borderBottom
							@click="clickExpense('industry'); hideKeyboard()">
							<u--input v-model="industryName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="客户类型" prop="customer_typeName" ref="item1" borderBottom
							@click="clickExpense('customer_type'); hideKeyboard()">
							<u--input v-model="customer_typeName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="客户状态" prop="customerStatusName" 
							@click="clickExpense('customer_status'); hideKeyboard()">
							<u--input v-model="customerStatusName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="归属人员" prop="sysUserName" :required="true" ref="item1" borderBottom
							@click="clickExpense('chargeUser'); hideKeyboard()">
							<view class="top-user">
								<image class="user-head" src="/static/img/workbench/icon_user_head.png"></image>
								<text class="user-name">{{sysUserName}}</text>
							</view>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="首联系人" prop="clueSource.contact" :required="true" borderBottom>
							<u--input v-model="clueSource.contact" border="none" placeholder="请填写"
								clearable>
							</u--input>
						</u-form-item>
						<u-form-item label="手机号码" prop="phone" :required="true">
							<u--input v-model="clueSource.phone" border="none" placeholder="请填写" clearable
							 maxlength="11" type="number">
							</u--input>
						</u-form-item>
					</view>
					
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
		<u-picker :show="showPicker" :columns="lstExpense_type" keyName="label" closeOnClickOverlay
			:defaultIndex="defaultIndex" @close="showPicker=false" @cancel="showPicker=false"
			@confirm="confirmExpense_type"></u-picker>
		<view class="searchTipsBox" :style="{ 'top': companyHeight + 'px'}" v-if="shearchTipsShow">
			<view class="searchTipsList" v-for="item in companyList" :key="item.taxNumber" @click="getInfo(item)">
				<view class="companyName">{{item.name}}</view>
				<view class="companyName_mate ">公司名称匹配</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getEnterpriseFuzzySearch,
		verifySysCustomer,
		convertCustomer,
		convertBizOppty,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				navTitle:"转为客户",
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				companyHeight:58+getApp().globalData.statusBarHeight+44,//企查查的高度
				scrollTop: 0,
				clueSource:{
					id:"",//线索id
					customer:"",//客户名称
					industry:"",//所属行业
					customerStatus:"",//客户状态
					customerType:"",//客户类型
					phone:"",//手机号码
					contact:"",//首联系人
					responsiblePerson:"",//归属人员
				},
				bizOpptyName:"",
				showPicker: false,
				lstExpense_type: [],
				defaultIndex: [],
				selectType: '', //选择项的类型
				industry: [], //所属行业
				industryName: "", //所属行业名称
				customer_type:[],//客户类型
				customer_typeName:"",//客户类型名称
				customer_status: [], //客户状态
				customerStatusName: "", //客户状态名称
				sysUserName:"",//归属人员名称
				isSelected: false,
				shearchTipsShow: false, //显示
				companyList: [],
				companyListSeached: [],
				isClick:false,
				rules: {
					'phone': [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],
				},
				isCustomer:false
			}
		},
		onLoad(option){
			this.isCustomer=JSON.parse(option.isCustomer) || false
			
			let item = JSON.parse(option.params)
			this.clueSource.id = item.id
			this.clueSource.customer = item.customerName
			this.clueSource.contact = item.contact
			this.clueSource.phone = item.phone				
			if(item.chargeId){
				this.sysUserName = item.chargeName //归属人员名称
				this.clueSource.responsiblePerson = item.chargeId
			}else{
				this.userInfo = this.$cache.get('_userInfo')
				this.sysUserName = this.userInfo.realname //归属人员名称
				this.clueSource.responsiblePerson = this.userInfo.id					
			}
			uni.removeStorageSync("lstSelectUser")
			
			this.industry.push(getApp().globalData.industry) //所属行业
			this.customer_type.push(getApp().globalData.customer_type) //客户类型
			this.customer_status.push(getApp().globalData.customer_status) //客户状态
			
			if(!this.isCustomer){
				this.navTitle="转为商机"
				this.companyHeight = this.companyHeight+58 
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
					this.clueSource.responsiblePerson = chargeId
				}
				
			})
		},
		methods: {
			leftClick(){
				uni.navigateBack();
			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			clickExpense(type) {
				this.selectType = type
				switch (type) {
					case 'industry': //所属行业
						this.lstExpense_type = this.industry;
						this.showPicker = true;
						break;
					
					case 'customer_type': //客户类型
						this.lstExpense_type = this.customer_type;
						this.showPicker = true;
						break;
						
					case 'customer_status': //客户状态
						this.lstExpense_type = this.customer_status;
						this.showPicker = true;
						break;		
						
					case 'chargeUser':
						uni.navigateTo({
							url: "/pages/filter-all/select-more?total=1000" + "&title=归属人员" + '&isMutiple=true'
						});
						break;	
						
				}
			},
			// 确认按钮
			confirmExpense_type(e) {
				let type = this.selectType
				switch (type) {
					case 'industry': //所属行业
						this.clueSource.industry = e.value[0].value + '';
						this.industryName = e.value[0].label;
						break;
					
					case 'customer_type': //客户类型
						this.clueSource.customerType = e.value[0].value + '';
						this.customer_typeName = e.value[0].label;
						break;
						
					case 'customer_status': //客户状态
						this.clueSource.customerStatus = e.value[0].value + '';
						this.customerStatusName = e.value[0].label;
						break;
			
				}
			
				this.showPicker = false;
			},
			//查重
			getverifyDate(){
				if(this.clueSource.customer){
					verifySysCustomer("?name="+this.clueSource.customer,res=>{
						if(res.code==200 && res.success){
							uni.$u.toast('未查询到相同名称客户');
						}else{
							uni.$u.toast(res.message);
						}
					})
				}else{
					uni.$u.toast("请填写客户名称");
				}
				
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
				if (this.clueSource.customer) {
					this.companyList = []
					let data = "?keyword=" + this.clueSource.customer; //企业名称
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
				this.clueSource.customer = item.name;
				//this.getverifyDate();//查重
			},
			//验证数据
			validateField(){
				if(!this.isCustomer){
					if (isEmpty(this.bizOpptyName)) {
						uni.$u.toast("请填写商机标题");
						return false;
					}
				}
				if (isEmpty(this.clueSource.customer)) {
					uni.$u.toast("请填写客户名称");
					return false;
				}
				if (isEmpty(this.sysUserName)) {
					uni.$u.toast("归属人员不能为空");
					return false;
				}
				if (isEmpty(this.clueSource.contact )) {
					uni.$u.toast("首联系人不能为空");
					return false;
				}
				if (isEmpty(this.clueSource.phone)) {
					uni.$u.toast("手机号码不能为空");
					return false;
				}
				if (!uni.$u.test.mobile(this.clueSource.phone)) {
					uni.$u.toast('手机号码不正确');
					return false;
				}
				return true;
			},
			save(){
				if(this.validateField() && !this.isClick){
					this.isClick = true;
					console.log(this.clueSource)
					if(this.isCustomer){ //转为客户
						convertCustomer(this.clueSource,res=>{
							this.callbackFn(res)
						})
					}else{//转为商机
						this.clueSource.bizOppty=this.bizOpptyName
						convertBizOppty(this.clueSource,res=>{
							this.callbackFn(res)
						})
					}
				}
			},
			callbackFn(res){
				if (res.code == 200 && res.success) {
					uni.$u.toast(res.message);
					uni.$emit('returnClue', true);
					setTimeout(() => {
						uni.navigateBack();
					}, 800)
					
				} else {
					uni.$u.toast(res.message);
					this.isClick = false;
				}
			}
		
		
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
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
	
		.top-height {
			margin-top: 10px;
			background: #fff;
			.u-form-item {
				padding: 0 16px;
			}
				
			.u-form-item__body__left__content__required {
				right: 6px;
				float: right;
				left: unset;
			}
			.u-form-item__body__right__message {
				display: block;
				text-align: right;
			}
			.uni-input-placeholder {
				text-align: right;
			}
			.customer-name{
				width: 80%;
				.uni-input-placeholder {
					text-align: left;
				}
				.u-input__content__field-wrapper__field {
					text-align: left !important;
				}
			}
			.u-input__content__field-wrapper__field {
				text-align: right !important;
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
			
		}
		.searchTipsBox {
			width: 100%;
			padding: 0 16px;
			// background-color: #f5f1ed;
			position: fixed;
			top: 100px;
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
	}
</style>
