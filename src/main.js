import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
Vue.use(Element)
Vue.prototype.$message = Element.Message
Vue.prototype.$confirm = Element.MessageBox.confirm
Vue.config.productionTip = false

import { getUserInfo } from './api'
// 不需要登陆的页面 => 白名单
const whiteList = ['/login']
router.beforeEach(function (to, from, next) {
  getUserInfo().then(res => {
    // 没登录
    if (res.status !== 0) {
      // 白名单
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        Element.Message.error(res.msg)
        next('/login')
      }
    } else {
      //  跳转到
      if (to.path === '/login') {
        next({path: '/'})
      }
      next()
    }
  })
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
