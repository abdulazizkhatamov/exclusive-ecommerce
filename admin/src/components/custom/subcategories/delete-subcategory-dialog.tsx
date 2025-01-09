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
import { deleteDeleteCategory } from "@/api/api-categories.ts";
import { toggleDeleteCategoryDialog } from "@/features/ui/ui-category-slice.ts";

interface DeleteDeleteSubcategoryDialogProps {
  parent?: string;
}

const DeleteSubcategoryDialog: React.FC<DeleteDeleteSubcategoryDialogProps> = ({
  parent,
}) => {
  const dispatch = useDispatch();
  const { deleteCategoryDialog } = useSelector(
    (state: RootState) => state.ui_category,
  );
  const { toast } = useToast();

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteDeleteCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["subcategories", parent],
      });
      dispatch(toggleDeleteCategoryDialog({ category: null }));
      toast({
        title: "Subcategory deleted.",
        description: new Date().toUTCString(),
      });
    },
    onError: async (error) => {
      await queryClient.invalidateQueries({
        queryKey: ["subcategories", parent],
      });
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        variant: "destructive",
        title: "Failed to delete subcategory.",
        description: message,
      });
    },
  });

  const handleConfirm = () => {
    if (deleteCategoryDialog.category)
      deleteCategoryMutation.mutate(deleteCategoryDialog.category._id);
  };

  return (
    <Dialog
      open={deleteCategoryDialog.dialog}
      onOpenChange={() =>
        dispatch(toggleDeleteCategoryDialog({ category: null }))
      }
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Subcategory</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the subcategory "
            {deleteCategoryDialog.category &&
              deleteCategoryDialog.category.name}
            "? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              dispatch(toggleDeleteCategoryDialog({ category: null }))
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

export default DeleteSubcategoryDialog;
