import axios from "axios";


import {
    getAccessToken,
    getRefreshToken,
    saveTokens,
    clearTokens,
} from "./tokenService";
import { API_BASE_URL } from "../config";


const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(

    (config) => {

        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;

    },

    (error) => Promise.reject(error)

);

api.interceptors.response.use(

    (response) => response,

    async (error) => {
        console.error("API Error:", error.response?.status);

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const refresh = getRefreshToken();

                const response = await axios.post(
                    `${API_BASE_URL}/token/refresh/`,
                    {
                        refresh,
                    }
                );

                saveTokens(
                    response.data.access,
                    refresh
                );

                originalRequest.headers.Authorization =
                    `Bearer ${response.data.access}`;

                return api(originalRequest);

            } catch {

                clearTokens();

                window.location.href = "/";

            }

        }

        return Promise.reject(error);

    }

);

export default api;