import {
	cloudRequest,
	cloudRequestGetOrDelete,
	cloudRequestFormData,
	cloudRequestFormUrlencoded,
	cloudRequestFile,
	cloudRequestFilePlus
} from "@/util/request.js"
const system = "/cloud-system";
const activiti = "/cloud-activiti";
const fdfs = "/cloud-fastdfs";
//获取验证码
function sendVerifyCode(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sys/sendVerifyCode", data, funSuccess, funFail);
}
//手机验证码登录
function smsLogin(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sys/smsLogin", data, funSuccess, funFail);
}
//OAuth2登录(企业微信)
function OAuthCallback(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sys/thirdLogin/oauth2/WECHAT_ENTERPRISE/callback", data, funSuccess,
		funFail);
}
//本机手机号一键登录
function oneclickLogin(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sys/UNIAPP/oneclickLogin", data, funSuccess, funFail);
}
//获取图形验证码
function randomImage(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/randomImage/", data, funSuccess, funFail);
}
//账号密码登录接口
function accountPasswordLogin(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sys/login", data, funSuccess, funFail);
}
//根据token获取用户登录信息
function getUserInfoByToken(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/user/getUserInfoByToken", data, funSuccess, funFail);
}
//费用管理-获取费用管理列表
function getListCostManage(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/costManage/getList", data, funSuccess, funFail);
}
//字典管理-根据字段编码获取字典数据列表
function getDictItemsByCode(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/dict/getDictItemsByCode/", data, funSuccess, funFail);
}
//用户管理-获取用户角色列表
function getUserRoleList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/user/userRoleList", data, funSuccess, funFail);
}
//上传图片(单个)
function uploadPicture(filePath, name, data, funSuccess, funFail) {
	return cloudRequestFile(filePath, name, fdfs + "/fdfs/uploadPicture", data, funSuccess, funFail);
}
//通过文件id删除文件
function deletePicture(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", fdfs + "/fdfs/delete", data, funSuccess, funFail);
}
//费用管理-新增费用
function costManageAdd(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sys/costManage/add", data, funSuccess, funFail);
}
//费用管理-删除费用
function costManageDelete(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("delete", system + "/sys/costManage/delete", data, funSuccess, funFail);
}
//费用管理-编辑费用
function costManageEdit(data, funSuccess, funFail) {
	return cloudRequest("PUT", system + "/sys/costManage/edit", data, funSuccess, funFail);
}
//报销申请-获取报销申请列表
function getListsumExpense(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sum/sumExpense/getList", data, funSuccess, funFail);
}
//报销申请-添加报销申请
function sumExpenseAdd(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sum/sumExpense/add", data, funSuccess, funFail);
}
//报销申请-修改报销申请
function sumExpenseEdit(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sum/sumExpense/edit", data, funSuccess, funFail);
}
//报销申请-删除报销申请
function sumExpenseDelete(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("delete", system + "/sum/sumExpense/delete", data, funSuccess, funFail);
}
//获取当前用户获取用户list
function getUserListByUserId(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/user/getUserListByUserId", data, funSuccess, funFail);
}
//获取用户list（查询负责人及负责部门下的人）
function getUserListByName(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/user/getUserListByName", data, funSuccess, funFail);
}
//部门管理-部门下拉列表
function getDepartListByName(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/sysDepart/queryDepartByName", data, funSuccess, funFail);
}
//流程中心-获取流程启动变量
function getProcessStartVariables(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", activiti + "/approval/process/getProcessStartVariables/", data, funSuccess,
		funFail);
}
// 流程中心-获取流程启动变量
function getProcessStartVariablesByBizCode(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", activiti + "/approval/process/getProcessStartVariablesByBizCode/", data, funSuccess,
		funFail);
}
//流程中心-流程业务基本信息
function processBusinessBasicInfo(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", activiti + "/approval/process/processBusinessBasicInfo/", data, funSuccess,
		funFail);
}
//流程中心-流程跟踪
function getProcessTrace(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", activiti + "/approval/process/processTrace/", data, funSuccess, funFail);
}
//流程中心-流程操作
function sumExpenseOperate(data, funSuccess, funFail) {
	return cloudRequest("POST", activiti + "/approval/process/operate", data, funSuccess, funFail);
}
//供应商列表
function getSupplierList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/supplier/list", data, funSuccess, funFail);
}
//供应商详情
function getSupplierDetail(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/supplier", data, funSuccess, funFail);
}
//上传图片/文件(多个)
function uploadPicturePlus(data, funSuccess, funFail) {
	console.log('data3333', data)
	// console.log('sendDate4444',sendDate)
	console.log('funFail5555', funFail)
	return cloudRequestFilePlus(fdfs + "/fdfs/uploadAppAttachment", data, funSuccess, funFail);
}
//上传附件
function uploadAttachment(data, funSuccess, funFail, contentType) {
	return cloudRequest("POST", system + "/sys/document/uploadAppAttachment", data, funSuccess, funFail);
}
//供应商-删除
function supplierDelete(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("delete", system + "/sys/supplier/delete", data, funSuccess, funFail);
}
//竞争对手-删除
function competitorDelete(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("delete", system + "/sys/competitor/delete", data, funSuccess, funFail);
}
//供应商-新增评论
function commentAdd(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sys/record/comment/add", data, funSuccess, funFail);
}
//工商信息
function getEnterpriseFuzzySearch(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/competitor/enterpriseFuzzySearch", data, funSuccess, funFail);
}
//新增供应商
function supplierAdd(data, funSuccess, funFail) {
	return cloudRequestFormUrlencoded("POST", system + "/sys/supplier/save", data, funSuccess, funFail, 'isAdd');
}
// 供应商编辑
function supplierEdit(data, funSuccess, funFail) {
	return cloudRequestFormUrlencoded("PUT", system + "/sys/supplier/update", data, funSuccess, funFail, 'isAdd');
}
//新增竞争对手
function competitorAdd(data, funSuccess, funFail) {
	return cloudRequestFormUrlencoded("POST", system + "/sys/competitor/save", data, funSuccess, funFail, 'isAdd');
}
// 竞争对手编辑
function competitorEdit(data, funSuccess, funFail) {
	return cloudRequestFormUrlencoded("PUT", system + "/sys/competitor/update", data, funSuccess, funFail, 'isAdd');
}
//竞争对手列表
function getCompetitorList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/competitor/list", data, funSuccess, funFail);
}
// 竞争对手详情
function getCompetitorDetail(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/competitor", data, funSuccess, funFail);
}
//流程中心-待办列表
function getTodoTaskList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", activiti + "/approval/process/getTodoTaskList", data, funSuccess, funFail);
}
//流程中心-待办列表
function getDoneTaskList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", activiti + "/approval/process/getDoneTaskList", data, funSuccess, funFail);
}
//流程中心-流程通知列表
function getProcessNoticeList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", activiti + "/approval/process/getProcessNoticeList", data, funSuccess,
		funFail);
}
//流程中心-流程修改通知列表
function updateIsReadByIds(data, funSuccess, funFail) {
	return cloudRequest("post", activiti + "/approval/process/updateIsReadByIds", data, funSuccess, funFail);
}
//流程中心-申请列表
function getApplyTaskList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", activiti + "/approval/process/getApplyTaskList", data, funSuccess, funFail);
}
//客户管理-分页列表查询
function getSysCustomer(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/sysCustomer/list", data, funSuccess, funFail);
}
//客户管理-删除
function customerDelete(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("delete", system + "/system/sysCustomer/delete", data, funSuccess, funFail);
}
//客户管理-关注
function editCustomerCollect(data, funSuccess, funFail) {
	return cloudRequest("post", system + "/system/sysCustomer/edit-collect", data, funSuccess, funFail);
}
//客户管理-客户详情
function getSysCustomerDetail(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/sysCustomer/queryById", data, funSuccess, funFail);
}
//客户管理-转移客户
function customerTransfer(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/system/sysCustomer/edit-transfer", data, funSuccess,
		funFail);
}
//客户管理-联系人列表
function getContactsList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/sysCustomerContact/list", data, funSuccess, funFail);
}
//客户管理-联系人详情
function getContactDetail(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/sysCustomerContact/queryById", data, funSuccess, funFail);
}
//客户管理-联系人删除
function deleteContact(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("delete", system + "/system/sysCustomerContact/delete", data, funSuccess, funFail);
}
//客户管理-跟进记录列表
function getFollowRecordsList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/sysCustomerContactRecord/list", data, funSuccess, funFail);
}
//客户管理-跟进记录删除
function deleteFollowRecord(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("delete", system + "/system/sysCustomerContactRecord/delete", data, funSuccess,
		funFail);
}
//客户管理-跟进记录新增
function addFollowRecord(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/system/sysCustomerContactRecord/add", data, funSuccess,
		funFail);
}
//客户管理-跟进记录编辑
function editFollowRecord(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/system/sysCustomerContactRecord/edit", data, funSuccess,
		funFail);
}
//客户管理-跟进记录详情
function getFollowRecordDetail(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/sysCustomerContactRecord/queryById", data, funSuccess,
		funFail);
}
//客户管理-相关附件列表
function getAttachmentsList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/document/getPageByBusCodeAndBusId", data, funSuccess, funFail);
}
//客户管理-添加评论
function customerAddComment(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sys/record/comment/add", data, funSuccess, funFail);
}
//客户管理-添加
function customerAdd(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/system/sysCustomer/add", data, funSuccess, funFail);
}
//删除附件——文档中心的删除接口
function deleteAttachmemt(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("delete", system + "/sys/document", data, funSuccess, funFail);
}
//客户管理-编辑
function customerEdit(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/system/sysCustomer/edit", data, funSuccess, funFail);
}
//客户联系人-添加
function sysCustomerContactAdd(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/system/sysCustomerContact/add", data, funSuccess, funFail);
}
//客户联系人-编辑
function sysCustomerContactEdit(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/system/sysCustomerContact/edit", data, funSuccess, funFail);
}
//ocr上传图片(单个)
function recognizeBusinessLicense(filePath, name, data, funSuccess, funFail) {
	return cloudRequestFile(filePath, name, system + "/third/api/recognizeBusinessLicense", data, funSuccess, funFail);
}

