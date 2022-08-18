<template>
	<view>
		<span class="view-span">{{"设置首页显示的功能菜单及排序，至少需显示一项"}}</span>
		<u-cell-group>			
			<u-cell v-for="item in lstcell"  :title="item.title" >
				<u-switch slot="right-icon" v-model="item.checked"></u-switch>
			</u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lstcell:[
					{title:"部门目标",checked:true},
					{title:"部门销售订单",checked:true},
					{title:"个人业绩展示",checked:true},
					{title:"销售业绩top10",checked:true},
					{title:"品类销售额占比",checked:true},
				]
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
.view-span{
	color: rgba(0,0,0,0.4);
	font-size: 14px;
	line-height: 54px;
	padding:0 16px;
}
</style>
