<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>
		<u--form :model="promotionPlan" ref="form1" labelPosition="left" labelWidth="80">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }"
					scroll-y="true" scroll-with-animation="true">
					<view class="top-height">
						<u-form-item label="计划类型" :required="true" prop="plan_typeName" borderBottom ref="item1"
							@click="clicKShowPicker(); hideKeyboard()">
							<u--input v-model="plan_typeName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="关联计划"  borderBottom ref="item1"
							@click="clickAssociatedPlan();hideKeyboard()">
							<u--input v-model="associatedPlanName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="计划时间" :required="true" prop="planTimeName"
							@click="clickShowPlanTime(); hideKeyboard()">
							<u--input v-model="planTimeName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					<view class="top-height">
						<u-form-item label="事件描述" prop="description" ref="item1"></u-form-item>
						<u--textarea v-model="promotionPlan.description" border="none" placeholder="请输入事件描述"
							maxlength="300">
						</u--textarea>
					</view>
					<view class="top-height">
						<u-form-item label="参与人员" @click="clickUser(); hideKeyboard()">
							<u--input v-model="userName" border="none" placeholder="请选择" disabled
								disabledColor="#ffffff" clearable maxlength="30"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
					
				</scroll-view>
			</view>
			<view class="foot-height">
				<view v-if="id==''" style="padding:16px">
					<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="confirmSave"></u-button>
				</view>
				<view v-else class="updata-delete">
					<u-button class="new-file" shape="circle" text="删除此目标" @click="clickDelete"></u-button>
					<u-button class="move-here" shape="circle" text="保存" @click="confirmSave"></u-button>
				</view>
			</view>
		</u--form>
		<u-datetime-picker :show="showDatePicker" v-model="datetime" mode="date" :minDate="minDate"
			:maxDate="maxDate" closeOnClickOverlay @close="showDatePicker=false" @cancel="showDatePicker=false"
			@confirm="confirmDatePicker" :formatter="formatter"></u-datetime-picker>
			
		<u-picker :show="showPlanTime" @close="showPlanTime=false" keyName="label" title="计划时间"
		 @cancel="showPlanTime=false" ref="uPicker"
			:columns="PlanTimeLst" @confirm="confirmPlanTimeLst" @change="changeHandler"></u-picker>
			
		<u-picker :show="showPicker" :columns="plan_type" keyName="label" closeOnClickOverlay
		 @close="showPicker=false" @cancel="showPicker=false"
			@confirm="confirmExpense_type"></u-picker>
		<u-modal :content="modalContent" :show="showModal" :title="modalTitle" showCancelButton closeOnClickOverlay
			@confirm="confirmModal" @cancel="showModal=false" @close="showModal=false"></u-modal>
	</view>
</template>

