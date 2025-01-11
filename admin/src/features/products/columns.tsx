import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Product } from "@/features/products/data/schema-products.ts";
import { DataTableColumnHeader } from "@/components/custom/table/data-table-column-header.tsx";
import { DataTableRowActions } from "@/features/products/data-table-row-actions.tsx";
import { quantity } from "@/features/products/data/data-products.tsx";

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} visibility={false} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Link
            className={"hover:underline"}
            to={`/products/product/${row.getValue("_id")}`}
          >
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("name")}
            </span>
          </Link>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("description") as string;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {value.length < 30 ? value : `${value.slice(0, 30)}...`}
          </span>
        </div>
      );
    },
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
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => {
      const productQuantity = row.getValue("quantity") as number;
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
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category") as { name: string } | null;
      // Safely access category.name, return "None" if category is null
      return <span>{category?.name ?? ""}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
