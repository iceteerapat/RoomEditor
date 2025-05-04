import Client from "../AxiosClient";

const resource = '/createAccount';

export default {
    create(payload){
        return Client.post(`${resource}/create`, payload);
    }
};
