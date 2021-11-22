import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import axios from "axios";
import './assets/tailwind.css'
const app = createApp(App);
// const vm = app.mount("#app");
app.config.globalProperties.$http = axios;
app.mount("#app");
