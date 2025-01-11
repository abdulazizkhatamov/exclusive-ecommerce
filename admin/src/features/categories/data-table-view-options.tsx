"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { useFormik } from "formik";
import { queryClient } from "@/api/api.ts";
import * as Yup from "yup";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast.ts";
import { useMutation } from "react-query";
import { postCreateCategory } from "@/api/api-categories.ts";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

const categoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const [createSheet, setCreateSheet] = useState(false);

  const { toast } = useToast();
  const createCategoryMutation = useMutation(postCreateCategory);

  const createCategoryFormik = useFormik({
    initialValues: {
      name: "",
      description: "",
      status: true,
    },
    validationSchema: categoryValidationSchema,
    onSubmit: (values, { resetForm }) => {
      createCategoryMutation.mutate(values, {
        onSuccess: async () => {
          await queryClient.invalidateQueries("categories");
          setCreateSheet(false);
          toast({
            title: "Category created",
            description: new Date().toUTCString(),
          });
          resetForm();
        },
        onError: async (error) => {
          await queryClient.invalidateQueries("categories");
          const message =
            error instanceof Error ? error.message : "An error occurred";
          toast({
            variant: "destructive",
            title: "Failed to create category.",
            description: message,
          });
        },
      });
    },
  });

  return (
    <div className={"flex gap-2"}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Settings2 />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide(),
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet
        open={createSheet}
        onOpenChange={() => setCreateSheet(!createSheet)}
      >
        <SheetTrigger asChild>
          <Button
            className={"ml-auto h-8 lg:flex"}
            onClick={() => setCreateSheet(!createSheet)}
          >
            Create category
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add a New Category</SheetTitle>
            <SheetDescription>
              Set up a new category for your store’s products.
            </SheetDescription>
          </SheetHeader>
          <form
            onSubmit={createCategoryFormik.handleSubmit}
            className="grid gap-4 py-4"
          >
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Name"
                onChange={createCategoryFormik.handleChange}
                value={createCategoryFormik.values.name}
              />
              {createCategoryFormik.errors.name && (
                <div className="text-red-500 text-sm">
                  {createCategoryFormik.errors.name}
                </div>
              )}
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description"
                onChange={createCategoryFormik.handleChange}
                value={createCategoryFormik.values.description}
              />
              {createCategoryFormik.errors.description && (
                <div className="text-red-500 text-sm">
                  {createCategoryFormik.errors.description}
                </div>
              )}
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="status">Status</Label>
              <Switch
                id="status"
                checked={createCategoryFormik.values.status}
                onCheckedChange={(checked) =>
                  createCategoryFormik.setFieldValue("status", checked)
                }
              />
            </div>
            <Button type="submit" className="btn btn-primary">
              Create
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
