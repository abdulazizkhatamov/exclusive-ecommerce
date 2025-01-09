import axios from "axios";
import { authHttpClient } from "@/api/api.ts";

export const getOrdersByUserID = async (userId: string) => {
  try {
    const response = await authHttpClient.get(`/api/user/order/${userId}`);

    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Check if the error has a response with a category.message
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while getting the orders");
    }

    // Handle unexpected errors
    throw new Error("An unexpected error occurred");
  }
};
