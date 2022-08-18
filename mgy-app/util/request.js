const app = getApp();
import {
	isEmpty
} from "@/util/common.js"
// const url = "http://112.94.26.121:8181"; //外网
// const urlfile = 'http://112.94.26.121:5225';

const url = "http://192.168.196.37:81"; //内网
const urlfile = 'http://192.168.196.37:8012'

// const url = "http://192.168.196.56:9999"; //李/
// const url = "http://192.168.196.25:9999"; //叶
// const url = "http://192.168.196.55:9999"; //卓
// const url = "http://192.168.196.29:9999"; //陈
function isHaveNetwork() {
	uni.getNetworkType({
		success: (res) => {
			if (res.networkType == 'none') {
				console.log("无网络")
				if (!app.globalData.isHaveNetworkShow) {
					app.globalData.isHaveNetworkShow = true;
					uni.showModal({
						title: '没有网络',
						content: '是否重新连接',
						success: (res) => {
							app.globalData.isHaveNetworkShow = false;
							if (res.confirm) {
								this.isHaveNetwork() //
							} else if (res.cancel) {

							}
						}
					});
				}
				return false;
			} else {
				//this.getData('')  //有网
				console.log("有网络")
				app.globalData.isHaveNetworkShow = false;
				return true;
			}
		}
	});
}

/**
 * @param {Object} method   POST/PUT
 * @param {Object} documentElement  方法路径与方法名
 * @param {Object} dataJSON   数据
 * @param {Object} funSuccess  成功返回
 * @param {Object} funFail  失败返回
 */
function cloudRequest(method, documentElement, dataJSON, funSuccess, funFail) {
	let autelToken = uni.getStorageSync("_token").data;
	uni.request({
		url: url + documentElement,
		method: method,
		header: {
			'content-type': dataJSON.contentType ? dataJSON.contentType : 'application/json',
			"X-Access-Token": autelToken
		},
		data: dataJSON,
		success(res) {
			if (funSuccess != undefined) {
				if (res.data.code == 401) { //Token失效，请重新登录!
					uni.$u.toast(res.data.message);
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/login/login",
						})
					}, 1000)
				} else {
					funSuccess(res.data);
				}
			}
		},
		fail(res) {
			console.log(res)
			if (isHaveNetwork()) {
				uni.$u.toast(res.data.message);
				uni.reLaunch({
					url: "/pages/login/login",
				})
				if (funFail != undefined) {
					funFail(res);
				}
			} else {
				console.log("无法连接服务器")
				if (!isEmpty(res.errMsg)) {
					if (!app.globalData.isRequestFail && !app.globalData.isHaveNetworkShow) {
						app.globalData.isRequestFail = true;
						uni.showModal({
							title: '系统提示',
							content: '无法连接服务器，请联系管理员处理',
							showCancel: false, //没有取消按钮的弹框
							success: (res) => {
								app.globalData.isRequestFail = false;
								if (res.confirm) {

								} else if (res.cancel) {

								}
							}
						});
					}
				}
			}

		}
	})
}
//生成分割字符串
function generateDivisionStr() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		let r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16);
	})
}

function generateUploadParams(str, obj) {
	let pra = ''
	Object.keys(obj).forEach(key => {
		//如果是ArrayBuffer类型的图片文件
		if (typeof obj[key] === "object") {
			//随机图片文件名
			let iName = generateDivisionStr()
			pra += `\r\n--${str}` +
				`\r\nContent-Disposition: form-data; name="${key}";filename="${iName}.png"` +
				`\r\nContent-Type: "image/png"` +
				`\r\n` +
				`\r\n${obj[key]}`
		} else {
			pra += `\r\n--${str}` +
				`\r\nContent-Disposition: form-data; name="${key}"` +
				`\r\n` +
				`\r\n${obj[key]}`
		}
	})
	pra = pra + `\r\n--${str}--`
	console.log('pra ---------- ', pra)
	return pra
}

