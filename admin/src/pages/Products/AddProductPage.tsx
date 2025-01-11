import React, { useState } from "react";
import { Button } from "@/components/ui/button.tsx"; // Assuming you're using ShadCN's Button
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "react-query";
import { postCreateProduct } from "@/api/api-products.ts";
import { getAllCategories } from "@/api/api-categories.ts";
import { queryClient } from "@/api/api.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";
import { IAttribute } from "@/types/product.ts";
import { ICategory } from "@/types/category.ts";

const AddProductPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: categories } = useQuery<ICategory[]>({
    queryKey: ["all-categories"],
    queryFn: getAllCategories,
  });

  // Form validation schema with Yup for main form
  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    price: Yup.number()
      .min(0, "Price must be a positive number")
      .required("Base price is required"),

    image: Yup.array()
      .min(1, "At least one image is required")
      .max(1, "You can only upload one image")
      .required("Image is required"),
  });

  const mutation = useMutation({
    mutationFn: postCreateProduct,
  });

  // Formik setup for main form
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      image: [],
      attributes: [] as IAttribute[],
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // FormData for the file upload (image)
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("price", values.price.toString());

      // Append the image (file)
      values.image.forEach((file) => {
        formData.append("image", file);
      });

      // Append attributes (stringified if needed)
      values.attributes.forEach((attribute, index) => {
        formData.append(`attributes[${index}]`, JSON.stringify(attribute));
      });

      // Now call the mutation with the product data and the FormData for image upload
      mutation.mutate(
        { formData },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries("products");
            toast({
              title: "Product created",
              description: new Date().toUTCString(),
            });
            resetForm();
            navigate("/products");
          },
          onError: async (error) => {
            await queryClient.invalidateQueries("products");
            const message =
              error instanceof Error ? error.message : "An error occurred";
            toast({
              variant: "destructive",
              title: "Failed to create product.",
              description: message,
            });
          },
        },
      );
    },
  });
  // Local state for managing attribute name and values inputs
  const [attributeName, setAttributeName] = useState("");
  const [attributeValues, setAttributeValues] = useState("");
  const [attributeErrors, setAttributeErrors] = useState<{
    name: string;
    value: string;
  }>({
    name: "",
    value: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Reset the image array to only accept one image
      formik.setFieldValue("image", [e.target.files[0]]);
    }

    // Reset the file input after an image is selected
    const fileInput = document.getElementById(
      "add-product-image-input",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // Reset the input's value to ensure re-triggering file selection works
    }
  };

  const handleRemoveImage = () => {
    // Remove the image at the specified index
    formik.setFieldValue("image", []);
  };

  // Handle adding custom attribute with validation
  const handleAddAttribute = () => {
    const trimmedName = attributeName.trim();
    const trimmedValues = attributeValues
      .split(",")
      .map((value) => value.trim()) // Trim spaces from each value
      .filter((value) => value !== ""); // Remove empty values

    // Validate attribute name and values
    if (!trimmedName) {
      setAttributeErrors((prev) => ({
        ...prev,
        name: "Attribute name is required",
      }));
    } else {
      setAttributeErrors((prev) => ({ ...prev, name: "" }));
    }

    if (trimmedValues.length === 0) {
      setAttributeErrors((prev) => ({
        ...prev,
        value: "Each value must be non-empty",
      }));
    } else {
      setAttributeErrors((prev) => ({ ...prev, value: "" }));
    }

    // If both fields are valid, add to Formik state
    if (
      trimmedName &&
      trimmedValues.length > 0 &&
      !attributeErrors.name &&
      !attributeErrors.value
    ) {
      formik.setFieldValue("attributes", [
        ...formik.values.attributes,
        { name: trimmedName, value: trimmedValues },
      ]);
      setAttributeName(""); // Clear the input after adding
      setAttributeValues(""); // Clear the values input after adding
    }
  };
  const handleRemoveAttribute = (index: number) => {
    // Filter out the attribute at the given index
    const updatedAttributes = formik.values.attributes.filter(
      (_, i) => i !== index,
    );
    formik.setFieldValue("attributes", updatedAttributes);
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Product</CardTitle>
            <CardDescription>
              Fill the details below to create a new product.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={formik.handleSubmit}
              encType={"multipart/form-data"}
            >
              <div className="w-full grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                <div className="space-y-6">
                  {/* Product Name */}
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Name of your product"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="p-3 rounded-lg border border-gray-300"
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.name}
                      </div>
                    )}
                  </div>

                  {/* Product Description */}
                  <div className="grid w-full space-y-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      placeholder="Type your description here."
                      id="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="p-3 rounded-lg border border-gray-300"
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.description}
                        </div>
                      )}
                  </div>

                  {/* Category Selection */}
                  <div className="grid w-full space-y-1.5">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formik.values.category}
                      onValueChange={(value) =>
                        formik.setFieldValue("category", value)
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {categories &&
                          categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.category}
                      </div>
                    )}
                  </div>

                  {/* Base Price Input */}
                  <div className="grid w-full space-y-1.5">
                    <Label htmlFor="price">Base Price</Label>
                    <Input
                      type="number"
                      id="price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="p-3 rounded-lg border border-gray-300"
                      placeholder="Enter base price"
                    />
                    {formik.touched.price && formik.errors.price && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.price}
                      </div>
                    )}
                  </div>

                  {/* Multiple Base image with Previews */}
                  <div className="grid w-full space-y-1.5">
                    <Label htmlFor="image">Image</Label>
                    <div className="relative">
                      {/* Custom Button */}
                      <Button
                        type="button"
                        variant={"outline"}
                        onClick={() =>
                          document
                            .getElementById("add-product-image-input")
                            ?.click()
                        }
                        className="w-full text-sm"
                      >
                        Choose Image
                      </Button>

                      {/* Hidden File Input */}
                      <Input
                        id="add-product-image-input"
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="absolute opacity-0 w-0 h-0"
                        accept="image/*" // Optional: restrict file types to image only
                      />
                    </div>
                    {formik.touched.image && formik.errors.image && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.image}
                      </div>
                    )}
                    <div className="flex gap-4 mt-4">
                      {formik.values.image &&
                        formik.values.image.length > 0 && (
                          <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(formik.values.image[0])}
                              alt="Image Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <Trash className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Custom Attribute Input */}
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="attributes">Attributes</Label>
                    <div className="space-y-2">
                      <Input
                        id="attributeName"
                        placeholder="Attribute name (e.g. Color)"
                        value={attributeName}
                        onChange={(e) => setAttributeName(e.target.value)}
                        className="p-3 rounded-lg border border-gray-300"
                      />
                      {attributeErrors.name && (
                        <div className="text-red-500 text-sm">
                          {attributeErrors.name}
                        </div>
                      )}
                      <Input
                        id="attributeValues"
                        placeholder="Comma-separated values (e.g. Red, Blue, Black)"
                        value={attributeValues}
                        onChange={(e) => setAttributeValues(e.target.value)}
                        className="p-3 rounded-lg border border-gray-300"
                      />
                      {attributeErrors.value && (
                        <div className="text-red-500 text-sm">
                          {attributeErrors.value}
                        </div>
                      )}
                      <Button type="button" onClick={handleAddAttribute}>
                        Add Attribute
                      </Button>
                    </div>

                    {formik.values.attributes.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-bold">Attributes:</h3>
                        <ul>
                          {formik.values.attributes.map((attr, index) => (
                            <li
                              key={index}
                              className="mt-2 flex items-center justify-between"
                            >
                              <div>
                                <strong>{attr.name}:</strong>{" "}
                                {attr.value.join(", ")}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveAttribute(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={"mt-7"}>
                <Button type="submit" className="w-full">
                  Create Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProductPage;
