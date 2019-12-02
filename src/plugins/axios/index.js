import axios from 'axios'
import {getGitConfig} from '@/plugins/action/modules/utility'

/**
 * 自定义请求拦截逻辑，可以处理权限，请求发送监控等
 * @param requestObj
 * @returns {*}
 */
function requestSuccessFunc(requestObj) {
  return requestObj
}

/**
 * 自定义发送请求失败逻辑，断网，请求发送监控等
 * @param requestError
 * @returns {Promise<never>}
 */
function requestFailFunc(requestError) {
  return Promise.reject(requestError)
}

/**
 * 响应成功
 * @param responseObj
 * @returns {*}
 */
function responseSuccessFunc(responseObj) {
  return responseObj
}

/**
 * 响应失败，可根据 responseError.message 和 responseError.response.status 来做监控处理
 * @param responseError
 * @returns {Promise<never>}
 */
export function responseFailFunc(responseError) {
  const responseObj = responseError.response.data

  return Promise.reject({message: responseObj['error'] || responseObj['message'] || responseError['message']})
}


let axiosInstance = axios.create({
  headers: {
    'PRIVATE-TOKEN': getGitConfig().privateToken
  }
})

axiosInstance.interceptors.request.use(requestSuccessFunc, requestFailFunc)
axiosInstance.interceptors.response.use(responseSuccessFunc, responseFailFunc)
export default axiosInstance
