import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Dashboard from "./views/Dashboard.vue";

const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: { requiresGuest: true },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: "/customers",
      name: "Customers",
      component: () => import("./views/Customers.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/packages",
      name: "Packages",
      component: () => import("./views/Packages.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/billing",
      name: "Billing",
      component: () => import("./views/Billing.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/reports",
      name: "Reports",
      component: () => import("./views/Reports.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "Settings",
      component: () => import("./views/Settings.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.meta.requiresGuest && token) {
    next("/dashboard");
  } else {
    next();
  }
});

createApp(App).use(pinia).use(router).mount("#app");
