<template>
	<view>
		<u-cell  title="新消息通知" >
			<u-switch slot="right-icon" v-model="ichecked"></u-switch>
		</u-cell>
		<span class="view-span">{{"在手机系统“设置”-“通知”中找到应用进行修改。"}}</span>
		<u-cell-group>			
			<u-cell v-for="item in lstcell"  :title="item.title" >
				<u-switch slot="right-icon" v-model="item.checked"></u-switch>
			</u-cell>
		</u-cell-group>
		<span class="view-span">{{"设置提醒消息类型"}}</span>
		<u-cell-group>			
			<u-cell v-for="item in lstNews"  :title="item.title" >
				<u-switch slot="right-icon" v-model="item.checked"></u-switch>
			</u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ichecked:true,
				lstcell:[
					{title:"声音提示",checked:true},
					{title:"振动",checked:true},
				],
				lstNews:[
					{title:"系统公告",checked:true},
					{title:"通知",checked:true},
					{title:"日程提醒",checked:true},
					{title:"到期任务",checked:true},
					{title:"待办事项",checked:true},
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
