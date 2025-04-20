import React from "react";
import { motion } from "framer-motion";
import {
  FaSearchPlus, 
  FaSearchMinus
} from "react-icons/fa";

const PDFControls = ({
  zoomLevel,
  setZoomLevel,
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

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`p-4 border-b ${app_bg_color} ${textColor} shadow-md`}
      style={{
        width: "99.6%",
        maxWidth: "99.6%",
        minWidth: "99.6%",
        marginLeft: "0.4%",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2"></div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className={`p-2 rounded-full ${
              theme === 'dark'
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
            className={`p-2 rounded-full ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            aria-label="Zoom in"
          >
            <FaSearchPlus />
          </button>
        </div>
        
        <div className="flex items-center space-x-2"></div>
      </div>
      
    </motion.div>
  );
};

export default PDFControls;