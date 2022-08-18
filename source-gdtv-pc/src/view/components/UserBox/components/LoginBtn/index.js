import React from 'react';
import { Button } from 'antd';

import LoginModal from 'Components/LoginModal';
import RegisterModal from 'Components/RegisterModal';

import styles from './index.less';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginModalVisible: false,
            registerModalVisible: false
        };
    }

    /** 打开登录模态框 */
    handleOpenLoginModal = () => {
        const { onClick = () => null } = this.props;
        onClick();
        this.setState({ loginModalVisible: true });
    }

    /** 打开注册模态框 */
    handleOpenRegisterModal = () => {
        this.setState({ registerModalVisible: true });
    }

    render() {
        const { loginModalVisible, registerModalVisible } = this.state;
        return (
            <div className={styles['btn-login-warpper']}>
                <Button
                    type='primary'
                    shape='round'
                    block
                    onClick={this.handleOpenLoginModal}
                >
                    登录/注册
                </Button>

                {loginModalVisible &&
                    <LoginModal
                        visible={loginModalVisible}
                        onCancel={() => { this.setState({ loginModalVisible: false }); }}
                        onOpenRegister={this.handleOpenRegisterModal}
                    />
                }
                {registerModalVisible &&
                    <RegisterModal
                        visible={registerModalVisible}
                        onCancel={() => { this.setState({ registerModalVisible: false }); }}
                        onOpenLogin={this.handleOpenLoginModal}
                    />
                }
            </div>
        );
    }
}
