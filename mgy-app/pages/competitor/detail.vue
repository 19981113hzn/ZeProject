<template>
		<view id="detailBox">
			<scroll-view scroll-y class="detailBox"  @scroll="scroll">
			<u-navbar class="navbar" :title="reimburseDetails.name || '竞争对手详情'" :border="false" safeAreaInsetTop fixed placeholder @leftClick="leftClick"
				@rightClick="rightClick" v-show="showNavbar">
				<view class="u-nav-slot" slot="right">
					<image class="logo" src="/static/img/assist/detail_more.png"></image>
				</view>
			</u-navbar>
			
			<view class="navbarBox">
			<div class="linkBox">
				<u-cell-group class="sign-out" :border="false" :style="'top:'+statusBarHeight+'px'">
					<u-cell  size="large" class="icoBox">
						<view class="imgBox" slot="icon" @click="leftClick">
							<image class="logo_back" src="/static/img/icon_bark_left.png"></image>
						</view>
						<view class="imgBox" slot="icon" @click="rightClick">
							<image class="user-head_more" src="/static/img/assist/icon_gdb.png"></image>
						</view>
					</u-cell>
				</u-cell-group>
			</div>
			
		</view>
		<view style="clear: both;"></view>
		<u-loading-icon v-if="!isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<view v-else class="contentBigBox">
			<view class="main-head"></view>
			<view class="main-foot"></view>
			<view class="main-crad">
				<view class="card_top">
					<view class="companyType">
					<!-- {{reimburseDetails.name.slice(0,4)}} -->
					<view class="logo-icon-txt">
						{{reimburseDetails.name.slice(0,4)}}
					</view>
					</view>
					
					<view class="contentBox">
						<view class="company_title">
							{{reimburseDetails.name || '-'}}
						</view>
						<view class="desBox">
							<view class="company_type">{{companyOrgTypeName || '未知公司类型'}}</view>
							<view :class="reimburseDetails.competitivePower == 1 ? 'company_des':reimburseDetails.competitivePower == 2 ?'company_des_B':reimburseDetails.competitivePower == 3 ? 'company_des_C':''" v-if="competitivePowerName">{{'竞争能力' + competitivePowerName}}</view>
							<view class="company_des" style="color:#909399;background-color: #F1F5FA;" v-else>未设置竞争能力</view>
						</view>
					</view>
				</view>
				<view class="addressBox" @click="gotoMap(reimburseDetails.area)">
					<image class="logo_tips" src="/static/img/icon_dq.png" ></image>
					<view style="margin-right: 10px;">
						{{reimburseDetails.area || '暂无所在地区'}}
					</view>
					<image class="logo_tips" src="/static/img/icon_rygm.png" ></image>
					{{staffNumRangeName || '暂无人员规模'}}
				</view>
				<u--form labelWidth="75">
					<u-cell :title="'负责人员: ' + (reimburseDetails.chargeUserName || '-')" class="whose" id="find">
						<image class="logo_tips" slot="icon" src="/static/img/icon_fzry2.png"></image>
					</u-cell>
				</u--form>
			</view>
			<view class="main-content">
				<u-tabs :list="lsyTabs" @change="changeClick" :scrollable="false" lineWidth="59"></u-tabs>
			</view>
			<view v-show="current == 0">
				<view>
					<view class="card">
						<view class="card-pa">
							<u-cell title="公司介绍"></u-cell>
							<u--form labelWidth="75" class="readMoreBox">
								<u-read-more :toggle="true" showHeight="120" closeText="展开" style="background-color: #FFFFFF;padding-bottom: 6px;">
									<rich-text :nodes="reimburseDetails.companyIntroduction || '-' " @load="load"
										class="richTextContent" style="color:#303133"></rich-text>
								</u-read-more>
							</u--form>
						</view>
					</view>
					<view class="lineBox">
						<u-divider text=""></u-divider>
					</view>
					<view class="card">
						<view class="card-pa">
							<u-cell title="基本信息"></u-cell>
							<u--form labelWidth="95">
								<u-form-item label="公司名称">
									<text>{{reimburseDetails.name || '-'}}</text>
								</u-form-item>
								<u-form-item label="竞争对手能力">
									<text>{{competitivePowerName || '-'}}</text>
								</u-form-item>
								<u-form-item label="纳税人识别号">
									<text>{{reimburseDetails.taxNumber || '-'}}</text>
								</u-form-item>
								<u-form-item label="经营状态">
									<text>{{operatingStateName || '-'}}</text>
								</u-form-item>
								<u-form-item label="企业类型">
									<text>{{companyOrgTypeName || '-'}}</text>
								</u-form-item>
								<u-form-item label="人员规模">
									<text>{{staffNumRangeName || '-'}}</text>
								</u-form-item>
								<u-form-item label="小微企业">
									<text>{{isMicroEntName || '-'}}</text>
								</u-form-item>
								<u-form-item label="详细地址" @click="gotoMap(reimburseDetails.address)">
									<text style="color:#2979ff">
										<u-icon name="map-fill" color="#2979ff" size="20" style="display: inline-block;"
											v-if="reimburseDetails.address"></u-icon>{{reimburseDetails.address || '-'}}
									</text>
								</u-form-item>
								<u-form-item label="负责人员">
									<text>{{reimburseDetails.chargeUserName || '-'}}</text>
								</u-form-item>
								<u-form-item label="创建人员">
									<text>{{reimburseDetails.createUserName || '-'}}</text>
								</u-form-item>
								<u-form-item label="创建时间">
									<text>{{reimburseDetails.createTime || '-'}}</text>
								</u-form-item>
								<u-form-item label="最后更新">
									<text>{{reimburseDetails.updateTime || '-'}}</text>
								</u-form-item>
							</u--form>
						</view>
					</view>
					<view class="card">
						<view class="card-pa product">
							<u-cell title="主要产品"></u-cell>
							<u--form labelWidth="0">
								<u-read-more :toggle="true" showHeight="70" closeText="展开">
									<rich-text :nodes="reimburseDetails.competitiveProduction || '-'" @load="load"
										class="richTextContent"></rich-text>
								</u-read-more>
							</u--form>
						</view>
					</view>
					<view class="card">
						<view class="card-pa product">
							<u-cell title="优势"></u-cell>
							<u--form labelWidth="0">
								<u-read-more :toggle="true" showHeight="70" closeText="展开">
									<rich-text :nodes="reimburseDetails.advantage || '-'" @load="load" class="richTextContent">
									</rich-text>
								</u-read-more>
							</u--form>
						</view>
					</view>
					<view class="card">
						<view class="card-pa product">
							<u-cell title="劣势"></u-cell>
							<u--form labelWidth="0">
								<u-read-more :toggle="true" showHeight="70" closeText="展开">
									<rich-text :nodes="reimburseDetails.disadvantage || '-'" @load="load"
										class="richTextContent"></rich-text>
								</u-read-more>
							</u--form>
						</view>
					</view>
					
					<view class="card">
						<view class="card-pa product">
							<u-cell title="应对策略"></u-cell>
							<u--form labelWidth="0">
								<u-read-more :toggle="true" showHeight="70" closeText="展开">
									<rich-text :nodes="reimburseDetails.copingStrategies || '-'" @load="load"
										class="richTextContent"></rich-text>
								</u-read-more>
							</u--form>
						</view>
					</view>
				</view>
			</view>
			<view v-show="current == 1">
				<view v-if="reimburseDetails.commentList.length > 0">
					<view class="card">
						<view class="card-pa commentList">
							<u--form labelWidth="75">
								<view class="commentListBox" v-for="item in reimburseDetails.commentList"
									:key="item.id">
									<view class="commentList_top">
										<view class="commentList_top_left">
											<image class="user-head_comment"
												src="/static/img/workbench/icon_user_head.png"></image>
											<view class="comment_name">{{item.createBy}}</view>
											<view class="comment_job"></view>
										</view>
										<view class="commentList_top_time">{{item.createTime}}</view>
									</view>
									<view class="comment_content">{{item.comment}}</view>
								</view>
							</u--form>
						</view>
					</view>
				</view>
				<view v-else class="icon_PDF_Box">
					<view>
						<image class="icon_PDF" src="/static/img/icon_PDF.png"></image>
						<view class="noComment">暂无评论</view>
					</view>
				</view>
			</view>
			<view v-show="current == 2">
				<view v-if="reimburseDetails.documentList.length > 0">
					<view class="cost-card" v-for="(item, index) in reimburseDetails.documentList" :key="index"
						@click="toReadFiles(item.url)">
						<view class="card-pa files">
							<view class="fileCard">
								<image class="ico_file" src="/static/img/icon_exl-exls.png"></image>
								<view class="fileTitleBox">
									<view class="fileName">{{item.name}}</view>
									<view class="fileDes">
										<view class="uper">{{item.uploadUserName}}</view>
										<view class="upTime">{{item.createTime}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="icon_PDF_Box">
					<view>
						<!-- <image class="icon_PDF" src="/static/img/icon_file_txt.png"></image> -->
						<image class="icon_PDF" src="/static/img/icon_PDF.png"></image>
						<view class="noComment">暂无附件</view>
					</view>
				</view>
			</view>
		</view>
		<u-tabbar :value="numTabbar" @change="changeTabbar" :fixed="true" :placeholder="true"
			:safeAreaInsetBottom="true">
			<u-tabbar-item text="发布评论">
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_pls.png"></image>
			</u-tabbar-item>
			<u-tabbar-item text="上传附件">
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_fjs.png"></image>
				<!-- 	<u-upload
						@afterRead="afterRead"
						@delete="deletePic"
						name="6"
						:maxCount="5"
						multiple
						width="155"
						height="155"
					>
						<image src="/static/img/workbench/icon_upload.png" 
						mode="widthFix" style="width: 155px;height: 155px;"></image>
					</u-upload> -->
			</u-tabbar-item>
			<u-tabbar-item text="编辑记录">
				<image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/img/icon_bjs.png"></image>
			</u-tabbar-item>
		</u-tabbar>
		<u-modal :show="showDelete" title="删除确认" content='确定要删除该条记录吗？' @cancel="showDelete=false"
			@close="showDelete=false" @confirm="confirmDelete" showCancelButton closeOnClickOverlay></u-modal>
		<u-toast ref="uToast"></u-toast>

		<view class="deletePop" v-if="deletePop">
			<view class="deleteBtn" @click="deleteEven">删除</view>
			<view class="cancelBtn" @click="cancelEven">取消</view>
		</view>
		<view class="sallBox" v-show="commentPopShow">
			<u--input ref="inputVal" type="text" placeholder="我来说两句" class="sall" v-model="comment"
				autofocus="autofocus"></u--input>
			<view class="SendBtn">
				<u-button type="primary" size="small" text="发表" class="Send" @click="sendEven"></u-button>
			</view>
		</view>
		<u-overlay :show="showOverlay">
			<view class="warp">
				<u-loading-icon color="#fff" text="加载中" textSize="18" size="32" :vertical="true"></u-loading-icon>
			</view>
		</u-overlay>
		</scroll-view>
	</view>
</template>

<script>
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		toMap
	} from "@/util/map.js"
	import {
		getCompetitorDetail,
		sumExpenseOperate,
		sumExpenseEdit,
		sumExpenseDelete,
		uploadAttachment,
		competitorDelete,
		uploadPicture,
		uploadPicturePlus,
		commentAdd
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				comment: '',
				fileList: [
					//{url:"http://192.168.196.37:81/group1/M00/00/03/wKjEJWKsGhuAOEYhAAD7inVR1dk156.jpg"}
				],
				showOverlay: false,
				commentPopShow: false,
				value: '',
				deletePop: false,
				// statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				statusBarHeight: 0, //状态栏高度
				lsyTabs: [{
					name: "资料详情",
				}, {
					name: "评论列表"
				}, {
					name: "相关附件"
				}],
				showDelete: false,
				showNavbar:false,
				numTabbar: "",
				procInstId: "",
				reimbursId: "",
				current: 0,
				reimburseDetails: {},
				lstdynamic: [],
				isLoading: false, //加载中
				id: '',
				supplierLevelName: '',
				companyOrgTypeName: '',
				competitivePower_dictText: '',
				staffNumRangeName: '',
				isMicroEntName: '',
				operatingStateName: '',
				competitivePowerName: '',
				supplier_level: JSON.parse(uni.getStorageSync('supplier_level')), //供应商级别
				company_org_type: JSON.parse(uni.getStorageSync('company_org_type')), //企业类型
				staff_num_range: JSON.parse(uni.getStorageSync('staff_num_range')), //企业规模：
				is_micro_ent: JSON.parse(uni.getStorageSync('is_micro_ent')), //小微企业：
				operating_state: JSON.parse(uni.getStorageSync('operating_state')), //经营状态：
				competitive_power: JSON.parse(uni.getStorageSync('competitive_power')) //竞争对手强弱
			}
		},
		onLoad(option) {
			this.id = option.id
			this.getData();
			uni.onKeyboardHeightChange((res) => {
				// console.log('键盘变化',res.height)
				if (res.height == 0) {
					this.$refs.inputVal.focus = false
					this.commentPopShow = false
					uni.hideKeyboard()
				}
			})
			this.statusBarHeight = plus.navigator.getStatusbarHeight();//状态栏高度
		},
		onShow() {
			this.getData();
		},
		methods: {
			scroll(event) {
				if(event.detail.scrollTop > 50){
					this.showNavbar = true
				}else{
					this.showNavbar = false
				}
			},
			toJSON() {},
			gotoMap(area) {
				toMap(area)
			},
			toReadFiles(url) {
				console.log('预览地址',url)
				uni.downloadFile({
					 url: url,
					 success: function (res) {
		　　　　　　　　  if(res.tempFilePath.indexOf(".png" ||".jpg") > -1)
		　　　　　　　　　{
		　　　　　　　　　　　　var filePath = [] 
		　　　　　　　　　　　　filePath[0]=res.tempFilePath; 
		　　　　　　　　　　　　// 预览图片 
		　　　　　　　　　　　　uni.previewImage({ 
		　　　　　　　　　　　　　　urls: filePath, 
		　　　　　　　　　　　　　　success: function (res) { 　　
		　　　　　　　　　　　　　　　　console.log('打开成功') 
		　　　　　　　　　　　　　　}, 
		　　　　　　　　　　　　　　fail:function(res){ 
		　　　　　　　　　　　　　　　　console.log(res) 
		　　　　　　　　　　　　　　} 
		　　　　　　　　　　　　})
		　　　　　　　　　}
		　　　　　　　　　else
		　　　　　　　　　{
		　　　　　　　　　　var filePath = res.tempFilePath;
		　　　　　　　　　　uni.openDocument({
							   filePath: filePath,
							   success: function (res) {
									console.log('打开文档成功');
							   }
						 });
		　　　　　　　　　}
					 },
					 fail:function (res){
						console.log(res)
					}
				});
				// uni.navigateTo({
				// 	url: "/pages/review/index?url=" + url
				// })
			},
			sendEven() {
				let _userInfo = uni.getStorageSync("_userInfo").data;
				let data = {
					"businessCode": "Competitor",
					"businessId": this.id,
					"comment": this.comment,
					"createBy": _userInfo.realname,
					"delFlag": 0,
					"id": "",
					"userId": _userInfo.id,
					"username": _userInfo.username
				}
				commentAdd(data, res => {
					this.comment = ''
					if (res.code === 200) {
						uni.showToast({
							title: "评论成功!"
						});
					}
					setTimeout(() => {
						this.getData();
						this.current = 0
						this.commentPopShow = false
						this.$refs.inputVal.focus = false
					}, 500)
				})
			},
			load() {
				this.$refs.uReadMore.init();
			},
			deleteEven() {
				this.showDelete = true
				this.deletePop = false
			},
			cancelEven() {
				this.deletePop = false
			},
			rightClick() {
				this.deletePop = true
			},
			getData() {
				this.isLoading = false;
				let data = "/" + this.id;
				getCompetitorDetail(data, res => {
					if (res.code == 200 && res.success) {
						this.reimburseDetails = res.result
						// 竞争对手能力级别
						this.competitive_power.forEach((v) => {
							if (v.value == this.reimburseDetails.competitivePower) {
								this.competitivePowerName = v.text
							}
						})
						// 企业类型
						this.company_org_type.forEach((v) => {
							if (v.value == this.reimburseDetails.companyOrgType) {
								this.companyOrgTypeName = v.text
							}
						})
						//企业规模
						this.staff_num_range.forEach((v) => {
							if (v.value == this.reimburseDetails.staffNumRange) {
								this.staffNumRangeName = v.text
							}
						})
						// 小微企业
						this.is_micro_ent.forEach((v) => {
							if (v.value == this.reimburseDetails.isMicroEnt) {
								this.isMicroEntName = v.text
							}
						})
						// 经营状态
						this.operating_state.forEach((v) => {
							if (v.value == this.reimburseDetails.operatingState) {
								this.operatingStateName = v.text
							}
						})
						// this.getTrace()
						this.isLoading = true;
					} else {
						uni.$u.toast(res.message);
					}
					this.changeClick({
						index: 0
					})
				})
			},
			numFilter(value) {
				// 截取当前数据到小数点后两位
				let tempVal = parseFloat(value).toFixed(3);
				let realVal = tempVal.substring(0, tempVal.length - 1);
				return realVal;
			},
			leftClick() {
				uni.navigateBack();
			},
			changeClick(item) {
				this.current = item.index
				console.log('666', this.current)
			},
			changeTabbar(name) {
				console.log('name', name)
				if (name == 0) {
					this.commentPopShow = true
					this.$refs.inputVal.focus = true
				}
				if (name == 1) {
					uni.chooseImage({
						count: 9, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], //从相册选择
						success: (res) => {
							this.uploadToServer(res);
						}
					});
				}
				if (name == 2) {
					uni.setStorageSync('dataDetailSupplierEdit', this.reimburseDetails)
					uni.navigateTo({
						url: "/pages/competitor/addCompetitor?comefrom=" + 'detail'
					})
				}
			},

			confirmDelete() {
				let data = '/' + this.id
				competitorDelete(data, res => {
					if (res.code == 200 && res.success) {
						this.showDelete = false
						this.$refs.uToast.show({
							type: 'success',
							message: "删除成功",
						})
						uni.$emit('return', true);
						uni.navigateBack();
					} else {
						uni.$u.toast(res.message);
					}
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
					businessCode: 'Competitor',
					businessId: this.id,
					fileIdList,
					contentType: 'application/x-www-form-urlencoded',
				}
				uploadAttachment(formData, res => {
					if (res.code == 200 && res.success) {
						uni.showToast({
							title: "上传成功!"
						});
						this.getData();
						this.current = 2;
					} else {
						uni.$u.toast(res.message);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.logo {
		width: 24px;
		height: 24px;
	}

	/deep/.u-navbar__content .u-navbar__content__title {
		color: #fff;
	}

	/deep/.sign-out {
		background: rgba(0, 114, 255, 1);

		/deep/ .u-line {
			border: none !important;
			border-bottom: 1px solid #fff !important;
		}

		.logo {
			width: 18px;
			height: 18px;
		}

		.u-cell__title-text {
			color: #fff;
			font-size: 17px;
		}

		.user-head {
			width: 58px;
			height: 58px;
			border-radius: 4px;
			margin-right: 10px;
		}
	}

	.main-head {
		height: 60px;
		// background: rgba(0, 114, 255, 1);

	}

	.main-foot {
		height: 36px;
		background: rgba(0, 114, 255, 1);
		border-radius: 50%;
		margin-top: -18px;
	}

	/deep/.main-crad {
		// padding: 0 16px;
		background-color: #fff;
		padding: 16px;
		border-radius: 16px 16px 0px 0px !important;
		margin-top: -98px;
		z-index: 99999;

		.main-crad-bg {
			background: #fff;
			height: 147px;
			border-radius: 4px;
			margin-top: -118px;
			padding: 16px 0 0 16px;

			.card-name {
				display: block;
				color: rgba(96, 98, 102, 1);
				font-size: 14px;
				line-height: 28px;
			}

			.card-num {
				font-size: 24px;
				line-height: 28px;
				font-weight: bold;
				color: rgba(0, 0, 0, 1);
			}

			.u-cell__body {
				padding: 10px 0px 0;
			}

			/deep/ .u-line {
				border: none !important;
				border-bottom: 1px solid #fff !important;
			}

			.u-cell__title-text {
				color: rgba(96, 98, 102, 1);
				font-size: 14px;
			}

			.icon-slot {
				width: 24px;
				height: 24px;
				margin-right: 5px;
			}

			.card-money {
				width: 106px;
				height: 110px;
				display: block;
				float: right;
				position: relative;
				top: 40px;
			}
		}
	}

	/deep/.main-content {
		// margin-top: 16px;
		background: #fff;
		border-bottom: 1px solid #dadbde;
		;
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

				/deep/ .u-line {
					border: none !important;
					border-bottom: 1px solid #fff !important;
				}

				.text-tag {
					margin-left: 8px;
					font-size: 14px;
					color: rgba(96, 98, 102, 1);
				}

				.u-cell__value {
					color: rgba(192, 196, 204, 1);
				}

				.u-cell__title .u-cell-text {
					font-size: 17px;
					color: rgba(48, 49, 51, 1);
				}

				.u-cell__title-text {
					color: rgba(144, 147, 153, 1);
				}

				.u-text {
					padding: 0 16px;
					width: unset;

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

	.card {
		// padding: 8px 0 0;

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
				border-bottom: 1px solid #fff !important;
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

	.cost-card {
		.card-pa {
			padding: 0 16px 16px;
			background: #fff;
			// border-top: 1px solid;
			// border-top-color: #eee;

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
				border-bottom: 1px solid #fff !important;
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

		.tab-adopt {
			span {
				color: rgba(0, 114, 255, 1);
			}
		}

		.tab-reject {
			span {
				color: rgba(250, 85, 85, 1);
			}
		}
	}

	/deep/.u-modal__content__text {
		text-align: center;
	}

	.u-loading-icon {
		margin-top: 30px;
	}

	.card_top {
		// padding: 11px 11px 11px 17px;
		display: flex;

		// .companyType {
		// 	width: 57px;
		// 	height: 57px;
		// 	padding: 8px;
		// 	box-sizing: border-box;
		// 	border-radius: 6px 6px 6px 6px;
		// 	background: #DFEDFF;
		// 	font-size: 18px;
		// 	color: #0072FF;
		// 	line-height: 20px;
		// 	font-weight: bold;
		// 	text-align: center;
		// }
		.companyType{
				background: rgba(223, 237, 255, 1);
				width: 57px;
				height: 57px;
				border-radius: 6px;
				display: flex;
				justify-content: center;
				align-items: center;
				justify-content: center;
				align-items: center;
				.logo-icon-txt{
					font-size: 18px;
					text-align: center;
					border-radius: 5px;
					padding: 8px;
					color: rgba(0, 114, 255, 1);
					font-weight: bold;
				}
		}

		.contentBox {
			flex: 1;
			margin-left: 10px;
			padding-top: 7px;

			.company_title {
				margin-right: 10px;
				// height: 25px;
				font-size: 18px;
				font-weight: bold;
				color: #303133;
				line-height: 21px;
			}

			.desBox {
				display: flex;
				justify-content: flex-start;
				margin-top: 6px;

				.company_type {
					min-width: 73px;
					height: 20px;
					font-size: 12px;
					font-weight: 500;
					color: #909399;
					line-height: 20px;
				}

				.company_des,.company_des_B,.company_des_C{
					// width: 64px;
					height: 20px;
					font-size: 12px;
					font-weight: 500;
					color: #FA5555;
					// line-height: 20px;
					background: #FFF4F4;
					border-radius: 4px 4px 4px 4px;
					padding: 2px 8px;
					box-sizing: border-box;
					margin-left: 10px;
					align-items: center;
				}
				.company_des_B{
					background: #FFF7EA;
					color: #E6A23C;
				}
				.company_des_C{
					background: #EBF4FF;
					color: #0072FF;
				}
			}
		}
	}

	.logo_back {
		width: 24px;
		height: 24px;
	}

	.imgBox {
		padding: 15px;
	}

	.user-head_more {
		width: 24px;
		height: 24px;
	}

	.icoBox /deep/.u-cell__left-icon-wrap {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.addressBox {
		width: 100%;
		height: 19px;
		font-size: 12px;
		font-weight: 500;
		color: #606266;
		line-height: 19px;
		display: flex;
		justify-content: flex-start;
		margin: 11px 0;

		.address_ico {
			margin: 0 5px;
		}
	}

	.whose {
		width: 100%;
		height: 34px;
		background: #FBF8F2;
		border-radius: 6px 6px 6px 6px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 4px 0;

		/deep/ .u-line {
			border: none !important;
			border-bottom: 1px solid #fff !important;
		}
	}

	.whose_ico {
		width: 16px;
		height: 16px;
	}

	.product /deep/.u-form-item__body {
		width: 100%;
		// height: 120px;
		background: #F7F7F7;
		border-radius: 6px 6px 6px 6px;
		padding: 12px !important;
		line-height: 20px;
		box-sizing: border-box;
	}

	.product /deep/.u-form {
		margin-top: 15px;
	}

	.user-head_comment {
		width: 28px;
		height: 28px;
	}

	.commentList {
		padding: 0 17px !important;
	}

	.commentListBox {
		padding: 12px 0;
	}

	.commentList_top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 7px;
		height: 28px;
		line-height: 28px;
	}

	.commentList_top_left {
		display: flex;
		justify-content: flex-start;
	}

	.comment_name {
		height: 28px;
		font-size: 14px;
		font-weight: bold;
		color: #606266;
		margin: 0 4px 0 8px;
	}

	.comment_job {
		width: 48px;
		height: 28px;
		font-size: 12px;
		font-weight: 500;
		color: #909399;
	}

	.commentList_top_time {
		height: 28px;
		font-size: 12px;
		font-weight: 500;
		color: #909399;
	}

	.comment_content {
		// width: 305px;
		// height: 20px;
		font-size: 14px;
		font-weight: 500;
		color: #303133;
		line-height: 20px;
		white-space: pre-line !important;
		word-break: break-all !important;
		word-wrap: break-word !important;
	}

	/deep/ .u-tabbar--fixed {
		padding-bottom: 6px;
	}

	.logo_tips {
		width: 16px;
		height: 16px;
		margin: 0 6px;
	}

	.files {
		padding: 0px 16px !important;
	}

	.fileCard {
		display: flex;
		justify-content: flex-start;
		padding: 10px 0;
	}

	.ico_file {
		width: 34px;
		height: 34px;
		margin-right: 20px;
	}

	.fileName {
		// height: 20px;
		font-size: 14px;
		font-weight: 500;
		color: #303133;
		line-height: 20px;
	}

	.fileDes {
		display: flex;
		justify-content: flex-start;
		color: #909399;
		font-size: 12px;
		margin-top: 3px;
	}

	.uper {
		margin-right: 8px;
	}

	.sallBox {
		width: 100%;
		padding: 13px 16px;
		background-color: #fff;
		box-sizing: border-box;
		// border: 1px solid #CCCCCC;
		position: fixed;
		bottom: 303px;
		left: 0;
		box-shadow: 0px -1px 6px 1px rgba(198, 202, 208, 0.25);
		// height: 440px;
		z-index: 100;
	}

	.sall {
		background-color: #FFFFFF;
		height: 32px;
		background: #F6F7FA;
		border-radius: 20px 20px 20px 20px;
		padding: 5px 16px;
	}

	.deletePop {
		z-index: 99999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.4);
		padding: 0 8px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.deleteBtn {
		width: 100%;
		height: 60px;
		background: rgba(245, 245, 245, 0.7);
		border-radius: 13px 13px 13px 13px;
		font-size: 20px;
		font-weight: 400;
		color: #FF3B30;
		line-height: 60px;
		margin-bottom: 8px;
		text-align: center;
	}

	.cancelBtn {
		width: 100%;
		height: 60px;
		background: #FFFFFF;
		border-radius: 13px 13px 13px 13px;
		font-size: 20px;
		font-weight: 400;
		color: #007AFF;
		line-height: 60px;
		text-align: center;
		margin-bottom: 32px;
	}

	.richTextContent {
		width: 100%;
	}

	.formItem {
		overflow-x: hidden;
	}

	.lineBox {
		width: 100%;
		padding: 0 16px;
		box-sizing: border-box;
		overflow: hidden;
	}

	.u-divider {
		width: 100%;
		margin: 0 !important;
	}

	.SendBtn {
		width: 100%;
		margin: 10px 0;
		display: flex;
		justify-content: flex-end;
	}

	.Send {
		width: 35px;
		border-radius: 15px;
		margin: 0;
	}

	/deep/ p {
		width: 100% !important;
		word-wrap: break-word !important;
		word-break: break-all !important;
		// color: red;
	}

	/deep/ span {
		width: 100% !important;
		word-wrap: break-word !important;
		word-break: break-all !important;
		// overflow-y: auto;
		// color: red;
	}

	.u-read-more {
		background-color: #F7F7F7;
		padding: 12px;
		box-sizing: border-box;
		border-radius: 6px 6px 6px 6px;
	}

	.fileTitleBox {
		width: 100%;
		word-wrap: break-word !important;
		word-break: break-all !important;
	}

	.icon_PDF {
		width: 84px;
		height: 84px;
	}

	.icon_PDF_Box {
		width: 100%;
		display: flex;
		justify-content: center;
		padding-top: 110px;
		background-color: #fff;
		height: calc(100vh - 418px);
		box-sizing: border-box;
	}

	.noComment {
		width: 100%;
		height: 20px;
		font-size: 14px;
		font-weight: 500;
		color: #909399;
		line-height: 20px;
		text-align: center;
		margin-top: 16px;
	}
		.kkkk{
		width: 100vw;
		height: 157px;
	}
	/deep/ .u-navbar__content{
		background-color: transparent !important;
	}
	.navbarBox{
		width: 100%;
		height: 197px;
		background: url(../../static/img/image_18.png);
		background-size:cover;
		
		.linkBox{
			width: 100%;
			height: 100%;
			position: relative;
		}
	}
	.navbarImg{
		width: 100%;
		height: 197px;
		z-index: 100;
	}
	/deep/ .sign-out{
		background-color: transparent !important;
		position: absolute;
		top: 50px;
		left: 0;
		right: 0;
	}
	#detailBox,.detailBox{
		width: 100vw;
		height: 100vh;
		overflow-y: auto;
	}
	.u-cell /deep/ .u-line{
		height: 0;
		border-bottom: 0px solid rgb(214, 215, 217) !important;
	}
	#find /deep/ .u-cell__title-text{
		font-size: 14px !important;
	}
	#find /deep/ .u-cell__body{
		padding: 6px 16px;
	}
	/deep/ .u-navbar--fixed{
		background-color: #FFFFFF !important;
	}
	/deep/ .u-navbar__content__title{
		color: #000000 !important;
	}
	/deep/ .u-read-more__content{
		font-size: 13px;
		line-height: 22px;
		text-indent:0 !important;
		color: #909399 !important;
		
	}
	/deep/ .u-read-more__toggle__text{
		margin-bottom:8px !important;
	}
	/deep/ .u-cell__body--large{
		padding-top: 0 !important;
		padding-bottom: 0 !important;
	}
	.icoBox /deep/  .u-cell__body{
		padding: 0 !important;
	}
	.readMoreBox /deep/ .u-read-more{
		padding: 12px 0;
	}
</style>
<style lang="scss">
	uni-page-wrapper {
		background-color: #fff !important;
	}

	body.pages-supplier-detail /deep/ uni-page-body {
		background-color: #fff !important;
	}
</style>
