import Vue from "vue";
import App from "@/App";
import router from "@/router";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import "@/style/variables.scss";
import Settings from "@/style/components";

Vue.config.productionTip = false;

// Make BootstrapVue available throughout your project with your custom settings
Vue.use(BootstrapVue, Settings);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
