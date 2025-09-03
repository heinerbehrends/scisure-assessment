import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { apolloPlugin } from "./plugins/apollo";

createApp(App).use(apolloPlugin).mount("#app");
