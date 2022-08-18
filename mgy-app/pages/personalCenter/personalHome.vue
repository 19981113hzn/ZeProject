<template>	
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<view class="head-bg">
			<u-navbar class="navbar" @leftClick="leftClick"></u-navbar>
			<u--image class="head-img" src="https://cdn.uviewui.com/uview/album/1.jpg" shape="circle" width="80px" height="80px"></u--image>
			<u--text align="center" class="pat" size="18" :text="userInfo.realname"></u--text>
			<u--text align="center" class="pat" size="15" :text="userInfo.post"></u--text>
		</view>
		<u-cell title="基本信息"></u-cell>
		<u--form :model="userInfo"  ref="form1" labelWidth="100">
			<u-form-item label="公司" prop="userInfo.sex" borderBottom ref="item1">
				<u--input v-model="userInfo.orgName" border="none" placeholder="" maxlength="11"></u--input>
			</u-form-item>
			<u-form-item label="部门" prop="userInfo.sex" borderBottom ref="item1">
				<u--input v-model="userInfo.deptNames" border="none" placeholder="" maxlength="11"></u--input>
			</u-form-item>
			<u-form-item label="手机" prop="userInfo.phone" borderBottom ref="item1">
				<u--input v-model="userInfo.phone" border="none" placeholder="" maxlength="11"></u--input>
			</u-form-item>
			<u-form-item label="账号" prop="userInfo.wecha" borderBottom ref="item1">
				<u--input v-model="userInfo.username" border="none" placeholder="" maxlength="11"></u--input>
			</u-form-item>
			<u-form-item label="生日" prop="userInfo.birthday" borderBottom ref="item1">
				<u--input v-model="userInfo.birthday" border="none" placeholder="" maxlength="11"></u--input>
			</u-form-item>
			<u-form-item label="邮箱" prop="userInfo.mailbox" borderBottom ref="item1">
				<u--input v-model="userInfo.mailbox" border="none" placeholder="" maxlength="11"></u--input>
			</u-form-item>
			
		<!-- 	<u-form-item label="座机/分机" prop="userInfo.Landline" borderBottom ref="item1">
				<u--input v-model="userInfo.Landline" border="none" placeholder="" maxlength="11"></u--input>
			</u-form-item> -->
		</u--form>
	</view>
	<!-- <u--text text="基本信息"></u--text> -->
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight:getApp().globalData.statusBarHeight,//状态栏高度
				userInfo:{
					sex:"女",
					phone:"18033441894",
					birthday:"1985-05-16",
					mailbox:"Windir@gdinfo-one.com",
					wecha:"18033441894",
					Landline:"0755-88888888",
				}
			}
		},
		created() {
			this.$nextTick(function(){
				this.userInfo = {...getApp().globalData.userInfo}
			})
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head-bg{
		width: 100%;
		height: 200px;
		background: rgba(0,0,0,0.3);
	}
	/deep/.navbar .u-navbar__content{
		background: none !important;
	}
	.head-img{
		width: 80px;
		height: 80px;
		margin: 40px auto 0 auto;
	}
	/deep/.pat {
		width: 100%;
		text-align: center;
		.u-text__value{
			display: block;
		}
	}
	/deep/.u-form-item__body__left__content__label{
		margin-left: 16px;
		color: rgba(0,0,0,0.6);
	}
</style>
