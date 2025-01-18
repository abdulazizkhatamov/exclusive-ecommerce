import React from "react";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Category } from "@/features/categories/data/schema-categories.ts";
import { Switch } from "@/components/ui/switch.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { useMutation, useQuery } from "react-query";
import { getCategories, postCreateCategory } from "@/api/api-categories.ts";
import { useFormik } from "formik";
import { queryClient } from "@/api/api.ts";
import * as Yup from "yup";
import { Loader } from "lucide-react";

interface CreateSubcategoryFormProps {
  setCreateSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const subcategoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  parent: Yup.string().required("Category is required"),
});

const CreateSubcategoryForm: React.FC<CreateSubcategoryFormProps> = ({
  setCreateSheet,
}) => {
  const { toast } = useToast();
  const createSubcategoryMutation = useMutation(postCreateCategory);
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createSubcategoryFormik = useFormik({
    initialValues: {
      name: "",
      description: "",
      status: true,
      parent: parent ? parent : "",
    },
    validationSchema: subcategoryValidationSchema,
    onSubmit: (values, { resetForm }) => {
      createSubcategoryMutation.mutate(values, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["subcategories"],
          });
          setCreateSheet(false);
          toast({
            title: "Subcategory created.",
            description: new Date().toUTCString(),
          });
          resetForm();
        },
        onError: async (error) => {
          await queryClient.invalidateQueries({
            queryKey: ["subcategories"],
          });
          const message =
            error instanceof Error ? error.message : "An error occurred";
          toast({
            variant: "destructive",
            title: "Failed to create subcategory.",
            description: message,
          });
        },
      });
    },
  });

  return (
    <form
      onSubmit={createSubcategoryFormik.handleSubmit}
      className="grid gap-4 py-4"
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Name"
          onChange={createSubcategoryFormik.handleChange}
          value={createSubcategoryFormik.values.name}
        />
        {createSubcategoryFormik.errors.name && (
          <div className="text-red-500 text-sm">
            {createSubcategoryFormik.errors.name}
          </div>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description"
          onChange={createSubcategoryFormik.handleChange}
          value={createSubcategoryFormik.values.description}
        />
        {createSubcategoryFormik.errors.description && (
          <div className="text-red-500 text-sm">
            {createSubcategoryFormik.errors.description}
          </div>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="category">Category</Label>
        <Select
          onValueChange={(value) =>
            createSubcategoryFormik.setFieldValue("parent", value)
          }
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                createSubcategoryFormik.values.parent
                  ? categories?.find(
                      (category: Category) =>
                        category._id === createSubcategoryFormik.values.parent,
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
        {createSubcategoryFormik.errors.parent && (
          <div className="text-red-500 text-sm">
            {createSubcategoryFormik.errors.parent}
          </div>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="status">Status</Label>
        <Switch
          id="status"
          checked={createSubcategoryFormik.values.status}
          onCheckedChange={(checked) =>
            createSubcategoryFormik.setFieldValue("status", checked)
          }
        />
      </div>
      <Button
        type="submit"
        className="btn btn-primary"
        disabled={createSubcategoryMutation.isLoading}
      >
        {createSubcategoryMutation.isLoading ? (
          <Loader className={"w-4 h-4 animate-spin"} />
        ) : (
          "Create"
        )}
      </Button>
    </form>
  );
};

export default CreateSubcategoryForm;
