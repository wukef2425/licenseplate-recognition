<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
      this.$router.replace({
          name: "MainPage",
      });
  }
};
</script>

<style>
/* 这里可以添加全局样式 */
</style>