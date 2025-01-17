import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isNoProducts = totalItems === 0;

  return (
    <div className="mt-10 flex justify-center items-center space-x-2">
      {/* First page button */}
      <button
        className={`px-4 py-2 rounded bg-gray-200 text-gray-700 ${
          currentPage === 1 || isNoProducts
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-300"
        }`}
        onClick={handleFirstPage}
        disabled={currentPage === 1 || isNoProducts}
      >
        <ChevronsLeft size={16} />
      </button>

      {/* Previous page button */}
      <button
        className={`px-4 py-2 rounded bg-gray-200 text-gray-700 ${
          currentPage === 1 || isNoProducts
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-300"
        }`}
        onClick={handlePreviousPage}
        disabled={currentPage === 1 || isNoProducts}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Current page display */}
      <button className="px-4 py-2 rounded bg-primary_red text-white" disabled>
        {currentPage}
      </button>

      {/* Next page button */}
      <button
        className={`px-4 py-2 rounded bg-gray-200 text-gray-700 ${
          currentPage === totalPages || isNoProducts
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-300"
        }`}
        onClick={handleNextPage}
        disabled={currentPage === totalPages || isNoProducts}
      >
        <ChevronRight size={16} />
      </button>

      {/* Last page button */}
      <button
        className={`px-4 py-2 rounded bg-gray-200 text-gray-700 ${
          currentPage === totalPages || isNoProducts
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-300"
        }`}
        onClick={handleLastPage}
        disabled={currentPage === totalPages || isNoProducts}
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
