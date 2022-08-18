<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="关联计划" bgColor="#fff" @leftClick="leftClick">
			<view class="u-nav-slot" slot="right">
				<!-- <image v-if="!isNone" class="logo-icon" src="/static/img/blueprint/blue_sx.png" 
				@click="clickScreen"></image> -->
				<image v-if="!isNone" class="logo" src="/static/img/icon_add.png" @click="gotoPromotionPlanAdd"></image>
			</view>
		</u-navbar>
		<view style="flex: auto; height:auto!important;">
			<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }" scroll-y="true"
				scroll-with-animation="true" @scrolltolower="scrollLoadMoreData" :scroll-top="scrollTop">
				<view v-if="!isNone">
					<u-radio-group v-model="radiovalue1" placement="column" @change="groupChange">
					<view class="card" v-for="(item, index) in lstPromotionPlan" :key="index">
						<view class="card-pa">
							<u-cell class="title" :title="item.typeName">
								<u-radio slot="value" :customStyle="{
									position: 'absolute',
									right: '32px'
								}" :key="index" label="" :name="item.id" size="20" iconSize="20"> </u-radio>
							</u-cell>
							<u-cell :title="item.planTime">
									<image v-if="!item.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @click="clickOpen(index)"></image>
									<image v-if="item.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @click="clickOpen(index)"></image>
									<!-- <image class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png"></image> -->
							</u-cell>
							<view v-if="item.isOpen">
								<u-cell class="content" v-if="!inspectEmpty(item.description) || !inspectEmpty(item.participantNames)">
									<view slot="title" v-if="!inspectEmpty(item.description)">
										<u--text :lines="1" :text="item.description"></u--text>
									</view>
									<view slot="label" v-if="!inspectEmpty(item.participantNames)">
										<u--text class="txt" :lines="1" :text="'参与人员：'+ item.participantNames"></u--text>
									</view>
								</u-cell>
								<view class="quarter" v-for="(item1, index1) in item.children" :key="index1">
									<u-cell :title="item1.planTime">
										<image v-if="!item1.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @click="clickTwoOpen(index,index1)"></image>
										<image  v-if="item1.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @click="clickTwoOpen(index,index1)"></image>
										<u-radio slot="value" :customStyle="{
											position: 'absolute',
											right: '32px'
										}" :key="index" label="" :name="item1.id" size="20" iconSize="20"> </u-radio>
										<!-- <image class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png" ></image> -->
									</u-cell>
									<view v-if="item1.isOpen">
										<u-cell class="content" v-if="!inspectEmpty(item1.description) || !inspectEmpty(item1.participantNames)">
											<view slot="title" v-if="!inspectEmpty(item1.description)">
												<u--text :lines="1" :text="item1.description"></u--text>
											</view>
											<view slot="label" v-if="!inspectEmpty(item1.participantNames)">
												<u--text class="txt" :lines="1" :text="'参与人员：'+ item1.participantNames"></u--text>
											</view>
										</u-cell>
										<view class="month" v-for="(item2, index2) in item1.children" :key="index2">
											<u-cell :title="item2.planTime">
												<image v-if="!item2.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @click="clickThreeOpen(index,index1,index2)"></image>
												<image  v-if="item2.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @click="clickThreeOpen(index,index1,index2)"></image>
												<u-radio slot="value" :customStyle="{
													position: 'absolute',
													right: '32px'
												}" :key="index" label="" :name="item2.id" size="20" iconSize="20"> </u-radio>
												<!-- <image class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png"></image> -->
											</u-cell>
											<view v-if="item2.isOpen">
												<u-cell class="content" v-if="!inspectEmpty(item2.description) || !inspectEmpty(item2.participantNames)">
													<view slot="title" v-if="!inspectEmpty(item2.description)">
														<u--text :lines="1" :text="item2.description"></u--text>
													</view>
													<view slot="label" v-if="!inspectEmpty(item2.participantNames)">
														<u--text class="txt" :lines="1" :text="'参与人员：'+ item2.participantNames"></u--text>
													</view>
												</u-cell>
												<view class="week" v-for="(item3, index3) in item2.children" :key="index3">
													<u-cell :title="item3.planTime">
														<image v-if="!item3.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @click="clickFourOpen(index,index1,index2,index3)"></image>
														<image  v-if="item3.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @click="clickFourOpen(index,index1,index2,index3)"></image>
														<u-radio slot="value" :customStyle="{
															position: 'absolute',
															right: '32px'
														}" :key="index" label="" :name="item3.id" size="20" iconSize="20"> </u-radio>
														<!-- <image class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png"></image> -->
													</u-cell>
													<view v-if="item3.isOpen">
														<u-cell class="content" v-if="!inspectEmpty(item3.description) || !inspectEmpty(item3.participantNames)">
															<view slot="title" v-if="!inspectEmpty(item3.description)">
																<u--text :lines="1" :text="item3.description"></u--text>
															</view>
															<view slot="label" v-if="!inspectEmpty(item3.participantNames)">
																<u--text class="txt" :lines="1" :text="'参与人员：'+ item3.participantNames"></u--text>
															</view>
														</u-cell>
														<view class="day"  v-for="(item4, index4) in item3.children" :key="index4">
															<u-cell :title="item4.planTime">
																<image v-if="!item4.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @click="clickFiveOpen(index,index1,index2,index3,index4)"></image>
																<image  v-if="item5.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @click="clickFiveOpen(index,index1,index2,index3,index4)"></image>
																<u-radio slot="value" :customStyle="{
																	position: 'absolute',
																	right: '32px'
																}" :key="index" label="" :name="item4.id" size="20" iconSize="20"> </u-radio>
																<!-- <image class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png"></image> -->
															</u-cell>
															<view  v-if="item4.isOpen">
																<u-cell class="content" v-if="!inspectEmpty(item4.description) || !inspectEmpty(item4.participantNames)">
																	<view slot="title" v-if="!inspectEmpty(item4.description)">
																		<u--text :lines="1" :text="item4.description"></u--text>
																	</view>
																	<view slot="label" v-if="!inspectEmpty(item4.participantNames)">
																		<u--text class="txt" :lines="1" :text="'参与人员：'+ item4.participantNames"></u--text>
																	</view>
																</u-cell>
															</view>
														</view>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							
							<!-- <view v-for="(item1, index1) in item.children">
								</view> -->
						</view>
					</view>
					</u-radio-group>
				</view>
				<view v-if="isNone">
					<u-empty text="暂无计划" width="84" height="84" icon="/static/img/blueprint/blue_empty.png">
						<u-button color="rgba(0, 114, 255, 1)" shape="circle" :style="{marginTop:19+'px'}" text="去添加"
							@click="gotoPromotionPlanAdd"> </u-button>
					</u-empty>
				</view>
			</scroll-view>
		</view>
		<view class="foot-height" v-if="!isNone">
			<view style="padding: 16px">
				<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="确定" @click="save">
				</u-button>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getDictItemsByCode,
		getpromotionPlanList,
		getpromotionPlanTree,
		getpromotionPlanById,
		
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				scrollTop: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				isNone: false,				
				blueprintId:"",
				yearValue:"",
				lstPromotionPlan:[],
				plan_type:[],
				radiovalue1:"",
			}
		},
		onLoad(option){
			this.radiovalue1 =option.id || ""
			this.blueprintId = option.bluePrintId || "";
			this.type=option.type || "";
			this.yearValue = option.yearValue || "";
			this.plan_type=getApp().globalData.plan_type //计划类型
			this.getData();
		},
		onShow() {
			uni.$once('returnPromotionPlan', res => {
				if (res) {
					this.getData();
				}
			})
		},
		methods: {
			leftClick(){
				uni.navigateBack();
			},
			getData(){
				let info="?bluePrintId="+this.blueprintId+"&type="+this.type
				getpromotionPlanTree(info,res=>{
					if (res.code == 200 && res.success) {
						console.log(res);
						let result = isEmpty(res.result) ? [] : res.result;
						//this.lstBlueprintTargets = isEmpty(res.result) ? [] : res.result;
						//this.lstPromotionPlan = result
						this.processingData(result,fun=>{
							this.lstPromotionPlan=(fun)
						}) 
						if(result.length==0){
							this.isNone=true;
						}
						console.log(this.lstPromotionPlan)
					} else {
						uni.$u.toast(res.message);
					}
					//this.isLoading = true;
				});
			},
			//查找状态值
			selectStatus(type) {
				let data = this.plan_type.find(item => item.value == type)
				return data.label;
			},
			processingData(result,func){
				let lst=[];
				for(let i=0;i<result.length;i++){
					let item=result[i]
					item.typeName=this.selectStatus(item.type)
					item.isOpen=false;
					let lst1=[]
					for(let j=0;j<item.children.length;j++){
						let item1=item.children[j]
						item1.typeName=this.selectStatus(item1.type)
						item1.isOpen=false;
						for(let e=0;e<item1.children.length;e++){
							let item2=item1.children[e]
							item2.typeName=this.selectStatus(item2.type)
							item2.isOpen=false;
							for(let d=0;d<item2.children.length;d++){
								let item3=item2.children[d]
								item3.typeName=this.selectStatus(item3.type)
								item3.isOpen=false;
								for(let c=0;c<item3.children.length;c++){
									let item4=item3.children[c]
									item4.typeName=this.selectStatus(item4.type)
									item4.isOpen=false;
									for(let b=0;b<item4.children.length;b++){
										let item5=item4.children[b]
										item5.typeName=this.selectStatus(item5.type)
										item5.isOpen=false;
										for(let a=0;a<item5.children.length;a++){
											let item6=item5.children[a]
											item6.typeName=this.selectStatus(item6.type)
											item6.isOpen=false;
											
											item5.children[a]=item6
										}
										item4.children[b]=item5
									}
									item3.children[c]=item4
								}
								item2.children[d]=item3
							}
							item1.children[e]=item2
						}
						item.children[j]=item1
					}
					lst.push(item)
				}
				func(lst)
			},
			//第一级打开与收起
			clickOpen(index){
				let bool=false;
				if(this.lstPromotionPlan[index].isOpen){
					bool=false;
				}else{
					bool=true;
				}
				this.$nextTick(()=>{
					this.lstPromotionPlan[index].isOpen=bool;
				})
			},
			//第二级打开与收起
			clickTwoOpen(index,index1){
				let bool=false;
				if(this.lstPromotionPlan[index].children[index1].isOpen){
					bool=false;
				}else{
					bool=true;
				}
				this.$nextTick(()=>{
					this.lstPromotionPlan[index].children[index1].isOpen=bool;
				})
			},
			//第三级打开与收起
			clickThreeOpen(index,index1,index2){
				let bool=false;
				if(this.lstPromotionPlan[index].children[index1].children[index2].isOpen){
					bool=false;
				}else{
					bool=true;
				}
				this.$nextTick(()=>{
					this.lstPromotionPlan[index].children[index1].children[index2].isOpen=bool;
				})
			},
			//第四级打开与收起
			clickFourOpen(index,index1,index2,index3){
				let bool=false;
				if(this.lstPromotionPlan[index].children[index1].children[index2].children[index3].isOpen){
					bool=false;
				}else{
					bool=true;
				}
				this.$nextTick(()=>{
					this.lstPromotionPlan[index].children[index1].children[index2].children[index3].isOpen=bool;
				})
			},
			//第五级打开与收起
			clickFiveOpen(index,index1,index2,index3,index4){
				let bool=false;
				if(this.lstPromotionPlan[index].children[index1].children[index2].children[index3].children[index4].isOpen){
					bool=false;
				}else{
					bool=true;
				}
				this.$nextTick(()=>{
					this.lstPromotionPlan[index].children[index1].children[index2].children[index3].children[index4].isOpen=bool;
				})
			},
			//添加
			gotoPromotionPlanAdd(){
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/promotionPlanAdd?blueprintId=" +
						this.blueprintId + '&yearValue=' + this.yearValue
				})
			},
			groupChange(e) {
				console.log(e);
				this.radiovalue1 = e
				
			},
			inspectEmpty(obj){
			    if(typeof obj=="undefined" || obj ==null || obj == ""){
			        return true;
			    }else{
			        return false;
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
			save() {
				if(!isEmpty(this.radiovalue1)){
					this.getName(this.radiovalue1,res=>{
						let data={
							Name:res.planTime,
							Id:this.radiovalue1
						}
						console.log(data)
						uni.$emit('returnAssociatedPlan', data);
						uni.navigateBack({
							delta: 1
						});
					})
					
				}else{
					uni.$u.toast("请先选择关联计划");
				}
				
				// uni.navigateTo({
				// 	url: `../../workbench/operationManagement/opportunityManagement/addOpportunity?customerName=${this.customerName}&customerId=${this.customerId}&customerIndex=${this.radiovalue1}`
				// })
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}
	
	.logo {
		width: 24px;
		height: 24px;
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
			//background: #fff;
			//border-top: 1px solid #f0f4f9;
		
			.uni-input-placeholder {
				text-align: right;
				color: rgba(0, 114, 255, 1) !important;
			}
		
			.u-input__content__field-wrapper__field {
				text-align: right !important;
				color: rgba(0, 114, 255, 1) !important;
			}
		
			.u-button__text {
				font-size: 16px !important;
			}
		}
		
		.u-empty {
			margin-top: 172px !important;
		
			.u-button--circle {
				width: 104px;
			}
		
			.u-button__text {
				font-size: 16px !important;
			}
		}
		
		.card{
			padding: 8px 16px 0 16px;
			
			.card-pa {
				padding: 0 16px 16px;
				background: #fff;
				border-radius: 5px;
				.title{
					.u-cell__title-text{
						color: #303133;
						font-size: 16px;
						font-weight: bold;
					}
				}
				.content{
					.u-text__value{
						padding: 0 0 0 16px;
						color: #606266 !important;
					}
					.txt{
						.u-text__value{
							font-size: 12px !important;
							color: #B5B8BE !important;
							margin-top: 5px;
						}
					}
					
				}
				.quarter{
					.u-cell__body {
						padding: 13px 0 13px 8px;
					}
					
				}
				.month{
					.u-cell__body {
						padding: 13px 0 13px 16px;
					}
				}
				.week{
					.u-cell__body {
						padding: 13px 0 13px 24px;
					}
				}
				.day{
					.u-cell__body {
						padding: 13px 0 13px 32px;
					}
				}
				.logo{
					width: 16px;
					height: 16px;
				}
				.logo-icon{
					width: 16px;
					height: 16px;
					right: 4px;
				}
				.u-cell__body {
					padding: 13px 0px;
				}
			}
		}
	}

</style>
