import { httpClient } from "@/config/axiosConfig";
import { getAccessToken, setAccessToken } from "@/helper/token.ts";
import axios, { InternalAxiosRequestConfig } from "axios";
import { postLogoutAccount } from "@/api/api.ts";

const useAuthHttpClient = () => {
  const authHttpClient = axios.create({
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const refreshAccessToken = async () => {
    try {
      const response = await httpClient.get("/api/auth/refresh-accessToken");

      const { accessToken } = response.data;
      return accessToken;
    } catch (error) {
      await postLogoutAccount();
    }

    return "";
  };

  authHttpClient.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig,
    ): Promise<InternalAxiosRequestConfig> => {
      let accessToken = getAccessToken();

      if (!accessToken) {
        accessToken = (await refreshAccessToken()) as string;
        setAccessToken(accessToken);
      }
      config.headers.Authorization = `Bearer ${accessToken}`;

      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  authHttpClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig;

      if (
        error.response?.status === 401 &&
        error.response.data.error?.name === "TokenExpiredError"
      ) {
        const accessToken = await refreshAccessToken();
        console.log(accessToken);
        setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return authHttpClient.request(originalRequest);
      }
      return Promise.reject(error);
    },
  );

  return authHttpClient;
};

export default useAuthHttpClient;
