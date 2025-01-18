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
import { Loader, Trash } from "lucide-react";
import { Product } from "@/features/products/data/schema-products.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { useMutation } from "react-query";
import { deleteDeleteProduct } from "@/api/api-products.ts";
import { queryClient } from "@/api/api.ts";

interface DeleteProductDialogProps {
  product: Product;
  deleteProductDialog: boolean;
  setDeleteProductDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  product,
  deleteProductDialog,
  setDeleteProductDialog,
}) => {
  const { toast } = useToast();

  const deleteProductMutation = useMutation({
    mutationFn: deleteDeleteProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries("products");
      setDeleteProductDialog(false);
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
    if (product) deleteProductMutation.mutate(product._id);
  };

  return (
    <Dialog open={deleteProductDialog} onOpenChange={setDeleteProductDialog}>
      <DialogTrigger asChild>
        <Button className={"h-7 w-7"} variant={"destructive"}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the product "
            {product && product.name}
            "? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteProductDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteProductMutation.isLoading}
          >
            {deleteProductMutation.isLoading ? (
              <Loader className={"w-4 h-4 animate-spin"} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
