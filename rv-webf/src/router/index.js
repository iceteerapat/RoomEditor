import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: '/', 
        redirect: '/home'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/LoginPage.vue')
    },
    {
        path: '/createAccount', 
        name: 'createAccount',
        component: () => import('../views/login/CreateAccountPage.vue')
    },
    {
        path: '/createAccount/verify/:token',
        name: 'verifyEmail',
        component: () => import('../views/login/VerifyEmailPage.vue')
    },
    {
        path: '/login/reset', 
        name: 'forgetPassword',
        component: () => import('../views/login/ForgotPassword.vue')
    },
    {
        path: '/login/reset/:token',
        name: 'verifyResetPassword',
        component: () => import('../views/login/VerifyResetPassword.vue')
    },
    {
        path: '/home', 
        name: 'home',
        component: () => import('../views/home/HomePage.vue')
    },
    {
        path: '/price',
        name: 'price',
        component: () => import('../views/price/PricePage.vue')
    },
    {
        path: '/service/create',
        name: 'serviceCreate',
        component: () => import ('../views/service/CreateRoomPage.vue')
    },
    {
        path: '/service/renovate',
        name: 'serviceRenovate',
        component: () => import ('../views/service/RenovateRoomPage.vue')
    },
    {
        path: '/service/creditAndSubscription',
        name: 'serviceCreditAndSubscription',
        component: () => import ('../views/service/PriceMenuPage.vue')
    },
    {
        path: '/contact',
        name: 'ContactUs',
        component: () => import ('../views/contact/ContactPage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;