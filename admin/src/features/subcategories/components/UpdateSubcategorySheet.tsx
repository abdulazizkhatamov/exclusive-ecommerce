import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Category } from "@/features/categories/data/schema-categories.ts";
import UpdateSubcategoryForm from "@/features/subcategories/components/UpdateSubcategoryForm.tsx";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

interface UpdateSubcategorySheetProps {
  parent: string | null | undefined;
  category: Category;
  updateSheet: boolean;
  setUpdateSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateSubcategorySheet: React.FC<UpdateSubcategorySheetProps> = ({
  parent,
  category,
  updateSheet,
  setUpdateSheet,
}) => {
  return (
    <Sheet open={updateSheet} onOpenChange={setUpdateSheet}>
      <SheetTrigger asChild>
        <Button className={"h-7 w-7"} variant={"outline"}>
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
        <UpdateSubcategoryForm
          parent={parent}
          category={category}
          setUpdateSheet={setUpdateSheet}
        />
      </SheetContent>
    </Sheet>
  );
};

export default UpdateSubcategorySheet;
