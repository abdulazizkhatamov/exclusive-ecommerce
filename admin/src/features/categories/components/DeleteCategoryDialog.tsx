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

interface DeleteCategoryProps {
  open: boolean;
  onOpenChange: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  categoryName: string;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryProps> = ({
  open,
  onOpenChange,
  onDelete,
  isDeleting,
  categoryName,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <Button className="h-7 w-7" variant="destructive">
        <Trash />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the category "{categoryName}"? This
          action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
          {isDeleting ? (
            <Loader className={"h-4 w-4 animate-spin"} />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
