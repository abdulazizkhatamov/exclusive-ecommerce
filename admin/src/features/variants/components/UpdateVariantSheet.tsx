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
import { Edit } from "lucide-react";
import { Variant } from "@/features/variants/data/schema-variants.ts";
import UpdateVariantForm from "@/features/variants/components/UpdateVariantForm.tsx";
import { IProduct } from "@/types/product.ts";

interface UpdateVariantSheetProps {
  product: IProduct;
  variant: Variant;
  updateVariantSheet: boolean;
  setUpdateVariantSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateVariantSheet: React.FC<UpdateVariantSheetProps> = ({
  product,
  variant,
  updateVariantSheet,
  setUpdateVariantSheet,
}) => {
  return (
    <Sheet open={updateVariantSheet} onOpenChange={setUpdateVariantSheet}>
      <SheetTrigger asChild>
        <Button className={"h-7 w-7 "} variant={"outline"}>
          <Edit />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update Variant</SheetTitle>
          <SheetDescription>
            Edit the details for this variant.
          </SheetDescription>
        </SheetHeader>
        <UpdateVariantForm
          product={product}
          variant={variant}
          setUpdateVariantSheet={setUpdateVariantSheet}
        />
      </SheetContent>
    </Sheet>
  );
};

export default UpdateVariantSheet;
