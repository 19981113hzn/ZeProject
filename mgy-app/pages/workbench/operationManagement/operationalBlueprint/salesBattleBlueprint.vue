<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="销售作战蓝图" bgColor="#fff" @leftClick="leftClick">
		</u-navbar>
		<view class="card">
			<view class="card-pa">
				<u-cell :title="bluePrintInfo.year+'年销售作战蓝图'"></u-cell>
				<u-cell class="none-line">
					<image class="logo" slot="icon" src="/static/img/workbench/icon_user_head.png"></image>
					<view slot="title" class="u-slot-title">
						<text class="title-name">{{userName}}</text>
						<!-- <text class="text-tag">销售部/销售经理</text> -->
					</view>
					<view slot="label" class="u-slot-label">
						<view class="block">
							<view class="block_bg" 
							:style="{'width':(bluePrintInfo.perfection || 0)*2+'px','background':'rgba(0, 114, 255, 1)'}"></view>
						</view>
						<text class="data-text">资料完善度&emsp;{{(bluePrintInfo.perfection || 0)+'%'}}</text>
					</view>
				</u-cell>
			</view>
		</view>
		<view class="card">
			<view class="card-pa">
				<u-cell title="业绩目标" isLink @click="gotoAchievement"></u-cell>
				<view>
					<!-- <qiun-data-charts type="arcbar" :opts="opts1" :chartData="chartYearData" /> -->
					<echarts :option="option" style="height: 150px;"></echarts>
				</view>
			</view>
		</view>
		
		<view class="card">
			<view class="card-pa">
				<u-cell title="资源分析" isLink @click="gotoResourceAnalysis"></u-cell>
				<view>
					<!-- <qiun-data-charts type="arcbar" :opts="opts1" :chartData="chartYearData" /> -->
					<echarts :option="option2" style="height: 150px;"></echarts>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="card-pa">
				<u-cell title="推进计划" isLink @click="gotoPromotionPlan"></u-cell>
				<view class="charts">
					<view class="charts-box chart-left">
						<image class="logo" src="/static/img/blueprint/blue_tjjh.png"></image>
						<text class="txt">{{yearNum}}</text>
						<text class="txt-name">年度/个</text>
					</view>
					<view class="charts-box chart-right">
						<image class="logo" src="/static/img/blueprint/blue_tjjh.png"></image>
						<text class="txt">{{promotionPlanNum}}</text>
						<text class="txt-name">共计/个</text>
					</view>
				</view>
			</view>
		</view>
		<view class="card"></view>
	</view>
</template>

