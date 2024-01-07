<script setup lang="ts">
import Header from './components/Header.vue'
</script>
<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer>

    </el-footer>
  </el-container>
</template>