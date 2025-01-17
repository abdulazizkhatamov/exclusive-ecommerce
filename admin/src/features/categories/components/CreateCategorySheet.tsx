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

import CreateCategoryForm from "@/features/categories/components/CreateCategoryForm.tsx";

interface CreateCategorySheetProps {
  createCategorySheet: boolean;
  setCreateCategorySheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateCategorySheet: React.FC<CreateCategorySheetProps> = ({
  createCategorySheet,
  setCreateCategorySheet,
}) => {
  return (
    <Sheet
      open={createCategorySheet}
      onOpenChange={() => setCreateCategorySheet(!createCategorySheet)}
    >
      <SheetTrigger asChild>
        <Button
          className={"ml-auto h-8 lg:flex"}
          onClick={() => setCreateCategorySheet(!createCategorySheet)}
        >
          Create category
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a New Category</SheetTitle>
          <SheetDescription>
            Set up a new category for your store’s products.
          </SheetDescription>
        </SheetHeader>
        <CreateCategoryForm setCreateCategorySheet={setCreateCategorySheet} />
      </SheetContent>
    </Sheet>
  );
};

export default CreateCategorySheet;
