import { IProduct } from "@/types/product.ts";
import { IVariant } from "@/types/variant.ts";

export interface IAddress {
  _id: string;
  fullName: string; // Full name for the address
  street: string; // Street address
  apartment: string;
  state: string; // State
  city: string; // City
  postalCode: string; // Postal code
  phone: string; // Phone number
}

export interface ICartItem {
  _id: string;
  product: IProduct; // Reference to the Product model
  variant: IVariant; // Reference to the Variant model
  quantity: number; // Quantity of the product
}

// Main User Interface
export interface IUser {
  _id: string;
  fullName: string; // Full name of the user
  email: string; // User's email address
  password: string; // Hashed password
  addresses: IAddress[] | []; // List of user addresses (optional)
  cart?: ICartItem[] | []; // List of items in the cart (optional)
  orderHistory?: [] | null; // References to the Order model (optional)
  createdAt?: Date; // Automatically added by Mongoose (optional)
  updatedAt?: Date; // Automatically added by Mongoose (optional)
}
