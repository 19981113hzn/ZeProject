<template>
	<view class="viewimg">
		<view>
			<view>echarts示列</view>
			<echarts :option="option" style="height: 300px;"></echarts>
			<button @click="updateClick">更新数据</button>

		</view>

	</view>
</template>

<script>
	import echarts from '@/components/echarts/echarts.vue';
	// import mpEchart from "@/components/mpvue-echarts/echarts.vue"
	export default {
		data() {
			return {
				title: '目标商机',
				option: {
					title: {
						text: 'Funnel'
					},
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							console.log(params);
							return `
							${params.data.name}
							${params.data.value}%
							`
						}
					},
					toolbox: {
						feature: {
							dataView: {
								readOnly: false
							},
							restore: {},
							saveAsImage: {}
						}
					},
					// legend: {
					// 	data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
					// },
					series: [{
						name: 'Funnel',
						type: 'funnel',
						left: '10%',
						top: 60,
						bottom: 60,
						width: '80%',
						min: 0,
						max: 100,
						minSize: '0%',
						maxSize: '100%',
						sort: 'descending',
						gap: 2,
						label: {
							show: true,
							position: 'outside'
						},
						labelLine: {
							length: 20,
							lineStyle: {
								width: 2,
								type: 'solid',
							}
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
						data: [{
								value: 60,
								name: 'Visit'
							},
							{
								value: 40,
								name: 'Inquiry'
							},
							{
								value: 20,
								name: 'Order'
							},
							{
								value: 80,
								name: 'Click'
							},
							{
								value: 100,
								name: 'Show'
							}
						]
					}]
				},
			};
		},
		onLoad() {
			console.log(777777);
		},
		components: {
			echarts,
			// mpEchart
		},
		mounted() {
			// this.logstatrt();
		},
		methods: {
			logstatrt() {
				console.log('初次调用');
				this.option = {
					backgroundColor: '#011246',
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						top: '25%',
						right: '45',
						bottom: '20',
						left: '30'
					},
					legend: {
						data: [{
							name: '人保'
						}, {
							name: '太保'
						}, {
							name: '平安'
						}, {
							name: '人保增速'
						}, {
							name: '太保增速'
						}, {
							name: '平安增速'
						}],
						top: '0%',
						textStyle: {
							color: 'rgba(255,255,255,0.9)' //图例文字
						}
					},
					dataZoom: [{
						type: 'slider',
						realtime: true,
						//移动端展示方式
						handleSize: '100%', //滑动条两侧的大小
						start: 0,
						end: 50
					}],
					grid: {
						left: '3%',
						right: '4%',
						bottom: '15%',
						height: '70%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: ['2015', '2016', '2017', '2018', '2019'],
						axisLine: {
							lineStyle: {
								color: 'rgba(255,255,255,.1)'
							}
						},
						axisLabel: {
							textStyle: {
								color: 'rgba(255,255,255,.7)',
								fontSize: '14'
							}
						}
					}],
					yAxis: [{
							type: 'value',
							name: '单位万',
							splitLine: {
								show: false
							},
							axisLabel: {
								show: true,
								fontSize: 14,
								color: 'rgba(255,255,255,.6)'
							},
							axisLine: {
								min: 0,
								max: 10,
								lineStyle: {
									color: 'rgba(255,255,255,.4)'
								}
							} //左线色
						},
						{
							type: 'value',
							name: '增速',
							show: true,
							axisLabel: {
								show: true,
								fontSize: 14,
								formatter: '{value} %',
								color: 'rgba(255,255,255,.6)'
							},
							axisLine: {
								lineStyle: {
									color: 'rgba(255,255,255,.4)'
								}
							}, //右线色
							splitLine: {
								show: true,
								lineStyle: {
									color: 'rgba(255,255,255,.1)'
								}
							} //x轴线
						}
					],
					series: [{
							name: '人保',
							type: 'bar',
							data: [35, 36.6, 38.8, 40.84, 41.6],
							// "barWidth": "30",
							itemStyle: {
								normal: {
									color: {
										type: 'linear',
										x: 0.5,
										y: 0.5,
										r: 0.5,
										colorStops: [{
												offset: 0,
												color: '#00FFE3' // 0% 处的颜色
											},
											{
												offset: 1,
												color: '#4693EC' // 100% 处的颜色
											}
										],
										globalCoord: false // 缺省为 false
									}
								}
							}
							// "barGap": "0.2"
						},
						{
							name: '太保',
							type: 'bar',
							data: [16, 14.8, 14.1, 15, 16.3],

							color: {
								type: 'linear',
								x: 0.5,
								y: 0.5,
								r: 0.5,
								colorStops: [{
										offset: 0,
										color: '#248ff7' // 0% 处的颜色
									},
									{
										offset: 1,
										color: '#6851f1' // 100% 处的颜色
									}
								],
								globalCoord: false // 缺省为 false
							}
						},
						{
							name: '平安',
							type: 'bar',
							data: [10.2, 9.2, 9.1, 9.85, 8.9],
							color: {
								type: 'linear',
								x: 0.5,
								y: 0.5,
								r: 0.5,
								colorStops: [{
										offset: 0,
										color: '#fccb05' // 0% 处的颜色
									},
									{
										offset: 1,
										color: '#f5804d' // 100% 处的颜色
									}
								],
								globalCoord: false // 缺省为 false
							}
						},
						{
							name: '人保增速',
							type: 'line',
							yAxisIndex: 1,

							data: [0, 6.01, 5.26, 1.48],
							lineStyle: {
								normal: {
									width: 2
								}
							},
							itemStyle: {
								normal: {
									color: '#86d370'
								}
							},
							smooth: true
						},
						{
							name: '太保增速',
							type: 'line',
							yAxisIndex: 1,

							data: [0, -4.73, 6.38, 8.67],
							lineStyle: {
								normal: {
									width: 2
								}
							},
							itemStyle: {
								normal: {
									color: '#3496f8'
								}
							},
							smooth: true
						},
						{
							name: '平安增速',
							type: 'line',
							yAxisIndex: 1,

							data: [0, -1.09, 8.24, -9.64],
							lineStyle: {
								normal: {
									width: 2
								}
							},
							itemStyle: {
								normal: {
									color: '#fbc30d'
								}
							},
							smooth: true
						}
					]
				};
			},


			/**
			 * 更新数据
			 */
			// updateClick() {
			// 	this.option = {
			// 		notMerge: true, // 自定义变量：true代表不合并数据，比如从折线图变为柱形图则需设置为true；false或不写代表合并
			// 		xAxis: {
			// 			type: 'category',
			// 			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			// 		},
			// 		yAxis: {
			// 			type: 'value'
			// 		},
			// 		series: [{
			// 			data: [120, 200, 150, 80, 70, 110, 130],
			// 			type: 'bar',
			// 			showBackground: true,
			// 			backgroundStyle: {
			// 				color: 'rgba(220, 220, 220, 0.8)'
			// 			}
			// 		}]
			// 	};
			// }
		}
	};
</script>
<style>
	.viewimg {
		height: 100%;
		/* background: #d1e9e9; */
	}
</style>
