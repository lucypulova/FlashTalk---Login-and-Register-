import axios from "axios";

// Взимаме базовия URL от .env файл
const BASE_URL = import.meta.env.VITE_API_URL;

// Създаваме инстанция на Axios с този URL
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // промени на true ако backend ползва cookies
});

// Interceptor: автоматично добавя Bearer token от localStorage, ако съществува
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
