import 'element-ui/lib/theme-chalk/index.css'
import '@/style/index.scss'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import plugin from '@/plugins/index'
import * as R from 'ramda'

Vue.config.productionTip = false
Vue.prototype.R = R
Vue.use(ElementUI)
Vue.use(plugin)
window.R = R

new Vue({
  router,
  store,
  plugin,
  render: h => h(App)
}).$mount('#app')
