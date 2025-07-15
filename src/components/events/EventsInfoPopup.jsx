import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  CheckCircle,
  Bell,
  Volume2,
  Users,
  Zap,
  ChevronRight,
  Info,
  Star,
  Target,
  Lightbulb,
  BookOpen,
  Award,
  Delete,
} from "lucide-react";
import { useLanguage } from "../contexts";
import { translate } from "./events_translator";

const EventsInfoPopup = ({ isOpen, onClose, theme }) => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState("overview");

  if (!isOpen) return null;

  const sections = [
    {
      id: "overview",
      icon: BookOpen,
      title: translate("events_overview", language),
      color: "blue",
    },
    {
      id: "features",
      icon: Star,
      title: translate("events_features", language),
      color: "purple",
    },
    {
      id: "workflow",
      icon: Target,
      title: translate("events_workflow", language),
      color: "green",
    },
    {
      id: "notifications",
      icon: Bell,
      title: translate("events_notifications", language),
      color: "orange",
    },
    {
      id: "tips",
      icon: Lightbulb,
      title: translate("events_tips", language),
      color: "yellow",
    },
  ];

  const getColorClasses = (color, variant = "bg") => {
    const colors = {
      blue: {
        bg: "bg-blue-500",
        light: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
      },
      purple: {
        bg: "bg-purple-500",
        light: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
      },
      green: {
        bg: "bg-green-500",
        light: "bg-green-100",
        text: "text-green-600",
        border: "border-green-200",
      },
      orange: {
        bg: "bg-orange-500",
        light: "bg-orange-100",
        text: "text-orange-600",
        border: "border-orange-200",
      },
      yellow: {
        bg: "bg-yellow-500",
        light: "bg-yellow-100",
        text: "text-yellow-600",
        border: "border-yellow-200",
      },
    };
    return colors[color]?.[variant] || colors.blue[variant];
  };

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${theme !== "dark" ? "text-gray-700" : ""}`}
    >
      <div className={`text-center ${theme !== "dark" ? "text-gray-700" : ""}`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
        >
          <Calendar className="text-white" size={40} />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">
          {translate("events_system_title", language)}
        </h3>
        <p
          className={`text-lg ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {translate("events_system_description", language)}
        </p>
      </div>

      <div
        className={`${
          theme !== "dark" ? "text-gray-700" : ""
        } grid grid-cols-1 md:grid-cols-2 gap-4`}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users className="text-blue-600" size={20} />
            </div>
            <h4 className="font-semibold">
              {translate("events_management", language)}
            </h4>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {translate("events_management_desc", language)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center mb-3">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Bell className="text-green-600" size={20} />
            </div>
            <h4 className="font-semibold">
              {translate("smart_notifications", language)}
            </h4>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {translate("smart_notifications_desc", language)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center mb-3">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Volume2 className="text-purple-600" size={20} />
            </div>
            <h4 className="font-semibold">
              {translate("voice_alerts", language)}
            </h4>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {translate("voice_alerts_desc", language)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center mb-3">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Award className="text-orange-600" size={20} />
            </div>
            <h4 className="font-semibold">
              {translate("event_validation", language)}
            </h4>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {translate("event_validation_desc", language)}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderFeatures = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${theme !== "dark" ? "text-gray-700" : ""}`}
    >
      <h3 className="text-xl font-bold mb-4">
        {translate("key_features", language)}
      </h3>

      <div className={"space-y-4"}>
        {[
          {
            icon: Calendar,
            title: translate("comprehensive_planning", language),
            description: translate("comprehensive_planning_desc", language),
            color: "blue",
          },
          {
            icon: Clock,
            title: translate("real_time_tracking", language),
            description: translate("real_time_tracking_desc", language),
            color: "green",
          },
          {
            icon: Bell,
            title: translate("intelligent_reminders", language),
            description: translate("intelligent_reminders_desc", language),
            color: "orange",
          },
          {
            icon: CheckCircle,
            title: translate("validation_system", language),
            description: translate("validation_system_desc", language),
            color: "purple",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start p-4 rounded-xl border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-3 ${getColorClasses(
                feature.color,
                "light"
              )} rounded-lg mr-4 flex-shrink-0`}
            >
              <feature.icon
                className={getColorClasses(feature.color, "text")}
                size={24}
              />
            </div>
            <div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderWorkflow = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${theme !== "dark" ? "text-gray-700" : ""}`}
    >
      <h3 className="text-xl font-bold mb-4">
        {translate("event_workflow", language)}
      </h3>

      <div className="space-y-4">
        {[
          {
            step: 1,
            icon: Calendar,
            title: translate("create_event", language),
            description: translate("create_event_desc", language),
            status: "pending",
          },
          {
            step: 2,
            icon: Clock,
            title: translate("monitor_progress", language),
            description: translate("monitor_progress_desc", language),
            status: "ongoing",
          },
          {
            step: 3,
            icon: Bell,
            title: translate("receive_notifications", language),
            description: translate("receive_notifications_desc", language),
            status: "ongoing",
          },
          {
            step: 4,
            icon: CheckCircle,
            title: translate("validate_completion", language),
            description: translate("validate_completion_desc", language),
            status: "validated",
          },
        ].map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            className={`relative flex items-center p-4 rounded-xl border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center mr-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  step.status === "pending"
                    ? "bg-yellow-500"
                    : step.status === "ongoing"
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
              >
                {step.step}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <step.icon className="mr-2" size={20} />
                <h4 className="font-semibold">{step.title}</h4>
              </div>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {step.description}
              </p>
            </div>
            {index < 3 && (
              <div className="absolute left-4 top-16 w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${theme !== "dark" ? "text-gray-700" : ""}`}
    >
      <h3 className="text-xl font-bold mb-4">
        {translate("notification_system", language)}
      </h3>

      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border-2 border-orange-200 ${
            theme === "dark" ? "bg-orange-900/20" : "bg-orange-50"
          }`}
        >
          <div className="flex items-center mb-3">
            <Bell className="text-orange-600 mr-3" size={24} />
            <h4 className="font-semibold text-orange-800 dark:text-orange-300">
              {translate("automatic_reminders", language)}
            </h4>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-orange-200" : "text-orange-700"
            } mb-3`}
          >
            {translate("automatic_reminders_desc", language)}
          </p>
          <div className="flex items-center text-sm text-orange-600">
            <Clock className="mr-2" size={16} />
            {translate("reminder_timing", language)}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border-2 border-green-200 ${
            theme === "dark" ? "bg-green-900/20" : "bg-green-50"
          }`}
        >
          <div className="flex items-center mb-3">
            <CheckCircle className="text-green-600 mr-3" size={24} />
            <h4 className="font-semibold text-green-800 dark:text-green-300">
              {translate("external_notifications", language)}
            </h4>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-green-200" : "text-green-700"
            } mb-3`}
          >
            {translate("external_notifications_desc", language)}
          </p>
          <div className="flex items-center text-sm text-green-600">
            <Info className="mr-2" size={16} />
            {translate("admin_integration", language)}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border-2 border-purple-200 ${
            theme === "dark" ? "bg-purple-900/20" : "bg-purple-50"
          }`}
        >
          <div className="flex items-center mb-3">
            <Volume2 className="text-purple-600 mr-3" size={24} />
            <h4 className="font-semibold text-purple-800 dark:text-purple-300">
              {translate("voice_announcements", language)}
            </h4>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-purple-200" : "text-purple-700"
            } mb-3`}
          >
            {translate("voice_announcements_desc", language)}
          </p>
          <div className="flex items-center text-sm text-purple-600">
            <Info className="mr-2" size={16} />
            {translate("voice_languages", language)}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border-2 border-blue-200 ${
            theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
          }`}
        >
          <div className="flex items-center mb-3">
            <Zap className="text-blue-600 mr-3" size={24} />
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">
              {translate("dynamic_notifications", language)}
            </h4>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-blue-700"
            }`}
          >
            {translate("dynamic_notifications_desc", language)}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderTips = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${theme !== "dark" ? "text-gray-700" : ""}`}
    >
      <h3 className="text-xl font-bold mb-4">
        {translate("expert_tips", language)}
      </h3>

      <div className="space-y-4">
        {[
          {
            icon: Target,
            title: translate("tip_planning", language),
            description: translate("tip_planning_desc", language),
            color: "green",
          },
          {
            icon: Bell,
            title: translate("tip_notifications", language),
            description: translate("tip_notifications_desc", language),
            color: "orange",
          },
          {
            icon: CheckCircle,
            title: translate("tip_validation", language),
            description: translate("tip_validation_desc", language),
            color: "purple",
          },
          {
            icon: Delete,
            title: translate("delete_information", language),
            description: translate("delete_information_desc", language),
            color: "blue",
          },
        ].map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-start">
              <div
                className={`p-2 ${getColorClasses(
                  tip.color,
                  "light"
                )} rounded-lg mr-3 flex-shrink-0`}
              >
                <tip.icon
                  className={getColorClasses(tip.color, "text")}
                  size={20}
                />
              </div>
              <div>
                <h4 className="font-semibold mb-2">{tip.title}</h4>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {tip.description}
                </p>
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
      case "workflow":
        return renderWorkflow();
      case "notifications":
        return renderNotifications();
      case "tips":
        return renderTips();
      default:
        return renderOverview();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${
              theme === "dark"
                ? "border-gray-700 bg-gray-800 text-white"
                : "border-gray-200 bg-gray-50 text-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3">
                  <Info className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {translate("events_help_center", language)}
                  </h2>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {translate("events_help_subtitle", language)}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 rounded-full ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Sidebar */}
            <div
              className={`w-64 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              } border-r overflow-y-auto scrollbar-custom`}
            >
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-wide">
                  {translate("sections", language)}
                </h3>
                <div className="space-y-1">
                  {sections.map((section) => (
                    <motion.button
                      key={section.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all ${
                        activeSection === section.id
                          ? `${getColorClasses(section.color, "bg")} text-white`
                          : theme === "dark"
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <section.icon className="mr-3" size={18} />
                      <span className="text-sm font-medium">
                        {section.title}
                      </span>
                      {activeSection === section.id && (
                        <ChevronRight className="ml-auto" size={16} />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-custom">
              <div className="p-6">{renderContent()}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventsInfoPopup;
