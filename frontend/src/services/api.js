import axios from "axios";


import {
    getAccessToken,
    saveAccessToken,
    clearAccessToken,
} from "./tokenService";
import { API_BASE_URL } from "../config";


const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
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

let refreshPromise = null;

async function refreshAccessToken() {

    if (!refreshPromise) {

        refreshPromise = axios
            .post(
                `${API_BASE_URL}/token/refresh/`,
                {},
                { withCredentials: true }
            )
            .then((response) => {
                saveAccessToken(response.data.access);
                return response.data.access;
            })
            .finally(() => {
                refreshPromise = null;
            });

    }

    return refreshPromise;

}

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

                const access = await refreshAccessToken();

                originalRequest.headers.Authorization = `Bearer ${access}`;

                return api(originalRequest);

            } catch {

                clearAccessToken();
                window.location.href = "/session-expired";

            }

        }

        return Promise.reject(error);

    }

);

export default api;
export { refreshAccessToken };