import axios from '@/plugins/axios/index'
import store from '@/store/index'
import {GIT_CONFIG} from '@/config/git'
import {ResponseResult} from '@/plugins/action/responseResult'

export const deleteRelease = async function (projectId, tagName) {
  const result = new ResponseResult()

  store.commit('openWindowLoading')
  try {
    const {data} = await axios.delete(`${GIT_CONFIG.baseUrl}/projects/${projectId}/releases/${tagName}`)

    result.setSuccess(data)
  } catch (e) {
    result.setFail(e.message)
  } finally {
    store.commit('closeWindowLoading')
  }
  return result
}
export const listReleases = async function (projectId) {
  const result = new ResponseResult()

  store.commit('openWindowLoading')

  try {
    const {data} = await axios.get(`${GIT_CONFIG.baseUrl}/projects/${projectId}/releases`)

    result.setSuccess(data)
  } catch (e) {
    result.setFail(e.message)
  } finally {
    store.commit('closeWindowLoading')
  }
  return result
}
export const createRelease = async function (projectId, releaseConfig) {
  const result = new ResponseResult()

  store.commit('openWindowLoading')
  try {
    const {data} = await axios.post(`${GIT_CONFIG.baseUrl}/projects/${projectId}/releases`, releaseConfig, {
      header: {
        'Content-Type': 'application/json'
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
