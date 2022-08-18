<template>
	<view>
		<!-- <view class="page-title">欢迎你,李世民</view> -->
		<u-navbar leftIcon="" :leftText="'欢迎您, '+ userName" class="navbar" bgColor="#fff"></u-navbar>
		<view class="container">
			<!-- 部门销售计划 -->
			<view class="container-chart">
				<view style="font-size: 12px;">部门目标计划</view>
				<view class="charts">
					<view class="charts-box chart-left">
						<qiun-data-charts type="arcbar" :opts="opts1" :chartData="chartYearData" />
						<text style="padding-top: 10px;">年度计划完成率</text>
					</view>
					<view class="shuxian">

					</view>
					<view class="charts-box chart-right">
						<qiun-data-charts type="arcbar" :opts="opts2" :chartData="chartMonthData" />
						<text style="padding-top: 10px;">月度计划完成率</text>
					</view>
				</view>
			</view>
			<!-- 销售漏斗分析 -->
			<view class="container-sales">
				<view class="sales_funnel">
					<u-cell-group :border="false">
						<u-cell title="销售漏斗分析" isLink url="/pages/home/detail"></u-cell>
					</u-cell-group>
					<!-- <view class="funnelcharts_box">
						<qiun-data-charts type="funnel" :opts="funnelopts" :chartData="chartFunnelData" />
					</view> -->
					<view>
						<echarts :option="option" style="height: 300px;"></echarts>
					</view>
				</view>
				<view style="display: flex;align-items: center;">
					<view
						style="width: 10px;height: 10px;border-radius: 50%;background-color: #fff;margin-right: 10px;">
					</view>
					<!-- <view>
						<view>${params.data.name}:<text style="color: black;">${params.data.total}</text></view>
						<view>占比:<text style="color: aqua;">${params.data.value}%</text></view>
					</view> -->
				</view>

			</view>
			<!-- 销售预测 -->
			<view class="sales_forecasting">
				<u-cell-group :border="false">
					<u-cell title="销售预测" isLink url="/pages/home/detail"></u-cell>
				</u-cell-group>
				<view class="sales_detail">
					<view class="sales_title">
						<view>时间</view>
						<view>商机数量</view>
						<view>预计销售金额</view>
					</view>
					<view class="sales_list" v-for="(item,index) in funnelForcast" :key="item.date">
						<view class="list">
							<text>{{item.date}}</text>
							<text>{{item.total}}</text>
							<text>¥ {{item.expectSaleAmount}}</text>
						</view>
					</view>

				</view>
			</view>
		</view>

		<!-- 添加按钮 -->
		<view class="add_button">
			<image src="../../static/img/index_add.png" mode=""></image>
		</view>
		<!-- <movable-area class="movableArea" :style="{'top':+ statusBarHeight + 'px'}">
			<movable-view class="movableView" direction="all" x="620rpx" y="1100rpx">
				
				<u-icon name="plus" color="#fff" size="24"></u-icon>
			</movable-view>
		</movable-area> -->


		<!-- 年 -->
		<!-- <u-picker :show="showYear" :columns="columnsYear" :defaultIndex="[10]" closeOnClickOverlay
			@close="showYear=false" @cancel="showYear=false" @confirm="confirmYear"></u-picker> -->
		<!-- 月 日 -->
		<!-- <u-datetime-picker :show="showDateTime" v-model="datetime" :mode="mode" :minDate="minDate" :maxDate="maxDate"
			closeOnClickOverlay @close="showDateTime=false" @cancel="showDateTime=false" @confirm="confirmDateTime">
		</u-datetime-picker> -->
	</view>
</template>

