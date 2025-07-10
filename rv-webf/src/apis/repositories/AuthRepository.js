import Client from "@/apis/AxiosClient";

const resource = '/login';

export default {
    login(payload){
        return Client.post(`${resource}/`, payload);
    },
    refresh(){
        return Client.post(`${resource}/refresh`);
    },
    logout(){
        return Client.post(`${resource}/logout`);
    },
    reset(){
        return Client.post(`${resource}/reset`);
    },
    verifyReset(token){
        return Client.get(`${resource}/reset/${token}`);
    }
};