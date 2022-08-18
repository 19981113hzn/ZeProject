<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" safeAreaInsetTop fixed placeholder
			@leftClick="leftClick"></u-navbar>
		<view v-if="isUpdate && isLoading">
			<u-loading-icon text="加载中" textSize="18" :vertical="true" size="32"></u-loading-icon>
		</view>
		<view v-else>
			<u--form :model="itemInfo" ref="form1" labelPosition="left" labelWidth="80">
				<view class="top-height">
					<u-form-item label="发票种类" prop="invoiceName" :required="true" borderBottom ref="item1"
						@click="clickExpense(); hideKeyboard()">
						<u--input v-model="invoiceName" border="none" placeholder="请选择" :disabled="disabled"
							disabledColor="#ffffff" clearable maxlength="30"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="抬头名称" prop="invoiceTitle" :required="true" borderBottom ref="item1">
						<u--input v-model="itemInfo.invoiceTitle" border="none" placeholder="请填写" maxlength="30" clearable>
						</u--input>
					</u-form-item>
					<u-form-item label="所属客户" prop="customerName" borderBottom ref="item1"
						@click="clickCustomer(); hideKeyboard()">
						<u--input v-model="customerName" border="none" placeholder="请选择" clearable :disabled="disabled"
							disabledColor="#ffffff" maxlength="30"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="纳税人识别号" prop="taxNumber" :required="true" labelWidth="110" borderBottom
						ref="item1">
						<u--input v-model="itemInfo.taxNumber" border="none" placeholder="请填写" maxlength="30"
							clearable></u--input>
					</u-form-item>
					<u-form-item label="详细地址" prop="address" borderBottom ref="item1">
						<u--input v-model="itemInfo.address" border="none" placeholder="请填写" maxlength="30" clearable>
						</u--input>
					</u-form-item>
					<u-form-item label="电话号码" prop="phone" borderBottom ref="item1">
						<u--input v-model="itemInfo.phone" border="none" placeholder="请填写" maxlength="30" clearable>
						</u--input>
					</u-form-item>
					<u-form-item label="开户行" prop="bank" borderBottom ref="item1">
						<u--input v-model="itemInfo.bank" border="none" placeholder="请填写" maxlength="30" clearable>
						</u--input>
					</u-form-item>
					<u-form-item label="银行账号" prop="bankAccount" borderBottom ref="item1">
						<u--input v-model="itemInfo.bankAccount" border="none" placeholder="请填写" maxlength="30"
							clearable></u--input>
					</u-form-item>
				</view>
				<view class="top-height">
					<u-form-item label="关联项目" prop="riseTypeName" ref="item1" borderBottom
						@click="clickExpense(); hideKeyboard()">
						<u--input v-model="riseTypeName" border="none" placeholder="请选择" :disabled="disabled"
							disabledColor="#ffffff" clearable maxlength="30"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="关联合同" prop="contractId" ref="item1" borderBottom
						@click="gotorelatedContracts(); hideKeyboard()">
						<u--input v-model="itemInfo.contractId" border="none" placeholder="请选择" :disabled="disabled"
							disabledColor="#ffffff" clearable maxlength="30"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="发票份数" prop="invoiceQuantity" borderBottom ref="item1">
						<u--input v-model="itemInfo.invoiceQuantity" border="none" placeholder="请填写" maxlength="30"
							clearable></u--input>
					</u-form-item>
				</view>
				<view class="top-height">
					<u-form-item label="备注信息" prop="remark" ref="item1"></u-form-item>
					<u--textarea v-model="itemInfo.remark" border="none" placeholder="请输入费用描述" maxlength="300">
					</u--textarea>
				</view>
			</u--form>
			<view class='invoice-detailed'>
				<text>开票明细</text>
				<view class="">
					<image class="invoice-detailed-del" src="/static/img/assist/icon/delete_proc.jpg"></image>
					<image class="invoice-detailed-add" src="/static/img/assist/icon/add_proc.jpg" @click="gotoInvoiceDetail"></image>
				</view>
			</view>
			<view class="uni-container">
				<!-- <uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据" -->
				<uni-table ref="table" border stripe type="selection" emptyText="暂无更多数据"
					@selection-change="selectionChange">
					<uni-tr>
						<uni-th width="100" align="center">名称</uni-th>
						<uni-th width="100" align="center">规格型号</uni-th>
						<uni-th width="100" align="center">单位</uni-th>
						<uni-th width="100" align="center">数量</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{item.itemName}}</uni-td>
						<uni-td align="center">
							<view class="name">{{item.specification}}</view>
						</uni-td>
						<uni-td align="center">{{ item.unit }}</uni-td>
						<uni-td align="center">{{item.quantity}}</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
						@change="change" />
				</view>
			</view>
			<view class="foot-height">
				<view style="padding: 0 16px;">
					<u-row justify="space-around">
						<u-col span='5.5'>
							<view>
								<text style="margin-right: 5px;">合计金额</text>
								<text style="color: #0072FF;">￥{{2222}}</text>
							</view>
						</u-col>
						<u-col span='3.5'>
							<u-form-item>
								<u-button color="rgba(0, 114, 255, 1)" shape="circle" text="提交审批" @click="saveCost">
								</u-button>
							</u-form-item>
						</u-col>
					</u-row>

				</view>
			</view>
		</view>
		<u-picker :show="showPicker" :columns="invoice_Type" keyName="labels" closeOnClickOverlay
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
		invoiceManageAdd,
		getInvoicingDetail,
		riseManageEdit
	} from "@/util/interface.js"
	export default {
		data() {
			return {
				isUpdate: false,
				isLoading: false, //加载中
				disabled: false,
				navTitle: "新建开票申请",
				showDatePicker: false,
				userInfo: {},
				datetime: js_date_time(new Date()),
				showPicker: false,
				showCustomerPicker: false,
				invoice_Type: [{label: "增值税专用发票",text: "增值税专用发票",title: "增值税专用发票",value: "1"},
							   {label: "增值税普通发票",text: "增值税普通发票",title: "增值税普通发票",value: "2"}], //发票类型
				listSysCustomer: [], //客户列表
				defaultIndex: [],
				invoiceName: "", //发票类型名称
				customerName: "", //客户名称
				fileList: [],
				showOverlay: false,
				itemInfo: {
					applyId: "",
					applyDepartId: "",
					remark: "", //备注信息
					invoiceType: "", //发票类型
					invoiceTitle: "", //抬头名称
					customerId: "", //客户id
					taxNumber: "", //纳税人识别号
					address: "", //单位地址
					phone: "", //电话
					bank: "", // 银行
					bankAccount: "", //银行账号
					remark: "", //备注信息
					contractId: '', //合同Id
					invoiceQuantity: "" //发票份数
					// updateBy: "",
				},
				rawCostInfo: {}, //获取表单时的原始数据
				diffCostInfo: {}, //差异数据
				modalContent: "",
				modalTitle: "",
				showModal: false,
				editFile: [],
				returnPageNumber: 1,
				isClick: false, //防止重复点击保存按钮

				searchVal: '',
				tableData: [],
				// 每页数据量
				pageSize: 10,
				// 当前页
				pageCurrent: 1,
				// 数据总量
				total: 0,
				// loading: false
			}
		},
		onLoad(option) {
			console.log("onLoad", option);
			let isUpdate = isEmpty(option.isUpdate) ? false : option.isUpdate;
			this.isUpdate = isUpdate;
			this.returnPageNumber = isEmpty(option.returnPageNumber) ? 1 : parseInt(option.returnPageNumber);
			this.getCustomerList();
			// this.getDictItems();
			this.userInfo = this.$cache.get('_userInfo');


			this.selectedIndexs = [];
			this.getTableData(1);

			if (!this.isUpdate) {
				//this.itemInfo.projectCode = "PM" + this.generateTimeReqestNumber();
				this.userInfo = this.$cache.get('_userInfo');
			} else {
				this.isLoading = true;
				this.getUpdateData();
			}

		},
		onShow() {
			// uni.$once('returnCustomer', res => {
			// 	console.log(res)
			// 	this.collectionForm.customerName = res.customerName; //客户名称
			// 	this.collectionForm.customerId = res.customerId; //客户ID
			// });
			uni.$once('returnContract', res => {
				console.log(res)
				this.itemInfo.contractName = res.contractName; //合同名称
				this.itemInfo.contractId = res.contractId; //合同ID
				this.getCollectionPeriod()
			});
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

			// 多选处理
			selectedItems() {
				return this.selectedIndexs.map(i => this.tableData[i])
			},
			// 多选
			selectionChange(e) {
				console.log(e.detail.index)
				this.selectedIndexs = e.detail.index
			},
			//批量删除
			delTable() {
				console.log(this.selectedItems())
			},
			// 分页触发
			change(e) {
				this.$refs.table.clearSelection()
				this.selectedIndexs.length = 0
				this.getTableData(e.current)
			},
			// 搜索
			search() {
				this.getTableData(1, this.searchVal)
			},
			// 获取表格数据
			getTableData(pageCurrent, value = '') {
				this.loading = true;
				// this.pageCurrent = pageCurrent;
				let data = "?pageNo=" + "1" //页码
					+
					"&pageSize=" + "100" //页码大小
				;
				getInvoicingDetail(data, res => {
					if (res.code == 200 && res.success) {
						if (this.pageNo == 1) {
							this.tableData = isEmpty(res.result) ? [] : res.result.records;
						} else {
							this.tableData = this.tableData.concat(res.result.records)
						}
						this.maxPage = isEmpty(res.result) ? this.maxPage : res.result.pages
						if (this.pageNo >= this.maxPage) this.status = 'nomore';
						else this.status = 'loading';
					} else {
						uni.$u.toast(res.message);
					}
					this.isLoading = true;
				})
				// this.request({
				// 	pageSize: this.pageSize,
				// 	pageCurrent: pageCurrent,
				// 	value: value,
				// 	success: res => {
				// 		// console.log('data', res);
				// 		this.tableData = res.data
				// 		this.total = res.total
				// 		this.loading = false
				// 	}
				// })
			},
			getUpdateData() {
				this.disabled = true;
				let riseDetail = uni.getStorageSync("riseDetails");
				this.navTitle = "编辑抬头";
				this.riseTypeName = riseDetail.type_dictText;
				this.customerName = riseDetail.customerName;
				this.itemInfo = {
					invoiceTitle: riseDetail.invoiceTitle, //抬头名称
					taxNumber: riseDetail.taxNumber, //
					id: riseDetail.id,
					remark: riseDetail.remark, //备注信息
					address: riseDetail.address,
					phone: riseDetail.phone,
					bank: riseDetail.bank,
					bankAccount: riseDetail.bankAccount,
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
			//发票类型--确认按钮
			confirmExpense_type(e) {
				this.itemInfo.invoiceType = e.values[0].value;
				this.invoiceName = e.values[0].title;
				this.showPicker = false;
			},

			//客户--确认按钮
			confirmCustomer_type(e) {
				this.itemInfo.customerId = e.value[0].id;
				this.customerName = e.value[0].name;
				this.showCustomerPicker = false;
			},

			//开票明细
			gotoInvoiceDetail() {
				console.log(112266);
				uni.navigateTo({
					url:'/pages/workbench/accountingManagement/invoiceManagement/invoiceApply/invoiceDetailed'
				})
				// uni.navigateTo({
				// 	url: "pages/workbench/accountingManagement/invoiceManagement/invoiceApply/invoiceDetailed"
				// })
			},

			//关联合同
			gotorelatedContracts() {
				uni.navigateTo({
					url: "/pages/workbench/operationManagement/contractManagement/relatedContracts?contractId=" +
						this
						.itemInfo
						.contractId
				})
			},
			//验证数据
			validateField() {
				if (isEmpty(this.itemInfo.invoiceType)) {
					uni.$u.toast("发票种型不能为空");
					return false;
				}
				if (isEmpty(this.itemInfo.invoiceTitle)) {
					uni.$u.toast("抬头名称不能为空");
					return false;
				}
				if (isEmpty(this.itemInfo.taxNumber)) {
					uni.$u.toast("纳税人识别号不能为空");
					return false;
				}
				return true;
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
						this.itemInfo.applyId = this.userInfo.id;
						this.itemInfo.applyDepartId	 = this.userInfo.orgId;

						invoiceManageAdd(this.itemInfo, res => {
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
					invoiceTitle: "", //抬头名称
					customerId: "",
					taxNumber: "", //纳税人识别号
					address: "", //单位地址
					phone: "", //电话
					bank: "", //开户行
					bankAccount: "", //银行账号
					id: "",
					remark: "", //备注信息
					invoiceType: "", //发票类型
					invoiceQuantity: ""
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

	.logo {
		width: 24px;
		height: 24px;
	}

	.foot-height {
		width: 100%;
		position: fixed;
		bottom: 0;
		height: 72px;
		background-color: #fff;
		border-top: 1px solid #f0f4f9;
		margin-top: 20px;

		.uni-input-placeholder {
			text-align: right;
			color: rgba(0, 114, 255, 1) !important;
		}

		.u-input__content__field-wrapper__field {
			text-align: right !important;
			color: rgba(0, 114, 255, 1) !important;
		}
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

	.invoice-detailed {
		padding: 14px 16px 0 16px;
		display: flex;
		justify-content: space-between;



		.invoice-detailed-add {
			width: 16px;
			height: 16px;
		}

		.invoice-detailed-del {
			width: 16px;
			height: 16px;
			margin-right: 14px;
		}
	}

	.uni-container {
		margin-top: 10px;
		background: #fff;
		// padding: 0 16px;
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

	.uni-group {
		display: flex;
		align-items: center;
	}
</style>
