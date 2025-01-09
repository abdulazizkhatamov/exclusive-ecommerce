import axios from "axios";
import { authHttpClient } from "@/api/api.ts";

export const postAddToCart = async (data: unknown) => {
  try {
    const response = await authHttpClient.post("/api/user/cart/", data);
    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while adding item to cart");
    }

    throw new Error("An unexpected error occurred");
  }
};

export const putUpdateCartItemQty = async (data: {
  quantity: number;
  id: string;
}) => {
  try {
    const response = await authHttpClient.put("/api/user/cart/qty", data);

    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Check if the error has a response with a category.message
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while getting the cart");
    }

    // Handle unexpected errors
    throw new Error("An unexpected error occurred");
  }
};

export const deleteDeleteCartItem = async (id: string) => {
  try {
    const response = await authHttpClient.delete(`/api/user/cart/${id}`);

    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Check if the error has a response with a category.message
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while getting the cart");
    }

    // Handle unexpected errors
    throw new Error("An unexpected error occurred");
  }
};
