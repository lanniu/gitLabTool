import axios from '@/plugins/axios/index'
import store from '@/store/index'
import {getGitConfig} from '@/plugins/action/modules/utility'
import {ResponseResult} from '@/plugins/action/responseResult'

export const listProject = async function (url, token) {
  const result = new ResponseResult()
  const mUrl = url || `${getGitConfig().baseUrl}/projects`
  const privateToken = token || getGitConfig().privateToken

  store.commit('openWindowLoading')
  try {
    const {data} = await axios.get(mUrl, {
      headers: {
        'PRIVATE-TOKEN': privateToken
      }
    })

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
