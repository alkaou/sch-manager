import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, Layout, Trash2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette, Minus } from 'lucide-react';
import secureLocalStorage from "react-secure-storage";
import { predefinedColors } from './predefinedColors';

const StudentListSidebar = ({
  list,
  onToggleHeader,
  onAddCustomHeader,
  customHeaderInput,
  setCustomHeaderInput,
  onUpdateTitle,
  onUpdateOrientation,
  onUpdateCustomMessage,
  theme,
  textClass
}) => {
  const [expandedSections, setExpandedSections] = useState({
    headers: true,
    customHeaders: false,
    titleStyle: false,
    orientation: false,
    customMessage: false
  });
  const [savedCustomHeaders, setSavedCustomHeaders] = useState([]);
  // Add this new state for color picker
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Load custom headers from local storage
  useEffect(() => {
    const headers = secureLocalStorage.getItem("customListHeaders") || [];
    setSavedCustomHeaders(headers);
  }, []);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Standard headers
  const standardHeaders = [
    "N°",
    "Prénom",
    "Nom",
    "Matricule",
    "Classe",
    "Date de naissance",
    "Âge",
    "Sexe",
    "Père",
    "Mère",
    "Contact",
    "Moyenne",
    "Signature",
  ];

  // Count selected headers
  const selectedHeadersCount = list.headers.length + list.customHeaders.length;

  // Add this new function to handle custom header deletion
  const handleDeleteCustomHeader = (header) => {
    // Remove from current list
    if (list.customHeaders.includes(header)) {
      onToggleHeader(header, true);
    }

    // Remove from saved headers
    const updatedHeaders = savedCustomHeaders.filter(h => h !== header);
    setSavedCustomHeaders(updatedHeaders);
    secureLocalStorage.setItem("customListHeaders", updatedHeaders);
  };

  // Check if a header is selected
  const isHeaderSelected = (header, isCustom = false) => {
    return isCustom
      ? list.customHeaders.includes(header)
      : list.headers.includes(header);
  };

  // Font families
  const fontFamilies = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Helvetica",
    "Tahoma",
    "Trebuchet MS",
    "Impact"
  ];

  // Font sizes
  const fontSizes = [12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48];

  // Styles based on theme
  const sectionBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const inputBgColor = theme === "dark" ? "bg-gray-600" : "bg-white";
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonSecondary = theme === "dark" ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800";

  return (
    <div className={`p-4 ${textClass} h-full`}>
      <h2 className="text-lg font-semibold mb-4">Paramètres de la liste</h2>

      <div className="max-h-500 overflow-y-auto scrollbar-custom">

        {/* Title Style Section */}
        <div className={`mb-4 border ${borderColor} rounded-lg overflow-hidden`}>
          <div
            className={`${sectionBgColor} p-3 flex justify-between items-center cursor-pointer`}
            onClick={() => toggleSection('titleStyle')}
          >
            <h3 className="font-medium">Style du titre</h3>
            {expandedSections.titleStyle ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-custom">
            {expandedSections.titleStyle && (
              <div className="p-3 space-y-3">
                {/* Title Text */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Texte du titre</label>
                  <input
                    type="text"
                    value={list.title.text}
                    onChange={(e) => onUpdateTitle({ text: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${borderColor} ${inputBgColor}`}
                  />
                </div>

                {/* Font Family */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Police</label>
                  <select
                    value={list.title.style.fontFamily}
                    onChange={(e) => onUpdateTitle({ style: { ...list.title.style, fontFamily: e.target.value } })}
                    className={`w-full p-2 rounded-lg border ${borderColor} ${inputBgColor}`}
                  >
                    {fontFamilies.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Taille</label>
                  <div className="flex items-center">
                    <motion.button
                      onClick={() => {
                        const currentSize = list.title.style.fontSize;
                        if (currentSize > 12) {
                          onUpdateTitle({ style: { ...list.title.style, fontSize: currentSize - 2 } });
                        }
                      }}
                      className={`p-2 rounded-l-lg ${buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={list.title.style.fontSize <= 12}
                    >
                      <Minus size={16} />
                    </motion.button>
                    <select
                      value={list.title.style.fontSize}
                      onChange={(e) => onUpdateTitle({ style: { ...list.title.style, fontSize: parseInt(e.target.value) } })}
                      className={`flex-1 p-2 border-t border-b ${borderColor} ${inputBgColor} text-center`}
                    >
                      {fontSizes.map(size => (
                        <option key={size} value={size}>{size}px</option>
                      ))}
                    </select>
                    <motion.button
                      onClick={() => {
                        const currentSize = list.title.style.fontSize;
                        if (currentSize < 48) {
                          onUpdateTitle({ style: { ...list.title.style, fontSize: currentSize + 2 } });
                        }
                      }}
                      className={`p-2 rounded-r-lg ${buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={list.title.style.fontSize >= 48}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                </div>

                {/* Text Style Buttons */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Style de texte</label>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          fontWeight: list.title.style.fontWeight === 'bold' ? 'normal' : 'bold'
                        }
                      })}
                      className={`p-2 rounded-lg flex-1 flex justify-center ${list.title.style.fontWeight === 'bold' ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Gras"
                    >
                      <Bold size={18} />
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          fontStyle: list.title.style.fontStyle === 'italic' ? 'normal' : 'italic'
                        }
                      })}
                      className={`p-2 rounded-lg flex-1 flex justify-center ${list.title.style.fontStyle === 'italic' ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Italique"
                    >
                      <Italic size={18} />
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          textDecoration: list.title.style.textDecoration === 'underline' ? 'none' : 'underline'
                        }
                      })}
                      className={`p-2 rounded-lg flex-1 flex justify-center ${list.title.style.textDecoration === 'underline' ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Souligné"
                    >
                      <Underline size={18} />
                    </motion.button>
                  </div>
                </div>

                {/* Text Alignment */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Alignement</label>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => onUpdateTitle({ style: { ...list.title.style, textAlign: 'left' } })}
                      className={`p-2 rounded-lg flex-1 flex justify-center ${list.title.style.textAlign === 'left' ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Aligné à gauche"
                    >
                      <AlignLeft size={18} />
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({ style: { ...list.title.style, textAlign: 'center' } })}
                      className={`p-2 rounded-lg flex-1 flex justify-center ${list.title.style.textAlign === 'center' ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Centré"
                    >
                      <AlignCenter size={18} />
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({ style: { ...list.title.style, textAlign: 'right' } })}
                      className={`p-2 rounded-lg flex-1 flex justify-center ${list.title.style.textAlign === 'right' ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Aligné à droite"
                    >
                      <AlignRight size={18} />
                    </motion.button>
                  </div>
                </div>

                {/* Title Border/Frame Styles - NEW SECTION */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Encadrement du titre</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: 'none',
                          borderRadius: '0',
                          padding: '0',
                          boxShadow: 'none',
                          background: 'none'
                        }
                      })}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${!list.title.style.border && !list.title.style.boxShadow ? buttonPrimary : buttonSecondary
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Aucun"
                    >
                      <div className="w-12 h-6 flex items-center justify-center text-xs">Aucun</div>
                      <span className="text-xs mt-1">Aucun</span>
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: `1px solid ${list.title.style.color || '#000000'}`,
                          borderRadius: '0',
                          padding: '5px 10px',
                          boxShadow: 'none',
                          background: 'none'
                        }
                      })}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${list.title.style.border && !list.title.style.boxShadow ? buttonPrimary : buttonSecondary
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Bordure simple"
                    >
                      <div className="w-12 h-6 border border-current flex items-center justify-center text-xs">Abc</div>
                      <span className="text-xs mt-1">Simple</span>
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: 'none',
                          borderRadius: '4px',
                          padding: '5px 10px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                          background: 'none'
                        }
                      })}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${!list.title.style.border && list.title.style.boxShadow ? buttonPrimary : buttonSecondary
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Ombre portée"
                    >
                      <div className="w-12 h-6 shadow-md flex items-center justify-center text-xs">Abc</div>
                      <span className="text-xs mt-1">Ombre</span>
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: `2px solid ${list.title.style.color || '#000000'}`,
                          borderRadius: '8px',
                          padding: '5px 10px',
                          boxShadow: 'none',
                          background: 'none'
                        }
                      })}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${list.title.style.border && list.title.style.borderRadius === '8px' ? buttonPrimary : buttonSecondary
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Bordure arrondie"
                    >
                      <div className="w-12 h-6 border-2 border-current rounded-lg flex items-center justify-center text-xs">Abc</div>
                      <span className="text-xs mt-1">Arrondi</span>
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: `1px solid ${list.title.style.color || '#000000'}`,
                          borderRadius: '4px',
                          padding: '5px 10px',
                          boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                          background: 'none'
                        }
                      })}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${list.title.style.border && list.title.style.boxShadow ? buttonPrimary : buttonSecondary
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Bordure avec ombre"
                    >
                      <div className="w-12 h-6 border border-current rounded shadow-md flex items-center justify-center text-xs">Abc</div>
                      <span className="text-xs mt-1">Complet</span>
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: 'none',
                          borderRadius: '0',
                          padding: '5px 10px',
                          boxShadow: 'none',
                          borderBottom: `2px solid ${list.title.style.color || '#000000'}`
                        }
                      })}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${list.title.style.borderBottom && !list.title.style.borderTop ? buttonPrimary : buttonSecondary
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Souligné épais"
                    >
                      <div className="w-12 h-6 border-b-2 border-current flex items-center justify-center text-xs">Abc</div>
                      <span className="text-xs mt-1">Souligné</span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: 'none',
                          borderRadius: '0',
                          padding: '5px 10px',
                          boxShadow: 'none',
                          borderTop: `2px solid ${list.title.style.color || '#000000'}`,
                          borderBottom: `2px solid ${list.title.style.color || '#000000'}`
                        }
                      })}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${list.title.style.borderTop && list.title.style.borderBottom ? buttonPrimary : buttonSecondary
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Double ligne"
                    >
                      <div className="w-12 h-6 border-t-2 border-b-2 border-current flex items-center justify-center text-xs">Abc</div>
                      <span className="text-xs mt-1">Double</span>
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: 'none',
                          borderRadius: '0',
                          padding: '5px 15px',
                          boxShadow: 'none',
                          background: `linear-gradient(to right, ${list.title.style.color || '#000000'}, transparent)`
                        }
                      })}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${list.title.style.background && list.title.style.background.includes('linear-gradient') ? buttonPrimary : buttonSecondary
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Dégradé"
                    >
                      <div className="w-12 h-6 bg-gradient-to-r from-current to-transparent flex items-center justify-center text-xs">Abc</div>
                      <span className="text-xs mt-1">Dégradé</span>
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: 'none',
                          borderRadius: '0',
                          padding: '5px 10px',
                          boxShadow: 'none',
                          background: list.title.style.color || '#000000',
                          color: theme === 'dark' ? '#000000' : '#ffffff'
                        }
                      })}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${list.title.style.background && !list.title.style.background.includes('linear-gradient') ? buttonPrimary : buttonSecondary
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Fond plein"
                    >
                      <div className="w-12 h-6 bg-current text-white flex items-center justify-center text-xs">Abc</div>
                      <span className="text-xs mt-1">Fond</span>
                    </motion.button>
                  </div>
                </div>

                {/* Border Width/Style - NEW SECTION */}
                {(list.title.style.border || list.title.style.borderBottom || list.title.style.borderTop) && (
                  <div>
                    <label className="block mb-1 text-sm font-medium">Style de bordure</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-1 text-xs">Épaisseur</label>
                        <select
                          value={parseInt(list.title.style.border?.split('px')[0] || list.title.style.borderBottom?.split('px')[0] || '1')}
                          onChange={(e) => {
                            const width = e.target.value + 'px';
                            if (list.title.style.border) {
                              const borderParts = list.title.style.border.split(' ');
                              borderParts[0] = width;
                              onUpdateTitle({ style: { ...list.title.style, border: borderParts.join(' ') } });
                            } else if (list.title.style.borderBottom) {
                              const borderParts = list.title.style.borderBottom.split(' ');
                              borderParts[0] = width;
                              onUpdateTitle({ style: { ...list.title.style, borderBottom: borderParts.join(' ') } });
                            } else if (list.title.style.borderTop) {
                              const borderParts = list.title.style.borderTop.split(' ');
                              borderParts[0] = width;
                              onUpdateTitle({ style: { ...list.title.style, borderTop: borderParts.join(' ') } });
                            }
                          }}
                          className={`w-full p-2 rounded-lg border ${borderColor} ${inputBgColor}`}
                        >
                          {[1, 2, 3, 4, 5].map(size => (
                            <option key={size} value={size}>{size}px</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1 text-xs">Type</label>
                        <select
                          value={list.title.style.border?.split(' ')[1] || list.title.style.borderBottom?.split(' ')[1] || 'solid'}
                          onChange={(e) => {
                            const style = e.target.value;
                            if (list.title.style.border) {
                              const borderParts = list.title.style.border.split(' ');
                              borderParts[1] = style;
                              onUpdateTitle({ style: { ...list.title.style, border: borderParts.join(' ') } });
                            } else if (list.title.style.borderBottom) {
                              const borderParts = list.title.style.borderBottom.split(' ');
                              borderParts[1] = style;
                              onUpdateTitle({ style: { ...list.title.style, borderBottom: borderParts.join(' ') } });
                            } else if (list.title.style.borderTop) {
                              const borderParts = list.title.style.borderTop.split(' ');
                              borderParts[1] = style;
                              onUpdateTitle({ style: { ...list.title.style, borderTop: borderParts.join(' ') } });
                            }
                          }}
                          className={`w-full p-2 rounded-lg border ${borderColor} ${inputBgColor}`}
                        >
                          <option value="solid">Plein</option>
                          <option value="dashed">Tirets</option>
                          <option value="dotted">Pointillés</option>
                          <option value="double">Double</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shadow Intensity - NEW SECTION */}
                {list.title.style.boxShadow && (
                  <div>
                    <label className="block mb-1 text-sm font-medium">Intensité de l'ombre</label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={parseInt(list.title.style.boxShadow?.match(/\d+px/g)?.[1] || '5')}
                        onChange={(e) => {
                          const intensity = parseInt(e.target.value);
                          onUpdateTitle({
                            style: {
                              ...list.title.style,
                              boxShadow: `0 ${intensity / 5}px ${intensity}px rgba(0,0,0,${intensity / 30})`
                            }
                          });
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Text Color with advanced color picker */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Couleur</label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-8 w-8 rounded cursor-pointer border border-gray-300 flex items-center justify-center"
                      style={{ backgroundColor: list.title.style.color || '#000000' }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                      <Palette size={16} className="text-white drop-shadow-md" />
                    </div>
                    <input
                      type="text"
                      value={list.title.style.color}
                      onChange={(e) => onUpdateTitle({ style: { ...list.title.style, color: e.target.value } })}
                      className={`flex-1 p-2 rounded-lg border ${borderColor} ${inputBgColor}`}
                    />
                  </div>

                  {/* Color palette */}
                  {showColorPicker && (
                    <div className={`mt-2 p-2 border ${borderColor} rounded-lg ${inputBgColor} grid grid-cols-10 gap-1`}>
                      {predefinedColors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-sm cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            onUpdateTitle({ style: { ...list.title.style, color } });
                            setShowColorPicker(false);
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional text styling options */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Options avancées</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="text-shadow"
                        checked={list.title.style.textShadow !== 'none' && list.title.style.textShadow !== undefined}
                        onChange={(e) => onUpdateTitle({
                          style: {
                            ...list.title.style,
                            textShadow: e.target.checked ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none'
                          }
                        })}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="text-shadow" className="text-sm">Ombre du texte</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="text-uppercase"
                        checked={list.title.style.textTransform === 'uppercase'}
                        onChange={(e) => onUpdateTitle({
                          style: {
                            ...list.title.style,
                            textTransform: e.target.checked ? 'uppercase' : 'none'
                          }
                        })}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="text-uppercase" className="text-sm">MAJUSCULES</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="text-letterspacing"
                        checked={list.title.style.letterSpacing !== 'normal' && list.title.style.letterSpacing !== undefined}
                        onChange={(e) => onUpdateTitle({
                          style: {
                            ...list.title.style,
                            letterSpacing: e.target.checked ? '2px' : 'normal'
                          }
                        })}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="text-letterspacing" className="text-sm">Espacement</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="text-border"
                        checked={list.title.style.WebkitTextStroke !== undefined}
                        onChange={(e) => onUpdateTitle({
                          style: {
                            ...list.title.style,
                            WebkitTextStroke: e.target.checked ? '1px rgba(0,0,0,0.5)' : undefined
                          }
                        })}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="text-border" className="text-sm">Contour</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Headers Section */}
        <div className={`mb-4 border ${borderColor} rounded-lg overflow-hidden`}>
          <div
            className={`${sectionBgColor} p-3 flex justify-between items-center cursor-pointer`}
            onClick={() => toggleSection('headers')}
          >
            <h3 className="font-medium">En-têtes standard ({selectedHeadersCount}/10)</h3>
            {expandedSections.headers ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.headers && (
            <div className="p-3">
              <p className="text-sm mb-2 opacity-75">
                Sélectionnez jusqu'à 10 en-têtes (Prénom et Nom sont obligatoires)
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-custom">
                {standardHeaders.map(header => (
                  <div key={header} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`header-${header}`}
                      checked={isHeaderSelected(header)}
                      onChange={() => onToggleHeader(header)}
                      disabled={header === "Prénom" || header === "Nom"}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor={`header-${header}`} className="cursor-pointer">
                      {header}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Custom Headers Section */}
        <div className={`mb-4 border ${borderColor} rounded-lg overflow-hidden`}>
          <div
            className={`${sectionBgColor} p-3 flex justify-between items-center cursor-pointer`}
            onClick={() => toggleSection('customHeaders')}
          >
            <h3 className="font-medium">En-têtes personnalisés</h3>
            {expandedSections.customHeaders ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.customHeaders && (
            <div className="p-3">
              <div className="flex mb-3">
                <input
                  type="text"
                  value={customHeaderInput}
                  onChange={(e) => setCustomHeaderInput(e.target.value)}
                  placeholder="Nouvel en-tête..."
                  className={`flex-1 p-2 rounded-l-lg border ${borderColor} ${inputBgColor}`}
                />
                <motion.button
                  onClick={() => {
                    onAddCustomHeader(customHeaderInput);
                    if (!savedCustomHeaders.includes(customHeaderInput)){
                      setSavedCustomHeaders([...savedCustomHeaders, customHeaderInput])
                    }
                  }}
                  disabled={!customHeaderInput.trim()}
                  className={`${buttonPrimary} px-3 py-2 rounded-r-lg flex items-center ${!customHeaderInput.trim() ? 'opacity-50' : ''}`}
                  whileHover={customHeaderInput.trim() ? { scale: 1.05 } : {}}
                  whileTap={customHeaderInput.trim() ? { scale: 0.95 } : {}}
                >
                  <Plus size={20} />
                </motion.button>
              </div>

              {savedCustomHeaders.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-hidden">
                  {savedCustomHeaders.map(header => (
                    <div key={header} className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <input
                          type="checkbox"
                          id={`custom-header-${header}`}
                          checked={isHeaderSelected(header, true)}
                          onChange={() => onToggleHeader(header, true)}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor={`custom-header-${header}`} className="cursor-pointer flex-1">
                          {header}
                        </label>
                      </div>
                      <motion.button
                        onClick={() => handleDeleteCustomHeader(header)}
                        className={`p-1 text-red-500 hover:text-red-700 rounded-full`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}

              {savedCustomHeaders.length === 0 && (
                <p className="text-sm opacity-75">
                  Aucun en-tête personnalisé enregistré
                </p>
              )}
            </div>
          )}
        </div>

        {/* Orientation Section */}
        <div className={`mb-4 border ${borderColor} rounded-lg overflow-hidden`}>
          <div
            className={`${sectionBgColor} p-3 flex justify-between items-center cursor-pointer`}
            onClick={() => toggleSection('orientation')}
          >
            <h3 className="font-medium">Orientation de la page</h3>
            {expandedSections.orientation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.orientation && (
            <div className="p-3">
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => onUpdateOrientation('portrait')}
                  className={`flex-1 p-2 rounded-lg flex items-center justify-center ${list.orientation === 'portrait' ? buttonPrimary : buttonSecondary}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Layout size={20} className="mr-2" />
                  Portrait
                </motion.button>

                <motion.button
                  onClick={() => onUpdateOrientation('landscape')}
                  className={`flex-1 p-2 rounded-lg flex items-center justify-center ${list.orientation === 'landscape' ? buttonPrimary : buttonSecondary}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Layout size={20} className="mr-2 transform rotate-90" />
                  Paysage
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Custom Message Section */}
        <div className={`mb-4 border ${borderColor} rounded-lg overflow-hidden`}>
          <div
            className={`${sectionBgColor} p-3 flex justify-between items-center cursor-pointer`}
            onClick={() => toggleSection('customMessage')}
          >
            <h3 className="font-medium">Message personnalisé</h3>
            {expandedSections.customMessage ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.customMessage && (
            <div className="p-3 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-custom-message"
                  checked={list.customMessage.show}
                  onChange={(e) => onUpdateCustomMessage({ ...list.customMessage, show: e.target.checked })}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="show-custom-message">Afficher le message personnalisé</label>
              </div>

              {list.customMessage.show && (
                <>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Texte</label>
                    <input
                      type="text"
                      value={list.customMessage.text}
                      onChange={(e) => onUpdateCustomMessage({ ...list.customMessage, text: e.target.value })}
                      placeholder="Ex: Le Directeur"
                      className={`w-full p-2 rounded-lg border ${borderColor} ${inputBgColor}`}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">Date</label>
                    <input
                      type="date"
                      value={list.customMessage.date}
                      onChange={(e) => onUpdateCustomMessage({ ...list.customMessage, date: e.target.value })}
                      className={`w-full p-2 rounded-lg border ${borderColor} ${inputBgColor}`}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default StudentListSidebar;