<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar leftIcon="" title="全部筛选" rightIcon="setting" bgColor="#fff" @rightClick="rightClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/icon_close.png"></image>
			</view>
		</u-navbar>
		<view class="screen-body">
			<u--form labelPosition="left" ref="form1" labelWidth="100">
				<view v-for="(item,index) in lstScreen" :key="index">
					<u-form-item :label="item.title" ref="item1"></u-form-item>
					<view>
						<view v-if="item.type==1">
							<view class="filter-content" v-for="(item1,index1) in item.lst" :key="index1">
								<view style="padding: 0 5px;">
									<text v-if='!ischange' class='filter-content-detail-item-default' :style="{'background-color':item1.isSelected?'rgba(0, 114, 255, 0.05)':'rgba(247, 249, 252, 1)',
									'color':item1.isSelected?'rgba(0, 114, 255, 1)':'rgba(48, 49, 51, 1)',
									'border-color':item1.isSelected?'rgb(0, 114, 255)':'none',
									'border': item1.isSelected?'1px solid':'none'}" @click="selectItem(index,index1)">
										{{item1.name.length>6?(item1.name.substring(0,3)+"...") : item1.name}}
									</text>
								</view>
							</view>
							<view v-if="item.isMore" class="filter-content">
								<view style="padding: 0 5px;">
									<text class='filter-content-detail-item-default' :style="{'background-color':item.isJump?'rgba(0, 114, 255, 0.05)':'rgba(247, 249, 252, 1)',
										'color':item.isJump?'rgba(0, 114, 255, 1)':'rgba(48, 49, 51, 1)',
										'border-color':item.isJump?'rgb(0, 114, 255)':'none',
										'border': item.isJump?'1px solid':'none'}" @click="seeMore(index)">
										{{item.isJump?'已选'+lstSelectUser.length+'人>':item.moreTitle}}
									</text>
								</view>
							</view>
						</view>
						<view v-if="item.type==2">
							<view class="min-cost">
								<text class='filter-content-detail-item-default' :style="{'background-color': 'rgba(247, 249, 252, 1)',
								'color': item.startTime==''?'rgba(192, 196, 204, 1)':'rgba(48, 49, 51, 1)',}"
									@click="clickStart(index)">{{item.startTime==''?'开始时间':item.startTime}}</text>
							</view>
							<text class="min-max-middle">-</text>
							<view class="max-cost">
								<text class='filter-content-detail-item-default' :style="{'background-color': 'rgba(247, 249, 252, 1)',
								'color': item.endTime==''?'rgba(192, 196, 204, 1)':'rgba(48, 49, 51, 1)',}"
									@click="clickEnd(index)">{{item.endTime==''?'结束时间':item.endTime}}</text>
							</view>
						</view>
						<view v-if="item.type==3">
							<view class="min-cost">
								<u--input placeholder="最低金额" id="digit" type="digit" clearable shape="circle"
									customStyle="background-color: rgba(247, 249, 252, 1);" border="none"
									v-model="item.minCost" @change="costChange(item.minCost,index)"></u--input>
								<!-- <u-number-box :showMinus="false" :showPlus="false" :min="0"
								 v-model="item.minCost"
								 :asyncChange="true"
								 placeholder="最低金额"
								 @change="costChange($event,index)"
								 inputWidth="100%" bgColor="rgba(247, 249, 252, 1)"
								 ></u-number-box> -->
							</view>
							<text class="min-max-middle">-</text>
							<view class="max-cost">
								<u--input placeholder="最高金额" type="digit" clearable shape="circle"
									customStyle="background-color: rgba(247, 249, 252, 1);" border="none"
									v-model="item.maxCost" @input="costMaxChange(item.maxCost,index)"></u--input>
							</view>
						</view>
						<view v-if="item.type==4">
							<view>
								<text class='filter-content-detail-item-default' :style="{'background-color': 'rgba(247, 249, 252, 1)',
								'color': item.year==''?'rgba(192, 196, 204, 1)':'rgba(48, 49, 51, 1)',}"
									@click="showYear=true;indexNum=index">{{item.year==''?'选择目标财年':item.year}}</text>
							</view>
						</view>
					</view>

				</view>

			</u--form>
		</view>
		<u-tabbar>
			<u-tabbar-item class="tab-reset" text="重置" @click="clickReset">
				<text></text>
			</u-tabbar-item>
			<u-tabbar-item class="tab-confirm" text="确认" @click="clickConfirm"></u-tabbar-item>
		</u-tabbar>
		<u-datetime-picker :show="showDatePicker" v-model="datetime" mode="date" :minDate="minDate" :maxDate="maxDate"
			closeOnClickOverlay @close="showDatePicker=false" @cancel="showDatePicker=false" @confirm="confirmDatetime">
		</u-datetime-picker>
		<u-datetime-picker :show="showEndTime" v-model="dateEndtime" mode="date" :minDate="minDate" :maxDate="maxDate"
			closeOnClickOverlay @close="showEndTime=false" @cancel="showEndTime=false" @confirm="confirmDatetime">
		</u-datetime-picker>
		<u-picker :show="showYear" :columns="columnsYear" closeOnClickOverlay title="选择年份"
			@close="showYear=false" @cancel="showYear=false" @confirm="confirmYear"></u-picker>
	</view>
