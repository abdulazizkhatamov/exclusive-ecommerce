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
import { toggleDeleteVariantDialog } from "@/features/ui/ui-variant-slice.ts";
import { deleteDeleteVariant } from "@/api/api-variants.ts";

interface DeleteVariantDialogProps {
  _id?: string;
}

const DeleteVariantDialog: React.FC<DeleteVariantDialogProps> = ({ _id }) => {
  const dispatch = useDispatch();
  const { deleteVariantDialog } = useSelector(
    (state: RootState) => state.ui_variant,
  );
  const { toast } = useToast();

  const deleteVariantMutation = useMutation({
    mutationFn: deleteDeleteVariant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["variants", _id] });
      dispatch(toggleDeleteVariantDialog({ variant: null }));
      toast({
        title: "Variant deleted.",
        description: new Date().toUTCString(),
      });
    },
    onError: async (error) => {
      await queryClient.invalidateQueries({ queryKey: ["variants", _id] });
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        variant: "destructive",
        title: "Failed to delete variant.",
        description: message,
      });
    },
  });

  const handleConfirm = () => {
    if (deleteVariantDialog.variant)
      deleteVariantMutation.mutate(deleteVariantDialog.variant._id);
  };

  return (
    <Dialog
      open={deleteVariantDialog.dialog}
      onOpenChange={() =>
        dispatch(toggleDeleteVariantDialog({ variant: null }))
      }
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Variant</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the variant "
            {deleteVariantDialog.variant && deleteVariantDialog.variant.sku}
            "? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              dispatch(toggleDeleteVariantDialog({ variant: null }))
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

export default DeleteVariantDialog;
