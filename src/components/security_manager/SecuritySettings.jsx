import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLanguage, useTheme, useFlashNotification } from '../contexts';
import { translate } from './security_translator';
import { createPassword, changePassword, removePassword } from './security_methodes';
import PasswordInput from './PasswordInput.jsx';

const SecuritySettings = ({ hasPassword, onBack, db, onPasswordUpdate }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { setFlashMessage } = useFlashNotification();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState(hasPassword ? 'change' : 'create');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // États pour les inputs
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmDeletePassword, setConfirmDeletePassword] = useState('');

  const resetState = () => {
    setIsLoading(false);
    setError('');
    setNewPassword('');
    setConfirmNewPassword('');
    setOldPassword('');
    setConfirmDeletePassword('');
  }

  const handleAction = async (action) => {
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (action === 'create') {
        result = await createPassword(newPassword, confirmNewPassword, db);
      } else if (action === 'change') {
        result = await changePassword(oldPassword, newPassword, confirmNewPassword, db);
      } else if (action === 'delete') {
        result = await removePassword(confirmDeletePassword, db);
      }

      if (result.success) {
        setFlashMessage({
          message: translate(result.message, language),
          type: 'success',
          duration: 6000,
        });
        onPasswordUpdate(); // Notifie le parent et déclenche le retour
      } else {
        setError(translate(result.message, language));
      }
    } catch (e) {
      setError(translate('errorOccurred', language));
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    const renderButton = (label, action, color) => (
        <motion.button 
            onClick={() => handleAction(action)} 
            disabled={isLoading}
            className={`w-full flex items-center justify-center bg-${color}-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50`}
            whileHover={{scale: isLoading ? 1 : 1.02}}
            whileTap={{scale: isLoading ? 1 : 0.98}}
        >
            {isLoading && <Loader2 className="animate-spin mr-2" size={20} />}
            {label}
        </motion.button>
    )

    switch (activeTab) {
      case 'create':
        return (
          <div className="space-y-4">
            <PasswordInput placeholder={translate('newPassword', language)} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <PasswordInput placeholder={translate('confirmNewPassword', language)} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            {renderButton(translate('createPassword', language), 'create', 'blue')}
          </div>
        );
      case 'change':
        return (
          <div className="space-y-4">
            <PasswordInput placeholder={translate('oldPassword', language)} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <PasswordInput placeholder={translate('newPassword', language)} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <PasswordInput placeholder={translate('confirmNewPassword', language)} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            {renderButton(translate('changePassword', language), 'change', 'yellow')}
          </div>
        );
      case 'delete':
        return (
          <div className="space-y-4">
            <p className='text-center'>{translate('deletePasswordWarning', language)}</p>
            <PasswordInput placeholder={translate('currentPassword', language)} value={confirmDeletePassword} onChange={(e) => setConfirmDeletePassword(e.target.value)} />
            {renderButton(translate('deletePassword', language), 'delete', 'red')}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl mr-5 font-bold">{translate('securitySettings', language)}</h2>
        {hasPassword && <button onClick={onBack} className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>&larr; {translate('back', language)}</button>}
      </div>

      <div className={`flex border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} mb-4`}>
        {hasPassword ? (
          <>
            <TabButton name="change" label={translate('changePassword', language)} activeTab={activeTab} setActiveTab={setActiveTab} resetState={resetState} />
            <TabButton name="delete" label={translate('deletePassword', language)} activeTab={activeTab} setActiveTab={setActiveTab} resetState={resetState} />
          </>
        ) : (
          <TabButton name="create" label={translate('createPassword', language)} activeTab={activeTab} setActiveTab={setActiveTab} resetState={resetState} />
        )}
      </div>
      
      {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

      <div>{renderContent()}</div>
    </div>
  );
};

const TabButton = ({ name, label, activeTab, setActiveTab, resetState }) => (
  <button
    onClick={() => { setActiveTab(name); resetState(); }}
    className={`px-4 py-2 text-sm font-medium relative ${activeTab === name ? 'text-blue-500' : ''}`}>
    {label}
    {activeTab === name && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
  </button>
);

export default SecuritySettings;
