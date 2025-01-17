import React from "react";
import { setCurrentImageIndex } from "@/features/product/product-slice.ts";
import { useDispatch } from "react-redux";

interface ProductImageGalleryProps {
  currentImages: string[];
  currentImageIndex: number;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  currentImages,
  currentImageIndex,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="flex max-w-full">
      {/* Thumbnail images container with overflow */}
      <div className="max-h-[400px] overflow-x-auto rounded-md hidden-scrollbar">
        {currentImages.map((img: string, index: number) => (
          <img
            key={index}
            src={`/${img}`} // Fixed dynamic src path
            alt={`Thumbnail ${index}`} // Fixed alt text
            className={`w-24 h-20 mb-4 p-1 object-cover rounded-md cursor-pointer ${
              index === currentImageIndex ? "border-2 border-primary_red" : ""
            }`}
            loading={"lazy"}
            onClick={() => dispatch(setCurrentImageIndex(index))}
          />
        ))}
      </div>
      {/* Main image display */}
      <div className="ml-4 w-[450px] h-[450px] relative">
        <img
          src={`/${currentImages[currentImageIndex]}`} // Fixed dynamic src path
          alt={`Main Image ${currentImageIndex}`} // Fixed alt text
          className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;
