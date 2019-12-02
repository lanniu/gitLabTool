<template>
  <el-dialog title="初始化" width="60%"
             class="initDialog"
             :close-on-click-modal="false"
             :show-close="false"
             :close-on-press-escape="false"
             :visible.sync="dialogVisible">

    <el-steps :active="active" :simple="true" finish-status="success">
      <el-step title="配置GitLab">
      </el-step>
      <el-step title="设置Token"></el-step>
      <el-step title="选择默认工程"></el-step>
    </el-steps>

    <template v-if="active !== 3">
      <div class="initDialogFormContainer">
        <el-form v-model="dataForm" label-width="120px">
          <template v-if="active === 0">
            <el-form-item label="GitLab地址" prop="gitLabAddr">
              <el-input v-model="dataForm.gitLabAddr" placeholder="请输入GitLab地址"></el-input>
            </el-form-item>
            <el-form-item label="API地址" prop="gitLabAddr">
              <el-input v-model="dataForm.apiAddr" placeholder="请输入API地址"></el-input>
            </el-form-item>
          </template>
          <template v-if="active === 1">
            <el-form-item label="privateToken" prop="gitLabAddr">
              <el-input type="password" v-model="dataForm.privateToken" placeholder="请输入privateToken"></el-input>
            </el-form-item>
          </template>
          <template v-if="active === 2">
            <el-form-item label="默认工程">
              <el-select v-model="dataForm.defaultProjectId" filterable value-key="id" placeholder="请选择工程">
                <el-option
                    v-for="item in projects"
                    :key="item['id']"
                    :label="item['name_with_namespace']"
                    :value="item['id']">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </template>
    <template v-else>
      完成
    </template>

    <span slot="footer" class="dialog-footer">
      <el-button v-if="active !== 3" size="small" @click="next">下一步</el-button>
      <el-button v-else type="primary" size="small" @click="confirm">完 成</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {GIT_CONFIG} from '@/config/git'

export default {
  name: 'initDialog',
  data() {
    return {
      active: 0,
      dialogVisible: false,
      projects: [],
      dataForm: {
        gitLabAddr: GIT_CONFIG.gitLabAddr,
        apiAddr: GIT_CONFIG.apiAddr,
        privateToken: 'UotXbo2Z58wssaGSE3cZ',
        defaultProjectId: ''
      }
    }
  },
  methods: {
    async next() {
      if (Object.is(1, this.active)) {
        const result = await this.$action['listProject'](`${this.dataForm.gitLabAddr}/${this.dataForm.apiAddr}/projects`.replace(/(?<!:)(\/){2,3}/g, '/'), this.dataForm.privateToken)

        if (result.isFail()) {
          result.showErrorNotification()
          return
        }
        this.projects = result['data']
        this.$store.commit('setProjects', this.projects)
      }
      this.active += 1
    },
    openDialog() {
      this.dialogVisible = true
    },
    confirm() {
      this.$action['saveGitConfig'](this.dataForm)
      this.$action['initFinish']()
      this.$action['selectProject'](this.dataForm['defaultProjectId'])
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.initDialog {
  .el-dialog {
    min-width: 650px;

    .initDialogFormContainer {
      margin-top: 25px;
      padding: 10px 20px 10px 0;


      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
