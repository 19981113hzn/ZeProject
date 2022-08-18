<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="业绩目标" bgColor="rgba(0, 114, 255, 1)" @leftClick="leftClick" @rightClick="rightClick">
			<view class="u-nav-slot" slot="left">
				<image class="logo" src="/static/img/blueprint/blue_fh.png"></image>
			</view>
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/blueprint/blue_bj.png"></image>
			</view>
		</u-navbar>
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="15" :vertical="true"></u-loading-icon>
		<view v-else>
			<view class="main-head">
				<view class="main-body">
					<view>
						<u-cell :title="blueprintTargetsInfo.area" :label="blueprintTargetsInfo.industryName">
						</u-cell>
						<view class="charts">
							<view class="charts-box">
								<u-cell >
									<image class="logo_ico" slot="icon" src="/static/img/blueprint/blue_ndmb.png"></image>
									<view slot="title" class="u-slot-title">
										<text class="title-name">年度目标</text>
									</view>
								</u-cell>
								<view>
									<text class="txt-num">{{amount}}</text>
									<text class="txt">{{blueprintTargetsInfo.unitName}}</text>
								</view>
							</view>
							<view class="shuxian"></view>
							<view class="charts-box">
								<view style="margin-left: 50px;">
									<u-cell >
										<image class="logo_ico" slot="icon" src="/static/img/blueprint/blue_mbkh.png"></image>
										<view slot="title" class="u-slot-title">
											<text class="title-name">目标客户</text>
										</view>
									</u-cell>
									<view>
										<text class="txt-num">{{customerNum}}</text>
										<text class="txt">个</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="main-content">
				<u-tabs :list="lsyTabs" @click="clickTabs" :scrollable="false" lineWidth="59"
				 lineColor="#0072FF"
				 :activeStyle="{
				        color: '#0072FF',
				    }"></u-tabs>
			</view>
			<view class="main-echart">
				<echarts :option="option2" style="height: 150px;"></echarts>
			</view>
			<view class="main-customer">
				<view class="card">
					<u-cell title="关联客户"></u-cell>
					<view v-if="!isNone">
						<u-collapse
						 :value="[0,1,2]"
						  >
							<u-collapse-item
								v-for="(item1, index1) in lstCustomer" :key="index1"
								:title="item1.month"
								:name="index1"
						    >
								<u-cell v-for="(item, index) in item1.lstCustomer" :key="index"
									@click="detailContact(item.id)" >
									<view slot="icon" class="logo-icon">
										<view class="logo-icon-txt">
											{{sliceString(item,0,4)}}
										</view>
									</view>
									<view slot="title" class="u-slot-title">
										<text class="u-cell-text">{{item}}</text>
									</view>
								</u-cell> 
							</u-collapse-item>
						  </u-collapse>
					</view>
					<view v-if="isNone" style="height: 209px;">
						<u-empty  text="暂无客户" width="84" height="84"
							icon="/static/img/blueprint/blue_zwkh.png">
							<!-- <u-button color="rgba(0, 114, 255, 1)" shape="circle"
							:style="{marginTop:19+'px'}" text="去添加" @click="gotoNewBlueprint">	</u-button> -->
						</u-empty>
					</view>
				</view>
			</view>
				
		</view>
		
	
	</view>
</template>

