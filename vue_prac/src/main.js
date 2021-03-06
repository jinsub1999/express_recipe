import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import "./assets/tailwind.css";
import router from "./router";

const app = createApp(App);
app.use(router);
app.config.globalProperties.$http = axios;
app.config.globalProperties.$http.defaults.withCredentials = true;
app.mount("#app");
