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
import { useMutation } from "react-query";
import { queryClient } from "@/api/api.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { deleteDeleteMailAccount } from "@/api/api-mail.ts";

interface DeleteMailAccountDialogProps {
  account: {
    name: string;
    key: string;
  };
  deleteMailAccountDialog: boolean;
  setDeleteMailAccountDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteMailAccountDialog: React.FC<DeleteMailAccountDialogProps> = ({
  account,
  deleteMailAccountDialog,
  setDeleteMailAccountDialog,
}) => {
  const { toast } = useToast();

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteDeleteMailAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mail-accounts"],
      });
      setDeleteMailAccountDialog(false);
      toast({
        title: "Mail account deleted.",
        description: new Date().toUTCString(),
      });
    },
    onError: async (error) => {
      await queryClient.invalidateQueries({
        queryKey: ["mail-accounts"],
      });
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        variant: "destructive",
        title: "Failed to delete mail account.",
        description: message,
      });
    },
  });

  const handleConfirm = () => {
    if (account) deleteCategoryMutation.mutate({ key: account.key });
  };

  return (
    <Dialog
      open={deleteMailAccountDialog}
      onOpenChange={setDeleteMailAccountDialog}
    >
      <DialogTrigger asChild>
        <Button variant={"destructive"} className={"h-7 w-7"}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Subcategory</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the subcategory "{account.name}
            "? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteMailAccountDialog(false)}
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

export default DeleteMailAccountDialog;
