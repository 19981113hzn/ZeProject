<template>
  <div id="app">
    <!-- 入口 -->
    <router-view></router-view>
    <!-- <Entry></Entry> -->
  </div>
</template>

<script>
import Entry from './components/entry.vue'

export default {
  name: 'App',
  components: {
    Entry,
  }
}
</script>

<style>
.price del{color:#666;margin-right: 5px;}
.price del::before{
    content:'￥'
}
.price span{color:#f00}
.price span::before{
    content:'￥'
}
</style>