//文档中心-获取我的-公共文档分页列表
function getDocumentList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/document/getDocumentList", data, funSuccess,
		funFail);
}
//文档中心-获取我共享的文档分页列表
function getMyShareDocumentList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/document/getMyShareDocumentList", data, funSuccess,
		funFail);
}
//文档中心-获取共享文档分页列表
function getShareDocumentList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/document/getShareDocumentList", data, funSuccess,
		funFail);
}
//获取文件夹列表
function getDocumentFolderList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/document/getDocumentFolderList", data, funSuccess,
		funFail);
}
//新建文件夹
function documentAdd(data, funSuccess, funFail) {
	return cloudRequest("post", system + "/sys/document", data, funSuccess, funFail);
}

//移动文件
function documentMove(data, funSuccess, funFail) {
	return cloudRequest("post", system + "/sys/document/move", data, funSuccess, funFail);
}

//文档中心-查看文件详情
function getDocumentInfo(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/document/getDocumentInfo", data, funSuccess,
		funFail);
}

// 产品档案-列表
function getProductList(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/product/list", data, funSuccess, funFail);
}
// 产品档案-详情
function getProductDetail(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/product/queryById", data, funSuccess, funFail);
}

// 根据id查询产品分类
function getCategoryDetail(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/prodCategory/queryById", data, funSuccess, funFail);
}
// 产品分类树形列表
function getCategoryTreeList(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/prodCategory/getCategoryTreeList", data, funSuccess, funFail);
}

