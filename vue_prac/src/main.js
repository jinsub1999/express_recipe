import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import axios from "axios";
import "./assets/tailwind.css";
import { router } from "./router";

const app = createApp(App);
app.use(router);
// const vm = app.mount("#app");
// const mainPage = {};
app.config.globalProperties.$http = axios;
app.mount("#app");
