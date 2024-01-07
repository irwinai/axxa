import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('accounts', () => {
  // const count = ref(0)
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }
  const account = ref('')
  const sliceAccount = computed(() => account.value.slice(0, 4) + '...' + account.value.slice(-4));

  function $reset() {
    account.value = '';
  }
  return { account, sliceAccount, $reset };
}, { persist: true })
