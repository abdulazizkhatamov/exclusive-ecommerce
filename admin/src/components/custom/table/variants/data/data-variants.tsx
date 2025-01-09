import { Check, X } from "lucide-react";

export const quantity = [
  {
    value: "available", // Represent products with quantity > 0
    label: "Available",
    icon: Check,
  },
  {
    value: "not_available", // Represent products with quantity === 0
    label: "Not available",
    icon: X,
  },
];
