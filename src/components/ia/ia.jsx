/**
 * Composant IA - Interface principale pour l'assistant Fatoumata
 *
 * Interface complète de chat IA avec sidebar, historique, upload de fichiers,
 * et toutes les fonctionnalités modernes d'un chatbot avancé.
 * Fatoumata est l'assistante IA spécialisée dans la gestion d'établissements scolaires.
 *
 * Développé par Alkaou Dembélé pour SchoolManager (Entreprise Malienne)
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info } from "lucide-react";
import { useTheme, useLanguage, useFlashNotification } from "../contexts";
import { translate } from "./ia_translator.js";
import {
  generateUniqueId,
  // getChatsFromStorage,
  saveChatToStorage,
  sendMessageToAI,
  // processAIResponse,
  createTypingAnimation,
  generateChatTitle,
} from "./ai_methodes.js";
import Sidebar from "./Sidebar.jsx";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import HelpModal from "./HelpModal.jsx";

const IA = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();
  const isDark = theme === "dark";

  // États principaux
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [abortController, setAbortController] = useState(null);

  const [isThinking, setIsThinking] = useState(false);

  // Références
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialisation du chat par défaut
  useEffect(() => {
    if (isOpen && !currentChat) {
      startNewChat();
      setIsMinimized(false);
    }
  }, [isOpen, currentChat]);

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Démarrer un nouveau chat
  const startNewChat = (isEphemeral = false) => {
    const newChat = {
      id: generateUniqueId(),
      title: translate("new_chat", language),
      messages: [],
      createdAt: new Date().toISOString(),
      isEphemeral,
    };

    setCurrentChat(newChat);
    setMessages([]);
    setIsGenerating(false);
    setTypingMessageId(null);

    // Message de bienvenue
    const welcomeMessage = {
      id: generateUniqueId(),
      type: "ai",
      content: translate("welcome_message", language),
      timestamp: new Date().toISOString(),
    };

    setMessages([welcomeMessage]);

    if (!isEphemeral) {
      const updatedChat = { ...newChat, messages: [welcomeMessage] };
      saveChatToStorage(updatedChat);
      setCurrentChat(updatedChat);
    }
  };

  // Charger un chat existant
  const loadChat = (chat) => {
    setCurrentChat(chat);
    setMessages(chat.messages || []);
    setIsGenerating(false);
    setTypingMessageId(null);
  };

  // Envoyer un message
  const handleSendMessage = async (content, file = null) => {
    if (!content.trim() && !file) return;
    if (isGenerating) return;

    // Si c'est le premier message et qu'il n'y a pas de chat actuel, créer un nouveau chat
    if (!currentChat || (currentChat && messages.length === 0)) {
      const newChatId = generateUniqueId();
      const newChat = {
        id: newChatId,
        title: translate("new_chat", language),
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEphemeral: false,
      };
      setCurrentChat(newChat);
    }

    // Message utilisateur
    const userMessage = {
      id: generateUniqueId(),
      type: "user",
      role: "user",
      content: content.trim(),
      file: file
        ? {
            name: file.name,
            size: file.size,
            type: file.type,
          }
        : null,
      timestamp: new Date().toISOString(),
    };

    // Message IA temporaire avec animation de frappe
    const aiMessageId = generateUniqueId();
    const aiMessage = {
      id: aiMessageId,
      type: "ai",
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      isTyping: true,
    };

    const newMessages = [...messages, userMessage, aiMessage];
    setMessages(newMessages);
    setIsGenerating(true);
    setTypingMessageId(aiMessageId);

    // Créer un AbortController pour pouvoir annuler la requête
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Déterminer si c'est le premier message de la conversation
      const isFirstMessage =
        messages.filter((msg) => msg.type === "user").length === 0;

      // Préparer l'historique de conversation (exclure le message temporaire AI)
      const conversationHistory = messages.filter((msg) => !msg.isTyping);

      // Envoyer à l'API avec le nouveau système intelligent
      setIsThinking(true);
      const response = await sendMessageToAI(
        content,
        file,
        conversationHistory,
        isFirstMessage
      );

      if (controller.signal.aborted) {
        setIsThinking(false);
        return;
      }

      // Extraire la réponse
      const aiResponseText = response.response || "";
      // console.log("Réponse de l'IA:", aiResponseText);
      // console.log("Données contextuelles utilisées:", response.contextData);

      setIsThinking(false);

      // Animation de frappe pour la réponse
      await createTypingAnimation(
        aiResponseText,
        (partialContent) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: partialContent, isTyping: true }
                : msg
            )
          );
        },
        () => {
          // Animation terminée
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: aiResponseText, isTyping: false }
                : msg
            )
          );
          setIsGenerating(false);
          setTypingMessageId(null);
          setAbortController(null);
        },
        5
      );

      // Sauvegarder le chat mis à jour
      if (currentChat && !currentChat.isEphemeral) {
        const finalMessages = [...newMessages];
        finalMessages[finalMessages.length - 1] = {
          ...aiMessage,
          content: aiResponseText,
          isTyping: false,
        };

        // Générer un titre automatiquement pour le premier message
        const isFirstMessage = currentChat.messages.length === 0;
        const chatTitle = isFirstMessage
          ? await generateChatTitle(content)
          : currentChat.title;

        const updatedChat = {
          ...currentChat,
          messages: finalMessages,
          title: chatTitle,
          updatedAt: new Date().toISOString(),
        };

        saveChatToStorage(updatedChat);
        setCurrentChat(updatedChat);
      }
    } catch (error) {
      setIsThinking(false);

      if (error.name === "AbortError") {
        // Requête annulée
        setMessages((prev) => prev.slice(0, -1)); // Supprimer le message IA temporaire
      } else {
        console.error("Erreur lors de l'envoi du message:", error);

        // Message d'erreur
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content: translate("error_message", language),
                  isTyping: false,
                  isError: true,
                }
              : msg
          )
        );

        setFlashMessage({
          message: translate("error_sending_message", language),
          type: "error",
          duration: 3000,
        });
      }

      setIsGenerating(false);
      setTypingMessageId(null);
      setAbortController(null);
    }
  };

  // Arrêter la génération
  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsGenerating(false);
    setTypingMessageId(null);

    // Supprimer le message IA en cours de génération
    setMessages((prev) => prev.filter((msg) => !msg.isTyping));
  };

  // Régénérer la dernière réponse
  const handleRegenerateResponse = async () => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.type === "user");
    if (!lastUserMessage) return;

    // Supprimer la dernière réponse IA
    const messagesWithoutLastAI = messages.filter((msg, index) => {
      if (msg.type === "ai" && index === messages.length - 1) return false;
      return true;
    });

    setMessages(messagesWithoutLastAI);

    // Renvoyer le dernier message utilisateur
    await handleSendMessage(lastUserMessage.content, lastUserMessage.file);
  };

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: isMinimized ? 0.3 : 1,
            opacity: 1,
            y: isMinimized ? "40vh" : 0,
          }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`w-full max-w-7xl h-[100vh] rounded-2xl shadow-2xl overflow-hidden flex ${
            isDark ? "bg-gray-900" : "bg-white"
          } ${isMinimized ? "pointer-events-none" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar */}
          <Sidebar
            currentChat={currentChat}
            onChatSelect={loadChat}
            onNewChat={() => startNewChat(false)}
            onNewEphemeralChat={() => startNewChat(true)}
            isMinimized={isMinimized}
          />

          {/* Zone de chat principale */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div
              className={`flex items-center justify-between p-4 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div>
                  <h2
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Fatoumata
                  </h2>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {translate("ai_subtitle", language)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHelp(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  }`}
                  title={translate("help", language)}
                >
                  <Info size={20} />
                </button>

                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  }`}
                  title={translate("close", language)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Zone des messages */}
            <div
              ref={chatContainerRef}
              className={`flex-1 overflow-y-auto scrollbar-custom p-4 space-y-4 ${
                isDark ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              <AnimatePresence>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isThinking={isThinking}
                    onRegenerate={
                      message.type === "ai" &&
                      messages[messages.length - 1]?.id === message.id
                        ? handleRegenerateResponse
                        : null
                    }
                    isGenerating={
                      isGenerating && message.id === typingMessageId
                    }
                  />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <ChatInput
              onSendMessage={handleSendMessage}
              onStopGeneration={handleStopGeneration}
              isGenerating={isGenerating}
              disabled={isMinimized}
            />
          </div>
        </motion.div>

        {/* Modal d'aide */}
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      </motion.div>
    </AnimatePresence>
  );
};

export default IA;
