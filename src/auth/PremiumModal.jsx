import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown, AlertCircle } from 'lucide-react';
import { useTheme } from '../components/contexts';
import { useLanguage } from '../components/contexts';
import { useAuth } from './AuthContext';
import AlertPopup from '../components/popups/AlertPopup.jsx';
import translations from './auth_translator';

const PremiumModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { isAuthenticated, currentUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Translation helper function
  const t = (key, replacements = {}) => {
    if (!translations[key]) return key;
    let text = translations[key][language] || translations[key]["Français"];

    // Handle replacements for dynamic content
    Object.entries(replacements).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, value);
    });

    return text;
  };

  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  // Premium plans
  const plans = [
    {
      id: 'monthly',
      name: t('monthly'),
      price: '5,000',
      period: t('fcfa_month'),
      features: [
        t('all_premium_features'),
        t('priority_support'),
        t('cloud_backup'),
        t('advanced_analytics')
      ]
    },
    {
      id: 'quarterly',
      name: t('quarterly'),
      price: '12,000',
      period: t('fcfa_3months'),
      features: [
        t('all_premium_features'),
        t('priority_support'),
        t('cloud_backup'),
        t('advanced_analytics'),
        t('savings_monthly_20')
      ]
    },
    {
      id: 'yearly',
      name: t('yearly'),
      price: '45,000',
      period: t('fcfa_year'),
      features: [
        t('all_premium_features'),
        t('priority_support'),
        t('cloud_backup'),
        t('advanced_analytics'),
        t('savings_monthly_25')
      ]
    }
  ];

  // Handle subscription
  const handleSubscribe = () => {
    // Here you would implement your payment processing logic
    // Show custom alert popup instead of using alert()
    const planName = plans.find(p => p.id === selectedPlan)?.name || selectedPlan;
    setAlertMessage(t('subscription_message', { plan: planName }));
    setIsAlertOpen(true);
  };

  // Handle alert close
  const handleAlertClose = () => {
    setIsAlertOpen(false);
    onClose(); // Close the modal after alert is dismissed
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className={`${bgColor} rounded-lg shadow-xl w-full max-w-full md:max-w-4xl mx-4 overflow-hidden overflow-y-auto scrollbar-custom max-h-[90vh]`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={18} className={`sm:w-5 sm:h-5 ${textColor}`} />
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Crown size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-amber-500" />
                  <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${textColor}`}>{t('upgrade_to_premium')}</h2>
                </div>
                <p className={`mt-2 text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('unlock_all_features')}
                </p>
              </div>

              {/* Body */}
              <div className="p-3 sm:p-4 md:p-6">
                {!isAuthenticated && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg flex items-start gap-2 sm:gap-3 text-sm">
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0 sm:w-5 sm:h-5" />
                    <div>
                      <p className="font-medium">{t('authentication_required')}</p>
                      <p className="mt-1 text-xs sm:text-sm">{t('login_before_subscribing')}</p>
                    </div>
                  </div>
                )}

                {/* Plans */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -5 }}
                      className={`${selectedPlan === plan.id
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : `${borderColor}`
                        } border rounded-xl overflow-hidden cursor-pointer transition-all`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <div className={`p-3 sm:p-4 md:p-6 ${selectedPlan === plan.id
                          ? 'bg-blue-500 text-white'
                          : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-xl sm:text-2xl md:text-3xl font-extrabold">{plan.price}</span>
                          <span className="ml-1 text-xs sm:text-sm opacity-80">{plan.period}</span>
                        </div>
                      </div>

                      <div className="p-3 sm:p-4 md:p-6">
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0 sm:w-5 sm:h-5" />
                              <span className={textColor}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                  <button
                    onClick={onClose}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} ${borderColor} border ${textColor} transition-colors text-sm sm:text-base`}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleSubscribe}
                    disabled={!isAuthenticated}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <Crown size={16} className="sm:w-5 sm:h-5" />
                    <span>{t('subscribe_now')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Custom Alert Popup */}
          <AlertPopup
            isOpenAlertPopup={isAlertOpen}
            setIsOpenAlertPopup={handleAlertClose}
            title={t('subscription_initiated')}
            message={alertMessage}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;