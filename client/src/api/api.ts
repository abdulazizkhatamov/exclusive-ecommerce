import { QueryClient } from "react-query";
import { httpClient } from "@/config/axios-config.ts";
import store from "@/app/store.ts";
import { setAccessToken } from "@/features/auth/auth-slice.ts";
import { postLogoutAccount } from "@/features/auth/reqests.ts";
import axios, { InternalAxiosRequestConfig } from "axios";

export const queryClient = new QueryClient();

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await httpClient.get<{ accessToken: string }>(
      "/api/user/auth/refresh-token",
    );
    const { accessToken } = response.data;

    store.dispatch(setAccessToken(accessToken));

    return accessToken;
  } catch {
    await postLogoutAccount();
    return null;
  }
};

export const authHttpClient = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors
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
// Response Interceptor
authHttpClient.interceptors.response.use(
  (res) => res, // Return response as-is for successful requests
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response?.status === 401 && // Unauthorized status
      error.response.data.error?.name === "TokenExpiredError" && // Specific error name
      !originalRequest._retry // Avoid infinite retry loops
    ) {
      originalRequest._retry = true; // Mark the request as retried
      const accessToken = await refreshAccessToken();

      if (accessToken) {
        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        // Retry the original request with the new access token
        return authHttpClient.request(originalRequest);
      }
    }

    return Promise.reject(error); // Reject all other errors
  },
);
