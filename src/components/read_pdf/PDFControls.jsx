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
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className={`p-2 rounded-full ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
            } transition-colors`}
            aria-label="Previous page"
          >
            <FaArrowLeft />
          </button>
          
          <div className={`flex items-center ${textColor}`}>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={handlePageInputChange}
              className={`w-12 text-center rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-700 border-gray-300'
              } border p-1`}
            />
            <span className="mx-1">of</span>
            <span>{totalPages}</span>
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className={`p-2 rounded-full ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
            } transition-colors`}
            aria-label="Next page"
          >
            <FaArrowRight />
          </button>
        </div>
        
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
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-full ${
              isSpeaking
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            aria-label={isSpeaking ? "Pause speech" : "Start speech"}
          >
            {isSpeaking ? <FaPause /> : <FaPlay />}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full ${
              showSettings
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            aria-label="Settings"
          >
            <FaCog />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-full ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
          
          <button
            className={`p-2 rounded-full ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            aria-label="Download PDF"
          >
            <FaDownload />
          </button>
        </div>
      </div>
      
      {showSettings && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`mt-4 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}
        >
          <div className="flex flex-col space-y-4">
            <div>
              <label className={`block mb-2 ${textColor}`}>
                Speech Rate: {speakingRate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speakingRate}
                onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PDFControls;