<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar :title="(id==''?'添加':'')+navbarTitle" bgColor="#fff" @leftClick="leftClick">
			<view class="u-nav-slot" slot="right" v-if="isUpdata">
				<image class="logo" src="/static/img/blueprint/blue_edit.png" @click="rightClick"></image>
			</view>
		</u-navbar>
		<view class="top-height" v-if="type==1">
			<u--form labelPosition="left" labelWidth="80">
				<u-form-item label="协助人" @click="clickUser(); hideKeyboard()">
					<u--input v-model="userName" border="none" placeholder="请选择" disabled
						disabledColor="#ffffff" clearable maxlength="30"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
			</u--form>
		</view>
		<view class="top-height">
			<u--textarea v-model="content" border="none" :placeholder="'请填写'+navbarTitle" count maxlength="300" height="180" :disabled="isUpdata" ></u--textarea>
		</view>
		<view style="padding: 40px 16px 16px;" v-if="!isUpdata">
			<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="save"></u-button>
		</view>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		addBlueprintPersonal,
		getBlueprintPersonalById,
		editBlueprintPersonal,
		addBlueprintContractor,
		getBlueprintContractorById,
		editBlueprintContractor,
		addBlueprintCompany,
		getBlueprintCompanyById,
		editBlueprintCompany,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				navbarTitle:"个人资源",
				content:"",
				userName:"",//协助人名称
				assistId:"",//协助人ID
				type:0,
				blueprintId:"",
				yearValue:"",
				isClick:false,
				id:"",
				isUpdata:false,
			}
		},
		onLoad(option){
			this.id= option.id || "";
			let type= parseInt(option.type) || 0;
			this.blueprintId = option.blueprintId || "";
			this.yearValue = option.yearValue || "";
			this.type=type;
			this.navbarTitle= this.type == 0? '个人资源' :(this.type == 1? '公司资源' :'厂商资源')
			if(this.type==1){
				uni.removeStorageSync('lstSelectUser');
			}
			if(!isEmpty(this.id)){
				this.isUpdata=true;
				this.getUpdata()
			}
		},
		onShow(){
			uni.$once('resultSelectUser', res => {
				let lstSelectUser = uni.getStorageSync('lstSelectUser') //1*60*60*24*7
				console.log('lstSelectUser', lstSelectUser)
				if (lstSelectUser) {
					let UserName = ''
					let chargeId = ''
					lstSelectUser.forEach(v => {
						//UserName = v.name;
						console.log('跟进人员', v.name)
						chargeId += (chargeId.length> 0 ? ',' : '') + v.id;
					})
					this.userName = "已选择"+lstSelectUser.length+"人"
					this.assistId = chargeId
				}
			})
		},
		methods: {
			leftClick(){
				uni.redirectTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/resourceAnalysis?blueprintId="+this.blueprintId+'&yearValue='+this.yearValue+"&type="+this.type
				})
			},
			rightClick(){
				this.isUpdata=false;
			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			clickUser(){
				uni.navigateTo({
					url: "/pages/filter-all/select-more?total=1000" + "&title=协助人"
				});
			},
			getUpdata(){
				let request;
				switch (this.type) {
					case 0://个人资源
						request = getBlueprintPersonalById;
						break;
					case 1:
						request = getBlueprintCompanyById;
						break;
					case 2:
						request = getBlueprintContractorById;
						break;
				}
				let params="?id="+this.id
				request(params,res=>{
					if (res.code == 200 && res.success) {
						this.blueprintId = res.result.blueId
						this.yearValue = res.result.year;
						this.content=res.result.content
						if(this.type==1){
							let arr= res.result.assistId.split(',');
							this.userName = "已选择"+arr.length+"人"
							this.assistId = res.result.assistId;
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
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//验证数据
			validateField() {
				if (isEmpty(this.content)) {
					uni.$u.toast("请填写"+this.navbarTitle);
					return false;
				}
				return true;
			},
			save(){
				if(this.validateField() && !this.isClick){
					this.isClick = true;
					let info={
						id:this.id,
						blueId:this.blueprintId,
						year:this.yearValue,
						content:this.content,
					}
					let request;
					if(!isEmpty(this.id)){//编辑
						switch (this.type) {
							case 0://个人资源
								request = editBlueprintPersonal;
								break;
							case 1:
								request = editBlueprintCompany;
								info.assistId=this.assistId;
								break;
							case 2:
								request = editBlueprintContractor;
								break;
						}						
					}else{ //新增
						switch (this.type) {
							case 0://个人资源
								request = addBlueprintPersonal;
								break;
							case 1:
								request = addBlueprintCompany;
								info.assistId=this.assistId;
								break;
							case 2:
								request = addBlueprintContractor;
								break;
						}
					}
					request(info,res=>{
						if (res.code == 200 && res.success) {
							uni.$u.toast(res.message);
							uni.$emit('returnResources', this.type);
							setTimeout(() => {
								uni.redirectTo({
									url: "/pages/workbench/operationManagement/operationalBlueprint/resourceAnalysis?blueprintId="+this.blueprintId+'&yearValue='+this.yearValue+"&type="+this.type
								})
								// uni.navigateBack({
								// 	delta: 1
								// })
							}, 800)
						} else {
							uni.$u.toast(res.message);
							this.isClick = false;
						}
					})
					console.log(info)
					//()
				}
				
			},
		}
	}
</script>


<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}
	.logo{
		width: 24px;
		height: 24px;
	}
	/deep/.top-height{
		margin-top: 10px;
		.u-form-item__body {
			padding: 10px 16px;
			background: #fff;
			.uni-input-placeholder{
				text-align: right;
			}
			.u-input__content__field-wrapper__field {
				text-align: right !important;
			}
		}
		.u-textarea{
			padding: 13px 16px;
			
		}
		.u-textarea--disabled{
			background: #FFFFFF;
		}
	}

</style>
