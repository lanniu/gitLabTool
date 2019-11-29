<template>
  <div class="appContainer" v-loading="windowLoading" :element-loading-text="windowLoadingText">
    <div class="menuContainer">
      <window-menu></window-menu>
      <setting-view ref="setting"></setting-view>
    </div>
    <div class="viewContainer">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import WindowMenu from '@/views/components/menu'
import SettingView from '@/views/components/settingView'

export default {
  name: 'index',
  components: {SettingView, WindowMenu},
  computed: {
    windowLoadingText() {
      return this.$store.getters.windowLoadingText
    },
    windowLoading() {
      return this.$store.getters.windowLoading
    },
    selectedProject() {
      return this.$store.getters.selectedProject
    }
  },
  watch: {
    selectedProject() {
      return document.title = `GitLab Tool [${this.selectedProject['name_with_namespace']}]`
    }
  },
  async mounted() {
    const result = await this.$action['listProject']()

    if (result.isFail()) {
      result.showErrorNotification()
      return
    }
    this.$store.commit('setProjects', result['data'])

    const defaultProjectId = localStorage.getItem('defaultProjectId')

    if (this.R.isNil(defaultProjectId)) {
      this.$refs.setting.showSettingView('请选择默认的工程')
    } else {
      this.$store.commit('setSelectedProject', defaultProjectId)
    }
  }
}
</script>

<style lang="scss">
.appContainer {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  border-top: 1px solid #e5e5e5;

  .el-loading-mask {
    z-index: 10000;
  }

  .menuContainer {
    min-width: 200px;
    max-width: 200px;
    background-color: #545c64;
    overflow: auto;

    .settingViewContainer {
      height: 50px;
      border-top: 1px solid #8b949e;
      border-right: solid 1px #e6e6e6;
      background-color: transparent;
    }

    .el-menu {
      height: calc(100% - 50px);
    }
  }

  .viewContainer {
    flex: 1;
  }
}
</style>
