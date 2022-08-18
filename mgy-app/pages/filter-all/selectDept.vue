<template>
	<view :style="{ 'padding-top': statusBarHeight + 'px' }">
		<u-navbar title="所属部门" bgColor="#fff" @leftClick="leftClick">
		</u-navbar>
		<u-loading-icon v-if="isLoading" text="加载中" textSize="18" :vertical="true"></u-loading-icon>
		<view class="content">
			<tki-tree ref="tkitree" :selectParent="selectParent" :multiple="multiple" confirmColor="#0072FF" :range="list" :foldAll="flod"  idKey="key" rangeKey="title" @confirm="treeConfirm"
				 @cancel="treeCancel">
			 </tki-tree>
		</view>
	</view>
</template>

<script>
	import tkiTree from '@/components/tki-tree/tki-tree.vue';
		let testList = [
			{
				key: 1,
				title: '北京市',
				children: [
					{
					key: 11,
					title: '市辖区'
				}, ]
			},
			{
				key: 2,
				title: '河北省',
				children: [
					{
						key: 21,
						title: '石家庄市',
					},
					{
						key: 22,
						title: '唐山市',
					},
					{
						key: 23,
						title: '秦皇岛市',
					},
				]
			}
		]
	export default {
		components: {
			tkiTree
		},
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight + 44, //状态栏高度
				isLoading:false,
				list: [
					{
						key: 6,
						title: '湖南省',
					},
				],
				multiple: true,
				selectParent: false,
				flod: true,//折叠
			}
		},
		onLoad() {
			setTimeout(() => {
				this.list = testList;
				this.$refs.tkitree._show();
			}, 300)
		},
		methods: {
			//返回上一级
			leftClick() {
				uni.navigateBack();
			},
			// 所属部门-确定回调事件
			treeConfirm(e) {
				console.log(e)
			},
			// 所属部门-取消回调事件
			treeCancel(e) {
				console.log(e)
			},
			// 显示树形选择器
			showTree() {
				this.$refs.tkitree._show();
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba(242, 245, 249, 1);
	}

	.logo {
		width: 24px;
		height: 24px;
	}
</style>
