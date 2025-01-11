import {
  ClipboardCheck,
  Loader,
  Truck,
  PackageCheck,
  XCircle,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const orderStatuses = [
  {
    value: "Placed",
    label: "Placed",
    icon: ClipboardCheck,
  },
  {
    value: "Processing",
    label: "Processing",
    icon: Loader,
  },
  {
    value: "Shipped",
    label: "Shipped",
    icon: Truck,
  },
  {
    value: "Delivered",
    label: "Delivered",
    icon: PackageCheck,
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: XCircle,
  },
];

export const paymentStatuses = [
  {
    value: "Pending",
    label: "Pending",
    icon: Clock,
  },
  {
    value: "Completed",
    label: "Completed",
    icon: CheckCircle,
  },
  {
    value: "Failed",
    label: "Failed",
    icon: AlertCircle,
  },
];
