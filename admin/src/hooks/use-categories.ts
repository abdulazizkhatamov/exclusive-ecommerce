import { useState } from "react";
import { getCategories } from "@/api/api-categories";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ICategory } from "@/types/category";
import {
  postCreateCategory,
  putUpdateCategory,
  deleteDeleteCategory,
} from "@/api/api-categories";

export function useCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const queryClient = useQueryClient();

  // Fetch categories category
  const { isLoading, isError } = useQuery("categories", getCategories, {
    onSuccess: (data) => {
      setCategories(data);
    },
  });

  // Mutation to create a category
  const createCategoryMutation = useMutation(postCreateCategory, {
    onSuccess: (newCategory) => {
      setCategories((prev) => [...prev, newCategory]);
      queryClient.invalidateQueries("categories"); // Refetch the categories
    },
  });

  // Mutation to update a category
  const updateCategoryMutation = useMutation(putUpdateCategory, {
    onSuccess: (updatedCategory) => {
      setCategories((prev) =>
        prev.map((category) =>
          category._id === updatedCategory.id ? updatedCategory : category,
        ),
      );
      queryClient.invalidateQueries("categories");
    },
  });

  // Mutation to delete a category
  const deleteCategoryMutation = useMutation(deleteDeleteCategory, {
    onSuccess: (categoryId) => {
      setCategories((prev) =>
        prev.filter((category) => category._id !== categoryId),
      );
      queryClient.invalidateQueries("categories");
    },
  });

  return {
    categories,
    isLoading,
    isError,
    addCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
  };
}
