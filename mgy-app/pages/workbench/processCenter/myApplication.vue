<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="我的申请"  bgColor="#fff" @leftClick="leftClick" >
			
		</u-navbar>
		<u-sticky :offset-top="topheight" z-Index="999">
			<view class="sticky-title">
				<u-search :show-action="false" placeholder="请输入流程名称查询" bgColor="rgba(244, 246, 250, 1)"
				v-model="selectInfo.searchValue" :clearabled="true" @change="searchChange"></u-search>
				<text class="sticky-txt" @click="clickScreen">筛选</text>
			</view>
			
		</u-sticky>
		<u--form ref="form1" labelPosition="left" labelWidth="75">
			<view class="card" v-for="(item, index) in lstApplication":key="index">
				<view class="card-pa" @click="gotoDetail(item)">
					<u-cell :title="item.processName">								
						<u-tag v-if="item.processStatus==1" slot="value" text="发起申请"
							bgColor="rgba(255, 248, 242, 1)" borderColor="rgba(255, 248, 242, 1)"
							color="rgba(255, 147, 48, 1)" size="mini">
						</u-tag>
						<u-tag v-if="item.processStatus==2" slot="value" text="待审批"
							bgColor="rgba(235, 244, 255, 1)" borderColor="rgba(235, 244, 255, 1)"
							color="rgba(0, 114, 255, 1)" size="mini">
						</u-tag>
						<u-tag v-if="item.processStatus==3" slot="value" text="通过"
							bgColor="rgba(243, 255, 237, 1)" borderColor="rgba(243, 255, 237, 1)"
							color="rgba(103, 194, 58, 1)" size="mini">
						</u-tag>
						<u-tag v-if="item.processStatus==4" slot="value" text="不通过"
							bgColor="rgba(241, 245, 250, 1)" borderColor="rgba(241, 245, 250, 1)"
							color="rgba(144, 147, 153, 1)" size="mini">
						</u-tag>
						<u-tag v-if="item.processStatus==5" slot="value" text="驳回"
							bgColor="rgba(255, 248, 242, 1)" borderColor="rgba(255, 248, 242, 1)"
							color="rgba(255, 147, 48, 1)" size="mini">
						</u-tag>
						<u-tag v-if="item.processStatus==6" slot="value" text="已撤销"
							bgColor="rgba(241, 245, 250, 1)" borderColor="rgba(241, 245, 250, 1)"
							color="rgba(144, 147, 153, 1)" size="mini">
						</u-tag>
					</u-cell>
					<u--form labelWidth="75">
						<u-form-item label="当前处理人">
							<text>{{item.curNodeAssignee}}</text>
						</u-form-item>
						<u-form-item label="备注信息">
							<text>{{item.remark}}</text>
						</u-form-item>
						<u-form-item label="提交时间">
							<text>{{item.applyTime}}</text>
						</u-form-item>
					</u--form>
				</view>	
			</view>
			
		</u--form>
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<u-empty v-if="lstApplication.length==0 && isLoading" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<u-loadmore v-if="lstApplication.length>0" :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" />
		
	</view>
</template>

<script>
	import {isEmpty} from "@/util/common.js"
	import {GetNowFormatDate} from "@/util/js_DateTime.js"
	import {getApplyTaskList,getDictItemsByCode,} from "@/util/interface.js"
	export default {
		data() {
			return {
				topheight:0,
				statusBarHeight:getApp().globalData.statusBarHeight+44,//状态栏高度
				scrollTop:0,
				lstApplication:[],
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				pageNo: 1,
				maxPage: 1,
				isLoading:false,
				firstTime:false,//第一次点击筛选
				lstScreen:[
					{
						type:1,//1多选  2选择时间 3收入费用
						title:"审核状态",
						defaultSelectedIndex:[],
						isMutiple:true,
						lst:[
							{name:"已通过",value:"1"},
							{name:"待审批",value:"2"},
							{name:"被驳回",value:"3"},
							{name:"已撤销",value:"4"},
						]
					},
					{
						type:2,//1多选  2选择时间 3收入费用
						title:"提交时间",
						startTime:"",
						endTime:"",
					},
				],
				selectInfo: {
					searchValue: "",
					startTime: "", //开始时间
					endTime: "", //结束时间
					applyIds:"",//
					processStatus:"",
				}
			}
		},
		onLoad(option) {
			this.getDictItems();
			this.getData();
			this.getTopHeight();
		},
		onReachBottom() {
			if(this.pageNo >= this.maxPage) return ;
			this.status = 'loading';
			this.pageNo = this.pageNo+1;
			this.getData();
		},
		onShow() {
			this.pageNo=1;
			uni.$once('result', res => {
			    for(let i=0;i<res.length;i++){
					let item=res[i];
					if(item.title=="审核状态"){
						let SelectedIndex="";
						for (let k = 0; k < item.defaultSelectedIndex.length; k++) {
							SelectedIndex += (SelectedIndex.length>0 ?",":"") +item.defaultSelectedIndex[k]
						}
						this.selectInfo.processStatus=SelectedIndex;
					}
					if(item.title=="提交时间"){
						this.selectInfo.startTime=item.startTime;
						this.selectInfo.endTime=item.endTime;
					}
				}
				  console.log(res)
				this.getData();
			});
		},
		
		methods: {
			//审核状态
			getDictItems(){
				let data="?dictCode=approval_status"
				getDictItemsByCode(data,res=>{
					if(res.code==200 && res.success){
						let arr=[];
						arr.push(res.result)
						getApp().globalData.lstExpense_type=arr;
						let lst=[];
						for(let j=0;j<res.result.length;j++){
							lst.push({
								name:res.result[j].text,
								value:res.result[j].value
							})
						}
						for(let i=0;i<this.lstScreen.length;i++){
							if(this.lstScreen[i].title=="审核状态"){
								this.lstScreen[i].lst=lst;
							}
						}
					}else{
						uni.$u.toast(res.message);
					}
					console.log(res)
				})
			},
			getTopHeight(){
				let that=this;
				uni.getSystemInfo({
					success:function(e){
						//48为自定义导航高度，一般为44
						let topPx=getApp().globalData.statusBarHeight //顶部状态栏+沉浸式自定义顶部导航栏
						that.topheight=topPx/(uni.upx2px(topPx)/topPx)//px转rpx,这里必须转换为rpx,不然适配失败
					}
				})
			},
			getData(){
				this.isLoading = false;
				let data = "?pageNo=" + this.pageNo //页码
					+
					"&pageSize=" + "10" //页码大小
					+
					"&applyIds="+this.selectInfo.applyIds//发起人id集合，逗号分隔	
					+
					"&processName=" + this.selectInfo.searchValue //流程名称
					+
					"&startTime=" + this.selectInfo.startTime //开始时间
					+
					"&endTime=" + this.selectInfo.endTime //结束时间
					+
					"&processStatus="+this.selectInfo.processStatus//审批状态集合
				;
				getApplyTaskList(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.lstApplication = res.result.records;
						} else {
							this.lstApplication = this.lstApplication.concat(res.result.records)
						}
						this.maxPage = res.result.pages
						if (this.pageNo >= this.maxPage) this.status = 'nomore';
						else this.status = 'loading';
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
			},
			gotoDetail(item) {
				uni.setStorageSync('reimbursDetails',item)
				uni.navigateTo({
					url: "/pages/workbench/accountingManagement/reimburseManagement/reimbursementDetails"
				})
			},
			//返回上一级
			leftClick(){
				uni.navigateBack();
			},
			//搜索
			searchChange() {
				this.pageNo = 1
				this.getData();
			},
			//全部筛选
			clickScreen() {
				if (!this.firstTime) {
					this.firstTime = true;
					uni.setStorageSync('_lstScreen', this.lstScreen) //1*60*60*24*7
					uni.setStorageSync('OldLstScreen', this.lstScreen) //1*60*60*24*7
			
				}
				uni.navigateTo({
					url: "/pages/filter-all/filter-all?type=3"
				});
			},
			
		},
		
	}
