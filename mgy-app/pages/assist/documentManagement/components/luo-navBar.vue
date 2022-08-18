<template>
	<view class="box" :style="{'position':fixed?'fixed':'','background':boxBackColor,'border-bottom':setLinDown}">
		<view class="left" @click="leftClick">
			<uni-icons :color="color" :type="leftIcon" :size="leftIconSize" v-if="leftIcon.length" />
			<text class="l-font" :style="{'color':color}" v-if="leftText.length">{{leftText}}</text>
			<slot name="left"></slot>
		</view>
		<view class="mid">		
			<text class="title" :style="{'color':color,'font-weight':isBlod?'bold':''}" v-if="midText.length && !isSearch">{{midText}}</text>
			<view class="search-box" v-if="isSearch">
				<uni-icons type="search" color="#666666"></uni-icons>
				<input type="text" v-model="searchText" @confirm="confirmEvent" @focus="focusEvent" @blur="blurEvent" @input="inputEvent" placeholder="请输入搜索关键字" />
			</view>
			<slot name="mid"></slot>
		</view>
		<view class="right" @click="rightClick">
			<text class="l-font" :style="{'color':color}" v-if="rightText.length">{{rightText}}</text>
			<uni-icons :color="color" :type="rightIcon" :size="rightIconSize" v-if="rightIcon.length" />
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
	import uniIcons from "./uni-icons/uni-icons.vue";
	export default {
		components: {
			uniIcons
		},
		data() {
			return {
				searchText:''
			};
		},
		props:{
			// 盒子背景颜色
			boxBackColor:{
				type: String,
				default() {
					return "#ffffff"
				}
			},
			// 颜色
			color: {
				type: String,
				default: "#333333"
			},
			// 是否固定
			fixed:{
				type:Boolean,
				default() {
					return false
				}
			},
			// 标题是否加粗
			isBlod:{
				type:Boolean,
				default: true
			},
			// 设置下划线
			setLinDown:{
				type:String,
				default() {
					return ''
				}
			},
			// 左边图标
			leftIcon: {
				type: String,
				default: "back"
			},
			// 左边图标大小
			leftIconSize: {
				type: Number,
				default() {
					return 24
				}
			},
			// 左边文字
			leftText:{
				type: String,
				default(){
					return ''
				}
			},
			
			// 右边图标
			rightIcon:{
				type: String,
				default: ""
			},
			// 右边图标大小
			rightIconSize: {
				type: Number,
				default() {
					return 24
				}
			},
			// 左边文字
			rightText:{
				type: String,
				default(){
					return '分享'
				}
			},
			
			
			// 标题
			midText:{
				type:String,
				default(){
					return '标题'
				}
			},
			// 是否显示搜索
			isSearch:{
				type:Boolean,
				default() {
					return false
				}
			},
		},
		methods:{
			leftClick(){
				this.$emit('leftClick')
			},
			rightClick(){
				this.$emit('rightClick')
			},
			focusEvent(e){
				this.$emit('focus',e,this.searchText)
			},
			confirmEvent(e){
				this.$emit('confirm',e,this.searchText)
			},
			blurEvent(e){
				this.$emit('blur',e,this.searchText)
			},
			inputEvent(e){
				this.$emit('input',e,this.searchText)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		left: 0;
		top: 0;
		padding: 0 24rpx;
		width: calc(100% - 48rpx);
		height: 88rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		.left,.right{
			display: flex;
			flex-direction: row;
			align-items: center;
			//flex: 0.5;
			.l-img,.r-img{
				width: 32rpx;
				height: 32rpx;
			}
			.l-font{
				font-size: 28rpx;
				color: #666;
			}
		}
		.left{
			width: 36px;
		}
		.right{
			justify-content: flex-end;
			width: 50px;
			// text-align: right;
		}
		.mid{
			// flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			// .title{
			// 	font-size: 32rpx;
			// 	color: #333333;
			// }
			// .search-box{
			// 	padding: 0 30rpx;
			// 	width: 460rpx;
			// 	height: 60rpx;
			// 	display: flex;
			// 	flex-direction: row;
			// 	align-items: center;
			// 	border-radius: 40rpx;
			// 	background: #f5f5f5;
			// 	input{
			// 		flex: 1;
			// 		padding-left: 5rpx;
			// 		font-size: 24rpx;
			// 	}
			// }
		}
	}
</style>
