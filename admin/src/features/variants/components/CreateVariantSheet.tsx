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
import CreateVariantForm from "@/features/variants/components/CreateVariantForm.tsx";
import { IProduct } from "@/types/product.ts";

interface CreateVariantSheetProps {
  product: IProduct;
  createVariantSheet: boolean;
  setCreateVariantSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateVariantSheet: React.FC<CreateVariantSheetProps> = ({
  product,
  createVariantSheet,
  setCreateVariantSheet,
}) => {
  return (
    <Sheet open={createVariantSheet} onOpenChange={setCreateVariantSheet}>
      <SheetTrigger asChild>
        <Button className={"ml-auto h-8 lg:flex"}>Add variants</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a New Variant</SheetTitle>
          <SheetDescription>
            Set up a new variant for your product.
          </SheetDescription>
        </SheetHeader>
        <CreateVariantForm product={product} />
      </SheetContent>
    </Sheet>
  );
};

export default CreateVariantSheet;
