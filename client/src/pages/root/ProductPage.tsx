import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Product from "@/features/product/Product";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { updateCart } from "@/features/auth/auth-slice.ts";
import { postAddToCart } from "@/features/cart/requests.ts";
import { ICartItem } from "@/types/user.ts";
import { getRelatedProducts } from "@/features/product/requests.ts";
import RelatedProducts from "@/features/product/RelatedProducts.tsx";

const ProductPage: React.FC = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!_id) {
      navigate("/");
    }
  }, [_id, navigate]);

  const mutation = useMutation({ mutationFn: postAddToCart });
  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", _id],
    queryFn: () => getRelatedProducts(_id as string),
    enabled: !!_id,
  });

  const handleAddToCart = (product: ICartItem) => {
    mutation.mutate(product, {
      onSuccess: (response) => {
        dispatch(updateCart(response.cart));
      },
    });
  };

  return (
    <main className="container mx-auto px-4 pt-10 mb-32">
      {_id && <Product _id={_id} addToCart={handleAddToCart} />}
      {relatedProducts && <RelatedProducts products={relatedProducts} />}
    </main>
  );
};

export default ProductPage;
