<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }" class="container">
		<u-navbar title="销售漏斗分析" bgColor="#fff" @leftClick="leftClick">
			<view class="u-nav-slot color-b" slot="right" @tap.stop="clickScreen">筛选</view>
		</u-navbar>
		<view>
			<echarts :option="option" style="height: 300px;"></echarts>
		</view>
		<view class="total">
			<u-grid :border="false" col="3">
				<u-grid-item>
					<text class="grid-text">{{total}}个</text>
					<text class="grid-text grid-title">商机数量</text>
				</u-grid-item>
				<u-grid-item>
					<text class="grid-text">{{expectSaleAmount}}</text>
					<text class="grid-text grid-title">预计销售金额</text>
				</u-grid-item>
				<u-grid-item>
					<text class="grid-text">{{amount}}</text>
					<text class="grid-text grid-title">概率金额</text>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="sales_detail">
			<view class="leftFix">
				<view class="sales_title">
					<text>销售状态</text>
					<text>商机类别</text>
				</view>
				<view class="sales_list">
					<view class="list" v-for="item in tableList">
						<view class="t-item">{{item.saleStatus}}</view>
						<view class="t-item">{{item.bizOpptyType}}</view>
					</view>
					<!-- <view class="list">
						<view class="t-item">目标客户</view>
						<view class="t-item">商机类别</view>
					</view>
					<view class="list">
						<view class="t-item">目标客户</view>
						<view class="t-item">商机类别</view>
					</view>
					<view class="list">
						<view class="t-item">目标客户</view>
						<view class="t-item">商机类别</view>
					</view>
					<view class="list">
						<view class="t-item">总计</view>
						<view class="t-item">-</view>
					</view> -->
				</view>
			</view>
			<view class="rightScroll">
				<view class="content">
					<view class="sales_title">
						<text>商机数量</text>
						<text>转化率</text>
						<text>预计销售金额</text>
						<text>概率金额</text>
					</view>
					<view class="sales_list">
						<view class="list" v-for="item in tableList">
							<view class="t-item">{{item.total}}</view>
							<view class="t-item">{{item.percentage}}</view>
							<view class="t-item">{{item.expectSaleAmount}}</view>
							<view class="t-item">{{item.probabilityAmount}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDeptList,
		getUserListByName,
		getFunnelAnalysis,
		getFunnelReportForm,
	} from '@/util/interface.js'
	import {
		GetNowFormatDate
	} from "@/util/js_DateTime.js";
	import {
		changeParam
	} from '@/util/common.js'
	import echarts from '@/components/echarts/echarts.vue';
	export default {
		components: {
			echarts
		},
		data() {
			return {
				topheight: 0,
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				result: {},
				option: {},
				// 销售漏斗分析
				// funnelopts: {
				// 	color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
				// 		"#ea7ccc"
				// 	],
				// 	padding: [15, 15, 0, 15],
				// 	extra: {
				// 		funnel: {
				// 			activeOpacity: 0.3,
				// 			activeWidth: 10,
				// 			border: true,
				// 			borderWidth: 2,
				// 			borderColor: "#FFFFFF",
				// 			fillOpacity: 1,
				// 			labelAlign: "right",
				// 			type: "triangle"
				// 		}
				// 	}
				// },
				chartFunnelData: {},
				firstTime: false,
				tableList: [],
				lstScreen: [
					// {
					// 	type:1,//1多选  2选择时间 3收入费用
					// 	title:"时间",
					// 	defaultSelectedIndex:"",
					// 	isMutiple:false, //是否多选
					// 	lst:[
					// 		{name:"近1个月",value:1},
					// 		{name:"近3个月",value:3},
					// 		{name:"近半年",value:6}
					// 	]
					// },
					{
						type: 2, //1多选  2选择时间 3收入费用
						title: "自定义时间段",
						startTime: "",
						endTime: "",
					},
					{
						type: 4, //1多选  2选择时间 3收入费用 4选择所属部门
						title: "所属部门",
						list: [{
							key: 1,
							title: '北京市'
						}, ],
						multiple: true,
						selectParent: false,
						flod: true, //折叠
						selectList: []
					},
					{
						type: 1, //1多选  2选择时间 3收入费用
						title: "人员",
						defaultSelectedIndex: [],
						isMore: true, //是否显示更多按钮
						isMutiple: true,
						isRequired: true, //是否跳转页面
						moreTitle: "更多",
						total: "", //点击获取跟多的时候，需要获取，进行查询
						lst: [{
							name: "周小康",
							value: 1
						}, ]
					}
				],
				pageNo: 1,
				maxPage: 1,
				status: "more",
				selectInfo: {
					deptIds: "", //销售部门key
					chargeMan: "", //负责人员
					startTime: "", //开始时间
					endTime: "", //结束时间
					statusId: ""
				},
				total: 0,
				expectSaleAmount: 0,
				amount: 0
			}
		},
		onLoad() {
			this.getDeptData();
			this.getUserList();
			this.getTableList();
			this.getFunnelDetail();
		},
		onShow() {
			this.pageNo = 1;
			uni.$once('result', res => {
				console.log("uni.$once('result', res:", res)
				for (let i = 0; i < res.length; i++) {
					let item = res[i];
					console.log(item)
					if (item.title == "时间") {
						let date = new Date()
						let m = date.getMonth() + 1;
						let y = m - item.defaultSelectedIndex > 0 ? date.getFullYear() : date.getFullYear() - 1;
						console.log('y:', y)
						// this.selectInfo['startTime'] = `${y}-${Math.abs(item.defaultSelectedIndex - m)}-0101`;
						// this.selectInfo['startTime'] = `${date.getFullYear()}-${m}${date.get}`;
					}
					if (item.title == "自定义时间段") {
						this.selectInfo.startTime = item.startTime;
						this.selectInfo.endTime = item.endTime;
					}
					if (item.title == "人员") {
						let SelectedIndex = "";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.defaultSelectedIndex[k]
						}
						this.selectInfo.chargeMan = SelectedIndex;
					}
					if (item.title == "所属部门") {
						let SelectedIndex = "";
						for (let k = 0; k < item.selectList.length; k++) {
							SelectedIndex += (SelectedIndex.length > 0 ? "," : "") + item.selectList[k].key
						}
						this.selectInfo.deptIds = SelectedIndex;
						console.log("this.selectInfo.deptIds:", this.selectInfo.deptIds)
					}
				}
				console.log("this.selectInfo:", this.selectInfo)
				this.getFunnelDetail();
				this.getTableList();
			})
			uni.$once('return', res => {
				if (res) {
					this.getFunnelDetail();
				}
			})
		},
		methods: {
			leftClick() {
				uni.navigateBack();
			},
			getDeptData() {
				getDeptList('', res => {
					console.log("getDeptList-res:", res);
					if (res.code == 200 && res.success) {
						this.lstScreen[1].list = res.result;
					}
				})
			},
			// 销售漏斗
			getFunnelDetail() {
				let {
					startTime,
					endTime,
					chargeMan,
					deptIds,
					statusId
				} = this.selectInfo;
				console.log('触发筛选:', startTime, endTime, chargeMan)
				let params = {
					beginTime: startTime,
					endTime: endTime,
					userIds: chargeMan,
					deptIds: deptIds,
					statusId: statusId
				}
				!startTime && delete params['beginTime'];
				!endTime && delete params['endTime'];
				!chargeMan && delete params['userIds'];
				!deptIds && delete params['deptIds'];
				!statusId && delete params['statusId'];
				getFunnelAnalysis(changeParam(params), res => {
					if (res.code == 200 && res.success) {
						// console.log(res.result);
						res.result.pop();
						let funnel1 = res.result.slice()
						console.log(funnel1)
						let a = 0;
						let b = 0;
						this.salesFunnel = res.result.reverse().map((im, ix) => {
							a += 12
							return {
								name: `${im.saleStatus}：${im.total}`,
								value: a,
								percentage: im.percentage,
								total: im.total,
								saleStatus: im.saleStatus
							}
						})
						this.salesFunnel1 = funnel1.reverse().map((im, ix) => {
							b += 12
							return {
								name: im.percentage + "%",
								value: b,
								percentage: im.percentage,
								total: im.total,
								saleStatus: im.saleStatus
							}
						})

						new Promise((resolve, reject) => {
							console.log(555);
							resolve()
						}).then(() => {
							console.log('then1');
							this.option = {
								tooltip: {
									trigger: 'item',
									formatterStatus: true,
									formatFunDefeat: 'formatFunDefeat'
								},
								series: [{

										name: 'Funnel',
										type: 'funnel',
										left: '-5%',
										top: 10,
										bottom: 60,
										width: '85%',
										min: 0,
										max: 100,
										minSize: '0%',
										maxSize: '100%',
										sort: 'descending',
										gap: 2,
										label: {
											show: true,
											position: 'outside',
											color: '#303133',
											fontSize: '10px',
											verticalAlign: 'middle'
										},
										labelLine: {
											length: 12,
											lineStyle: {
												width: 2,
												type: 'solid',
												color: '#eee',

											},
										},
										itemStyle: {
											borderColor: '#fff',
											borderWidth: 1
										},
										emphasis: {
											label: {
												fontSize: 20
											}
										},
										data: this.salesFunnel

									},
									{
										color: ['#4765FF', '#0089FF', '#63D0FF', '#10BE83',
											'#87D98F', '#C2F09E', '#FFCE1F', '#FCA600',
											'#FB8832', '#FB5632'
										],

										// color: ['#FB5632', '#FB8832', '#FCA600', '#FFCE1F',
										// 	'#C2F09E', '#87D98F', '#10BE83', '#63D0FF',
										// 	'#0089FF', '#4765FF'
										// ],
										name: 'Funnel',
										type: 'funnel',
										left: '-5%',
										top: 10,
										bottom: 60,
										width: '85%',
										min: 0,
										max: 100,
										minSize: '0%',
										maxSize: '100%',
										sort: 'descending',
										gap: 2,
										legendHoverLink: true,
										label: {
											show: true,
											position: 'inside',
											color: '#303133',
											fontSize: '8px',
											verticalAlign: 'middle',
											align: 'center',
										},
										labelLine: {
											length: 12,
											lineStyle: {
												width: 2,
												type: 'solid',
												color: '#eee',

											},
										},
										itemStyle: {
											borderColor: '#fff',
											borderWidth: 1
										},
										emphasis: {
											label: {
												fontSize: 20
											}
										},
										data: this.salesFunnel1

									}
								]
							}

						}).then(() => {
							console.log('then2:', res);


						})
						// console.log(this.salesFunnel);

					} else {
						uni.$u.toast(res.message);
					}
				})
			},


			getTableList() {
				let {
					startTime,
					endTime,
					chargeMan,
					deptIds,
					statusId
				} = this.selectInfo;
				console.log('触发筛选:', startTime, endTime, chargeMan)
				let params = {
					beginTime: startTime,
					endTime: endTime,
					userIds: chargeMan,
					deptIds: deptIds,
					statusId: statusId
				}
				!startTime && delete params['beginTime'];
				!endTime && delete params['endTime'];
				!chargeMan && delete params['userIds'];
				!deptIds && delete params['deptIds'];
				!statusId && delete params['statusId'];
				getFunnelAnalysis(changeParam(params), res => {
					if (res.code == 200 && res.success) {
						console.log('getFunnelAnalysis-res:', res)
						this.tableList = res.result.map(i => {
							let {
								conversionRate,
								probabilityAmount
							} = i;
							return {
								...i,
								conversionRate: conversionRate ? conversionRate.toFixed(2) : 0,
								probabilityAmount: probabilityAmount ? probabilityAmount.toFixed(2) : 0
							}
						});
						let l = this.tableList[this.tableList.length - 1];
						this.total = l.total;
						this.expectSaleAmount = l.expectSaleAmount;
						this.amount = l.probabilityAmount;
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			// getList(){
			// 	this.isLoading=false;
			// 	let data="?pageNo="+this.pageNo//页码
			// 	+"&pageSize="+"5"//页码大小
			// 	+"&userIds="+this.selectInfo.chargeMan//人员
			// 	+"&beginTime="+this.selectInfo.startTime//开始时间
			// 	+"&endTime="+this.selectInfo.endTime//结束时间
			// 	;
			// 	getFunnelReportForm(data,res=>{
			// 		if(res.code==200 && res.success){
			// 			if(this.pageNo==1){
			// 				this.tableList=res.result.records;
			// 			}else{
			// 				this.tableList=this.tableList.concat(res.result.records)
			// 			}
			// 			this.maxPage=res.result.pages
			// 			if(this.pageNo >= this.maxPage) this.status = 'nomore';
			// 			else this.status = 'loading';						
			// 		}else{
			// 			uni.$u.toast(res.message);
			// 		}
			// 		this.isLoading=true;
			// 	})
			// },
			//人员
			getUserList() {
				let data = "?realname=" + "" +
				+"&pageNo=" + "1" +
					"&pageSize=" + "5";
				getUserListByName(data, res => {
					if (res.code == 200 && res.success) {
						let data = [];
						for (let j = 0; j < res.result.records.length; j++) {
							data.push({
								name: res.result.records[j].realname,
								value: res.result.records[j].id,
								id: res.result.records[j].id
							})
						}
						for (let i = 0; i < this.lstScreen.length; i++) {
							if (this.lstScreen[i].title == "人员") {
								this.lstScreen[i].lst = data;
								this.lstScreen[i].total = res.result.total;
							}
						}
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			clickScreen() {
				if (!this.firstTime) {
					this.firstTime = true;
					uni.setStorageSync('_lstScreen', this.lstScreen) //1*60*60*24*7
					uni.setStorageSync('OldLstScreen', this.lstScreen) //1*60*60*24*7

				}
				uni.navigateTo({
					url: "/pages/filter-all/supplierSelect"
				});
			},
		}
	}
</script>

<style lang="scss">
	.color-b {
		color: #0072FF;
	}

	.container {
		// min-height: 700px;
		padding-top: 90px !important;
		padding-left: 16px;
		padding-right: 16px;
		padding-bottom: 16px;
		background: #F5F7FA;

		.funnel {
			height: 256px;
			padding: 16px;
			background: #fff;
			margin-bottom: 16px;
		}

		.selectDepart {
			width: 258px;
			height: 35px;
			line-height: 35px;
			text-align: center;
			background: #F7F9FC;
			border-radius: 32px 32px 32px 32px;
			opacity: 1;
			margin: 0 auto;
			color: #909399;
			font-size: 12px;
		}

		.bottom-action {
			width: 290px;
			box-sizing: border-box;
			border-top: 1px solid #F7F9FC;
			padding: 12px;
			position: fixed;
			right: 0;
			bottom: 0;
		}
	}

	.sales_detail {
		display: flex;

		.sales_title {
			width: 100%;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 9px 13px;
			font-size: 15px;
			color: #303133;
			background-color: #EAF2F9;
			box-shadow: 0px 0px 0px 0.8px rgba(198, 202, 208, 0.2500);
		}

		.sales_list {
			background: #fff;
			color: #606266;

			.list {
				box-sizing: border-box;
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #606266;
				border-bottom: 1px solid rgba(198, 202, 208, 0.5000);

				.t-item {
					box-sizing: border-box;
					width: 86px;
					height: 37px;
					font-size: 14px;
					line-height: 37px;
					text-align: center;
					background: #FFFFFF;
				}
			}

			.list:last-child {
				border: none;
			}
		}

		.leftFix {
			display: inline-block;
			width: 170px;
			box-shadow: 5px 0 10px -5px rgba(198, 202, 208, 0.5000);
			position: relative;
			z-index: 10;
		}

		.rightScroll {
			display: inline-block;
			flex: 1;
			overflow-y: hidden;

			.content {
				width: 340px;
			}
		}
	}

	/deep/ {
		.total {
			padding: 15px;
			background: #fff;
			border-radius: 8px 8px 0 0;
		}

		.u-grid {
			padding-top: 0px;
		}

		.grid-text {
			font-size: 12px;
			font-weight: bold;
			color: #606266;
			padding: 5rpx 0 5rpx 0rpx;
			/* #ifndef APP-PLUS */
			box-sizing: border-box;
			/* #endif */
		}

		.grid-title {
			font-weight: normal;
			color: #909399;
		}
	}

	/deep/ {
		.u-line {
			display: none !important;
		}

		.u-cell__title {
			color: #303133;
			font-size: 17px;
			font-weight: bold;
		}

		.t-item {
			width: 80px;
			height: 35px;
			line-height: 35px;
			text-align: center;
			background: #F7F9FC;
			border-radius: 42px 42px 42px 42px;
			opacity: 1;
		}

		.u-cell__body {
			padding-left: 0px !important;
		}

		.p-item {
			margin-bottom: 8px;
		}

		.btn {
			width: 118px;
			height: 40px;
			border-radius: 32px 32px 32px 32px;
			opacity: 1;
		}

		.reset {
			background: #F1F3F6;
			color: #606266;
		}
	
	.min-cost {
			margin-right: 3px;
		}

		.max-cost {
			margin-left: 3px;
		}

		.min-cost,
		.max-cost {
			display: inline-block;
			width: 118px;
			height: 35px;
			line-height: 35px;
			text-align: center;
			background-color: #F7F9FC;
			border-radius: 32px 32px 32px 32px;
			color: #909399;
			font-size: 12px;

			.u-number-box__input {
				width: 100%;
				border-radius: 24px;
				height: 35px !important;
				background-color: rgba(247, 249, 252, 1);
			}
		}
	
	.min-max-middle {
			margin-left: 3px;
		}
	}

	.funnel_img {
		display: flex;
		flex-direction: column;
		align-items: center;
		// justify-content: center;
		padding-right: 82px;
		font-size: 14px;

		.detail {
			position: relative;
			display: flex;
			padding-right: 2px;

			.percent {
				position: absolute;
				top: 16%;
				right: 0;
				padding-right: 45%;
				color: #fff;
			}

			.info {
				position: absolute;
				right: -35%;
				top: 30%;
				// overflow: hidden;

				.short_border {
					margin-right: 5px;
					color: #DCDFE6;
				}

				.status {
					color: #303133;
					font-size: 12px;
					padding-right: 3px;
				}

				// &::before {
				// 	content: '–';
				// 	color: #DCDFE6;
				// 	padding-right: 25px;
				// 	// width: 10px;
				// 	// height: 8px;
				// 	// border: 1px solid #DCDFE6;
				// }
			}

			image {
				padding-bottom: 2px;
			}
		}

	}

	.funnelcharts_box {
		display: flex;
		// justify-content: center;
		// align-items: center;
		// width: 100%;
	}
</style>
