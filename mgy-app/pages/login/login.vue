<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<image class="logo" src="/static/img/logo.png"></image>
		<view class="content">
			<u--form :model="userInfo" :rules="rules" ref="formRef" labelWidth="80">
				<view v-if="isMobile">
					<u-form-item label="手机号" prop="mobile" borderBottom ref="item1">
						<u--input type="number" v-model="userInfo.mobile" border="none" placeholder="请输入手机号" maxlength="11" clearable></u--input>
					</u-form-item>
					<u-form-item label="验证码" borderBottom>
						<u-input type="number" v-model="userInfo.verifyCode" placeholder="请输入验证码" maxlength="6" border="none" clearable>
							<template slot="suffix">
								<u-code ref="uCode" @change="codeChange" seconds="120" start-text="点击获取" changeText="X秒重新获取"></u-code>
								<u--text type="info"  @tap="getCode" :text="'| '+tips"></u--text>
							</template>
						</u-input>
					</u-form-item>
				</view>
				<view v-else>
					<u-form-item label="账号" prop="username" borderBottom ref="item1">
						<u--input v-model="captchaInfo.username" border="none" placeholder="请输入账号" maxlength="50" clearable></u--input>
					</u-form-item>
					<u-form-item label="密码" prop="password" borderBottom ref="item1">
						<u--input type="password" v-model="captchaInfo.password" :password="true" border="none" placeholder="请输入密码" maxlength="50" clearable></u--input>
					</u-form-item>
					<u-form-item label="验证码" borderBottom>
						<u-input  maxlength="4" v-model="captchaInfo.captcha" placeholder="请输入验证码" border="none" clearable>
							<template slot="suffix">
								<u--image :showLoading="true" :src="src" width="105px" height="35px" @click="getRandomImage"></u--image>
							</template>
						</u-input>
					</u-form-item>
				</view>
				<u-form-item>
					<u-button 
					color="linear-gradient(to right, rgba(0, 198, 255, 1), rgba(0, 114, 255, 1))" 
					shape="circle" 
					text="登录"  
					@click="onLogin"></u-button>					
				</u-form-item>
				<view >
					<!-- <text class="forget">忘记密码？</text> -->
					<text class="forget mobileNum" @click="clickMobileNum">{{isMobile?'账号密码登录':'手机号登录'}}</text>
				</view>
				<u-form-item>
					<u-checkbox-group v-model="checkName"  @change="checkboxChange">
						<u-checkbox
							labelSize="10px"
							shape="circle"
							:customStyle="{marginBottom: '8px'}"
							label="我已阅读并接受"
							:name="1"
						></u-checkbox>
					</u-checkbox-group>					
					<view class="content-privacy">
						<span>《</span><text>蘑菇云隐私说明</text><span>》和《</span><text>用户协议</text><span>》</span>
					</view>
				</u-form-item>
			</u--form>
		</view>
		<!-- <view class="content-foot" @click="enterpriseLogin">
			<u--image src="/static/img/enterprise_wechat.png" width="30px" height="25px"></u--image>
			<text>企业微信快速登录</text>
		</view> -->
		<view class="foot-height">
			<u-divider text="一键登录" textColor="rgba(144, 147, 153, 1)" lineColor="rgba(144, 147, 153, 1)"></u-divider>
			<view class="foot-img">
				<image class="foot-logo rigth-img" @click="enterpriseLogin" src="/static/img/login-enterprise-wechat.png"></image>
				<image class="foot-logo left-img" @click="oneLogin()" src="/static/img/login-one-click.png"></image>
			</view>
		</view>
		<u-modal :show="showMessage"  @confirm="showMessage=false" :closeOnClickOverlay="true" title="系统提示" :content='contentMessage' style="z-index: 999;"></u-modal>
	</view>
</template>

