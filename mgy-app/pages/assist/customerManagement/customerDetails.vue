<template>
	<view>
		<u-navbar class="navbar" title="客户信息" :border="true" safeAreaInsetTop fixed placeholder @leftClick="leftClick"
			@rightClick="rigthClick">
			<view class="u-nav-slot" slot="right">
				<image class="logo" src="/static/img/assist/detail_more.png"></image>
			</view>
		</u-navbar>
		<view class="card-title">
			<u-cell :title="detail.name">
				<view slot="icon" class="logo-icon">
					<view class="logo-icon-txt">
						{{sliceString(detail.name,0,4)}}
					</view>
				</view>
				<view slot="label" class="u-slot-label">
					<!-- <text class="u-cell-text">张三</text> -->
					<u-tag :text="getDictLabel(customer_level,detail.customerLevel)|| '无客户级别'"
						bgColor="rgba(241, 245, 250, 1)" borderColor="rgba(241, 245, 250, 1)"
						color="rgba(144, 147, 153, 1)" size="mini"></u-tag>
					<u-tag class="label-left" :text="getDictLabel(customer_status,detail.customerStatus)||'无客户状态'"
						bgColor="rgba(241, 245, 250, 1)" borderColor="rgba(241, 245, 250, 1)"
						color="rgba(144, 147, 153, 1)" size="mini"></u-tag>
				</view>

			</u-cell>
			<u--form labelWidth="75">
				<u-form-item label="客户归属">
					<text>{{detail.responsiblePersonName || '-'}}</text>
				</u-form-item>
				<u-form-item label="客户类型">
					<text>{{getDictLabel(company_org_type,detail.companyOrgType) || '-'}}</text>
				</u-form-item>
				<u-form-item label="下次跟进">
					<text>{{detail.nextContactTime || '-'}}</text>
				</u-form-item>

			</u--form>
		</view>

		<view class="card-cuntact">
			<u-cell title="联系人" value="更多" @click="gotoContacts"></u-cell>
			<view class="model_scrollx flex_row">
				<scroll-view class="uni-swiper-tab" scroll-x :style="'height:'+97+'px'">
					<view class="scrollx_items" v-for="(item, index) in contactsList" :key="index"
						@click="toDetailContact(item.id)">
						<view class="logo-icon">
							<view class="logo-icon-txt">
								{{sliceString(item.name,0,2)}}
							</view>
						</view>
						<view class="logo-name">{{item.name.length>3?sliceString(item.name,0,3)+'...':item.name}}</view>
					</view>

					<view class="scrollx_items" @click="addContact">
						<view class="logo-icon logo-add">
							<view class="logo-icon-txt">
								+
							</view>
						</view>
						<view class="logo-name">添加</view>
					</view>
				</scroll-view>
			</view>

		</view>

		<view class="main-content">
			<u-tabs :list="lsyTabs" @click="clickTabs" :scrollable="false" lineWidth="59"
				lineColor="rgba(0, 114, 255, 1)" :activeStyle="{
			    color: 'rgba(0, 114, 255, 1)',
				fontWeight: 'bold',
			    }"></u-tabs>
		</view>
		<view v-if="current==0">
			<view class="card-detail">
				<view class="card" style="border-top: 1px solid;border-top-color: #eee;padding: 0;">
					<view class="card-pa">
						<u-cell title="基本信息"></u-cell>
						<u--form labelWidth="100">
							<u-form-item label="客户名称">
								<text>{{detail.name}}</text>
							</u-form-item>
							<u-form-item label="客户类型">
								<text>{{getDictLabel(company_org_type,detail.companyOrgType) || '-'}}</text>
							</u-form-item>
							<u-form-item label="客户级别">
								<text>{{getDictLabel(customer_level,detail.customerLevel) || '-'}}</text>
							</u-form-item>
							<u-form-item label="客户状态">
								<text>{{getDictLabel(customer_status,detail.customerStatus) || '-'}}</text>
							</u-form-item>
							<u-form-item label="所属行业">
								<text>{{detail.industryText || '-' }}</text>
							</u-form-item>
							<u-form-item label="客户来源">
								<text>{{getDictLabel(customer_source,detail.customerSource) || '-'}}</text>
							</u-form-item>
							<u-form-item label="客户归属">
								<text>{{detail.responsiblePersonName || '-'}}</text>
							</u-form-item>
						</u--form>
					</view>
				</view>
				<view class="card">
					<view class="card-pa">
						<u-cell title="附加信息"></u-cell>
						<u--form labelWidth="100">
							<u-form-item label="所在地区">
								<text>{{detail.area || '-'}}</text>
							</u-form-item>
							<u-form-item label="详细地址" @click="gotoMap(detail.area+detail.address)">
								<text style="color:#2979ff" class="remark-content">
									<u-icon v-if="detail.address" name="map-fill" color="#2979ff" size="20"
										style="display: inline-block;">
									</u-icon>
									{{detail.address || '-'}}
								</text>
							</u-form-item>
							<u-form-item label="纳税人识别号">
								<text>{{detail.taxNumber || '-'}}</text>
							</u-form-item>
							<u-form-item label="经营状态">
								<text>{{getDictLabel(operating_state,detail.operatingState) || '-'}}</text>
							</u-form-item>
							<u-form-item label="企业类型">
								<text>{{getDictLabel(company_org_type,detail.companyOrgType) || '-'}}</text>
							</u-form-item>
							<u-form-item label="人员规模">
								<text>{{getDictLabel(staff_num_range,detail.staffNumRange) || '-'}}</text>
							</u-form-item>
							<u-form-item label="小微企业">
								<text>{{getDictLabel(is_micro_ent,detail.isMicroEnt) || '-'}}</text>
							</u-form-item>
							<u-form-item label="备注信息" class="remark-label">
								<text class="remark-content">{{detail.remark || '-'}} </text>
							</u-form-item>
						</u--form>
					</view>
				</view>
				<view class="card">
					<view class="card-pa">
						<u-cell title="系统信息"></u-cell>
						<u--form labelWidth="100">
							<u-form-item label="系统编号">
								<text>{{detail.reimburseNo}}</text>
							</u-form-item>
							<u-form-item label="负责人员">
								<text>{{detail.responsiblePersonName || '-'}}</text>
							</u-form-item>
							<u-form-item label="创建人员">
								<text>{{detail.createUserName || '-'}}</text>
							</u-form-item>
							<u-form-item label="所属部门">
								<text>{{detail.deptName || '-'}}</text>
							</u-form-item>
							<u-form-item label="前归属人">
								<text>{{detail.previousResponsiblePersonName || '-'}}</text>
							</u-form-item>
							<u-form-item label="前所属部门">
								<text>{{detail.previousDeptName || '-'}}</text>
							</u-form-item>
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
								<text>{{detail.nextContactTime || '-'}}</text>
							</u-form-item>
						</u--form>
					</view>
				</view>
				<view class="card"></view>
			</view>
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

			<u-tabbar-item text="写新跟进">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/detail_follow_up.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="拨打电话">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/detail_telephone.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="转移客户">
				<image class="u-page__item__slot-icon" slot="inactive-icon"
					src="/static/img/assist/detail_customer.png"></image>
			</u-tabbar-item>
		</u-tabbar>
		<u-action-sheet title="更多" :show="showAction" :closeOnClickOverlay="true" :round="24" @close="showAction=false">
			<u-grid :border="false" col="5" @click="clickGrid">
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_edit.png"></image>
					</view>
					<text class="grid-text">编辑客户</text>
				</u-grid-item>
				<u-grid-item v-if="detail.collect==0">
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_follow.png"></image>
					</view>
					<text class="grid-text">重点关注</text>
				</u-grid-item>
				<u-grid-item v-if="detail.collect==1">
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_cancel_following.png"></image>
					</view>
					<text class="grid-text">取消关注</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_delete.png"></image>
					</view>
					<text class="grid-text">删除客户</text>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-img">
						<image class="logo" src="/static/img/assist/more_file.png"></image>
					</view>
					<text class="grid-text">上传附件</text>
				</u-grid-item>
			</u-grid>
		</u-action-sheet>

		<u-modal :show="showDelete" title="删除确认" content='确定要删除该客户吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
	</view>