<script>
	import echarts from '@/components/echarts/echarts.vue';
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getBlueprintTargetsById,
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				lsyTabs: [{
					name: "第一季度"
				}, {
					name: "第二季度"
				}, {
					name: "第三季度"
				},{
					name: "第四季度"
				}],
				current:0,
				option2:{},
				oneNum:0,
				twoNum:0,
				isNone:true,
				id:"",
				blueprintTargetsInfo:{},
				amount: 0,
				customerNum: 0,
				oneData:[],//第一季度
				twoData:[],//第二季度
				threeData:[],//第三季度
				fourData:[],//第四季度
				lstCustomer:[],
				oneCustomer:[],//第一季度
				twoCustomer:[],//第二季度
				threeCustomer:[],//第三季度
				fourCustomer:[],//第四季度
				isLoading: false, //加载中
			}
		},
		onLoad(option){
			this.id = option.id || "";
			this.option2 = {
			   color: [
			   		"#8AEAF0",
			   		'#0072FF',
			   		'#00C6FF',
			   	  ],
			    //backgroundColor: '#030828',
			    // 提示框
			    tooltip: {
			        trigger: 'item',
			        formatter: '{b}'
			    },
			    legend: {
					top: '20%',
					right:"right",
					orient: 'vertical',
			        //circle圆形,rect长方形,roundRect圆角长方形,triangle三角形,diamond菱形,pin不规则圆,arrow不规则三角形,none没有图标
			        icon: 'circle'
			    },
			    series: [{
			        name: '',
			        type: 'pie',
			        radius: ['50%', '90%'],
			        center: ['30%', '50%'],
			        //不显示标签
			        label: {
			            show: false
			        },
			        data: [
						{
							value: this.oneNum, 
							name: '1月 '+ this.oneNum+"万元",
							itemStyle: {
							// 判断百分比设置颜色
								color:this.oneNum ==0 ?'#EAECEF':"#8AEAF0",
							},
						},
						{ 
							value: this.oneNum, 
							name: '2月 '+ this.oneNum+"万元",
							itemStyle: {
								// 判断百分比设置颜色
									color:this.oneNum ==0 ?'#EAECEF':"#0072FF",
							 },
						 },
						{
							value: this.oneNum, 
							name: '3月 '+ this.oneNum+"万元",
							itemStyle: {
								// 判断百分比设置颜色
									color:this.oneNum ==0 ?'#EAECEF':"#00C6FF",
							 },
						 },
			        ]
			    }]
			};
			this.getData();
		},
		onShow(){
			uni.$once('returnBlueprintDetail', res => {
				if (res) {
					this.getData();
				}
			})
		},
		methods: {
			//截取前四位的字符串
			sliceString(stringObject, start, end) {
				return isEmpty(stringObject)?'':stringObject.slice(start, end)
			},
			leftClick(){
				uni.navigateBack();
			},
			clickTabs(item) {
				this.current = item.index
				let data=[]
				switch(this.current){
					case 0://第一季度
						data=this.oneData;
						this.isNone=this.oneCustomer.length>0?false:true;
						this.lstCustomer = this.oneCustomer.length>0?this.oneCustomer:[]
						break;
					case 1://第二季度
						data=this.twoData
						this.isNone=this.twoCustomer.length>0?false:true;
						this.lstCustomer = this.twoCustomer.length>0?this.twoCustomer:[]
						break;
					case 2://第三季度
						data=this.threeData
						this.isNone=this.threeCustomer.length>0?false:true;
						this.lstCustomer = this.threeCustomer.length>0?this.threeCustomer:[]
						break;
					case 3://第四季度
						data=this.fourData
						this.isNone=this.fourCustomer.length>0?false:true;
						this.lstCustomer = this.fourCustomer.length>0?this.fourCustomer:[]
						break;
				}
				this.$nextTick(function(){
					this.option2.series[0].data=data
				})
				
			},
			getData(){
				this.isLoading = false;
				getBlueprintTargetsById("?id="+this.id, res => {
					if (res.code == 200 && res.success) {
						this.blueprintTargetsInfo=res.result
						this.blueprintTargetsInfo.area = this.blueprintTargetsInfo.area.replace(/,/g, "")
						let industry=getApp().globalData.industry //目标行业
						industry.forEach(item => { //目标行业
							if (item.value == this.blueprintTargetsInfo.industry) {
								this.blueprintTargetsInfo.industryName=item.label
							}
						})
						let amount_unit=getApp().globalData.amount_unit //目标单位
						amount_unit.forEach(item => { //目标行业
							if (item.value == this.blueprintTargetsInfo.unit) {
								this.blueprintTargetsInfo.unitName=item.label
							}
						})
						this.oneData=[];//第一季度
						this.twoData=[];//第二季度
						this.threeData=[];//第三季度
						this.fourData=[];//第四季度
						this.oneCustomer=[];//第一季度
						this.twoCustomer=[];//第二季度
						this.threeCustomer=[];//第三季度
						this.fourCustomer=[];//第四季度
						this.amount= 0;
						this.customerNum= 0;
						for(let i=0;i<this.blueprintTargetsInfo.monthlyList.length;i++){
							let item = this.blueprintTargetsInfo.monthlyList[i]
							this.amount += item.amount;
							this.customerNum += item.customerIds.length;
							if(item.monthValue<4){
								let month={
									value: item.amount, 
									name: item.monthValue+'月  '+ item.amount+this.blueprintTargetsInfo.unitName,
									itemStyle: {
									// 判断百分比设置颜色
										color: (item.monthValue==1) ?
										 (item.amount ==0 ?'#EAECEF':"#8AEAF0") :
										 ((item.monthValue==2 ) ?(item.amount == 0 ?'#EAECEF':"#0072FF"):
										 (item.amount == 0 ?'#EAECEF':"#00C6FF")),
									},
								};
								let arr=[];
								 for (let k in item.customerNames) { 
									 arr.push(item.customerNames[k])
								 }
								 if(arr.length>0){
									 this.oneCustomer.push({
									 	month:item.monthValue+'月',
									 	lstCustomer:arr
									 })
								 }
								
								this.oneData.push(month)
							}
							else if(item.monthValue<7){
								let month={
									value: item.amount, 
									name: item.monthValue+'月  '+ item.amount+this.blueprintTargetsInfo.unitName,
									itemStyle: {
									// 判断百分比设置颜色
										color: (item.monthValue==4) ?
										 (item.amount ==0 ?'#EAECEF':"#8AEAF0") :
										 ((item.monthValue==5 ) ?(item.amount == 0 ?'#EAECEF':"#0072FF"):
										 (item.amount == 0 ?'#EAECEF':"#00C6FF")),
									},
								};
								let arr=[];
								 for (let k in item.customerNames) { 
									 arr.push(item.customerNames[k])
								 }
								 if(arr.length>0){
									 this.twoCustomer.push({
									 	month:item.monthValue+'月',
									 	lstCustomer:arr
									 })
								 }
								
								this.twoData.push(month)
								
							}
							else if(item.monthValue<10){
								let month={
									value: item.amount, 
									name: item.monthValue+'月  '+ item.amount+this.blueprintTargetsInfo.unitName,
									itemStyle: {
									// 判断百分比设置颜色
										color: (item.monthValue==7) ?
										 (item.amount ==0 ?'#EAECEF':"#8AEAF0") :
										 ((item.monthValue==8 ) ?(item.amount == 0 ?'#EAECEF':"#0072FF"):
										 (item.amount == 0 ?'#EAECEF':"#00C6FF")),
									},
								};
								let arr=[];
								 for (let k in item.customerNames) { 
									 arr.push(item.customerNames[k])
								 }
								 if(arr.length>0){
									 this.threeCustomer.push({
									 	month:item.monthValue+'月',
									 	lstCustomer:arr
									 })
								 }
								
								this.threeData.push(month)
							}else{
								let month={
									value: item.amount, 
									name: item.monthValue+'月  '+ item.amount+this.blueprintTargetsInfo.unitName,
									itemStyle: {
									// 判断百分比设置颜色
										color: (item.monthValue==10) ?
										 (item.amount ==0 ?'#EAECEF':"#8AEAF0") :
										 ((item.monthValue==11) ?(item.amount == 0 ?'#EAECEF':"#0072FF"):
										 (item.amount == 0 ?'#EAECEF':"#00C6FF")),
									},
								};
								let arr=[];
								 for (let k in item.customerNames) { 
									 arr.push(item.customerNames[k])
								 }
								if(arr.length>0){
									this.fourCustomer.push({
										month:item.monthValue+'月',
										lstCustomer:arr
									})
								}
								this.fourData.push(month)
							}
						}
						this.option2.series[0].data=this.oneData;
						this.isNone=this.oneCustomer.length>0?false:true;
						this.lstCustomer = this.oneCustomer.length>0?this.oneCustomer:[],
						this.isLoading = true;
						console.log(this.blueprintTargetsInfo)
					} else {
						uni.$u.toast(res.message);
						this.isLoading = true;
					}
					
				})
			},
			rightClick(){
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/addAchievement?id=" +
						this.blueprintTargetsInfo.id
				});
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
	/deep/.u-navbar__content .u-navbar__content__title {
		color: #fff;
	}
	.main-head{
		height: 123px;
		background: linear-gradient(180deg, #0072FF 0%, rgba(0,114,255,0) 100%);
		border-radius: 0px 0px 0px 0px;
		opacity: 1;
		padding: 16px 16px 0;
		/deep/.main-body{
			height: 163px;
			background: #FFFFFF;
			border-radius: 6px 6px 6px 6px;
			opacity: 1;
			padding: 0 16px 0px;
			.u-line {
				border-bottom: 1px solid rgb(214, 215, 217) !important;
			}
			.logo_ico {
				width: 20px;
				height: 20px;
			}
			.u-cell__body {
				padding: 16px 0px;
				.u-cell__title-text{
					font-size: 16px;
					font-weight:bold;
					color: #303133;
				}
			}
			.charts {
				// height: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 12px;
				
				.u-line {
					border: none !important;
				}
				.shuxian {
					width: 1px;
					height: 65px;
					background: rgba(0, 0, 0, 0.1000);
					border-radius: 0px 0px 0px 0px;
					opacity: 1;
				}
			
				.charts-box {
					display: block;
					// flex-direction: column;
					// align-items: center;
					height: 91px;
					width: 50%;
					.u-cell{
						width: 100%;
						height: 40px;
						
					}
					.title-name{
						font-size: 12px;
						color: #909399;
					}
					.txt-num{
						height: 40px;
						font-size: 18px;
						font-weight: bold;
						color: rgba(48, 49, 51, 1);
					}
					.txt{
						margin-left: 4px;
						height: 40px;
					}
				}
			}
		}
	}
	
	/deep/.main-content {
		margin-top: 56px;
		background: #fff;
	}
	.main-echart{
		padding: 16px;
		background: #fff;
	}
	
	/deep/.main-customer{
		background: #fff;
		padding: 0 16px 0px;
		.card{
			border-top: 1px solid rgb(214, 215, 217);
		}
		.u-line {
			border:none !important;
		}
		.u-collapse-item__content__text{
			padding: unset;
		}
		.logo-icon {
			background: #DFEDFF;
			width: 32px;
			height: 32px;
			border-radius: 4px;
			margin-right: 4px;
			display: flex;
			justify-content: center;
			align-items: center;
			.logo-icon-txt {
				font-size: 10px;
				text-align: center;
				padding: 4px;
				color: #0072FF;
				line-height: 12px;
			}
		}
		.u-empty{
			margin-top: 20px !important;
			.u-button--circle{
				width: 104px;
			}
			.u-button__text{
				font-size: 16px !important;
			}
		}
	}
	
	.u-loading-icon--vertical{
		margin-top: 50px;
	}
</style>
