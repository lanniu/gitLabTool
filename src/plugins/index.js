import action from '@/plugins/action/index'
import axios from '@/plugins/axios/index'

let plugin = {}

plugin.install = function (Vue) {
  Vue.prototype.$action = action
  Vue.prototype.$axios = axios
}

export default plugin
