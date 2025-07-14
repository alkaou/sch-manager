import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Type,
  FileText,
  Save,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "../contexts";
import { translate } from "./events_translator";
import {
  EVENT_TYPES,
  validateEventData,
  createEvent,
  updateEvent,
} from "./EventsMethodes";

const EventForm = ({
  isOpen,
  onClose,
  event = null, // null pour création, objet pour modification
  database,
  setFlashMessage,
  onEventSaved,
  theme,
  // app_bg_color,
  text_color,
}) => {
  const { language } = useLanguage();
  const isEditing = event !== null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "other",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialiser le formulaire avec les données de l'événement si en mode édition
  useEffect(() => {
    if (isEditing && event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        type: event.type || "other",
        startDate: event.startDate || "",
        endDate: event.endDate || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
      });
    } else {
      // Réinitialiser pour la création
      setFormData({
        title: "",
        description: "",
        type: "other",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
      });
    }
    setErrors({});
  }, [isEditing, event, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = validateEventData(formData, language);

      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      let savedEvent;
      if (isEditing) {
        savedEvent = await updateEvent(
          event.id,
          formData,
          database,
          setFlashMessage,
          language
        );
      } else {
        savedEvent = await createEvent(
          formData,
          database,
          setFlashMessage,
          language
        );
      }

      onEventSaved(savedEvent);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClasses = (hasError = false) => {
    const baseClasses =
      "w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500";
    const themeClasses =
      theme === "dark"
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";
    const errorClasses = hasError ? "border-red-500 focus:ring-red-500" : "";

    return `${baseClasses} ${themeClasses} ${errorClasses}`;
  };

  const getSelectClasses = (hasError = false) => {
    return getInputClasses(hasError);
  };

  const getTextareaClasses = (hasError = false) => {
    return `${getInputClasses(hasError)} resize-none`;
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const formVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: { scale: 0.8, opacity: 0 },
  };

  const fieldVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ zIndex: 9999 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          variants={formVariants}
          className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-custom rounded-xl shadow-2xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } ${text_color}`}
        >
          {/* En-tête */}
          <div
            className={`flex items-center justify-between p-6 border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Calendar className="text-blue-500" size={28} />
              {isEditing
                ? translate("edit_event", language)
                : translate("add_event", language)}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <motion.div
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Titre */}
              <motion.div variants={fieldVariants} className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Type size={16} className="text-blue-500" />
                  {translate("title", language)} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={getInputClasses(errors.title)}
                  placeholder={`${translate("title", language)}...`}
                  maxLength={150}
                />
                <div className="flex justify-between mt-1">
                  {errors.title && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.title}
                    </span>
                  )}
                  <span
                    className={`text-xs ml-auto ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {formData.title.length}/150
                  </span>
                </div>
              </motion.div>

              {/* Type d'événement */}
              <motion.div variants={fieldVariants}>
                <label className="block text-sm font-medium mb-2">
                  {translate("type", language)} *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className={getSelectClasses(errors.type)}
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {translate(type, language)}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.type}
                  </span>
                )}
              </motion.div>

              {/* Date de début */}
              <motion.div variants={fieldVariants}>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-green-500" />
                  {translate("start_date", language)} *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className={getInputClasses(errors.startDate)}
                />
                {errors.startDate && (
                  <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.startDate}
                  </span>
                )}
              </motion.div>

              {/* Date de fin */}
              <motion.div variants={fieldVariants}>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-red-500" />
                  {translate("end_date", language)} *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className={getInputClasses(errors.endDate)}
                  min={formData.startDate}
                />
                {errors.endDate && (
                  <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.endDate}
                  </span>
                )}
              </motion.div>

              {/* Heure de début */}
              <motion.div variants={fieldVariants}>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock size={16} className="text-green-500" />
                  {translate("start_time", language)} *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                  className={getInputClasses(errors.startTime)}
                />
                {errors.startTime && (
                  <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.startTime}
                  </span>
                )}
              </motion.div>

              {/* Heure de fin */}
              <motion.div variants={fieldVariants}>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock size={16} className="text-red-500" />
                  {translate("end_time", language)} *
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  className={getInputClasses(errors.endTime)}
                />
                {errors.endTime && (
                  <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.endTime}
                  </span>
                )}
              </motion.div>

              {/* Description */}
              <motion.div variants={fieldVariants} className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-purple-500" />
                  {translate("description", language)} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={getTextareaClasses(errors.description)}
                  rows={6}
                  placeholder={`${translate("description", language)}...`}
                  maxLength={10000}
                />
                <div className="flex justify-between mt-1">
                  {errors.description && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.description}
                    </span>
                  )}
                  <span
                    className={`text-xs ml-auto ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {formData.description.length}/10000
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Boutons d'action */}
            <motion.div
              variants={fieldVariants}
              className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
                disabled={isSubmitting}
              >
                {translate("cancel", language)}
              </motion.button>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {translate("loading", language)}
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {translate("save", language)}
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventForm;
