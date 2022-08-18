<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>

		<u--form :model="sysBlueprintTargets" ref="form1" labelPosition="left" labelWidth="80">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'106px' }"
					scroll-y="true" scroll-with-animation="true">

					<view class="top-height">
						<u-form-item label="目标区域" :required="true" prop="areaName" borderBottom ref="item1"
							@click="clickArea(); hideKeyboard()">
							<u--input v-model="areaName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="目标行业" :required="true" prop="industryName" ref="item1" borderBottom
							@click="clickExpense('industry'); hideKeyboard()">
							<u--input v-model="industryName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="目标单位" prop="amount_unitName"
							@click="clickExpense('amount_unit'); hideKeyboard()">
							<u--input v-model="amount_unitName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="年度目标" prop="projectName" ref="item1" borderBottom labelWidth="150"
							@click="createNextFollowUpTask(1,''); hideKeyboard()">
							<u--input border="none" disabled disabledColor="#ffffff" clearable maxlength="30">
							</u--input>
							<!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
							<u--image v-if="isCreateNext" src="/static/img/blueprint/icon-up.png" width="24px"
								height="24px"></u--image>
							<u--image v-if="!isCreateNext" src="/static/img/blueprint/icon-right.png" width="24px"
								height="24px"></u--image>
						</u-form-item>
						<view v-if="isCreateNext">
							<view v-for="(item, index) in lstQuarter" :key="index">
								<u-form-item :label="item.quarterName" prop="projectName"
									@click="createNextFollowUpTask(2,index); hideKeyboard()">
									<u--input border="none" disabled disabledColor="#ffffff" clearable maxlength="30">
									</u--input>
									<!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
									<u--image v-if="item.isQuarter" src="/static/img/blueprint/icon-up.png" width="24px"
										height="24px"></u--image>
									<u--image v-if="!item.isQuarter" src="/static/img/blueprint/icon-right.png"
										width="24px" height="24px"></u--image>
								</u-form-item>
								<view v-if="item.isQuarter">
									<view v-for="(item1, index1) in item.lstMonth" :key="index1">
										<u-form-item :label="item1.monthValue+'月'" prop="projectName">
											<view class="input-left">
												<u--input v-model="item1.amount" @blur="changeAmount(index,index1)"
													type='number' border="bottom" placeholder="请填写" clearable
													maxlength="20"></u--input>
											</view>

											<text>{{amount_unitName}}</text>
											<u--input v-model="item1.customerName" border="none" placeholder="请添加客户"
												disabled disabledColor="#ffffff" clearable maxlength="30"></u--input>
											<u-icon @click="gotorelatedCustomers(index,index1); hideKeyboard()"
												slot="right" name="arrow-right"></u-icon>
										</u-form-item>
									</view>
									<u-form-item label="总金额" prop="projectName" borderBottom>
										<view class="input-left changePadding">
											<u--input v-model="item.totalAmount" border="none" placeholder="请填写"
												clearable maxlength="20" disabled disabledColor="#ffffff"></u--input>
										</view>
										<text>{{amount_unitName}}</text>
										<view class="txt">
											<text>目标客户</text><text
												class="txt-num">{{item.customerNum}}</text><text>个</text>
										</view>
									</u-form-item>
								</view>

							</view>

							<u-form-item v-if="lstQuarter.length<4" label="" prop="memo" ref="item1"
								@click="addQuarter">
								<view class="addContact">
									<image class="logo" src="/static/img/icon_add.png"></image>
									<text class="contact-people">添加下一季度</text>
								</view>
							</u-form-item>
						</view>
					</view>

					<view class="top-height" style="height: 0.1px;background: none;"></view>
				</scroll-view>
			</view>
			<view class="foot-height">
				<u-cell>
					<view slot="title" class="u-slot-title">
						<text class="u-cell-text">年度总金额</text>
						<text class="u-cell-text txt-num">{{amount}}</text>
						<text class="u-cell-text">{{amount_unitName}}</text>
					</view>
					<view slot="value" class="u-slot-value">
						<text class="u-cell-text">目标客户</text>
						<text class="u-cell-text txt-num">{{customerNum}}</text>
						<text class="u-cell-text">个</text>
					</view>
				</u-cell>
				<view v-if="sysBlueprintTargets.id==''" style="padding:5px 16px 16px">
					<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="confirmSave"></u-button>
				</view>
				<view v-else class="updata-delete">
					<u-button class="new-file" shape="circle" text="删除此目标" @click="clickDelete"></u-button>
					<u-button class="move-here" shape="circle" text="保存" @click="confirmSave"></u-button>
				</view>
			</view>
		</u--form>
		<u-picker :show="showPicker" :columns="lstExpense_type" keyName="label" closeOnClickOverlay
			:defaultIndex="defaultIndex" @close="showPicker=false" @cancel="showPicker=false"
			@confirm="confirmExpense_type"></u-picker>
		<u-picker :show="showArea" @close="showArea=false" keyName="label" @cancel="showArea=false" ref="uPicker"
			:columns="areaLst" @confirm="confirmArea" @change="changeHandler"></u-picker>
		<u-modal :content="modalContent" :show="showModal" :title="modalTitle" showCancelButton closeOnClickOverlay
			@confirm="confirmModal" @cancel="showModal=false" @close="showModal=false"></u-modal>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import area from "@/util/area.json"
	import {
		addBlueprintTargets,
		getBlueprintTargetsById,
		editBlueprintTargets,
		deleteBlueprintTargetsById
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				scrollTop: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				navTitle: "业绩目标",
				modalContent: "",
				modalTitle: "",
				showModal: false,
				sysBlueprintTargets: {
					area: "", //区域
					areaCode: "", //	区域编码
					industry: "", //目标行业,字典表industry
					blueprintId: "", //销售作战蓝图id
					unit: "", //
					monthlyList:[],
				},
				isCreateNext: true,
				amount: 0,
				customerNum: 0,
				lstQuarter: [],
				showArea: false,
				areaLst: [], //地区
				areaName: "",
				industry: [], //目标行业
				industryName: "",
				amount_unit: [], //目标单位
				amount_unitName: "",
				showPicker: false,
				lstExpense_type: [],
				defaultIndex: [],
				selectType: '', //选择项的类型
				oneIndex: "",
				twoIndex: "",
				isClick: false, //防止重复点击保存按钮
				returnPageNumber:1,
			}
		},
		onLoad(option) {
			this.sysBlueprintTargets.id=option.id || "";
			this.sysBlueprintTargets.blueprintId = option.blueprintId || "";
			this.sysBlueprintTargets.yearValue = option.yearValue || "";
			//所属地区
			this.areaLst.push(area)
			this.areaLst.push(area[0].children)
			this.areaLst.push(area[0].children[0].children)

			this.industry.push(getApp().globalData.industry) //目标行业
			this.amount_unit.push(getApp().globalData.amount_unit) //目标单位
			if (this.amount_unit[0].length > 0) {
				this.sysBlueprintTargets.unit = this.amount_unit[0][0].value + '';
				this.amount_unitName = this.amount_unit[0][0].label;
			}
			if(!isEmpty(this.sysBlueprintTargets.id)){//修改
				this.getUpdata()
			}else{//新增
				this.lstQuarter=[];
				this.lstQuarter.push({
					quarterName: "第一季度",
					isQuarter: true,
					totalAmount: 0,
					customerNum: 0,
					lstMonth: [{
						amount: "",
						customerIds: [],
						customerName: "",
						id: "",
						monthValue: 1,
						targetsId: "",
						unit: ""
					}, {
						amount: "",
						customerIds: [],
						customerName: "",
						id: "",
						monthValue: 2,
						targetsId: "",
						unit: ""
					}, {
						amount: "",
						customerIds: [],
						customerName: "",
						id: "",
						monthValue: 3,
						targetsId: "",
						unit: ""
					}, ]
				})
			}
		},
		onShow() {
			uni.$once('resultCustomer', res => {
				console.log('resultCustomer=>  ' + res)
				this.lstQuarter[this.oneIndex].lstMonth[this.twoIndex].customerIds = res
				this.lstQuarter[this.oneIndex].lstMonth[this.twoIndex].customerName = "已添加" + res.length + "个客户"
				let sum = 0;
				let item = this.lstQuarter[this.oneIndex].lstMonth;
				for (let i = 0; i < item.length; i++) {
					sum += item[i].customerIds.length
				}
				this.lstQuarter[this.oneIndex].customerNum = sum;
				let num = 0;
				for (let j = 0; j < this.lstQuarter.length; j++) {
					num += this.lstQuarter[j].customerNum
				}
				this.customerNum = num;
			})
		},
		methods: {
			getUpdata(){
				getBlueprintTargetsById("?id="+this.sysBlueprintTargets.id, res =>{
					if (res.code == 200 && res.success) {
						let result = res.result;
						this.sysBlueprintTargets.blueprintId=result.blueprintId;
						this.sysBlueprintTargets.area=result.area
						this.sysBlueprintTargets.areaCode=result.areaCode
						this.areaName=result.area.replace(/,/g, "/")
						this.industry[0].forEach(item => { //目标行业
							if (item.value == result.industry) {
								this.sysBlueprintTargets.industry = item.value;
								this.industryName = item.label;
							}
						})
						this.amount_unit[0].forEach(item => { //目标单位
							if (item.value == result.unit) {
								this.sysBlueprintTargets.unit = item.value + '';
								this.amount_unitName = item.label;
							}
						})
						this.lstQuarter=[];
						this.amount= 0;
						this.customerNum= 0;
						let totalAmount=0;
						let customerNum=0;
						let arrMonth=[];
						for(let i=0;i<result.monthlyList.length;i++){
							let item = result.monthlyList[i]
							this.amount += item.amount;
							this.customerNum += item.customerIds.length;
							
							totalAmount+=item.amount;
							customerNum+=item.customerIds.length;
							arrMonth.push({
										amount:item.amount,
										customerIds: item.customerIds,
										customerName: item.customerIds.length>0?("已添加" + item.customerIds.length + "个客户"):'',
										id: item.id,
										monthValue: item.monthValue,
										targetsId: item.targetsId,
										unit: item.unit
									})
							if(item.monthValue==3){
								
								let arr = {
									quarterName: "第一季度",
									isQuarter: true,
									totalAmount: totalAmount,
									customerNum: customerNum,
									lstMonth: arrMonth,
										
									}
								this.lstQuarter.push(arr);
								totalAmount=0;
								customerNum=0;
								arrMonth=[];
							}
							if(item.monthValue==6){
								let arr = {
									quarterName: "第二季度",
									isQuarter: true,
									totalAmount: totalAmount,
									customerNum: customerNum,
									lstMonth: arrMonth,
										
									}
								this.lstQuarter.push(arr);
								totalAmount=0;
								customerNum=0;
								arrMonth=[];
							}
							if(item.monthValue==9){
								let arr = {
									quarterName: "第三季度",
									isQuarter: true,
									totalAmount: totalAmount,
									customerNum: customerNum,
									lstMonth: arrMonth,
										
									}
								this.lstQuarter.push(arr);
								totalAmount=0;
								customerNum=0;
								arrMonth=[];
							}
							if(item.monthValue==12){
								let arr = {
									quarterName: "第四季度",
									isQuarter: true,
									totalAmount: totalAmount,
									customerNum: customerNum,
									lstMonth: arrMonth,
										
									}
								this.lstQuarter.push(arr);
								totalAmount=0;
								customerNum=0;
								arrMonth=[];
							}
							
						}
						console.log(this.lstQuarter)
						
					} else {
						uni.$u.toast(res.message);
					}
				})
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
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			//年度目标
			createNextFollowUpTask(type, index) {
				if (type == 1) {
					if (this.isCreateNext) {
						this.isCreateNext = false
					} else {
						this.isCreateNext = true
					}
				} else {
					if (this.lstQuarter[index].isQuarter) {
						this.lstQuarter[index].isQuarter = false
					} else {
						this.lstQuarter[index].isQuarter = true
					}
				}

			},
			//添加下一季度
			addQuarter() {
				let num = this.lstQuarter.length + 1;
				let arr = {
					quarterName: num == 2 ? "第二季度" : (num == 3 ? '第三季度' : '第四季度'),
					isQuarter: true,
					totalAmount: 0,
					customerNum: 0,
					lstMonth: [{
						amount: "",
						customerIds: [],
						customerName: "",
						id: "",
						monthValue: num == 2 ? 4 : (num == 3 ? 7 : 10),
						targetsId: "",
						unit: ""
					}, {
						amount: "",
						customerIds: [],
						customerName: "",
						id: "",
						monthValue: num == 2 ? 5 : (num == 3 ? 8 : 11),
						targetsId: "",
						unit: ""
					}, {
						amount: "",
						customerIds: [],
						customerName: "",
						id: "",
						monthValue: num == 2 ? 6 : (num == 3 ? 9 : 12),
						targetsId: "",
						unit: ""
					}, ]
				}
				this.lstQuarter.push(arr);
			},
			clickArea(){
				if(isEmpty(this.sysBlueprintTargets.id)){
					this.showArea=true;
				}
			},
			//更改选项
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
			//确认地址
			confirmArea(e) {
				console.log(e.value)
				let item = e.value;
				this.sysBlueprintTargets.area = item[0].label +
					(isEmpty(item[1]) ? '' : "," + item[1].label) +
					(isEmpty(item[2]) ? '' : "," + item[2].label) //	所在地区
				this.sysBlueprintTargets.areaCode = item[0].value +
					(isEmpty(item[1]) ? '' : "," + item[1].value) +
					(isEmpty(item[2]) ? '' : "," + item[2].value) //	所在地区code	
				this.areaName = item[0].label +
					(isEmpty(item[1]) ? '' : "/" + item[1].label) +
					(isEmpty(item[2]) ? '' : "/" + item[2].label) //	所在地区 //	所在地区
				this.showArea = false;
			},
			clickExpense(type) {
				this.selectType = type
				switch (type) {
					case 'industry': //目标行业
						this.lstExpense_type = this.industry;
						break;

					case 'amount_unit': //目标单位
						this.lstExpense_type = this.amount_unit;
						break;
				}
				if(isEmpty(this.sysBlueprintTargets.id)){
					this.showPicker = true;
				}
			},
			// 确认按钮
			confirmExpense_type(e) {
				let type = this.selectType
				switch (type) {
					case 'industry': //目标行业
						this.sysBlueprintTargets.industry = e.value[0].value + '';
						this.industryName = e.value[0].label;
						break;

					case 'amount_unit': //目标单位
						this.sysBlueprintTargets.unit = e.value[0].value + '';
						this.amount_unitName = e.value[0].label;
						break;
				}
				this.showPicker = false;
			},
			//选择客户
			gotorelatedCustomers(index, index1) {
				this.oneIndex = index;
				this.twoIndex = index1;
				let id = this.lstQuarter[index].lstMonth[index1].customerIds;
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/selectCustomer?id=" + id
				})
			},
			changeAmount(index, index1) {

				let item = this.lstQuarter[index].lstMonth
				let sum = 0;
				for (let i = 0; i < item.length; i++) {
					console.log(Number(item[i].amount))
				 sum += isEmpty(item[i].amount) ? 0 : Number(item[i].amount)
				}
				this.lstQuarter[index].totalAmount = sum;
				let num = 0;
				for (let j = 0; j < this.lstQuarter.length; j++) {
					num += this.lstQuarter[j].totalAmount
				}
				this.amount = num;
				console.log(this.lstQuarter)
			},


			//验证数据
			validateField() {
				if (isEmpty(this.sysBlueprintTargets.area)) {
					uni.$u.toast("请选择目标区域");
					return false;
				}
				if (isEmpty(this.sysBlueprintTargets.industry)) {
					uni.$u.toast("请选择目标行业");
					return false;
				}
				return true;
			},
			//保存按钮
			confirmSave() {
				if (this.validateField() && !this.isClick) {
					this.isClick = true;
					let monthlyList=[];
					for(let i = 0; i < this.lstQuarter.length; i++) {
						let item = this.lstQuarter[i].lstMonth;
						for (let j = 0; j < item.length; j++) {
							let month={
								amount:item[j].amount,
								customerIds:item[j].customerIds,
								monthValue:item[j].monthValue,
								unit:this.sysBlueprintTargets.unit,
								targetsId: item[j].targetsId,
								id:item[j].id
							}
							monthlyList.push(month)
						}
					}
					this.sysBlueprintTargets.monthlyList=monthlyList
					if(!isEmpty(this.sysBlueprintTargets.id)){//修改
						editBlueprintTargets(this.sysBlueprintTargets,res=>{
							if (res.code == 200 && res.success) {
								uni.$u.toast(res.message);
								uni.$emit('returnBlueprintDetail', true);
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
					}else{ //新增
						addBlueprintTargets(this.sysBlueprintTargets,res=>{
							if (res.code == 200 && res.success) {
								uni.$u.toast(res.message);
								uni.$emit('returnBlueprint', true);
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
					console.log(this.sysBlueprintTargets)
				}

			},
			clickDelete(){
				let data = "?id="+this.sysBlueprintTargets.id
				deleteBlueprintTargetsById(data,res=>{
					if (res.code == 200 && res.success) {
						uni.showToast({
							title: res.message
						});
						uni.$emit('returnBlueprint', true);
						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							})
						}, 800)
					
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
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

		.foot-height {
			position: absolute;
			bottom: 0px;
			width: 100%;
			height: 104px;
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

			.u-line {
				border: none !important;
			}

			.u-cell-text {
				color: #606266;
			}

			.txt-num {
				color: #0072FF;
				padding: 0 4px;
			}
			.updata-delete{
				.u-button {
					width: 45%;
					height: 42px;
					top: 5px;
				}
				.new-file {
					float: left;
					margin-left: 16px;
					background: rgba(241, 243, 246, 1);
					color: rgba(96, 98, 102, 1);
				
					.u-button__text {
						font-size: 16px !important;
					}
				}
				
				.move-here {
					float: right;
					margin-right: 16px;
					background: rgba(0, 114, 255, 1);
					color: #fff;
				
					.u-button__text {
						font-size: 16px !important;
					}
				}
			}
			
		}
	}

	/deep/.top-height {
		margin-top: 10px;
		background: #fff;

		// padding: 0 16px;
		.u-form-item {
			padding: 0 16px;
			color: #606266;
		}

		.u-form-item__body__left__content__required {
			right: 6px;
			float: right;
			left: unset;
		}

		.uni-input-placeholder {
			text-align: right;
		}

		.input-left {
			width: 79px;
			
			.u-input__content__field-wrapper__field {
				text-align: left !important;
			}

			.uni-input-placeholder {
				text-align: left;
			}
		}
		.changePadding{
			.uni-input-wrapper{
				padding: 0px 9px;
			}
		}
		.txt {
			position: absolute;
			right: 16px;

			.txt-num {
				color: #0072FF;
				padding: 0 4px;
			}
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


		.u-textarea__field {
			padding: 0 16px;
		}

	}
</style>
