import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { IAttribute, IProduct } from "@/types/product.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast.ts";
import { useMutation } from "react-query";
import { putUpdateVariant } from "@/api/api-variants.ts";
import { useFormik } from "formik";
import { queryClient } from "@/api/api.ts";
import { Variant } from "@/features/variants/data/schema-variants.ts";
import * as Yup from "yup";

interface UpdateVariantFormProps {
  product: IProduct;
  variant: Variant;
  setUpdateVariantSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const variantValidationSchema = Yup.object().shape({
  sku: Yup.string().required("SKU is required"),
  price: Yup.number().required("Price is required"),
  stock: Yup.number().required("Stock is required"),
});

const UpdateVariantForm: React.FC<UpdateVariantFormProps> = ({
  product,
  variant,
  setUpdateVariantSheet,
}) => {
  const { toast } = useToast();

  const updateVariantMutation = useMutation(putUpdateVariant);

  const [oldImages, setOldImages] = useState<string[]>([]); // Stores old image URLs
  const [newImages, setNewImages] = useState<File[]>([]); // Stores new files

  useEffect(() => {
    // Set old images when the sheet is opened
    if (variant?.images) {
      setOldImages(variant.images);
    }
  }, [variant]);

  const updateVariantFormik = useFormik({
    initialValues: {
      sku: variant?.sku || "",
      product: product._id,
      attributes: product.attributes.map((attribute) => ({
        name: attribute.name,
        value: attribute.value.length > 0 ? attribute.value[0] : "",
      })),
      price: variant?.price || 0,
      stock: variant?.stock || 0,
    },
    validationSchema: variantValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const updatedFormData = {
        ...values,
        oldImages,
        images: newImages, // Assuming newImages is already an array
      };

      updateVariantMutation.mutate(
        {
          id: variant?._id || "",
          formData: updatedFormData,
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries("variants");
            setUpdateVariantSheet(false);
            toast({
              title: "Variant updated",
              description: new Date().toUTCString(),
            });
            resetForm();
            setOldImages([]);
            setNewImages([]);
          },
          onError: async (error) => {
            await queryClient.invalidateQueries("variants");
            const message =
              error instanceof Error ? error.message : "An error occurred";
            toast({
              variant: "destructive",
              title: "Failed to update variant.",
              description: message,
            });
          },
        },
      );
    },
  });

  useEffect(() => {
    // Set old images when the sheet is opened
    if (variant) {
      updateVariantFormik.setFieldValue("sku", variant.sku);
      updateVariantFormik.setFieldValue("price", variant.price);
      updateVariantFormik.setFieldValue("stock", variant.stock);
    }
  }, [variant]);

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

  const getFileName = (filePath: string) => {
    // Normalize path to always use forward slash, then remove everything before the last '/'
    const normalizedPath = filePath.replace(/\\/g, "/");
    return normalizedPath.split("/").pop() || filePath; // Extract the filename from the path
  };

  return (
    <form
      onSubmit={updateVariantFormik.handleSubmit}
      className="grid gap-4 py-4"
      encType={"multipart/form-data"}
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          placeholder="SKU"
          onBlur={updateVariantFormik.handleBlur}
          onChange={updateVariantFormik.handleChange}
          value={updateVariantFormik.values.sku}
          autoComplete={"off"}
        />
        {updateVariantFormik.touched.sku && updateVariantFormik.errors.sku && (
          <div className="text-red-500 text-sm">
            {updateVariantFormik.errors.sku}
          </div>
        )}
      </div>

      {product.attributes.map((attribute: IAttribute, index) => (
        <div key={index} className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={attribute.name}>{attribute.name}</Label>

          <Select
            value={
              updateVariantFormik.values.attributes.find(
                (attr) => attr.name === attribute.name,
              )?.value || ""
            }
            onValueChange={(value: string) => {
              updateVariantFormik.setFieldValue(
                `attributes.${product.attributes.findIndex(
                  (attr) => attr.name === attribute.name,
                )}.value`,
                value,
              );
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${attribute.name}`} />
            </SelectTrigger>
            <SelectContent>
              {attribute.value.map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="price">Price</Label>
        <Input
          type={"number"}
          id="price"
          placeholder="Price"
          onChange={updateVariantFormik.handleChange}
          value={updateVariantFormik.values.price}
        />
        {updateVariantFormik.errors.price && (
          <div className="text-red-500 text-sm">
            {updateVariantFormik.errors.price}
          </div>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="stock">Stock quantity</Label>
        <Input
          type={"number"}
          id="stock"
          placeholder="Stock quantity"
          onChange={updateVariantFormik.handleChange}
          value={updateVariantFormik.values.stock}
        />
        {updateVariantFormik.errors.stock && (
          <div className="text-red-500 text-sm">
            {updateVariantFormik.errors.stock}
          </div>
        )}
      </div>
      {/* SKU, price, stock, and attributes fields here */}

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="images">Images</Label>
        <div className="relative">
          <Button
            type="button"
            variant={"outline"}
            onClick={() =>
              document.getElementById("update-variant-images-input")?.click()
            }
            className="w-full text-sm"
          >
            Choose Images
          </Button>
          <Input
            id="update-variant-images-input"
            type="file"
            multiple
            name="baseImages"
            onChange={handleImageChange}
            className="absolute opacity-0 w-0 h-0"
          />
        </div>

        <div className="flex-row gap-4 mt-4">
          {/* Display old images */}
          {oldImages.map((image, index) => (
            <div
              key={index}
              className="relative my-2 items-center w-full max-w-full border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className={"flex items-center gap-2"}>
                <div className="relative w-12 h-12">
                  <img
                    src={`/${image}`} // Old image URL
                    alt={`Old Image Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 text-xs">{getFileName(image)}</div>
                {/* Display old image file name */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, true)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}

          {/* Display new images */}
          {newImages.map((image, index) => (
            <div
              key={index}
              className="relative my-2 items-center w-full max-w-full border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className={"flex items-center gap-2"}>
                <div className="relative w-12 h-12">
                  <img
                    src={URL.createObjectURL(image)} // New image Blob URL
                    alt={`New Image Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 text-xs">{image.name}</div>
                {/* Display new image file name */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, false)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" className="btn btn-primary">
        Update
      </Button>
    </form>
  );
};

export default UpdateVariantForm;
