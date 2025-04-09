import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Crown } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useTheme } from '../components/contexts';

const UserProfile = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className={`${bgColor} rounded-lg shadow-lg p-8 max-w-md w-full`}>
          <div className="text-center">
            <User size={64} className={`mx-auto ${textColor} opacity-20`} />
            <h2 className={`mt-4 text-xl font-bold ${textColor}`}>Not Logged In</h2>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Please log in to view your profile
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${bgColor} rounded-lg shadow-lg overflow-hidden max-w-md w-full`}
      >
        {/* Header with user photo */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 flex flex-col items-center">
          <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-white">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600">
                <User size={48} />
              </div>
            )}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">
            {currentUser?.displayName || 'User'}
          </h1>
          {currentUser?.isPremium && (
            <div className="mt-2 flex items-center bg-amber-500 text-white px-3 py-1 rounded-full text-sm">
              <Crown size={14} className="mr-1" />
              Premium Member
            </div>
          )}
        </div>

        {/* User details */}
        <div className="p-6">
          <div className={`${cardBg} rounded-lg p-4 mb-4`}>
            <div className="flex items-center">
              <Mail size={18} className={`mr-2 ${textColor}`} />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                <p className={`${textColor} font-medium`}>{currentUser?.email}</p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-lg p-4 mb-4`}>
            <div className="flex items-center">
              <User size={18} className={`mr-2 ${textColor}`} />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>User ID</p>
                <p className={`${textColor} font-medium`}>{currentUser?.uid.substring(0, 12)}...</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>{loading ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;