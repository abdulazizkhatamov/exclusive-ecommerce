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
import { Trash } from "lucide-react";

import { useToast } from "@/hooks/use-toast.ts";
import { useMutation } from "react-query";
import { deleteDeleteVariant } from "@/api/api-variants.ts";
import { queryClient } from "@/api/api.ts";
import { Variant } from "@/features/variants/data/schema-variants.ts";

interface DeleteVariantDialogProps {
  variant: Variant;
  deleteVariantDialog: boolean;
  setDeleteVariantDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteVariantDialog: React.FC<DeleteVariantDialogProps> = ({
  variant,
  deleteVariantDialog,
  setDeleteVariantDialog,
}) => {
  const { toast } = useToast();

  const deleteVariantMutation = useMutation({
    mutationFn: deleteDeleteVariant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["variants"] });
      setDeleteVariantDialog(false);
      toast({
        title: "Variant deleted.",
        description: new Date().toUTCString(),
      });
    },
    onError: async (error) => {
      await queryClient.invalidateQueries({ queryKey: ["variants"] });
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
    if (variant) deleteVariantMutation.mutate(variant._id);
  };

  return (
    <Dialog open={deleteVariantDialog} onOpenChange={setDeleteVariantDialog}>
      <DialogTrigger asChild>
        <Button className={"h-7 w-7"} variant={"destructive"}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Variant</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the variant "
            {variant && variant.sku}
            "? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteVariantDialog(false)}
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
