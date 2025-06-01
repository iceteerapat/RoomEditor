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
        path: '/forgetPassword', 
        name: 'forgetPassword',
        component: () => import('../views/login/ForgotPassword.vue')
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
        path: '/service', 
        name: 'service',
        component: () => import('../views/service/ServicePage.vue'),
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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;