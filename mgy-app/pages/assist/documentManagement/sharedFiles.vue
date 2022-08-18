<template>
	<view>
		<u-navbar leftIcon="" leftText="取消" class="navbar" :title="navTitle" :border="true" safeAreaInsetTop fixed
			placeholder @leftClick="leftClick"></u-navbar>
		
		<u--form labelPosition="left" labelWidth="80">
			<view class="top-height">
				<view class="card-bg">
					<u-form-item label="共享给" ></u-form-item>
					<u-radio-group
					    v-model="radiovalue"
					    placement="row"
					  >
					    <u-radio
					      :customStyle="{marginBottom: '16px'}"
					      label="所有人员"
					      name="0"
					    ></u-radio>
						<u-radio
						  :customStyle="{marginBottom: '16px',marginLeft:'24px'}"
						  label="指定人员"
						  name="1"
						>
					    </u-radio>
					</u-radio-group>
					<view v-if="radiovalue==1">
						<view  class="filter-content"
							v-for="(item,index) in lstUser" :key="index">
							<view style="padding: 0 5px;">
								<text
								class='filter-content-detail-item-default' 
								:style="{'background-color':item.isSelected?'rgba(0, 114, 255, 0.05)':'rgba(247, 249, 252, 1)',
								'color':item.isSelected?'rgba(0, 114, 255, 1)':'rgba(48, 49, 51, 1)',
								'border-color':item.isSelected?'rgb(0, 114, 255)':'none',
								'border': item.isSelected?'1px solid':'none'}"
								@click="selectItem(index)"
								>
									{{item.name}}
								</text>
							</view>
						</view>
						<view v-if="isMore" class="filter-content">
							<view style="padding: 0 5px;">
								<text
									class='filter-content-detail-item-default' 
									:style="{'background-color':isJump?'rgba(0, 114, 255, 0.05)':'rgba(247, 249, 252, 1)',
									'color':isJump?'rgba(0, 114, 255, 1)':'rgba(48, 49, 51, 1)',
									'border-color':isJump?'rgb(0, 114, 255)':'none',
									'border': isJump?'1px solid':'none'}"
									@click="seeMore(index)"
								>
									{{isJump?'已选'+lstSelectUser.length+'人>':'更多'}}
								</text>
							</view>
						</view>
					</view>
					
				</view>
			</view>
			
			<view class="top-height">
				<view class="card-bg">
					<u-form-item label="使用内部消息提醒" labelWidth="150">
						<u-switch  v-model="isMessageReminder" inactiveColor="rgba(192, 196, 204, 1)"></u-switch>
					</u-form-item>
				</view>
			</view>
			<text class="title-name">被共享的成员将收到系统消息提醒</text>
		</u--form>
		<view style="padding:16px;">
			<u-button
				color="rgba(0, 114, 255, 1)" 
				shape="circle" 
				text="确认"  
			@click="saveShareFile"></u-button>
		</view>
	</view>
</template>

