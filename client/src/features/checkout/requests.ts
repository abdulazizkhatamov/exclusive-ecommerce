import axios from "axios";
import { IOrder } from "@/types/order.ts";
import { authHttpClient } from "@/api/api.ts";

export const postCreateOrder = async (data: IOrder) => {
  try {
    const response = await authHttpClient.post("/api/user/order", data);
    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while creating the address");
    }
    throw new Error("An unexpected error occurred");
  }
};