// 产品分类列表查询
function getCategoryList(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/prodCategory/list", data, funSuccess, funFail);
}
//文档中心-新建文档评论
function setNewComment(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sys/document/comment", data, funSuccess, funFail);
}


//文档中心-删除文档
function deleteDocument(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("delete", system + "/sys/document", data, funSuccess, funFail);
}

// 文档中心-编辑文档
function editFileOrFolder(data, funSuccess, funFail) {
	return cloudRequest("PUT", system + "/sys/document", data, funSuccess, funFail, 'isAdd');
}

// 取消共享文件
function unShareFile(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sys/document/unShareFile", data, funSuccess, funFail, 'isAdd');
}

//共享文件
function shareFile(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/sys/document/shareFile", data, funSuccess, funFail, 'isAdd');
}

// 流程中心-获取流程实例变量
function getProcessVariables(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", activiti + "/approval/process/getProcessVariables/", data, funSuccess,
		funFail);
}



// 商机管理-分页列表查询
function getbizOpptyList(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/bizoppty/bizOppty/list", data, funSuccess, funFail);
}
// SWOT配置表-分页列表查询
function getquotaList(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/quota/list", data, funSuccess, funFail);
}
// 商机管理-添加商机
function addBizOppty(data, funSuccess, funFail) {
	return cloudRequest("post", system + "/bizoppty/bizOppty/saveBizOppty", data, funSuccess, funFail);
}
// 商机管理-删除商机
function deleteBizOppty(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("delete", system + "/bizoppty/bizOppty/deleteBizOppty/", data, funSuccess, funFail);
}
//商机管理-转移商机
function transferBizOppty(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/bizoppty/bizOppty/transferBizOppty", data, funSuccess,
		funFail);
}
// 商机管理-获取销售状态
function getbizOpptySaleStatus(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/bizoppty/bizOppty/saleStatus", data, funSuccess, funFail);
}
// 商机管理-更新销售状态
function upbizOpptySaleStatus(data = "", funSuccess, funFail) {
	return cloudRequest("post", system + "/bizoppty/bizOppty/updateSaleStatus", data, funSuccess, funFail);
}
// 商机管理-获取商机详情
function getBizOpptyInfo(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/bizoppty/bizOppty/getBizOpptyInfo", data, funSuccess, funFail);
}
// 商机管理-更新产品报价
function updateProductQuote(data = "", funSuccess, funFail) {
	return cloudRequest("post", system + "/bizoppty/bizOppty/updateProductQuote", data, funSuccess, funFail);
}
// 商机管理-销售状态字典
function getSaleStatusDict(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/bizoppty/bizOppty/getSaleStatusDict", data, funSuccess, funFail);
}