<script>
	import echarts from '@/components/echarts/echarts.vue';
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getBluePrintById,
		getpromotionPlanList,
		getBlueprintTargetsList,
		getBluePrintRes
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				blueprintId:"",//销售作战蓝图ID
				userName:"",
				bluePrintInfo:{},//销售作战蓝图
				yearNum:0,
				promotionPlanNum:0,
				
				option: {
					color: [
							"#0089FF",
							'#63D0FF',
							'#10BE83',
							'#87D98F',
						  ],
				  tooltip: {
					trigger: 'item',
					 formatter: '{b}'
				  },
				   legend: {
					   //show:false,
						top: '15%',
						right:"right",
						orient: 'vertical',
						icon: 'circle'
					},
				  series: [
					{
						label: {
							//show: true,
							position: 'center',
							color: "#303133",
							fontSize: "16",
							formatter: '0万元'+'\n'+'总目标',//中间的文字
						},
						name: '',
						type: 'pie',
						radius: ['70%', '90%'],					
						center: ['30%', '50%'],	//控制圆环位置
						avoidLabelOverlap: false,
						
					  emphasis: {
						label: {
						  show: true,
						  fontWeight: 'bold'
						}
					  },
					  labelLine: {
						show: false
					  },
					  data: [
						{ 
							value: 0, 
							name: '第一季度 ' + 0+"万",
							itemStyle: {
							// 判断百分比设置颜色
								color:0 ==0 ?'#EAECEF':"#0089FF",
							},
						},
						{ 
							value: 0, 
							name: '第二季度 '+ 0+"万",
							itemStyle: {
								// 判断百分比设置颜色
									color:0 ==0 ?'#EAECEF':"#63D0FF",
							 },
						 },
						{
							value: 0, 
							name: '第三季度 '+ 0+"万",
							itemStyle: {
								// 判断百分比设置颜色
									color:0 ==0 ?'#EAECEF':"#10BE83",
							 },
						 },
						{
							value: 0, 
							name: '第四季度 '+ 0+"万",
							itemStyle: {
								// 判断百分比设置颜色
									color:0 ==0 ?'#EAECEF':"#87D98F",
							 },
						 },
					  ],
					}
				  ]
				},
				option2:{
					color: [
						"#8AEAF0",
						'#0072FF',
						'#00C6FF',
					  ],
					//backgroundColor: '#030828',
					grid: {
						left: 20,
						right: 20,
						top: 10,
						bottom: 10
					},
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
								value: 0, 
								name: '个人资源 '+ 0+"个",
								itemStyle: {
								// 判断百分比设置颜色
									color:0 ==0 ?'#EAECEF':"#8AEAF0",
								},
							},
							{ 
								value: 0, 
								name: '公司资源 '+ 0+"个",
								itemStyle: {
									// 判断百分比设置颜色
										color:0 ==0 ?'#EAECEF':"#0072FF",
								 },
							 },
							{
								value: 0, 
								name: '厂商资源 '+ 0+"个",
								itemStyle: {
									// 判断百分比设置颜色
										color:0 ==0 ?'#EAECEF':"#00C6FF",
								 },
							 },
						]
					}]
				},
				
			}
		},
		onLoad(option){
			this.blueprintId = option.id || "";	
			this.userName = option.userName || "";	
			//this.option = ;
			//this.option2 = ;
			
			this.getData();
			this.getpromotionPlanData();
			this.getBlueprintTargetsData();
			this.getBluePrintData();
		},
		methods: {
			leftClick(){
				uni.navigateBack();
			},
			//业绩目标
			gotoAchievement(){
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/achievement?blueprintId="+this.blueprintId+'&yearValue='+this.bluePrintInfo.year
				})
			},
			//资源分析
			gotoResourceAnalysis(){
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/resourceAnalysis?blueprintId="+this.blueprintId+'&yearValue='+this.bluePrintInfo.year
				})
			},
			//推进计划
			gotoPromotionPlan(){
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/operationalBlueprint/promotionPlan?blueprintId="+this.blueprintId+'&yearValue='+this.bluePrintInfo.year
				})
			},
			getData(){
				getBluePrintById("?id="+this.blueprintId, res => {
					if (res.code == 200 && res.success) {
						console.log(res);
						this.bluePrintInfo=res.result
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			},
			getpromotionPlanData(){
				getpromotionPlanList("?pageNo=1&pageSize=1000&bluePrintId="+this.blueprintId,res=>{
					if (res.code == 200 && res.success) {
						//console.log(res.result);
						this.promotionPlanNum=res.result.total
						let result = isEmpty(res.result) ? [] : res.result.records;
						let data = result.find(item => item.type == 0)
						this.yearNum= isEmpty(data)?0:1
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			},
			getBlueprintTargetsData(){
				let data = "?blueprintId=" + this.blueprintId
				getBlueprintTargetsList(data, res => {
					if (res.code == 200 && res.success) {
						console.log(res);
						let result = isEmpty(res.result) ? [] : res.result;
						//this.lstBlueprintTargets = isEmpty(res.result) ? [] : res.result;
						this.classify(result)
						
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			},
			classify(arr) {
				this.oneNum=0;//第一季度
				this.twoNum=0;//第二季度
				this.threeNum=0;//第三季度
				this.fourNum=0;//第四季度
				let num=10000;//1亿 ==10000 万
				for (let i = 0; i < arr.length; i++) {
					for(let j=0;j<arr[i].monthlyList.length;j++){
						let item = arr[i].monthlyList[j]
						item.amount= item.unit == "亿元" ? item.amount*num : item.amount
						if(item.monthValue<4){
							this.oneNum += item.amount;
						}
						else if(item.monthValue<7){
							this.twoNum += item.amount;
						}
						else if(item.monthValue<10){
							this.threeNum += item.amount;
						}else{
							this.fourNum += item.amount;
						}
					}
				}
				console.log(this.oneNum)
				console.log(this.twoNum)
				console.log(this.threeNum)
				console.log(this.fourNum)
				let allNum=this.oneNum+this.twoNum+this.threeNum+this.fourNum
				this.oneNum=this.oneNum.toFixed(2)
				this.twoNum=this.twoNum.toFixed(2)
				this.threeNum=this.threeNum.toFixed(2)
				this.fourNum=this.fourNum.toFixed(2)
				let data=[
					{
						value: this.oneNum, 
						name: '第一季度 ' + this.oneNum+"万",
						itemStyle: {
						// 判断百分比设置颜色
							color:this.oneNum ==0 ?'#EAECEF':"#0089FF",
						},
					},
					{ 
						value: this.twoNum, 
						name: '第二季度 '+ this.twoNum+"万",
						itemStyle: {
							// 判断百分比设置颜色
								color:this.twoNum ==0 ?'#EAECEF':"#63D0FF",
						 },
					 },
					{
						value: this.threeNum, 
						name: '第三季度 '+ this.threeNum+"万",
						itemStyle: {
							// 判断百分比设置颜色
								color:this.threeNum ==0 ?'#EAECEF':"#10BE83",
						 },
					 },
					{
						value: this.fourNum, 
						name: '第四季度 '+ this.fourNum+"万",
						itemStyle: {
							// 判断百分比设置颜色
								color:this.fourNum ==0 ?'#EAECEF':"#87D98F",
						 },
					 },
				]
				this.$nextTick(()=>{
					this.option.series[0].data=data;
					
					this.option.series[0].label.formatter=allNum.toFixed(2)+'万元'+'\n'+'总目标'//中间的文字;
				})
			},
			getBluePrintData(){
				getBluePrintRes("?id="+this.blueprintId,res=>{
					if (res.code == 200 && res.success) {
						console.log(res);
						let result = isEmpty(res.result) ? [] : res.result;
						let data=[
							{
								value: result.personalCount, 
								name: '个人资源 '+ result.personalCount+"个",
								itemStyle: {
								// 判断百分比设置颜色
									color:result.personalCount ==0 ?'#EAECEF':"#8AEAF0",
								},
							},
							{ 
								value: result.companyCount, 
								name: '公司资源 '+ result.companyCount+"个",
								itemStyle: {
									// 判断百分比设置颜色
										color:result.companyCount ==0 ?'#EAECEF':"#0072FF",
								 },
							 },
							{
								value: result.contractorCount, 
								name: '厂商资源 '+ result.contractorCount+"个",
								itemStyle: {
									// 判断百分比设置颜色
										color:result.contractorCount ==0 ?'#EAECEF':"#00C6FF",
								 },
							 },
						]
						this.$nextTick(()=>{
							this.option2.series[0].data=data;
						})
						
						
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
					// companyCount: 3
					// contractorCount: 10
					// personalCount: 8
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}
	/deep/{
		.card{
			padding: 16px 16px 0 16px;
			.card-pa {
				padding: 0 16px 0px;
				background: #fff;
				border-radius: 10px;
				.u-cell__body{
					padding: 16px 0px;
					background: #fff;
					.u-cell__title-text{
						font-size: 18px;
						font-weight: bold;
						color: rgba(48, 49, 51, 1);
					}
				}
				.none-line{
					.u-line {
						border: none !important;
					}
					.logo{
						width: 65px;
						height: 65px;
						margin-right: 8px;
					}
					.block{
						width: 200px;
						height: 5px;
						background: #f0f0f0;
						display: inline-block;
						border-radius: 6px;
					}
					.block_bg{
						width: 50px;
						height: 5px;
						background-size: 100% 100%;
						float: left;
					}
					.title-name{
						font-weight: bold;
						font-size: 16px;
						color: rgba(48, 49, 51, 1);
					}
					.text-tag {
						margin-left: 8px;
						font-size: 12px;
						color: rgba(144, 147, 153, 1);
					}
					.data-text{
						display: block;
						font-size: 12px;
						color: rgba(144, 147, 153, 1);
						line-height: 24px;
					}
				}
			}
		}
		.charts {
			height: 55px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 11px;
			padding-bottom: 16px;
			font-size: 12px;
		
			.charts-box {
				background: rgba(247, 251, 254, 1);
				display: flex;
				flex-direction: column;
				align-items: center;
				width:48%;
				height: 55px;
			}
			.chart-left{
				display: block;
				float: left;
			}
			.chart-right{
				display: block;
				float: right;
			}
			.logo{
				width: 24px;
				height: 24px;
				right: 16px;
				float: right;
			}
			.txt{
				display: block;
				margin-top: 8px;
				margin-left: 8px;
				color: #303133;
				font-size: 16px;
			}
			.txt-name{
				display: block;
				margin-left: 8px;
				line-height: 14px;
				color: #909399;
				font-size: 12px;
			}
		}
	}
	
	
	
</style>
