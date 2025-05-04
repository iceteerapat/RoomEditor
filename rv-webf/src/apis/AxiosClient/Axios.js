import axios from "axios";

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const Client = axios.create({
    baseUrl,
    headers: {
    }
});

export default Client;