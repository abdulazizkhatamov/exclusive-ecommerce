import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { getProductById } from "@/features/product/requests";
import { IVariant } from "@/types/variant.ts";
import { ICartItem } from "@/types/user.ts";

import { setSelectedAttributes } from "@/features/product/product-slice.ts";
import { RootState } from "@/app/store.ts";
import ProductImageGallery from "@/features/product/components/ProductImageGallery.tsx";
import ProductInfo from "@/features/product/components/ProductInfo.tsx";
import QuantitySelector from "@/features/product/components/QuantitySelector.tsx";
import ProductAttributes from "@/features/product/components/ProductAttributes.tsx";

interface ProductProps {
  _id: string;
  addToCart: (product: ICartItem) => void;
}

const Product: React.FC<ProductProps> = ({ _id, addToCart }) => {
  const dispatch = useDispatch();
  const { selectedAttributes, currentImageIndex, quantity } = useSelector(
    (state: RootState) => state.product,
  );

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", _id],
    queryFn: () => getProductById(_id),
  });

  useEffect(() => {
    if (product?.data?.attributes) {
      const defaultAttributes: Record<string, string> = {};
      product.data.attributes.forEach(
        (attr: { name: string; value: string[] }) => {
          if (attr.value.length > 0) {
            defaultAttributes[attr.name] = attr.value[0];
          }
        },
      );
      dispatch(setSelectedAttributes(defaultAttributes));
    }
  }, [product, dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !product?.data) return <div>Error loading product</div>;

  const { data } = product;
  const {
    name,
    description,
    price,
    rating,
    reviews,
    attributes,
    images,
    variants,
    discount,
  } = data;

  const selectedVariant = variants?.find((variant: IVariant) =>
    variant.attributes.every(
      (attr: { name: string; value: string }) =>
        selectedAttributes[attr.name] === attr.value,
    ),
  );

  const currentPrice = selectedVariant ? selectedVariant.price : price;
  const currentImages =
    selectedVariant?.images?.length > 0 ? selectedVariant.images : images;

  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : true;

  return (
    <div className="mx-auto p-4">
      <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div>
          <ProductImageGallery
            currentImages={currentImages}
            currentImageIndex={currentImageIndex}
          />
        </div>

        {/* Product Info */}
        <div>
          <ProductInfo
            name={name}
            rating={rating}
            reviews={reviews}
            discount={discount}
            currentPrice={currentPrice}
            price={price}
            description={description}
            isOutOfStock={isOutOfStock}
          />

          {/* Product Attributes */}
          <ProductAttributes
            attributes={attributes}
            selectedAttributes={selectedAttributes}
          />

          {/* Quantity Selector */}
          <QuantitySelector
            product={data}
            quantity={quantity}
            addToCart={addToCart}
            isOutOfStock={isOutOfStock}
            selectedVariant={selectedVariant}
          />

          {/* Delivery Info */}
          {/*<DeliveryInfo />*/}
        </div>
      </div>
    </div>
  );
};

export default Product;
