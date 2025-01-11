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

export const getProducts = async () => {
  try {
    const response = await authHttpClient.get("/api/admin/products");
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const getProduct = async (_id: string) => {
  try {
    const response = await authHttpClient.get(`/api/admin/products/${_id}`);
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const postCreateProduct = async ({
  formData,
}: {
  formData: FormData;
}) => {
  try {
    const response = await authHttpClient.post(
      "/api/admin/products",
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

export const putUpdateProduct = async ({
  _id,
  formData,
}: {
  _id: string;
  formData: FormData;
}) => {
  try {
    const response = await authHttpClient.put(
      `/api/admin/products/${_id}`,
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

export const deleteDeleteProduct = async (id: string) => {
  try {
    const response = await authHttpClient.delete(`/api/admin/products/${id}`);
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const getOrders = async () => {
  try {
    const response = await authHttpClient.get(`/api/admin/orders`);
    return response.data;
  } catch (e) {
    handleError(e);
  }
};
