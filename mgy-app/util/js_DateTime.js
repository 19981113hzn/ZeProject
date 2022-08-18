//时间戳转换成日期时间
function js_date_time(unixtime) {
  var date = new Date(unixtime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d;
}
/**获取当前时间需要数据格式
 * @param {any} Rule 返回的时间规则例如"yyyy-MM-dd"
 */
function GetNowFormatDate(Rule) {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = "";
  if (Rule.indexOf("yyyy") > -1) {
    currentdate += (date.getFullYear() + seperator1);
  }
  if (Rule.indexOf("MM") > -1) {
    currentdate += (month + seperator1);
  }
  if (Rule.indexOf("dd") > -1) {
    currentdate += (strDate + " ");
  }
  if (Rule.indexOf("hh") > -1) {
    var hh = date.getHours();
    hh = hh < 10 ? "0" + hh : hh;
    currentdate += (hh + seperator2);
  }
  if (Rule.indexOf("mm") > -1) {
    var mm = date.getMinutes();
    mm = mm < 10 ? "0" + mm : mm;
    currentdate += (mm + seperator2);
  }
  if (Rule.indexOf("ss") > -1) {
    var ss = date.getSeconds();
    ss = ss < 10 ? "0" + ss : ss;
    currentdate += ss ? ss : "0";
  }
  return currentdate;
}

module.exports = {
	js_date_time,GetNowFormatDate
}