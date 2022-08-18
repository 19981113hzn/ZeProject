<template>
	<view>
		
	</view>
</template>

<script>
	import {getUserInfoByToken} from "@/util/interface.js"
	//import WS from "@/util/websocket.js"
	
	export default {
		data() {
			return {
				ws: null
			}
		},
		onLoad(){
			 let autelToken=uni.getStorageSync("_token").data;
			 console.log("token  "+autelToken)
			 if(!autelToken){//没有token
				console.log("无 "+autelToken)
				 uni.reLaunch({
				 	url:"/pages/login/login",
				 })
			 }else{//有token
				console.log("有 "+autelToken)
				this.getUserByToken();
			 }
		},
		methods: {
			getUserByToken(){
				getUserInfoByToken('',res=>{
					console.log(res)
					if(res.code==200 && res.success){
						//this.buildWebSocket();
						uni.reLaunch({
							url: "../main/main"
						})
						//this.websocet();//暂时不连接webSocket
						
					}else{
						if(res.code==401){
							uni.reLaunch({
								url:"/pages/login/login",
							})
						}
					}
					
				})
			},
			//建立socket连接
			websocet(){
				 // 在onload的时候调用，创建webscoet连接对象，参数分别为：url、获取后端返回数据、监听websocket的链接失败返回的报错、监听链接状态，返回布尔值
				 
				 let autelToken = uni.getStorageSync("_token").data;
				 let url="ws://192.168.196.37:9999/ws?token="+autelToken+"&clientType=APP"
				 
				 this.ws && this.ws.closeSocket();
				 this.ws = new WS(url)
				 // 发送数据
				 // this.ws.webSocketSendMsg('发送信息')
				 this.ws.getWebSocketMsg(data => {
					
					 const dataJson = data;
					 console.log('data', dataJson);
					 if(typeof(dataJson) == "object") {
						 console.log("wsObject", dataJson);
					 }else {
						 console.log(dataJson);
					 }
				 });
				        
			},
		}
	}
</script>

<style>

</style>