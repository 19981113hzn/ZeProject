<template>
	<view>
		<u-navbar leftIcon="" leftText="关闭" class="navbar" title="SWOT分析" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>
		<u--form :model="itemInfo" ref="form1" labelPosition="left" labelWidth="80">
			<view style="flex: auto; height:auto!important;">
				<scroll-view class="scrool-more" :style="{ 'top': statusBarHeight + 'px','bottom':'72px' }"
					scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true">
					
					<u-checkbox-group v-model="itemInfo.internalFactors" placement="column" @change="changeInternalFactors">
						<text class="title-name">内部因素<span class="contact-star">*</span></text>
						<view v-for="(item, index) in lstInternalFactors" :key="index">
							<u-cell>
								<u-checkbox slot="icon" :key="index" label="" :name="index"></u-checkbox>
								<view slot="title"  class="u-slot-title">
								    <text class="u-cell-text">{{item.comment}}</text>
								</view>
							</u-cell>
						</view>
					</u-checkbox-group>
					<u-checkbox-group v-model="itemInfo.externalFactors" placement="column" @change="changeExternalFactors">
						<text class="title-name">外部因素<span class="contact-star">*</span></text>
						<view v-for="(item, index) in lstExternalFactors" :key="index">
							<u-cell>
								<u-checkbox slot="icon" :key="index" label="" :name="index"></u-checkbox>
								<view slot="title"  class="u-slot-title">
								    <text class="u-cell-text">{{item.comment}}</text>
								</view>
							</u-cell>
						</view>
					</u-checkbox-group>
				</scroll-view>
			</view>
			<view class="foot-height">
				<view style="padding: 0 16px;">
					<u-form-item>
						<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="确认提交" @click="saveSWOT"></u-button>
					</u-form-item>
				</view>
			</view>
		
		</u--form>
	</view>
</template>

<script>
	import {
		GetNowFormatDate
	} from "@/util/js_DateTime.js"
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getquotaList
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				scrollTop: 0,
				modalContent: "",
				modalTitle: "",
				showModal: false,
				returnPageNumber:1,
				itemInfo:{
					internalFactors:[],
					externalFactors:[]
				},
				lstInternalFactors:[
					{comment:"口碑好（质量、服务）赢得客户信任",id:1},
					{comment:"拥有稳定资深的核心技术团队",id:2},
					{comment:"拥有经验丰富且相对稳定的系列人力资源",id:3},
					{comment:"员工离职率低，公司凝聚力好，技术人员、管理人员稳定",id:4},
					{comment:"应用技术先进",id:5},
					{comment:"渠道客户资源丰富",id:6},
				],
				lstExternalFactors:[
					{comment:"数智化转型潮流席卷全球，需求潜力巨大，市场前景看好",id:1},
					{comment:"中国“十五”发展规划，为数字经济增加了市场面",id:2},
					{comment:"持企业对数智化转型项目的重视及资源支持",id:3},
					{comment:"多系统无法产生协同效应，难以整合，维护成本高",id:4},
					{comment:"数据孤岛，数据未真正产生价值",id:5},
				],
				internalFactorsNum:0,
				externalFactorsNum:0,
			}
		},
		onLoad(){
			this.getData(1);//1-内在因素 
			this.getData(2);//2-外在因素
		},
		methods: {
			getData(factorFlag){
				let data=
					"?pageNo=" + "1" +
					"&pageSize=" + "1000"+
					"&factorFlag="+factorFlag;
				getquotaList(data,res=>{
					if(res.code==200 && res.success){
						if(factorFlag==1){
							this.lstInternalFactors=res.result.records;
						}else{
							this.lstExternalFactors=res.result.records;
						}
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			changeInternalFactors(e){
				this.itemInfo.internalFactors=e;
				this.internalFactorsNum=0
				for(let i=0;i<e.length;i++){
					this.internalFactorsNum +=this.lstInternalFactors[e[i]].grade
				}
				console.log('change', e);
				console.log('Num', this.internalFactorsNum);
			},
			changeExternalFactors(e){
				this.itemInfo.externalFactors=e;
				this.externalFactorsNum=0
				for(let i=0;i<e.length;i++){
					this.externalFactorsNum +=this.lstExternalFactors[e[i]].grade
				}
				console.log('change', e);
				console.log('Num', this.externalFactorsNum);
			},
			leftClick() {
				uni.navigateBack({
					delta: this.returnPageNumber
				});
			},
			saveSWOT(){
				if(this.itemInfo.internalFactors.length==0){
					uni.$u.toast("请选择内部因素");
					return ;
				}
				if(this.itemInfo.externalFactors.length==0){
					uni.$u.toast("请选择外部因素");
					return ;
				}else{
					let item={};
					if(this.internalFactorsNum >=0 && this.externalFactorsNum >= 0){
						item.swotType='SO';
						item.swotPropose="成单机会大，重点跟进"
					}
					else if(this.internalFactorsNum >=0 && this.externalFactorsNum < 0){
						item.swotType='ST';
						item.swotPropose="持续跟进、谨慎评估"
					}
					else if(this.internalFactorsNum < 0 && this.externalFactorsNum >= 0){
						item.swotType='WO';
						item.swotPropose="持续关注，提高成单机会"
					}
					else if(this.internalFactorsNum < 0 && this.externalFactorsNum < 0){
						item.swotType='WT';
						item.swotPropose="建议放弃"
					}
					uni.$emit('returnSWOT', item);
					uni.navigateBack({
						delta: this.returnPageNumber
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
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
			background: #fff;
			border-top: 1px solid #f0f4f9;
	
			.uni-input-placeholder {
				text-align: right;
				color: rgba(0, 114, 255, 1) !important;
			}
	
			.u-input__content__field-wrapper__field {
				text-align: right !important;
				color: rgba(0, 114, 255, 1) !important;
			}
		}
		.title-name {
			font-size: 15px;
			line-height: 48px;
			margin-left: 16px;
			color: rgba(144, 147, 153, 1);
		}
		.contact-star {
			color: #f56c6c;
			line-height: 20px;
			font-size: 20px;
			position: relative;
			left: 6px;
			top: 4px;
		
		}
		.u-cell__body{
			background: #fff;
		}
		.u-line {
			border: none !important;
		}
	}
</style>
