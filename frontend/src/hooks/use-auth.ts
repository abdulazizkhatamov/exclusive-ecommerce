import { httpClient } from "@/config/axios-config.ts";
import axios, { InternalAxiosRequestConfig } from "axios";
import { postLogoutAccount } from "@/api/api.ts";
import store from "@/app/store.ts";
import { setAccessToken } from "@/features/auth/auth-slice.ts";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const useAuthHttpClient = () => {
  let isRefreshing = false;
  let refreshSubscribers: ((token: string | null) => void)[] = [];

  const notifySubscribers = (token: string | null) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
  };

  const addSubscriber = (callback: (token: string | null) => void) => {
    refreshSubscribers.push(callback);
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    if (isRefreshing) {
      return new Promise((resolve) => {
        addSubscriber(resolve);
      });
    }

    isRefreshing = true;
    try {
      const response = await httpClient.get<{ accessToken: string }>(
        "/api/auth/refresh-token",
      );
      const { accessToken } = response.data;

      store.dispatch(setAccessToken(accessToken));
      notifySubscribers(accessToken);

      return accessToken;
    } catch {
      notifySubscribers(null);
      await postLogoutAccount();
      return null;
    } finally {
      isRefreshing = false;
    }
  };

  const authHttpClient = axios.create({
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  authHttpClient.interceptors.request.use(
    async (config) => {
      let accessToken = store.getState().auth.accessToken;

      if (!accessToken) {
        accessToken = await refreshAccessToken();
      }

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  authHttpClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (
        error.response?.status === 401 &&
        error.response.data.error?.name === "TokenExpiredError" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        const accessToken = await refreshAccessToken();

        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return authHttpClient.request(originalRequest);
        }
      }

      return Promise.reject(error);
    },
  );

  return authHttpClient;
};

export default useAuthHttpClient;
