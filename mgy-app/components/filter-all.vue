<template>
	<view>
		<view class="screen-body">
			<u--form
				labelPosition="left"
				:model="Info"
				ref="form1"
				labelWidth="100"
			>
				<u-form-item label="报销单分类" ref="item1" ></u-form-item>
				<u-row gutter="10">
					<u-col span="4">
						<text  class='filter-content-detail-item-default txt-bg' style="margin-right: 0;">
							全部报销单
						</text>
					</u-col>
					<u-col span="4">
						<text  class='filter-content-detail-item-default txt-bg' style="margin-right: 0;">
							我的报销单
						</text>
					</u-col>
					<u-col span="4">
						<text  class='filter-content-detail-item-default txt-bg' style="margin-right: 0;">
							下属报销单
						</text>
					</u-col>
				</u-row>
				<u-form-item label="审批状态" ref="item1" ></u-form-item>
				<view>
					<u-row gutter="10" customStyle="margin-bottom: 10px">
						<u-col span="4">
							<text  class='filter-content-detail-item-default txt-bg'>
								全部
							</text>
						</u-col>
						<u-col span="4">
							<text  class='filter-content-detail-item-default txt-bg'>
								已通过
							</text>
						</u-col>
						<u-col span="4">
							<text  class='filter-content-detail-item-default txt-bg'>
								待审批
							</text>
						</u-col>
					</u-row>
					<u-row gutter="10">
						<u-col span="4">
							<text  class='filter-content-detail-item-default txt-bg'>
								被驳回
							</text>
						</u-col>
						<u-col span="4">
							<text  class='filter-content-detail-item-default txt-bg'>
								已撤销
							</text>
						</u-col>
					</u-row>
				</view>
				<u-form-item label="报销状态" ref="item1" ></u-form-item>
				<u-row gutter="10">
					<u-col span="4">
						<text  class='filter-content-detail-item-default txt-bg'>
							全部
						</text>
					</u-col>
					<u-col span="4">
						<text  class='filter-content-detail-item-default txt-bg'>
							未报销
						</text>
					</u-col>
					<u-col span="4">
						<text  class='filter-content-detail-item-default txt-bg'>
							已报销
						</text>
					</u-col>
				</u-row>
				<u-form-item label="项目名称查询" prop="Info.name" ref="item1" ></u-form-item>
				<u--input v-model="Info.name" clearable placeholder="项目名称"></u--input>
				<u-form-item label="发生时间" prop="Info.name" ref="item1" >
				</u-form-item>
				<u-cell-group :border="false">
					<u-cell title="开始时间" :value="Info.startTime" isLink @click="clickStart"></u-cell>
					<u-cell title="结束时间" :value="Info.endTime" @click="clickEnd" isLink></u-cell>
				</u-cell-group>
				<u-form-item label="费用金额"></u-form-item>
				<view>
					<view class="min-cost">
						<u--input placeholder="最低金额" type="digit" 
						clearable v-model="Info.minCost"></u--input>
					</view>
					<text class="min-max-middle">-</text>
					<view class="max-cost">
						<u--input placeholder="最高金额"  type="digit" clearable
						 v-model="Info.maxCost"></u--input>
					</view>
				</view>
				<u-form-item label="负责人员" prop="Info.name" ref="item1" >
				</u-form-item>
				<view>
					<text v-for="(detailItem,idx) in Info.lstuser" :key="idx"
						class='filter-content-detail-item-default'
						:style="{'background-color':detailItem.isSelected?themeColor:'#f4f4f5','color':detailItem.isSelected?'#fff':'#666666'}"
						@click="selectUser(idx)">
						{{detailItem.name}}
					</text>
					<text v-if="isSeeMore" class='filter-content-detail-item-default' 
					style="background-color: rgb(244, 244, 245);color: rgb(102, 102, 102);"
					 @click="seeMore">
						查看更多
					</text>
				</view>
			
				<!-- <u-cell title="选择时间范围" @click="showDatePicker=true"></u-cell> -->
			
			</u--form>
		</view>
		<u-tabbar>
			<u-tabbar-item class="tab-reset" text="重置"  @click="clickReset" ></u-tabbar-item>
			<u-tabbar-item class="tab-confirm" text="确认" @click="clickConfirm" ></u-tabbar-item>
		</u-tabbar>
		<u-datetime-picker
			:show="showDatePicker"
			v-model="datetime"
			mode="datetime"
			:minDate="minDate"
			:maxDate="maxDate"
			closeOnClickOverlay
			@close="showDatePicker=false"
			@cancel="showDatePicker=false"
			@confirm="confirmDatetime"
		></u-datetime-picker>
		<u-datetime-picker
			:show="showEndTime"
			v-model="dateEndtime"
			mode="datetime"
			:minDate="minDate"
			:maxDate="maxDate"
			closeOnClickOverlay
			@close="showEndTime=false"
			@cancel="showEndTime=false"
			@confirm="confirmDatetime"
		></u-datetime-picker>
	</view>
	
