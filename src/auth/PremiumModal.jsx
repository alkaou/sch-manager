import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown, AlertCircle } from 'lucide-react';
import { useTheme } from '../components/contexts';
import { useAuth } from './AuthContext';
import AlertPopup from '../components/AlertPopup.jsx';

const PremiumModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { isAuthenticated, currentUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  // Premium plans
  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '5,000',
      period: 'FCFA / month',
      features: [
        'All premium features',
        'Priority support',
        'Cloud backup',
        'Advanced analytics'
      ]
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      price: '12,000',
      period: 'FCFA / 3 months',
      features: [
        'All premium features',
        'Priority support',
        'Cloud backup',
        'Advanced analytics',
        '20% savings compared to monthly'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '45,000',
      period: 'FCFA / year',
      features: [
        'All premium features',
        'Priority support',
        'Cloud backup',
        'Advanced analytics',
        '25% savings compared to monthly'
      ]
    }
  ];
  
  // Handle subscription
  const handleSubscribe = () => {
    // Here you would implement your payment processing logic
    // Show custom alert popup instead of using alert()
    setAlertMessage(`Subscription to ${selectedPlan} plan initiated. This would connect to a payment processor in production.`);
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
              className={`${bgColor} rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} className={textColor} />
                </button>
                <div className="flex items-center gap-3">
                  <Crown size={28} className="text-amber-500" />
                  <h2 className={`text-2xl font-bold ${textColor}`}>Upgrade to Premium</h2>
                </div>
                <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Unlock all features and take your school management to the next level
                </p>
              </div>
              
              {/* Body */}
              <div className="p-6">
                {!isAuthenticated && (
                  <div className="mb-6 p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg flex items-start gap-3">
                    <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Authentication Required</p>
                      <p className="mt-1 text-sm">You need to log in before subscribing to premium features.</p>
                    </div>
                  </div>
                )}
                
                {/* Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -5 }}
                      className={`${
                        selectedPlan === plan.id
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : `${borderColor}`
                      } border rounded-xl overflow-hidden cursor-pointer transition-all`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <div className={`p-6 ${
                        selectedPlan === plan.id
                          ? 'bg-blue-500 text-white'
                          : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-extrabold">{plan.price}</span>
                          <span className="ml-1 text-sm opacity-80">{plan.period}</span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <ul className="space-y-3">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                              <span className={textColor}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    onClick={onClose}
                    className={`px-6 py-3 rounded-lg ${borderColor} border ${textColor} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubscribe}
                    disabled={!isAuthenticated}
                    className={`px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2 ${
                      !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Crown size={18} />
                    <span>Subscribe Now</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Custom Alert Popup */}
          <AlertPopup 
            isOpenAlertPopup={isAlertOpen}
            setIsOpenAlertPopup={handleAlertClose}
            title="Subscription Initiated"
            message={alertMessage}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;