import React from "react";
import PrimaryInput from "@/components/custom/PrimaryInput.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IAddress } from "@/types/user.ts";

const addressValidationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  street: Yup.string().required("Street address is required"),
  apartment: Yup.string().nullable().notRequired(),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  postalCode: Yup.string().required("Postal code is required"),
  phone: Yup.string().required("Phone number is required"),
});

interface AddressFormProps {
  onSubmit: (values: IAddress) => void;
  isLoading: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, isLoading }) => {
  const addressFormik = useFormik({
    initialValues: {
      _id: "",
      fullName: "",
      street: "",
      apartment: "",
      state: "",
      city: "",
      postalCode: "",
      phone: "",
    },
    validationSchema: addressValidationSchema,
    onSubmit: onSubmit,
  });

  const fields = {
    fullName: "Full Name*",
    street: "Street Address*",
    apartment: "Apartment, floor, etc. (optional)",
    state: "State*",
    city: "Town/City*",
    postalCode: "Postal Code*",
    phone: "Phone Number*",
  };

  return (
    <form className="space-y-4" onSubmit={addressFormik.handleSubmit}>
      {Object.entries(fields).map(([field, label]) => (
        <div key={field}>
          <label htmlFor={field} className="block text-sm mb-2">
            {label}
          </label>
          <PrimaryInput
            id={field}
            type="text"
            className="w-full p-3"
            {...addressFormik.getFieldProps(field)}
          />
          {addressFormik.touched[field as keyof typeof addressFormik.values] &&
            addressFormik.errors[
              field as keyof typeof addressFormik.errors
            ] && (
              <div className="text-red-500 text-sm">
                {
                  addressFormik.errors[
                    field as keyof typeof addressFormik.errors
                  ]
                }
              </div>
            )}
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          className="max-w-max w-full rounded py-5 px-10 bg-red-500 hover:bg-red-600 mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Address"}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
