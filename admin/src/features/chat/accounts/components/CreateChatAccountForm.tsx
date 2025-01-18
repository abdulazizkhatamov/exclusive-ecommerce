import React from "react";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";

import { Button } from "@/components/ui/button.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import { queryClient } from "@/api/api.ts";

import * as Yup from "yup";
import { postCreateChatAccount } from "@/api/api-chat.ts";
import { Loader, Trash } from "lucide-react";

interface CreateChatAccountFormProps {
  setCreateAccountSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const createChatAccountValidation = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

const CreateChatAccountForm: React.FC<CreateChatAccountFormProps> = ({
  setCreateAccountSheet,
}) => {
  const { toast } = useToast();

  const createChatAccountMutation = useMutation(postCreateChatAccount);

  const createChatAccountFormik = useFormik({
    initialValues: {
      name: "",
      image: [],
    },
    validationSchema: createChatAccountValidation,
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();

      formData.append("name", values.name);

      // Append the image (file)
      values.image.forEach((file) => {
        formData.append("image", file);
      });

      createChatAccountMutation.mutate(
        { formData },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: ["chat-accounts"],
            });
            setCreateAccountSheet(false);
            toast({
              title: "Chat account created.",
              description: new Date().toUTCString(),
            });
            resetForm();
          },
          onError: async (error) => {
            await queryClient.invalidateQueries({
              queryKey: ["chat-accounts"],
            });
            const message =
              error instanceof Error ? error.message : "An error occurred";
            toast({
              variant: "destructive",
              title: "Failed to create chat account.",
              description: message,
            });
          },
        },
      );
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Reset the image array to only accept one image
      createChatAccountFormik.setFieldValue("image", [e.target.files[0]]);
    }

    // Reset the file input after an image is selected
    const fileInput = document.getElementById(
      "add-account-image-input",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // Reset the input's value to ensure re-triggering file selection works
    }
  };

  const handleRemoveImage = () => {
    // Remove the image at the specified index
    createChatAccountFormik.setFieldValue("image", []);
  };

  return (
    <form
      onSubmit={createChatAccountFormik.handleSubmit}
      className="grid gap-4 py-4"
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Name"
          onChange={createChatAccountFormik.handleChange}
          onBlur={createChatAccountFormik.handleBlur}
          value={createChatAccountFormik.values.name}
        />
        {createChatAccountFormik.errors.name &&
          createChatAccountFormik.touched.name && (
            <div className="text-red-500 text-sm">
              {createChatAccountFormik.errors.name}
            </div>
          )}
      </div>

      <div className="grid w-full space-y-1.5">
        <Label htmlFor="image">Image</Label>
        <div className="relative">
          {/* Custom Button */}
          <Button
            type="button"
            variant={"outline"}
            onClick={() =>
              document.getElementById("add-account-image-input")?.click()
            }
            className="w-full text-sm"
          >
            Choose Image
          </Button>

          {/* Hidden File Input */}
          <Input
            id="add-account-image-input"
            type="file"
            name="image"
            onChange={handleImageChange}
            className="absolute opacity-0 w-0 h-0"
            accept="image/*" // Optional: restrict file types to image only
          />
        </div>
        {createChatAccountFormik.touched.image &&
          createChatAccountFormik.errors.image && (
            <div className="text-red-500 text-sm">
              {createChatAccountFormik.errors.image}
            </div>
          )}
        <div className="flex gap-4 mt-4">
          {createChatAccountFormik.values.image &&
            createChatAccountFormik.values.image.length > 0 && (
              <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(
                    createChatAccountFormik.values.image[0],
                  )}
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

      <Button
        type="submit"
        className="btn btn-primary"
        disabled={createChatAccountMutation.isLoading}
      >
        {createChatAccountMutation.isLoading ? (
          <Loader className={"w-4 h-4 animate-spin"} />
        ) : (
          "Create"
        )}
      </Button>
    </form>
  );
};

export default CreateChatAccountForm;
