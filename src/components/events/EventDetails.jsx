import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Type,
  FileText,
  User,
  CheckCircle,
  XCircle,
  MessageSquare,
  Edit,
  Trash2,
  Award,
} from "lucide-react";
import { useLanguage } from "../contexts";
import { translate } from "./events_translator";
import {
  canEditEvent,
  canDeleteEvent,
  canValidateEvent,
  formatEventDuration,
  determineEventStatus,
} from "./EventsMethodes";

const EventDetails = ({
  isOpen,
  onClose,
  event,
  onEdit,
  // onDelete,
  onValidate,
  theme,
  text_color,
}) => {
  const { language } = useLanguage();

  if (!isOpen || !event) return null;

  const currentStatus = determineEventStatus(event);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "validated":
        return "bg-green-100 text-green-800 border-green-200";
      case "ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "past":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-600" size={16} />;
      case "validated":
        return <CheckCircle className="text-green-600" size={16} />;
      case "ongoing":
        return <Calendar className="text-blue-600" size={16} />;
      case "past":
        return <XCircle className="text-gray-600" size={16} />;
      default:
        return <Calendar className="text-purple-600" size={16} />;
    }
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
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

  const sectionVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          variants={contentVariants}
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
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{event.title}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(
                    currentStatus
                  )}`}
                >
                  {getStatusIcon(currentStatus)}
                  {translate(currentStatus, language)}
                </span>
              </div>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {translate(event.type, language)} •{" "}
                {language === "Bambara"
                  ? formatEventDuration(event).replace("min", "sanga")
                  : formatEventDuration(event)}
              </p>
            </div>
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

          {/* Contenu principal */}
          <div className="p-6 space-y-6">
            <motion.div
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Informations générales */}
              <motion.div variants={sectionVariants} className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="text-blue-500" size={20} />
                  {translate("general_information", language)}
                </h3>

                <div
                  className={`p-4 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-750 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Type className="text-purple-500" size={16} />
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {translate("type", language)}:
                      </span>
                      <span>{translate(event.type, language)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="text-green-500" size={16} />
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {translate("period", language)}:
                      </span>
                      <span>
                        {event.startDate} - {event.endDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="text-orange-500" size={16} />
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {translate("time", language)}:
                      </span>
                      <span>
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="text-indigo-500" size={16} />
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {translate("created_at", language)}:
                      </span>
                      <span>
                        {new Date(event.createdAt).toLocaleDateString(
                          language === "fr" ? "fr-FR" : "en-US"
                        )}
                      </span>
                    </div>

                    {event.updatedAt && event.updatedAt !== event.createdAt && (
                      <div className="flex items-center gap-3">
                        <Edit className="text-yellow-500" size={16} />
                        <span
                          className={`font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {translate("updated_at", language)}:
                        </span>
                        <span>
                          {new Date(event.updatedAt).toLocaleDateString(
                            language === "fr" ? "fr-FR" : "en-US"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div variants={sectionVariants} className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="text-green-500" size={20} />
                  {translate("actions", language)}
                </h3>

                <div className="space-y-3">
                  {canEditEvent(event) && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onEdit(event)}
                      className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      {translate("edit_event", language)}
                    </motion.button>
                  )}

                  {canValidateEvent(event) && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onValidate(event)}
                      className="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      {translate("validate_event", language)}
                    </motion.button>
                  )}

                  {currentStatus === "validated" && event.validation && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onValidate(event)}
                      className="w-full p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      {translate("edit_validation_messages", language)}
                    </motion.button>
                  )}

                  {!canEditEvent(event) &&
                    !canValidateEvent(event) &&
                    !canDeleteEvent(event) &&
                    currentStatus !== "validated" && (
                      <div
                        className={`p-4 rounded-lg border ${
                          theme === "dark"
                            ? "bg-gray-750 border-gray-700 text-gray-400"
                            : "bg-gray-50 border-gray-200 text-gray-600"
                        } text-center`}
                      >
                        <XCircle
                          size={24}
                          className="mx-auto mb-2 opacity-50"
                        />
                        <p className="text-sm">
                          {translate("no_actions_available", language)}
                        </p>
                      </div>
                    )}
                </div>
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.div variants={sectionVariants} className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="text-purple-500" size={20} />
                {translate("description", language)}
              </h3>

              <div
                className={`p-4 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-750 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>

            {/* Informations de validation (si l'événement est validé) */}
            {currentStatus === "validated" && event.validation && (
              <motion.div variants={sectionVariants} className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  {translate("validation_information", language)}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Succès */}
                  <div
                    className={`p-4 rounded-lg border ${
                      theme === "dark"
                        ? "bg-green-900 bg-opacity-20 border-green-700"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                      <CheckCircle size={16} />
                      {translate("success", language)}
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">
                      {event.validation.success}
                    </p>
                  </div>

                  {/* Échecs */}
                  <div
                    className={`p-4 rounded-lg border ${
                      theme === "dark"
                        ? "bg-red-900 bg-opacity-20 border-red-700"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                      <XCircle size={16} />
                      {translate("failure", language)}
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">
                      {event.validation.failure}
                    </p>
                  </div>

                  {/* Remarques */}
                  <div
                    className={`p-4 rounded-lg border ${
                      theme === "dark"
                        ? "bg-blue-900 bg-opacity-20 border-blue-700"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <h4 className="font-medium text-blue-600 mb-2 flex items-center gap-2">
                      <MessageSquare size={16} />
                      {translate("remarks", language)}
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">
                      {event.validation.remarks}
                    </p>
                  </div>
                </div>

                {event.validation.validatedAt && (
                  <div
                    className={`p-3 rounded-lg border text-center ${
                      theme === "dark"
                        ? "bg-gray-750 border-gray-700 text-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  >
                    <p className="text-sm">
                      {translate("validated_on", language)}:{" "}
                      {new Date(
                        event.validation.validatedAt
                      ).toLocaleDateString(
                        language === "fr" ? "fr-FR" : "en-US"
                      )}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventDetails;
