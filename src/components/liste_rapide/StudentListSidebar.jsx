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
  onUpdatecountryInfosHeader,
  isEmployeeList = false,
  theme,
  textClass,
  appBgColor
}) => {
  const [expandedSections, setExpandedSections] = useState({
    headers: true,
    customHeaders: false,
    titleStyle: false,
    orientation: false,
    customMessage: false,
    countryInfosHeader: true,
    lang: 'fr', // en, br
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

  // Standard headers for students
  const standardStudentHeaders = [
    "N°",
    "Prénom",
    "Nom",
    "Matricule",
    "Classe",
    "Date & Lieu de naissance",
    "Âge",
    "Sexe",
    "Père",
    "Mère",
    "Contact",
    "Moyenne",
    "Signature",
  ];

  // Standard headers for employees
  const standardEmployeeHeaders = [
    "N°",
    "Prénom",
    "Nom",
    "Matricule",
    "Sexe",
    "Contact",
    "Date de naissance",
    "Date de début",
    "Postes",
    "Salaire",
    "Spécialité",
    "Classes",
    "Statut",
    "Signature",
  ];

  // Use the appropriate headers based on list type
  const standardHeaders = isEmployeeList ? standardEmployeeHeaders : standardStudentHeaders;

  // Count selected headers
  const selectedHeadersCount = list.headers.length;

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
  const sectionBgColor = `${appBgColor} ${textClass}`;
  const borderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const inputBgColor = theme === "dark" ? "bg-gray-600" : "bg-gray-300 bg-opacity-50 text-gray-700";
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonSecondary = theme === "dark" ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800";

  return (
    <div className={`p-4 ${textClass} ${appBgColor} h-full`}>
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
                        const currentSize = parseInt(list.title.style.fontSize) || 16;
                        if (currentSize > 12) {
                          onUpdateTitle({ style: { ...list.title.style, fontSize: currentSize - 2 } });
                        }
                      }}
                      className={`p-2 rounded-l-lg ${buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={(parseInt(list.title.style.fontSize) || 16) <= 12}
                    >
                      <Minus size={16} />
                    </motion.button>
                    <select
                      value={parseInt(list.title.style.fontSize) || 16}
                      onChange={(e) => onUpdateTitle({ style: { ...list.title.style, fontSize: parseInt(e.target.value) } })}
                      className={`flex-1 p-2 border-t border-b ${borderColor} ${inputBgColor} text-center`}
                    >
                      {fontSizes.map(size => (
                        <option key={size} value={size}>{size}px</option>
                      ))}
                    </select>
                    <motion.button
                      onClick={() => {
                        const currentSize = parseInt(list.title.style.fontSize) || 16;
                        if (currentSize < 48) {
                          onUpdateTitle({ style: { ...list.title.style, fontSize: currentSize + 2 } });
                        }
                      }}
                      className={`p-2 rounded-r-lg ${buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={(parseInt(list.title.style.fontSize) || 16) >= 48}
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
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: list.title.style.border ? undefined : '2px solid black',
                          padding: list.title.style.border ? undefined : '8px',
                          borderRadius: list.title.style.border ? undefined : '0px'
                        }
                      })}
                      className={`p-2 rounded-lg flex items-center justify-center ${list.title.style.border ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-5 h-5 border-2 border-current mr-2"></div>
                      Cadre complet
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: undefined,
                          borderBottom: list.title.style.borderBottom ? undefined : '2px solid black',
                          borderTop: undefined,
                          padding: list.title.style.borderBottom ? undefined : '4px 0',
                        }
                      })}
                      className={`p-2 rounded-lg flex items-center justify-center ${list.title.style.borderBottom ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-5 h-5 border-b-2 border-current mr-2"></div>
                      Souligné
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: undefined,
                          borderTop: list.title.style.borderTop ? undefined : '2px solid black',
                          padding: list.title.style.borderTop ? undefined : '4px 0',
                        }
                      })}
                      className={`p-2 rounded-lg flex items-center justify-center ${list.title.style.borderTop ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-5 h-5 border-t-2 border-current mr-2"></div>
                      Ligne supérieure
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: undefined,
                          borderBottom: undefined,
                          borderTop: undefined,
                          borderRadius: undefined,
                          boxShadow: list.title.style.boxShadow ? undefined : '0 2px 10px rgba(0,0,0,0.2)',
                          padding: list.title.style.boxShadow ? undefined : '8px',
                        }
                      })}
                      className={`p-2 rounded-lg flex items-center justify-center ${list.title.style.boxShadow ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-5 h-5 shadow-md mr-2 bg-current opacity-20"></div>
                      Ombre
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: list.title.style.border && list.title.style.borderRadius === '8px' ? undefined : '2px solid black',
                          borderRadius: '8px',
                          padding: list.title.style.border && list.title.style.borderRadius === '8px' ? undefined : '8px',
                        }
                      })}
                      className={`p-2 rounded-lg flex items-center justify-center ${list.title.style.border && list.title.style.borderRadius === '8px' ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-5 h-5 border-2 border-current rounded-lg mr-2"></div>
                      Arrondi
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          backgroundColor: list.title.style.backgroundColor ? undefined : theme === 'dark' ? '#374151' : '#f3f4f6',
                          padding: list.title.style.backgroundColor ? undefined : '8px',
                          borderRadius: list.title.style.backgroundColor ? undefined : '4px',
                        }
                      })}
                      className={`p-2 rounded-lg flex items-center justify-center ${list.title.style.backgroundColor ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`w-5 h-5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} mr-2`}></div>
                      Fond coloré
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          border: list.title.style.border && list.title.style.borderStyle === 'double' ? undefined : '4px double black',
                          padding: list.title.style.border && list.title.style.borderStyle === 'double' ? undefined : '6px',
                        }
                      })}
                      className={`p-2 rounded-lg flex items-center justify-center ${list.title.style.border && list.title.style.border.includes('double') ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-5 h-5 border-4 border-double border-current mr-2"></div>
                      Double ligne
                    </motion.button>

                    <motion.button
                      onClick={() => onUpdateTitle({
                        style: {
                          ...list.title.style,
                          background: list.title.style.background && list.title.style.background.includes('gradient') ? undefined :
                            `linear-gradient(to right, ${theme === 'dark' ? '#4B5563, #1F2937' : '#E5E7EB, #D1D5DB'})`,
                          padding: list.title.style.background && list.title.style.background.includes('gradient') ? undefined : '8px',
                          borderRadius: list.title.style.background && list.title.style.background.includes('gradient') ? undefined : '4px',
                        }
                      })}
                      className={`p-2 rounded-lg flex items-center justify-center ${list.title.style.background && list.title.style.background.includes('gradient') ? buttonPrimary : buttonSecondary}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`w-5 h-5 bg-gradient-to-r ${theme === 'dark' ? 'from-gray-600 to-gray-800' : 'from-gray-200 to-gray-400'} mr-2`}></div>
                      Dégradé
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
            <h3 className="font-medium">En-têtes standard ({selectedHeadersCount}/10) {isEmployeeList ? "- Employés" : "- Élèves"}</h3>
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
                    if (!savedCustomHeaders.includes(customHeaderInput)) {
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
            <div className="p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateOrientation('portrait')}
                  className={`p-3 rounded-lg flex items-center justify-center ${
                    list.orientation === 'portrait' ? buttonPrimary : buttonSecondary
                  }`}
                >
                  <Layout size={20} className="mr-2" />
                  Portrait
                </button>
                <button
                  onClick={() => onUpdateOrientation('landscape')}
                  className={`p-3 rounded-lg flex items-center justify-center ${
                    list.orientation === 'landscape' ? buttonPrimary : buttonSecondary
                  }`}
                >
                  <Layout size={20} className="mr-2 rotate-90" />
                  Paysage
                </button>
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
                  onChange={(e) => onUpdateCustomMessage({
                    ...list.customMessage,
                    show: e.target.checked
                  })}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="show-custom-message">Afficher un message personnalisé</label>
              </div>

              {list.customMessage.show && (
                <>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Texte du message</label>
                    <input
                      type="text"
                      value={list.customMessage.text}
                      onChange={(e) => onUpdateCustomMessage({
                        ...list.customMessage,
                        text: e.target.value
                      })}
                      placeholder="Ex: Le Directeur"
                      className={`w-full p-2 rounded-lg border ${borderColor} ${inputBgColor}`}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">Votre Prénom & Nom</label>
                    <input
                      type="text"
                      value={list.customMessage.name}
                      onChange={(e) => onUpdateCustomMessage({
                        ...list.customMessage,
                        name: e.target.value
                      })}
                      placeholder="Ex: Mamadou Dembélé"
                      className={`w-full p-2 rounded-lg border ${borderColor} ${inputBgColor}`}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">Date</label>
                    <input
                      type="date"
                      value={list.customMessage.date}
                      onChange={(e) => onUpdateCustomMessage({
                        ...list.customMessage,
                        date: e.target.value
                      })}
                      className={`w-full p-2 rounded-lg border ${borderColor} ${inputBgColor}`}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Country Infos Header */}
        <div className={`mb-4 border ${borderColor} rounded-lg overflow-hidden`}>
          <div
            className={`${sectionBgColor} p-3 flex justify-between items-center cursor-pointer`}
            onClick={() => toggleSection('countryInfosHeader')}
          >
            <h3 className="font-medium">En-tête de pays</h3>
            {expandedSections.countryInfosHeader ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.countryInfosHeader && (
            <div className="p-3 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-country-infos"
                  checked={list.countryInfosHeader.show}
                  onChange={(e) => onUpdatecountryInfosHeader({
                    ...list.countryInfosHeader,
                    show: e.target.checked
                  })}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="show-country-infos">Afficher l'en-tête de pays</label>
              </div>

              {list.countryInfosHeader.show && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is-cap"
                    checked={list.countryInfosHeader.isCAP}
                    onChange={(e) => onUpdatecountryInfosHeader({
                      ...list.countryInfosHeader,
                      isCAP: e.target.checked
                    })}
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="is-cap">Centre d'Animation Pédagogique (CAP) au lieu d'Académie</label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentListSidebar;