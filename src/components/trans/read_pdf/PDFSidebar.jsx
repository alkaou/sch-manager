import React from "react";
import { motion } from "framer-motion";
import { FaFilePdf, FaSearch } from "react-icons/fa";

const PDFSidebar = ({ pdfFiles, selectedPdf, onSelectPdf, theme, textColor, app_bg_color }) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredFiles = pdfFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`mt-20 flex flex-col h-full ${app_bg_color}`}>
      <div className="p-4">
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Documents</h2>
        <div className={`relative mb-4`}>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${theme === 'dark'
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                : 'bg-gray-100 text-gray-700 placeholder-gray-500 border-gray-300'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-custom px-4 pb-4">
        {filteredFiles.length > 0 ? (
          <ul className="space-y-2">
            {filteredFiles.map((file, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => onSelectPdf(file)}
                  className={`w-full text-left p-3 rounded-lg flex items-center ${selectedPdf && selectedPdf.name === file.name
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700'
                      : theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-200'
                        : `hover:bg-green-500 hover:bg-opacity-30 ${textColor}`
                    } transition-colors duration-200`}
                >
                  <FaFilePdf className={`mr-2 ${selectedPdf && selectedPdf.name === file.name
                      ? 'text-current'
                      : theme === 'dark' ? 'text-blue-400' : "text-blue-600"
                    }`} />
                  <span className="truncate">{file.name}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className={`text-center py-8 ${textColor}`}>
            <FaFilePdf className="mx-auto text-4xl mb-2 text-gray-400" />
            <p>No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFSidebar;