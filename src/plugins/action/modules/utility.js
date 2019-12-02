import * as R from 'ramda'
import {ResponseResult} from '@/plugins/action/responseResult'
import {GIT_CONFIG} from '@/config/git'

const {dialog} = require('electron').remote

export const openWindowDialog = async function (options) {
  const result = new ResponseResult()

  const {canceled, filePaths} = await dialog.showOpenDialog(options)

  if (canceled) {
    return result
  }
  const filePath = filePaths[0]

  if (R.isNil(filePath)) {
    return result
  }
  result.setSuccess({filePath})
  return result
}

export const getGitConfig = function (key) {
  const localGitConfigJSON = localStorage.getItem('gtiConfig')

  let localGitConfig = GIT_CONFIG

  try {
    localGitConfig = JSON.parse(localGitConfigJSON)
  } catch (e) {
    initClear()
  }
  Reflect.defineProperty(localGitConfig, 'baseUrl', {
    get() {
      return `${localGitConfig.gitLabAddr}/${localGitConfig.apiAddr}`.replace(/(?<!:)(\/){2,3}/g, '/')
    }
  })
  return key ? localGitConfig[key] : localGitConfig
}

export const setGitConfig = function (key, value) {
  const localGitConfig = getGitConfig()

  localGitConfig[key] = value
  localStorage.setItem('gtiConfig', JSON.stringify(localGitConfig))
}

export const saveGitConfig = function (config) {
  localStorage.setItem('gtiConfig', JSON.stringify(config))
}

export const initFinish = function () {
  localStorage.setItem('init', 'true')
}

export const initClear = function () {
  localStorage.removeItem('init')
}

export const initStatus = function () {
  return localStorage.getItem('init')
}
