import axios from '@/plugins/axios/index'
import store from '@/store/index'
import {getGitConfig} from '@/plugins/action/modules/utility'
import {ResponseResult} from '@/plugins/action/responseResult'

export const uploadFile = async function (projectId, file) {
  const result = new ResponseResult()
  const formData = new FormData()

  store.commit('openWindowLoading')
  formData.append('file', file)
  try {
    const {data} = await axios.post(`${getGitConfig().baseUrl}/projects/${projectId}/uploads`, formData, {
      onUploadProgress: progressEvent => {
        let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'

        store.commit('setWindowLoadingText', `上传${complete}`)
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
