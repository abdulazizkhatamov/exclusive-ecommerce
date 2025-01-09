// Define the main Category interface
export interface ICategory {
  _id: string;
  name: string; // Category name
  description?: string; // Category description (optional)
  status?: boolean; // Status of the category (optional, default is true)
  parent?: ICategory | null; // Reference to the parent category (optional, null for top-level)
  createdAt?: Date; // Automatically added by Mongoose (optional)
  updatedAt?: Date; // Automatically added by Mongoose (optional)
}
