import axios from "axios";

export const postSubmitMessage = async (data: unknown) => {
  try {
    const response = await axios.post("/api/contact/", data);
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
