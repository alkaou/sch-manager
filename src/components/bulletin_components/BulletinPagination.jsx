import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BulletinPagination = ({
  currentPage,
  totalPages,
  paginate,
  // theme,
  textClass,
  borderColor,
  buttonSecondary,
  buttonPrimary,
}) => {
  // Generate page numbers
  const pageNumbers = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      className={`flex justify-center items-center py-4 border-t ${borderColor}`}
    >
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${buttonSecondary} ${textClass} ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {/* First page */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => paginate(1)}
              className={`w-10 h-10 rounded-lg ${
                currentPage === 1
                  ? buttonPrimary + " text-white"
                  : buttonSecondary + " " + textClass
              }`}
            >
              1
            </button>
            {startPage > 2 && <span className={`${textClass}`}>...</span>}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`w-10 h-10 rounded-lg ${
              currentPage === number
                ? buttonPrimary + " text-white"
                : buttonSecondary + " " + textClass
            }`}
          >
            {number}
          </button>
        ))}

        {/* Last page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className={`${textClass}`}>...</span>
            )}
            <button
              onClick={() => paginate(totalPages)}
              className={`w-10 h-10 rounded-lg ${
                currentPage === totalPages
                  ? buttonPrimary + " text-white"
                  : buttonSecondary + " " + textClass
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${buttonSecondary} ${textClass} ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default BulletinPagination;
