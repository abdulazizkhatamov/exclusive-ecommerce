import axios from "axios";

export const getProductById = async (_id: string) => {
  try {
    const response = await axios.get(`/api/product/${_id}`);

    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Check if the error has a response with a category.message
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while getting the product");
    }

    // Handle unexpected errors
    throw new Error("An unexpected error occurred");
  }
};

export const getRelatedProducts = async (id: string) => {
  try {
    const response = await axios.get(`/api/products/related/${id}`);

    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data?.message) {
        throw new Error(e.response.data.message);
      }
      throw new Error("An error occurred while getting the related products");
    }

    throw new Error("An unexpected error occurred");
  }
};
