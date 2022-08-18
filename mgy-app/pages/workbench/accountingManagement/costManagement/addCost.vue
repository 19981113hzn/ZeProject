<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>

		<view v-if="isUpdate && isLoading">
			<u-loading-icon text="加载中" textSize="18" :vertical="true" size="32"></u-loading-icon>
		</view>
		<view v-else>
			<u--form :model="itemInfo" ref="form1" labelPosition="left" labelWidth="80">
				<view class="top-height">
					<u-form-item label="项目名称" prop="projectName" :required="true" ref="item1">
						<u--input v-model="itemInfo.projectName" border="none" placeholder="请选择" :disabled="disabled"
							disabledColor="#ffffff" clearable maxlength="30"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="项目编号" prop="projectCode" borderBottom ref="item1">
						<u--input v-model="itemInfo.projectCode" border="none" placeholder="系统自动生成" clearable disabled
							disabledColor="#ffffff" maxlength="30"></u--input>
					</u-form-item>
				</view>
				<view class="top-height">
					<u-form-item label="费用名称" prop="expenseName" :required="true" borderBottom ref="item1">
						<u--input v-model="itemInfo.expenseName" border="none" placeholder="请填写" maxlength="30"
							clearable></u--input>
					</u-form-item>
					<u-form-item label="费用类型" prop="expenseTypeName" :required="true" borderBottom ref="item1"
						@click="clickExpense(); hideKeyboard()">
						<u--input v-model="expenseTypeName" border="none" placeholder="请选择" clearable disabled
							disabledColor="#ffffff"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="费用金额(元)" prop="amounts" :required="true" ref="item1" labelWidth="105">
						<u--input v-model="itemInfo.amounts" border="none" placeholder="请填写" maxlength="30" clearable
							type="digit"></u--input>
					</u-form-item>
				</view>
				<view class="top-height">
					<u-form-item label="费用描述" prop="memo" ref="item1"></u-form-item>
					<u--textarea v-model="itemInfo.memo" border="none" placeholder="请输入费用描述" maxlength="300">
					</u--textarea>
				</view>
				<view class="top-height">
					<u-form-item label="发送时间" prop="happenTime" ref="item1" :required="true"
						@click="showDatePicker = true; hideKeyboard()">
						<u--input v-model="itemInfo.happenTime" border="none" placeholder="请选择" clearable disabled
							disabledColor="#ffffff"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
				</view>
				<view class="top-height">
					<u-form-item label="附件" prop="itemInfo.name" ref="item1"></u-form-item>
					<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="6" :maxCount="5"
						multiple width="55" height="55">
						<image src="/static/img/workbench/icon_upload.png" mode="widthFix"
							style="width: 55px;height: 55px;"></image>
					</u-upload>
				</view>
			</u--form>
			<view style="padding: 40px 16px 16px;">
				<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="saveCost"></u-button>
			</view>
		</view>


		<u-datetime-picker :show="showDatePicker" v-model="datetime" mode="date" :minDate="minDate" :maxDate="maxDate"
			:formatter="formatter" closeOnClickOverlay @close="showDatePicker=false" @cancel="showDatePicker=false"
			@confirm="confirm"></u-datetime-picker>

		<u-picker :show="showPicker" :columns="lstExpense_type" keyName="label" closeOnClickOverlay
			:defaultIndex="defaultIndex" @close="showPicker=false" @cancel="showPicker=false"
			@confirm="confirmExpense_type"></u-picker>

		<u-modal :content="modalContent" :show="showModal" :title="modalTitle" showCancelButton closeOnClickOverlay
			@confirm="confirmModal" @cancel="showModal=false" @close="showModal=false"></u-modal>
		<u-overlay :show="showOverlay">
			<view class="warp">
				<u-loading-icon color="#fff" text="加载中" textSize="18" size="32" :vertical="true"></u-loading-icon>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	import {
		js_date_time,
		GetNowFormatDate
	} from "@/util/js_DateTime.js"
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getDictItemsByCode,
		uploadPicture,
		deletePicture,
		costManageAdd,
		costManageEdit
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				isUpdate: false,
				isLoading: false, //加载中
				disabled: false,
				navTitle: "新建费用单",
				showDatePicker: false,
				userInfo: {},
				minDate: "",
				maxDate: "",
				datetime: js_date_time(new Date()),
				showPicker: false,
				lstExpense_type: [],
				defaultIndex: [],
				expenseTypeName: "", //费用类型名称
				fileList: [
					//{url:"http://192.168.196.37:81/group1/M00/00/03/wKjEJWKsGhuAOEYhAAD7inVR1dk156.jpg"}
				],
				showOverlay: false,
				itemInfo: {
					amounts: "", //费用金额
					chargeId: "", //负责人员
					orgId: "", //组织ID
					//createBy: "",//负责人员名称
					createTime: GetNowFormatDate("yyyy-MM-dd hh:mm:ss"),
					expenseName: "", //费用名称
					expenseType: "", //费用类型
					happenTime: "", //发生时间
					id: "",
					memo: "", //费用描述
					projectCode: "", //项目编号
					projectName: "", //项目名称
					status: "1", //状态 1未报销
					// updateBy: "",
					// updateTime: "",
					uploadUrlId: "", //上传附件id（多个用“,”隔开）

				},
				rawCostInfo: {}, //获取表单时的原始数据
				diffCostInfo: {}, //差异数据
				modalContent: "",
				modalTitle: "",
				showModal: false,
				deleteFile: [],
				editFile: [],
				returnPageNumber: 1,
				isClick: false, //防止重复点击保存按钮
			}
		},
		onLoad(option) {
			let isUpdate = isEmpty(option.isUpdate) ? false : option.isUpdate;
			this.isUpdate = isUpdate;
			this.returnPageNumber = isEmpty(option.returnPageNumber) ? 1 : parseInt(option.returnPageNumber);
			let date = new Date()
			date.setFullYear(date.getFullYear() - 10);
			this.minDate = Date.parse(new Date(date));
			this.maxDate = Date.parse(new Date());
			this.getDictItems()

			if (!this.isUpdate) {
				//this.itemInfo.projectCode = "PM" + this.generateTimeReqestNumber();
				this.userInfo = this.$cache.get('_userInfo');
				this.itemInfo.chargeId = this.userInfo.id;
				//this.itemInfo.departId=this.userInfo.deptIds;
				this.itemInfo.orgId = this.userInfo.orgId;
			} else {
				this.isLoading = true;
				this.getUpdateData();
			}

		},
		onUnload() {
			if (this.isUpdate) { //清空添加了，右不保存的图片数据
				for (let i = 0; i < this.editFile.length; i++) {
					let fileId = "?fileId=" + this.editFile[i].id
					deletePicture(fileId, res => {
						console.log(res)
						if (res.code == 200 && res.success) {

						} else {
							uni.$u.toast(res.message);
						}
					})
					if (i == (this.editFile.length - 1)) {
						this.editFile = [];
					}
				}
			}
		},
		methods: {
			//利用当前时间生成yyyymmddhhmmss这样的字符串
			generateTimeReqestNumber() {
				var date = new Date();
				return date.getFullYear().toString() +
					this.pad2(date.getMonth() + 1) + this.pad2(date.getDate()) +
					this.pad2(date.getHours()) + this.pad2(date.getMinutes()) +
					this.pad2(date.getSeconds()) + this.pad2(date.getMilliseconds());
			},
			pad2(n) {
				return n < 10 ? '0' + n : n
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				}
				if (type === 'month') {
					return `${value}月`
				}
				if (type === 'day') {
					return `${value}日`
				}
				return value
			},
			getUpdateData() {
				this.disabled = true
				let feeDetail = uni.getStorageSync("feeDetails");
				this.navTitle = "编辑费用单";
				this.expenseTypeName = feeDetail.expenseTypeName;
				this.datetime = feeDetail.happenTime;
				this.itemInfo = {
					amounts: feeDetail.amounts, //费用金额
					chargeId: feeDetail.chargeId, //负责人员
					orgId: feeDetail.orgId, //组织ID
					//createBy: "",//负责人员名称
					createTime: feeDetail.createTime,
					expenseName: feeDetail.expenseName, //费用名称
					expenseType: feeDetail.expenseType, //费用类型
					happenTime: feeDetail.happenTime, //发生时间
					id: feeDetail.id,
					memo: feeDetail.memo, //费用描述
					projectCode: feeDetail.projectCode, //项目编号
					projectName: feeDetail.projectName, //项目名称
					status: feeDetail.status, //状态 1未报销					
					uploadUrlId: feeDetail.uploadUrlId, //上传附件id（多个用“,”隔开）
				}
				if (!isEmpty(feeDetail.mapList)) {
					for (let i = 0; i < feeDetail.mapList.length; i++) {
						this.fileList.push({
							url: feeDetail.mapList[i].url,
							id: feeDetail.mapList[i].fileId
						})
						if (i == (feeDetail.mapList.length - 1)) {
							this.isLoading = false;
							this.rawCostInfo = {
								...this.itemInfo
							}; //原始数据
							this.diffCostInfo = {};
						}
					}
				} else {
					this.isLoading = false;
					this.rawCostInfo = {
						...this.itemInfo
					}; //原始数据
					this.diffCostInfo = {};
				}

			},
			//费用类型
			getDictItems() {
				let data = "?dictCode=expense_type"
				getDictItemsByCode(data, res => {
					if (res.code == 200 && res.success) {
						this.lstExpense_type.push(res.result)
						getApp().globalData.lstExpense_type = this.lstExpense_type;
					} else {
						uni.$u.toast(res.message);
					}
					console.log(res)
				})
			},
			// 删除图片
			deletePic(event) {
				console.log(event)
				let url = event.file.url;
				let id = event.file.id
				if (this.isUpdate) {
					this.deleteFile.push(event.file);
					let ids = "";
					this.fileList.splice(event.index, 1)
					for (let i = 0; i < this.fileList.length; i++) {
						ids = isEmpty(ids) ? this.fileList[i].id : (ids + ',' + this.fileList[i].id)
					}
					this.itemInfo.uploadUrlId = ids
				} else {
					let data = "?fileId=" + id
					deletePicture(data, res => {
						if (res.code == 200 && res.success) {
							let ids = "";
							this.fileList.splice(event.index, 1)
							for (let i = 0; i < this.fileList.length; i++) {
								ids = isEmpty(ids) ? this.fileList[i].id : (ids + ',' + this.fileList[i].id)
							}
							this.itemInfo.uploadUrlId = ids
							console.log(this.itemInfo)
						} else {
							uni.$u.toast(res.message);
						}
					})
				}


			},
			// 新增图片
			async afterRead(event) {
				let that = this;
				that.showOverlay = true;
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)

				// let fileListLen = this.fileList.length
				// lists.map((item) => {
				// 	this.fileList.push({
				// 		...item,
				// 		//status: 'uploading',
				// 		message: '上传中'
				// 	})
				// })
				// that.showOverlay=false;
				let ids = that.itemInfo.uploadUrlId;
				for (let i = 0; i < lists.length; i++) {
					//console.log(lists[i])
					let isLt2M = lists[i].size / 1024 / 1024 < 2;
					if (!isLt2M) {
						uni.$u.toast("图片不得大于2MB!");
					} else {
						//let lstFiles=that.fileList;

						uploadPicture(lists[i].url, "file", {
							user: "test"
						}, res => {
							let data = JSON.parse(res)
							if (data.code == 200 && data.success) {
								let id = data.result.fileId;
								let path = data.result.url;
								that.fileList.push({
									url: path,
									id: id
								})
								that.editFile.push({
									url: path,
									id: id
								})
								console.log(that.fileList)
								ids = isEmpty(ids) ? id : (ids + ',' + id)
								this.itemInfo.uploadUrlId = ids
								console.log(that.itemInfo)
							} else {
								uni.$u.toast(data.message);
							}
							if (i == (lists.length - 1)) {
								that.showOverlay = false;
							}
							console.log(data)
						})
					}
				}

			},
			//取消按钮
			leftClick() {
				this.showModal = true;
				this.modalTitle = "是否取消";
				this.modalContent = "资料尚未提交，是否取消编辑？"
				//uni.navigateBack() 
			},
			//取消按钮 ==》弹出确认按钮
			confirmModal() {
				uni.navigateBack({
					delta: this.returnPageNumber
				});
			},
			//隐藏键盘
			hideKeyboard() {
				uni.hideKeyboard()
			},
			//发生时间  确认按钮
			confirm(e) {
				const timeFormat = uni.$u.timeFormat;
				this.itemInfo.happenTime = timeFormat(e.value, 'yyyy-mm-dd');
				//this.$set(this.itemInfo, "datetime",datetime);
				this.showDatePicker = false;
				//console.log(e)
			},
			clickExpense() {
				this.showPicker = true;
			},
			//费用类型  确认按钮
			confirmExpense_type(e) {
				this.itemInfo.expenseType = e.value[0].value;
				this.expenseTypeName = e.value[0].label;
				this.showPicker = false;
			},
			//验证数据
			validateField() {
				if (isEmpty(this.itemInfo.projectName)) {
					uni.$u.toast("项目名称不能为空");
					return false;
				}
				if (isEmpty(this.itemInfo.expenseName)) {
					uni.$u.toast("费用名称不能为空");
					return false;
				}
				if (isEmpty(this.itemInfo.expenseType)) {
					uni.$u.toast("请选择费用类型");
					return false;
				}
				if (isEmpty(this.itemInfo.amounts)) {
					uni.$u.toast("费用金额不能为空");
					return false;
				}
				if (isEmpty(this.itemInfo.happenTime)) {
					uni.$u.toast("请选择发生时间");
					return false;
				}
				return true;
			},
			//清空编辑的时候，添加了又删除了图片的数据
			deleteImg() {
				console.log(this.deleteFile)
				for (let i = 0; i < this.deleteFile.length; i++) {
					let fileId = "?fileId=" + this.deleteFile[i].id
					deletePicture(fileId, res => {
						console.log(res)
						if (res.code == 200 && res.success) {

						} else {
							uni.$u.toast(res.message);
						}
					})
					if (i == (this.deleteFile.length - 1)) {
						this.deleteFile = [];
					}
				}
			},
			//比较差异的方法
			diffData() {
				// this.rawCostInfo={...this.itemInfo};//原始数据
				// this.diffCostInfo={};
				for (let k in this.rawCostInfo) {
					if (this.rawCostInfo[k] != this.itemInfo[k]) {
						if (!this.diffCostInfo) {
							this.diffCostInfo = {}
						}
						this.diffCostInfo[k] = this.itemInfo[k]
					}
				}
			},
			//保存
			saveCost() {
				if (this.validateField() && !this.isClick) {
					this.isClick = true;
					if (this.isUpdate) { //修改
						console.log(this.itemInfo)
						this.diffData();
						if (JSON.stringify(this.diffCostInfo) == '{}') {
							console.log("未修改任何数据，无需提交");
							this.isUpdate = false;
							uni.navigateBack({
								delta: this.returnPageNumber
							})
						} else {
							let info = {
								id: this.itemInfo.id,
							}
							for (let item in this.diffCostInfo) {
								info[item] = this.diffCostInfo[item];
							}
							console.log(info)
							costManageEdit(this.itemInfo, res => {
								console.log(res)
								if (res.code == 200 && res.success) {
									uni.$u.toast(res.message);
									this.deleteImg();
									uni.$emit('return', true);
									this.isUpdate = false;
									this.empty();
									uni.setStorageSync('feeDetails', res.result)
									uni.navigateBack({
										delta: this.returnPageNumber
									})
								} else {
									uni.$u.toast(res.message);
									this.isClick = false;
								}
							})
						}

					} else { //新增
						costManageAdd(this.itemInfo, res => {
							console.log(res)
							if (res.code == 200 && res.success) {
								uni.$u.toast(res.message);
								this.empty();
								uni.$emit('return', true);
								uni.navigateBack({
									delta: this.returnPageNumber
								})
							} else {
								uni.$u.toast(res.message);
								this.isClick = false;
							}
						})
					}
				}
			},
			empty() {
				this.itemInfo = {
					amounts: "", //费用金额
					chargeId: "", //负责人员
					orgId: "", //组织ID
					//createBy: "",//负责人员名称
					createTime: GetNowFormatDate("yyyy-MM-dd hh:mm:ss"),
					expenseName: "", //费用名称
					expenseType: "", //费用类型
					happenTime: "", //发生时间
					id: "",
					memo: "", //费用描述
					projectCode: "", //项目编号
					projectName: "", //项目名称
					status: "1", //状态 1未报销
					// updateBy: "",
					// updateTime: "",
					uploadUrlId: "", //上传附件id（多个用“,”隔开）

				};
			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	/deep/.top-height {
		margin-top: 10px;
		background: #fff;
		padding: 0 16px;

		.u-form-item__body__left__content__required {
			right: 6px;
			float: right;
			left: unset;
		}

		.uni-input-placeholder {
			text-align: right;
		}

		.u-input__content__field-wrapper__field {
			text-align: right !important;
		}

		.u-textarea {
			padding: unset;
		}

		.u-textarea__field {
			height: 80px !important;
		}

		.uni-textarea-wrapper {
			height: 70px;
		}

		.u-upload {
			padding: 0 0 16px;
		}
	}

	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

		/deep/.u-loading-icon--vertical .u-loading-icon__text {
			color: #fff !important;
		}
	}

	.u-loading-icon {
		margin-top: 30px;
	}





	.container-view {
		padding: 0 16px;

		/deep/.form-item-cell .u-form-item__body__right__content__slot {
			flex-direction: column;
			align-items: normal;
		}

		/deep/.u-cell {
			.u-line {
				border: none !important;
			}

			.u-cell__body {
				padding: 0;
			}

			.u-cell__value {
				color: rgba(0, 0, 0, 0.4);
			}
		}

	}
</style>
