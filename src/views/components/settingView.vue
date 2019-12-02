<template>
  <div class="settingViewContainer">
    <el-button @click="showSettingView()" plain>
      <i class="settingIcon el-icon-s-tools"></i>
    </el-button>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%">

      <el-form :model="dataForm" label-width="80px">
        <el-form-item label="工程">
          <el-select v-model="dataForm.selectedProject" filterable value-key="id" placeholder="请选择工程">
            <el-option
                v-for="item in projects"
                :key="item['id']"
                :label="item['name_with_namespace']"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'settingView',
  computed: {
    projects() {
      return this.$store.getters.projects
    }
  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this.initDataForm()
      }
    }
  },
  data() {
    return {
      title: '',
      callback: null,
      dialogVisible: false,
      dataForm: {
        selectedProject: {}
      }
    }
  },
  methods: {
    showSettingView(title, callback) {
      this.title = title || '设置'
      this.callback = callback
      this.dialogVisible = true
    },
    initDataForm() {
      this.dataForm['selectedProject'] = this.$store.getters.selectedProject
    },
    confirm() {
      if (this.callback instanceof Function) {
        this.callback(this.dataForm)
      } else {
        this.$action['selectProject'](this.dataForm['selectedProject'])
        this.$action['setGitConfig']('defaultProjectId',  this.dataForm['selectedProject']['id'])
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.settingViewContainer {
  height: 100%;
  width: 100%;
  background: transparent;

  > .el-button {
    height: 100%;
    width: 100%;
    border: 0;
    border-radius: 0;
    font-size: 1.5em;
    background: transparent !important;

    .settingIcon {
      color: white;
      transition: all .5s;
    }

    &:active {
      background: #8b949e !important;
    }

    &:hover {
      .settingIcon {
        transform: rotate(360deg);
      }
    }
  }

  .el-form {
    .el-select {
      width: 100%;
    }
  }

}
</style>
