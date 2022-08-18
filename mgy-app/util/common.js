/**
 * 判断字符串是否为空
 * @param {} obj 
 * @returns 
 */
function isEmpty(obj){
    if(typeof obj=="undefined" || obj ==null || obj == ""){
        return true;
    }else{
        return false;
    }
}
function getQueryVariable(query,variable) {
	//var query = this.paraString;
	var rooms = query.split('?');
	let value="";
	for (var i = 0; i < rooms.length; i++) {
		var pair = rooms[i].split('=');
		if (pair[0] == variable) {
			value=(pair[1].split('&'))[0]
			return value
		}
	}
	//或者拼接&后面的值
	var vars = query.split('&')
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=')
		if (pair[0] == variable) {
			value=pair[1]
			return value
		}
	}
	return value
}
//判断浏览器是否是微信浏览器
function checkIsWechatBrowser(){
  return (
    navigator.userAgent.toLowerCase().match(/MicroMessenger/i) =="micromessenger"
  );
};

//微信浏览器中打开H5隐藏顶部导航方法
function hidePageNavInWechatBrowser(){
  //#ifdef H5
  if (checkIsWechatBrowser()) {
    let pageNav = document.getElementsByTagName("uni-page-head");
    if (pageNav && pageNav[0]) {
      pageNav[0].style.display = "none";
    }
  }
  //#endif
};

/**
 * js将post请求的参数对象转换成get的形式拼接在url上
 * @param param
 * @returns {string}
 */
function changeParam(param) {
	if (!param) return '';
	return '?' +
	       Object.keys(param)
	       .map(key => `${key}=${param[key]}`)
	       .join('&');
}

function renderSize(value){
    if(null==value||value==''){
        return "0 Bytes";
    }
    var unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
    var index=0;
    var srcsize = parseFloat(value);
    index=Math.floor(Math.log(srcsize)/Math.log(1024));
    var size =srcsize/Math.pow(1024,index);
    size=size.toFixed(2);//保留的小数位数
    return size+unitArr[index];
}

module.exports = { //必须在这里暴露接口，以便被外界访问，不然就不能访问
  isEmpty,
  getQueryVariable,
  hidePageNavInWechatBrowser,
  changeParam,
  renderSize
}
