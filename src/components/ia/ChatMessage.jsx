/**
 * Composant ChatMessage - Affichage des messages du chat IA
 *
 * Gère l'affichage des messages utilisateur et IA avec support markdown,
 * animations de typing, actions (copier, lire, régénérer), etc.
 *
 * Développé par Alkaou Dembélé pour SchoolManager (Entreprise Malienne)
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Volume2,
  VolumeX,
  RotateCcw,
  User,
  Bot,
  // Check,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useTheme, useLanguage, useFlashNotification } from "../contexts";
import { translate } from "./ia_translator.js";
import {
  copyToClipboard,
  readTextAloud,
  stopReading,
  createTypingAnimation,
} from "./ai_methodes.js";

// Composant pour le rendu markdown simple
const MarkdownRenderer = ({ content, isDark }) => {
  const formatMarkdown = (text) => {
    if (!text || typeof text !== "string") return "";

    // Remplacer les blocs de code
    text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre class="${
        isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
      } p-3 rounded-lg my-2 overflow-x-auto"><code>${code.trim()}</code></pre>`;
    });

    // Remplacer le code inline
    text = text.replace(
      /`([^`]+)`/g,
      `<code class="${
        isDark ? "bg-gray-700 text-blue-300" : "bg-gray-200 text-blue-600"
      } px-1 py-0.5 rounded text-sm">$1</code>`
    );

    // Remplacer les titres
    text = text.replace(
      /^### (.*$)/gm,
      `<h3 class="text-lg font-semibold mt-4 mb-2 ${
        isDark ? "text-white" : "text-gray-900"
      }">$1</h3>`
    );
    text = text.replace(
      /^## (.*$)/gm,
      `<h2 class="text-xl font-semibold mt-4 mb-2 ${
        isDark ? "text-white" : "text-gray-900"
      }">$1</h2>`
    );
    text = text.replace(
      /^# (.*$)/gm,
      `<h1 class="text-2xl font-bold mt-4 mb-2 ${
        isDark ? "text-white" : "text-gray-900"
      }">$1</h1>`
    );

    // Remplacer le texte en gras
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      `<strong class="font-semibold">$1</strong>`
    );

    // Remplacer le texte en italique
    text = text.replace(/\*(.*?)\*/g, `<em class="italic">$1</em>`);

    // Remplacer les listes
    text = text.replace(/^- (.*$)/gm, `<li class="ml-4 mb-1">• $1</li>`);
    text = text.replace(
      /^\d+\. (.*$)/gm,
      `<li class="ml-4 mb-1 list-decimal">$1</li>`
    );

    // Remplacer les liens
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      `<a href="$2" class="text-blue-500 hover:text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>`
    );

    // Remplacer les sauts de ligne
    text = text.replace(/\n/g, "<br>");

    return text;
  };

  return (
    <div
      className={`prose prose-sm max-w-none text-gray-700`}
      dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
    />
  );
};

