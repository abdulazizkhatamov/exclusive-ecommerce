import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { putUpdateCategory } from "@/api/api-categories.ts";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";
import { toggleUpdateCategorySheet } from "@/features/ui/ui-category-slice.ts";
import { queryClient } from "@/api/api.ts";

const categoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

const UpdateCategorySheet: React.FC = () => {
  const dispatch = useDispatch();
  const { updateCategorySheet } = useSelector(
    (state: RootState) => state.ui_category,
  );
  const { toast } = useToast();
  const updateCategoryMutation = useMutation(putUpdateCategory);

  const updateCategoryFormik = useFormik({
    initialValues: {
      _id: updateCategorySheet.category?._id || "",
      name: updateCategorySheet.category?.name || "",
      description: updateCategorySheet.category?.description || "",
      status: updateCategorySheet.category?.status || true,
      parent: updateCategorySheet.category?.parent || null,
    },
    validationSchema: categoryValidationSchema,
    onSubmit: (values, { resetForm }) => {
      updateCategoryMutation.mutate(values, {
        onSuccess: async () => {
          await queryClient.invalidateQueries("categories");
          dispatch(toggleUpdateCategorySheet({ category: null }));
          toast({
            title: "Category updated.",
            description: new Date().toUTCString(),
          });
          resetForm();
        },
        onError: async (error) => {
          await queryClient.invalidateQueries("categories");
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
    if (updateCategorySheet.category) {
      updateCategoryFormik.setValues({
        _id: updateCategorySheet.category._id,
        name: updateCategorySheet.category.name,
        description: updateCategorySheet.category.description,
        status: updateCategorySheet.category?.status || true,
        parent: updateCategorySheet.category?.parent || null,
      });
    }
  }, [updateCategorySheet]);

  return (
    <Sheet
      open={updateCategorySheet.sheet}
      onOpenChange={() =>
        dispatch(toggleUpdateCategorySheet({ category: null }))
      }
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update a category</SheetTitle>
          <SheetDescription>
            Update your category for your store’s products.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={updateCategoryFormik.handleSubmit}
          className="grid gap-4 py-4"
        >
          <Input
            type={"hidden"}
            value={updateCategoryFormik.values._id}
            id={"_id"}
          />
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              onChange={updateCategoryFormik.handleChange}
              value={updateCategoryFormik.values.name}
            />
            {updateCategoryFormik.errors.name && (
              <div className="text-red-500 text-sm">
                {updateCategoryFormik.errors.name}
              </div>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description"
              onChange={updateCategoryFormik.handleChange}
              value={updateCategoryFormik.values.description}
            />
            {updateCategoryFormik.errors.description && (
              <div className="text-red-500 text-sm">
                {updateCategoryFormik.errors.description}
              </div>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Switch
              id="status"
              checked={updateCategoryFormik.values.status}
              onCheckedChange={(checked) =>
                updateCategoryFormik.setFieldValue("status", checked)
              }
            />
          </div>
          <Button type="submit" className="btn btn-primary">
            Update
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateCategorySheet;
