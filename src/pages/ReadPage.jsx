import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import PDFSidebar from "../components/read_pdf/PDFSidebar.jsx";
import PDFViewer from "../components/read_pdf/PDFViewer.jsx";
import PDFControls from "../components/read_pdf/PDFControls.jsx";
import { getPDFFiles } from "../components/read_pdf/pdfUtils";

const ReadPageContent = ({
  app_bg_color,
  text_color,
  theme
}) => {
  const [loading, setLoading] = useState(true);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingRate, setSpeakingRate] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const loadPdfFiles = async () => {
      try {
        const files = await getPDFFiles();
        setPdfFiles(files);
        if (files.length > 0) {
          setSelectedPdf(files[0]);
        }
      } catch (error) {
        console.error("Error loading PDF files:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPdfFiles();
  }, []);

  const handlePdfSelect = (pdf) => {
    setSelectedPdf(pdf);
    setCurrentPage(1);
  };

  return (
    <div
      className={`flex h-screen ${app_bg_color}`}
      style={{
        marginLeft: "5%",
        width: "95%",
        maxWidth: "95%",
        minWidth: "95%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: "100%",
          overflow: "hidden"
        }}
      >
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-64 h-screen fixed top-0 pt-20 shadow-lg z-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <PDFSidebar
            pdfFiles={pdfFiles}
            selectedPdf={selectedPdf}
            onSelectPdf={handlePdfSelect}
            theme={theme}
            textColor={text_color}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 ml-64 pt-20 flex flex-col"
        >
          {loading ? (
            <div className={`flex justify-center items-center h-full ${text_color}`}>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : selectedPdf ? (
            <>
              <PDFControls
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
                isSpeaking={isSpeaking}
                setIsSpeaking={setIsSpeaking}
                speakingRate={speakingRate}
                setSpeakingRate={setSpeakingRate}
                theme={theme}
                textColor={text_color}
              />
              <div
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  minWidth: "100%",
                  height: "calc(100vh - 150px)",
                  overflowY: "auto"
                }}
              >
                <PDFViewer
                  pdfFile={selectedPdf}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setTotalPages={setTotalPages}
                  totalPages={totalPages}
                  zoomLevel={zoomLevel}
                  isSpeaking={isSpeaking}
                  speakingRate={speakingRate}
                  theme={theme}
                />
            </div>
            </>
          ) : (
            <div className={`flex justify-center items-center h-full ${text_color}`}>
              <p>No PDF files available. Please add some PDF files to the assets/pdf directory.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const ReadPage = () => {
  const context = useOutletContext();
  return <ReadPageContent {...context} />;
};

export default ReadPage;
