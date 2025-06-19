import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSearchPlus,
  FaSearchMinus,
  FaArrowLeft,
  FaArrowRight
} from "react-icons/fa";

const PDFControls = ({
  zoomLevel,
  setZoomLevel,
  currentPage,
  totalPages,
  setCurrentPage,
  theme,
  textColor,
  app_bg_color
}) => {


  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    handleZoomOut();
  }, [])

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`border-b border-b-2 ${app_bg_color} ${textColor} shadow-md`}
      style={{ width: "80%", marginLeft: "20%" }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-2 p-2"
        style={{ marginLeft: "40%" }}
      >

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className={`p-2 rounded-full ${theme === 'dark'
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            aria-label="Zoom out"
          >
            <FaSearchMinus />
          </button>

          <span className={`${textColor}`}>{Math.round(zoomLevel * 100)}%</span>

          <button
            onClick={handleZoomIn}
            className={`p-2 rounded-full ${theme === 'dark'
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            aria-label="Zoom in"
          >
            <FaSearchPlus />
          </button>
        </div>

        {totalPages > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className={`p-2 rounded-full ${theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
              aria-label="Previous page"
            >
              <FaArrowLeft />
            </button>

            <span className={`${textColor}`}>
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className={`p-2 rounded-full ${theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
              aria-label="Next page"
            >
              <FaArrowRight />
            </button>
          </div>
        )}

      </div>

    </motion.div>
  );
};

export default PDFControls;