</script>

<style lang="scss">	
	page{
		background-color: rgba(242, 245, 249, 1);
	}
	.sticky-title{
		height: 48px;
		background: #fff;
		border-top: 1px solid;
		border-top-color: rgba(0, 0, 0, 0.05);
		padding: 0 16px;
		/deep/.u-search{
			margin-top: 8px !important;
			width: 85%;
		}
		.sticky-txt{
			float: right;
			font-size: 16px;
			color: rgba(48, 49, 51, 1);
			margin-top: -30px;
		}
	}
	.u-loading-icon{
		margin-top: 30px;
	}
	.logo{
		width: 24px;
		height: 24px;
	}


.card{	
	padding: 8px 16px 0 16px;	
	.card-pa{
		padding:0 16px 16px;
		background: #fff;
		border-radius: 10px;
		/deep/.u-cell__body{
			padding: 10px 0px;					
			.u-cell__title-text{
				font-size: 16px;
				font-weight: bold;
				color: rgba(48, 49, 51, 1);
			}
			.logo {
				width:30px;
				height: 30px;
			}
		}
		/deep/.u-form-item__body{
			padding: 10px 0 0;
			.u-form-item__body__left__content__label{
				font-size: 14px;
				color:rgba(116, 121, 136, 1) ;
			}
			.u-form-item__body__right__content__slot{
				font-size: 14px;
				color:rgba(48, 49, 51, 1) ;
			}
		}
		.card-pa-view{
			line-height: 30px;
			height: 30px;
			.card-title{
				display: block;
				width: 80%;
				float: left;
			}
			.card-state{
				display: block;
				width: 17%;
				float: right;
				color: #D1372C;
			}
		}
		.txt-size{
			display: block;
			margin-top: 5px;
			font-size: 14px;
			color: rgba(0,0,0,0.65);
		}
	}
	
}


/deep/{
		.scrool-more {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}
		.uni-scroll-view-content{
			height: unset;
		}
		.foot-height{
			position: absolute; 
			bottom: 0px;
			width: 100%;
			height: 72px;
			background: #fff;	
			border-top: 1px solid #f0f4f9;
			.u-button{
				width: 47%;
				top: 16px;
			}
			.batch-reject{
				float: left;
				.u-button__text{
					font-size: 17px !important;
					color: rgba(96, 98, 102, 1);
				}
			}
			.batch-approval{
				float: right;
				.u-button__text{
					font-size: 17px !important;
				}
			}
			.all-box{
				width: 55%;
				margin-top: 10px;
				float: left;
				.txt{
					font-size: 16px;
					color: rgba(51, 51, 51, 1);
					line-height: 48px;
				}
				.u-checkbox-group--column{
					display: inline-block;
					flex-direction: row;
					width: 64px;
				}
			}
			.batch-but{
				width: 30%;
				float: right;
				.u-button__text{
					font-size: 17px !important;
				}
			}
			.cancel{
				width: 50px;
				line-height: 48px;
				margin-top: 10px !important;				
				font-size: 17px;
				display: inline-block;
				.u-text__value{
					font-size: 17px !important;
					text-align: center !important;
					color: rgba(48, 49, 51, 1) !important;
				}
			}
		}
	}
/deep/.u-loadmore{
	margin-bottom: 20px !important;
	margin-top: 10px !important;
}

</style>