import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

import { Button } from "@/components/ui/button.tsx";
import { useMutation } from "react-query";
import { queryClient } from "@/api/api.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { deleteDeleteProduct } from "@/api/api-products.ts";
import { toggleDeleteProductDialog } from "@/features/ui/ui-product-slice.ts";

const DeleteProductDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { deleteProductDialog } = useSelector(
    (state: RootState) => state.ui_product,
  );
  const { toast } = useToast();

  const deleteProductMutation = useMutation({
    mutationFn: deleteDeleteProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries("products");
      dispatch(toggleDeleteProductDialog({ product: null }));
      toast({
        title: "Product deleted.",
        description: new Date().toUTCString(),
      });
    },
    onError: async (error) => {
      await queryClient.invalidateQueries("products");
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        variant: "destructive",
        title: "Failed to delete product.",
        description: message,
      });
    },
  });

  const handleConfirm = () => {
    if (deleteProductDialog.product)
      deleteProductMutation.mutate(deleteProductDialog.product._id);
  };

  return (
    <Dialog
      open={deleteProductDialog.dialog}
      onOpenChange={() =>
        dispatch(toggleDeleteProductDialog({ product: null }))
      }
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the product "
            {deleteProductDialog.product && deleteProductDialog.product.name}
            "? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              dispatch(toggleDeleteProductDialog({ product: null }))
            }
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
