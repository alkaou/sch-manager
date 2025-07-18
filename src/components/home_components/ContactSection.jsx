import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  LinkedinIcon,
  Twitter,
  Facebook,
  Youtube,
  Github,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useLanguage, useTheme } from "../contexts";
import {
  saveContactMessage,
  validateContactInput,
  checkSpamProtection,
} from "./contacts/email_contact_methodes";
import { translate } from "./contacts/contact_translator";

import maps from "../../assets/images/Mali_Map.jpg";

const ContactSection = ({ isOthersBGColors }) => {
  const { live_language, language } = useLanguage();
  const { theme, text_color } = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
    success: null,
  });

  // Validation state pour chaque champ
  const [fieldValidation, setFieldValidation] = useState({
    name: { isValid: null, error: null },
    email: { isValid: null, error: null },
    subject: { isValid: null, error: null },
    message: { isValid: null, error: null },
  });

  // Compteurs de caractères
  const [characterCounts, setCharacterCounts] = useState({
    subject: 0,
    message: 0,
  });

  // Validation en temps réel d'un champ
  const validateField = (fieldName, value, language) => {
    const tempData = { ...formData, [fieldName]: value };
    const validation = validateContactInput(tempData, language);

    return {
      isValid: !validation.errors[fieldName],
      error: validation.errors[fieldName] || null,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mettre à jour les données du formulaire
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validation en temps réel
    const fieldValidationResult = validateField(name, value, language);
    setFieldValidation((prev) => ({
      ...prev,
      [name]: fieldValidationResult,
    }));

    // Mettre à jour les compteurs de caractères
    if (name === "subject" || name === "message") {
      setCharacterCounts((prev) => ({
        ...prev,
        [name]: value.length,
      }));
    }

    // Effacer les messages d'erreur/succès lors de la modification
    if (formStatus.error || formStatus.success) {
      setFormStatus((prev) => ({ ...prev, error: null, success: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Démarrer le processus de soumission
    setFormStatus({
      isSubmitting: true,
      isSubmitted: false,
      error: null,
      success: null,
    });

    try {
      // Validation complète avant soumission
      const validation = validateContactInput(formData, language);
      if (!validation.isValid) {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: false,
          error: Object.values(validation.errors)[0], // Premier erreur trouvée
          success: null,
        });

        // Mettre à jour la validation de tous les champs
        const newFieldValidation = {};
        Object.keys(formData).forEach((field) => {
          newFieldValidation[field] = {
            isValid: !validation.errors[field],
            error: validation.errors[field] || null,
          };
        });
        setFieldValidation(newFieldValidation);
        return;
      }

      // Vérification anti-spam
      const spamCheck = checkSpamProtection(formData.email, language);
      if (!spamCheck.canSubmit) {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: false,
          error: spamCheck.error,
          success: null,
        });
        return;
      }

      // Sauvegarder le message dans Firebase
      const result = await saveContactMessage(formData, language);

      if (result.success) {
        // Succès
        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          error: null,
          success: result.message,
        });

        // Réinitialiser le formulaire
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        // Réinitialiser la validation
        setFieldValidation({
          name: { isValid: null, error: null },
          email: { isValid: null, error: null },
          subject: { isValid: null, error: null },
          message: { isValid: null, error: null },
        });

        // Réinitialiser les compteurs
        setCharacterCounts({
          subject: 0,
          message: 0,
        });

        // Effacer le message de succès après 8 secondes
        setTimeout(() => {
          setFormStatus((prev) => ({
            ...prev,
            success: null,
            isSubmitted: false,
          }));
        }, 8000);
      } else {
        // Erreur lors de la sauvegarde
        setFormStatus({
          isSubmitting: false,
          isSubmitted: false,
          error: result.error,
          success: null,
        });

        // Si il y a des erreurs de validation spécifiques
        if (result.validationErrors) {
          const newFieldValidation = {};
          Object.keys(formData).forEach((field) => {
            newFieldValidation[field] = {
              isValid: !result.validationErrors[field],
              error: result.validationErrors[field] || null,
            };
          });
          setFieldValidation(newFieldValidation);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: translate("sending_error", language),
        success: null,
      });
    }
  };

  // Fonction pour obtenir les classes CSS d'un champ avec validation
  const getInputClass = (fieldName) => {
    const baseClass = `w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-200 ${
      theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    } border`;

    const validation = fieldValidation[fieldName];

    if (validation.isValid === true) {
      return `${baseClass} border-green-500 focus:ring-2 focus:ring-green-500`;
    } else if (validation.isValid === false) {
      return `${baseClass} border-red-500 focus:ring-2 focus:ring-red-500`;
    } else {
      return `${baseClass} ${
        theme === "dark" ? "border-gray-700" : "border-gray-300"
      } focus:ring-2 focus:ring-blue-500`;
    }
  };

  // Fonction pour afficher l'icône de validation
  const getValidationIcon = (fieldName) => {
    const validation = fieldValidation[fieldName];

    if (validation.isValid === true) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (validation.isValid === false) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return null;
  };

  // Fonction pour obtenir la couleur du compteur de caractères
  const getCharacterCountColor = (fieldName, maxLength) => {
    const count = characterCounts[fieldName] || 0;
    const percentage = (count / maxLength) * 100;

    if (percentage > 100) return "text-red-500";
    if (percentage > 80) return "text-orange-500";
    if (percentage > 60) return "text-yellow-500";
    return theme === "dark" ? "text-gray-400" : "text-gray-500";
  };

  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const highlightBg = theme === "dark" ? "bg-blue-900/30" : "bg-blue-50";

  const _texts_color = isOthersBGColors ? "text-gray-700" : text_color;

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-200 dark:bg-blue-900 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-purple-200 dark:bg-purple-900 opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className={`
            text-3xl md:text-4xl font-bold mb-6 inline-block bg-clip-text text-transparent 
            ${
              isOthersBGColors
                ? text_color
                : "bg-gradient-to-r from-blue-600 to-purple-600"
            }
          `}
          >
            {live_language.contact_title || "Contactez-nous"}
          </h2>
          <p className="max-w-2xl mx-auto text-lg opacity-75">
            {live_language.contact_subtitle ||
              "Vous avez des questions ou besoin d'assistance ? Notre équipe est là pour vous aider."}
          </p>
        </motion.div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto ${_texts_color}`}
        >
          {/* Contact information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className={`${cardBg} rounded-2xl shadow-xl p-8 h-full`}>
              <h3 className="text-2xl font-bold mb-6">
                {live_language.contact_info || "Informations de contact"}
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className={`p-3 ${highlightBg} rounded-lg mr-4`}>
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      {live_language.email || "Email"}
                    </h4>
                    <p className="opacity-75">contact@schoolmanager.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`p-3 ${highlightBg} rounded-lg mr-4`}>
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      {live_language.phone || "Téléphone"}
                    </h4>
                    <p className="opacity-75">
                      +223 67 22 00 66 / +223 96 50 64 09
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`p-3 ${highlightBg} rounded-lg mr-4`}>
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      {live_language.address || "Adresse"}
                    </h4>
                    <p className="opacity-75">
                      San, Mali
                      <br />
                      Kati, Mali
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`p-3 ${highlightBg} rounded-lg mr-4`}>
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      {live_language.live_chat || "Chat en direct"}
                    </h4>
                    <p className="opacity-75">
                      {live_language.chat_availability ||
                        "Disponible 7j/7 de 8h à 20h"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social media */}
              <div className="mt-8">
                <h4 className="font-medium mb-4">
                  {live_language.follow_us || "Suivez-nous"}
                </h4>
                <div className="flex space-x-3">
                  <motion.a
                    // href="https://linkedin.com"
                    // target="_blank"
                    title="Linked"
                    rel="noopener noreferrer"
                    className={`p-3 ${highlightBg} rounded-full`}
                    whileHover={{
                      y: -5,
                      backgroundColor: theme === "dark" ? "#1d4ed8" : "#dbeafe",
                    }}
                  >
                    <LinkedinIcon className="w-5 h-5 text-blue-600" />
                  </motion.a>
                  <motion.a
                    // href="https://twitter.com"
                    // target="_blank"
                    title="Twitter"
                    rel="noopener noreferrer"
                    className={`p-3 ${highlightBg} rounded-full`}
                    whileHover={{
                      y: -5,
                      backgroundColor: theme === "dark" ? "#1d4ed8" : "#dbeafe",
                    }}
                  >
                    <Twitter className="w-5 h-5 text-blue-600" />
                  </motion.a>
                  <motion.a
                    // href="https://facebook.com"
                    // target="_blank"
                    title="Facebook"
                    rel="noopener noreferrer"
                    className={`p-3 ${highlightBg} rounded-full`}
                    whileHover={{
                      y: -5,
                      backgroundColor: theme === "dark" ? "#1d4ed8" : "#dbeafe",
                    }}
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </motion.a>
                  <motion.a
                    // href="https://youtube.com"
                    // target="_blank"
                    title="Youtube"
                    rel="noopener noreferrer"
                    className={`p-3 ${highlightBg} rounded-full`}
                    whileHover={{
                      y: -5,
                      backgroundColor: theme === "dark" ? "#1d4ed8" : "#dbeafe",
                    }}
                  >
                    <Youtube className="w-5 h-5 text-blue-600" />
                  </motion.a>
                  <motion.a
                    // href="https://github.com"
                    // target="_blank"
                    title="Github"
                    rel="noopener noreferrer"
                    className={`p-3 ${highlightBg} rounded-full`}
                    whileHover={{
                      y: -5,
                      backgroundColor: theme === "dark" ? "#1d4ed8" : "#dbeafe",
                    }}
                  >
                    <Github className="w-5 h-5 text-blue-600" />
                  </motion.a>
                </div>
              </div>

              {/* Map or Location */}
              <div className="mt-8">
                <h4 className="font-medium mb-4">
                  {live_language.location || "Emplacement"}
                </h4>
                <div
                  className={`rounded-lg overflow-hidden h-40 bg-gray-200 dark:bg-gray-700 relative`}
                >
                  {/* Placeholder for map - in a real application, you would embed an actual map here */}
                  <img src={maps} title="maps" alt="mpas" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-blue-600 animate-bounce" />
                  </div>
                  <div className="absolute bottom-0 w-full py-2 px-4 bg-black bg-opacity-70 text-white text-xs text-center">
                    {live_language.map_placeholder ||
                      "Carte interactive disponible sur le site web complet"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={`${cardBg} rounded-2xl shadow-xl p-8`}>
              <h3 className="text-2xl font-bold mb-6">
                {live_language.send_message || "Envoyez-nous un message"}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="name"
                    >
                      {live_language.name || "Nom"} *
                    </label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={getInputClass("name")}
                        placeholder={
                          live_language.name_placeholder || "Votre nom complet"
                        }
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {getValidationIcon("name")}
                      </div>
                    </div>
                    {fieldValidation.name.error && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {fieldValidation.name.error}
                      </motion.p>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="email"
                    >
                      {live_language.email || "Email"} *
                    </label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={getInputClass("email")}
                        placeholder={
                          live_language.email_placeholder || "votre@email.com"
                        }
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {getValidationIcon("email")}
                      </div>
                    </div>
                    {fieldValidation.email.error && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {fieldValidation.email.error}
                      </motion.p>
                    )}
                  </div>

                  {/* Subject field */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label
                        className="block text-sm font-medium"
                        htmlFor="subject"
                      >
                        {live_language.subject || "Sujet"}
                      </label>
                      <span
                        className={`text-xs ${getCharacterCountColor(
                          "subject",
                          255
                        )}`}
                      >
                        {characterCounts.subject}/255{" "}
                        {translate("characters_remaining", language)}
                      </span>
                    </div>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={getInputClass("subject")}
                        placeholder={
                          live_language.subject_placeholder ||
                          "Objet de votre message"
                        }
                        maxLength={255}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {getValidationIcon("subject")}
                      </div>
                    </div>
                    {fieldValidation.subject.error && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {fieldValidation.subject.error}
                      </motion.p>
                    )}
                  </div>

                  {/* Message field */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label
                        className="block text-sm font-medium"
                        htmlFor="message"
                      >
                        {live_language.message || "Message"} *
                      </label>
                      <span
                        className={`text-xs ${getCharacterCountColor(
                          "message",
                          10000
                        )}`}
                      >
                        {characterCounts.message}/10,000{" "}
                        {translate("characters_remaining", language)}
                      </span>
                    </div>
                    <div className="relative">
                      <motion.textarea
                        whileFocus={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className={getInputClass("message")}
                        placeholder={
                          live_language.message_placeholder ||
                          "Comment pouvons-nous vous aider ?"
                        }
                        maxLength={10000}
                        required
                      />
                      <div className="absolute right-3 top-3">
                        {getValidationIcon("message")}
                      </div>
                    </div>
                    {fieldValidation.message.error && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {fieldValidation.message.error}
                      </motion.p>
                    )}
                    {/* Indicateur de longueur minimale */}
                    {formData.message.length > 0 &&
                      formData.message.length < 30 && (
                        <motion.p
                          className="text-orange-500 text-xs mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {30 - formData.message.length}{" "}
                          {translate("characters_remaining", language)}{" "}
                          {language === "Bambara"
                            ? "(dɔgɔyalenba 30)"
                            : "(minimum 30)"}
                        </motion.p>
                      )}
                  </div>

                  {/* Form status indicators */}
                  {formStatus.error && (
                    <motion.div
                      className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800 flex items-start"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Erreur de validation</p>
                        <p>{formStatus.error}</p>
                      </div>
                    </motion.div>
                  )}

                  {formStatus.success && (
                    <motion.div
                      className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm border border-green-200 dark:border-green-800 flex items-start"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium mb-1">{translate("message_sended_info", language)}</p>
                        <p>{formStatus.success}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Submit button */}
                  <motion.button
                    whileHover={{ scale: formStatus.isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: formStatus.isSubmitting ? 1 : 0.98 }}
                    disabled={formStatus.isSubmitting}
                    type="submit"
                    className={`w-full py-3 px-4 rounded-lg font-medium flex justify-center items-center transition-all duration-200 ${
                      formStatus.isSubmitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                    } text-white`}
                  >
                    {formStatus.isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-3 h-5 w-5" />
                        {translate("sending", language)}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {translate("send_message_btn", language)}
                      </>
                    )}
                  </motion.button>

                  {/* Privacy note */}
                  <p className="text-xs opacity-75 text-center mt-3">
                    {live_language.privacy_note ||
                      "En soumettant ce formulaire, vous acceptez notre politique de confidentialité."}
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
