import { Row } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { productSchema } from "@/components/custom/table/products/data/schema-products.ts";
import { useDispatch } from "react-redux";
import { toggleDeleteProductDialog } from "@/features/ui/ui-product-slice.ts";
import { Link } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const product = productSchema.parse(row.original);
  const dispatch = useDispatch();

  return (
    <>
      <div className={"flex gap-2"}>
        <Link to={`/products/update/${product._id}`}>
          <Button className={"h-7 w-7 "} variant={"outline"} onClick={() => {}}>
            <Edit />
          </Button>
        </Link>
        <Button
          className={"h-7 w-7"}
          variant={"destructive"}
          onClick={() => {
            dispatch(toggleDeleteProductDialog({ product: product }));
          }}
        >
          <Trash />
        </Button>
      </div>
    </>
  );
}
