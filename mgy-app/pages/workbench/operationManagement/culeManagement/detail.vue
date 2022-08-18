<template>
	<view>
		<u-navbar class="navbar" title="客户信息" :border="true" safeAreaInsetTop fixed placeholder @leftClick="leftClick"
			@rightClick="rigthClick">
			<view class="u-nav-slot" slot="right" v-if="detail.clueStatus !=4">
				<image class="logo" src="/static/img/assist/detail_more.png"></image>
			</view>
		</u-navbar>
		<view class="card-title">
			<u-cell :title="detail.contacts">
				<view slot="icon" class="logo-icon">
					<view class="logo-icon-txt">
						{{sliceString(detail.contacts,0,3)}}
					</view>
				</view>
				<view slot="label" class="u-slot-label">
					<text class="u-cell-text" style="color:#0072FF">{{detail.phone}}</text>
				</view>
				<view slot="value" class="u-slot-value rtTag" style="padding-right:20px;">
					<!-- <u-tag class="label-left" text="初步意向"
						bgColor="#EBF4FF" borderColor="#EBF4FF"
						color="#0072FF" size="mini"></u-tag> -->
						<u-tag v-if="detail.clueStatus==1"
							text="未知"
							bgColor="rgba(241, 245, 250, 1)" borderColor="rgba(241, 245, 250, 1)"
							color="rgba(144, 147, 153, 1)" size="mini">
						</u-tag>
						<u-tag v-if="detail.clueStatus==2 || detail.clueStatus==3" 
							:text="detail.clueStatus==2?'初步意向':'下次邀约'"
							bgColor="rgba(235, 244, 255, 1)" borderColor="rgba(235, 244, 255, 1)"
							color="rgba(0, 114, 255, 1)" size="mini">
						</u-tag>
						<u-tag v-if="detail.clueStatus==4"
							text="已转客户"
							bgColor="rgba(239, 248, 235, 1)" borderColor="rgba(239, 248, 235, 1)"
							color="rgba(103, 194, 58, 1)" size="mini">
						</u-tag>
				</view>

			</u-cell>
			<u--form labelWidth="75">
				<u-form-item label="客户名称">
					<text>{{detail.customer || '-'}}</text>
				</u-form-item>
				<u-form-item label="负责人员">
					<text>{{detail.chargeName || '-'}}</text>
				</u-form-item>
			</u--form>
		</view>
		<view class="main-content">
			<u-tabs :list="lsyTabs" :current='current' @click="clickTabs" :scrollable="false" lineWidth="59"
				lineColor="rgba(0, 114, 255, 1)" :activeStyle="{
			    color: 'rgba(0, 114, 255, 1)',
				fontWeight: 'bold',
			    }"></u-tabs>
		</view>
		<view v-if="current==1">
			<u-empty v-if="!followRecordsList.length" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
			</u-empty>
			<view class="follow-up-card" v-else>
				<view class="card-dynamic" v-for="(item, index) in followRecordsList" :key="index">
					<view class="card-step" @click="gotofollowUpDetail(item.id)">
						<view class="dynamic-bg">
							<u-cell>
								<image class="logo" slot="icon"
									:src="item.createAvatar?item.createAvatar:'/static/img/icon_user_default.png'">
								</image>
								<!-- <text slot="value" class="u-slot-value" >未报销</text> -->
								<view slot="title" class="u-slot-title">
									<text class="u-cell-text">{{item.createName}}</text>
									<text class="text-tag">{{item.position}}</text>
								</view>
								<view slot="value" class="u-slot-value">
									<image class="icon-rigth" src="/static/img/assist/detail_rigth.png">
								</view>
							</u-cell>
							<u--text class="title-name" :text="`跟进(${item.connectType_dictText})`"></u--text>
							<u--text class="title-content remark-content" :text="item.content"></u--text>
							<u-cell :title="item.connectTime">
								<image class="logo" slot="icon" src="/static/img/workbench/icon_time_no.png">
								</image>
								<!-- <text slot="value" class="u-slot-value" >未报销</text> -->
								<view slot="value" class="u-slot-value">
									<image class="icon-news" src="/static/img/assist/detail_news.png">
										<text class="value-news">{{item.recordComments.length||''}}</text>
								</view>
							</u-cell>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="current==0">
			<view class="card-detail">
				<view class="card" style="border-top: 1px solid;border-top-color: #eee;padding: 0;">
					<view class="card-pa">
						<u-cell title="基本信息"></u-cell>
						<u--form labelWidth="100">
							<u-form-item label="客户名称">
								<text>{{detail.customer ||'-'}}</text>
							</u-form-item>
							<u-form-item label="联系人姓名">
								<text>{{detail.contacts || '-'}}</text>
							</u-form-item>
							<u-form-item label="性别">
								<text>{{getDictLabel(sex,detail.sex) || '-'}}</text>
							</u-form-item>
							<u-form-item label="手机号码">
								<text>{{detail.phone || '-'}}</text>
							</u-form-item>
							<u-form-item label="电子邮箱">
								<text>{{detail.email || '-' }}</text>
							</u-form-item>
							<u-form-item label="线索来源">
								<text>{{getDictLabel(clue_source,detail.clueSource) || '-'}}</text>
							</u-form-item>
							<u-form-item label="线索状态">
								<text>{{detail.clueStatusName || '-'}}</text>
							</u-form-item>
							<u-form-item label="线索归属">
								<text>{{detail.chargeName || '-'}}</text>
							</u-form-item>
						</u--form>
					</view>
				</view>
				<view class="card">
					<view class="card-pa">
						<u-cell title="系统信息"></u-cell>
						<u--form labelWidth="100">
							<u-form-item label="系统编号">
								<text>{{detail.sourceCode|| '-'}}</text>
							</u-form-item>
							<u-form-item label="创建人员">
								<text>{{detail.createBy || '-'}}</text>
							</u-form-item>
						<!-- 	<u-form-item label="所属部门">
								<text>{{detail.deptName || '-'}}</text>
							</u-form-item> -->
							<u-form-item label="创建时间">
								<text>{{detail.createTime || '-'}}</text>
							</u-form-item>
							<u-form-item label="更新时间">
								<text>{{detail.updateTime || '-'}}</text>
							</u-form-item>
							<u-form-item label="最后跟进">
								<text>{{detail.lastContactTime || '-'}}</text>
							</u-form-item>
							<u-form-item label="下次跟进">
								<text>{{detail.connectTime || '-'}}</text>
							</u-form-item>
						</u--form>
					</view>
				</view>
				<view class="card"></view>
			</view>
		</view>
		<view v-if="current==2">
			<u-empty v-if="!attachmentList.length" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
			</u-empty>
			<view v-else class="attachment-content" v-for="(item, index) in attachmentList" :key="index">
				<u-cell :title="item.name" @click="toPreviewFiles(item.url)">
					<view slot="icon" class="folder-icon">
						<image class="logo-folder" :src="getFileTypeImg(item.fileFormat)"></image>
					</view>
					<!-- <image class="logo" slot="value" src="/static/img/assist/icon_file_folder_more.png"></image> -->
					<view slot="label" class="u-slot-label">
						<text class="u-cell__label">{{item.uploadUserName}}&emsp;{{item.createTime}}</text>
					</view>
				</u-cell>
			</view>
		</view>


		<u-tabbar :value="numTabbar" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true"
			@change="changeTabbar">

			<u-tabbar-item text="写新跟进" v-if="detail.clueStatus !=4">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/detail_follow_up.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="转为客户" v-if="detail.clueStatus !=4">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/icon-zwkh.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="变更状态" v-if="detail.clueStatus !=4">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/icon-change.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="删除线索" v-if="detail.clueStatus ==4">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/follow_detail_detele.png"></image>
			</u-tabbar-item>
		</u-tabbar>
		<u-action-sheet title="更多" :show="showAction" :closeOnClickOverlay="true" :round="24" @close="showAction=false">
			<u-grid :border="false" col="5" @click="clickGrid">
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_edit.png"></image>
					</view>
					<text class="grid-text">转为商机</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/contacts_pople.png"></image>
					</view>
					<text class="grid-text">拨打电话</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/contacts_sendSMS.png"></image>
					</view>
					<text class="grid-text">发送短信</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/follow_detail_edit.png"></image>
					</view>
					<text class="grid-text">编辑线索</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/follow_detail_detele.png"></image>
					</view>
					<text class="grid-text">删除线索</text>
				</u-grid-item>
				
			</u-grid>
		</u-action-sheet>

		<u-modal :show="showDelete" title="删除确认" content='确定要删除该线索吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
		<u-action-sheet 
			:actions="statusList" 
			title="" 
			:show="showStatusSheet" 
			cancelText="取消" 
			@close="showStatusSheet=false"
			@select='changeStatus'
		></u-action-sheet>
	</view>
