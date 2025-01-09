import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Variant } from "@/components/custom/table/variants/data/schema-variants.ts";
import { DataTableColumnHeader } from "@/components/custom/table/variants/data-table-column-header.tsx";
import { quantity } from "@/components/custom/table/variants/data/data-variants.tsx";
import { DataTableRowActions } from "@/components/custom/table/variants/data-table-row-actions.tsx";

export const columns: ColumnDef<Variant>[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => (
      <div className="max-w-max w-full">
        {(() => {
          const value = row.getValue("_id") as string;
          const firstFour = value.slice(0, 7);
          const lastFour = value.slice(-4);
          return `${firstFour}.....${lastFour}`;
        })()}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} visibility={false} title="SKU" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Link
            className={"hover:underline"}
            to={`/variants/variant/${row.getValue("_id")}`}
          >
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("sku")}
            </span>
          </Link>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <span>${price.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const productQuantity = row.getValue("stock") as number;
      const status = productQuantity > 0 ? quantity[0] : quantity[1];
      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const productQuantity = row.getValue(id) as number;
      if (value.includes("available")) {
        return productQuantity > 0;
      }
      if (value.includes("not_available")) {
        return productQuantity === 0;
      }
      return true;
    },
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const product = row.getValue("product") as { name: string } | null;
      // Safely access product.name, return "None" if product is null
      return <span>{product?.name ?? ""}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
