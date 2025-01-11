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
import CreateSubcategoryForm from "@/features/subcategories/components/CreateSubcategoryForm.tsx";

interface CreateSubcategorySheetProps {
  createSheet: boolean;
  setCreateSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateSubcategorySheet: React.FC<CreateSubcategorySheetProps> = ({
  createSheet,
  setCreateSheet,
}) => {
  return (
    <Sheet open={createSheet} onOpenChange={() => setCreateSheet(!createSheet)}>
      <SheetTrigger asChild>
        <Button className={"ml-auto h-8 lg:flex"}>Create subcategory</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a New Subcategory</SheetTitle>
          <SheetDescription>
            Set up a new subcategory for your store’s products.
          </SheetDescription>
        </SheetHeader>
        <CreateSubcategoryForm setCreateSheet={setCreateSheet} />
      </SheetContent>
    </Sheet>
  );
};

export default CreateSubcategorySheet;
