import React from "react";
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
import { postCreateVariant } from "@/api/api-variants.ts";
import { useFormik } from "formik";
import { queryClient } from "@/api/api.ts";
import * as Yup from "yup";

interface CreateVariantFormProps {
  product: IProduct;
}

const variantValidationSchema = Yup.object().shape({
  sku: Yup.string().required("SKU is required"),
  price: Yup.number().required("Price is required"),
  stock: Yup.number().required("Stock is required"),
  images: Yup.array(Yup.string()).required("At least one image is required"),
});

const CreateVariantForm: React.FC<CreateVariantFormProps> = ({ product }) => {
  const { toast } = useToast();

  const createVariantMutation = useMutation(postCreateVariant);

  const createVariantFormik = useFormik({
    initialValues: {
      sku: "",
      product: product._id,
      attributes: product.attributes.map((attribute) => ({
        name: attribute.name,
        value: attribute.value.length > 0 ? attribute.value[0] : "", // Set the first value as default or empty string if no values
      })),
      price: 0,
      stock: 0,
      images: [],
    },
    validationSchema: variantValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();

      // Append all form fields except for 'baseImages' to formData
      formData.append("sku", values.sku);
      formData.append("product", values.product);
      formData.append("price", values.price.toString());
      formData.append("stock", values.stock.toString());

      // Append 'baseImages' (multiple files)
      values.images.forEach((file) => {
        formData.append("images", file); // "images" is the key for multer
      });

      console.log(values.attributes);

      // Append 'attributes' as a single JSON string
      formData.append("attributes", JSON.stringify(values.attributes));

      createVariantMutation.mutate(formData, {
        onSuccess: async () => {
          await queryClient.invalidateQueries("variants");
          toast({
            title: "Variant created",
            description: new Date().toUTCString(),
          });
          resetForm();
        },
        onError: async (error) => {
          await queryClient.invalidateQueries("variants");
          const message =
            error instanceof Error ? error.message : "An error occurred";
          toast({
            variant: "destructive",
            title: "Failed to create variant.",
            description: message,
          });
        },
      });
    },
  });

  // Handle multiple image file selection and update Formik state
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      createVariantFormik.setFieldValue("images", [
        ...createVariantFormik.values.images,
        ...Array.from(e.target.files),
      ]);
    }
  };

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    const updatedImages = createVariantFormik.values.images.filter(
      (_, i) => i !== index,
    );
    createVariantFormik.setFieldValue("images", updatedImages);
  };

  return (
    <form
      onSubmit={createVariantFormik.handleSubmit}
      className="grid gap-4 py-4"
      encType={"multipart/form-data"}
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          placeholder="SKU"
          onBlur={createVariantFormik.handleBlur}
          onChange={createVariantFormik.handleChange}
          value={createVariantFormik.values.sku}
          autoComplete={"off"}
        />
        {createVariantFormik.touched.sku && createVariantFormik.errors.sku && (
          <div className="text-red-500 text-sm">
            {createVariantFormik.errors.sku}
          </div>
        )}
      </div>

      {product.attributes.map((attribute: IAttribute, index) => (
        <div key={index} className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={attribute.name}>{attribute.name}</Label>

          <Select
            value={
              createVariantFormik.values.attributes.find(
                (attr) => attr.name === attribute.name,
              )?.value || "" // Use an empty string if no value is selected
            }
            onValueChange={(value: string) => {
              createVariantFormik.setFieldValue(
                `attributes.${product.attributes.findIndex(
                  (attr) => attr.name === attribute.name,
                )}.value`,
                value, // Directly set the value as a string
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
          onChange={createVariantFormik.handleChange}
          value={createVariantFormik.values.price}
        />
        {createVariantFormik.errors.price && (
          <div className="text-red-500 text-sm">
            {createVariantFormik.errors.price}
          </div>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="stock">Stock quantity</Label>
        <Input
          type={"number"}
          id="stock"
          placeholder="Stock quantity"
          onChange={createVariantFormik.handleChange}
          value={createVariantFormik.values.stock}
        />
        {createVariantFormik.errors.stock && (
          <div className="text-red-500 text-sm">
            {createVariantFormik.errors.stock}
          </div>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="images">Images</Label>
        <div className="relative">
          {/* Custom Button */}
          <Button
            type="button"
            variant={"outline"}
            onClick={() =>
              document.getElementById("add-variant-images-input")?.click()
            }
            className="w-full text-sm"
          >
            Choose Images
          </Button>

          {/* Hidden File Input */}
          <Input
            id="add-variant-images-input"
            type="file"
            multiple
            name="baseImages"
            onChange={handleImageChange}
            className="absolute opacity-0 w-0 h-0" // Hide the input field
          />
        </div>
        {createVariantFormik.touched.images &&
          createVariantFormik.errors.images && (
            <div className="text-red-500 text-sm">
              {createVariantFormik.errors.images}
            </div>
          )}
        <div className="flex-row gap-4 mt-4">
          {createVariantFormik.values.images.map((image, index) => (
            <div
              key={index}
              className="relative my-2 items-center w-full max-w-full border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className={"flex items-center gap-2"}>
                <div className="relative w-12 h-12">
                  <img
                    src={URL.createObjectURL(image as Blob)}
                    alt={`Image Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">
                    {(image as File).name}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Trash className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" className="btn btn-primary">
        Create
      </Button>
    </form>
  );
};

export default CreateVariantForm;
