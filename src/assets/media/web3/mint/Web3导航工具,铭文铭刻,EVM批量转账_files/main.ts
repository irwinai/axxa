import __buffer_polyfill from "/node_modules/.vite/deps/vite-plugin-node-polyfills_shims_buffer.js?v=dc3593dd"
import __global_polyfill from "/node_modules/.vite/deps/vite-plugin-node-polyfills_shims_global.js?v=dc3593dd"
import __process_polyfill from "/node_modules/.vite/deps/vite-plugin-node-polyfills_shims_process.js?v=dc3593dd"

globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
globalThis.global = globalThis.global || __global_polyfill
globalThis.process = globalThis.process || __process_polyfill

import { createApp } from "/node_modules/.vite/deps/vue.js?v=dc3593dd";
import { createPinia } from "/node_modules/.vite/deps/pinia.js?v=dc3593dd";
import App from "/src/App.vue?t=1705400971592";
import router from "/src/router/index.ts?t=1705401621300";
import ElementPlus from "/node_modules/.vite/deps/element-plus.js?v=dc3593dd";
import "/node_modules/element-plus/dist/index.css";
import "/src/assets/styles/base.css";
import piniaPluginPersistedstate from "/node_modules/.vite/deps/pinia-plugin-persistedstate.js?v=dc3593dd";
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.mount("#app");

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQXBwIH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgY3JlYXRlUGluaWEgfSBmcm9tICdwaW5pYSdcblxuaW1wb3J0IEFwcCBmcm9tICcuL0FwcC52dWUnXG5pbXBvcnQgcm91dGVyIGZyb20gJy4vcm91dGVyJ1xuaW1wb3J0IEVsZW1lbnRQbHVzIGZyb20gJ2VsZW1lbnQtcGx1cydcbmltcG9ydCAnZWxlbWVudC1wbHVzL2Rpc3QvaW5kZXguY3NzJ1xuaW1wb3J0ICcuL2Fzc2V0cy9zdHlsZXMvYmFzZS5jc3MnXG5cbmltcG9ydCBwaW5pYVBsdWdpblBlcnNpc3RlZHN0YXRlIGZyb20gJ3BpbmlhLXBsdWdpbi1wZXJzaXN0ZWRzdGF0ZSdcblxuY29uc3QgYXBwID0gY3JlYXRlQXBwKEFwcClcbmNvbnN0IHBpbmlhID0gY3JlYXRlUGluaWEoKTtcbnBpbmlhLnVzZShwaW5pYVBsdWdpblBlcnNpc3RlZHN0YXRlKTtcbmFwcC51c2UocGluaWEpXG5hcHAudXNlKHJvdXRlcilcbmFwcC51c2UoRWxlbWVudFBsdXMpXG5hcHAubW91bnQoJyNhcHAnKVxuXG5cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxTQUFTLGlCQUFpQjtBQUMxQixTQUFTLG1CQUFtQjtBQUU1QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU87QUFDUCxPQUFPO0FBRVAsT0FBTywrQkFBK0I7QUFFdEMsTUFBTSxNQUFNLFVBQVUsR0FBRztBQUN6QixNQUFNLFFBQVEsWUFBWTtBQUMxQixNQUFNLElBQUkseUJBQXlCO0FBQ25DLElBQUksSUFBSSxLQUFLO0FBQ2IsSUFBSSxJQUFJLE1BQU07QUFDZCxJQUFJLElBQUksV0FBVztBQUNuQixJQUFJLE1BQU0sTUFBTTsiLCJuYW1lcyI6W119