<script>
	import qiunDataCharts from "../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts"
	import echarts from '@/components/echarts/echarts.vue';
	import {
		js_date_time
	} from "@/util/js_DateTime.js"
	import {
		getUserInfoByToken,
		getFunnelAnalysis,
		getFunnelForcast
	} from "@/util/interface.js"
	export default {
		components: {
			qiunDataCharts,
			echarts
		},
		data() {
			return {
				userName: '',
				statusBarHeight: getApp().globalData.statusBarHeight + 45, //状态栏高度
				chartYearData: {},
				chartMonthData: {},
				chartFunnelData: [],
				seen: false,
				pageNo: 1,
				pageSize: '',
				salesFunnel: [],
				salesFunnel1: [],
				opts1: {
					padding: undefined,
					title: {
						name: "80%",
						fontSize: 14,
						color: "#000"
					},
					subtitle: {
						name: "",
						fontSize: 13,
						color: "#666666"
					},
					extra: {
						arcbar: {
							type: "circle",
							width: 8,
							backgroundColor: "#E9E9E9",
							startAngle: 1.5,
							endAngle: 0.25,
							gap: 2
						}
					}
				},
				opts2: {
					padding: undefined,
					title: {
						name: "80%",
						fontSize: 14,
						color: "#000"
					},
					subtitle: {
						name: "",
						fontSize: 13,
						color: "#666666"
					},
					extra: {
						arcbar: {
							type: "circle",
							width: 8,
							backgroundColor: "#E9E9E9",
							startAngle: 1.5,
							endAngle: 0.25,
							gap: 2
						}
					}
				},
				option: {},
				titleType: 0,
				nameF: "",
				mode: "year-month",
				minDate: "",
				maxDate: "",
				showDateTime: false,
				datetime: js_date_time(new Date()),
				showYear: false,
				columnsYear: [],
				value: 30,
				index: '',
				funnelForcast: []
			}
		},

		created() {
			console.log(window);
			this.getUserByToken();
			this.getTimeMaxMin();
			this.getYearData();
			this.getServerData()
			this.getFunnelDetail()
			this.getOptions()
			this.getFunnelForcastList()
			this.userName = getApp().globalData.userInfo.realname
		},
		methods: {
			showDetail(e) {
				// console.log(e);
				console.log(e.currentTarget.dataset.value);
			},
			getOptions() {
				console.log('onLoad: 111');
			},

			// 销售漏斗分析数据
			getFunnelDetail() {
				getFunnelAnalysis("", res => {
					if (res.code == 200 && res.success) {
						console.log(res.result);
						res.result.pop();
						// res.result.length = 6
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
								// color: [],
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
											borderWidth: 1,
											normal: {

											}
										},
										emphasis: {
											label: {
												fontSize: 20,
											},
											itemStyle: {
												color: 'inherit'
											}
										},
										zlevel: 1,
										z: 2,
										data: this.salesFunnel

									},
									{
										// color: [],
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
											borderWidth: 1,
											normal: {
												// color: []
												// color: function(params) {
												// 	console.log('99999', params)
												// 	let colorObj = ''
												// 	if (params.data.saleStatus ===
												// 		'目标客户') {
												// 		console.log('*****', params.data
												// 			.saleStatus);
												// 		colorObj = '#4765FF'
												// 		// colorList.push(colorObj)
												// 	} else if (params.data.saleStatus ===
												// 		'需求挖掘') {
												// 		colorObj = '#0089FF'
												// 		// colorList.push(colorObj)
												// 	} else if (params.data.saleStatus ===
												// 		'需求明确') {
												// 		colorObj = '#63D0FF'
												// 		// colorList.push(colorObj)
												// 	} else if (params.data.saleStatus ===
												// 		'方案交流') {
												// 		colorObj = '#10BE83'
												// 		// colorList.push(colorObj)
												// 	} else if (params.data.saleStatus ===
												// 		'商务谈判') {
												// 		colorObj = '#87D98F'
												// 		// colorList.push(colorObj)
												// 	} else if (params.data.saleStatus ===
												// 		'合同签订') {
												// 		colorObj = '#C2F09E'
												// 		// colorList.push(colorObj)
												// 	} else {
												// 		colorObj = '#FFCE1F'
												// 		// colorList.push(colorObj)
												// 	}
												// 	// let colorList = [
												// 	//     // 每根颜色顺序
												// 	//     "#FB5632",
												// 	// 	"#FB8832",
												// 	// 	"#FCA600",
												// 	// 	"#FFCE1F",
												// 	// 	"#C2F09E",
												// 	// 	"#87D98F",
												// 	// 	"#10BE83",
												// 	// 	"#63D0FF",
												// 	// 	"#0089FF",
												// 	// 	"#4765FF",
												// 	//     ];
												// 	// return colorList[params.dataIndex];
												// 	return colorObj
												// }
												// color: (params) => {
												// 	console.log(params)
												// 	let colorObj = ''
												// 	if (params.data.saleStatus === '目标客户') {
												// 		colorObj = '#4765FF'
												// 		// colorList.push(colorObj)
												// 	} else if (params.data.saleStatus ===
												// 		'需求挖掘') {
												// 		colorObj = '#0089FF'
												// 		// colorList.push(colorObj)
												// 	} else if (params.data.saleStatus ===
												// 		'需求明确') {
												// 		colorObj = '#63D0FF'
												// 		// colorList.push(colorObj)
												// 	} else if (params.data.saleStatus ===
												// 		'方案交流') {
												// 		colorObj = '#10BE83'
												// 		// colorList.push(colorObj)
												// 	} else if (params.data.saleStatus ===
												// 		'商务谈判') {
												// 		colorObj = '#87D98F'
												// 		// colorList.push(colorObj)
												// 	} else if (params.data.saleStatus ===
												// 		'合同签订') {
												// 		colorObj = '#C2F09E'
												// 		// colorList.push(colorObj)
												// 	} else {
												// 		colorObj = '#FFCE1F'
												// 		// colorList.push(colorObj)
												// 	}
												// },
											}
										},
										emphasis: {
											label: {
												fontSize: 20
											}
										},
										zlevel: 2,
										z: 1,
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
			// 销售预测
			getFunnelForcastList() {
				// let data = `?pageNo=${this.pageNo}&pageSize=10`
				getFunnelForcast("", res => {
					console.log(res);
					this.funnelForcast = res.result
				})
			},
			getUserByToken() {
				getUserInfoByToken("", res => {
					console.log(res)
					if (res.code == 200 && res.success) {
						// this.src=res.result;
						// this.captchaInfo.checkKey=checkKey
					} else {
						uni.$u.toast(res.message);
					}

				})
			},
			change1(name) {
				this.tabbarNum = name
			},
			getYearData() {
				let date = new Date()
				let year = date.getFullYear();
				let arr = [];
				for (let i = 10; i > -1; i--) {
					arr.push(year - i)
				}
				this.columnsYear.push(arr)
				this.nameF = year + "年"
			},
			getTimeMaxMin() {
				let date = new Date()
				let year = date.getFullYear();
				let dateNum = 0
				if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
					dateNum = 366
				} else {
					dateNum = 365
				}
				this.minDate = Date.parse(new Date(date.setDate(date.getDate() - 10 * dateNum)));
				this.maxDate = Date.parse(new Date())
				this.nameF = year + "年"
			},
			getServerData() {
				let yearRes = {
					series: [{
						name: "年度完成率",
						color: "#5B8FF9",
						data: 0.4
					}]
				};
				let monthRes = {
					series: [{
						name: "月度完成率",
						color: "#10BE83",
						data: 0.4
					}]
				};
				let data1 = JSON.parse(JSON.stringify(yearRes));
				let data2 = JSON.parse(JSON.stringify(monthRes));
				let num1 = data1.series[0].data;
				let num2 = data2.series[0].data;
				this.opts1.title.name = num1 * 100 + "%"
				this.opts2.title.name = num2 * 100 + "%"
				this.chartYearData = data1;
				this.chartMonthData = data2;
			},
			clickcellF() {
				if (this.titleType == 0) {
					this.showYear = true;
				}
				if (this.titleType == 1 || this.titleType == 2) {
					this.showDateTime = true;
				}

			},
			clickTabsF(item) {
				this.titleType = item.index
				//年
				if (item.index == 0) {
					this.showYear = true
				}
				//月
				if (item.index == 1) {
					this.showDateTime = true
					this.mode = "year-month"
				}
				//日
				if (item.index == 2) {
					this.showDateTime = true
					this.mode = "date"
				}
			},
			confirmDateTime(e) {
				const timeFormat = uni.$u.timeFormat;
				this.nameF = this.titleType == 1 ? timeFormat(e.value, 'yyyy-mm') : timeFormat(e.value,
					'yyyy-mm-dd');
				//this.$set(this.itemInfo, "datetime",datetime);
				this.showDateTime = false;
				//console.log(e)
			},
			confirmYear(e) {
				console.log(e)
				this.nameF = e.value + "年";
				this.showYear = false;
			},
			clickTabsT() {

			},
			gotoDetail() {
				uni.navigateTo({
					url: "/pages/home/detail"
				})
			},


		}
	}
</script>

<style scoped lang="scss">
	.container-view {
		z-index: 1;
		padding: 0 16px;
	}


	.container {
		// height: 100%;
		// margin-top: 20px;
		padding: 60px 16px 0 16px;
		background-color: #F5F7FA;

		.container-chart {
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #fff;
			border-radius: 8px;
			padding-top: 14px;

			.charts {
				// height: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 11px;
				padding-bottom: 45px;
				font-size: 12px;

				.shuxian {
					width: 2px;
					height: 65px;
					background: rgba(0, 0, 0, 0.1000);
					border-radius: 0px 0px 0px 0px;
					opacity: 1;
					margin: 0 35px;
				}

				.charts-box {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 100px;
					height: 100px;
				}
			}
		}

		.container-sales {
			margin-top: 20px;
			background-color: #fff;
			border-radius: 8px;
			// padding-bottom: 20px;

			.sales_funnel {
				width: 100%;
				height: 100%;
				// padding-bottom: 15px;

				.funnelcharts_box {

					width: 100%;

					/deep/.chartview {
						padding-right: 15px;
					}

					/deep/uni-canvas {
						// width: 300px !important;
						// height: 360px !important;
						// padding-right: 100px !important;
						right: 10% !important;

						// width: 100% !important;
						// background-color: #000 !important;
					}

				}
			}



		}

		.sales_forecasting {
			margin-top: 20px;
			margin-bottom: 75px;
			background-color: #fff;
			border-radius: 8px;
			// padding-bottom: 15px;

			.sales_detail {
				display: flex;
				flex-direction: column;
				justify-content: center;
				text-align: center;

				.sales_title {
					padding: 9px 0;
					padding-right: 12px;
					display: flex;
					font-size: 15px;
					color: #303133;
					background-color: #EAF2F9;
					box-shadow: 0px 0px 0px 0.8px rgba(198, 202, 208, 0.2500);

					view {
						flex: 1;
					}
				}

				.sales_list {
					color: #606266;
					padding: 13px 5px;
					padding-right: 12px;
					font-size: 14px;
					box-shadow: 0px 0px 0px 0.8px rgba(198, 202, 208, 0.2500);

					.list {
						display: flex;

						text {
							flex: 1;
						}
					}
				}
			}
		}


	}


	.add_button {
		position: fixed;
		right: 8%;
		bottom: 8%;

		image {
			width: 48px;
			height: 48px;
		}
	}

	/deep/.u-line {
		border-bottom: none !important;

	}
</style>