</template>

<script>
	import {GetNowFormatDate} from "@/util/js_DateTime.js"
	export default {
		name:"filter-all",
		data() {
			return {
				Info:{
					name:"",
					startTime:"",
					endTime:"",
					minCost:"",
					maxCost:"",
					lstuser:[
						{name:"周小康",id:1,isSelected:false},
						{name:"周小康",id:2,isSelected:true},
						{name:"周小康",id:3,isSelected:false},
						{name:"周小康",id:4,isSelected:true},
						{name:"周小康",id:5,isSelected:false},
						{name:"周小康",id:6,isSelected:false},
						{name:"周小康",id:7,isSelected:false},
						{name:"周小康",id:8,isSelected:false},
						
					]
				},
				isSeeMore:true,
				themeColor: "rgba(0, 85, 255, 0.8)",
				showDatePicker:false,
				datetime:GetNowFormatDate("yyyy-MM-dd hh:mm"),
				maxDate:"",
				minDate:"",
				isStartTime:false,
				dateEndtime:GetNowFormatDate("yyyy-MM-dd hh:mm"),
				showEndTime:false,
			};
		},
		created: function() {
			this.getCalendarDate();
		},
		methods: {
			getCalendarDate(){
				let date = new Date()
				date.setFullYear(date.getFullYear ()-10);
				this.minDate=Date.parse(new Date(date));
				this.maxDate=Date.parse(new Date())
			},
			gotoFeeDetail(item) {
				let type=(item.state==1?0:(item.state==5?4:item.state))
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/reimburseManagement/reimbursementDetails?type="+type
				})
			},
			//重置
			clickReset(){
				this.showScreen=false;
			},
			//确认
			clickConfirm(){
				this.showScreen=false;
			},
			//查看更多
			seeMore(){
				let arr=[
					{name:"李连杰",id:1,isSelected:false},
					{name:"李连杰",id:2,isSelected:false},
					{name:"李连杰",id:3,isSelected:false},
					{name:"李连杰",id:4,isSelected:false},
					{name:"李连杰",id:5,isSelected:false},
					{name:"李连杰",id:6,isSelected:false},
					{name:"李连杰",id:7,isSelected:false},
					{name:"李连杰",id:8,isSelected:false},
				];
				this.Info.lstuser = this.Info.lstuser.concat(arr);
				this.isSeeMore=false;
			},
			selectUser(index){
				if(this.Info.lstuser[index].isSelected){
					this.Info.lstuser[index].isSelected =false;
				}else{
					this.Info.lstuser[index].isSelected =true;
				}
			},
			clickStart(){
				let date = new Date()
				date.setFullYear(date.getFullYear ()-10);
				this.minDate=Date.parse(new Date(date));
				this.showDatePicker=true;
				this.isStartTime=true;
			},
			clickEnd(){
				//let date = new Date()
				//date.setFullYear(date.getFullYear ()-10);
				this.minDate=Date.parse(this.Info.startTime);
				this.showEndTime=true;
				this.isStartTime=false;
			},
			confirmDatetime(e){
				const timeFormat = uni.$u.timeFormat;
				if(this.isStartTime){
					this.Info.startTime=timeFormat(e.value, 'yyyy-mm-dd hh:MM');
					this.showDatePicker=false;
				}else{
					this.Info.endTime=timeFormat(e.value, 'yyyy-mm-dd hh:MM');
					this.showEndTime=false;
				}
				
			}
		}
	}
</script>

<style>

</style>
