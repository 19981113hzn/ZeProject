<template>
	<view>
		<u-tabs :list="lstTitle" @click="clickTitle" lineColor="transparent" :scrollable="false"
		:activeStyle="{
		    color: '#303133',
		}"
		:inactiveStyle="{
		    color: '#606266',
		}"></u-tabs>
		<view class="popup-content">
			<view v-for="(item, index) in lstMune":key="index">
				<text class="popup__title">{{item.title}}</text>
				<u-radio-group 
					v-model="value"
					placement="column"
					:borderBottom="true"
					iconPlacement="right">
					<u-radio 
					activeColor="red" 
					:customStyle="{marginBottom: '16px',padding: '0 0 0 16px'}"
					v-for="(item, index1) in item.lst"
					:key="index1"
					:label="item.name"
					:name="item.index"></u-radio>
				</u-radio-group>
			</view>
			<view>
				<u-button text="重置" ></u-button>
				<u-button type="primary" text="确定"></u-button>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {	
		props: {
			lstfilter: {
				type: Array,
				default () {
					return []
				}
			},
		},
		data() {
			return {
				lstTitle:[],
				lstMune:[],
				current:""
			};
		},
		created: function() {
			let titleArr = [];
			for (let i=0;i<this.lstfilter.length;i++) {
				titleArr.push({
					name:this.lstfilter[i].title,					
				})
			}
			this.lstTitle=titleArr
		},
		onLoad(){
			console.log(this.lstfilter)
		},
		methods:{
			clickTitle(item){
				this.current=item.index
				this.lstMune=this.lstfilter[item.index].lst
			}
		}
	}
</script>

<style >
.popup-content{
	margin-top: 35px;
	padding: 0 20px;
	.popup__title{
		display: block;
		font-size: 16px;
		color: rgb(96, 98, 102);
		margin-bottom: 20rpx;
		font-weight: bold;
	}
}
</style>