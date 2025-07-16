/**
 * Composant ChatInput - Zone de saisie avancée pour le chat IA
 * 
 * Gère la saisie de messages, upload de fichiers, raccourcis clavier,
 * et toutes les fonctionnalités d'input avancées.
 * 
 * Développé par Alkaou Dembélé pour SchoolManager (Entreprise Malienne)
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  X,
  StopCircle,
  FileText,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import { useTheme, useLanguage, useFlashNotification } from "../contexts";
import { translate } from "./ia_translator.js";
import { validateFile } from "./ai_methodes.js";

const ChatInput = ({
  onSendMessage,
  onStopGeneration,
  isGenerating = false,
  disabled = false
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();
  const isDark = theme === "dark";

  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState(null);
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize du textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Focus automatique
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    if (!message.trim() && !attachedFile) return;
    if (isGenerating || disabled) return;

    onSendMessage(message.trim(), attachedFile);
    setMessage("");
    setAttachedFile(null);
    setFileError(null);
  };

  const handleKeyDown = (e) => {
    // Ctrl+Enter pour nouvelle ligne
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.substring(0, start) + '\n' + message.substring(end);
      setMessage(newMessage);
      
      // Repositionner le curseur
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }
    
    // Enter pour envoyer
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (file) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setFileError(validation.error);
      setFlashMessage({
        message: translate(validation.error, language),
        type: "error",
        duration: 3000
      });
      return;
    }

    setAttachedFile(file);
    setFileError(null);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input pour permettre de sélectionner le même fichier
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    setFileError(null);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon size={16} />;
    }
    return <FileText size={16} />;
  };

  const canSend = (message.trim() || attachedFile) && !isGenerating && !disabled;

  return (
    <div className={`border-t p-4 ${
      isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
    }`}>
      {/* Fichier attaché */}
      <AnimatePresence>
        {attachedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-3 p-3 rounded-lg border flex items-center gap-3 ${
              isDark
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className={`p-2 rounded ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}>
              {getFileIcon(attachedFile)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                {attachedFile.name}
              </p>
              <p className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                {(attachedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            
            <button
              onClick={removeAttachedFile}
              className={`p-1 rounded transition-colors ${
                isDark
                  ? "hover:bg-gray-600 text-gray-400 hover:text-white"
                  : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
              }`}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone de saisie principale */}
      <div className={`relative rounded-xl border transition-all duration-200 ${
        isDragOver
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : isDark
          ? "border-gray-600 bg-gray-800"
          : "border-gray-300 bg-white"
      } ${disabled ? "opacity-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Overlay de drag & drop */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-xl flex items-center justify-center z-10"
            >
              <div className="text-center">
                <Paperclip size={32} className="text-blue-500 mx-auto mb-2" />
                <p className={`text-sm font-medium ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}>
                  {translate("drop_file_here", language) || "Déposer le fichier ici"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={translate("input_placeholder", language)}
          disabled={disabled}
          className={`w-full p-4 pr-20 resize-none border-0 rounded-xl focus:outline-none focus:ring-0 ${
            isDark
              ? "bg-transparent text-white placeholder-gray-400"
              : "bg-transparent text-gray-900 placeholder-gray-500"
          }`}
          style={{ minHeight: '60px', maxHeight: '120px' }}
        />

        {/* Boutons d'action */}
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          {/* Bouton d'attachement */}
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={`p-2 rounded-lg transition-all duration-200 ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
            whileHover={disabled ? {} : { scale: 1.1 }}
            whileTap={disabled ? {} : { scale: 0.9 }}
            title={translate("attach_file", language)}
          >
            <Paperclip size={18} />
          </motion.button>

          {/* Bouton d'envoi ou d'arrêt */}
          {isGenerating ? (
            <motion.button
              onClick={onStopGeneration}
              className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={translate("stop_generation", language)}
            >
              <StopCircle size={18} />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSend}
              disabled={!canSend}
              className={`p-2 rounded-lg transition-all duration-200 ${
                canSend
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : isDark
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              whileHover={canSend ? { scale: 1.1 } : {}}
              whileTap={canSend ? { scale: 0.9 } : {}}
              title={translate("send_message", language)}
            >
              <Send size={18} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Informations sur les fichiers supportés */}
      <div className={`mt-2 text-xs ${
        isDark ? "text-gray-500" : "text-gray-400"
      }`}>
        {translate("supported_files", language)}
      </div>

      {/* Erreur de fichier */}
      <AnimatePresence>
        {fileError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 p-2 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2"
          >
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400">
              {translate(fileError, language)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInput;