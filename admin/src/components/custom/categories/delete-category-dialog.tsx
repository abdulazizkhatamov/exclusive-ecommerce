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
import { toggleDeleteCategoryDialog } from "@/features/ui/ui-category-slice.ts";
import { Button } from "@/components/ui/button.tsx";
import { useMutation } from "react-query";
import { deleteDeleteCategory } from "@/api/api-categories.ts";
import { queryClient } from "@/api/api.ts";
import { useToast } from "@/hooks/use-toast.ts";

const DeleteCategoryDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { deleteCategoryDialog } = useSelector(
    (state: RootState) => state.ui_category,
  );
  const { toast } = useToast();

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteDeleteCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries("categories");
      dispatch(toggleDeleteCategoryDialog({ category: null }));
      toast({
        title: "Category deleted.",
        description: new Date().toUTCString(),
      });
    },
    onError: async (error) => {
      await queryClient.invalidateQueries("categories");
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        variant: "destructive",
        title: "Failed to delete category.",
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
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category "
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

export default DeleteCategoryDialog;
