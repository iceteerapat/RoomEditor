import Client from "@/apis/AxiosClient";

export default {
    create(payload){
        return Client.post('/create-checkout-session', payload);
    },
    manage(payload){
        return Client.post('/create-portal-session', payload);
    }
};