</template>

<script>
	import {
		getFollowRecordsList,
		getClueInfoById,
		convertCustomer,
		deleteClueSource,
		editClueSource,
		convertBizOppty,
	} from "@/util/interface.js"
	import {
		toMap
	} from "@/util/map.js"
	export default {
		data() {
			return {
				id: '',
				showStatusSheet:false,
				detail:{},
				contactsList: [],
				followRecordsList: [],
				attachmentList: [],
				followPageNo: 1,
				followMaxPage: 1,
				attachmentPageNo: 1,
				attachmentMaxPage: 1,
				fileTypeOptions: [],
				statusBarHeight: getApp().globalData.statusBarHeight, //状态栏高度
				lsyTabs: [
				// {
				// 	name: "线索动态"
				// }, 
				{
					name: "资料详情"
				},
				{
					name: "跟进记录"
				}],
				statusList: [
					{
						name:'初步意向',
						color:'#007AFF',
						fontSize:'16'
					},
					{
						name:'下次邀约',
						color:'#007AFF',
						fontSize:'16'
					},
				],
				current: 0,
				numTabbar: "",
				showAction: false,
				showDelete: false,
				clueStatusList:[],
				sex: [],
				clue_source:[],
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.refresh();
			this.getFollowRecords();
			this.sex = getApp().globalData.sex; //客户状态
			let clue_status = this.$cache.get('clue_status');
			let gc = getApp().globalData['clue_status'];
			this.clue_source = getApp().globalData['clue_source'];
			if(!clue_status){
				this.$cache.set('clue_status', gc || [])
				this.clueStatusList =  gc || [];
			}else{
				this.clueStatusList = clue_status;
			}
		},
		onShow() {
			uni.$on('return', res => {
				if (res) {
					this.followPageNo = 1;
					this.attachmentPageNo = 1;
					this.refresh();
				}
			})
			uni.$on('returnClue', res => {
				if (res) {
					this.followPageNo = 1;
					this.attachmentPageNo = 1;
					this.refresh();
				}
			})
		},
		onReachBottom() {
			if (this.current != 0) {
				switch (this.current) {
					case 1:
						if (this.followPageNo < this.followMaxPage) {
							this.followPageNo += 1;
							this.getFollowRecords();
						}
						break;
					case 2:
						if (this.attachmentPageNo < this.attachmentMaxPage) {
							this.attachmentPageNo += 1;
							this.getAttachments();
						}
						break;
					default:
						break;
				}
			}
		},
		methods: {
			gotoMap(area) {
				if (!area || [undefined, null, 'undefined', 'null'].includes(area)) {
					return
				}
				toMap(area)
			},
			refresh() {
				this.getDetail();
				this.getFollowRecords();
			},
			getDetail() {
				let that = this;
				const data = "?id=" + this.id;
				getClueInfoById(data, res => {
					if (res.code == 200 && res.success) {
						console.log('getClueSourcelist-res:',res);
						this.detail = res.result;
						let {clueStatus} = res.result;
						let len = that.clueStatusList.length;
						if(len == 2)return;
						that.clueStatusList = that.clueStatusList.filter((t,i)=>(i>0 && i<len-1))
						that.statusList = that.clueStatusList.map((i)=>({
							name:i.title,
							color:'#007AFF',
							fontSize:'16',
							index:i.value
						}))
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			changeStatus(v){
				console.log('v:',v)
				let p = {};
				p['clueStatus'] = v.index;
				p.id = this.id;
				let params = {
					clue:p,
					falg:false
				}
				editClueSource(params,res=>{
					if (res.code == 200 && res.success) {
						this.getDetail();
						uni.$u.toast('变更成功');
					}else{
						uni.$u.toast(res.message);
					}
					
				})
			},
			getFollowRecords() {
				const data = "?businessCode=ClueSource&clueSourceId=" + this.id + "&pageNo=" + this.followPageNo + '&pageSize=' + 10;
				getFollowRecordsList(data, res => {
					if (res.code == 200 && res.success) {
						this.followRecordsList = this.followPageNo === 1 ? res.result.records : this
							.followRecordsList
							.concat(res.result.records);
						this.followMaxPage = res.result.pages;
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			leftClick() {
				uni.$emit('returnClue', true);
				uni.navigateBack();
			},
			rigthClick() {
				if (this.showAction) {
					this.showAction = false
				} else {
					this.showAction = true
				}
			},
			clickTabs(item) {
				this.current = item.index;
			},
			gotofollowUpDetail(id) {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/followUpDetail?id=" + id +"&businessCode=ClueSource&statusText="+ this.detail.clueStatusName
				})
			},
			//更多==》点击选择
			clickGrid(name) {
				this.showAction = false;
				switch (name) {
					case 0: //转为商机
						let param = {
							id: this.id,//线索id
							customerName: this.detail.customer,//客户名称
							customerId:this.detail.customerId,//客户id
							contact:this.detail.contacts,//首联系人
							phone:this.detail.phone,//手机号码
							chargeId:this.detail.chargeId,//归属人ID
							chargeName:this.detail.chargeName//归属人名称
						}
						uni.navigateTo({
							url: "/pages/workbench/operationManagement/culeManagement/convertCustomer?isCustomer=false&params=" + JSON.stringify(param)
						})
						break;
					case 1: //拨打电话
						this.phone();
						break;
					case 2: //发送短信
						this.callMyInviter();
						break;
					case 3: //编辑线索
						uni.navigateTo({
							url: "/pages/workbench/operationManagement/culeManagement/addClue?returnPageNumber=1&id=" +
								this.detail.id
						})
						break;
					case 4: //删除线索
						this.showDelete = true;
						break;
					default:
						break;
				}
			},
			deleClue(){
				deleteClueSource('?id='+this.id,res=>{
					uni.$u.toast(res.message);
					setTimeout(()=>{
						uni.$emit('returnClue',true)
						uni.navigateBack();
					},1000)
				})
			},
			//底部按钮
			changeTabbar(name) {
				if (name == 0) { //写新跟进 or 删除线索
					if(this.detail.clueStatus ==4){
						this.showDelete = true;
						return;
					}
					const params = {
						clueSourceId: this.id,//线索id
						customerName: this.detail.customer,//客户名称
						customerId:this.detail.customerId,//客户id
						clueStatus:this.detail.clueStatus,//线索状态
					}
					uni.navigateTo({
						url: "/pages/assist/customerManagement/newFollowUp?type=add&isClue=true&params=" + JSON.stringify(
							params)
					})
				}
				if (name == 1) { //转为客户
					let params = {
						id: this.id,//线索id
						customerName: this.detail.customer,//客户名称
						customerId:this.detail.customerId,//客户id
						contact:this.detail.contacts,//首联系人
						phone:this.detail.phone,//手机号码
						chargeId:this.detail.chargeId,//归属人ID
						chargeName:this.detail.chargeName//归属人名称
					}
					uni.navigateTo({
						url: "/pages/workbench/operationManagement/culeManagement/convertCustomer?isCustomer=true&params=" + JSON.stringify(params)
					})
				}
				if (name == 2) { //变更状态
					if(this.detail.clueStatus == 4){
						uni.$u.toast('当前为最后状态');
						return;
					}; 
					this.showStatusSheet = true;
				}
			},
			// 拨打电话
			phone(p) {
				uni.makePhoneCall({
					phoneNumber: this.detail.phone
				}).catch((e) => {
					// console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
				})
			},
			callMyInviter() { //发短信
			
				var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
			
				msg.to = [this.detail.phone];
			
				msg.body = '';
			
				plus.messaging.sendMessage(msg);
			
			},
			//联系人==》更多
			gotoContacts() {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/contacts?id=" + this.id + "&customerName=" + this.detail
						.name
				})
			},
			//截取前四位的字符串
			sliceString(stringObject, start, end) {
				if (!stringObject) return;
				return stringObject ? stringObject.slice(start, end) : ''
			},
			//去联系人详情页
			toDetailContact(id) {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/contactsDetail?id=" + id
				})
			},
			// 返回文件类型图片地址
			getFileTypeImg(fileFormat) {
				return this.fileTypeOptions.find(fi => fi.value == fileFormat).src;
			},
			toPreviewFiles(url) {
				uni.navigateTo({
					url: "/pages/review/index?url=" + url
				})
			},
			// 先上传到服务器
			uploadToServer(res) {
				const data = res.tempFilePaths.map((value, index) => {
					return {
						name: "image" + index,
						uri: value
					}
				})
				uploadPicturePlus(data, response => {
					const data = JSON.parse(response)
					if (data.code == 200 && data.success) {
						this.uploadByBusiness(data.result);
					} else {
						uni.$u.toast(data.message);
					}
				})
			},
			// 上传到服务器后拿到附件id再调用业务相关的接口
			uploadByBusiness(result) {
				const fileIdList = result.map(mi => mi.fileId);
				let formData = {
					businessCode: 'Customer',
					businessId: this.id,
					fileIdList,
					contentType: 'application/x-www-form-urlencoded',
				}
				uploadAttachment(formData, res => {
					if (res.code == 200 && res.success) {
						uni.showToast({
							title: "上传成功!"
						});
						this.attachmentPageNo = 1;
						this.getAttachments();
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			confirmDelete() {
				this.deleClue();
			},
			getDictLabel(dict, value) {
				if (!dict || !value) return '';
				const find = dict.find((fi) => fi.value == value);
				return find ? find.label : '';
			}
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

	/deep/.card-title {
		padding: 8px 16px 16px;
		background: #fff;

		.u-line {
			border: none !important;
		}

		.u-cell__body {
			padding: 10px 0px 0px;

			.u-cell__title-text {
				font-size: 16px;
				font-weight: bold;
				color: rgba(48, 49, 51, 1);
			}

			.u-cell__title-text {
				margin-left: 8px;
			}

			.u-slot-label {
				margin-top: 8px;
			}

			.u-fade-enter-active {
				display: block;
				float: left;
			}

			.u-tag-wrapper {
				position: relative;
				text-align: center;
				left: 8px;
			}

			.label-left {
				margin-left: 8px;
			}

			.logo {
				width: 24px;
				height: 24px;
			}

			.logo-icon {
				background: #0072FF;
				width: 60px;
				height: 60px;
				border-radius: 8px;
				display: flex;
				justify-content: center;
				align-items: center;

				.logo-icon-txt {
					font-size: 18px;
					text-align: center;
					border-radius: 5px;
					padding: 4px;
					color: #fff;
					font-weight: bold;
				}
			}
		}

		.u-form-item__body {
			padding: 10px 0 0;

			.u-form-item__body__left__content__label {
				font-size: 14px;
				color: rgba(116, 121, 136, 1);
			}

			.u-form-item__body__right__content__slot {
				font-size: 14px;
				color: rgba(48, 49, 51, 1);
			}
		}
	}

	/deep/.card-cuntact {
		margin-top: 10px;
		padding: 0px 16px 0px;
		background: #FFFFFF;

		.u-cell__body {
			padding: 12px 0px;

			.u-cell__value {
				font-size: 13px;
				color: rgba(96, 98, 102, 1);
			}

			.u-cell__title-text {
				font-size: 16px;
				color: rgba(48, 49, 51, 1);
			}
		}

		/* 左右滑动 */
		.model_scrollx {
			justify-content: space-between;
			//padding: 16px 0;
		}

		.uni-swiper-tab {
			white-space: nowrap;
		}

		.scrollx_items {
			padding: 16px 16px 0 0;
			text-align: center;
			display: inline-block;
			width: 60px;
			box-sizing: border-box;

			//margin-left: 30rpx;
			.logo-name {
				font-size: 12px;
				line-height: 28px;
				width: 46px;
				text-align: center;
			}
		}

		.logo-icon {
			background: rgba(0, 114, 255, 1);
			width: 46px;
			height: 46px;
			border-radius: 8px;

			.logo-icon-txt {
				font-size: 14px;
				text-align: center;
				border-radius: 5px;
				padding: 4px;
				color: #fff;
				line-height: 38px;
			}
		}

		.logo-add {
			background: rgba(248, 248, 250, 1);
			border: 1px solid rgba(232, 234, 239, 1);

			.logo-icon-txt {
				font-size: 28px;
				text-align: center;
				border-radius: 5px;
				padding: 4px;
				color: rgba(189, 188, 191, 1);
				line-height: 38px;
			}
		}

		/* 左右滑动 */


	}

	/deep/.main-content {
		margin-top: 10px;
		background: #fff;
	}

	/deep/ {
		.u-page__item__slot-icon {
			width: 24px;
			height: 24px;
		}

		.u-tabbar-item__text {
			font-size: 12px;

			span {
				//color: rgba(0, 85, 255, 0.8);
			}
		}
	}

	.main-card {
		margin-top: 8px;
	}
	
	/deep/{
		.rtTag{
			.u-tag-wrapper{
				top:-15px;
			}
		}
	}
	
	/deep/.card-dynamic {
		padding: 0px 16px 0;

		.card-step {
			border-left: 2px solid;
			border-left-color: rgba(0, 114, 255, 1);
			padding: 0 0 8px 16px;

			.dynamic-bg {
				background: #fff;
				border-radius: 4px;

				.u-line {
					border: none !important;
				}

				.text-tag {
					margin-left: 8px;
					font-size: 12px;
					color: rgba(96, 98, 102, 1);
				}

				.u-cell__value {
					color: rgba(192, 196, 204, 1);
				}

				.u-cell__title .u-cell-text {
					font-size: 15px;
					color: rgba(96, 98, 102, 1);
				}

				.u-cell__title-text {
					color: rgba(144, 147, 153, 1);
				}

				.logo {
					width: 24px;
					height: 24px;
				}

				.u-text {
					padding: 0 16px;
					width: unset;
				}

				.icon-rigth {
					width: 16px;
					height: 16px;
				}

				.value-news {
					font-size: 14px;
					color: rgba(96, 98, 102, 1);
				}

				.icon-news {
					width: 14px;
					height: 14px;
					right: 3px;
					top: 1px;
				}

				.title-name {
					.u-text__value {
						font-size: 16px !important;
						font-weight: bold !important;
						color: rgba(48, 49, 51, 1) !important;
						margin-bottom: 10px;
					}

				}

				.title-content {
					.u-text__value {
						color: rgba(144, 147, 153, 1) !important;
					}

				}
			}
		}

		.spot {
			border-radius: 50%;
			width: 6px;
			height: 6px;
			margin-left: -3px;
			display: block;
			border: 1px solid;
			border-color: rgba(0, 114, 255, 1);
			background: rgba(0, 114, 255, 1);
			float: left;
		}
	}

	.card-detail {
		.card {
			padding: 8px 0 0;

			.card-pa {
				padding: 0 16px 16px;
				background: #fff;

				//border-radius: 10px;
				/deep/.u-cell__body {
					padding: 10px 0 0;

					.u-cell__title-text {
						font-size: 16px;
						font-weight: bold;
						color: rgba(48, 49, 51, 1);
					}

					.logo {
						width: 24px;
						height: 24px;
					}
				}

				/deep/.u-line {
					border: none !important;
				}

				/deep/.u-form-item__body {
					padding: 10px 0 0;

					.u-form-item__body__left__content__label {
						font-size: 14px;
						color: rgba(116, 121, 136, 1);
					}

					.u-form-item__body__right__content__slot {
						font-size: 14px;
						color: rgba(48, 49, 51, 1);
					}
				}
			}

		}
	}

	.follow-up-card {
		.card-dynamic {
			padding: 0px;
			border-top: 1px solid;
			border-top-color: #eee;

			.card-step {
				padding: 0px;
				border-left: none;
			}
		}
	}

	/deep/ {
		.grid-img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			background: rgba(247, 248, 250, 1);

			.logo {
				width: 24px;
				height: 24px;
				top: 13px;
			}
		}

		.u-grid {
			padding: 16px 16px 32px;
		}

		.grid-text {
			font-size: 12px;
			color: rgba(0, 0, 0, 0.65);
			padding: 20rpx 0 20rpx 0rpx;
			/* #ifndef APP-PLUS */
			box-sizing: border-box;
			/* #endif */
		}
	}

	/deep/.attachment-content {
		background: #FFFFFF;

		.logo-icon {
			width: 24px;
			height: 24px;
			right: 12px;
		}

		.logo-folder {
			width: 34px;
			height: 34px;
		}

		.folder-title {
			padding: 0 16px 10px;
			background: #fff;

			.folder-title-one {
				font-size: 14px;
				color: rgba(144, 147, 153, 1);
			}

			.folder-title-two {
				font-size: 14px;
				color: rgba(48, 49, 51, 1);
			}
		}

		.folder-icon {
			width: 50px;
		}

		.u-cell__label {
			margin-top: 5px;
			font-size: 12px;
			color: #909193;
			line-height: 18px;
		}

		.u-line {
			border: none !important;
		}
	}

	/deep/.attachment-content:first-child {
		border-top: 1px solid;
		border-top-color: #eee;
	}

	.remark-label {
		.u-form-item__body__left {
			align-items: flex-start;
		}
	}

	.remark-content {
		word-break: break-all;
	}
	
</style>
