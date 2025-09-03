import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { apolloPlugin } from "./plugins/apollo";
import router from "./router.-config";

createApp(App).use(apolloPlugin).use(router).mount("#app");
