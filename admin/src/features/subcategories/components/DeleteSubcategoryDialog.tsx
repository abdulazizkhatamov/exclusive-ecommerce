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
import { useToast } from "@/hooks/use-toast.ts";
import { useMutation } from "react-query";
import { deleteDeleteCategory } from "@/api/api-categories.ts";
import { queryClient } from "@/api/api.ts";
import { Category } from "@/features/categories/data/schema-categories.ts";
import { Trash } from "lucide-react";

interface DeleteSubcategoryDeleteProps {
  category: Category;
  deleteDialog: boolean;
  setDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteSubcategoryDelete: React.FC<DeleteSubcategoryDeleteProps> = ({
  category,
  deleteDialog,
  setDeleteDialog,
}) => {
  const { toast } = useToast();

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteDeleteCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["subcategories"],
      });
      setDeleteDialog(false);
      toast({
        title: "Subcategory deleted.",
        description: new Date().toUTCString(),
      });
    },
    onError: async (error) => {
      await queryClient.invalidateQueries({
        queryKey: ["subcategories"],
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
    if (category) deleteCategoryMutation.mutate(category._id);
  };

  return (
    <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
      <DialogTrigger asChild>
        <Button variant={"destructive"} className={"h-7 w-7"}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Subcategory</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the subcategory "{category.name}
            "? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteDialog(false)}>
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

export default DeleteSubcategoryDelete;
