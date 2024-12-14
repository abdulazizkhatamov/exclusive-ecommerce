import axios from "axios";
import { QueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/helper/token.ts";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/features/auth/authSlice.ts";

export const queryClient = new QueryClient();

export const postCreateAccount = async (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post("/api/auth/create-account", data);

    return response.data;
  } catch (e: any) {
    throw new Error(e.response.data.message);
  }
};

export const postLoginAccount = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post("/api/auth/login-account", data);

    return response.data;
  } catch (e: any) {
    throw new Error(e.response.data.message);
  }
};

export const postLogoutAccount = async () => {
  try {
    await axios.get("/api/auth/logout-account", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    dispatch(setUser(null));
    setAccessToken("");
    navigate("/");
  } catch (e: any) {
    throw new Error(e.response.data.message);
  }
};

export const getRefreshToken = async () => {
  try {
    const response = await axios.get("/api/auth/refresh-token");

    const { accessToken } = response.data;

    return accessToken;
  } catch (e: any) {
    throw new Error(e.response.data.message);
  }
};