// 商机管理-商机看板
function getBizOpptyBoard(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/bizoppty/bizOppty/bizOpptyBoard", data, funSuccess, funFail);
}

// 商机管理-看板分类列表
function getBoardDetailList(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/bizoppty/bizOppty/boardDetailList", data, funSuccess, funFail);
}

// 公共接口-判断登录人员是否部门负责人
function checkDepartCharge(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/sysDepart/checkDepartCharge", data, funSuccess, funFail);
}
//商机管理-商机标题校验
function checkBizOpptyName(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/bizoppty/bizOppty/checkBizOpptyName", data, funSuccess, funFail);
}
// 商机管理-添加协作人员
function addCooperation(data = "", funSuccess, funFail) {
	return cloudRequest("post", system + "/bizoppty/bizOppty/addCooperation", data, funSuccess, funFail);
}
// 商机管理-协作人员列表
function getCooperationList(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/bizoppty/bizOppty/cooperationList", data, funSuccess, funFail);
}
// 获取系统消息列表
function getMyAnnouncementSend(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/sysAnnouncementSend/getMyAnnouncementSend", data, funSuccess,
		funFail);
}
// 更新用户系统消息阅读状态
function editMyAnnouncementSend(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("put", system + "/sys/sysAnnouncementSend/editById/", data, funSuccess, funFail);
}
// 获取待办、待阅数
function getUndoMsgNum(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/sysAnnouncementSend/getUndoMsgNum/", data, funSuccess,
		funFail);
}
//商机管理-报价单详情
function getProductQuoteDetail(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/bizoppty/bizOppty/productQuoteDetail", data, funSuccess, funFail);
}
//公共接口-根据用户ID获取所属部门
function getBelongDepart(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/sysDepart/getBelongDepart/", data, funSuccess, funFail);
}
// 商机管理-编辑商机
function editBizOppty(data = "", funSuccess, funFail) {
	return cloudRequest("post", system + "/bizoppty/bizOppty/editBizOppty", data, funSuccess, funFail);
}
// 客户线索-分页列表查询
function getClueSourcelist(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/sysClueSource/list", data, funSuccess, funFail);
}
// 客户线索-添加
function addClueSource(data = "", funSuccess, funFail) {
	return cloudRequest("post", system + "/system/sysClueSource/add", data, funSuccess, funFail);
}
// 客户线索-编辑
function editClueSource(data = "", funSuccess, funFail) {
	return cloudRequest("post", system + "/system/sysClueSource/edit", data, funSuccess, funFail);
}
// 客户线索-通过id删除
function deleteClueSource(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("DELETE", system + "/system/sysClueSource/delete", data, funSuccess, funFail);
}

// 客户线索-通过id获取线索详情
function getClueInfoById(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/sysClueSource/getClueInfoById", data, funSuccess, funFail);
}

