<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" safeAreaInsetTop fixed placeholder
			@leftClick="leftClick"></u-navbar>
		<view v-if="isUpdate && isLoading">
			<u-loading-icon text="加载中" textSize="18" :vertical="true" size="32"></u-loading-icon>
		</view>
		<view v-else>
			<u--form :model="itemInfo" ref="form1" labelPosition="left" labelWidth="80">
				<view class="bottom-height">
					<!-- <u-form-item label="添加报价" prop="riseTypeName" ref="item1" @click="clickExpense(); hideKeyboard()">
						<u--input v-model="riseTypeName" border="none" placeholder="请选择" :disabled="disabled"
							disabledColor="#ffffff" clearable maxlength="30"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item> -->
					<u-form-item label="添加报价" prop="riseTypeName" ref="item1" @click="gotoInvoiceDetail()">
						<u--input v-model="riseTypeName" border="none" placeholder="请选择" :disabled="disabled"
							disabledColor="#ffffff" clearable maxlength="30"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
				</view>
				<view class="top-height">
					<u-form-item label="名称" prop="itemName" borderBottom ref="item1">
						<u--input v-model="itemInfo.itemName" border="none" placeholder="请填写" maxlength="30" clearable>
						</u--input>
					</u-form-item>
					<u-form-item label="规格型号" prop="specification" labelWidth="110" borderBottom ref="item1">
						<u--input v-model="itemInfo.specification" border="none" placeholder="请填写" maxlength="30"
							clearable></u--input>
					</u-form-item>
					<u-form-item label="单位" prop="unit" borderBottom ref="item1">
						<u--input v-model="itemInfo.unit" border="none" placeholder="请填写" maxlength="30" clearable>
						</u--input>
					</u-form-item>
					<u-form-item label="数量" prop="quantity" borderBottom ref="item1">
						<u--input v-model="itemInfo.quantity" border="none" placeholder="请填写" maxlength="30" clearable>
						</u--input>
					</u-form-item>
					<u-form-item label="金额" prop="amount" borderBottom ref="item1">
						<u--input v-model="itemInfo.amount" border="none" placeholder="请填写" maxlength="30" clearable>
						</u--input>
					</u-form-item>
					<u-form-item label="单价" prop="unitPrice" borderBottom ref="item1">
						<u--input v-model="itemInfo.unitPrice" border="none" placeholder="请填写" maxlength="30"
							clearable></u--input>
					</u-form-item>
				</view>
				<view class="top-height">
					<u-form-item label="备注信息" prop="remark" ref="item1"></u-form-item>
					<u--textarea v-model="itemInfo.remark" border="none" placeholder="请输入费用描述" maxlength="300">
					</u--textarea>
				</view>
			</u--form>
			<view style="padding: 10px 16px 10px 0; width: 100%; position: fixed; bottom: 0; background-color: #fff;">
				<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="保存" @click="saveCost"></u-button>
			</view>
		</view>
		<u-picker :show="showPicker" :columns="lstExpense_type" keyName="label" closeOnClickOverlay
			:defaultIndex="defaultIndex" @close="showPicker=false" @cancel="showPicker=false"
			@confirm="confirmExpense_type"></u-picker>

		<u-picker :show="showCustomerPicker" :columns="listSysCustomer" keyName="name" closeOnClickOverlay mode=selector
			:defaultIndex="defaultIndex" @close="showCustomerPicker=false" @cancel="showCustomerPicker=false"
			@confirm="confirmCustomer_type"></u-picker>

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
	} from "@/util/js_DateTime.js"
	import {
		isEmpty
	} from "@/util/common.js"
	import {
		getDictItemsByCode,
		getSysCustomer,
		invoiceDetailedManageAdd,
		riseManageEdit
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				isUpdate: false,
				isLoading: false, //加载中
				disabled: false,
				navTitle: "开票明细",
				showDatePicker: false,
				userInfo: {},
				datetime: js_date_time(new Date()),
				showPicker: false,
				showCustomerPicker: false,
				listSysCustomer: [], //客户列表数组
				defaultIndex: [],
				riseTypeName: "", //抬头类型名称
				customerName: "", //客户名称
				fileList: [],
				showOverlay: false,
				itemInfo: {
					id: "",
					itemName: "", //名称
					specification: "", //规格型号
					unit: "", //单位
					quantity: "", //数量
					amount: "", // 金额
					unitPrice: "", //单价
					remark: "" //备注信息
				},
				rawCostInfo: {}, //获取表单时的原始数据
				diffCostInfo: {}, //差异数据
				modalContent: "",
				modalTitle: "",
				showModal: false,
				editFile: [],
				returnPageNumber: 1,
				isClick: false, //防止重复点击保存按钮
			}
		},
		onLoad(option) {
			let isUpdate = isEmpty(option.isUpdate) ? false : option.isUpdate;
			this.isUpdate = isUpdate;
			this.returnPageNumber = isEmpty(option.returnPageNumber) ? 1 : parseInt(option.returnPageNumber);
			this.getCustomerList();

			if (!this.isUpdate) {
				this.userInfo = this.$cache.get('_userInfo');
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
			getUpdateData() {
				this.disabled = true;
				let riseDetail = uni.getStorageSync("riseDetails");
				this.navTitle = "编辑抬头";
				this.riseTypeName = riseDetail.type_dictText;
				this.customerName = riseDetail.customerName;
				this.itemInfo = {
					name: riseDetail.name, //抬头名称
					taxpayerNumber: riseDetail.taxpayerNumber, //
					id: riseDetail.id,
					remark: riseDetail.remark, //备注信息
					unit: riseDetail.unit,
					phone: riseDetail.phone,
					amount: riseDetail.amount,
					unitPrice: riseDetail.unitPrice,
					email: riseDetail.email,
					type: riseDetail.type_dictText === '企业' ? 1 : 2, //抬头类型			
				}
				if (!isEmpty(riseDetail.mapList)) {
					for (let i = 0; i < riseDetail.mapList.length; i++) {
						this.fileList.push({
							url: riseDetail.mapList[i].url,
							id: riseDetail.mapList[i].fileId
						})
						if (i == (riseDetail.mapList.length - 1)) {
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
			// 客户列表
			getCustomerList() {
				let data = "?pageNo=" + "1" //页码
					+
					"&pageSize=" + "10000" //页码大小
				;
				getSysCustomer(data, res => {
					if (res.code == 200 && res.success) {
						this.listSysCustomer.push(res.result.records)
						getApp().globalData.listSysCustomer = this.listSysCustomer;
						console.log("listSysCustomer", this.listSysCustomer);
					} else {
						uni.$u.toast(res.message);
					}
					console.log(res)
				})

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
				uni.hideKeyboard();
			},
			clickExpense() {
				this.showPicker = true;
			},
			clickCustomer() {
				this.showCustomerPicker = true;
			},
			//抬头类型  确认按钮
			confirmExpense_type(e) {
				this.itemInfo.type = e.value[0].value;
				this.riseTypeName = e.value[0].label;
				this.showPicker = false;
			},

			//客户 确认按钮
			confirmCustomer_type(e) {
				this.itemInfo.customerId = e.value[0].id;
				this.customerName = e.value[0].name;
				this.showCustomerPicker = false;
			},

			//添加报价
			gotoInvoiceDetail() {
				console.log(1);
				uni.navigateTo({
					url:'/pages/workbench/accountingManagement/invoiceManagement/invoiceApply/SelectQuote'
				})
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
				if (!this.isClick) {
					this.isClick = true;
					if (this.isUpdate) { //编辑抬头
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
							riseManageEdit(this.itemInfo, res => {
								console.log(res)
								if (res.code == 200 && res.success) {
									uni.$u.toast(res.message);
									uni.$emit('return', true);
									this.isUpdate = false;
									this.empty();
									uni.setStorageSync('riseDetails', res.result)
									uni.navigateBack({
										delta: 1
									})
								} else {
									uni.$u.toast(res.message);
									this.isClick = false;
								}
							})
						}

					} else { //新增
						invoiceDetailedManageAdd(this.itemInfo, res => {
							console.log(res)
							if (res.code == 200 && res.success) {
								uni.$u.toast(res.message);
								this.empty();
								uni.$emit('return', true);
								console.log('navigateBack', this.returnPageNumber);
								uni.navigateBack({
									delta: 1
								})
								// uni.navigateBack();
								// uni.navigateTo({
								// 	url: "/pages/workbench/accountingManagement/invoiceManagement/invoiceManagement"
								// })
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
					name: "", //抬头名称
					customerId: "",
					taxpayerNumber: "", //纳税人识别号
					unit: "", //单位
					phone: "", //电话
					amount: "", //开户行
					unitPrice: "", //银行账号
					email: "", //邮箱
					id: "",
					remark: "", //费用描述
					type: "", //抬头类型
				};
			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.card {
		color: #303133;
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

	.bottom-height {
		margin-top: 10px;
		margin-Bottom: 10px;
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

	/deep/ {
				.u-button {
					width: 90%;
					border-radius: 32px;
					padding: 18px 0;
					background-color: #0072FF;
				}
			}
</style>
