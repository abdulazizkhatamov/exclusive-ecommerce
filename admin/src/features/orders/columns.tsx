import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/custom/table/data-table-column-header.tsx";
import { Order, SUser } from "@/features/orders/data/schema-orders.ts";
import {
  orderStatuses,
  paymentStatuses,
} from "@/features/orders/data/data-orders.tsx";
import { DataTableRowActions } from "@/features/orders/data-table-row-actions.tsx";
import { Badge } from "@/components/ui/badge.tsx";

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} visibility={false} title="User" />
    ),
    cell: ({ row }) => {
      // Extract the user object
      const user = row.getValue("user") as SUser;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {user.email}
          </span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("paymentMethod") as string;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{value}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => {
      const paymentStatus = paymentStatuses.find(
        (status) => status.value === row.getValue("paymentStatus"),
      );

      if (!paymentStatus) {
        return null;
      }

      const paymentStatusStyles: {
        [key in (typeof paymentStatuses)[number]["value"]]: string;
      } = {
        Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        Completed: "bg-green-100 text-green-800 hover:bg-green-100",
        Failed: "bg-red-100 text-red-800 hover:bg-red-100",
      };

      return (
        <div className="flex w-[100px] items-center space-x-2">
          {/* Render the badge with dynamic styles */}
          <Badge
            className={`px-2 py-1 rounded-md ${paymentStatusStyles[paymentStatus.value]}`}
          >
            {paymentStatus.label}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Status" />
    ),
    cell: ({ row }) => {
      const orderStatus = orderStatuses.find(
        (status) => status.value === row.getValue("orderStatus"),
      );

      if (!orderStatus) {
        return null;
      }

      // Define styles for each status
      const statusStyles: Record<string, string> = {
        Placed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        Processing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        Shipped: "bg-purple-100 text-purple-800 hover:bg-purple-100",
        Delivered: "bg-green-100 text-green-800 hover:bg-green-100",
        Cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
      };

      return (
        <div className="flex w-[100px] items-center space-x-2">
          {/* Render the badge with dynamic styles */}
          <Badge
            className={`cursor-default rounded-md ${statusStyles[orderStatus.value]}`}
          >
            {orderStatus.label}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      // Safely access category.name, return "None" if category is null
      return <span>${amount}</span>;
    },
  },
  {
    id: "actions",
    cell: (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      { row }, // @ts-expect-error
    ) => <DataTableRowActions row={row} />,
  },
];
