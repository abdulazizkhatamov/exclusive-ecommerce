import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { postCreateCategory } from "@/api/api-categories.ts";
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
import { toggleCreateCategorySheet } from "@/features/ui/ui-slice.ts";

const categoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

const CreateCategoryForm: React.FC = () => {
  const dispatch = useDispatch();
  const { createCategorySheet } = useSelector((state: RootState) => state.ui);
  const { toast } = useToast();
  const createCategoryMutation = useMutation(postCreateCategory);

  const createCategoryFormik = useFormik({
    initialValues: {
      name: "",
      description: "",
      status: true,
    },
    validationSchema: categoryValidationSchema,
    onSubmit: (values, { resetForm }) => {
      createCategoryMutation.mutate(values, {
        onSuccess: () => {
          dispatch(toggleCreateCategorySheet());
          toast({
            title: "Category created",
            description: new Date().toUTCString(),
          });
          resetForm();
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "An error occurred";
          toast({
            variant: "destructive",
            title: "Failed to create category.",
            description: message,
          });
        },
      });
    },
  });

  return (
    <Sheet
      open={createCategorySheet}
      onOpenChange={() => dispatch(toggleCreateCategorySheet())}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a New Category</SheetTitle>
          <SheetDescription>
            Set up a new category for your store’s products.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={createCategoryFormik.handleSubmit}
          className="grid gap-4 py-4"
        >
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              onChange={createCategoryFormik.handleChange}
              value={createCategoryFormik.values.name}
            />
            {createCategoryFormik.errors.name && (
              <div className="text-red-500 text-sm">
                {createCategoryFormik.errors.name}
              </div>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description"
              onChange={createCategoryFormik.handleChange}
              value={createCategoryFormik.values.description}
            />
            {createCategoryFormik.errors.description && (
              <div className="text-red-500 text-sm">
                {createCategoryFormik.errors.description}
              </div>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Switch
              id="status"
              checked={createCategoryFormik.values.status}
              onCheckedChange={(checked) =>
                createCategoryFormik.setFieldValue("status", checked)
              }
            />
          </div>
          <Button type="submit" className="btn btn-primary">
            Create
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCategoryForm;
