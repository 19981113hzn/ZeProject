import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

// 引入相关路由
import Home from '../components/home.vue'
import Entry from '../components/entry.vue'
import Article from '../components/article.vue'
import BusinessGuide from '../components/businessGuide.vue'
import BusinessList from '../components/businessList.vue'
import CallGovernment from '../components/callGovernment.vue'
import Information from '../components/information.vue'
import LookAnswer from '../components/lookAnswer.vue'

const router = new VueRouter({
    // 基础路由
    routes: [
        { path: '/', redirect: '/entry', meta: { title: '入口' } },
        { path: '/entry', component: Entry, name: 'entry', meta: { title: '入口' } },
        { path: '/home', component: Home, name: 'home', meta:{ title: '首页' } },
        { path: '/article', component: Article, name: 'article', meta:{ title: '详情' } },
        { path: '/businessGuide', component: BusinessGuide, name: 'businessGuide', meta: { title: '业务指南' } },
        { path: '/businessList', component: BusinessList, name: 'businessList', meta: { title: '业务列表' } },
        { path: '/callGovernment', component: CallGovernment, name: 'callGovernment', meta:{ title: '资讯列表' } },
        { path: '/information', component: Information, name: 'information', meta:{ title: '首页' } },
        { path: '/lookAnswer', component: LookAnswer, name: 'lookAnswer', meta:{ title: '看回应' } },
    ]

})  

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
})


export default router