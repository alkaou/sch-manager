import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, ChevronDown } from "lucide-react";

const TitleEditor = ({
  title,
  updateTitle,
  theme,
  text_color
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);
  
  // Predefined colors
  const predefinedColors = [
    "#000000", "#333333", "#666666", "#999999", 
    "#1a73e8", "#4285f4", "#34a853", "#fbbc05", "#ea4335",
    "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4",
    "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39",
    "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548"
  ];
  
  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Styles based on theme
  const textClass = theme === "dark" ? text_color : "text-gray-700";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const buttonBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const dropdownBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  
  // Font families
  const fontFamilies = [
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Courier New", label: "Courier New" },
    { value: "Georgia", label: "Georgia" },
    { value: "Verdana", label: "Verdana" },
    { value: "Tahoma", label: "Tahoma" }
  ];
  
  // Font sizes
  const fontSizes = [
    { value: "16px", label: "Petit" },
    { value: "20px", label: "Normal" },
    { value: "24px", label: "Grand" },
    { value: "28px", label: "Très grand" },
    { value: "32px", label: "Énorme" },
    { value: "36px", label: "Géant" }
  ];
  
  // Title styles
  const titleStyles = [
    { value: "style1", label: "Standard" },
    { value: "style2", label: "Élégant" },
    { value: "style3", label: "Moderne" },
    { value: "style4", label: "Classique" },
    { value: "style5", label: "Minimaliste" },
    { value: "style6", label: "Décoratif" }
  ];
  
  return (
    <div className="space-y-3">
      <div>
        <input
          type="text"
          value={title.text}
          onChange={(e) => updateTitle({ text: e.target.value })}
          placeholder="Titre de la liste"
          className={`w-full px-3 py-2 rounded-md border ${borderColor} ${inputBgColor} ${textClass}`}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={`block text-sm mb-1 ${textClass}`}>Style</label>
          <select
            value={title.style}
            onChange={(e) => updateTitle({ style: e.target.value })}
            className={`w-full px-2 py-1 rounded-md border ${borderColor} ${inputBgColor} ${textClass}`}
          >
            {titleStyles.map(style => (
              <option key={style.value} value={style.value}>{style.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className={`block text-sm mb-1 ${textClass}`}>Police</label>
          <select
            value={title.fontFamily}
            onChange={(e) => updateTitle({ fontFamily: e.target.value })}
            className={`w-full px-2 py-1 rounded-md border ${borderColor} ${inputBgColor} ${textClass}`}
          >
            {fontFamilies.map(font => (
              <option key={font.value} value={font.value}>{font.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={`block text-sm mb-1 ${textClass}`}>Taille</label>
          <select
            value={title.fontSize}
            onChange={(e) => updateTitle({ fontSize: e.target.value })}
            className={`w-full px-2 py-1 rounded-md border ${borderColor} ${inputBgColor} ${textClass}`}
          >
            {fontSizes.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className={`block text-sm mb-1 ${textClass}`}>Couleur</label>
          <div className="relative" ref={colorPickerRef}>
            <div 
              className={`flex items-center p-1 rounded-md border ${borderColor} ${inputBgColor} cursor-pointer`}
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <div 
                className="w-6 h-6 rounded mr-2" 
                style={{ backgroundColor: title.color }}
              />
              <span className={`flex-1 ${textClass}`}>{title.color}</span>
              <ChevronDown className={`h-4 w-4 ${textClass}`} />
            </div>
            
            <AnimatePresence>
              {showColorPicker && (
                <motion.div 
                  className={`absolute z-10 mt-1 p-2 rounded-md border ${borderColor} ${dropdownBgColor} shadow-lg`}
                  style={{ width: "calc(100% + 50px)" }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="grid grid-cols-5 gap-2 mb-2">
                    {predefinedColors.map(color => (
                      <div 
                        key={color}
                        className={`w-6 h-6 rounded cursor-pointer ${title.color === color ? 'ring-2 ring-blue-500' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          updateTitle({ color });
                          setShowColorPicker(false);
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <input
                      type="color"
                      value={title.color}
                      onChange={(e) => updateTitle({ color: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={title.color}
                      onChange={(e) => updateTitle({ color: e.target.value })}
                      className={`flex-1 ml-2 px-2 py-1 rounded-md border ${borderColor} ${inputBgColor} ${textClass}`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <div className="flex space-x-1">
          <motion.button
            onClick={() => updateTitle({ position: "left" })}
            className={`p-2 rounded ${buttonBgColor} ${title.position === "left" ? "ring-2 ring-blue-500" : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AlignLeft className={`h-4 w-4 ${textClass}`} />
          </motion.button>
          
          <motion.button
            onClick={() => updateTitle({ position: "center" })}
            className={`p-2 rounded ${buttonBgColor} ${title.position === "center" ? "ring-2 ring-blue-500" : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AlignCenter className={`h-4 w-4 ${textClass}`} />
          </motion.button>
          
          <motion.button
            onClick={() => updateTitle({ position: "right" })}
            className={`p-2 rounded ${buttonBgColor} ${title.position === "right" ? "ring-2 ring-blue-500" : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AlignRight className={`h-4 w-4 ${textClass}`} />
          </motion.button>
        </div>
        
        <div className="flex space-x-1">
          <motion.button
            onClick={() => updateTitle({ bold: !title.bold })}
            className={`p-2 rounded ${buttonBgColor} ${title.bold ? "ring-2 ring-blue-500" : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bold className={`h-4 w-4 ${textClass}`} />
          </motion.button>
          
          <motion.button
            onClick={() => updateTitle({ italic: !title.italic })}
            className={`p-2 rounded ${buttonBgColor} ${title.italic ? "ring-2 ring-blue-500" : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Italic className={`h-4 w-4 ${textClass}`} />
          </motion.button>
          
          <motion.button
            onClick={() => updateTitle({ underline: !title.underline })}
            className={`p-2 rounded ${buttonBgColor} ${title.underline ? "ring-2 ring-blue-500" : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Underline className={`h-4 w-4 ${textClass}`} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TitleEditor;