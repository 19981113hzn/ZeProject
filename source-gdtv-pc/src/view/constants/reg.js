/** 手机号码 */
export const PHONE_NUMBER = {
    pattern: /^1\d{10}$/i,
    text: '手机号码格式不正确，请重新输入'
};

/** 注册验证码： 6位数字 */
export const SIGNUP_VALIDCODE = {
    pattern: /^\d{6}$/,
    text: '验证码应为6为数字'
};

/** 密码： 至少6位，最多20位 */
export const PASSWORD_NUM = {
    pattern: /^[\s\S]{6,20}$/,
    text: '密码必须为6-20位'
};

/** 密码： 必须包含字母和数字 */
export const PASSWORD_RULES = {
    pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![\s])[\S]{6,20}$/,
    text: '密码必须包含字母和数字'
};

/** 密码： 至少6位，最多20位，必须包含字母和数字 */
export const PASSWORD = {
    pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![\s])[\S]{6,20}$/,
    text: '密码必须为6-20位，不能为纯数字、纯字母或纯字符'
};

/** 真实姓名 */
export const REAL_NAME = {
    pattern: /^[\u4e00-\u9fa5]{2,8}$/,
    text: '姓名应为2-8位中文'
};

/** 身份证号码 */
export const ID_NUMBER = {
    pattern: /^[0-9a-zA-Z]{18}$/,
    text: '请输入合法身份证号码'
};

/** 首尾的空格 */
export const TRIM = {
    pattern: /(^\s*)|(\s*$)/g
};

/** 邮箱不能为空 */
export const EMAIL_REQUIRE = {
    require: true,
    text: '邮箱地址不能为空'
};

/** 手机号码不能为空 */
export const PHONE_NUMBER_REQUIRE = {
    require: true,
    text: '手机号码不能为空'
};

/** *
 * [获得字符串长度]
 * @param  {[string]} str  [传入字符串]
 * @return {[type]} name  [description]
  */
export const getStrLength = (str) => {
    let len = 0;

    if (!str) {
        return len;
    }

    for (let i = 0; i < str.length; i += 1) {
        const c = str.substr(i, 1);
        const ts = escape(c);
        if (ts.substring(0, 2) == '%u') {
            len += 2;
        } else {
            len += 1;
        }
    }
    return len;
};
