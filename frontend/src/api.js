import axios from "axios";
import { message } from 'antd'

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
        message.error(errorMessage);
        return Promise.reject(error);
    }
);

export default API;