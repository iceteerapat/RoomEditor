import { defineStore } from "pinia";

import router from "../router";

const baseURL = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        baseURL: baseURL,
        last: new Date(),
        user: JSON.parse(localStorage.getItem('user')),
        returnURL: null
    }),
    actions: {
        async login(username, password){
            
        },
        async refresh(){

        },
        logout(){

        },
        update(){

        },
        hasRole(){

        }
    }
})