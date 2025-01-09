// Define the interface for the product attribute
import { ICategory } from "@/types/category.ts";
import { IVariant } from "@/types/variant.ts";

interface ProductAttribute {
  name: string; // Attribute name, e.g., 'Color', 'Size'
  value: string[]; // Possible values, e.g., ['Red', 'Blue']
}

// Define the main Product interface
export interface IProduct {
  _id: string;
  name: string; // Product name
  description: string; // Product description
  price: number; // Current price
  rating?: number; // Average rating (optional, default is 0)
  reviews?: number; // Number of reviews (optional, default is 0)
  discount?: number; // Discount percentage (optional, default is 0)
  attributes: ProductAttribute[]; // Array of attributes
  quantity?: number; // Available quantity (optional, default is 0)
  images?: string[]; // Array of product image URLs (optional)
  category: ICategory; // Reference to the category
  variants?: IVariant; // References to the Variant model (optional)
  createdAt?: Date; // Automatically added by Mongoose (optional)
  updatedAt?: Date; // Automatically added by Mongoose (optional)
}
