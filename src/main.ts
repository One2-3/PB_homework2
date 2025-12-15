import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useUiStore } from "@/stores/ui";
import "@/styles/tokens.css";
import "@/styles/ui.css";

import App from "./App.vue";
import { router } from "./router";

createApp(App)
  .use(createPinia())
  .use(router)
  .use(Toast, { timeout: 1800, closeOnClick: true, pauseOnHover: true })
  .mount("#app");
