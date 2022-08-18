import React from 'react';
import {
    Modal, Form, Input, Checkbox, Button, message
} from 'antd';
import { connect } from 'react-redux';

import encrypt from 'Utils/encrypt';
import * as AccountActions from 'Global/account/actions';
import AccountSelectors from 'Global/account/selectors';

import * as REG from 'Constants/reg';
import styles from './index.less';

const FormItem = Form.Item;
const TIME = 60;

@connect(AccountSelectors, {
    register: AccountActions.register.request,
    getVerificationCode: AccountActions.getVerificationCode.request
})
@Form.create({})
class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 1,
            count: 60
        };
    }

    componentWillUnmount() {
        this.countInterval = clearInterval(this.countInterval);
    }

    /** 二次确认密码 */
    validatePwdConfirm = (rule, value, callback) => {
        if (value) {
            const formValues = this.props.form.getFieldsValue();
            if (formValues.password !== value) {
                return callback('两次密码输入不一致');
            }
        }
        return callback();
    }

    /** 跳转到登录 */
    handleToLogin = () => {
        this.props.onCancel();
        this.props.onOpenLogin();
    }

    /** 获取短信验证码 */
    handleGetCode = async () => {
        const formValues = this.props.form.getFieldsValue();
        const { phone } = formValues;
        if (!phone || !new RegExp(REG.PHONE_NUMBER.pattern).test(phone)) {
            message.error(REG.PHONE_NUMBER.text);
            return;
        }

        if (this.state.count == TIME) {
            await new Promise((resolve, reject) => {
                this.props.getVerificationCode({ mobileNumber: phone, type: 1 }, resolve, reject);
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

    /** 注册 */
    handleRegister = () => {
        const { form } = this.props;
        form.validateFields(async (err, values) => {
            if (err) {
                return;
            }
            // if (!values.agree) {
            //     Modal.warn({ title: '请阅读并同意《用户协议》及《隐私政策》' });
            //     return;
            // }
            const data = {
                account: values.phone,
                password: encrypt(values.password),
                verificationCode: values.code
            };
            await new Promise((resolve, reject) => {
                this.props.register(data, resolve, reject);
            });
            message.success('注册成功');
            this.handleToLogin();
        });
    }

    render() {
        const { count } = this.state;
        const { form, visible, isRequesting } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                className={styles['register-modal']}
                visible={visible}
                width={440}
                footer={null}
                mask={false}
                maskClosable={false}
                onCancel={this.props.onCancel}
            >
                <h4>账号注册</h4>
                <Form>
                    <FormItem>
                        {getFieldDecorator('phone', {
                            rules: [
                                { required: true, message: '请输入手机号码' },
                                { pattern: REG.PHONE_NUMBER.pattern, message: REG.PHONE_NUMBER.text }
                            ],
                            validateTrigger: 'onBlur'
                        })(
                            <Input type='text' placeholder='手机号码' allowClear />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [
                                { required: true, message: '请输入密码' },
                                { pattern: REG.PASSWORD.pattern, message: REG.PASSWORD.text }
                            ],
                            validateTrigger: 'onBlur'
                        })(
                            <Input type='password' placeholder='密码' allowClear />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password_confirm', {
                            rules: [
                                { required: true, message: '请再次输入密码' },
                                { validator: this.validatePwdConfirm }
                            ],
                            validateTrigger: 'onBlur'
                        })(
                            <Input type='password' placeholder='密码确认' allowClear />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('code', {
                            rules: [{ required: true, message: '请输入验证码' }]
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
                    {/* <FormItem className={styles['form-item-agree']}>
                        {getFieldDecorator('agree', {
                            valuePropName: 'checked'
                        })(
                            <Checkbox className={styles['field-agree']}>我已阅读并同意</Checkbox>
                        )}
                        <a>《用户协议》</a>
                        及
                        <a>《隐私政策》</a>
                    </FormItem> */}
                </Form>
                <Button
                    className={styles['btn-register']}
                    type='primary'
                    shape='round'
                    block
                    onClick={this.handleRegister}
                    loading={isRequesting}
                >
                    立即注册
                </Button>
                <a onClick={this.handleToLogin}>返回登录</a>
            </Modal>
        );
    }
}

export default LoginModal;
