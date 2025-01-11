import axios from "axios";
import { authHttpClient } from "@/api/api.ts";

// Common error handling function
const handleError = (e: unknown) => {
  if (axios.isAxiosError(e)) {
    if (e.response?.data?.message) {
      throw new Error(e.response.data.message);
    }
    throw new Error("An error occurred while processing the request");
  }
  throw new Error("An unexpected error occurred");
};

export const putUpdateOrder = async (data: { _id: string; status: string }) => {
  try {
    const response = await authHttpClient.put(
      `/api/admin/orders/${data._id}`,
      data,
    );
    return response.data;
  } catch (e) {
    handleError(e);
  }
};
