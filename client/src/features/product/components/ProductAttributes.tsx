import React from "react";
import {
  setCurrentImageIndex,
  setQuantity,
  setSelectedAttributes,
} from "@/features/product/product-slice.ts";
import { useDispatch } from "react-redux";

interface ProductAttributesProps {
  attributes: {
    name: string; // Attribute name, e.g., 'Color', 'Size'
    value: string[]; // Possible values, e.g., ['Red', 'Blue']
  }[];
  selectedAttributes: Record<string, string>;
}

const ProductAttributes: React.FC<ProductAttributesProps> = ({
  attributes,
  selectedAttributes,
}) => {
  const dispatch = useDispatch();

  const handleAttributeChange = (name: string, value: string) => {
    dispatch(setSelectedAttributes({ ...selectedAttributes, [name]: value }));
    dispatch(setCurrentImageIndex(0));
    dispatch(setQuantity(1));
  };

  return (
    attributes && (
      <div className="space-y-4 mt-5">
        {attributes.map((attr: { name: string; value: string[] }) => (
          <div key={attr.name}>
            <h3 className="font-medium mb-2 text-lg">{attr.name}</h3>
            <div className="flex flex-wrap gap-2">
              {attr.value.map((val: string) => (
                <button
                  key={val}
                  className={`py-1 px-2 rounded-md ${
                    selectedAttributes[attr.name] === val
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleAttributeChange(attr.name, val)}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default ProductAttributes;
