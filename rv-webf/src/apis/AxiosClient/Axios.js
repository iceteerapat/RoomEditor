import axios from "axios";

const baseURL = `${import.meta.env.VITE_API_URL}`;

const Client = axios.create({
    baseURL,
    headers: {
        'Content-type': 'application/json'
    }
});

Client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Client;