import { Row } from "@tanstack/react-table";
import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { productSchema } from "@/features/products/data/schema-products.ts";
import { Link } from "react-router-dom";
import DeleteProductDialog from "@/features/products/components/DeleteProductDialog.tsx";
import { useState } from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const product = productSchema.parse(row.original);

  const [deleteProductDialog, setDeleteProductDialog] = useState(false);

  return (
    <>
      <div className={"flex gap-2"}>
        <Link to={`/products/update/${product._id}`}>
          <Button className={"h-7 w-7"} variant={"outline"} onClick={() => {}}>
            <Edit />
          </Button>
        </Link>
        <DeleteProductDialog
          deleteProductDialog={deleteProductDialog}
          setDeleteProductDialog={setDeleteProductDialog}
          product={product}
        />
      </div>
    </>
  );
}
