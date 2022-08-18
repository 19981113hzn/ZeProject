<!--
 * @Author: wush wush@example.com
 * @Date: 2022-07-11 19:26:31
 * @LastEditors: wush wush@example.com
 * @LastEditTime: 2022-07-15 19:50:25
 * @FilePath: \mgy-app\pages\product\productCategory.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<view>
		<xiaolu-tree :checkList="checkList" @sendValue="confirm" :props="prop" :isCheck="true" :treeNone="tree">
		</xiaolu-tree>
	</view>
</template>
<script>
	import XiaoluTree from '@/components/xiaolu-tree/tree.vue';
	import {
		getCategoryList,
	} from '@/util/interface.js'
	export default {
		components: {
			XiaoluTree
		},
		data() {
			return {
				id: '',
				tree: [],
				checkList: [],
				cateListItem: [], //分类列表分页
				backList: this.checkList,
				prop: {},
				max: 5,
				status: "loadmore",
				loadingText: '正在加载',
				loadmoreText: '轻轻上拉',
				nomoreText: '没有更多了',
				pageNo: 1,
				maxPage: 1,
				isLoading: false, //加载中

			}
		},
		onShow() {

		},
		onLoad(option) {
			let {
				prop,
				arr
			} = option
			let checkList = JSON.parse(decodeURIComponent(arr));
			// this.getCategory()
			this.prop = JSON.parse(prop)
			let cateList = uni.getStorageSync("_cateList")
			this.checkList = checkList;
			this.tree = cateList; //树形数据赋值
			console.log(this.tree)
		},
		onUnload() {
			// uni.removeStorageSync("_cateList")

		},
		methods: {

			// 分类树形列表
			// getCategory() {
			// 	let data = ""
			// 	getCategoryList(data, res => {
			// 		if (res.code == 200 && res.success) {
			// 			this.cateListItem = res.result
			// 			// uni.setStorageSync('_cateList', this.cateListItem)
			// 			console.log(this.cateListItem)
			// 		}
			// 	})
			// },

			//获取选中的值
			confirm(val, back) {
				if (back) {
					this.backConfirm(val)
					return
				}
				this.backList = val;
			},

			// 返回上一页传参
			backConfirm(val) {
				uni.$emit('selectSuccess', {
					list: val,
					id: val[0].id
				})
				console.log(val)
				uni.navigateBack()
				// uni.navigateTo({
				// 		url: `./index?user=${val[0].id}&isSelect=${val[0].bx}`,
				// 		success(res) {
				// 			console.log('成功啦', res);
				// 		},
				// 		fail(err) {
				// 			console.log('失败啦', err);
				// 		}
				// 	});
				// uni.setStorageSync("_cateId", val[0].id)
				// uni.navigateBack();
				// if (val[0].id) {

				// }

			}
		}
	}
</script>

<style>

</style>
