<template>
  <el-menu :default-active="activeIndex" background-color="#545c64" :router="true" text-color="#fff" active-text-color="#ffd04b">
    <el-menu-item v-for="item in menuItems" :index="item['index']" :key="item['index']">
      <i :class="item['icon']"></i>
      <span slot="title">{{item['title']}}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'windowMenu',
  computed: {
    activeIndex() {
      return this.$route.matched.slice(-1)[0]['path']
    }
  },
  data() {
    return {
      menuItems: [
        {title: '版本管理', index: '/release', icon: 'el-icon-s-order'}
      ]
    }
  }
}
</script>

<style scoped>

</style>
