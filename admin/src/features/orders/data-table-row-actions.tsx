import { Row } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer.tsx";

import { Button } from "@/components/ui/button.tsx";
import { getCurrentStep, statuses } from "@/features/orders/utils.ts";
import { IOrder } from "@/types/order.ts";
import { useMutation } from "react-query";
import { putUpdateOrder } from "@/api/api-orders.ts";
import { queryClient } from "@/api/api.ts";
import { useState } from "react";
import ProductList from "@/features/orders/components/ProductList.tsx";
import OrderWorkflow from "@/features/orders/components/OrderWorkflow.tsx";
import OrderTimeline from "@/features/orders/components/OrderTimeline.tsx";
import UpdateStatus from "@/features/orders/components/UpdateStatus.tsx";
import OrderDetails from "@/features/orders/components/OrderDetails.tsx";

interface DataTableRowActionsProps {
  row: Row<IOrder>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const order = row.original;

  const mutation = useMutation({ mutationFn: putUpdateOrder });

  const currentStep = getCurrentStep(order.orderStatus);

  const updateStatus = () => {
    if (currentStep < statuses.length - 1) {
      const nextStatus = statuses[currentStep + 1];
      mutation.mutate(
        { _id: order._id, status: nextStatus },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries("orders");
            setDialogOpen(false); // Close the dialog after mutation succeeds
          },
        },
      );
    }
  };

  return (
    <div className="flex gap-4 font-inter">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="text-gray-600" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-full h-full mx-auto">
          <div className="overflow-y-auto p-6">
            <div className="mb-8">
              <DrawerTitle className="text-2xl font-semibold text-gray-800">
                Order Details
              </DrawerTitle>
              <DrawerDescription className="text-sm text-gray-600">
                View and manage the details of the order.
              </DrawerDescription>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              {/* Left Column - Order Details */}
              <div>
                <OrderDetails order={order} />
                {/* Products */}
                <ProductList products={order.products} />
              </div>

              {/* Right Column - Order Status */}
              <div>
                <OrderWorkflow />

                {/* Order Timeline */}
                <OrderTimeline order={order} />

                {/* Drawer Footer */}
                <UpdateStatus
                  order={order}
                  isDialogOpen={isDialogOpen}
                  setDialogOpen={setDialogOpen}
                  updateStatus={updateStatus}
                />
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
