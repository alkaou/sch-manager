import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../auth/firebaseService";
import { FaTimes, FaEdit, FaCloudUploadAlt, FaCloudDownloadAlt, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import translations from "./db_manager_translator";
import { useLanguage } from "../contexts";

const DatabaseDetails = ({ database, onClose, onUpdate, theme, textColor, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(database.name);
  const [description, setDescription] = useState(database.description || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState(null);
  const [localData, setLocalData] = useState({});
  const isDark = theme === "dark";

  const { language } = useLanguage();

  // Translation function
  const translation = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  const getLocalDatabase = async () => {
    await window.electron.getDatabase().then((data) => {
      if (!data) {
        const no_data_textes = translation("no_database_found");
        return no_data_textes;
      }
      setLocalData(data);
    });
    return true;
  };

  const updateLocalDatabase = async (remoteData) => {
    await window.electron.saveDatabase(remoteData).then(() => {
      return true;
    });
  };

  useEffect(() => {
    getLocalDatabase();
  }, [user]);

  const formatDate = (timestamp) => {
    const unknow_date = translation("unknown_date");
    if (!timestamp) return unknow_date;
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleSaveChanges = async () => {
    if (name.trim().length < 6) {
      setMessage({
        type: "error",
        text: translation("name_min_length"),
      });
      return;
    }

    if (name.trim().length > 100) {
      setMessage({
        type: "error",
        text: translation("name_max_length"),
      });
      return;
    }

    if (description.length > 1000) {
      setMessage({
        type: "error",
        text: translation("description_max_length"),
      });
      return;
    }

    try {
      // Update path to use the correct structure: users/{userId}/databases/{databaseId}
      const dbRef = doc(db, "users", user.uid, "databases", database.id);
      await updateDoc(dbRef, {
        name: name.trim(),
        description: description.trim(),
        updatedAt: new Date()
      });
      
      setIsEditing(false);
      setMessage({
        type: "success",
        text: translation("database_updated"),
      });
      
      onUpdate();
    } catch (error) {
      console.error("Error updating database:", error);
      setMessage({
        type: "error",
        text: translation("error_updating_database"),
      });
    }
  };

  const handleUploadDatabase = async () => {
    try {
      setIsUploading(true);
      setMessage(null);
      
      // See local database
      // console.log(localData);
      
      if (!localData) {
        setMessage({
          type: "error",
          text: translation("local_db_read_error"),
        });
        return;
      }
      
      // Update remote database - fix the path
      const dbRef = doc(db, "users", user.uid, "databases", database.id);
      await updateDoc(dbRef, {
        data: localData,
        updatedAt: new Date()
      });
      
      setMessage({
        type: "success",
        text: translation("upload_success"),
      });
      
      onUpdate();
    } catch (error) {
      console.error("Error uploading database:", error);
      setMessage({
        type: "error",
        text: translation("upload_error"),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadDatabase = async () => {
    try {
      setIsDownloading(true);
      setMessage(null);
      
      // Get remote database - fix the path
      const dbRef = doc(db, "users", user.uid, "databases", database.id);
      const docSnap = await getDoc(dbRef);
      
      if (!docSnap.exists()) {
        setMessage({
          type: "error",
          text: translation("remote_db_not_found"),
        });
        return;
      }
      
      const remoteData = docSnap.data().data;

      // console.log(remoteData.version);
      
      if (!remoteData.version) {
        setMessage({
          type: "error",
          text: translation("remote_db_empty"),
        });
        return;
      }
      
      // Update local database
      await updateLocalDatabase(remoteData);
      
      setMessage({
        type: "success",
        text: translatione("download_success"),
      });
    } catch (error) {
      console.error("Error downloading database:", error);
      setMessage({
        type: "error",
        text: translation("download_error"),
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className={`relative w-full max-w-4xl rounded-xl shadow-2xl ${
          isDark ? "bg-gray-800" : "bg-white"
        } overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {!isEditing ? (
                <h2 className={`text-2xl font-bold ${textColor}`}>{database.name}</h2>
              ) : (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`text-2xl font-bold px-2 py-1 rounded ${
                    isDark ? "bg-gray-600 text-white" : "bg-white text-gray-800"
                  } border ${isDark ? "border-gray-500" : "border-gray-300"}`}
                  placeholder={translation("database_name")}
                />
              )}
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`ml-3 p-2 rounded-full ${
                    isDark ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-200"
                  }`}
                >
                  <FaEdit className={textColor} />
                </button>
              ) : null}
            </div>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${
                isDark ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-200"
              }`}
            >
              <FaTimes className={textColor} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-3 rounded ${
                message.type === "success"
                  ? isDark ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"
                  : isDark ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800"
              } flex items-center`}
            >
              {message.type === "success" ? (
                <FaCheck className="mr-2" />
              ) : (
                <FaExclamationTriangle className="mr-2" />
              )}
              {message.text}
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>{translation("database_info")}</h3>
              <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="mb-4">
                  <p className={`text-sm opacity-70 ${textColor}`}>{translation("description_text")}:</p>
                  {!isEditing ? (
                    <p className={`${textColor} ${!database.description && "italic opacity-50"}`}>
                      {database.description || translation("no_description")}
                    </p>
                  ) : (
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`w-full p-2 rounded ${
                        isDark ? "bg-gray-600 text-white" : "bg-white text-gray-800"
                      } border ${isDark ? "border-gray-500" : "border-gray-300"}`}
                      placeholder={translation("description")}
                      rows={4}
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm opacity-70 ${textColor}`}>{translation("created_on")}:</p>
                    <p className={textColor}>{formatDate(database.createdAt)}</p>
                  </div>
                  <div>
                    <p className={`text-sm opacity-70 ${textColor}`}>{translation("updated_on")}:</p>
                    <p className={textColor}>{formatDate(database.updatedAt)}</p>
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-4 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(false)}
                    className={`px-4 py-2 rounded ${
                      isDark
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-gray-300 hover:bg-gray-400"
                    } ${textColor}`}
                  >
                    {translation("cancel")}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveChanges}
                    className={`px-4 py-2 rounded ${
                      isDark
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    {translation("save_changes")}
                  </motion.button>
                </div>
              )}
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>{translation("actions")}</h3>
              <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"} space-y-4`}>
                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUploadDatabase}
                    disabled={isUploading}
                    className={`w-full p-4 rounded-lg flex items-center justify-center ${
                      isDark
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white transition-colors`}
                  >
                    {isUploading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        {translation("uploading")}
                      </div>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-xl mr-2" />
                        {translation("upload_local_db")}
                      </>
                    )}
                  </motion.button>
                  <p className={`mt-2 text-xs ${textColor} opacity-70 text-center`}>
                    {translation("upload_description")}
                  </p>
                </div>
                
                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadDatabase}
                    disabled={isDownloading}
                    className={`w-full p-4 rounded-lg flex items-center justify-center ${
                      isDark
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white transition-colors`}
                  >
                    {isDownloading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        {translation("downloading")}
                      </div>
                    ) : (
                      <>
                        <FaCloudDownloadAlt className="text-xl mr-2" />
                        {translation("download_remote_db")}
                      </>
                    )}
                  </motion.button>
                  <p className={`mt-2 text-xs ${textColor} opacity-70 text-center`}>
                    {translation("upload_description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DatabaseDetails;