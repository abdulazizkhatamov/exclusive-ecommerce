import React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { FormikProps } from "formik";
import { Edit, Loader } from "lucide-react";

interface CategoryFormValues {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  parent: string | null;
}

interface UpdateCategoryProps {
  open: boolean;
  onOpenChange: () => void;
  isUpdating: boolean;
  formik: FormikProps<CategoryFormValues>;
}

export const UpdateCategorySheet: React.FC<UpdateCategoryProps> = ({
  open,
  onOpenChange,
  isUpdating,
  formik,
}) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetTrigger asChild>
      <Button className="h-7 w-7" variant="outline">
        <Edit />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Update a category</SheetTitle>
        <SheetDescription>
          Update your category for your store’s products.
        </SheetDescription>
      </SheetHeader>
      <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
        <Input type="hidden" id="_id" value={formik.values._id} />
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.errors.name && (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          )}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />
          {formik.errors.description && (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          )}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Switch
            id="status"
            checked={formik.values.status}
            onCheckedChange={(checked) =>
              formik.setFieldValue("status", checked)
            }
          />
        </div>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? (
            <Loader className={"h-4 w-4 animate-spin"} />
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </SheetContent>
  </Sheet>
);
