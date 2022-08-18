import React from 'react';
import { connect } from 'react-redux';
import {
    Popover, Button, Icon, Input, message
} from 'antd';
import * as AccountActions from 'Global/account/actions';
import AccountSelectors from 'Global/account/selectors';

import LoginBtn from '../LoginBtn';

import styles from './index.less';

const ButtonGroup = Button.Group;

/** 登录后默认头像 */
const AVATAR_LOGIN_DEFAULT = require('Public/images/default_user_avatar.png');

/** 未登录默认头像 */
const AVATAR_NO_LOGIN_DEFAULT = require('Public/images/default_user.png');

@connect(AccountSelectors, {
    logout: AccountActions.logout,
    updateUserInfo: AccountActions.updateUserInfo.request
})
class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            popoverVisible: undefined,
            valName: undefined,
            valAvatarUrl: undefined
        };
    }

    /**
     * 点击登录按钮时让Popover隐藏一下
     * 此方法属于骚操作
     * 因为登录按钮属于Popover子元素,正常点击弹窗后Popover不消失
     * 于是利用Popover的visible属性先隐藏,再去掉visible属性
     */
    handleOnClickLogin = () => {
        this.setState({ popoverVisible: false }, () => {
            this.setState({ popoverVisible: undefined });
        });
    }

    /** 开始编辑用户信息 */
    handleStartEdit = () => {
        const { userInfo } = this.props;
        this.setState({ isEdit: true, valName: userInfo.nickName });
    }

    /** 结束编辑用户信息 */
    handleFinishEdit = () => {
        this.setState({ isEdit: false, valAvatarUrl: undefined });
    }

    /** 监听用户信息气泡卡片显示 */
    handleOnVisibleChange = (visible) => {
        if (!visible) {
            setTimeout(() => {
                this.handleFinishEdit();
            }, 500);
        }
    }

    /** 修改名称 */
    handleInputName = (e) => {
        this.setState({ valName: e.target.value });
    }

    /** 修改上传头像 */
    handleChangeAvatarUrl = (url) => {
        this.setState({ valAvatarUrl: url });
    }

    /** 修改用户信息 */
    handleSaveUserInfo = async () => {
        const { userInfo } = this.props;
        const { valName, valAvatarUrl } = this.state;
        const data = {
            nickName: valName,
            avatarUrl: valAvatarUrl || userInfo?.avatarUrl
        };
        try {
            await new Promise((resolve, reject) => {
                this.props.updateUserInfo(data, resolve, reject);
            });
            message.success('修改成功');
            this.handleFinishEdit();
        } catch (error) {
            message.success('修改失败');
        }
    }

    /** 头像加载错误 */
    handleImgError = (e) => {
        const { userInfo } = this.props;
        e.target.src = userInfo.pk && AVATAR_LOGIN_DEFAULT || AVATAR_NO_LOGIN_DEFAULT;
    }

    renderAccountPopover = () => {
        const { isEdit, valName, valAvatarUrl } = this.state;
        const { userInfo = {} } = this.props;
        return (
            <div className={styles['user-account-popover']}>
                <div className={styles.info}>
                    <div className={styles['user-avatar-big']}>
                        <img
                            src={userInfo.avatarUrl || AVATAR_LOGIN_DEFAULT}
                            crossOrigin='anonymous'
                            onError={this.handleImgError}
                        />
                    </div>
                    {!isEdit &&
                        <React.Fragment>
                            <div className={styles['user-name']}>{userInfo.nickName}</div>
                            <a className={styles['btn-edit']} onClick={this.handleStartEdit}>
                                <Icon type='edit' />修改资料
                            </a>
                            <Button className={styles['btn-logout']} onClick={this.props.logout} block>退出登录</Button>
                        </React.Fragment>
                    }
                    {isEdit &&
                        <React.Fragment>
                            <Input
                                className={styles['input-name']}
                                maxLength={20}
                                value={valName}
                                onChange={this.handleInputName}
                            />
                            <ButtonGroup className={styles['btn-edit-group']}>
                                <Button onClick={this.handleFinishEdit}>取消</Button>
                                <Button className={styles['btn-save']} onClick={this.handleSaveUserInfo}>保存</Button>
                            </ButtonGroup>
                        </React.Fragment>
                    }
                </div>
            </div>
        );
    }

    renderLoginPopover = () => (
        <div className={styles['user-login-popover']}>
            <div className={styles.text}>登录后使用更多功能</div>
            <div className={styles['btn-open-login']}>
                <LoginBtn onClick={this.handleOnClickLogin} />
            </div>
        </div>
    );

    render() {
        const { isEdit, popoverVisible } = this.state;
        const { userInfo = {} } = this.props;
        return (
            <div className={styles['user-account']}>
                <Popover
                    trigger={isEdit ? 'click' : 'hover'}
                    placement='bottomRight'
                    content={userInfo.pk ? this.renderAccountPopover() : this.renderLoginPopover()}
                    onVisibleChange={this.handleOnVisibleChange}
                    getPopupContainer={(e) => e.parentElement}
                    {...(popoverVisible === undefined ? {} : { visible: popoverVisible })}
                >
                    <div className={styles['user-avatar-small']}>
                        <img
                            src={userInfo.pk && (userInfo.avatarUrl || AVATAR_LOGIN_DEFAULT) || AVATAR_NO_LOGIN_DEFAULT}
                            crossOrigin='anonymous'
                            onError={this.handleImgError}
                        />
                    </div>
                </Popover>
            </div>
        );
    }
}

export default Account;
