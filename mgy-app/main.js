import App from './App'

// #ifndef VUE3
import Vue from 'vue'
// 引入全局uView
import uView from '@/uni_modules/uview-ui'
import minCache from "@/util/minCache.js"

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)
Vue.use(minCache)
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