<script>
	import { sendVerifyCode,smsLogin,randomImage,accountPasswordLogin,oneclickLogin} from "@/util/interface.js";
	import {isEmpty} from "@/util/common.js"
	export default {		
		data() {
			return {
				showMessage:false,
				contentMessage:"",
				statusBarHeight:getApp().globalData.statusBarHeight,//状态栏高度
				userInfo: {
					mobile: '',
					verifyCode: '',//短信验证码
				},
				captchaInfo:{
					username:"",
					password:"",
					captcha:"",//验证码
					checkKey:"",//时间戳
				},
				src: 'https://cdn.uviewui.com/uview/album/1.jpg',
				checkName:[],
				tips: "",
				isMobile:false,
				isLogin:false,//是否登录(防止重复登录)
				rules: {
					'mobile': [
						{
							required: true, 
							message: '请输入手机号',
							trigger: ['change','blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change','blur'],
						}
					],
					// "username":[{
					// 	required: true,
					// 	message: '请输入账号',
					// 	trigger: ['change','blur'],
					// }],
					// "password":[{
					// 	required: true,
					// 	message: '请输入密码',
					// 	trigger: ['change','blur'],
					// }]
				
				},
				
			}
		},
		onLoad(option){
			 // let token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRUeXBlIjoiQVBQIiwiZXhwIjoxNjU4NDc2NDYyLCJ1c2VySWQiOiIxNTM1MTc4NDU4MTA0MTE5Mjk3IiwidXNlcm5hbWUiOiJsdmd1aXpoZW4ifQ.s-W2CHmEHupYP_WDKJwGUt_WVjb-5y8ueuFFRSNQJU4"
			 // this.$cache.set('_token', token)//1*60*60*24*7
			// let token1={
			// 	"id": "1535178458104119297",
			// 	"username": "lvguizhen",
			// 	"realname": "吕桂珍",
			// 	"avatar": null,
			// 	"birthday": null,
			// 	"sex": 2,
			// 	"phone": "18898503350",
			// 	"deptNames": "研发组",
			// 	"post": "前端开发工程师",
			// 	"email": null,
			// 	"orgCode": "A01A08A02",
			// 	"orgCodeTxt": null,
			// 	"status": 1,
			// 	"delFlag": 0,
			// 	"workNo": "lvguizhen",
			// 	"telephone": "",
			// 	"createBy": "admin",
			// 	"createTime": "2022-06-10 16:34:01",
			// 	"updateBy": "lvguizhen",
			// 	"updateTime": "2022-06-16 16:33:29",
			// 	"activitiSync": null,
			// 	"userIdentity": null,
			// 	"departIds": null,
			// 	"relTenantIds": null,
			// 	"clientId": null,
			// 	"roleIds": null,
			// 	"roleNames": null,
			// 	"deptIds": "1535178423589191681",
			// 	"remark": null,
			// 	"orgId": "1535174676263780354",
			// 	"orgName": "物壹",
			// 	"roleLevel": 1,
			// 	"initFlag": 1
			// };
			//  this.$cache.set('_userInfo', token1)//1*60*60*24*7
			let type=isEmpty(option.type)?0:option.type;
			if(type!=1){
				//this.oneLogin();
			}
			this.getRandomImage();
			console.log(this.$cache.get('_userInfo'))
		},
		methods: {
			//一键登录
			oneLogin(){
				let that=this;
				uni.login({
					provider: 'univerify',
					univerifyStyle: { // 自定义登录框样式
					//参考`univerifyStyle 数据结构`
						"fullScreen": true, // 是否全屏显示，默认值： false
						"backgroundColor": "#ffffff",  // 授权页面背景颜色，默认值：#ffffff
						"backgroundImage": "", // 全屏显示的背景图片，默认值："" （仅支持本地图片，只有全屏显示时支持）  
						"authButton": {  
							"normalColor": "#3479f5", // 授权按钮正常状态背景颜色 默认值：#3479f5  
							"highlightColor": "#2861c5",  // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）  
							"disabledColor": "#73aaf5",  // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）  
							"textColor": "#ffffff",  // 授权按钮文字颜色 默认值：#ffffff  
							"title": "本机号码一键登录", // 授权按钮文案 默认值：“本机号码一键登录”  
							"borderRadius": "24px"	// 授权按钮圆角 默认值："24px" （按钮高度的一半）
						},  
						"otherLoginButton": {  
							"visible": true, // 是否显示其他登录按钮，默认值：true  
							"normalColor": "", // 其他登录按钮正常状态背景颜色 默认值：透明 
							"highlightColor": "", // 其他登录按钮按下状态背景颜色 默认值：透明 
							"textColor": "#656565", // 其他登录按钮文字颜色 默认值：#656565  
							"title": "其他登录方式", // 其他登录方式按钮文字 默认值：“其他登录方式”  
							"borderColor": "",  //边框颜色 默认值：透明（仅iOS支持）  
							"borderRadius": "0px" // 其他登录按钮圆角 默认值："24px" （按钮高度的一半）
						},  
						"icon": {  
								"path": "static/wuyi.png" // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo   
							},  
				  },
					success(res){ // 登录成功
						console.log(res.authResult);  // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
						console.log('access_token',res.authResult.access_token)
						console.log('openid',res.authResult.openid)
						let jsCode={
							access_token: res.authResult.access_token, // 客户端一键登录接口返回的access_token
							openid: res.authResult.openid ,// 客户端一键登录接口返回的openid
						}
						oneclickLogin(jsCode,res=>{
							uni.closeAuthView();
							if(res.code==200 && res.success){
								that.$cache.set('_token', res.result.token)//1*60*60*24*7
								that.$cache.set('_userInfo', res.result.userInfo)//1*60*60*24*7
								getApp().globalData.userInfo= res.result.userInfo
								uni.reLaunch({
									url: "/pages/main/main"
								})
							}else{
								that.showMessage=true;
								that.contentMessage=res.message
								//uni.$u.toast(res.message);
							}
							console.log(res)
							
						})
					},
					fail(res){  // 登录失败
						console.log(res)
						console.log(res.errMsg)
						uni.closeAuthView();
						//uni.closeAuthView(); // 关闭一键登录弹出窗口
						if(res.code == 30002){ // 点击其他方式登陆
							// uni.navigateTo({
							// 	url:"/pages/login/login",
							// })
						}
						if(res.code == 30006){ // 未检测到网络
							
							// that.showMessage=true;
							// that.contentMessage=res.metadata.resultDesc
							// uni.navigateTo({
							// 	url:"/pages/login/login",
							// })
						}
					},
				})
			},
			getRandomImage(){
				let checkKey=Date.now();
				randomImage(checkKey,res=>{
					if(res.code==200 && res.success){
						this.src=res.result;
						this.captchaInfo.checkKey=checkKey
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			checkboxChange(e){
				this.checkName=e;
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					if(isEmpty(this.userInfo.mobile)){
						uni.$u.toast('手机号不允许为空！');
						return false;
					}if(!uni.$u.test.mobile(this.userInfo.mobile)){
						uni.$u.toast('手机号码不正确！');
						return false;
					}
					uni.showLoading({
						title: '正在获取验证码'
					})
					let data={
						phone:this.userInfo.mobile,
						smsType:1
					}
					sendVerifyCode(data,res=>{
						uni.hideLoading();
						if(res.code==200 && res.success){
							uni.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						}else{
							uni.$u.toast(res.message);
						}
					})
					
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			onLogin() {
				if(!this.isLogin){
					if(this.isMobile){
						this.verifyCodeLogin()
					}else{
						this.captchaLogin();
					}
				}
				
			},
			//手机验证码登录
			verifyCodeLogin(){
				if(isEmpty(this.userInfo.mobile)){
					uni.$u.toast('手机号不允许为空');
					return false;
				}
				if(!uni.$u.test.mobile(this.userInfo.mobile)){
					uni.$u.toast('手机号码不正确');
					return false;
				}
				if(isEmpty(this.userInfo.verifyCode)){
					uni.$u.toast('验证码不允许为空');
					return false;
				}
				if(this.checkName.length==0){
					uni.$u.toast('请勾选协议');
					return false;
				}
				let data={
					clientType:"APP",
					phone:this.userInfo.mobile,
					verifyCode:this.userInfo.verifyCode
				}
				this.isLogin=true;
				smsLogin(data,res=>{
					if(res.code==200 && res.success){
						this.$cache.set('_token', res.result.token)//1*60*60*24*7
						this.$cache.set('_userInfo', res.result.userInfo)//1*60*60*24*7
						getApp().globalData.userInfo= res.result.userInfo
						uni.reLaunch({
							url: "../main/main"
						})
					}else{
						//uni.$u.toast(res.message);
						this.isLogin=false;
						this.showMessage=true;
						this.contentMessage=res.message
					}
					console.log(res)
				})
				
			},
			//账号密码登录
			captchaLogin(){
				if(isEmpty(this.captchaInfo.username)){
					uni.$u.toast('账号不允许为空');
					return false;
				}
				if(isEmpty(this.captchaInfo.password)){
					uni.$u.toast('密码不允许为空');
					return false;
				}
				if(isEmpty(this.captchaInfo.captcha)){
					uni.$u.toast('验证码不允许为空');
					return false;
				}
				if(this.checkName.length==0){
					uni.$u.toast('请勾选协议');
					return false;
				}
				this.captchaInfo.clientType="APP";
				this.isLogin=true;
				accountPasswordLogin(this.captchaInfo,res=>{
					if(res.code==200 && res.success){
						this.$cache.set('_token', res.result.token)//1*60*60*24*7
						this.$cache.set('_userInfo', res.result.userInfo)//1*60*60*24*7
						getApp().globalData.userInfo= res.result.userInfo
						uni.reLaunch({
							url: "../main/main"
						})
					}else{
						this.isLogin=false;
						if(res.code==500){
							uni.$u.toast(res.message);
							this.getRandomImage();
							this.captchaInfo.captcha="";
						}else{
							this.showMessage=true;
							this.contentMessage=res.message
						}
						
					}
					console.log(res)
				})
			},
			clickMobileNum(){
				this.$refs.formRef.clearValidate();//表单重置
				this.userInfo= {
					mobile: '',
					verifyCode: '',//短信验证码
					username:"",
					password:"",
					captcha:"",//验证码
					checkKey:"",//时间戳
				}
				if(this.isMobile){
					this.isMobile=false;
				}else{
					this.isMobile=true;
				}
			},
			enterpriseLogin(){
				 wx.qy.login({
				      suiteId:'', //非必填，第三方应用的suiteid，自建应用不填。若第三方小程序绑定多个第三方应用时，建议填上该字段
				      success: function(res) {
						  console.log(res)
				        if (res.code) {
				          //发起网络请求
				          // wx.request({
				          //   url: 'https://test.com/onLogin',
				          //   data: {
				          //     code: res.code
				          //   }
				          // })
						  
				        } else {
				          console.log('登录失败！' + res.errMsg)
				        }
				      }
				    });
			}
		}
	}
</script>

<style lang="scss">
	.logo {
		width: 237px;
		height: 200px;
		margin: auto;
		display: block;
	}

	.content {
		padding:16px 28px;
	}
	.u-form-item{
	    margin-top: 10px;
	}
	
	/deep/.content-privacy{
		line-height: 10px;
		margin-top: -9px;
		font-size: 10px;
		text{
			color: #0072FF;
		}
	}
	.content-foot{
		padding: 0 0 50px 0;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		justify-items: center;
		display: flex;
		justify-content: center;
		margin: 0 auto;
		text{
			color: #0072FF;
			margin-left: 10px;
		}
	}
	.mobileNum{
		// float: right;
		text-align: right;
		display: block;
	}
	.forget{
		font-size: 12px;
		color: #0072FF;
	}
	.foot-height{
		position: absolute; 
		bottom: 0px;
		width: 100%;
		height: 130px;
		background: #fff;	
		.foot-img{
			width: 137px;
			display: block;
			margin: auto;
			text-align: center;
		}
		.foot-logo{
			width: 48px;
			height: 48px;
		}
		.rigth-img{
			right: 20px;
		}
		.left-img{
			left: 20px;
		}
	}
</style>