// 意见反馈-添加
function addFeedBack(data = "", funSuccess, funFail) {
	return cloudRequest("post", system + "/system/sysFeedBack/add", data, funSuccess, funFail);
}
//客户管理-校验
function verifySysCustomer(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/sysCustomer/verify", data, funSuccess, funFail);
}
// 客户线索-通过id转为客户
function convertCustomer(data = "", funSuccess, funFail) {
	return cloudRequest("post", system + "/system/sysClueSource/convertCustomer", data, funSuccess, funFail);
}
// 客户线索-通过id转为商机
function convertBizOppty(data = "", funSuccess, funFail) {
	return cloudRequest("post", system + "/system/sysClueSource/convertBizOppty", data, funSuccess, funFail);
}
//首页-销售漏斗分析
function getFunnelAnalysis(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/bizOpptyHistory/funnelAnalysis", data, funSuccess, funFail);
}

//首页-销售预测
function getFunnelForcast(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/bizOpptyHistory/salesForecast", data, funSuccess, funFail);
}

// 首页-销售漏斗报表
function getFunnelReportForm(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/bizOpptyHistory/funnelReportForm", data, funSuccess, funFail);
}

// 销售作战蓝图-分页列表查询
function getBluePrintList(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/bluePrint/list", data, funSuccess, funFail);
}
// 销售作战蓝图-通过id查询
function getBluePrintById(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/sys/bluePrint/queryById", data, funSuccess, funFail);
}
// 销售作战蓝图-添加
function addBluePrint(data = "", funSuccess, funFail) {
	return cloudRequest("post", system + "/sys/bluePrint/add", data, funSuccess, funFail);
}

// 销售作战蓝图-业绩目标-添加
function addBlueprintTargets(data = "", funSuccess, funFail) {
	return cloudRequest("post", system + "/system/sysBlueprintTargets/add", data, funSuccess, funFail);
}
// 销售作战蓝图-业绩目标-列表查询
function getBlueprintTargetsList(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/sysBlueprintTargets/list", data, funSuccess, funFail);
}
// 销售作战蓝图-业绩目标-通过id查询
function getBlueprintTargetsById(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/system/sysBlueprintTargets/queryById", data, funSuccess, funFail);
}
// 销售作战蓝图-业绩目标-编辑
function editBlueprintTargets(data = "", funSuccess, funFail) {
	return cloudRequest("put", system + "/system/sysBlueprintTargets/edit", data, funSuccess, funFail);
}
// 销售作战蓝图-业绩目标-通过id删除
function deleteBlueprintTargetsById(data = "", funSuccess, funFail) {
	return cloudRequestGetOrDelete("delete", system + "/system/sysBlueprintTargets/delete", data, funSuccess, funFail);
}
// 销售分析-所属部门列表
function getDeptList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/sys/sysDepart/queryTreeList?orgIdentity=1", data, funSuccess, funFail);
}

//回款计划-分页列表查询
function getCashList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/collection/plan/list", data, funSuccess, funFail);
}

// 回款计划-添加
function addCashPlan(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/collection/plan/add", data, funSuccess, funFail);
}

// 回款计划-编辑
function editCashPlan(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/collection/plan/edit", data, funSuccess, funFail);
}

// 回款计划-通过id查询
function getCashDetail(data, funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/collection/plan/queryById", data, funSuccess, funFail);
}

// 回款计划-通过id删除
function deleteCashPlan(data, funSuccess, funFail){
	return cloudRequestGetOrDelete("delete", system + "/collection/plan/delete", data, funSuccess, funFail);
}

// 回款计划期项-分页列表查询
function getPlanItemList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/collection/planItem/list", data, funSuccess, funFail);
}
// 回款管理-分页列表查询
function getCollectionList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/collection/manage/list", data, funSuccess, funFail);
}
// 回款管理-通过id查询
function getCollectionItem(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/collection/manage/queryById", data, funSuccess, funFail);
}

// 回款管理-通过id删除
function deleteCollectionRecord(data, funSuccess, funFail){
	return cloudRequestGetOrDelete("delete", system + "/collection/manage/delete", data, funSuccess, funFail);
}

// 回款管理-添加
function addCollection(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/collection/manage/add", data, funSuccess, funFail);
}

