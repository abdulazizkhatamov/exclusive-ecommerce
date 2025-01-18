import React from "react";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";

import { Button } from "@/components/ui/button.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import { queryClient } from "@/api/api.ts";
import { postCreateMailAccount } from "@/api/api-mail.ts";

import * as Yup from "yup";

interface CreateMailAccountFormProps {
  setCreateAccountSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const createMailAccountValidation = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  key: Yup.string().required("Key is required"),
});

const CreateMailAccountForm: React.FC<CreateMailAccountFormProps> = ({
  setCreateAccountSheet,
}) => {
  const { toast } = useToast();

  const createMailAccountMutation = useMutation(postCreateMailAccount);

  const createMailAccountFormik = useFormik({
    initialValues: {
      name: "",
      key: "",
    },
    validationSchema: createMailAccountValidation,
    onSubmit: (values, { resetForm }) => {
      createMailAccountMutation.mutate(values, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["mail-accounts"],
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
            queryKey: ["mail-accounts"],
          });
          const message =
            error instanceof Error ? error.message : "An error occurred";
          toast({
            variant: "destructive",
            title: "Failed to create mail account.",
            description: message,
          });
        },
      });
    },
  });

  return (
    <form
      onSubmit={createMailAccountFormik.handleSubmit}
      className="grid gap-4 py-4"
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Name"
          onChange={createMailAccountFormik.handleChange}
          onBlur={createMailAccountFormik.handleBlur}
          value={createMailAccountFormik.values.name}
        />
        {createMailAccountFormik.errors.name && (
          <div className="text-red-500 text-sm">
            {createMailAccountFormik.errors.name}
          </div>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="key">Key</Label>
        <Input
          id="key"
          placeholder="Key"
          onChange={createMailAccountFormik.handleChange}
          onBlur={createMailAccountFormik.handleBlur}
          value={createMailAccountFormik.values.key}
        />
        {createMailAccountFormik.errors.key && (
          <div className="text-red-500 text-sm">
            {createMailAccountFormik.errors.key}
          </div>
        )}
      </div>
      <Button type="submit" className="btn btn-primary">
        Create
      </Button>
    </form>
  );
};

export default CreateMailAccountForm;
