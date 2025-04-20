import React, { useRef } from "react";
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
  zoomLevel,
  app_bg_color,
}) => {

  const containerRef = useRef(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <motion.div 
      ref={containerRef}
      className={`flex-1 overflow-auto scrollbar-custom flex justify-center p-4 ${app_bg_color}`}
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