import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EvmInkView from '@/views/EvmInk.vue'
import EvmInkListView from '@/views/EvmInkList.vue'
import EvmInkTransferView from '@/views/EvmInkTransfer.vue'
import ToolsView from '@/views/Tools.vue'
import AuthorView from '@/views/Author.vue'
import BatchCreateWalletView from '@/views/BatchCreateWallet.vue'
import GameTurnup from '@/views/Turnup.vue'
import AirDropView from '@/views/AirDrop.vue'
import Ed25519Tool from '@/views/Ed25519Tool.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        activeMenu: '0'
      }
    },
    {
      path: '/tools',
      name: 'tools',
      component: ToolsView,
      meta: {
        activeMenu: '1'
      }
    },
    {
      path: '/mint',
      name: 'mint',
      component: () => import('../views/Mint.vue'),
      meta: {
        activeMenu: '2'
      }
    },
    {
      path: '/author',
      name: 'author',
      component: AuthorView,
      meta: {
        activeMenu: '99'
      }
    },
    {
      path: '/evmInk',
      name: 'evmInk',
      component: EvmInkView,
      meta: {
        activeMenu: '3-1'
      }
    },
    {
      path: '/evmInk/transfer',
      name: 'evmInkTransfer',
      component: EvmInkTransferView,
      meta: {
        activeMenu: '3-3'
      }
    },
    {
      path: '/evmInk/list',
      name: 'evmInkList',
      component: EvmInkListView,
      meta: {
        activeMenu: '3-2'
      }
    },
    {
      path: '/batch/create/wallet',
      name: 'batchCreateWallet',
      component: BatchCreateWalletView,
      meta: {
        activeMenu: '4-1'
      }
    },
    {
      path: '/gm/turnup',
      name: 'turnup',
      component: GameTurnup,
      meta: {
        activeMenu: '4-3'
      }
    },
    {
      path: '/tools/ed25519',
      name: 'ed25519',
      component: Ed25519Tool,
      meta: {
        activeMenu: '4-4'
      }
    },
    {
      path: '/airdrop',
      name: 'AirDrop',
      component: AirDropView,
      meta: {
        activeMenu: '5'
      }
    },
  ]
})

export default router
