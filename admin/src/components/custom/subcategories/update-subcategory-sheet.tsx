import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "react-query";
import { getCategories, putUpdateCategory } from "@/api/api-categories.ts";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";

import { queryClient } from "@/api/api.ts";
import { Category } from "@/components/custom/table/categories/data/schema-categories.ts";
import { toggleUpdateCategorySheet } from "@/features/ui/ui-category-slice.ts";

interface UpdateSubcategorySheetProps {
  parent?: string;
}

const subcategoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  parent: Yup.string().required("Category is required"),
});

const UpdateSubcategorySheet: React.FC<UpdateSubcategorySheetProps> = ({
  parent,
}) => {
  const dispatch = useDispatch();
  const { updateCategorySheet } = useSelector(
    (state: RootState) => state.ui_category,
  );
  const { toast } = useToast();
  const updateSubcategoryMutation = useMutation(putUpdateCategory);
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  console.log(updateCategorySheet);

  const updateSubcategoryFormik = useFormik({
    initialValues: {
      _id: updateCategorySheet.category?._id || "",
      name: updateCategorySheet.category?.name || "",
      description: updateCategorySheet.category?.description || "",
      status: updateCategorySheet.category?.status || true,
      parent: "",
    },
    validationSchema: subcategoryValidationSchema,
    onSubmit: (values, { resetForm }) => {
      updateSubcategoryMutation.mutate(values, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["subcategories", parent],
          });
          dispatch(toggleUpdateCategorySheet({ category: null }));
          toast({
            title: "Category updated.",
            description: new Date().toUTCString(),
          });
          resetForm();
        },
        onError: async (error) => {
          await queryClient.invalidateQueries({
            queryKey: ["subcategories", parent],
          });
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
      const matchedCategoryId =
        parent || updateCategorySheet.category?.parent || "";

      updateSubcategoryFormik.setValues({
        _id: updateCategorySheet.category._id,
        name: updateCategorySheet.category.name,
        description: updateCategorySheet.category.description,
        status: updateCategorySheet.category?.status || true,
        parent: matchedCategoryId,
      });
    }
  }, [updateCategorySheet, categories, parent]);

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
          onSubmit={updateSubcategoryFormik.handleSubmit}
          className="grid gap-4 py-4"
        >
          <Input
            type={"hidden"}
            value={updateSubcategoryFormik.values._id}
            id={"_id"}
          />
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              onChange={updateSubcategoryFormik.handleChange}
              value={updateSubcategoryFormik.values.name}
            />
            {updateSubcategoryFormik.errors.name && (
              <div className="text-red-500 text-sm">
                {updateSubcategoryFormik.errors.name}
              </div>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description"
              onChange={updateSubcategoryFormik.handleChange}
              value={updateSubcategoryFormik.values.description}
            />
            {updateSubcategoryFormik.errors.description && (
              <div className="text-red-500 text-sm">
                {updateSubcategoryFormik.errors.description}
              </div>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="category">Category</Label>
            {parent ? (
              <Input
                id="category"
                value={
                  categories?.find(
                    (category: Category) => category._id === parent,
                  )?.name || "Category not found"
                }
                disabled
              />
            ) : (
              <Select
                onValueChange={(value) =>
                  updateSubcategoryFormik.setFieldValue("parent", value)
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      updateSubcategoryFormik.values.parent
                        ? categories?.find(
                            (category: Category) =>
                              category._id ===
                              updateSubcategoryFormik.values.parent,
                          )?.name
                        : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories &&
                      categories.map((category: Category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            {!parent && updateSubcategoryFormik.errors.parent && (
              <div className="text-red-500 text-sm">
                {updateSubcategoryFormik.errors.parent}
              </div>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Switch
              id="status"
              checked={updateSubcategoryFormik.values.status}
              onCheckedChange={(checked) =>
                updateSubcategoryFormik.setFieldValue("status", checked)
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

export default UpdateSubcategorySheet;
