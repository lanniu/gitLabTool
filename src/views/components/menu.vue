<template>
  <el-menu :default-active="defaultActive" background-color="#545c64" :router="true" text-color="#fff" active-text-color="#ffd04b">
    <el-menu-item v-for="item in menuItems" :index="item['index']" :key="item['index']">
      <i :class="item['icon']"></i>
      <span slot="title">{{item['title']}}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'windowMenu',
  data() {
    return {
      defaultActive: '',
      menuItems: [
        {title: '版本管理', index: 'release', icon: 'el-icon-s-order'}
      ]
    }
  },
  created() {
    this.defaultActive = this.menuItems[0]['index']
  }
}
</script>

<style scoped>

</style>
