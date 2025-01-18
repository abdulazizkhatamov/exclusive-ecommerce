import axios from "axios";
import { authHttpClient } from "@/api/api.ts";

const handleError = (e: unknown) => {
  if (axios.isAxiosError(e)) {
    if (e.response?.data?.message) {
      throw new Error(e.response.data.message);
    }
    throw new Error("An error occurred while processing the request");
  }
  throw new Error("An unexpected error occurred");
};

export const getChatAccounts = async () => {
  try {
    const response = await authHttpClient.get("/api/admin/chat/accounts");
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const postCreateChatAccount = async ({
  formData,
}: {
  formData: FormData;
}) => {
  try {
    const response = await authHttpClient.post(
      "/api/admin/chat/accounts",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const deleteDeleteChatAccount = async (data: { _id: string }) => {
  try {
    const response = await authHttpClient.delete(`/api/admin/chat/accounts/`, {
      data,
    });
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const getChats = async () => {
  try {
    const response = await authHttpClient.get("/api/admin/chats");
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const postSendMessage = async (data: {
  _id: string;
  message: string;
  support: string;
}) => {
  try {
    const response = await authHttpClient.post(
      "/api/admin/chat/messages",
      data,
    );
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const deleteDeleteMessage = async (data: { _id: string }) => {
  try {
    const response = await authHttpClient.delete(`/api/admin/chat/messages/`, {
      data,
    });
    return response.data;
  } catch (e) {
    handleError(e);
  }
};
