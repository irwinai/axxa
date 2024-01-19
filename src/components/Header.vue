<script lang="ts" setup>
import { accountsChangeListener, connectWallet, disconnectWallet } from '@/service/wallet';
import { useAccountStore } from "@/stores/store";
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const store = useAccountStore();
const route = useRoute();
const router = useRouter();
const activeMenu: any = ref('-1');
const routes = router.getRoutes();

const getActiveMenu = () => {
  const path = route.path;
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].path === path) {
      activeMenu.value = routes[i].meta.activeMenu;
      break;
    }
  }
}
getActiveMenu();

onMounted(() => {
  accountsChangeListener();
})

watch(() => route.path, (newPath) => {
  getActiveMenu();
})
</script>
<template>
  <el-menu :default-active="activeMenu" class="my-el-menu" mode="horizontal" :ellipsis="false">
    <div class="logo">
      <a href="/">
        <img src="../assets/logo.png" />
      </a>
    </div>
    <el-menu-item index="0">
      <RouterLink class="menu-item" to="/">铭文导航</RouterLink>
    </el-menu-item>
    <el-menu-item index="1">
      <RouterLink class="menu-item" to="/tools">工具导航</RouterLink>
    </el-menu-item>
    <el-menu-item index="5">
      <RouterLink class="menu-item" to="/airdrop">空投导航</RouterLink>
    </el-menu-item>
    <el-menu-item index="2">
      <RouterLink class="menu-item" to="/mint">铭文铭刻</RouterLink>
    </el-menu-item>
    <el-sub-menu index="3">
      <template #title>EVM Plus</template>
      <el-menu-item index="3-1">
        <RouterLink class="menu-item" to="/evmInk">余额查询</RouterLink>
      </el-menu-item>
      <el-menu-item index="3-2">
        <RouterLink class="menu-item" to="/evmInk/list">铭文精准查询</RouterLink>
      </el-menu-item>
      <el-menu-item index="3-3">
        <RouterLink class="menu-item" to="/evmInk/transfer">批量转账</RouterLink>
      </el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="4">
      <template #title>工具合集</template>
      <el-menu-item index="4-1">
        <RouterLink class="menu-item" to="/batch/create/wallet">批量生成钱包</RouterLink>
      </el-menu-item>
      <el-menu-item index="4-3">
        <RouterLink class="menu-item" to="/gm/turnup">turnup全自动</RouterLink>
      </el-menu-item>
    </el-sub-menu>

    <el-menu-item index="99">
      <RouterLink class="menu-item" to="/author">关于作者</RouterLink>
    </el-menu-item>
    <div class="flex-grow" />
    <div class="connect-wallet" v-if="!store.account">
      <el-button type="success" @click="connectWallet()">
        连接钱包
      </el-button>
    </div>
    <el-sub-menu index="exit" v-else>
      <template #title>{{ store.sliceAccount }}</template>
      <el-menu-item index="exit-0">
        <span @click="disconnectWallet()" class="menu-item">退出登录</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>


<style>
.my-el-menu .el-menu-item {
  padding: 0;
}

.my-el-menu .el-menu-item a {
  padding: 0 20px;
}

.menu-item {
  width: 100%;
  display: block;
}

.my-el-menu .el-menu--popup {
  min-width: 150px;
}

.connect-wallet {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0;
}

.flex-grow {
  flex-grow: 1;
}

.logo {
  height: 60px;
  line-height: 60px;
  display: inline-flex;
  margin-right: 40px;
}

.logo a {
  display: inline-flex;
  padding: 7px;
}

.logo a img {
  width: 100%;
  height: auto;
}

.menu-item {
  text-decoration: none;
}

a {
  color: var(--el-menu-text-color)
}
</style>


