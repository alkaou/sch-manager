import React from "react";
import { motion } from "framer-motion";
import { CalendarIcon, Edit3, AlertCircle } from "lucide-react";
import translations from "./depense_translator";
import { useLanguage } from "../contexts";

const PaymentDetailsForm = ({
  formDetails,
  setFormDetails,
  errors,
  theme,
  text_color,
  totalPayment
}) => {
  const { language } = useLanguage();

  // Translation helper
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === "Anglais" ? "en-US" : "fr-FR").format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{t('payment_details')}</h3>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {t('payment_details_instruction')}
        </p>
      </div>

      {/* Payment summary banner */}
      <div className={`mb-8 p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"} flex flex-col md:flex-row justify-between items-center`}>
        <div>
          <h4 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-blue-800"}`}>
            {t('payment_summary')}
          </h4>
          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-blue-600"}`}>
            {t('please_review_details')}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end">
          <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-blue-600"}`}>
            {t('original_amount')}: {formatCurrency(totalPayment.original)} FCFA
          </div>
          <div className={`text-xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
            {t('total_to_pay')}: {formatCurrency(totalPayment.toPay)} FCFA
          </div>
          <div className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-blue-500"}`}>
            {totalPayment.toPay < totalPayment.original && (
              <span>
                {t('saving')}: {formatCurrency(totalPayment.original - totalPayment.toPay)} FCFA 
                ({Math.round((1 - totalPayment.toPay / totalPayment.original) * 100)}%)
              </span>
            )}
          </div>
        </div>
      </div>

      <form className="space-y-6">
        {/* Payment title */}
        <div>
          <label 
            htmlFor="name" 
            className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
          >
            {t('payment_title')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Edit3 size={18} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formDetails.name}
              onChange={handleChange}
              placeholder={t('payment_title_placeholder')}
              className={`block w-full pl-10 py-2 ${
                theme === "dark" 
                  ? "bg-gray-700 text-white border-gray-600" 
                  : "bg-white text-gray-900 border-gray-300"
              } border rounded-lg focus:ring-2 ${
                theme === "dark" ? "focus:ring-blue-600" : "focus:ring-blue-500"
              } focus:outline-none ${
                errors.name ? "border-red-500" : ""
              }`}
              minLength={10}
              maxLength={150}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.name}
            </p>
          )}
          <p className={`mt-1 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {t('payment_title_help')} ({formDetails.name.length}/150)
          </p>
        </div>

        {/* Payment date */}
        <div>
          <label 
            htmlFor="date" 
            className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
          >
            {t('payment_date')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon size={18} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
            </div>
            <input
              type="date"
              id="date"
              name="date"
              value={formDetails.date}
              onChange={handleChange}
              className={`block w-full pl-10 py-2 ${
                theme === "dark" 
                  ? "bg-gray-700 text-white border-gray-600" 
                  : "bg-white text-gray-900 border-gray-300"
              } border rounded-lg focus:ring-2 ${
                theme === "dark" ? "focus:ring-blue-600" : "focus:ring-blue-500"
              } focus:outline-none ${
                errors.date ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.date}
            </p>
          )}
        </div>

        {/* Payment description */}
        <div>
          <label 
            htmlFor="description" 
            className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
          >
            {t('payment_description')} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formDetails.description}
            onChange={handleChange}
            placeholder={t('payment_description_placeholder')}
            rows={6}
            className={`block w-full p-3 ${
              theme === "dark" 
                ? "bg-gray-700 text-white border-gray-600" 
                : "bg-white text-gray-900 border-gray-300"
            } border rounded-lg focus:ring-2 ${
              theme === "dark" ? "focus:ring-blue-600" : "focus:ring-blue-500"
            } focus:outline-none ${
              errors.description ? "border-red-500" : ""
            }`}
            minLength={30}
            maxLength={10000}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.description}
            </p>
          )}
          <p className={`mt-1 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {t('payment_description_help')} ({formDetails.description.length}/10000)
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default PaymentDetailsForm; 