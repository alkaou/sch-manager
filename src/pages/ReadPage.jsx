import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import PDFSidebar from "../components/read_pdf/PDFSidebar.jsx";
import PDFViewer from "../components/read_pdf/PDFViewer.jsx";
import PDFControls from "../components/read_pdf/PDFControls.jsx";
import { getPDFFiles } from "../components/read_pdf/pdfUtils";
import PageLoading from "../components/PageLoading.jsx";

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
        marginLeft: "4%",
        height: "100vh",
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
          className={`h-screen fixed top-0 shadow-lg z-10 ${app_bg_color}`}
          style={{ width: "20%" }}
        >
          <PDFSidebar
            pdfFiles={pdfFiles}
            selectedPdf={selectedPdf}
            onSelectPdf={handlePdfSelect}
            theme={theme}
            app_bg_color={app_bg_color}
            textColor={text_color}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col"
        >
          {loading ? (
            <PageLoading />
          ) : selectedPdf ? (
            <>
              <div
                className="sticky z-5 w-full"
                style={{ marginTop: "6%" }}
              >
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
                  app_bg_color={app_bg_color}
                />
              </div>
              <div
                style={{
                  width: "76%",
                  maxWidth: "76%",
                  minWidth: "76%",
                  marginLeft: "22%", 
                  height: "80vh",
                  overflowY: "auto"
                }}
                className="scrollbar-custom"
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
                  app_bg_color={app_bg_color}
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
