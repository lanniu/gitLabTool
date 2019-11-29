const GIT_CONFIG = {
  gitLabUrl: 'http://192.168.10.22',
  privateToken: 'UotXbo2Z58wssaGSE3cZ'
}

Reflect.defineProperty(GIT_CONFIG, 'baseUrl', {
  get() {
    return `${GIT_CONFIG.gitLabUrl}/api/v4`
  }
})

export {GIT_CONFIG}
