import React from 'react';
import {
    Modal, Tabs, Form, Input, Checkbox, Button, message
} from 'antd';
import { connect } from 'react-redux';

import encrypt from 'Utils/encrypt';
import * as AccountActions from 'Global/account/actions';
import AccountSelectors from 'Global/account/selectors';
import { KEY, THIRD_PARTY_LOGIN } from 'Global/account/constants';

import * as REG from 'Constants/reg';
import styles from './index.less';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const TIME = 60;
const WINDOW_SPECS = 'width=800,height=400,scrollbars=no,resizable=no';

@connect(AccountSelectors, {
    loginByPassword: AccountActions.loginByPassword.request,
    loginByCode: AccountActions.loginByCode.request,
    getImgVerificationCode: AccountActions.getImgVerificationCode.request,
    loginByThirdParty: AccountActions.loginByThirdParty.request,
    getVerificationCode: AccountActions.getVerificationCode.request
})
@Form.create({})
class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 2,
            count: 60,
            imgCodeImage: undefined
        };
        this.thirdPartyLogin = undefined;
    }

    componentDidMount() {
        const { account, remember } = localStorage;
        if (remember != undefined) {
            this.props.form.setFieldsValue({
                account,
                remember: remember == 1
            });
        }
        const redirectUri = 'https://www.gdtv.cn/login';
        this.setState({ redirectUri });
        window.addEventListener('message', this.messageCallBack);
    }

    componentWillUnmount() {
        this.countInterval = clearInterval(this.countInterval);
        if (this.thirdPartyLogin && this.thirdPartyLogin.close) {
            this.thirdPartyLogin.close();
        }
        window.removeEventListener('message', this.messageCallBack);
    }

    messageCallBack = (e) => {
        const { code, target } = e.data;
        console.log('message event', e, code);
        if (target == 'www.gdtv.cn') {
            this.thirdPartyLoginCallBack(e.data.code);
        }
    }

    /** 第三方登录回调 */
    thirdPartyLoginCallBack = (code) => {
        if (this) {
            this.handleThirdPartyLogin(code);
        }
    }

    /** 校验手机号 */
    validatePhone = (rule, value, callback) => {
        if (value) {
            if (!new RegExp(REG.PHONE_NUMBER.pattern).test(value)) {
                return callback(REG.PHONE_NUMBER.text);
            }
        }
        return callback();
    };

    /** 切换tab */
    handleChangeTab = (e) => {
        this.setState({ currentTab: e });
    }

    /** 跳转注册 */
    handleToRegister = () => {
        this.props.onCancel();
        this.props.onOpenRegister();
    }

    /** 跳转第三方登录 */
    handleToThirdPartyLogin = (type) => {
        const { redirectUri } = this.state;
        this.setState({ thirdPartyType: KEY[type] });
        const AppID = THIRD_PARTY_LOGIN[KEY[type]];
        let authUrl;
        const uri = encodeURIComponent(redirectUri);
        switch (type) {
            case 0:
                // 微信
                authUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${AppID}&redirect_uri=${uri}&response_type=code&scope=snsapi_login&state=#wechat_redirect`;
                break;
            case 1:
                // QQ
                authUrl = `https://graph.qq.com/oauth2.0/authorize?client_id=${AppID}&redirect_uri=${uri}&response_type=code&state=#qq_redirect`;
                break;
            case 2:
                // 微博
                authUrl = `https://api.weibo.com/oauth2/authorize?client_id=${AppID}&redirect_uri=${uri}&response_type=code&`;
                break;
            default:
                break;
        }
        this.thirdPartyLogin = window.open(authUrl, 'thirdPartyLogin', WINDOW_SPECS);
    }

    /** 获取验证码 */
    handleGetCode = async () => {
        const formValues = this.props.form.getFieldsValue();
        const { phone } = formValues;
        if (!phone || !new RegExp(REG.PHONE_NUMBER.pattern).test(phone)) {
            message.error(REG.PHONE_NUMBER.text);
            return;
        }

        if (this.state.count == TIME) {
            await new Promise((resolve, reject) => {
                this.props.getVerificationCode({ mobileNumber: phone, type: 0 }, resolve, reject);
            });
            message.success('验证码已发送');
        }
        this.countInterval = setInterval(() => {
            const { count } = this.state;
            if (count == 0) {
                this.countInterval = clearInterval(this.countInterval);
                this.setState({ count: TIME });
            } else {
                this.setState({ count: count - 1 });
            }
        }, 1000);
    }

    /* 获取图片验证码 */
    handleGetImgCode = async () => {
        this.props.form.validateFields(['account'], async (err, values) => {
            if (err) {
                return;
            }
            try {
                const imgData = await new Promise((resolve, reject) => {
                    this.props.getImgVerificationCode({ cType: 1, uuid: values.account }, resolve, reject);
                });
                console.warn('imgData', imgData);
                this.setState({
                    imgCodeImage: window.URL.createObjectURL(imgData)
                });
            } catch (error) {
                message.error('获取图片验证码失败');
            }
        });
    }

    /** 登录 */
    handleLogin = () => {
        const { currentTab } = this.state;
        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return;
            }
            if (currentTab == 1) {
                // 密码登录
                const data = {
                    account: values.account,
                    password: encrypt(values.password),
                    imgCode: values.imgCode
                };
                if (values.remember) {
                    localStorage.setItem('account', values.account);
                    localStorage.setItem('remember', 1);
                } else {
                    localStorage.removeItem('account');
                    localStorage.setItem('remember', 0);
                }
                try {
                    await new Promise((resolve, reject) => {
                        this.props.loginByPassword(data, resolve, reject);
                    });
                    this.setState({
                        imgCodeImage: undefined
                    });
                    message.success('登录成功');
                    this.props.onCancel();
                } catch (error) {
                    if (!(error && error.errorCode)) {
                        message.error('登录失败');
                    }
                    this.handleGetImgCode();
                }
            } else if (currentTab == 2) {
                // 验证码登录
                const data = {
                    account: values.phone,
                    verificationCode: values.code
                };
                await new Promise((resolve, reject) => {
                    this.props.loginByCode(data, resolve, reject);
                });
                message.success('登录成功');
                this.props.onCancel();
            }
        });
    }

    /** 第三方登录 */
    handleThirdPartyLogin = async (code) => {
        const { thirdPartyType, redirectUri } = this.state;
        const data = {
            code,
            redirectUri,
            thirdPartyType,
            os: 'pc_web'
        };
        try {
            await new Promise((resolve, reject) => {
                this.props.loginByThirdParty(data, resolve, reject);
            });
            message.success('登录成功');
            this.props.onCancel();
        } catch (error) {
            message.error('登录失败');
        }
    }

    render() {
        const { count, currentTab, imgCodeImage } = this.state;
        const { form, visible, isRequesting } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                className={styles['login-modal']}
                visible={visible}
                width={440}
                footer={null}
                mask={false}
                maskClosable={false}
                onCancel={this.props.onCancel}
            >
                <Tabs className={styles['login-tabs']} onChange={this.handleChangeTab} animated={false}>
                    <TabPane tab='短信登录' key='2'>
                        {currentTab == 2 &&
                            <Form>
                                <FormItem>
                                    {getFieldDecorator('phone', {
                                        rules: [
                                            { required: true, message: '请输入手机号码' },
                                            { validator: this.validatePhone }
                                        ],
                                        validateTrigger: 'onBlur'
                                    })(
                                        <Input type='text' placeholder='手机号码' allowClear />
                                    )}
                                </FormItem>
                                <FormItem className={styles['form-item']}>
                                    {getFieldDecorator('code', {
                                        rules: [{ required: true, message: '请输入验证码' }],
                                    })(
                                        <Input
                                            className={styles['field-code']}
                                            placeholder='验证码'
                                            maxLength={6}
                                            allowClear
                                        />
                                    )}
                                    <Button
                                        className={styles['btn-get-code']}
                                        type='primary'
                                        shape='round'
                                        disabled={count < TIME}
                                        onClick={this.handleGetCode}
                                    >
                                        {count < TIME ? `${count}s后重新获取` : '获取验证码'}
                                    </Button>
                                </FormItem>
                            </Form>
                        }
                    </TabPane>
                    <TabPane tab='账号登录' key='1'>
                        <div className={styles['error-tip']}>
                        </div>
                        {currentTab == 1 &&
                            <Form>
                                <FormItem>
                                    {getFieldDecorator('account', {
                                        rules: [
                                            { required: true, message: '请输入手机号码' },
                                            { validator: this.validatePhone }
                                        ],
                                        preserve: true,
                                        validateTrigger: 'onBlur'
                                    })(
                                        <Input type='text' placeholder='手机号码' allowClear />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: '请输入密码' }]
                                    })(
                                        <Input type='password' placeholder='密码' allowClear />
                                    )}
                                </FormItem>
                                <FormItem className={styles['form-item']}>
                                    {getFieldDecorator('imgCode', {
                                        rules: [{ required: true, message: '请输入图片验证码' }],
                                    })(
                                        <Input
                                            className={styles['field-code']}
                                            placeholder='图片验证码'
                                            maxLength={6}
                                            allowClear
                                        />
                                    )}
                                    {!imgCodeImage ? <Button
                                        className={styles['btn-get-code']}
                                        type='primary'
                                        shape='round'
                                        onClick={this.handleGetImgCode}
                                    >
                                        获取图片验证码
                                    </Button> : <img src={imgCodeImage} onClick={this.handleGetImgCode} className={styles['btn-get-code-img']} />}
                                </FormItem>
                                <FormItem className={styles['form-item']}>
                                    {getFieldDecorator('remember', {
                                        initialValue: true,
                                        valuePropName: 'checked'
                                    })(
                                        <Checkbox>记住我</Checkbox>
                                    )}
                                </FormItem>

                                {/* <a className={styles['btn-forget-pwd']}>忘记密码</a> */}
                            </Form>
                        }
                    </TabPane>

                </Tabs>
                <Button
                    className={styles['btn-login']}
                    type='primary'
                    shape='round'
                    block
                    onClick={this.handleLogin}
                    loading={isRequesting}
                >
                    登录
                </Button>
                <div className={styles['other-ways']}>
                    其他方式
                    <div className={styles['third-part']}>
                        <a onClick={() => { this.handleToThirdPartyLogin(0); }}>
                            <img src={require('Public/images/web_login_wx_color.png')} />
                        </a>
                        <a onClick={() => { this.handleToThirdPartyLogin(1); }}>
                            <img src={require('Public/images/web_login_qq_color.png')} />
                        </a>
                        {/* <a onClick={() => { this.handleToThirdPartyLogin(2); }}>
                            <img src={require('Public/images/web_login_sina_color.png')} />
                        </a> */}
                    </div>
                    <a className={styles['link-register']} onClick={this.handleToRegister}>立刻注册</a>
                </div>
            </Modal>
        );
    }
}

export default LoginModal;
