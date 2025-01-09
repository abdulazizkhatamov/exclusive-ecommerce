// Define the interface for the attribute object
import { IProduct } from "@/types/product.ts";

interface VariantAttribute {
  name: string; // Attribute name, e.g., 'Color'
  value: string; // Selected value, e.g., 'Red'
}

// Define the main Variant interface
export interface IVariant {
  _id: string;
  sku: string; // Stock Keeping Unit
  product: IProduct; // Reference to the associated product
  attributes: VariantAttribute[]; // Array of attributes
  price: number; // Price of the variant
  stock: number; // Stock quantity
  images: string[]; // Array of image URLs
  createdAt?: Date; // Automatically added by Mongoose (optional)
  updatedAt?: Date; // Automatically added by Mongoose (optional)
}
