// App.vue
<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useDataStore } from './stores/data'

const dataStore = useDataStore()

onMounted(() => {
  dataStore.initData()
})
</script>

<template>
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
}

body {
  font-family: 'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #f5f7fa;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>