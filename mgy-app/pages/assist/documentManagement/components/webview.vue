<template>
	<view class="webview">
		<web-view :src="link" style="height:550px;" webview-styles="webviewStyles"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					 progress: '#0072FF'
				}
			}
		},
		props:{
			link:""
		},
		onLoad(){
			// var pages = getCurrentPages();
			// 	var page = pages[pages.length - 1];
			// 	var currentWebview=page.$getAppWebview();
			// 	setTimeout(function(){
			// 		var web_view= currentWebview.children();
			// 		var w=plus.nativeUI.showWaiting();
			// 		web_view[0].addEventListener("loading",function(){
			// 			w.show();
			// 		},false);
					
			// 		web_view[0].addEventListener("loaded",function(){
			// 			w.close();
			// 			w=null;
			// 		},false);
			// 	},600)

		},
		methods: {
			handleProgress(){
				
			}
		}
	}
</script>

<style lang="scss">
.webview{
		height: 550px;
		width: 100%;
		margin-top: 44px;
	}
</style>