const ChatMessage = ({
  message,
  isTyping = false,
  onRegenerate,
  canRegenerate = false,
  typingSpeed = 0.1,
  isThinking,
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();
  const isDark = theme === "dark";

  const [displayedContent, setDisplayedContent] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState("");
  const messageRef = useRef(null);
  const thinkingIntervalRef = useRef(null);

  // Messages de réflexion rotatifs
  const thinkingMessages = [
    translate("loading_checking_database", language),
    translate("loading_please_wait", language),
    translate("loading_searching_responses", language),
    translate("loading_sorting_information", language),
    translate("loading_analyzing_request", language),
    translate("loading_preparing_response", language),
    translate("loading_calculating_stats", language),
    translate("loading_cross_referencing", language),
    translate("loading_generating_report", language),
    translate("loading_validating_data", language),
    translate("loading_organizing_results", language),
    translate("loading_finalizing_answer", language),
    translate("loading_double_checking", language),
    translate("loading_almost_ready", language),
  ];

  const isUser = message.role === "user";
  const isAI = message.role === "assistant";

  // Gestion des messages de réflexion rotatifs
  useEffect(() => {
    if (isAI && isThinking && !displayedContent) {
      let currentIndex = 0;
      setThinkingMessage(thinkingMessages[0]);

      thinkingIntervalRef.current = setInterval(() => {
        currentIndex = (currentIndex + 1) % thinkingMessages.length;
        setThinkingMessage(thinkingMessages[currentIndex]);
      }, 4000); // Change toutes les 4 secondes

      return () => {
        if (thinkingIntervalRef.current) {
          clearInterval(thinkingIntervalRef.current);
        }
      };
    } else {
      if (thinkingIntervalRef.current) {
        clearInterval(thinkingIntervalRef.current);
        thinkingIntervalRef.current = null;
      }
    }
  }, [isThinking, displayedContent, isAI]);

  // Animation de typing pour les messages IA
  useEffect(() => {
    if (isAI && isTyping && message.content) {
      setDisplayedContent("");
      createTypingAnimation(
        message.content,
        setDisplayedContent,
        () => {}, // onComplete callback
        typingSpeed
      );
    } else {
      setDisplayedContent(message.content || "");
    }
  }, [message.content, isTyping, isAI, typingSpeed]);

  // Scroll automatique pendant le typing
  useEffect(() => {
    if (isTyping && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [displayedContent, isTyping]);

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setFlashMessage({
        message: translate("message_copied", language),
        type: "success",
        duration: 2000,
      });
    }
  };

  const handleReadAloud = () => {
    if (isReading) {
      stopReading();
      setIsReading(false);
    } else {
      const success = readTextAloud(message.content, language);
      if (success) {
        setIsReading(true);
        // Arrêter la lecture automatiquement après un délai
        setTimeout(() => setIsReading(false), message.content.length * 100);
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const actionButtonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      ref={messageRef}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-4 p-4 ${isUser ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`flex gap-3 max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? isDark
                ? "bg-green-600"
                : "bg-green-500"
              : isDark
              ? "bg-blue-600"
              : "bg-blue-500"
          }`}
        >
          {isUser ? (
            <User size={16} className="text-white" />
          ) : (
            <Bot size={16} className="text-white" />
          )}
        </div>

        {/* Contenu du message */}
        <div className={`flex-1 text-left`}>
          {/* Bulle de message */}
          <div
            className={`inline-block max-w-full p-4 rounded-2xl ${
              isUser
                ? isDark
                  ? "bg-green-600 text-white"
                  : "bg-green-500 text-white"
                : "bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
            } ${isUser ? "rounded-br-md" : "rounded-bl-md"}`}
          >
            {/* Fichier joint (si présent) */}
            {message.file && (
              <div
                className={`mb-3 p-3 rounded-lg flex items-center gap-2 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                {message.file.type?.startsWith("image/") ? (
                  <ImageIcon
                    size={16}
                    className={isDark ? "text-gray-400" : "text-gray-600"}
                  />
                ) : (
                  <FileText
                    size={16}
                    className={isDark ? "text-gray-400" : "text-gray-600"}
                  />
                )}
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {message.file.name}
                </span>
              </div>
            )}

            {/* Contenu du message */}
            <div className="prose prose-sm max-w-none">
              {isAI ? (
                <>
                  {isThinking && !displayedContent ? (
                    <span className="italic">{thinkingMessage}</span>
                  ) : (
                    <MarkdownRenderer
                      content={displayedContent}
                      isDark={isDark}
                    />
                  )}
                </>
              ) : (
                <p
                  className={`whitespace-pre-wrap break-words ${
                    message.role !== "user" ? "text-gray-700" : "text-white"
                  }`}
                >
                  {displayedContent}
                </p>
              )}
            </div>

            {/* Indicateur de typing */}
            {isTyping && isAI && (
              <div className="flex items-center gap-1 mt-2">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isDark ? "bg-gray-400" : "bg-gray-500"
                  }`}
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isDark ? "bg-gray-400" : "bg-gray-500"
                  }`}
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isDark ? "bg-gray-400" : "bg-gray-500"
                  }`}
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            )}
          </div>

          {/* Actions du message */}
          <AnimatePresence>
            {showActions && !isTyping && (
              <motion.div
                variants={actionButtonVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`flex items-center gap-2 mt-2 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {/* Bouton Copier */}
                <motion.button
                  onClick={handleCopy}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={translate("copy_message", language)}
                >
                  <Copy size={14} />
                </motion.button>

                {/* Bouton Lire à haute voix */}
                <motion.button
                  onClick={handleReadAloud}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isReading
                      ? "bg-green-600 text-white"
                      : isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={translate("read_aloud", language)}
                >
                  {isReading ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </motion.button>

                {/* Bouton Régénérer (seulement pour le dernier message IA) */}
                {isAI && canRegenerate && onRegenerate && (
                  <motion.button
                    onClick={onRegenerate}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={translate("regenerate_response", language)}
                  >
                    <RotateCcw size={14} />
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timestamp */}
          <div
            className={`text-xs mt-1 ${
              isDark ? "text-gray-500" : "text-gray-400"
            } text-left`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