function cloudRequestFormData(method, documentElement, dataJSON, funSuccess, funFail, add) {
	let str = generateDivisionStr()
	let obj = generateUploadParams(str, dataJSON)

	let autelToken = uni.getStorageSync("_token").data;
	uni.request({
		url: url + documentElement,
		method: method,
		header: {
			'content-type': 'multipart/form-data;boundary=' + str,
			"X-Access-Token": autelToken
		},
		data: obj,
		success(res) {
			if (funSuccess != undefined) {
				if (res.data.code == 401) {
					uni.$u.toast(res.data.message);
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/login/login",
						})
					}, 1000)
				} else {
					funSuccess(res.data);
				}
			}
		},
		fail(res) {
			console.log(res)
			if (isHaveNetwork()) {
				uni.$u.toast(res.data.message);
				uni.reLaunch({
					url: "/pages/login/login",
				})
				if (funFail != undefined) {
					funFail(res);
				}
			} else {
				if (!isEmpty(res.errMsg)) {
					if (!app.globalData.isRequestFail && !app.globalData.isHaveNetworkShow) {
						app.globalData.isRequestFail = true;
						uni.showModal({
							title: '系统提示',
							content: '无法连接服务器，请联系管理员处理',
							showCancel: false, //没有取消按钮的弹框
							success: (res) => {
								app.globalData.isRequestFail = false;
								if (res.confirm) {

								} else if (res.cancel) {

								}
							}
						});
					}
				}
			}
		}
	})
}

function cloudRequestFormUrlencoded(method, documentElement, dataJSON, funSuccess, funFail, add) {
	let autelToken = uni.getStorageSync("_token").data;
	uni.request({
		url: url + documentElement,
		data: dataJSON,
		method: method,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded;',
			"X-Access-Token": autelToken
		},
		success(res) {
			if (funSuccess != undefined) {
				if (res.data.code == 401) {
					uni.$u.toast(res.data.message);
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/login/login",
						})
					}, 1000)
				} else {
					funSuccess(res.data);
				}
			}
		},
		fail(res) {
			if (isHaveNetwork()) {
				uni.$u.toast(res.data.message);
				uni.reLaunch({
					url: "/pages/login/login",
				})
				if (funFail != undefined) {
					funFail(res);
				}
			} else {
				if (!isEmpty(res.errMsg)) {
					if (!app.globalData.isRequestFail) {
						app.globalData.isRequestFail = true;
						uni.showModal({
							title: '系统提示',
							content: '无法连接服务器，请联系管理员处理',
							showCancel: false, //没有取消按钮的弹框
							success: (res) => {
								app.globalData.isRequestFail = false;
								if (res.confirm) {

								} else if (res.cancel) {

								}
							}
						});
					}
				}
			}
		}
	})
}

function cloudRequestGetOrDelete(method, documentElement, dataJSON, funSuccess, funFail) {
	let autelToken = uni.getStorageSync("_token").data;
	console.log('dataJSON', dataJSON)
	uni.request({
		url: url + documentElement + dataJSON,
		method: method,
		header: {
			'content-type': 'application/json',
			"X-Access-Token": autelToken
		},
		//data: dataJSON,
		success(res) {
			if (funSuccess != undefined) {
				if (res.data.code == 401) {
					uni.$u.toast(res.data.message);
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/login/login",
						})
					}, 1000)
				} else {
					funSuccess(res.data);
				}
			}
		},
		fail(res) {
			console.log(res)
			if (isHaveNetwork()) {
				uni.$u.toast(res.data.message);
				uni.reLaunch({
					url: "/pages/login/login",
				})
				if (funFail != undefined) {
					funFail(res);
				}
			} else {
				console.log("无法连接服务器")
				if (!isEmpty(res.errMsg)) {
					if (!app.globalData.isRequestFail && !app.globalData.isHaveNetworkShow) {
						app.globalData.isRequestFail = true;
						uni.showModal({
							title: '系统提示',
							content: '无法连接服务器，请联系管理员处理',
							showCancel: false, //没有取消按钮的弹框
							success: (res) => {
								app.globalData.isRequestFail = false;
								if (res.confirm) {

								} else if (res.cancel) {

								}
							}
						});
					}
				}
			}


		}
	})
}
/**云端上传文件
 * @param {any} cname 要上传文件资源的路径 (本地路径)
 * @param {any} cname 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * @param {any} cname 云端方法名
 * @param {any} cname 附带的参数
 * @param {any} cname 成功返回
 * @param {any} cname 成功失败
 */
