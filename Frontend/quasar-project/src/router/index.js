import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

export default route(function (/* { stores, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // ✅ GLOBALNI ROUTE GUARD ZA AUTORIZACIJU
  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("uloga");

    if (to.meta.requiresAuth) {
      if (!token) {
        next("/login");
      } else if (to.meta.role && to.meta.role !== userRole) {
        next("/login"); // ili '/unauthorized'
      } else {
        next();
      }
    } else {
      next();
    }
  });

  return Router;
});
