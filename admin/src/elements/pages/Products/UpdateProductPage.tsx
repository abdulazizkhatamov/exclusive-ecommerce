import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "react-query";
import { getProduct, putUpdateProduct } from "@/api/api-products.ts";
import { getAllCategories } from "@/api/api-categories.ts";
import { queryClient } from "@/api/api.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Trash } from "lucide-react";
import { ICategory } from "@/types/category.ts";
import { IAttribute } from "@/types/product.ts";

const UpdateProductPage: React.FC = () => {
  // Form validation schema with Yup for the main form
  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    price: Yup.number()
      .min(0, "Price must be a positive number")
      .required("Base price is required"),
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { _id } = useParams<{ _id: string }>();

  const { data: categories } = useQuery<ICategory[]>({
    queryKey: ["all-categories"],
    queryFn: getAllCategories,
  });

  const { data: product } = useQuery(["product", _id], () => getProduct(_id!), {
    enabled: !!_id, // Only run the query if the _id is available
  });

  const mutation = useMutation({ mutationFn: putUpdateProduct });

  const [oldImages, setOldImages] = useState<string[]>([]); // Stores old image URLs
  const [newImages, setNewImages] = useState<File[]>([]); // Stores new files

  useEffect(() => {
    // Set old images when the sheet is opened
    if (product && product.images) {
      setOldImages(product.images || []);
    }
  }, [product]);

  // Formik setup for the form
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || "",
      description: product?.description || "",
      category: product?.category._id || "",
      price: product?.price || 0,
      attributes: product?.attributes || [],
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!_id) {
        toast({
          variant: "destructive",
          title: "Failed to update product.",
          description: "Product ID is missing",
        });
        return;
      }

      const updatedFormData = {
        ...values,
        oldImages,
        images: newImages, // Assuming newImages is already an array
      };

      const formData = new FormData();
      formData.append("name", updatedFormData.name);
      formData.append("description", updatedFormData.description);
      formData.append("category", updatedFormData.category);
      formData.append("price", updatedFormData.price.toString());

      updatedFormData.images.forEach((file) => {
        if (file instanceof File) formData.append("image", file);
      });

      updatedFormData.oldImages.forEach((image) => {
        formData.append("oldImages[]", image);
      });

      updatedFormData.attributes.forEach(
        (attribute: IAttribute, index: number) => {
          formData.append(`attributes[${index}]`, JSON.stringify(attribute));
        },
      );

      mutation.mutate(
        { _id, formData },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries("products");
            toast({
              title: "Product updated",
              description: new Date().toUTCString(),
            });
            resetForm();
            setOldImages([]);
            setNewImages([]);
            navigate("/products");
          },
          onError: async (error) => {
            const message =
              error instanceof Error ? error.message : "An error occurred";
            toast({
              variant: "destructive",
              title: "Failed to update product.",
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
      // Append new files to the newImages state (keep old images intact)
      setNewImages([...newImages, ...Array.from(e.target.files)]);

      // Reset the input field value after selection
      e.target.value = ""; // This allows re-selection of the same image
    }
  };

  const handleRemoveImage = (index: number, isOld: boolean) => {
    if (isOld) {
      // Remove old image from oldImages
      const updatedOldImages = oldImages.filter((_, i) => i !== index);
      setOldImages(updatedOldImages);
    } else {
      // Remove new image from newImages
      const updatedNewImages = newImages.filter((_, i) => i !== index);
      setNewImages(updatedNewImages);
    }
  };

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
      (_: IAttribute, i: number) => i !== index, // Type index as number
    );
    formik.setFieldValue("attributes", updatedAttributes);
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Update Product</CardTitle>
            <CardDescription>
              Edit the details below to update the product.
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
                        {typeof formik.errors.name === "string"
                          ? formik.errors.name
                          : "Error"}
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
                          {typeof formik.errors.description === "string"
                            ? formik.errors.description
                            : "Error"}
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
                        {typeof formik.errors.category === "string"
                          ? formik.errors.category
                          : "Error"}
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
                        {typeof formik.errors.price === "string"
                          ? formik.errors.price
                          : "Error"}
                      </div>
                    )}
                  </div>

                  {/* Image Upload and Preview */}
                  <div className="grid w-full space-y-1.5">
                    <Label htmlFor="image">Image</Label>
                    <div className="relative">
                      {/* Custom Button */}
                      <Button
                        type="button"
                        variant={"outline"}
                        onClick={() =>
                          document
                            .getElementById("update-product-image-input")
                            ?.click()
                        }
                        className="w-full text-sm"
                      >
                        Choose Image
                      </Button>

                      {/* Hidden File Input */}
                      <Input
                        id="update-product-image-input"
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="absolute opacity-0 w-0 h-0"
                        accept="image/*"
                      />
                    </div>
                    <div className="flex gap-4 mt-4">
                      {oldImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <img
                            src={`/${image}`}
                            alt="Image Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index, true)}
                            className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <Trash className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                      {newImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Image Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index, false)}
                            className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <Trash className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
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
                          {formik.values.attributes.map(
                            (attr: IAttribute, index: number) => (
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
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={"mt-7"}>
                <Button type="submit" className="w-full">
                  Update Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateProductPage;
