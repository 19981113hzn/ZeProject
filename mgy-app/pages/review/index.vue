<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="webViewUrl"></web-view>
	</view>
</template>


<script>
	import {
		filePreview
	} from '@/util/request.js'
	import Base64 from '@/util/base64.js';
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				webViewUrl: ''
			}
		},
		onLoad(option) {
			this.webViewUrl = filePreview(Base64.encode(option.url), '物壹科技');
		}
	}
</script>

<style>
</style>
