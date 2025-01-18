import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer.tsx";
import { getCurrentStep, statuses } from "@/features/orders/utils.ts";
import { IOrder } from "@/types/order.ts";
import { Loader } from "lucide-react";

interface UpdateStatusProps {
  order: IOrder;
  isDialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
  updateStatus: () => void;
  isUpdating: boolean;
}

const UpdateStatus: React.FC<UpdateStatusProps> = ({
  order,
  isDialogOpen,
  setDialogOpen,
  updateStatus,
  isUpdating,
}) => {
  const currentStep = getCurrentStep(order.orderStatus);

  const getNextStatusButtonText = () => {
    if (currentStep < statuses.length - 1) {
      return `Move to ${statuses[currentStep + 1]}`;
    }
    return "Order Completed";
  };

  return (
    <DrawerFooter className="flex justify-center gap-4 mt-6">
      {currentStep < statuses.length - 1 &&
        !["Placed"].includes(order.orderStatus) && (
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>{getNextStatusButtonText()}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update status</DialogTitle>
                <DialogDescription>
                  Are you sure you want to update the status of this order? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={updateStatus} disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader className={"w-4 h-4 animate-spin"} />
                  ) : (
                    "Update"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      <DrawerClose asChild>
        <Button variant="outline" className="text-gray-600 border-gray-300">
          Cancel
        </Button>
      </DrawerClose>
    </DrawerFooter>
  );
};

export default UpdateStatus;
