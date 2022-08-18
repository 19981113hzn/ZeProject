<script>
	export default {
		onLaunch: function() {
			const that = this;
			uni.getSystemInfo({
				success(res) {
					that.globalData.statusBarHeight = res.statusBarHeight;
				}
			})
		},
		globalData: {
			statusBarHeight: '', //手机顶部状态栏高度
			userInfo: {}, //用户信息
			isApp: true, //判断是否是app
			isHaveNetworkShow: false, //判断关于网络断连的弹窗是否启动了
			isRequestFail: false, //判断连接不上服务的弹窗是否启动了
			lstExpense_type: [], //费用类型
		},
		onShow: function() {
			console.log('App Show')
			this.isHaveNetwork();
		},
		// onHide: function() {
		// 	console.log('App Hide')
		// }
		methods: {
			isHaveNetwork() {
				uni.getNetworkType({
					success: (res) => {
						if (res.networkType == 'none') {
							if (!this.globalData.isHaveNetworkShow) {
								this.globalData.isHaveNetworkShow = true;
								uni.showModal({
									title: '没有网络',
									content: '是否重新连接',
									success: (res) => {
										this.globalData.isHaveNetworkShow = false;
										if (res.confirm) {
											this.isHaveNetwork() //
										} else if (res.cancel) {

										}
									}
								});
							}
						} else {
							//this.getData('')  //有网
							this.globalData.isHaveNetworkShow = false;
							console.log("有网络")
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	@import url("/static/font/iconfont.css");
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
</style>
