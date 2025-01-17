import axios from "axios";
import store from "@/app/store.ts";
import { clearAuth } from "@/features/auth/auth-slice.ts";

export const postCreateAccount = async (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post("/api/user/auth/create-account", data);

    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Check if the error has a response with a category.message
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
    const response = await axios.post("/api/user/auth/login-account", data);

    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Check if the error has a response with a category.message
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while creating the account");
    }

    // Handle unexpected errors
    throw new Error("An unexpected error occurred");
  }
};

export const postVerifyAccount = async (data: { token: string }) => {
  try {
    const response = await axios.post("/api/user/auth/verify-account", data);
    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while verify account");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postLogoutAccount = async () => {
  try {
    await axios.post("/api/user/auth/logout-account", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    store.dispatch(clearAuth());
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Check if the error has a response with a category.message
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while creating the account");
    }

    // Handle unexpected errors
    throw new Error("An unexpected error occurred");
  }
};
