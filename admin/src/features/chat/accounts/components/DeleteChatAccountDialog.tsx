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
import { deleteDeleteChatAccount } from "@/api/api-chat.ts";

interface DeleteChatAccountDialogProps {
  account: {
    _id: string;
    name: string;
  };
  deleteChatAccountDialog: boolean;
  setDeleteChatAccountDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteChatAccountDialog: React.FC<DeleteChatAccountDialogProps> = ({
  account,
  deleteChatAccountDialog,
  setDeleteChatAccountDialog,
}) => {
  const { toast } = useToast();

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteDeleteChatAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["chat-accounts"],
      });
      setDeleteChatAccountDialog(false);
      toast({
        title: "Chat account deleted.",
        description: new Date().toUTCString(),
      });
    },
    onError: async (error) => {
      await queryClient.invalidateQueries({
        queryKey: ["chat-accounts"],
      });
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        variant: "destructive",
        title: "Failed to delete chat account.",
        description: message,
      });
    },
  });

  const handleConfirm = () => {
    if (account) deleteCategoryMutation.mutate({ _id: account._id });
  };

  return (
    <Dialog
      open={deleteChatAccountDialog}
      onOpenChange={setDeleteChatAccountDialog}
    >
      <DialogTrigger asChild>
        <Button variant={"destructive"} className={"h-7 w-7"}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the account "{account.name}
            "? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteChatAccountDialog(false)}
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

export default DeleteChatAccountDialog;
