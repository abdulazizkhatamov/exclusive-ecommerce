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

export const getVariantsByProduct = async (product: string) => {
  try {
    const response = await authHttpClient.get(`/api/admin/variants/${product}`);
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const postCreateVariant = async (variant: FormData) => {
  try {
    const response = await authHttpClient.post("/api/admin/variants", variant, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (e) {
    handleError(e);
  }
};

export const putUpdateVariant = async (variant: {
  id: string;
  formData: any;
}) => {
  try {
    const formData = new FormData();
    formData.append("id", variant.id);

    // Append other fields
    Object.keys(variant.formData).forEach((key) => {
      if (key === "images") {
        // Append new image files (Files or Base64-encoded strings)
        variant.formData.images.forEach((file: File | string) => {
          if (typeof file !== "string") formData.append("images", file); // Only append new files
        });
      } else if (key === "oldImages") {
        // Append each old image as separate entries in formData
        variant.formData.oldImages.forEach((image: string) => {
          formData.append("oldImages[]", image); // Append as an array of image paths
        });
      } else if (key === "attributes") {
        // Append attributes as a JSON string to maintain the structure
        formData.append("attributes", JSON.stringify(variant.formData[key]));
      } else {
        formData.append(key, variant.formData[key]);
      }
    });

    const response = await authHttpClient.put(
      "/api/admin/variants/",
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

export const deleteDeleteVariant = async (_id: string) => {
  try {
    const response = await authHttpClient.delete(`/api/admin/variants/${_id}`);
    return response.data;
  } catch (e) {
    handleError(e);
  }
};
