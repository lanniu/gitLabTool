import Vue from 'vue'
import * as R from 'ramda'
import * as file from '@/plugins/action/modules/file'
import * as release from '@/plugins/action/modules/release'
import * as project from '@/plugins/action/modules/project'
import * as utility from '@/plugins/action/modules/utility'

let action = {}

action.registerAction = function (actionName, func) {
  if (R.equals('registerAction', actionName)) {
    throw new Error('注册的方法名不能为 registerAction')
  }
  Vue.set(action, actionName, func)
}
let autoRegister = (module) => {
  Object.keys(module).forEach((key) => {
    action.registerAction(key, module[key])
  })
}

R.forEach(autoRegister, [file, release, project, utility])
export default action
