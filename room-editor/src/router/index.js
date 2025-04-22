import { createWebHistory, createRouter } from "vue-router";

import HomePage from "../views/home/HomePage.vue";
import LoginPage from "../views/login/LoginPage.vue";
import PricePage from "../views/price/PricePage.vue";
import ServicePage from "../views/service/ServicePage.vue";
import ForgotPassword from "../views/login/ForgotPassword.vue";
import SignUpPage from "../views/login/SignUpPage.vue";

const routes = [
    {path: '/login', component: LoginPage},
    {path: '/home', component: HomePage},
    {path: '/price', component: PricePage},
    {path: '/service', component: ServicePage},
    {path: '/sign-up', compoennt: SignUpPage},
    {path: '/forgetpassword', compoennt: ForgotPassword}
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;