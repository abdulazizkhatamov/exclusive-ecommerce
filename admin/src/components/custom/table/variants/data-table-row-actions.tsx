import { Row } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useDispatch } from "react-redux";
import { variantSchema } from "@/components/custom/table/variants/data/schema-variants.ts";
import {
  toggleDeleteVariantDialog,
  toggleUpdateVariantSheet,
} from "@/features/ui/ui-variant-slice.ts";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const variant = variantSchema.parse(row.original);
  const dispatch = useDispatch();

  return (
    <>
      <div className={"flex gap-2"}>
        <Button
          className={"h-7 w-7 "}
          variant={"outline"}
          onClick={() => {
            dispatch(toggleUpdateVariantSheet({ variant }));
          }}
        >
          <Edit />
        </Button>
        <Button
          className={"h-7 w-7"}
          variant={"destructive"}
          onClick={() => {
            dispatch(toggleDeleteVariantDialog({ variant }));
          }}
        >
          <Trash />
        </Button>
      </div>
    </>
  );
}
