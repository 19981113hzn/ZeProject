<!--
 * @Author: wush wush@example.com
 * @Date: 2022-07-11 18:04:55
 * @LastEditors: wush wush@example.com
 * @LastEditTime: 2022-07-15 20:06:20
 * @FilePath: \mgy-app\components\xiaolu-tree\search\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<view class="tmp-box">
		<view class='filterBox'>
			<view class='filter-input'>
				<text style="color: #b8b8b8;" class="iconfont filterImg" />
				<image src="../../../static/img/icon_sousuo_16.png" mode=""></image>
				<input class="text" type='text' v-model="inputVal" confirm-type="搜索" @confirm='handleFilter'
					placeholder='搜索产品分类'>
				<uni-icons type="closeempty" size="14" @click="empty()"></uni-icons>
				</input>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputVal: "",
			};
		},
		methods: {
			handleFilter(e) {
				// console.log(e.detail.value)
				this.$emit("confirm", e.detail.value)
			},
			clears() {
				console.log(this.inputVal)
				this.inputVal = ""
				console.log('清除了内容')
			},
			empty() {
				this.inputVal = ''
			}
		},
	}
</script>

<style lang="scss" scoped>
	.filterBox {
		padding: 105rpx 32rpx 15rpx 32rpx;
		background-color: #fff;

		.filter-input {
			height: 60rpx;
			background-color: #eeeff0;
			border-radius: 40rpx;
			display: flex;
			align-items: center;
			padding-left: 40rpx;

			image {
				width: 24rpx;
				height: 24rpx;
				margin-right: 24rpx;
			}

			.text {
				width: 84%;
				background-color: #eeeff0;
				font-size: 24rpx;
				font-family: PingFang SC-Medium;
				color: #B8B9BD;
			}
		}
	}

	@import url("../css/icon.css");
</style>
