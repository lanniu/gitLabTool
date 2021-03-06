<template>
  <div class="releaseManagerContainer" tabindex="1" @keydown.ctrl.shift.exact.78="openDrawer">
    <div class="releaseListContainer">
      <template v-if="releases.length <= 0">
        <span class="releaseEmptyInfo">暂无版本信息</span>
      </template>
      <ul v-else>
        <template v-for="(release, index) in releases">
          <li class="releaseItem" :key="index">
            <div class="releaseItemTitle">
              {{release['name']}} - {{release['tag_name']}}
              <el-button slot="reference" type="danger" class="releaseDeleteIcon" @click="deleteRelease(projectId,release['tag_name'])">
                <i class="el-icon-close"></i>
              </el-button>
            </div>
            <div class="releaseItemDesc" ref="desc">
            </div>
          </li>
        </template>
      </ul>
    </div>
    <el-drawer title="发布新版本" :visible.sync="drawer" :wrapperClosable="false" direction="rtl" size="50%">
      <el-form :model="dataForm" ref="form" :rules="rules" label-width="80px">
        <el-form-item label="版本名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入版本名称"></el-input>
        </el-form-item>
        <el-form-item label="标签名称" prop="tag_name">
          <el-input v-model="dataForm.tag_name" placeholder="请输入标签名称"></el-input>
        </el-form-item>
        <el-form-item label="分支名称" prop="ref">
          <el-input v-model="dataForm.ref" placeholder="请输入分支名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="dataForm.description" type="textarea" placeholder="请输入此版本的描述信息" :autosize="{ minRows: 8 }"></el-input>
        </el-form-item>
        <el-form-item label="产物名称" prop="fileName">
          <el-input v-model="dataForm.fileName" placeholder="请输入产物名称"></el-input>
        </el-form-item>
        <el-form-item label="产物地址" prop="file">
          <input type="file" ref="fileInput" @change="fileChangeHandler"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm">发布新版本</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {getGitConfig} from '@/plugins/action/modules/utility'
import MarkdownIt from 'markdown-it'

export default {
  name: 'releaseManager',
  computed: {
    selectedProject() {
      return this.$store.getters.selectedProject
    },
    projectId() {
      return this.selectedProject['id']
    }
  },
  watch: {
    projectId() {
      this.listReleases(this.projectId)
    }
  },
  data() {
    return {
      md: null,
      releases: [],
      drawer: false,
      dataForm: {
        name: '1.0.1-pre', // 版本名称
        tag_name: '1.0.1-pre', // 标签名称
        ref: 'dev', // 分支名称
        description: '', // 描述
        fileName: '', // 产物名称
        file: '' // 产物地址
      },
      rules: {
        name: [
          {required: true, message: '版本名称不能为空', trigger: 'change'}
        ],
        tag_name: [
          {required: true, message: '标签名称不能为空', trigger: 'change'}
        ],
        ref: [
          {required: true, message: '分支名称不能为空', trigger: 'change'}
        ],
        description: [
          {required: true, message: '描述不能为空', trigger: 'change'}
        ],
        fileName: [
          {required: true, message: '产物名称不能为空', trigger: 'change'}
        ],
        file: [
          {required: true, message: '产物不能为空', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    deleteRelease(projectId, tagName) {
      if (this.R.isNil(projectId)) {
        return
      }
      this.$confirm('是否确定删除该版本？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        confirmButtonClass: 'el-button--danger',
        cancelButtonText: '取消'
      })
        .then(async () => {
          const result = await this.$action['deleteRelease'](projectId, tagName)

          if (result.isFail()) {
            result.showErrorNotification()
            return
          }
          this.listReleases(this.projectId)
        })
        .catch(() => {
        })
    },
    async listReleases(projectId) {
      if (this.R.isNil(projectId)) {
        return
      }
      const result = await this.$action['listReleases'](projectId)

      if (result.isFail()) {
        result.showErrorNotification()
        return
      }
      this.releases = result['data']
      this.$nextTick(() => {
        this.$refs.desc.forEach((dom, index) => {
          dom.innerHTML = this.md.render(this.releases[index]['description'])
        })
      })
    },
    async createRelease(projectId, releaseConfig) {
      if (this.R.isNil(projectId)) {
        return false
      }
      let result = {}

      for (let file of releaseConfig['assets']['links']) {
        result = await this.$action['uploadFile'](projectId, file['url'])

        if (result.isFail()) {
          result.showErrorNotification()
          return false
        }
        file['url'] = `${getGitConfig().gitLabAddr}/${this.selectedProject['path_with_namespace']}${result['data']['url']}`
      }
      result = await this.$action['createRelease'](projectId, releaseConfig)
      if (result.isFail()) {
        result.showErrorNotification()
        return false
      }
      this.listReleases(this.projectId)
      return true
    },
    updateFileName() {
      if (this.R.isNil(this.dataForm.file)) {
        return
      }
      const {name} = this.dataForm.file

      this.dataForm.fileName = name
    },
    fileChangeHandler(e) {
      this.dataForm.file = e.target.files[0]

      this.updateFileName()
    },
    confirm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const releaseConfig = {
            name: this.dataForm['name'],
            tag_name: this.dataForm['tag_name'],
            ref: this.dataForm['ref'],
            description: this.dataForm['description'],
            assets: {
              links: [
                {
                  name: this.dataForm['fileName'],
                  url: this.dataForm['file']
                }
              ]
            }
          }

          if (await this.createRelease(this.projectId, releaseConfig)) {
            this.drawer = false
          }
        }
      })
    },
    openDrawer() {
      this.drawer = !this.drawer
      if (this.drawer) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.$refs.fileInput.value = ''
        })
      }
    }
  },
  mounted() {
    this.md = new MarkdownIt()
    this.listReleases(this.projectId)
  }
}
</script>

<style lang="scss">
.releaseManagerContainer {
  display: flex;
  width: 100%;
  height: 100%;

  .releaseListContainer {
    flex: 7;
    position: relative;
    border-right: 1px solid #e5e5e5;
    overflow: auto;

    .releaseEmptyInfo {
      white-space: nowrap;
      position: relative;
      display: block;
      font-size: 3em;
      color: #e6e6e6;
      text-align: center;
      top: 50%;
      transform: translateY(-50%);
      user-select: none;
    }

    > ul {
      padding: 20px 10px;
      margin: 0;

      .releaseItem {
        display: block;
        margin-bottom: 10px;

        .releaseItemTitle {
          font-family: "Times New Roman";
          font-size: 25px;
          font-weight: 600;
          padding: 10px 5px;
          border-radius: 5px 5px 0 0;
          border: 1px solid #e5e5e5;
          border-bottom: none;
          position: relative;

          .releaseDeleteIcon {
            position: absolute;
            border-radius: 0 5px 0 0;
            background-color: #f56c6c;
            right: 0;
            top: 0;
            height: 100%;
            padding: 12px 6px;
          }
        }

        .releaseItemDesc {
          border: 1px solid #e5e5e5;
          font-size: 14px;

          ul {
            margin: 0 0 0 20px;
            padding: 5px;

            li {
              list-style: outside;
              margin-bottom: 2px;
            }
          }
        }
      }
    }
  }

  .el-drawer__body {
    overflow: auto;
    padding: 0 15px;

    .el-form {
      .el-select {
        width: 100%;
      }

      .browseFileBtn {

      }
    }
  }
}
</style>
