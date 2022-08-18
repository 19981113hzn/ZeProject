<template>
	<view>
		<u-cell-group class="body-group">
			<!-- <u-cell  title="个人资料" isLink  size="large">
				<u-icon slot="icon" size="18" name="setting"></u-icon>
			</u-cell> -->
			<u-cell  title="首页设置" isLink  size="large" url="/pages/personalCenter/accountSettings/homeSettings">
				<u-icon slot="icon" size="18" name="setting"></u-icon>
			</u-cell>
			<u-cell  title="提醒设置" isLink  size="large" url="/pages/personalCenter/accountSettings/reminderSettings">
				<u-icon slot="icon" size="18" name="setting"></u-icon>
			</u-cell>
			<!-- <u-cell  title="清空缓存" isLink  size="large" @click="wipeCache">
				<u-icon slot="icon" size="18" name="setting"></u-icon>
			</u-cell> -->
		</u-cell-group>
		
		<u-button class="but"  type="primary" text="退出登录"  @click="oglOut"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			oglOut(){
				this.$cache.clear();
				uni.reLaunch({
					url: "/pages/login/login"
				})
			},
			wipeCache(){
				this.$cache.clear();
				uni.reLaunch({
					url: "/pages/login/login"
				})
			}
		}
	}
</script>

<style  lang="scss" scoped>
.body-group{
		margin-top: 28rpx;
		background: #fff;
	}	
.but{
	width: 90%;
	margin-top: 50px;
}
</style>
