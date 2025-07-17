/**
 * Composant Sidebar - Barre latérale pour la gestion des chats IA
 * 
 * Gère l'historique des chats, création de nouveaux chats, chats éphémères
 * et autres paramètres nécessaires pour l'interface Fatoumata.
 * 
 * Développé par Alkaou Dembélé pour SchoolManager (Entreprise Malienne)
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Clock,
  Trash2,
  Search,
  X,
  AlertTriangle
} from "lucide-react";
import { useTheme, useLanguage } from "../contexts";
import { translate } from "./ia_translator.js";
import {
  getChatsFromStorage,
  deleteChatFromStorage,
  deleteAllChatsFromStorage,
  // generateChatTitle
} from "./ai_methodes.js";

const Sidebar = ({
  currentChat,
  onChatSelect,
  onNewChat,
  onNewEphemeralChat,
  isMinimized
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === "dark";

  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [hoveredChat, setHoveredChat] = useState(null);

  // Charger les chats depuis le stockage
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = () => {
    const savedChats = getChatsFromStorage();
    setChats(savedChats);
  };

  // Filtrer les chats selon le terme de recherche
  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(msg => 
      msg.content && typeof msg.content === 'string' && 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDeleteChat = (chatId) => {
    deleteChatFromStorage(chatId);
    loadChats();
    setShowDeleteConfirm(null);
    
    // Si le chat supprimé était le chat actuel, créer un nouveau chat
    if (chatId === currentChat?.id) {
      onNewChat();
    }
  };

  const handleDeleteAllChats = () => {
    deleteAllChatsFromStorage();
    loadChats();
    setShowDeleteAllConfirm(false);
    onNewChat();
  };

  const formatChatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return language === "Français" ? "À l'instant" : 
             language === "Anglais" ? "Just now" : "Sisan";
    } else if (diffHours < 24) {
      return language === "Français" ? `Il y a ${diffHours}h` : 
             language === "Anglais" ? `${diffHours}h ago` : `${diffHours}h tɛmɛnen`;
    } else if (diffDays === 0) {
      return language === "Français" ? "Aujourd'hui" : 
             language === "Anglais" ? "Today" : "Bi";
    } else if (diffDays === 1) {
      return language === "Français" ? "Hier" : 
             language === "Anglais" ? "Yesterday" : "Kunu";
    } else if (diffDays <= 7) {
      return `${diffDays} ${language === "Français" ? "jours" : 
                          language === "Anglais" ? "days" : "tile"}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const sidebarVariants = {
    expanded: {
      width: 280,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    collapsed: {
      width: 60,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const contentVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, delay: 0.1 }
    },
    hidden: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <motion.div
        className={`h-full border-r flex flex-col ${
          isDark
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
        variants={sidebarVariants}
        animate={isMinimized ? "collapsed" : "expanded"}
      >
        {/* Header avec boutons principaux */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <AnimatePresence mode="wait">
            {!isMinimized && (
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-3"
              >
                {/* Bouton Nouveau Chat */}
                <motion.button
                  onClick={onNewChat}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={translate("new_chat", language)}
                >
                  <Plus size={18} />
                  <span className="font-medium">
                    {translate("new_chat", language)}
                  </span>
                </motion.button>

                {/* Bouton Chat Éphémère */}
                <motion.button
                  onClick={onNewEphemeralChat}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={translate("ephemeral_chat", language)}
                >
                  <Clock size={18} />
                  <span className="font-medium">
                    {translate("ephemeral_chat", language)}
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {isMinimized && (
            <div className="space-y-3">
              <motion.button
                onClick={onNewChat}
                className={`w-full flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={translate("new_chat", language)}
              >
                <Plus size={18} />
              </motion.button>

              <motion.button
                onClick={onNewEphemeralChat}
                className={`w-full flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={translate("ephemeral_chat", language)}
              >
                <Clock size={18} />
              </motion.button>
            </div>
          )}
        </div>

        {/* Barre de recherche */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-4"
            >
              <div className="relative">
                <Search
                  size={16}
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder={`${translate("search", language) || "Rechercher"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${
                    isDark
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des chats */}
        <div className="flex-1 overflow-y-auto scrollbar-custom">
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="px-4 pb-4"
              >
                {/* Titre de la section */}
                <h3 className={`text-sm font-medium mb-3 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  {translate("chat_history", language)}
                </h3>

                {/* Liste des chats */}
                <div className="space-y-2">
                  <AnimatePresence>
                    {filteredChats.map((chat) => (
                      <motion.div
                        key={chat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          currentChat?.id === chat.id
                            ? isDark
                              ? "bg-blue-600/20 border border-blue-500/30"
                              : "bg-blue-50 border border-blue-200"
                            : isDark
                            ? "hover:bg-gray-800 border border-transparent"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                        onClick={() => onChatSelect(chat)}
                        onMouseEnter={() => setHoveredChat(chat.id)}
                        onMouseLeave={() => setHoveredChat(null)}
                      >
                        <MessageSquare
                          size={16}
                          className={`flex-shrink-0 ${
                            currentChat?.id === chat.id
                              ? "text-blue-500"
                              : isDark
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            currentChat?.id === chat.id
                              ? "text-blue-600 dark:text-blue-400"
                              : isDark
                              ? "text-white"
                              : "text-gray-900"
                          }`}>
                            {chat.title}
                          </p>
                          <p className={`text-xs truncate ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}>
                            {formatChatDate(chat.createdAt || chat.updatedAt)}
                          </p>
                        </div>

                        {/* Menu d'actions */}
                        <AnimatePresence>
                          {(hoveredChat === chat.id || currentChat?.id === chat.id) && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(chat.id);
                              }}
                              className={`p-1 rounded transition-colors ${
                                isDark
                                  ? "hover:bg-gray-700 text-gray-400 hover:text-red-400"
                                  : "hover:bg-gray-200 text-gray-500 hover:text-red-500"
                              }`}
                              title={translate("delete_chat", language)}
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredChats.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-center py-8 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {searchTerm
                          ? "Aucun chat trouvé"
                          : "Aucun chat pour le moment"}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Bouton supprimer tous les chats */}
                {chats.length > 0 && (
                  <motion.button
                    onClick={() => setShowDeleteAllConfirm(true)}
                    className={`w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isDark
                        ? "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30"
                        : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 size={16} />
                    {translate("delete_all_chats", language)}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modal de confirmation de suppression d'un chat */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`p-6 rounded-xl shadow-xl max-w-md w-full mx-4 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500" size={24} />
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  {translate("confirm_delete", language)}
                </h3>
              </div>
              
              <p className={`mb-6 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                Cette action est irréversible.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {translate("cancel", language)}
                </button>
                <button
                  onClick={() => handleDeleteChat(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  {translate("yes", language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmation de suppression de tous les chats */}
      <AnimatePresence>
        {showDeleteAllConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteAllConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`p-6 rounded-xl shadow-xl max-w-md w-full mx-4 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500" size={24} />
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  {translate("delete_all_chats", language)}
                </h3>
              </div>
              
              <p className={`mb-6 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                {translate("delete_all_chats_confirm", language)}
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteAllConfirm(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {translate("cancel", language)}
                </button>
                <button
                  onClick={handleDeleteAllChats}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  {translate("yes", language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;