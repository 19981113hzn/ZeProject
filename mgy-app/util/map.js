export function toMap(area) {
	uni.request({
		url: 'https://restapi.amap.com/v3/geocode/geo?parameters',
		method: 'GET',
		data: {
			key: 'fa369f652855ef143554f2cfae6fffeb', //高德地图key
			address: area // 详细地址
		},
		success: function(res) {
			let lo = res.data.geocodes ? res.data.geocodes[0].location.split(',')[0] : ''
			let la = res.data.geocodes ? res.data.geocodes[0].location.split(',')[1] : ''
			uni.getLocation({
				type: 'gcj02',
				success: function(res) {
					const latitude = res.latitude;
					const longitude = res.longitude;
					uni.openLocation({
						latitude: parseFloat(la),
						longitude: parseFloat(lo),
						success: function() {
							console.log('成功')
						}
					})
				}
			})
		}
	})
}
