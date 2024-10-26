import axios from "axios";
import { ACCESS_TOKEN } from "./constants";


//Api is used to access the backend and get the access token for the user.
//For every request to backend it will check for token in local storage
const api = axios.create({
  baseURL:"http://127.0.0.1:8000" });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;