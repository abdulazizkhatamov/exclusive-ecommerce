import { authHttpClient } from "@/api/api.ts";
import axios from "axios";

const handleError = (e: unknown) => {
  if (axios.isAxiosError(e)) {
    if (e.response?.data?.message) {
      throw new Error(e.response.data.message);
    }
    throw new Error("An error occurred while processing the request");
  }
  throw new Error("An unexpected error occurred");
};

// Get all categories
export const getMailAccounts = async () => {
  try {
    const response = await authHttpClient.get("/api/admin/mail/accounts");
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const postCreateMailAccount = async (data: {
  name: string;
  key: string;
}) => {
  try {
    const response = await authHttpClient.post(
      "/api/admin/mail/accounts",
      data,
    );
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const deleteDeleteMailAccount = async (data: { key: string }) => {
  try {
    const response = await authHttpClient.delete(`/api/admin/mail/accounts/`, {
      data,
    });

    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const getInboxMails = async () => {
  try {
    const response = await authHttpClient.get("/api/admin/mails/inbox");

    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const getTrashMails = async () => {
  try {
    const response = await authHttpClient.get("/api/admin/mails/trash");
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const putUpdateMessageStatus = async (data: {
  _id: string;
  status: boolean;
}) => {
  try {
    const response = await authHttpClient.put(
      `/api/admin/mail/status/${data._id}`,
      { status: data.status },
    );
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const deleteDeleteMessage = async (data: {
  _id: string;
  type: string;
}) => {
  try {
    const response = await authHttpClient.delete(
      `/api/admin/mail/delete/${data._id}`,
      { data },
    );
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const postSendMessage = async (data: {
  _id: string;
  message: string;
  apiKey: string;
}) => {
  try {
    const response = await authHttpClient.post("/api/admin/mail/message", data);
    return response.data;
  } catch (e) {
    handleError(e);
  }
};