// 回款管理-编辑
function editCollection(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/collection/manage/edit", data, funSuccess, funFail);
}

// 付款计划-分页列表查询
function getPaymentPlanList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/payment/plan/list", data, funSuccess, funFail);
}

// 付款计划-添加
function addPaymentPlan(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/payment/plan/add", data, funSuccess, funFail);
}

// 付款计划-编辑
function editPaymentPlan(data = "", funSuccess, funFail){
	return cloudRequest("put", system + "/payment/plan/edit", data, funSuccess, funFail);
}

// 付款计划-通过id查询
function getPaymentPlanItem(data, funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/payment/plan/queryById", data, funSuccess, funFail);
}

// 付款计划-通过id删除
function deletePaymentPlanItem(data, funSuccess, funFail){
	return cloudRequestGetOrDelete("delete", system + "/payment/plan/delete", data, funSuccess, funFail);
}

// 付款管理-分页列表查询
function getPaymentList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/payment/planManage/list", data, funSuccess, funFail);
}

// 付款管理-通过id查询
function getPaymentItem(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/payment/planManage/queryById", data, funSuccess, funFail);
}

// 付款管理-通过id删除
function deletePaymentRecord(data, funSuccess, funFail){
	return cloudRequestGetOrDelete("delete", system + "/payment/planManage/delete", data, funSuccess, funFail);
}

// 付款管理-添加
function addPayment(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/payment/planManage/add", data, funSuccess, funFail);
}

// 付款管理-编辑
function editPayment(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/payment/planManage/edit", data, funSuccess, funFail);
}

// 合同管理-分页列表查询
function getContractList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/contract/list", data, funSuccess, funFail);
}

// 个人资源表-分页列表查询
function getBlueprintPersonalList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/system/sysBlueprintPersonal/list", data, funSuccess, funFail);
}
// 个人资源表-通过id查询
function getBlueprintPersonalById(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/system/sysBlueprintPersonal/queryById", data, funSuccess, funFail);
}
// 个人资源表-添加
function addBlueprintPersonal(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/system/sysBlueprintPersonal/add", data, funSuccess, funFail);
}
// 个人资源表-编辑
function editBlueprintPersonal(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/system/sysBlueprintPersonal/edit", data, funSuccess, funFail);
}
// 个人资源表-通过id删除
function deleteBlueprintPersonalById(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("delete", system + "/system/sysBlueprintPersonal/delete", data, funSuccess, funFail);
}
// 厂商资源表-分页列表查询
function getBlueprintContractorList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/system/sysBlueprintContractor/list", data, funSuccess, funFail);
}
// 厂商资源表-添加
function addBlueprintContractor(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/system/sysBlueprintContractor/add", data, funSuccess, funFail);
}
// 厂商资源表-通过id删除
function deleteBlueprintContractorById(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("delete", system + "/system/sysBlueprintContractor/delete", data, funSuccess, funFail);
}
// 厂商资源表-通过id查询
function getBlueprintContractorById(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/system/sysBlueprintContractor/queryById", data, funSuccess, funFail);
}
// 厂商资源表-编辑
function editBlueprintContractor(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/system/sysBlueprintContractor/edit", data, funSuccess, funFail);
}
// 公司资源表-分页列表查询
function getBlueprintCompanyList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/system/sysBlueprintCompany/list", data, funSuccess, funFail);
}
// 公司资源表-添加
function addBlueprintCompany(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/system/sysBlueprintCompany/add", data, funSuccess, funFail);
}
// 公司资源表-通过id删除
function deleteBlueprintCompanyById(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("delete", system + "/system/sysBlueprintCompany/delete", data, funSuccess, funFail);
}
// 公司资源表-通过id查询
function getBlueprintCompanyById(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/system/sysBlueprintCompany/queryById", data, funSuccess, funFail);
}
// 公司资源表-编辑
function editBlueprintCompany(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/system/sysBlueprintCompany/edit", data, funSuccess, funFail);
}
// 推进计划-分页列表查询
function getpromotionPlanList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/sys/promotionPlan/list", data, funSuccess, funFail);
}
// 推进计划-获取计划树形列表
function getpromotionPlanTree(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/sys/promotionPlan/getPromotionPlanList", data, funSuccess, funFail);
}
// 推进计划-添加
function addpromotionPlan(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/sys/promotionPlan/add", data, funSuccess, funFail);
}
// 推进计划-通过id查询
function getpromotionPlanById(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/sys/promotionPlan/queryById", data, funSuccess, funFail);
}
// 推进计划-编辑
function editpromotionPlan(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/sys/promotionPlan/edit", data, funSuccess, funFail);
}
// 推进计划-通过id查询
function deletepromotionPlanById(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("delete", system + "/sys/promotionPlan/delete", data, funSuccess, funFail);
}
// 销售作战蓝图-资源分析
function getBluePrintRes(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/sys/bluePrint/getBluePrintRes", data, funSuccess, funFail);
}
// 产品报价-分页列表查询
function getproductQuoteList(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("get", system + "/quote/productQuote/list", data, funSuccess, funFail);
}
// 产品报价-添加
function addproductQuote(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/quote/productQuote/saveQuote", data, funSuccess, funFail);
}
// 产品报价-通过id查询
function getProductQuoteById(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("GET", system + "/quote/productQuote/queryById", data, funSuccess, funFail);
}
// 产品报价记录-分页列表查询
function getProductQuoteRecord(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("GET", system + "/quote/productQuoteRecord/pageList", data, funSuccess, funFail);
}
// 产品报价-通过业务代码和报价id获取关联业务记录
function getRelRecordByBizCodeAndId(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("GET", system + "/quote/productQuote/getRelRecordByBizCodeAndId", data, funSuccess, funFail);
}
// 产品报价-编辑
function editproductQuote(data = "", funSuccess, funFail){
	return cloudRequest("post", system + "/quote/productQuote/editQuote", data, funSuccess, funFail);
}
// 产品报价-通过id删除
function deleteProductQuoteById(data = "", funSuccess, funFail){
	return cloudRequestGetOrDelete("delete", system + "/quote/productQuote/delete", data, funSuccess, funFail);
}
// 发票管理-我的抬头-分页列表查询
// function getListSumCompany(data = "", funSuccess, funFail){
// 	return cloudRequestGetOrDelete("GET", system + "/quote/productQuoteRecord/pageList", data, funSuccess, funFail);
// }
// 发票管理-我的抬头-获取列表
function getListSumCompany(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/invoice/title/list", data, funSuccess, funFail);
}
// 发票管理-新增抬头
function riseManageAdd(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/invoice/title/add", data, funSuccess, funFail);
}
// 发票管理-编辑抬头
function riseManageEdit(data, funSuccess, funFail) {
	return cloudRequest("PUT", system + "/invoice/title/edit", data, funSuccess, funFail);
}

