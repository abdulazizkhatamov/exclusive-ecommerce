import { Row } from "@tanstack/react-table";

import { categorySchema } from "@/features/subcategories/data/schema-subcategories.ts";
import DeleteSubcategoryDelete from "@/features/subcategories/components/DeleteSubcategoryDialog.tsx";
import { useState } from "react";
import UpdateSubcategorySheet from "@/features/subcategories/components/UpdateSubcategorySheet.tsx";
import { useLocation } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const category = categorySchema.parse(row.original);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [updateSheet, setUpdateSheet] = useState(false);

  const location = useLocation();

  return (
    <>
      <div className={"flex gap-2"}>
        <UpdateSubcategorySheet
          parent={
            !location.pathname.includes("categories/subcategories")
              ? category.parent
              : null
          }
          category={category}
          updateSheet={updateSheet}
          setUpdateSheet={setUpdateSheet}
        />
        <DeleteSubcategoryDelete
          category={category}
          deleteDialog={deleteDialog}
          setDeleteDialog={setDeleteDialog}
        />
      </div>
    </>
  );
}
