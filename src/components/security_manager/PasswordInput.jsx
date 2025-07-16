import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const PasswordInput = ({ value, onChange, placeholder, onKeyDown }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="relative w-full">
      <input
        type={isPasswordVisible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-12 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <motion.button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
      </motion.button>
    </div>
  );
};

export default PasswordInput;

