import axios from "axios";
import { IAddress } from "@/types/user.ts";
import { authHttpClient } from "@/api/api.ts";

export const getCategories = async () => {
  try {
    const response = await axios.get("/api/categories/");

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

export const getParentCategories = async () => {
  try {
    const response = await axios.get("/api/parent-categories/");

    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      throw new Error("An error occurred while creating the account");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get("/api/products/");
    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while creating the account");
    }

    throw new Error("An unexpected error occurred");
  }
};

export const getCategoryProducts = async (id: string) => {
  try {
    const response = await axios.get(`/api/products/category/${id}`);
    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while getting category products");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getLimitedBestSellingProducts = async () => {
  try {
    const response = await axios.get("/api/products/best-selling?limit=10");
    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while getting best selling products");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getBestSellingProducts = async () => {
  try {
    const response = await axios.get("/api/products/best-selling");
    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while getting best selling products");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postCreateAddress = async (data: IAddress) => {
  try {
    const response = await authHttpClient.post("/api/user/address", data);
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

export const deleteDeleteAddress = async (id: string) => {
  try {
    const response = await authHttpClient.delete(`/api/user/address/${id}`);
    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while deleting the account");
    }
    throw new Error("An unexpected error occurred");
  }
};
