import axios from "axios";

const baseURL = `${import.meta.env.VITE_API_URL}`;

const Client = axios.create({
    baseURL,
    headers: {
        'Content-type': 'application/json'
    }
});

export default Client;