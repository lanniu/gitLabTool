import * as R from 'ramda'
import {ResponseResult} from '@/plugins/action/responseResult'

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
