import { Row } from "@tanstack/react-table";

import { variantSchema } from "@/features/variants/data/schema-variants.ts";
import { useState } from "react";
import DeleteVariantDialog from "@/features/variants/components/DeleteVariantDialog.tsx";
import UpdateVariantSheet from "@/features/variants/components/UpdateVariantSheet.tsx";
import { queryClient } from "@/api/api.ts";
import { IProduct } from "@/types/product.ts";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const variant = variantSchema.parse(row.original);
  const [updateVariantSheet, setUpdateVariantSheet] = useState(false);
  const [deleteVariantDialog, setDeleteVariantDialog] = useState(false);

  const product = queryClient.getQueryData(["product", variant.product._id]);

  return (
    <>
      <div className={"flex gap-2"}>
        <UpdateVariantSheet
          product={product as IProduct}
          variant={variant}
          updateVariantSheet={updateVariantSheet}
          setUpdateVariantSheet={setUpdateVariantSheet}
        />
        <DeleteVariantDialog
          variant={variant}
          deleteVariantDialog={deleteVariantDialog}
          setDeleteVariantDialog={setDeleteVariantDialog}
        />
      </div>
    </>
  );
}
