import Client from "@/apis/AxiosClient";

export default {
    pruchase(payload){
        return Client.post('/webhook', payload);
    }
};