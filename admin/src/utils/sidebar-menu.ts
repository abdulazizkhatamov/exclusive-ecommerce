import {
  Mail,
  Settings,
  ShoppingBag,
  ShoppingBasket,
  SquareStack,
  SquareTerminal,
  Tag,
} from "lucide-react";

export const sidebarMenu = {
  admin: {
    username: "shadcn",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "",
        },
        {
          title: "Analytics",
          url: "analytics",
        },
        {
          title: "Activity Log",
          url: "activity-log",
        },
      ],
    },

    {
      title: "Categories",
      url: "#",
      icon: SquareStack,
      items: [
        {
          title: "All Categories",
          url: "categories",
        },
        {
          title: "Add Category",
          url: "categories/add",
        },
        {
          title: "Manage Subcategories",
          url: "categories/subcategories",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: ShoppingBag,
      items: [
        {
          title: "All Products",
          url: "products",
        },
        {
          title: "Add Product",
          url: "products/add",
        },
        {
          title: "Product Variants",
          url: "products/variants",
        },
        {
          title: "Inventory Management",
          url: "products/inventory",
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: ShoppingBasket,
      items: [
        {
          title: "All Orders",
          url: "orders",
        },
        {
          title: "Pending Orders",
          url: "orders/pending",
        },
        {
          title: "Completed Orders",
          url: "orders/completed",
        },
        {
          title: "Refund Requests",
          url: "orders/refunds",
        },
      ],
    },
    {
      title: "Promotions",
      url: "#",
      icon: Tag,
      items: [
        {
          title: "All Promotions",
          url: "promotions",
        },
        {
          title: "Create Promotion",
          url: "promotions/create",
        },
        {
          title: "Discount Codes",
          url: "promotions/discount-codes",
        },
      ],
    },
    {
      title: "Mails",
      url: "#",
      icon: Mail,
      items: [
        {
          title: "All Mails",
          url: "mails",
        },
        {
          title: "Compose Mail",
          url: "mails/compose",
        },
        {
          title: "Mail Templates",
          url: "mails/templates",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "settings",
        },
        {
          title: "Payment Settings",
          url: "settings/payment",
        },
        {
          title: "Shipping Settings",
          url: "settings/shipping",
        },
      ],
    },
  ],
};
