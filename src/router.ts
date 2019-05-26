import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import List from "./views/List.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/list",
      name: "list",
      component: List
    }
  ]
});