<script>
	import {isEmpty} from "@/util/common.js"
	import {getUserListByUserId,shareFile} from "@/util/interface.js"
	export default {
		data() {
			return {
				navTitle: "共享文件",
				isMore:true,//更多
				isJump:false,//跳转
				lstUser:[],
				lstSelectUser:[],
				total:0,
				defaultSelectedIndex:[],//选择的id
				isMessageReminder:true,//使用内部消息提醒
				radiovalue:'0',
				idList:[],//文件id列表
				returnPageNumber:1,//返回的页数
			}
		},
		onLoad(option){
			this.idList.push(option.id || '');
			this.returnPageNumber=parseInt(option.returnPageNumber) || 1;
			this.getUserList(5,1);
		},
		onShow() {
			uni.$once('resultSelectUser', res => {
				uni.$emit('resultSelectUser', false);
				if(res){
					let lstSelectUser=uni.getStorageSync("lstSelectUser")
					let defaultSelectedIndex=[];
					let lst=[];
					if(lstSelectUser.length>4){
						for(let i=0;i<lstSelectUser.length;i++){
							if(i<5){
								lst.push(lstSelectUser[i])
							}
							if(lstSelectUser[i].isSelected){
								defaultSelectedIndex.push(lstSelectUser[i].value)
							}
						}
						this.lstUser=lst;
						this.isJump=true;
						this.defaultSelectedIndex=defaultSelectedIndex
					}else{
						for(let i=0;i<lstSelectUser.length;i++){
							lst.push(lstSelectUser[i])
							if(lstSelectUser[i].isSelected){
								defaultSelectedIndex.push(lstSelectUser[i].value)
							}
							for(let j=0;j<this.lstUser.length;j++){
								if(lstSelectUser[i].value==this.lstUser[j].value){
									this.lstUser.splice(j, 1);
								}
							}
						}
						let num=5-lstSelectUser.length;
						for(let j=0;j<num;j++){
						 	lst.push(this.lstUser[j])
						}
						this.lstUser=lst;
						this.defaultSelectedIndex=defaultSelectedIndex
					}
					this.lstSelectUser=lstSelectUser;
					console.log(this.lstSelectUser)
					console.log(this.defaultSelectedIndex)
				}
			})
		},
		methods: {
			leftClick() {
				uni.navigateBack();
			},
			getUserList(pageSize,type){
				let data="?realname="+""
				+"&pageNo="+"1"
				+"&pageSize="+pageSize
				;
				getUserListByUserId(data,res=>{
					if(res.code==200 && res.success){
						let data=[];
						for(let j=0;j<res.result.records.length;j++){
							data.push({
								name:res.result.records[j].realname,
								value:res.result.records[j].id,
								isSelected:false,
								id:res.result.records[j].id
							})
						}
						if(type==1){
							this.lstUser=data;
							this.total=res.result.total;
						}else{
							this.lstUser=this.lstUser.concat(data);
							this.isMore=false;
						}
						
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			selectItem(index){
				let value=this.lstUser[index].value;
				if(this.lstUser[index].isSelected){
					this.lstUser[index].isSelected =false;
					var num = this.defaultSelectedIndex.indexOf(value); 
					if (num > -1) { 
						this.defaultSelectedIndex.splice(num, 1); 
					} 
					for(let i=0;i<this.lstSelectUser.length;i++){
						if(this.lstSelectUser[i].value==value){
							this.lstSelectUser.splice(i, 1);
						}
					}
				}else{
					this.lstUser[index].isSelected =true;
					this.defaultSelectedIndex.push(value);
					this.lstSelectUser.push(this.lstUser[index])
					
				}
			},
			seeMore(){
				//this.getUserList(this.total);
				let lst=isEmpty(this.lstSelectUser)?this.lstUser:this.lstSelectUser
				uni.setStorageSync('lstSelectUser',lst)//1*60*60*24*7
				//uni.setStorageSync('indexSelectUser',index)//1*60*60*24*7
				uni.navigateTo({
					url:"/pages/filter-all/select-more?total="+parseInt(this.total)
				});
			},
			saveShareFile(){
				let data={
					idList: this.idList,
					sendFlag: this.isMessageReminder?1:0,
					shareType:parseInt(this.radiovalue),
				}
				if(this.radiovalue==1){
					if(this.defaultSelectedIndex.length>0){
						data.userIdList=this.defaultSelectedIndex;
					}else{
						uni.$u.toast("指定人员不能为空");
						return false;
					}					
				}
				console.log(data)
				shareFile(data,res=>{
					if(res.code==200 && res.success){
						uni.showToast({
							title: "共享成功"
						});
						uni.$emit('return', true);
						setTimeout(() => {
							uni.navigateBack({
								delta:this.returnPageNumber
							})
						}, 800)
					}else{
						uni.$u.toast(res.message);
					}
				})
			},
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color: rgba(242, 245, 249, 1);
	}
	.top-height{
		margin-top: 10px;
	}
	.card-bg{
		padding: 0 16px;
		background: #fff;
		/deep/.u-switch {
			position: absolute;
			right: 16px;
		}
	}
	
	.title-name {
		font-size: 15px;
		line-height: 48px;
		margin-left: 16px;
		color: rgba(144, 147, 153, 1);
	}
	.filter-content-detail-item-default {
		background-color: #FFFFFF;
		color: #666666;
		//padding: 5px 15px;
		border-radius: 20px;
		// margin-right: 2%;
		margin-bottom: 10px;
		display: inline-block;
		font-size: 14px;
		line-height: 35px;
		text-align: center;
		width: 100%;
	}
	.filter-content{
		width:33.33%;
		display: inline-block;
	}
</style>
