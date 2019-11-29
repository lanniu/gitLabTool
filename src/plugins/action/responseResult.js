import {Message} from 'element-ui'

class ResponseResult {
  constructor(success = false, errorMessage = '', data = {}) {
    this.code = success ? 1 : 0
    if (success) {
      this.data = data
    } else {
      this.errorMessage = errorMessage
    }
  }

  setSuccess(data) {
    this.code = 1
    this.data = data
  }

  setFail(errorMessage) {
    this.code = 0
    this.errorMessage = errorMessage
  }

  isFail() {
    return Object.is(0, this.code)
  }

  showErrorNotification() {
    if (Object.is(0, this.code) && !Object.is('', this.errorMessage)) {
      Message.error(this.errorMessage)
    }
  }
}

export {ResponseResult}
