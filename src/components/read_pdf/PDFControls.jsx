import React from "react";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaPlay, 
  FaPause, 
  FaSearchPlus, 
  FaSearchMinus,
  FaDownload,
  FaExpand,
  FaCompress,
  FaCog
} from "react-icons/fa";

const PDFControls = ({
  currentPage,
  totalPages,
  setCurrentPage,
  zoomLevel,
  setZoomLevel,
  isSpeaking,
  setIsSpeaking,
  speakingRate,
  setSpeakingRate,
  theme,
  textColor
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
  };

  const handlePageInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      setCurrentPage(value);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`p-4 border-b ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-md`}
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