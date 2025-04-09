import { createWebHistory, createRouter } from "vue-router";

import HomePage from "../views/home/HomePage.vue";
import LoginPage from "../views/login/LoginPage.vue";
import PricePage from "../views/price/PricePage.vue";
import ServicePage from "../views/service/ServicePage.vue";

const routes = [
    {path: '/login', component: LoginPage},
    {path: '/home', component: HomePage},
    {path: '/price', component: PricePage},
    {path: '/service', component: ServicePage}
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;