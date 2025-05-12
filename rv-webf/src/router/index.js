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
        path: '/forgetPassword', 
        name: 'forgetPassword',
        component: () => import('../views/login/ForgotPassword.vue')
    },
    {
        path: '/verify-email/:token',
        name: 'verifyEmail',
        component: () => import('../views/login/VerifyEmailPage.vue')
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
        component: () => import('../views/service/ServicePage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;