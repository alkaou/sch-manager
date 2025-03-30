import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Printer, Download, Settings, ChevronDown, ChevronUp, Plus, Users, Save } from "lucide-react";
import CreateListPopup from "./CreateListPopup.jsx";
import HeaderSelector from "./HeaderSelector.jsx";
import TitleEditor from "./TitleEditor.jsx";
import A4Preview from "./A4Preview.jsx";
import StudentSelector from "./StudentSelector.jsx";
import secureLocalStorage from "react-secure-storage";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

const StudentListEditor = ({
  db,
  currentList,
  saveList,
  setView,
  theme,
  app_bg_color,
  text_color,
  mode
}) => {
  // State for create popup
  const [showCreatePopup, setShowCreatePopup] = useState(mode === "create");
  
  // State for editor
  const [listData, setListData] = useState(
    currentList || {
      name: "",
      title: {
        text: "Liste des élèves",
        style: "style1",
        position: "center",
        color: "#000000",
        fontSize: "24px",
        fontFamily: "Arial",
        bold: true,
        italic: false,
        underline: false
      },
      headers: [
        { id: "numero", label: "N°", selected: false, required: false, priority: 1 },
        { id: "first_name", label: "Prénom", selected: true, required: true, priority: 2 },
        { id: "last_name", label: "Nom", selected: true, required: true, priority: 3 },
        { id: "matricule", label: "Matricule", selected: false, required: false, priority: 4 },
        { id: "classe", label: "Classe", selected: false, required: false, priority: 5 },
        { id: "sexe", label: "Sexe", selected: false, required: false, priority: 6 },
        { id: "age", label: "Âge", selected: false, required: false, priority: 7 },
        { id: "birth_date", label: "Date de naissance", selected: false, required: false, priority: 8 },
        { id: "father_name", label: "Père", selected: false, required: false, priority: 9 },
        { id: "mother_name", label: "Mère", selected: false, required: false, priority: 10 },
        { id: "moyenne", label: "Moyenne", selected: false, required: false, priority: 11 },
        { id: "parents_contact", label: "Contact", selected: false, required: false, priority: 12  },
        { id: "signature", label: "Signature", selected: false, required: false, priority: 13 },
      ],
      customHeaders: [],
      students: [],
      orientation: "portrait",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );
  
  // State for UI
  const [showTools, setShowTools] = useState(true);
  const [showStudentSelector, setShowStudentSelector] = useState(false);
  
  // Load custom headers from secure storage
  useEffect(() => {
    const customHeaders = secureLocalStorage.getItem("custom_headers");
    if (customHeaders) {
      const parsedHeaders = JSON.parse(customHeaders);
      setListData(prev => ({
        ...prev,
        customHeaders: parsedHeaders
      }));
    }
  }, []);
  
  // Auto-save when list data changes
  useEffect(() => {
    if (listData.name && listData.name.length >= 6) {
      const updatedList = {
        ...listData,
        updatedAt: new Date().toISOString()
      };
      saveList(updatedList);
    }
  }, [listData]);
  
  // Handle create popup submission
  const handleCreateSubmit = (name) => {
    setListData(prev => ({
      ...prev,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    setShowCreatePopup(false);
  };
  
  // Handle header selection
  const handleHeaderToggle = (headerId) => {
    // Check if we're trying to deselect a required header
    const header = [...listData.headers, ...listData.customHeaders].find(h => h.id === headerId);
    
    if (header.required && header.selected) {
      return; // Cannot deselect required headers
    }
    
    // Count currently selected headers
    const selectedCount = [...listData.headers, ...listData.customHeaders].filter(h => h.selected).length;
    
    // Check if we're trying to select more than 6 headers
    if (!header.selected && selectedCount >= 10) {
      alert("Vous ne pouvez pas sélectionner plus de 10 colonnes.");
      return;
    }
    
    // Check if we're trying to deselect when we have only 3 headers
    if (header.selected && selectedCount <= 3) {
      alert("Vous devez avoir au moins 3 colonnes sélectionnées.");
      return;
    }
    
    // Update headers
    if (header.id === "numero" && !header.selected) {
      // If selecting "numero", it should be the first
      setListData(prev => ({
        ...prev,
        headers: prev.headers.map(h => 
          h.id === "numero" ? { ...h, selected: true } : h
        )
      }));
    } else {
      // Normal toggle
      if (listData.headers.some(h => h.id === headerId)) {
        setListData(prev => ({
          ...prev,
          headers: prev.headers.map(h => 
            h.id === headerId ? { ...h, selected: !h.selected } : h
          )
        }));
      } else {
        setListData(prev => ({
          ...prev,
          customHeaders: prev.customHeaders.map(h => 
            h.id === headerId ? { ...h, selected: !h.selected } : h
          )
        }));
      }
    }
  };
  
  // Add custom header
  const addCustomHeader = (label) => {
    const newHeader = {
      id: `custom-${Date.now()}`,
      label,
      selected: false,
      required: false,
      priority: listData.headers.length + listData.customHeaders.length + 1,
      isCustom: true
    };
    
    const updatedCustomHeaders = [...listData.customHeaders, newHeader];
    
    setListData(prev => ({
      ...prev,
      customHeaders: updatedCustomHeaders
    }));
    
    // Save to secure storage
    secureLocalStorage.setItem("custom_headers", JSON.stringify(updatedCustomHeaders));
  };
  
  // Update title
  const updateTitle = (titleData) => {
    setListData(prev => ({
      ...prev,
      title: { ...prev.title, ...titleData }
    }));
  };
  
  // Toggle orientation
  const toggleOrientation = () => {
    setListData(prev => ({
      ...prev,
      orientation: prev.orientation === "portrait" ? "landscape" : "portrait"
    }));
  };
  
  // Add students to list
  const addStudentsToList = (selectedStudents) => {
    setListData(prev => ({
      ...prev,
      students: [...prev.students, ...selectedStudents]
    }));
    setShowStudentSelector(false);
  };
  
  // Add ref for PDF generation
  const previewRef = useRef(null);
  
  // Generate PDF
  const generatePDF = () => {
    if (!previewRef.current) return;
    
    const orientation = listData.orientation === "portrait" ? "p" : "l";
    const unit = "mm";
    const format = "a4";
    
    const pdf = new jsPDF(orientation, unit, format);
    
    // Get all pages
    const pages = previewRef.current.querySelectorAll(".a4-page");
    
    const generatePage = (index) => {
      if (index >= pages.length) {
        // All pages processed, save the PDF
        pdf.save(`${listData.name}.pdf`);
        return;
      }
      
      const page = pages[index];
      
      html2canvas(page, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      }).then(canvas => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        
        // Add page if not the first one
        if (index > 0) {
          pdf.addPage();
        }
        
        // Calculate dimensions
        const imgWidth = orientation === "p" ? 210 : 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
        
        // Process next page
        generatePage(index + 1);
      });
    };
    
    // Start generating pages
    generatePage(0);
  };
  
  // Print function
  const printList = () => {
    if (!previewRef.current) return;
    
    const printContent = document.createElement("iframe");
    printContent.style.position = "absolute";
    printContent.style.top = "-9999px";
    printContent.style.left = "-9999px";
    document.body.appendChild(printContent);
    
    const contentDocument = printContent.contentDocument;
    
    // Create print document
    contentDocument.write(`
      <html>
        <head>
          <title>${listData.name}</title>
          <style>
            @page {
              size: ${listData.orientation === "portrait" ? "portrait" : "landscape"};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .page-container {
              page-break-after: always;
            }
            .page-container:last-child {
              page-break-after: avoid;
            }
          </style>
        </head>
        <body>
          ${previewRef.current.innerHTML}
        </body>
      </html>
    `);
    
    contentDocument.close();
    
    printContent.onload = function() {
      printContent.contentWindow.focus();
      printContent.contentWindow.print();
      document.body.removeChild(printContent);
    };
  };
  
  // Save to database
  const saveToDatabase = async () => {
    if (!listData.name || listData.name.length < 6) {
      alert("Le nom de la liste doit contenir au moins 6 caractères");
      return;
    }
    
    try {
      // Save to database via electron API
      await window.electron.saveStudentList({
        ...listData,
        updatedAt: new Date().toISOString()
      });
      
      alert("Liste sauvegardée avec succès dans la base de données");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde de la liste");
    }
  };
  
  // Styles based on theme
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textClass = theme === "dark" ? text_color : "text-gray-700";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const buttonBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  
  return (
    <>
      {showCreatePopup && (
        <CreateListPopup
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setShowCreatePopup(false);
            setView("menu");
          }}
          theme={theme}
          text_color={text_color}
        />
      )}
      
      {!showCreatePopup && (
        <div className="flex flex-col h-full">
          {/* Top toolbar */}
          <div className={`flex justify-between items-center mb-4 p-3 ${bgColor} rounded-lg shadow border ${borderColor}`}>
            <div className="flex items-center">
              <motion.button
                onClick={() => setView("menu")}
                className={`p-2 rounded-full ${buttonBgColor} mr-3`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className={`h-5 w-5 ${textClass}`} />
              </motion.button>
              <h2 className={`text-xl font-semibold ${textClass}`}>{listData.name}</h2>
            </div>
            
            <div className="flex space-x-2">
              <motion.button
                onClick={toggleOrientation}
                className={`p-2 rounded-md ${buttonBgColor} flex items-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={`text-sm mr-1 ${textClass}`}>
                  {listData.orientation === "portrait" ? "Portrait" : "Paysage"}
                </span>
              </motion.button>
              
              <motion.button
                onClick={() => setShowTools(!showTools)}
                className={`p-2 rounded-md ${buttonBgColor} flex items-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className={`h-5 w-5 mr-1 ${textClass}`} />
                <span className={`text-sm ${textClass}`}>Outils</span>
                {showTools ? (
                  <ChevronUp className={`h-4 w-4 ml-1 ${textClass}`} />
                ) : (
                  <ChevronDown className={`h-4 w-4 ml-1 ${textClass}`} />
                )}
              </motion.button>
              
              <motion.button
                onClick={() => setShowStudentSelector(true)}
                className={`p-2 rounded-md bg-blue-600 text-white flex items-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="h-5 w-5 mr-1" />
                <span className="text-sm">Ajouter des élèves</span>
              </motion.button>
              
              <motion.button
                onClick={saveToDatabase}
                className={`p-2 rounded-md bg-green-600 text-white flex items-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="h-5 w-5 mr-1" />
                <span className="text-sm">Enregistrer</span>
              </motion.button>
              
              <motion.button
                onClick={generatePDF}
                className={`p-2 rounded-md ${buttonBgColor} flex items-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className={`h-5 w-5 ${textClass}`} />
              </motion.button>
              
              <motion.button
                onClick={printList}
                className={`p-2 rounded-md ${buttonBgColor} flex items-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Printer className={`h-5 w-5 ${textClass}`} />
              </motion.button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Tools panel */}
            {showTools && (
              <motion.div
                className={`w-full md:w-1/3 ${bgColor} rounded-lg shadow border ${borderColor} p-4`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-3 ${textClass}`}>Titre de la liste</h3>
                  <TitleEditor 
                    title={listData.title} 
                    updateTitle={updateTitle} 
                    theme={theme}
                    text_color={text_color}
                  />
                </div>
                
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-3 ${textClass}`}>Colonnes du tableau</h3>
                  <HeaderSelector 
                    headers={listData.headers}
                    customHeaders={listData.customHeaders}
                    onToggle={handleHeaderToggle}
                    onAddCustom={addCustomHeader}
                    theme={theme}
                    text_color={text_color}
                  />
                </div>
              </motion.div>
            )}
            
            {/* A4 Preview */}
            <div className={`flex-1 ${bgColor} rounded-lg shadow border ${borderColor} p-4 overflow-auto`}>
              <div ref={previewRef}>
                <A4Preview 
                  listData={listData}
                  theme={theme}
                  text_color={text_color}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Student selector popup */}
      {showStudentSelector && (
        <StudentSelector
          db={db}
          onClose={() => setShowStudentSelector(false)}
          onAddStudents={addStudentsToList}
          theme={theme}
          text_color={text_color}
          alreadySelectedIds={listData.students.map(s => s.id)}
        />
      )}
    </>
  );
};

export default StudentListEditor;