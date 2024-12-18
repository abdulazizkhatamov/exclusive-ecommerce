import axios from "axios";

import { clearAuth } from "@/features/auth/auth-slice.ts";
import store from "@/app/store.ts";

const handleError = (e: unknown) => {
  if (axios.isAxiosError(e)) {
    if (e.response?.data?.message) {
      throw new Error(e.response.data.message);
    }
    throw new Error("An error occurred while processing the request");
  }
  throw new Error("An unexpected error occurred");
};

export const postCreateAccount = async (data: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axios.post("/api/admin/auth/create-account", data);

    return response.data;
  } catch (e: unknown) {
    handleError(e);
  }
};

export const postLoginAccount = async (data: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axios.post("/api/admin/auth/login-account", data);

    return response.data;
  } catch (e: unknown) {
    handleError(e);
  }
};

export const postLogoutAccount = async () => {
  try {
    await axios.post("/api/admin/auth/logout-account", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    store.dispatch(clearAuth());
  } catch (e: unknown) {
    handleError(e);
  }
};

export const getAdminExistence = async () => {
  try {
    const response = await axios.get("/api/admin/auth/is-exist");

    return response.data;
  } catch (e: unknown) {
    handleError(e);
  }
};
