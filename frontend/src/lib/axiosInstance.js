import axios from 'axios';

export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorStatus = error.response.status;
    const errorMessage = error.response?.data?.message || error.response?.data?.details?.[0];

    if (errorStatus === 401) {
      localStorage.removeItem('token');
    }

    return Promise.reject({
      status: errorStatus,
      message: errorMessage || "Сталася неочікувана помилка",
    });
  }
);