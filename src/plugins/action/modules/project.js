import axios from '@/plugins/axios/index'
import store from '@/store/index'
import {GIT_CONFIG} from '@/config/git'
import {ResponseResult} from '@/plugins/action/responseResult'

export const listProject = async function () {
  const result = new ResponseResult()

  store.commit('openWindowLoading')
  try {
    const {data} = await axios.get(`${GIT_CONFIG.baseUrl}/projects`)

    result.setSuccess(data)
  } catch (e) {
    result.setFail(e.message)
  } finally {
    store.commit('closeWindowLoading')
  }
  return result
}

export const selectProject = async function (project) {
  store.commit('setSelectedProject', project)
}
