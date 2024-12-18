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

// Get all categories
export const getCategories = async () => {
  try {
    const response = await authHttpClient.get("/api/admin/categories");
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

// Create a new category
export const postCreateCategory = async (category: {
  name: string;
  description: string;
  status: boolean;
}) => {
  try {
    const response = await authHttpClient.post(
      "/api/admin/categories",
      category,
    );
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

// Update a category by ID
export const putUpdateCategory = async (data: {
  _id: string;
  name: string;
  description: string;
  status: boolean;
}) => {
  try {
    const response = await authHttpClient.put(
      `/api/admin/categories/${data._id}`,
      data,
    );
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

// Delete a category by ID
export const deleteDeleteCategory = async (id: string) => {
  try {
    const response = await authHttpClient.delete(`/api/admin/categories/${id}`);
    return response.data;
  } catch (e) {
    handleError(e);
  }
};
