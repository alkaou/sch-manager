import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, Settings, Loader2, X } from 'lucide-react';
import { useTheme } from '../contexts';
import SecurityConfirmation from './SecurityConfirmation.jsx';
import SecuritySettings from './SecuritySettings.jsx';
import HelpPopup from './HelpPopup.jsx';

const SecurityManager = ({ onConfirm, onClose, onConfirmAction }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [db, setDb] = useState(null);
  const [hasPassword, setHasPassword] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDb = useCallback(async () => {
    setIsLoading(true);
    try {
      const database = await window.electron.getDatabase();
      setDb(database);
      const passwordExists = !!database.security.password;
      setHasPassword(passwordExists);
      if (!passwordExists) {
        setShowSettings(true);
      }
    } catch (error) {
      console.error("Failed to fetch database:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDb();
  }, [fetchDb]);

  const handlePasswordUpdate = () => {
    fetchDb(); // Refresh data
    setShowSettings(false); // Go back to confirmation screen
  };

  if (isLoading || !db) {
    return (
      <div className={`relative p-8 rounded-xl shadow-2xl ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} flex justify-center items-center`} style={{ minWidth: '450px', minHeight: '300px' }}>
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const mainContent = showSettings ? (
    <SecuritySettings
      hasPassword={hasPassword}
      onBack={() => setShowSettings(false)}
      db={db}
      onPasswordUpdate={handlePasswordUpdate}
    />
  ) : (
    <SecurityConfirmation
      onConfirm={onConfirm}
      onSettings={() => setShowSettings(true)}
      hasPassword={hasPassword}
      db={db}
      onConfirmAction={onConfirmAction}
    />
  );

  return (
    <div className={`relative p-6 rounded-xl shadow-2xl ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`} style={{ minWidth: '450px' }}>
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        {!showSettings && hasPassword && (
          <button onClick={() => setShowSettings(true)} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}><Settings size={20} /></button>
        )}
        <button onClick={() => setShowHelp(true)} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}><HelpCircle size={20} /></button>
        <button onClick={onClose} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}><X size={20} /></button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={showSettings ? 'settings' : 'confirm'}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {mainContent}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && <HelpPopup onClose={() => setShowHelp(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default SecurityManager;

