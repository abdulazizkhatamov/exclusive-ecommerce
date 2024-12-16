import axios from "axios";
import { QueryClient } from "react-query";

import { clearAuth } from "@/features/auth/auth-slice.ts";
import store from "@/app/store.ts";

export const queryClient = new QueryClient();

export const postCreateAccount = async (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post("/api/auth/create-account", data);

    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Check if the error has a response with a data.message
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while creating the account");
    }

    // Handle unexpected errors
    throw new Error("An unexpected error occurred");
  }
};

export const postLoginAccount = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post("/api/auth/login-account", data);

    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Check if the error has a response with a data.message
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while creating the account");
    }

    // Handle unexpected errors
    throw new Error("An unexpected error occurred");
  }
};

export const postLogoutAccount = async () => {
  try {
    await axios.post("/api/auth/logout-account", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    store.dispatch(clearAuth());
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Check if the error has a response with a data.message
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while creating the account");
    }

    // Handle unexpected errors
    throw new Error("An unexpected error occurred");
  }
};

export const getRefreshToken = async () => {
  try {
    const response = await axios.get("/api/auth/refresh-token");

    const { accessToken } = response.data;

    return accessToken;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Check if the error has a response with a data.message
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while creating the account");
    }

    // Handle unexpected errors
    throw new Error("An unexpected error occurred");
  }
};
