import React, { useEffect, useState } from "react";
import { IProduct } from "@/types/product.ts";
import FiltersSidebar from "@/features/products/FiltersSidebar.tsx";
import ProductList from "@/features/products/ProductList.tsx";
import Pagination from "@/features/products/Pagination.tsx";

interface ProductsProps {
  data: IProduct[];
  title: string;
}

const Products: React.FC<ProductsProps> = ({ data, title }) => {
  const [allProducts, setAllProducts] = useState<IProduct[]>([]); // All products
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]); // Filtered products
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    0, 0,
  ]); // Temp range for slider
  const [filterApplied, setFilterApplied] = useState(false); // Flag to apply filter

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    if (data) {
      const maxPrice = Math.max(
        ...data.map((product: IProduct) => product.price),
      );
      const minPrice = 0;
      setPriceRange([minPrice, maxPrice]); // Set the price range dynamically based on the data
      setTempPriceRange([minPrice, maxPrice]); // Initialize temp range for the slider
      setAllProducts(data); // Store all products
      setFilteredProducts(data); // Initially, show all products (no filter applied)
    }
  }, [data]);

  useEffect(() => {
    if (filterApplied) {
      // Apply filter logic if filter is applied
      const filteredProducts = allProducts.filter(
        (product: IProduct) =>
          product.price >= priceRange[0] && product.price <= priceRange[1],
      );
      setFilteredProducts(filteredProducts);
      setCurrentPage(1); // Reset to the first page after applying filter
    }
  }, [filterApplied, priceRange, allProducts]); // Depend on filterApplied, priceRange, and allProducts

  return (
    data && (
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar with filters */}
        <FiltersSidebar
          priceList={data.map((product: IProduct) => product.price)}
          tempPriceRange={tempPriceRange}
          setTempPriceRange={setTempPriceRange}
          setPriceRange={setPriceRange}
          setFilterApplied={setFilterApplied}
        />

        {/* Main content area with product list */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          <ProductList
            products={filteredProducts}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
          <Pagination
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </main>
      </div>
    )
  );
};

export default Products;
