import axios from 'axios';

import { store } from "@/store/store.js";
import { logout } from "@/store/slices/authSlice.js";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async ({ response }) => {
    const status = response?.status;
    const message = response?.data?.message || response?.data?.details?.[0];

    if (status === 401) {
      store.dispatch(logout({ redirectTo: "/login" }));
    }

    return Promise.reject({
      status: status || 500,
      message: message || "Сталася неочікувана помилка",
    });
  }
);