</template>

<script>
	import {
		getSysCustomerDetail,
		getContactsList,
		getFollowRecordsList,
		getAttachmentsList,
		getDictItemsByCode,
		uploadAttachment,
		editCustomerCollect,
		uploadPicturePlus,
		customerDelete
	} from "@/util/interface.js"
	import {
		toMap
	} from "@/util/map.js"
	export default {
		data() {
			return {
				id: '',
				contactDetail: {},
				detail: {},
				contactsList: [],
				followRecordsList: [],
				attachmentList: [],
				followPageNo: 1,
				followMaxPage: 1,
				attachmentPageNo: 1,
				attachmentMaxPage: 1,
				fileTypeOptions: [],
				statusBarHeight: getApp().globalData.statusBarHeight, //状态栏高度
				lsyTabs: [{
					name: "资料详情"
				}, {
					name: "跟进记录"
				}, {
					name: "相关附件"
				}],
				current: 0,
				numTabbar: "",
				showAction: false,
				showDelete: false,
				customer_status: [],
				customer_level: [],
				customer_source: [],
				company_org_type: [],
				operating_state: [],
				staff_num_range: [],
				advance_notice: [],
				is_micro_ent: [],
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.refresh();
			this.getDictItems('file_format_type')
			this.customer_status = getApp().globalData.customer_status; //客户状态
			this.customer_level = getApp().globalData.customer_level; //客户级别
			this.customer_source = getApp().globalData.customer_source; //客户来源
			this.company_org_type = getApp().globalData.company_org_type; //企业类型
			this.operating_state = getApp().globalData.operating_state; //经营状态
			this.staff_num_range = getApp().globalData.staff_num_range; //人员规模
			this.advance_notice = getApp().globalData.advance_notice; //任务提醒
			this.is_micro_ent = getApp().globalData.is_micro_ent; //小微企业
		},
		onShow() {
			uni.$once('return', res => {
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
				this.getContacts();
				this.getFollowRecords();
				this.getAttachments();
			},
			getDetail() {
				const data = "?id=" + this.id;
				getSysCustomerDetail(data, res => {
					if (res.code == 200 && res.success) {
						this.contactDetail = res.result.contact;
						this.detail = res.result.customer;
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getContacts() {
				const data = "?customerId=" + this.id;
				getContactsList(data, res => {
					if (res.code == 200 && res.success) {
						this.contactsList = res.result.records;
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			getFollowRecords() {
				const data = "?customerId=" + this.id + "&pageNo=" + this.followPageNo + '&pageSize=' + 10;
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
			getAttachments() {
				const data = "?businessCode=Customer&businessId=" + this.id + "&pageNo=" + this.attachmentPageNo +
					'&pageSize=' + 10;
				getAttachmentsList(data, res => {
					if (res.code == 200 && res.success) {
						this.attachmentList = this.attachmentPageNo === 1 ? res.result.records : this
							.attachmentList
							.concat(res.result.records);
						this.attachmentMaxPage = res.result.pages;
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			leftClick() {
				uni.navigateBack();
			},
			rigthClick() {
				if (this.showAction) {
					this.showAction = false
				} else {
					this.showAction = true
				}
			},
			addContact() {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/newContact?returnPageNumber=1&type=2&customerId=" + this
						.detail.id + "&customerName=" + this.detail.name,
				})
			},
			clickTabs(item) {
				this.current = item.index;
			},
			gotofollowUpDetail(id) {
				uni.navigateTo({
					url: "/pages/assist/customerManagement/followUpDetail?id=" + id
				})
			},
			//更多==》点击选择
			clickGrid(name) {
				this.showAction = false;
				switch (name) {
					case 0: //编辑客户
						uni.navigateTo({
							url: "/pages/assist/customerManagement/newCustomer?returnPageNumber=1&isUpdata=true&customerId=" +
								this.id
						})
						break;
					case 1: //重点关注 或者 取消关注
						this.changeFocus();
						break;
					case 2: //删除客户
						this.showDelete = true;
						break;
					case 3: //上传附件
						// uni.navigateTo({
						// 	url: "/pages/assist/documentManagement/relevantAttachments"
						// })
						this.handleUpload();
						break;
					default:
						break;
				}
			},
			//底部按钮
			changeTabbar(name) {
				if (name == 0) { //写新跟进
					const params = {
						id: this.detail.id,
						name: this.detail.name
					}
					uni.navigateTo({
						url: "/pages/assist/customerManagement/newFollowUp?type=add&params=" + JSON.stringify(
							params)
					})
				}
				if (name == 1) { //拨打电话
					this.phone();
				}
				if (name == 2) { //转移客户
					uni.navigateTo({
						url: "/pages/assist/customerManagement/transferCustomers?id=" + this.detail.id
					})
				}
			},
			// 拨打电话
			phone(p) {
				uni.makePhoneCall({
					phoneNumber: this.contactDetail.phoneNumber
				}).catch((e) => {
					// console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
				})
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
			// 获取文件类型字典
			getDictItems(dictCode) {
				let data = "?dictCode=" + dictCode
				getDictItemsByCode(data, res => {
					if (res.code == 200 && res.success) {
						this.fileTypeOptions = res.result.map(mi => {
							if (['.xls', '.xlsx'].includes(mi.label)) {
								mi.src = '/static/img/assist/icon_file_xls.png';
							}
							if (['.doc', '.docx'].includes(mi.label)) {
								mi.src = '/static/img/assist/icon_file_doc.png';
							}
							if (['.pdf'].includes(mi.label)) {
								mi.src = '/static/img/assist/icon_file_pdf.png';
							}
							if (['.jpg', '.jpeg', '.png'].includes(mi.label)) {
								mi.src = '/static/img/assist/icon_file_png.png';
							}
							if (['.zip'].includes(mi.label)) {
								mi.src = '/static/img/assist/icon_file_rar.png';
							}
							if (['.txt'].includes(mi.label)) {
								mi.src = '/static/img/assist/icon_file_txt.png';
							}
							return mi;
						});
					} else {
						uni.$u.toast(res.message);
					}
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
			changeFocus() {
				const collect = !Boolean(this.detail.collect)
				const data = {
					collect,
					id: this.id
				}
				editCustomerCollect(data, res => {
					this.detail.collect = this.detail.collect == 0 ? 1 : 0;
					if (res.code == 200 && res.success) {
						const title = collect ? '关注成功' : '取消关注成功'
						uni.showToast({
							title
						});
					} else {
						uni.$u.toast(res.message);
					}
				})
			},
			handleUpload() {
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						this.uploadToServer(res);
					}
				});
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
				let data = '?id=' + this.id
				customerDelete(data, res => {
					if (res.code == 200 && res.success) {
						this.showDelete = false
						uni.showToast({
							title: "删除成功!"
						});
						uni.$emit('return', true);
						uni.navigateBack();
					} else {
						uni.$u.toast(res.message);
					}
				})
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
				background: rgba(223, 237, 255, 1);
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
					color: rgba(0, 114, 255, 1);
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
