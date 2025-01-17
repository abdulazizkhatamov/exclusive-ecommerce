import { useEffect, useMemo, useState } from "react";
import { Row } from "@tanstack/react-table";
import * as Yup from "yup";

import { useFormik } from "formik";
import { useMutation } from "react-query";
import { queryClient } from "@/api/api.ts";
import {
  deleteDeleteCategory,
  putUpdateCategory,
} from "@/api/api-categories.ts";

import { categorySchema } from "@/features/categories/data/schema-categories.ts";

import { useToast } from "@/hooks/use-toast.ts";
import { DeleteCategoryDialog } from "@/features/categories/components/DeleteCategoryDialog.tsx";
import { UpdateCategorySheet } from "@/features/categories/components/UpdateCategorySheet.tsx";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface CategoryFormValues {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  parent: string | null; // Ensure this matches the form structure
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [updateSheet, setUpdateSheet] = useState<boolean>(false);
  const { toast } = useToast();

  const category = useMemo(
    () => categorySchema.parse(row.original),
    [row.original],
  );

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteDeleteCategory,
  });

  const updateCategoryMutation = useMutation(putUpdateCategory);

  const updateCategoryFormik = useFormik<CategoryFormValues>({
    initialValues: {
      _id: category?._id || "",
      name: category?.name || "",
      description: category?.description || "",
      status: category?.status || true,
      parent: category?.parent || null,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      updateCategoryMutation.mutate(values, {
        onSuccess: async () => {
          await queryClient.invalidateQueries("categories");
          setUpdateSheet(!updateSheet);
          toast({
            title: "Category updated.",
            description: new Date().toUTCString(),
          });
          resetForm();
        },
        onError: async (error) => {
          const message =
            error instanceof Error ? error.message : "An error occurred";
          toast({
            variant: "destructive",
            title: "Failed to update category.",
            description: message,
          });
        },
      });
    },
  });

  useEffect(() => {
    if (category) {
      updateCategoryFormik.resetForm({
        values: {
          _id: category._id,
          name: category.name,
          description: category.description || "",
          status: category?.status || true,
          parent: category?.parent || null,
        },
      });
    }
  }, [category]);

  return (
    <div className="flex gap-2">
      <UpdateCategorySheet
        open={updateSheet}
        onOpenChange={() => setUpdateSheet(!updateSheet)}
        formik={updateCategoryFormik}
      />
      <DeleteCategoryDialog
        open={deleteDialog}
        onOpenChange={() => setDeleteDialog(!deleteDialog)}
        onDelete={() =>
          deleteCategoryMutation.mutate(category._id, {
            onSuccess: async () => {
              await queryClient.invalidateQueries("categories");
              setDeleteDialog(false);
              toast({
                title: "Category deleted.",
                description: new Date().toUTCString(),
              });
            },
            onError: (error) => {
              const message =
                error instanceof Error ? error.message : "An error occurred";
              toast({
                variant: "destructive",
                title: "Failed to delete category.",
                description: message,
              });
            },
          })
        }
        categoryName={category?.name}
      />
    </div>
  );
}