</template>

<script>
	import {
		GetNowFormatDate
	} from "@/util/js_DateTime.js";
	import {
		getUserListByUserId,
		getDepartListByName
	} from "@/util/interface.js"
	import {
		isEmpty
	} from "@/util/common.js"
	export default {
		data() {
			return {
				type: 0, //1费用管理  2报销管理 3我的待办 4客户管理
				statusBarHeight: getApp().globalData.statusBarHeight + 48, //状态栏高度
				lstScreen: [],
				showDatePicker: false,
				datetime: GetNowFormatDate("yyyy-MM-dd"),
				maxDate: "",
				minDate: "",
				isStartTime: false,
				dateEndtime: GetNowFormatDate("yyyy-MM-dd"),
				showEndTime: false,
				ischange: false,
				indexNum: 0,
				minCost: "",
				showKeyboard: false,
				lstSelectUser: [],
				showYear:false,
				columnsYear:[],
			}
		},
		onLoad(option) {
			let type = isEmpty(option.type) ? false : option.type;
			this.type = type;
			//this.lstScreen=this.$cache.get('_lstScreen');
			this.getData();
		},
		onUnload() {
			uni.$emit('result', this.lstScreen);
		},
		onShow() {
			uni.$once('resultSelectUser', res => {
				uni.$emit('resultSelectUser', false);
				if (res) {
					let lstScreen = uni.getStorageSync("_lstScreen")
					let index = uni.getStorageSync('indexSelectUser') //1*60*60*24*7
					let lstSelectUser = uni.getStorageSync("lstSelectUser")
					let defaultSelectedIndex = [];
					let lst = [];
					if (lstSelectUser.length > 4) {
						for (let i = 0; i < lstSelectUser.length; i++) {
							if (i < 5) {
								lst.push(lstSelectUser[i])
							}
							if (lstSelectUser[i].isSelected) {
								defaultSelectedIndex.push(lstSelectUser[i].value)
							}
						}
						lstScreen[index].lst = lst;
						lstScreen[index].isJump = true;
						lstScreen[index].defaultSelectedIndex = defaultSelectedIndex
					} else {
						for (let i = 0; i < lstSelectUser.length; i++) {
							lst.push(lstSelectUser[i])
							if (lstSelectUser[i].isSelected) {
								defaultSelectedIndex.push(lstSelectUser[i].value)
							}
							for (let j = 0; j < lstScreen[index].lst.length; j++) {
								if (lstSelectUser[i].value == lstScreen[index].lst[j].value) {
									lstScreen[index].lst.splice(j, 1);
								}
							}
						}
						let num = 5 - lstSelectUser.length;
						for (let j = 0; j < num; j++) {
							lst.push(lstScreen[index].lst[j])
						}
						lstScreen[index].lst = lst;
						lstScreen[index].defaultSelectedIndex = defaultSelectedIndex
					}
					this.lstSelectUser = lstSelectUser;
					uni.setStorageSync('_lstScreen', lstScreen) //1*60*60*24*7
					this.getData();
				}
			})
		},
		methods: {
			getData() {
				let lstScreen = uni.getStorageSync("_lstScreen")
				for (let i = 0; i < lstScreen.length; i++) {
					if (lstScreen[i].type == 1) {
						let defaultSelectedIndex = lstScreen[i].defaultSelectedIndex;
						if (lstScreen[i].isMutiple) {
							for (let j = 0; j < lstScreen[i].lst.length; j++) {
								lstScreen[i].lst[j].isSelected = false;
								for (let k in defaultSelectedIndex) {
									if (defaultSelectedIndex[k] == lstScreen[i].lst[j].value) {
										lstScreen[i].lst[j].isSelected = true;
									}
								}
							}
						} else {
							for (let j = 0; j < lstScreen[i].lst.length; j++) {
								if (defaultSelectedIndex == lstScreen[i].lst[j].value) {
									lstScreen[i].lst[j].isSelected = true;
								} else {
									lstScreen[i].lst[j].isSelected = false;
								}
							}
						}
					}
					if(lstScreen[i].type == 4){
						this.columnsYear=[];
						this.columnsYear.push(lstScreen[i].lst)
					}
					if (i == (lstScreen.length - 1)) {
						this.lstScreen = lstScreen;
					}
				}
				this.getCalendarDate();
			},
			//时间控件的设置
			getCalendarDate() {
				let date = new Date()
				date.setFullYear(date.getFullYear() - 10);
				this.minDate = Date.parse(new Date(date));
				this.maxDate = Date.parse(new Date())
			},
			clickDigit() {
				document.getElementById("digit").addEventListener("keypress", function(event) {
					if (event.keyCode == 45) {
						event.preventDefault();
					}
				});
			},
			//重置
			clickReset() {
				let lst = uni.getStorageSync("OldLstScreen")
				uni.setStorageSync('_lstScreen', lst) //1*60*60*24*7
				this.getData();
			},
			//确认
			clickConfirm() {
				uni.setStorageSync('_lstScreen', this.lstScreen) //1*60*60*24*7
				uni.navigateBack();
				console.log(this.lstScreen)
			},
			//查看更多
			seeMore(index) {
				if ((this.type == 1 && this.lstScreen[index].title == '负责人员') ||
					(this.type == 2 && this.lstScreen[index].title == '报销人员') ||
					(this.type == 3 && this.lstScreen[index].title == '发起人') ||
					(this.type == 4 && this.lstScreen[index].title == '归属人员') || 
					(this.type == 5 && this.lstScreen[index].title == '所属人员') || 
					(this.type == 6 && this.lstScreen[index].title == '合同归属人员')) {
					//this.getUserList(index);
					let lst = isEmpty(this.lstSelectUser) ? this.lstScreen[index].lst : this.lstSelectUser
					uni.setStorageSync('lstSelectUser', lst) //1*60*60*24*7
					uni.setStorageSync('indexSelectUser', index) //1*60*60*24*7
					uni.navigateTo({
						url: "/pages/filter-all/select-more?total=" + parseInt(this.lstScreen[index].total)+"&title="+this.lstScreen[index].title
					});
				} else if ((this.type == 2 && this.lstScreen[index].title == '报销部门') || 
				(this.type == 6 && this.lstScreen[index].title == '合同所属部门')) {
					this.getDepartList(index)
				} else {

					let arr = [{
							name: "李连杰",
							value: '5-1'
						},
						{
							name: "李连杰",
							value: '5-2'
						},
						{
							name: "李连杰",
							value: '5-3'
						},
						{
							name: "李连杰",
							value: '5-4'
						},
						{
							name: "李连杰",
							value: '5-5'
						},
						{
							name: "李连杰",
							value: '5-6'
						},
						{
							name: "李连杰",
							value: '5-7'
						},
						{
							name: "李连杰",
							value: '5-8'
						},
					];
					this.lstScreen[index].isMore = false;
					this.lstScreen[index].lst = this.lstScreen[index].lst.concat(arr);
				}
				//setTimeout(() => { 

				//}, 0)

				//this.Info.lstuser = this.Info.lstuser.concat(arr);
				//this.isSeeMore=false;
			},
			//报销部门
			getDepartList(index) {
				let pageSize = parseInt(this.lstScreen[index].total)
				let data = "?departName=" + "" +
					"&pageNo=" + "1" +
					"&pageSize=" + pageSize;
				getDepartListByName(data, res => {
					if (res.code == 200 && res.success) {
						let data = [];
						for (let j = 0; j < res.result.records.length; j++) {
							let isSelected = false;
							var num = this.lstScreen[index].defaultSelectedIndex.indexOf(res.result.records[j].id);
							if (num > -1) {
								isSelected = true;
							}
							data.push({
								name: res.result.records[j].departName,
								value: res.result.records[j].id,
								id: res.result.records[j].id,
								isSelected: isSelected
							})
						}
						//setTimeout(() => {
						this.lstScreen[index].isMore = false;
						this.lstScreen[index].lst = data;

						//}, 0)

					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//负责人员
			getUserList(index) {
				let pageSize = parseInt(this.lstScreen[index].total)
				let data = "?realname=" + "" +
					"&pageNo=" + "1" +
					"&pageSize=" + pageSize;
				getUserListByUserId(data, res => {
					if (res.code == 200 && res.success) {
						let data = [];
						for (let j = 0; j < res.result.records.length; j++) {
							let isSelected = false;
							var num = this.lstScreen[index].defaultSelectedIndex.indexOf(res.result.records[j].id);
							if (num > -1) {
								isSelected = true;
							}
							data.push({
								name: res.result.records[j].realname,
								value: res.result.records[j].id,
								id: res.result.records[j].id,
								isSelected: isSelected
							})
						}
						//setTimeout(() => {
						this.lstScreen[index].isMore = false;
						this.lstScreen[index].lst = data;

						//}, 0)

					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			//选择按钮
			selectItem(index, inds) {
				let value = this.lstScreen[index].lst[inds].value;
				if (this.lstScreen[index].isMutiple) {
					if (this.lstScreen[index].lst[inds].isSelected) {
						this.lstScreen[index].lst[inds].isSelected = false;
						var num = this.lstScreen[index].defaultSelectedIndex.indexOf(value);
						if (num > -1) {
							this.lstScreen[index].defaultSelectedIndex.splice(num, 1);
						}
						if (this.lstScreen[index].isRequired) {
							for (let i = 0; i < this.lstSelectUser.length; i++) {
								if (this.lstSelectUser[i].value == value) {
									this.lstSelectUser.splice(i, 1);
								}
							}
						}
					} else {
						this.lstScreen[index].lst[inds].isSelected = true;
						this.lstScreen[index].defaultSelectedIndex.push(value);
						if (this.lstScreen[index].isRequired) {
							this.lstSelectUser.push(this.lstScreen[index].lst[inds])
						}

					}
				} else {
					this.lstScreen[index].defaultSelectedIndex = value;
					for (let i = 0; i < this.lstScreen[index].lst.length; i++) {
						if (value == this.lstScreen[index].lst[i].value) {
							this.lstScreen[index].lst[i].isSelected = true;
						} else {
							this.lstScreen[index].lst[i].isSelected = false;
						}
					}
				}

				this.ischange = true;
				//this.$nextTick(()=>{
				this.ischange = false;
				//})
			},
			//点击开始时间
			clickStart(index) {
				if(!isEmpty(this.lstScreen[index].minDate)){
					this.minDate =this.lstScreen[index].minDate
					this.maxDate = this.lstScreen[index].maxDate;
				}else{
					let date = new Date()
					date.setFullYear(date.getFullYear() - 10);
					this.minDate = Date.parse(new Date(date));
				}
				this.indexNum = index;
				this.showDatePicker = true;
				this.isStartTime = true;
			},
			//点击结束时间
			clickEnd(index) {
				if(!isEmpty(this.lstScreen[index].startTime)){
					this.minDate = Date.parse(this.lstScreen[this.indexNum].startTime);
				}else{
					this.minDate =this.lstScreen[index].minDate
					this.maxDate = this.lstScreen[index].maxDate;
				}
				this.showEndTime = true;
				this.indexNum = index;
				this.isStartTime = false;
			},
			//时间控件的确认按钮
			confirmDatetime(e) {
				const timeFormat = uni.$u.timeFormat;
				if (this.isStartTime) {
					this.lstScreen[this.indexNum].startTime = timeFormat(e.value, 'yyyy-mm-dd');
					this.showDatePicker = false;
				} else {
					this.lstScreen[this.indexNum].endTime = timeFormat(e.value, 'yyyy-mm-dd');
					this.showEndTime = false;
				}

			},

			//金额
			costChange(e, index) {
				console.log(e)
				let text = "";
				var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
				if (reg.test(e)) { //正则匹配通过，提取有效文本
					text = e.replace(reg, '$2$3$4').replace(/^0+/, '0');
				} else { //正则匹配不通过，直接清空
					text = "";
				}
				setTimeout(() => {
					this.lstScreen[index].minCost = text
				}, 0)
				console.log(this.lstScreen[index].minCost)
			},
			// 设置数值精度
			toPrecision(num, precision) {
				if (precision === undefined) precision = 2;
				return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(2);
			},
			costMaxChange(e, index) {
				console.log(e)
				let text = "";
				var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
				if (reg.test(e)) { //正则匹配通过，提取有效文本
					text = e.replace(reg, '$2$3$4').replace(/^0+/, '0');
				} else { //正则匹配不通过，直接清空
					text = "";
				}
				setTimeout(() => {
					this.lstScreen[index].maxCost = text
				}, 0)
				console.log(this.lstScreen[index].maxCost)
			},
			rightClick() {
				uni.navigateBack();
			},
			confirmYear(e){
				console.log(e)
				let year=e.value[0];
				this.showYear = false;
				this.lstScreen[this.indexNum].year=year
			},
		}
	}
</script>

<style lang="scss">
	/deep/ {
		.logo {
			width: 24px;
			height: 24px;
		}

		.screen-body {
			padding: 10px 16px 0;

			.u-cell {
				.u-cell__title-text {
					color: rgba(0, 0, 0, 0.45);
				}
			}

			.uni-input-placeholder {
				text-align: center;
			}

			.u-input__content__field-wrapper__field {
				height: 35px;
				text-align: center !important;
			}
		}

		.u-tabbar-item__text {
			font-size: 18px;
		}

		.u-tabbar__placeholder {
			height: 60px !important;
		}

		.u-tabbar__content__item-wrapper {
			height: 40px;
			padding: 3px 16px 16px;
		}

		.tab-confirm {

			// background: #2979ff;
			// border-radius: 32px;
			.u-tabbar-item__text span {
				color: #fff;
				font-size: 17px;
			}

			.u-tabbar-item__text {
				background: #2979ff;
				width: 95%;
				text-align: center;
				height: 40px;
				line-height: 40px;
				border-radius: 24px;
				margin-left: 5px;
			}
		}

		.tab-reset {

			// background: rgba(247, 249, 252, 1);
			// border-radius: 32px;
			span {
				font-size: 17px;
				color: rgba(0, 85, 255, 0.8);
			}

			.u-tabbar-item__text {
				background: rgba(247, 249, 252, 1);
				width: 95%;
				text-align: center;
				height: 40px;
				line-height: 40px;
				border-radius: 24px;
				margin-right: 5px;
			}
		}

		.u-border-top {
			border: none !important;
			height: 60px;
		}

		.filter-content-detail-item-default {
			background-color: #FFFFFF;
			color: #666666;
			//padding: 5px 15px;
			border-radius: 20px;
			// margin-right: 2%;
			margin-bottom: 10px;
			display: inline-block;
			font-size: 14px;
			line-height: 35px;
			text-align: center;
			width: 100%;
		}

		.filter-content {
			width: 33.33%;
			display: inline-block;
		}

		.txt-bg {
			background-color: rgb(244, 244, 245);
			color: rgb(102, 102, 102);
			text-align: center;
			margin-top: 0px;
		}

		.min-cost {
			display: inline-block;
			width: 45%;
			padding: 0 5px;

			.u-number-box__input {
				width: 100%;
				border-radius: 24px;
				height: 35px !important;
				background-color: rgba(247, 249, 252, 1);
			}
		}

		.max-cost {
			width: 45%;
			float: right;
			padding: 0 5px;
		}

		.min-max-middle {
			margin-left: 3px;
		}

	}
</style>
