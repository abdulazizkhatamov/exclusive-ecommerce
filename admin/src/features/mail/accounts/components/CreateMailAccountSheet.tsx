import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Button } from "@/components/ui/button.tsx";
import CreateMailAccountForm from "@/features/mail/accounts/components/CreateMailAccountForm.tsx";

interface CreateMailAccountSheetProps {
  createAccountSheet: boolean;
  setCreateAccountSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateMailAccountSheet: React.FC<CreateMailAccountSheetProps> = ({
  createAccountSheet,
  setCreateAccountSheet,
}) => {
  return (
    <Sheet
      open={createAccountSheet}
      onOpenChange={() => setCreateAccountSheet(!createAccountSheet)}
    >
      <SheetTrigger asChild>
        <Button className={"ml-auto h-8 lg:flex"}>Create account</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a New Account</SheetTitle>
          <SheetDescription>
            Set up a new mail account for your store.
          </SheetDescription>
        </SheetHeader>
        <CreateMailAccountForm setCreateAccountSheet={setCreateAccountSheet} />
      </SheetContent>
    </Sheet>
  );
};

export default CreateMailAccountSheet;
