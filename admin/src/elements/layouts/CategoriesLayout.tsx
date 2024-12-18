import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster.tsx";
import { createPortal } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";
import { toggleUpdateCategorySheet } from "@/features/ui/ui-slice.ts";

const CategoriesLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { updateCategorySheet } = useSelector((state: RootState) => state.ui);
  const sheetElement = document.getElementById("sheet");
  if (!sheetElement) {
    console.error("#sheet element not found");
    return null; // Prevent portal from rendering if #sheet isn't found
  }

  return (
    <>
      <Outlet />
      <Toaster />
      {createPortal(
        <Dialog
          open={updateCategorySheet}
          onOpenChange={() => dispatch(toggleUpdateCategorySheet())}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            {/* Add buttons for dialog actions */}
            <div className="flex justify-end space-x-4">
              <Button onClick={() => dispatch(toggleUpdateCategorySheet())}>
                Cancel
              </Button>
              <Button
                onClick={() => dispatch(toggleUpdateCategorySheet())}
                variant="destructive"
              >
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>,
        sheetElement,
      )}
    </>
  );
};

export default CategoriesLayout;