function cloudRequestFile(filePath, name, documentElement, dataJSON, funSuccess, funFail) {
	let autelToken = uni.getStorageSync("_token").data;
	uni.uploadFile({
		url: url + documentElement,
		filePath: filePath,
		name: name,
		header: {
			"X-Access-Token": autelToken
		},
		formData: dataJSON,
		success(res) {
			if (funSuccess != undefined) {
				if (res.data.code == 401) {
					uni.$u.toast(res.data.message);
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/login/login",
						})
					}, 1000)
				} else {
					funSuccess(res.data);
				}
			}
		},
		fail(res) {
			console.log(res)
			if (isHaveNetwork()) {
				uni.$u.toast(res.data.message);
				uni.reLaunch({
					url: "/pages/login/login",
				})
				if (funFail != undefined) {
					funFail(res);
				}
			} else {
				console.log("无法连接服务器")
				if (!isEmpty(res.errMsg)) {
					if (!app.globalData.isRequestFail && !app.globalData.isHaveNetworkShow) {
						app.globalData.isRequestFail = true;
						uni.showModal({
							title: '系统提示',
							content: '无法连接服务器，请联系管理员处理',
							showCancel: false, //没有取消按钮的弹框
							success: (res) => {
								app.globalData.isRequestFail = false;
								if (res.confirm) {

								} else if (res.cancel) {

								}
							}
						});
					}
				}
			}

		}
	})
}

// 多文件上传
function cloudRequestFilePlus(documentElement, data, funSuccess, funFail) {
	let autelToken = uni.getStorageSync("_token").data;

	let str = generateDivisionStr()
	let obj = generateUploadParams(str, data)
	uni.uploadFile({
		url: url + documentElement,
		files: data,
		header: {
			"X-Access-Token": autelToken
		},
		success(res) {
			if (funSuccess != undefined) {
				if (res.data.code == 401) {
					uni.$u.toast(res.data.message);
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/login/login",
						})
					}, 1000)
				} else {
					funSuccess(res.data);
				}
			}
		},
		fail(res) {
			console.log('&&&&&&&', res)
			if (isHaveNetwork()) {
				uni.$u.toast(res.data.message);
				uni.reLaunch({
					url: "/pages/login/login",
				})
				if (funFail != undefined) {
					funFail(res);
				}
			} else {
				console.log("无法连接服务器")
				if (!isEmpty(res.errMsg)) {
					if (!app.globalData.isRequestFail) {
						app.globalData.isRequestFail = true;
						uni.showModal({
							title: '系统提示',
							content: '无法连接服务器，请联系管理员处理',
							showCancel: false, //没有取消按钮的弹框
							success: (res) => {
								app.globalData.isRequestFail = false;
								if (res.confirm) {

								} else if (res.cancel) {

								}
							}
						});
					}
				}
			}

		}
	})
}

/**
 * 文件预览
 * @param {file} file
 * @param {string} watermark
 */
function filePreview(url, watermark = '物壹科技') {
	// const url = encodeURIComponent(window.btoa(file.url));
	const link = encodeURIComponent(url);
	return urlfile + '/onlinePreview?url=' + link + '&watermarkTxt=' + encodeURIComponent(
		watermark);
}

module.exports = { //必须在这里暴露接口，以便被外界访问，不然就不能访问
	cloudRequest: cloudRequest,
	cloudRequestFormData: cloudRequestFormData,
	cloudRequestFormUrlencoded: cloudRequestFormUrlencoded,
	cloudRequestGetOrDelete: cloudRequestGetOrDelete,
	cloudRequestFile: cloudRequestFile,
	cloudRequestFilePlus,
	filePreview,
}