<script>
	import {
		js_date_time
	} from "@/util/js_DateTime.js"
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		addpromotionPlan,
		getpromotionPlanById,
		editpromotionPlan,
		deletepromotionPlanById,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				scrollTop: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				navTitle: "推进计划",
				modalContent: "",
				modalTitle: "",
				showModal: false,
				id:"",
				yearValue:"",
				promotionPlan:{
					bluePrintId:"",//蓝图id
					planTime:"",//计划时间
					type:"",//计划类型
					pid:"",//关联计划id
					description:"",
					userIdList:[],//参与人员id列表
				},
				userName:"",
				plan_type:[],//计划类型
				plan_typeName:"",
				showPicker:false,
				showPlanTime:false,
				PlanTimeLst:[],
				planTimeName:"",
				showDatePicker: false,
				minDate: "",
				maxDate: "",
				datetime: js_date_time(new Date()),
				isClick:false,
				associatedPlanName:"",
				type:"",
			}
		},
		onLoad(option){
			this.id= option.id || "";
			this.promotionPlan.bluePrintId = option.blueprintId || "";
			this.yearValue = option.yearValue || "";
			this.type=option.type || "";
			this.plan_type.push(getApp().globalData.plan_type) //计划类型
			
			let date = new Date()
			this.minDate = Date.parse(new Date(Number(this.yearValue), 0, 1));
			this.maxDate = Date.parse(new Date(Number(this.yearValue), 12, 0));
			
			uni.removeStorageSync('lstSelectUser');
			if(!isEmpty(this.id)){
				this.getUpdata();
			}
			if(!isEmpty(this.type)){
				this.getNewdata();
			}
		},
		onShow(){
			let that=this
			uni.$once('resultSelectUser', res => {
				let lstSelectUser = uni.getStorageSync('lstSelectUser') //1*60*60*24*7
				console.log('lstSelectUser', lstSelectUser)
				if (lstSelectUser) {
					let UserName = ''
					let chargeId = []
					lstSelectUser.forEach(v => {
						//UserName = v.name;
						console.log('跟进人员', v.name)
						chargeId.push( v.id);
					})
					this.userName = "已选择"+lstSelectUser.length+"人"
					this.promotionPlan.userIdList = chargeId
				}
			})
			
			uni.$once('returnAssociatedPlan', res => {
				console.log(res)
				that.associatedPlanName = res.Name; 
				that.promotionPlan.pid = res.Id;
				that.promotionPlan.planTime="";
				that.planTimeName="";
			})
		},
		methods: {
			leftClick(){
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
			//计划类型 确认按钮
			confirmExpense_type(e){
				this.promotionPlan.type = e.value[0].value + '';
				this.plan_typeName = e.value[0].label;
				this.showPicker=false;
				this.getPlanTimeLst();
			},
			clicKShowPicker(){
				if(isEmpty(this.type)){
					this.showPicker=true;
				}
			},
			clickShowPlanTime(){
				if(!isEmpty(this.promotionPlan.type)){
					this.getPlanTimeLst();
					if(this.promotionPlan.type==4){
						this.showDatePicker=true;
					}else{
						this.showPlanTime = true;
					}
				}else{
					uni.$u.toast("请先选择计划类型");
					return false;
				}
				
			},
			getPlanTimeLst(){
				let arrYear=[];
				arrYear.push(this.yearValue+"年")
				this.PlanTimeLst=[];
				this.planTimeName="";
				if(this.promotionPlan.type==0){//年度计划
					this.PlanTimeLst.push(arrYear);
					this.promotionPlan.planTime=this.PlanTimeLst[0][0].slice(0, 4);
					this.planTimeName=this.PlanTimeLst[0][0].slice(0, 4);
				}
				if(this.promotionPlan.type==1){//季度计划
					let arr=[
						{
							value:"第1季度",
							label:"第1季度"
						},
						{
							value:"第2季度",
							label:"第2季度"
						},
						{
							value:"第3季度",
							label:"第3季度"
						},
						{
							value:"第4季度",
							label:"第4季度"
						},
					]
					this.PlanTimeLst.push(arrYear);
					this.PlanTimeLst.push(arr);
					
				}
				if(this.promotionPlan.type==2){//月度计划
					let name=this.associatedPlanName.slice(this.associatedPlanName.length-4,this.associatedPlanName.length)
					console.log(name)
					let arr=[];
					if(name=="第1季度"){
						for(let i=1;i<4;i++){
							let month =(i<10 ? "0"+i:i)+"月";
							arr.push({
								value:month,
								label:month
							})
						}
					}
					else if(name=="第2季度"){
						for(let i=4;i<7;i++){
							let month =(i<10 ? "0"+i:i)+"月";
							arr.push({
								value:month,
								label:month
							})
						}
					}
					else if(name=="第3季度"){
						for(let i=7;i<10;i++){
							let month =(i<10 ? "0"+i:i)+"月";
							arr.push({
								value:month,
								label:month
							})
						}
					}
					else if(name=="第4季度"){
						for(let i=10;i<13;i++){
							let month =(i<10 ? "0"+i:i)+"月";
							arr.push({
								value:month,
								label:month
							})
						}
					}else{
						for(let i=1;i<13;i++){
							let month =(i<10 ? "0"+i:i)+"月";
							arr.push({
								value:month,
								label:month
							})
						}
					}
					this.PlanTimeLst.push(arrYear);
					this.PlanTimeLst.push(arr);
				}
				if(this.promotionPlan.type==3){//周计划
					uni.$u.toast("周计划未开发");
					return false;
				}
				if(this.promotionPlan.type==4){//日计划
					let num=Number(this.associatedPlanName.slice(this.associatedPlanName.length-2,this.associatedPlanName.length))
					console.log(this.associatedPlanName.slice(this.associatedPlanName.length-2,this.associatedPlanName.length))
					let date = new Date()
					if(num>0){
						console.log(Number(num-1))
						this.datetime=js_date_time(new Date(Number(this.yearValue), Number(num-1), 1))
						this.minDate = Date.parse(new Date(Number(this.yearValue), Number(num-1), 1));
						this.maxDate = Date.parse(new Date(Number(this.yearValue), Number(num), 0));
					}else{
						this.minDate = Date.parse(new Date(Number(this.yearValue), 0, 1));
						this.maxDate = Date.parse(new Date(Number(this.yearValue), 12, 0));
					}
				}
				
			},
			//确认
			confirmPlanTimeLst(e) {
				console.log(e.value)
				let item = e.value;
				if(this.promotionPlan.type==0){ //年度计划
					this.promotionPlan.planTime=item[0].slice(0, 4);
					this.planTimeName=item[0].slice(0, 4);
				}
				if(this.promotionPlan.type==1){//季度计划
					this.promotionPlan.planTime=item[0].slice(0, 4) +" "+ item[1].label;
					 this.planTimeName=item[0].slice(0, 4) +" " +item[1].label;
				}
				if(this.promotionPlan.type==2){//月度计划
					this.promotionPlan.planTime=item[0].slice(0, 4) +"-"+ item[1].label.slice(0, 2);
					 this.planTimeName=item[0].slice(0, 4) +"-"+ item[1].label.slice(0, 2);
				}
				this.showPlanTime = false;
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
			confirmDatePicker(e){
				const timeFormat = uni.$u.timeFormat;
				this.promotionPlan.planTime = timeFormat(e.value, 'yyyy-mm-dd');
				this.planTimeName=timeFormat(e.value, 'yyyy-mm-dd');
				this.showDatePicker = false;
			},
			clickUser(){
				uni.navigateTo({
					url: "/pages/filter-all/select-more?total=1000" + "&title=参与人员"
				});
			},
			clickAssociatedPlan(){
				if(isEmpty(this.type)){
					if(!isEmpty(this.promotionPlan.type)){
						if(this.promotionPlan.type!=0){
							uni.navigateTo({
								url: "/pages/workbench/operationManagement/operationalBlueprint/associatedPlan?bluePrintId="+ this.promotionPlan.bluePrintId + "&type="+this.promotionPlan.type +"&yearValue="+ this.yearValue + "&id="+this.promotionPlan.pid
							});
						}else{
							uni.$u.toast("计划类型为年度计划，不能关联计划");
							return false;
						}
						
					}else{
						uni.$u.toast("请先选择计划类型");
						return false;
					}
				}
			},
			getUpdata(){
				let selectInfo = uni.getStorageSync('selectEdit')
				this.promotionPlan.id=selectInfo.id;
				
				this.plan_type[0].forEach(v => { //商机来源
					if (v.value == selectInfo.type) {
						this.promotionPlan.type = v.value;
						this.plan_typeName = v.label;
					}
				})
				if(!isEmpty(selectInfo.pid)){
					this.getName(selectInfo.pid,res=>{
						this.associatedPlanName = res.planTime; 
						this.promotionPlan.pid = res.id;
						
					})
				}
				
				this.promotionPlan.description=selectInfo.description;
				this.promotionPlan.planTime=selectInfo.planTime;
				this.planTimeName=selectInfo.planTime;
				
				if(!isEmpty(selectInfo.participantIds)){
					let arr= selectInfo.participantIds.split(',');
					this.userName = "已选择"+arr.length+"人"
					this.promotionPlan.userIdList = arr;
					let lst=[];
					for (let k in arr) {                                                      
						lst.push({
							value:arr[k],
							id:arr[k],
							isSelected:true
							})
						// State.selectedKeys.push(data.children[j].id+','+arr[k])
					}
					if(lst.length>0){
						uni.setStorageSync('lstSelectUser', lst)
					}
				}
			},
			getName(id,func){
				getpromotionPlanById("?id="+id,res=>{
					if(res.code==200 && res.success){
						func(res.result)
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			getNewdata(){
				console.log(this.type)
				let selectInfo = uni.getStorageSync('selectEdit')
				if(selectInfo.type==2){
					selectInfo.type=Number(selectInfo.type)+2
				}else{
					selectInfo.type=Number(selectInfo.type)+1
				}
				this.plan_type[0].forEach(v => { //商机来源
					
					if (v.value == selectInfo.type) {
						this.promotionPlan.type = v.value;
						this.plan_typeName = v.label;
					}
				})
				if(!isEmpty(selectInfo.id)){
					this.getName(selectInfo.id,res=>{
						this.associatedPlanName = res.planTime; 
						this.promotionPlan.pid = res.id;
					})
				}
			},
			
			//验证数据
			validateField() {
				if (isEmpty(this.promotionPlan.type)) {
					uni.$u.toast("请选择计划类型");
					return false;
				}
				if (isEmpty(this.promotionPlan.planTime)) {
					uni.$u.toast("请选择计划时间");
					return false;
				}
				// if (isEmpty(this.promotionPlan.description)) {
				// 	uni.$u.toast("请输入事件描述");
				// 	return false;
				// }
				
				return true;
			},
			
			confirmSave(){
				if(this.validateField() && !this.isClick){
					this.isClick = true;
					let request;
					if(!isEmpty(this.promotionPlan.id)){
						request=editpromotionPlan
					}else{
						request=addpromotionPlan
					}
					console.log(this.promotionPlan)
					request(this.promotionPlan,res=>{
						if (res.code == 200 && res.success) {
							uni.$u.toast(res.message);
							uni.$emit('returnPromotionPlan',true);
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 800)
						} else {
							uni.$u.toast(res.message);
							this.isClick = false;
						}
					})
				}
			},
			clickDelete(){
				let data = "?id="+this.promotionPlan.id
				deletepromotionPlanById(data,res=>{
					if (res.code == 200 && res.success) {
						uni.showToast({
							title: res.message
						});
						uni.$emit('returnPromotionPlan', true);
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
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
					top: 16px;
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
