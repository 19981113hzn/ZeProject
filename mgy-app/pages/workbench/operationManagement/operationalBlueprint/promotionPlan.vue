<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="推进计划" bgColor="#fff" @leftClick="leftClick">
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
					<view class="card" v-for="(item, index) in lstPromotionPlan" :key="index">
						<view class="card-pa">
							<u-cell class="title" :title="item.typeName">
							</u-cell>
							<u-cell :title="item.planTime" @click="gotoEdit(item)">
									<image v-if="!item.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @tap.stop="clickOpen(index)"></image>
									<image v-if="item.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @tap.stop="clickOpen(index)"></image>
									<image v-if="item.type!=4" class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png" @tap.stop="clickNewAdd(item)"></image>
							</u-cell>
							<view v-if="item.isOpen">
								<u-cell class="content" v-if="!inspectEmpty(item.description) || !inspectEmpty(item.participantNames)" @click="gotoEdit(item)">
									<view slot="title" v-if="!inspectEmpty(item.description)">
										<u--text :lines="1" :text="item.description"></u--text>
									</view>
									<view slot="label">
										<u--text class="txt" v-if="!inspectEmpty(item.participantNames)" :lines="1" :text="'参与人员：'+ item.participantNames"></u--text>
									</view>
								</u-cell>
								<view class="quarter" v-for="(item1, index1) in item.children" :key="index1">
									<u-cell :title="item1.planTime" @click="gotoEdit(item1)">
										<image v-if="!item1.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @tap.stop="clickTwoOpen(index,index1)"></image>
										<image  v-if="item1.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @tap.stop="clickTwoOpen(index,index1)"></image>
										<image v-if="item1.type!=4" class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png"  @tap.stop="clickNewAdd(item1)"></image>
									</u-cell>
									<view v-if="item1.isOpen">
										<u-cell class="content" v-if="!inspectEmpty(item1.description) || !inspectEmpty(item1.participantNames)" @click="gotoEdit(item1)">
											<view slot="title" v-if="!inspectEmpty(item1.description)">
												<u--text :lines="1" :text="item1.description"></u--text>
											</view>
											<view slot="label">
												<u--text class="txt" v-if="!inspectEmpty(item1.participantNames)" :lines="1" :text="'参与人员：'+ item1.participantNames"></u--text>
											</view>
										</u-cell>
										<view class="month" v-for="(item2, index2) in item1.children" :key="index2">
											<u-cell :title="item2.planTime" @click="gotoEdit(item2)">
												<image v-if="!item2.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @tap.stop="clickThreeOpen(index,index1,index2)"></image>
												<image  v-if="item2.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @tap.stop="clickThreeOpen(index,index1,index2)"></image>
												<image v-if="item2.type!=4" class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png" @tap.stop="clickNewAdd(item2)"></image>
											</u-cell>
											<view v-if="item2.isOpen">
												<u-cell class="content" v-if="!inspectEmpty(item2.description) || !inspectEmpty(item2.participantNames)" @click="gotoEdit(item2)">
													<view slot="title" v-if="!inspectEmpty(item2.description)">
														<u--text :lines="1" :text="item2.description"></u--text>
													</view>
													<view slot="label">
														<u--text class="txt" v-if="!inspectEmpty(item2.participantNames)" :lines="1" :text="'参与人员：'+ item2.participantNames"></u--text>
													</view>
												</u-cell>
												<view class="week" v-for="(item3, index3) in item2.children" :key="index3">
													<u-cell :title="item3.planTime"  @click="gotoEdit(item3)">
														<image v-if="!item3.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @tap.stop="clickFourOpen(index,index1,index2,index3)"></image>
														<image  v-if="item3.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @tap.stop="clickFourOpen(index,index1,index2,index3)"></image>
														<image v-if="item3.type!=4" class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png" @tap.stop="clickNewAdd(item3)"></image>
													</u-cell>
													<view v-if="item3.isOpen">
														<u-cell class="content" v-if="!inspectEmpty(item3.description) || !inspectEmpty(item3.participantNames)"  @click="gotoEdit(item3)">
															<view slot="title" v-if="!inspectEmpty(item3.description)">
																<u--text :lines="1" :text="item3.description"></u--text>
															</view>
															<view slot="label">
																<u--text class="txt" v-if="!inspectEmpty(item3.participantNames)" :lines="1" :text="'参与人员：'+ item3.participantNames"></u--text>
															</view>
														</u-cell>
														<view class="day"  v-for="(item4, index4) in item3.children" :key="index4">
															<u-cell :title="item4.planTime" @click="gotoEdit(item4)">
																<image v-if="!item4.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @tap.stop="clickFiveOpen(index,index1,index2,index3,index4)"></image>
																<image  v-if="item4.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @tap.stop="clickFiveOpen(index,index1,index2,index3,index4)"></image>
																<image v-if="item4.type!=4" class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png"  @tap.stop="clickNewAdd(item4)"></image>
															</u-cell>
															<view v-if="item4.isOpen ">
																<u-cell class="content" v-if="!inspectEmpty(item4.description) || !inspectEmpty(item4.participantNames)" @click="gotoEdit(item4)">
																	<view slot="title" v-if="!inspectEmpty(item4.description)">
																		<u--text :lines="1" :text="item4.description"></u--text>
																	</view>
																	<view slot="label">
																		<u--text class="txt" v-if="!inspectEmpty(item4.participantNames)" :lines="1" :text="'参与人员：'+ item4.participantNames"></u--text>
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
						</view>
					</view>
					
					<!-- <view class="card" v-for="(item, index) in lst" :key="index">
						<view class="card-pa">
							<u-cell class="title" :title="item.name">
							</u-cell>
							<view v-for="(item1, index1) in item.lst">
								<u-cell :title="item1.name">
									<image v-if="!item1.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @click="clickOpen(index,index1)"></image>
									<image v-if="item1.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @click="clickOpen(index,index1)"></image>
									<image class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png"></image>
								</u-cell>
								<view v-if="item1.isOpen">
									<u-cell class="content">
										<view slot="title">
											<u--text :lines="1" :text="item1.content"></u--text>
										</view>
										<view slot="label">
											<u--text class="txt" :lines="1" :text="item1.userNames==''?'':('参与人员：'+ item1.userNames)"></u--text>
										</view>
									</u-cell>
									<view class="quarter" v-for="(item2, index2) in item1.lst" :key="index2">
										<u-cell :title="item2.name">
											<image v-if="!item2.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @click="clickTwoOpen(index,index1,index2)"></image>
											<image  v-if="item2.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @click="clickTwoOpen(index,index1,index2)"></image>
											<image class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png" ></image>
										</u-cell>
										<view v-if="item2.isOpen">
											<u-cell class="content">
												<view slot="title">
													<u--text :lines="1" :text="item1.content"></u--text>
												</view>
											</u-cell>
											<view class="month" v-for="(item3, index3) in item2.lst" :key="index3">
												<u-cell :title="item3.name">
													<image v-if="!item3.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @click="clickThreeOpen(index,index1,index2,index3)"></image>
													<image  v-if="item3.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @click="clickThreeOpen(index,index1,index2,index3)"></image>
													<image class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png"></image>
												</u-cell>
												<view v-if="item3.isOpen">
													<u-cell class="content">
														<view slot="title">
															<u--text :lines="1" :text="item1.content"></u--text>
														</view>
													</u-cell>
													<view class="week" v-for="(item4, index4) in item3.lst" :key="index4">
														<u-cell :title="item4.name">
															<image v-if="!item4.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @click="clickFourOpen(index,index1,index2,index3,index4)"></image>
															<image  v-if="item4.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @click="clickFourOpen(index,index1,index2,index3,index4)"></image>
															<image class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png"></image>
														</u-cell>
														<view v-if="item4.isOpen">
															<u-cell class="content">
																<view slot="title">
																	<u--text :lines="1" :text="item1.content"></u--text>
																</view>
															</u-cell>
															<view class="day"  v-for="(item5, index5) in item4.lst" :key="index5">
																<u-cell :title="item5.name">
																	<image v-if="!item5.isOpen" class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan-sq.png" @click="clickFiveOpen(index,index1,index2,index3,index4,index5)"></image>
																	<image  v-if="item5.isOpen"  class="logo-icon" slot="icon" src="/static/img/blueprint/blue_plan_zk.png" @click="clickFiveOpen(index,index1,index2,index3,index4,index5)"></image>
																	<image class="logo" slot="value" src="/static/img/blueprint/blue_plan_add.png"></image>
																</u-cell>
																<u-cell class="content" v-if="item5.isOpen">
																	<view slot="title">
																		<u--text :lines="1" :text="item1.content"></u--text>
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
						</view>
					</view> -->
					
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
			<view style="padding: 16px 126px;">
				<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="添加" @click="gotoPromotionPlanAdd">
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
				
			}
		},
		onLoad(option){
			this.blueprintId = option.blueprintId || "";
			this.yearValue = option.yearValue || "";
			this.getDictItems('plan_type'); //计划类型
			
		},
		onShow() {
			uni.$once('returnPromotionPlan', res => {
				if (res) {
					this.scrollTop=0;
					this.getData();
				}
			})
		},
		methods: {
			leftClick(){
				uni.navigateBack();
			},
			//状态查询
			getDictItems(dictCode) {
				let data = "?dictCode=" + dictCode
				getDictItemsByCode(data, res => {
					if (res.code == 200 && res.success) {
						getApp().globalData[dictCode] = res.result;
						this.plan_type = res.result;
						this.getData();
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getData(){
				let info="?bluePrintId="+this.blueprintId
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
			inspectEmpty(obj){
			    if(typeof obj=="undefined" || obj ==null || obj == ""){
			        return true;
			    }else{
			        return false;
			    }
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
			//编辑
			gotoEdit(item){
				uni.setStorageSync("selectEdit",item)
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/promotionPlanAdd?id="+item.id+"&blueprintId="+
						this.blueprintId + '&yearValue=' + this.yearValue
				})
			},
			//新增
			clickNewAdd(item){
				uni.setStorageSync("selectEdit",item)
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/promotionPlanAdd?type="+item.type+"&blueprintId="+
						this.blueprintId + '&yearValue=' + this.yearValue
				})
			},
			
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
