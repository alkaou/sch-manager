/**
 * Composant HelpModal - Modal d'aide pour expliquer Fatoumata
 * 
 * Affiche un guide complet sur l'utilisation de l'IA Fatoumata
 * avec des animations modernes et du contenu traduit.
 * 
 * Développé par Alkaou Dembélé pour SchoolManager (Entreprise Malienne)
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageCircle,
  Upload,
  Keyboard,
  History,
  Copy,
  Volume2,
  RotateCcw,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Database,
  Users,
  GraduationCap
} from "lucide-react";
import { useTheme, useLanguage } from "../contexts";
import { translate } from "./ia_translator.js";

const HelpModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === "dark";
  
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedFeature, setExpandedFeature] = useState(null);

  const sections = [
    {
      id: "overview",
      icon: Sparkles,
      title: translate("help_overview", language),
      color: "blue"
    },
    {
      id: "features",
      icon: MessageCircle,
      title: translate("help_features", language),
      color: "green"
    },
    {
      id: "shortcuts",
      icon: Keyboard,
      title: translate("help_shortcuts", language),
      color: "purple"
    },
    {
      id: "files",
      icon: Upload,
      title: translate("help_files", language),
      color: "orange"
    }
  ];

  const features = [
    {
      icon: Database,
      title: translate("help_feature_database", language),
      description: translate("help_feature_database_desc", language),
      color: "blue"
    },
    {
      icon: Users,
      title: translate("help_feature_students", language),
      description: translate("help_feature_students_desc", language),
      color: "green"
    },
    {
      icon: GraduationCap,
      title: translate("help_feature_management", language),
      description: translate("help_feature_management_desc", language),
      color: "purple"
    },
    {
      icon: Copy,
      title: translate("help_feature_copy", language),
      description: translate("help_feature_copy_desc", language),
      color: "orange"
    },
    {
      icon: Volume2,
      title: translate("help_feature_audio", language),
      description: translate("help_feature_audio_desc", language),
      color: "pink"
    },
    {
      icon: RotateCcw,
      title: translate("help_feature_regenerate", language),
      description: translate("help_feature_regenerate_desc", language),
      color: "indigo"
    }
  ];

  const shortcuts = [
    {
      keys: ["Enter"],
      description: translate("help_shortcut_send", language)
    },
    {
      keys: ["Ctrl", "Enter"],
      description: translate("help_shortcut_newline", language)
    },
    {
      keys: ["Ctrl", "C"],
      description: translate("help_shortcut_copy", language)
    },
    {
      keys: ["Esc"],
      description: translate("help_shortcut_close", language)
    }
  ];

  const supportedFiles = [
    {
      icon: FileText,
      title: translate("help_file_pdf", language),
      types: ["PDF"]
    },
    {
      icon: FileText,
      title: translate("help_file_docx", language),
      types: ["DOCX", "DOC"]
    },
    {
      icon: ImageIcon,
      title: translate("help_file_images", language),
      types: ["PNG", "JPG", "JPEG"]
    },
    {
      icon: FileText,
      title: translate("help_file_data", language),
      types: ["JSON", "CSV"]
    },
    {
      icon: FileText,
      title: translate("help_file_text", language),
      types: ["TXT"]
    }
  ];

  const getColorClasses = (color, variant = "bg") => {
    const colors = {
      blue: {
        bg: "bg-blue-500",
        light: "bg-blue-100 dark:bg-blue-900/20",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800"
      },
      green: {
        bg: "bg-green-500",
        light: "bg-green-100 dark:bg-green-900/20",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-800"
      },
      purple: {
        bg: "bg-purple-500",
        light: "bg-purple-100 dark:bg-purple-900/20",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800"
      },
      orange: {
        bg: "bg-orange-500",
        light: "bg-orange-100 dark:bg-orange-900/20",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800"
      },
      pink: {
        bg: "bg-pink-500",
        light: "bg-pink-100 dark:bg-pink-900/20",
        text: "text-pink-600 dark:text-pink-400",
        border: "border-pink-200 dark:border-pink-800"
      },
      indigo: {
        bg: "bg-indigo-500",
        light: "bg-indigo-100 dark:bg-indigo-900/20",
        text: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-200 dark:border-indigo-800"
      }
    };
    return colors[color]?.[variant] || colors.blue[variant];
  };

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles size={32} className="text-white" />
        </motion.div>
        
        <h3 className={`text-2xl font-bold mb-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          {translate("help_welcome_title", language)}
        </h3>
        
        <p className={`text-lg ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}>
          {translate("help_welcome_subtitle", language)}
        </p>
      </div>

      <div className={`p-6 rounded-xl border ${
        isDark
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          {translate("help_what_can_do", language)}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: Database,
              title: translate("help_capability_data", language),
              desc: translate("help_capability_data_desc", language)
            },
            {
              icon: Users,
              title: translate("help_capability_students", language),
              desc: translate("help_capability_students_desc", language)
            },
            {
              icon: GraduationCap,
              title: translate("help_capability_reports", language),
              desc: translate("help_capability_reports_desc", language)
            },
            {
              icon: MessageCircle,
              title: translate("help_capability_chat", language),
              desc: translate("help_capability_chat_desc", language)
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <item.icon size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h5 className={`font-medium mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    {item.title}
                  </h5>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderFeatures = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`border rounded-xl overflow-hidden ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
            className={`w-full p-4 flex items-center gap-4 transition-colors ${
              isDark
                ? "bg-gray-800 hover:bg-gray-750"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className={`p-3 rounded-lg ${getColorClasses(feature.color, "light")}`}>
              <feature.icon size={24} className={getColorClasses(feature.color, "text")} />
            </div>
            
            <div className="flex-1 text-left">
              <h4 className={`font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                {feature.title}
              </h4>
            </div>
            
            <motion.div
              animate={{ rotate: expandedFeature === index ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={20} className={isDark ? "text-gray-400" : "text-gray-500"} />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {expandedFeature === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`border-t ${
                  isDark ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="p-4">
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderShortcuts = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {shortcuts.map((shortcut, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-xl border flex items-center gap-4 ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {shortcut.keys.map((key, keyIndex) => (
              <React.Fragment key={keyIndex}>
                {keyIndex > 0 && (
                  <span className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    +
                  </span>
                )}
                <kbd className={`px-2 py-1 text-sm font-mono rounded border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-300"
                    : "bg-gray-100 border-gray-300 text-gray-700"
                }`}>
                  {key}
                </kbd>
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex-1">
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>
              {shortcut.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderFiles = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className={`p-4 rounded-xl border ${
        isDark
          ? "bg-blue-900/20 border-blue-800"
          : "bg-blue-50 border-blue-200"
      }`}>
        <h4 className={`font-semibold mb-2 ${
          isDark ? "text-blue-400" : "text-blue-600"
        }`}>
          {translate("help_file_upload_title", language)}
        </h4>
        <p className={isDark ? "text-blue-300" : "text-blue-700"}>
          {translate("help_file_upload_desc", language)}
        </p>
      </div>

      <div className="space-y-4">
        {supportedFiles.map((fileType, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <fileType.icon size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
              
              <div className="flex-1">
                <h5 className={`font-medium mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  {fileType.title}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {fileType.types.map((type, typeIndex) => (
                    <span
                      key={typeIndex}
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "features":
        return renderFeatures();
      case "shortcuts":
        return renderShortcuts();
      case "files":
        return renderFiles();
      default:
        return renderOverview();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${
            isDark ? "bg-gray-900" : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    {translate("help_title", language)}
                  </h2>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {translate("help_subtitle", language)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Sidebar */}
            <div className={`w-64 border-r overflow-y-auto ${
              isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
            }`}>
              <div className="p-4 space-y-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                      activeSection === section.id
                        ? getColorClasses(section.color, "light") + " " + getColorClasses(section.color, "border") + " border"
                        : isDark
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-white text-gray-600"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <section.icon
                      size={20}
                      className={activeSection === section.id
                        ? getColorClasses(section.color, "text")
                        : isDark ? "text-gray-400" : "text-gray-500"
                      }
                    />
                    <span className={`font-medium ${
                      activeSection === section.id
                        ? getColorClasses(section.color, "text")
                        : isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {section.title}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HelpModal;