import { Row } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import { categorySchema } from "@/components/custom/table/categories/data/schema-categories.ts";

import {
  toggleDeleteCategoryDialog,
  toggleUpdateCategorySheet,
} from "@/features/ui/ui-category-slice.ts";
import { useDispatch } from "react-redux";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const category = categorySchema.parse(row.original);
  const dispatch = useDispatch();

  return (
    <>
      <div className={"flex gap-2"}>
        <Button
          className={"h-7 w-7 "}
          variant={"outline"}
          onClick={() => {
            dispatch(toggleUpdateCategorySheet({ category: category }));
          }}
        >
          <Edit />
        </Button>
        <Button
          className={"h-7 w-7"}
          variant={"destructive"}
          onClick={() => {
            dispatch(toggleDeleteCategoryDialog({ category: category }));
          }}
        >
          <Trash />
        </Button>
      </div>
    </>
  );
}
