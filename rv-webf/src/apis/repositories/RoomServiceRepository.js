import Client from "@/apis/AxiosClient";

const resource = '/service';

export default {

    menu(){
        return Client.get(`${resource}/`);
    },
    create(payload){
        return Client.post(`${resource}/create`, payload);
    },
    renovate(payload){
        return Client.post(`${resource}/renovate`, payload);
    }

};