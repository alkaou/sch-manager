import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion } from "framer-motion";

// Set the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PDFViewer = ({ 
  pdfFile, 
  currentPage, 
  setCurrentPage, 
  setTotalPages, 
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
            if (prev < totalNumPages) {
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

  const onPageLoadSuccess = async (page) => {
    if (pdfFile && pdfFile.url) {
      try {
        const loadingTask = pdfjs.getDocument(pdfFile.url);
        const pdf = await loadingTask.promise;
        extractTextFromPage(pdf, currentPage);
      } catch (error) {
        console.error("Error loading PDF for text extraction:", error);
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className={`flex-1 overflow-auto flex justify-center p-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pdf-container" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
        <Document
          file={pdfFile?.url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          }
          error={
            <div className="flex justify-center items-center h-96 text-red-500">
              <p>Error loading PDF. Please try again.</p>
            </div>
          }
          className="shadow-xl"
        >
          <Page 
            pageNumber={currentPage} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onLoadSuccess={onPageLoadSuccess}
            className={`${theme === 'dark' ? 'bg-white' : ''}`}
          />
        </Document>
      </div>
    </motion.div>
  );
};

export default PDFViewer;