// 发票管理-开票申请-获取列表
function getListInvoiceManage(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/invoice/invoicing/list", data, funSuccess, funFail);
}

// 发票管理-开票申请-新建开票申请
function invoiceManageAdd(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/invoice/invoicing/add", data, funSuccess, funFail);
}

// 发票管理-开票明细-获取列表
function getInvoicingDetail(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("get", system + "/invoice/invoicingDetail/list", data, funSuccess, funFail);
}

// 发票管理-开票申请-新建开票申请
function invoiceDetailedManageAdd(data, funSuccess, funFail) {
	return cloudRequest("POST", system + "/invoice/invoicingDetail/add", data, funSuccess, funFail);
}

// 发票管理-id查询
function invoiceMentDetailsInfo(data, funSuccess, funFail) {
	return cloudRequestGetOrDelete("GET", system + "/invoice/invoicing/queryById", data, funSuccess, funFail);
}
module.exports = {
	sendVerifyCode,
	smsLogin,
	OAuthCallback,
	oneclickLogin,
	randomImage,
	accountPasswordLogin,
	getUserInfoByToken,
	getDictItemsByCode,
	getUserRoleList,
	getUserListByUserId,
	getUserListByName,
	getDepartListByName,
	uploadPicture,
	deletePicture,
	getListCostManage,
	costManageAdd,
	costManageDelete,
	costManageEdit,
	getListsumExpense,
	sumExpenseAdd,
	sumExpenseEdit,
	sumExpenseDelete,
	getProcessStartVariables,
	getProcessStartVariablesByBizCode,
	processBusinessBasicInfo,
	getProcessTrace,
	sumExpenseOperate,
	getSupplierList,
	getSupplierDetail,
	uploadAttachment,
	supplierDelete,
	uploadPicturePlus,
	commentAdd,
	getEnterpriseFuzzySearch,
	supplierAdd,
	getCompetitorList,
	getCompetitorDetail,
	competitorDelete,
	supplierEdit,
	competitorAdd,
	getTodoTaskList,
	getDoneTaskList,
	getProcessNoticeList,
	updateIsReadByIds,
	getApplyTaskList,
	getSysCustomer,
	editCustomerCollect,
	getSysCustomerDetail,
	getContactsList,
	getFollowRecordsList,
	getAttachmentsList,
	getContactDetail,
	getFollowRecordDetail,
	customerAddComment,
	customerDelete,
	customerAdd,
	addFollowRecord,
	editFollowRecord,
	deleteAttachmemt,
	deleteContact,
	deleteFollowRecord,
	customerEdit,
	customerTransfer,
	sysCustomerContactAdd,
	sysCustomerContactEdit,
	recognizeBusinessLicense,
	getDocumentList,
	getMyShareDocumentList,
	getShareDocumentList,
	getDocumentInfo,
	setNewComment,
	deleteDocument,
	getProductList,
	documentAdd,
	documentMove,
	getProductDetail,
	getDocumentFolderList,
	competitorEdit,
	editFileOrFolder,
	unShareFile,
	shareFile,
	getProcessVariables,
	getCategoryTreeList,
	getCategoryList,
	getbizOpptyList,
	getquotaList,
	addBizOppty,
	deleteBizOppty,
	transferBizOppty,
	getbizOpptySaleStatus,
	getBizOpptyInfo,
	updateProductQuote,
	getSaleStatusDict,
	upbizOpptySaleStatus,
	getCategoryDetail,
	checkDepartCharge,
	upbizOpptySaleStatus,
	checkBizOpptyName,
	getMyAnnouncementSend,
	editMyAnnouncementSend,
	getProductQuoteDetail,
	getUndoMsgNum,
	getBizOpptyBoard,
	getBoardDetailList,
	getBelongDepart,
	getCooperationList,
	addCooperation,
	editBizOppty,
	getClueSourcelist,
	addClueSource,
	editClueSource,
	deleteClueSource,
	getClueInfoById,
	addFeedBack,
	verifySysCustomer,
	convertCustomer,
	convertBizOppty,
	getFunnelAnalysis,
	getFunnelReportForm,
	getBluePrintList,
	addBluePrint,
	getFunnelForcast,
	getDeptList,
	getCashList,
	addCashPlan,
	editCashPlan,
	getCashDetail,
	deleteCashPlan,
	getPlanItemList,
	getCollectionList,
	getCollectionItem,
	deleteCollectionRecord,
	addCollection,
	editCollection,
	getPaymentPlanList,
	getPaymentPlanItem,
	addPaymentPlan,
	editPaymentPlan,
	getPaymentList,
	getPaymentItem,
	deletePaymentRecord,
	addPayment,
	editPayment,
	getContractList,
	getBluePrintById,
	addBlueprintTargets,
	getBlueprintTargetsList,
	getBlueprintTargetsById,
	editBlueprintTargets,
	deleteBlueprintTargetsById,
	getDeptList,
	getBlueprintPersonalList,
	getBlueprintPersonalById,
	addBlueprintPersonal,
	editBlueprintPersonal,
	deleteBlueprintPersonalById,
	getBlueprintContractorList,
	addBlueprintContractor,
	deleteBlueprintContractorById,
	getBlueprintContractorById,
	editBlueprintContractor,
	getBlueprintCompanyList,
	addBlueprintCompany,
	deleteBlueprintCompanyById,
	getBlueprintCompanyById,
	editBlueprintCompany,
	getpromotionPlanList,
	getpromotionPlanTree,
	addpromotionPlan,
	getpromotionPlanById,
	editpromotionPlan,
	deletepromotionPlanById,
	getBluePrintRes,
	getproductQuoteList,
	addproductQuote,
	getProductQuoteById,
	getProductQuoteRecord,
	getRelRecordByBizCodeAndId,
	editproductQuote,
	deleteProductQuoteById,
	getListSumCompany,
	riseManageAdd,
	riseManageEdit,
	getListInvoiceManage,
	invoiceManageAdd,
	getInvoicingDetail,
	invoiceDetailedManageAdd,
	invoiceMentDetailsInfo

}
