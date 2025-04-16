import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GlobalWorkerOptions } from "pdfjs-dist";

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Set the worker source for react-pdf
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const workerUrl = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();


const PDFViewer = ({ 
  pdfFile, 
  currentPage, 
  setCurrentPage, 
  setTotalPages, 
  totalPages,
  zoomLevel,
  isSpeaking,
  speakingRate,
  theme
}) => {
  const [pageText, setPageText] = useState("");
  const [isTextExtracting, setIsTextExtracting] = useState(false);
  const speechSynthesisRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Stop speaking when component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isSpeaking && pageText && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new speech utterance
      const utterance = new SpeechSynthesisUtterance(pageText);
      utterance.rate = speakingRate;
      
      // Store the utterance reference
      speechSynthesisRef.current = utterance;
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      
      // When speech ends
      utterance.onend = () => {
        // If we're still in speaking mode, move to next page
        if (isSpeaking) {
          setCurrentPage(prev => {
            if (prev < totalPages) {
              return prev + 1;
            } else {
              return prev;
            }
          });
        }
      };
    } else if (!isSpeaking && window.speechSynthesis) {
      // Stop speaking if isSpeaking is false
      window.speechSynthesis.cancel();
    }
  }, [isSpeaking, pageText, speakingRate, setCurrentPage]);

  const extractTextFromPage = async (pdf, pageNumber) => {
    try {
      setIsTextExtracting(true);
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(' ');
      setPageText(text);
    } catch (error) {
      console.error("Error extracting text:", error);
      setPageText("Unable to extract text from this page.");
    } finally {
      setIsTextExtracting(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <motion.div 
      ref={containerRef}
      className={`flex-1 overflow-auto scrollbar-custom flex justify-center p-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pdf-container" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
        <Worker workerUrl={workerUrl}>
          <div
              style={{
                  height: '750px',
                  width: '900px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
              }}
          >
              <Viewer 
                fileUrl={pdfFile?.url}
                plugins={[defaultLayoutPluginInstance]}
              />
          </div>
        </Worker>
      </div>
    </motion.div>
  );
};

export default PDFViewer;