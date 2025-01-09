import { IProduct } from "@/types/product.ts";
import { IVariant } from "@/types/variant.ts";

export function isProduct(product: IProduct | string): product is IProduct {
  return typeof product !== "string";
}

export function isVariant(variant: IVariant | string): variant is IVariant {
  return typeof variant !== "string";
}
