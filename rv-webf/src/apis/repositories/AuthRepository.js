import Client from "../AxiosClient";

const resource = '/login';

export default {
    login(payload){
        return Client.post(`${resource}/`, payload);
    }
};