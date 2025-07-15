import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { BsCheckCircleFill, BsDatabaseAdd } from "react-icons/bs";
import { FaSchool, FaMapMarkerAlt, FaBookOpen } from "react-icons/fa";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import { X } from "lucide-react";

import TextInput from "../partials/TextInput.jsx";
import {
  useLanguage as useLang,
  useTheme,
  useFlashNotification,
} from "../contexts";
import Error from "../partials/Error.jsx";
import { getFormattedDateTime, getDateTime } from "../../utils/helpers";

function DatabaseCreator({ setIsOpenPopup }) {
  const [dbName, setDbName] = useState("");
  const [shortName, setShortName] = useState("");
  const [academie, setAcademie] = useState("");
  const [zone, setZone] = useState("");
  const [error, setError] = useState("");
  const [messageIndication, setMessageIndication] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useTheme();
  const { live_language } = useLang();
  const [db, setDb] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isForUpdate, setIsForUpdate] = useState(false);

  const navigate = useNavigate();
  const { setFlashMessage } = useFlashNotification();

  useEffect(() => {
    window.electron.getDatabase().then((data) => {
      setDb(data);
      if (data.name !== undefined) {
        setIsForUpdate(true);
        setDbName(data.name);
        setShortName(data.short_name);
        setAcademie(data.academie);
        setZone(data.zone);
      }
    });
  }, []);

  // Effect for progress animation
  useEffect(() => {
    if (isCreating && progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prev) => Math.min(prev + 1, 100));
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isCreating, progress]);

  const changeInputVal = (field, value) => {
    setError("");

    switch (field) {
      case "dbName":
        setDbName(value);
        break;
      case "shortName":
        setShortName(value);
        break;
      case "academie":
        setAcademie(value);
        break;
      case "zone":
        setZone(value);
        break;
      default:
        break;
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return validateDbName();
      case 1:
        return validateShortName();
      case 2:
        return validateAcademie();
      case 3:
        return validateZone();
      default:
        return true;
    }
  };

  const validateDbName = () => {
    const name = dbName.trim();

    if (!name) {
      setError(live_language.error_empty);
      return false;
    }

    if (name.length < 3) {
      setError(live_language.error_minLength);
      return false;
    }

    if (name.length > 45) {
      setError(live_language.error_maxLength);
      return false;
    }

    const validNameRegex = /^[a-zA-Z0-9-_]+$/;
    if (!validNameRegex.test(name)) {
      setError(live_language.error_invalidChars);
      return false;
    }

    setError("");
    return true;
  };

  const validateShortName = () => {
    const name = shortName.trim();

    if (!name) {
      setError(live_language.error_empty);
      return false;
    }

    if (name.length < 2 || name.length > 10) {
      setError(live_language.error_shortname_length);
      return false;
    }

    setError("");
    return true;
  };

  const validateAcademie = () => {
    if (!academie.trim()) {
      setError(live_language.error_academie_empty);
      return false;
    }
    setError("");
    return true;
  };

  const validateZone = () => {
    if (!zone.trim()) {
      setError(live_language.error_zone_empty);
      return false;
    }
    setError("");
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        createNewDatabase();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closePopup = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsOpenPopup(false);
    }, 300); // Wait for exit animation to complete
  };

  const createNewDatabase = () => {
    setIsCreating(true);
    setProgress(0);

    const created_hour = getFormattedDateTime();
    const created_date = getDateTime();

    const date = created_date.dateTime;
    const hour = created_hour.formattedTime;

    let updatedDb;

    if (isForUpdate) {
      updatedDb = {
        ...db,
        name: dbName.trim().toUpperCase(),
        short_name: shortName.trim().toUpperCase(),
        academie: academie.trim().toUpperCase(),
        zone: zone.trim().toUpperCase(),
        version: "1.0.0",
        updated_at: date,
        updated_time: hour,
      };
    } else {
      updatedDb = {
        ...db,
        name: dbName.trim().toUpperCase(),
        short_name: shortName.trim().toUpperCase(),
        academie: academie.trim().toUpperCase(),
        zone: zone.trim().toUpperCase(),
        version: "1.0.0",
        created_at: date,
        created_time: hour,
        updated_at: date,
        updated_time: hour,
        security: "",
      };
    }

    const creating_or_updating_message = isForUpdate
      ? live_language.update_db_message
      : live_language.creating_db_message;
    const loading_updating_message = live_language.loading_message;
    const loading_patient_message = isForUpdate
      ? live_language.update_loading_patient_message
      : live_language.loading_patient_message;
    const finalisation_message = isForUpdate
      ? live_language.update_finalisation_db_message
      : live_language.created_db_message;
    const finished_flash_message = isForUpdate
      ? live_language.database_updated_success
      : `${live_language.database_created_success} : ${dbName}`;

    window.electron.saveDatabase(updatedDb).then(() => {
      setMessageIndication(creating_or_updating_message);

      setTimeout(() => {
        setMessageIndication(loading_updating_message);

        setTimeout(() => {
          setMessageIndication(loading_patient_message);

          setTimeout(() => {
            setMessageIndication(finalisation_message);

            setTimeout(() => {
              setIsVisible(false);
              setTimeout(() => {
                closePopup();
                setMessageIndication("");
                setFlashMessage({
                  message: finished_flash_message,
                  type: "success",
                  duration: 15000,
                });
                if (!isForUpdate) {
                  navigate("/started_page");
                }
              }, 300);
            }, 10000);
          }, 10000);
        }, 10000);
      }, 10000);
    });
  };

  const stepIcons = [
    <BsDatabaseAdd size={24} />,
    <FaBookOpen size={24} />,
    <FaSchool size={24} />,
    <FaMapMarkerAlt size={24} />,
  ];

  const stepLabels = [
    live_language.db_name,
    live_language.short_name,
    live_language.academie,
    live_language.zone,
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <TextInput
            name={live_language.create_input_info_text}
            holderExp="GROUPE-SCOLAIRE-FATOUMATA-DEMBELE"
            type="text"
            value={dbName.toUpperCase()}
            setValue={(e) => changeInputVal("dbName", e.target.value)}
            icon={<BsDatabaseAdd className="text-gray-500" />}
          />
        );
      case 1:
        return (
          <TextInput
            name={live_language.short_name}
            holderExp="GSFD"
            type="text"
            value={shortName.toUpperCase()}
            setValue={(e) => changeInputVal("shortName", e.target.value)}
            icon={<FaBookOpen className="text-gray-500" />}
          />
        );
      case 2:
        return (
          <TextInput
            name={live_language.academie}
            holderExp="SAN"
            type="text"
            value={academie.toUpperCase()}
            setValue={(e) => changeInputVal("academie", e.target.value)}
            icon={<FaSchool className="text-gray-500" />}
          />
        );
      case 3:
        return (
          <TextInput
            name={live_language.zone}
            holderExp="SAN"
            type="text"
            value={zone.toUpperCase()}
            setValue={(e) => changeInputVal("zone", e.target.value)}
            icon={<FaMapMarkerAlt className="text-gray-500" />}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {isVisible && (
          <motion.div
            style={{
              width: "70%",
              height: "80vh",
              marginTop: "2%",
            }}
            className={`
							relative border border-2 p-6 rounded-2xl shadow-2xl overflow-auto scrollbar-custom
							${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"}
						`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {isCreating ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-8 px-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-32 h-32 mb-6 relative"
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={theme === "dark" ? "#1E3A8A" : "#3B82F6"}
                      strokeWidth="8"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: progress / 100 }}
                      transition={{ duration: 0.5 }}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={theme === "dark" ? "#4B5563" : "#E5E7EB"}
                      strokeWidth="2"
                    />
                  </svg>
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {progress}%
                  </motion.div>
                </motion.div>

                <motion.h2
                  className="uppercase text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {isForUpdate
                    ? live_language.update_db_infos_text
                    : live_language.create_db_text}
                </motion.h2>

                <motion.div
                  className={`
										w-full max-w-md border border-2 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }
										p-4 rounded-lg mb-6
									`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.p
                    className="text-center font-medium"
                    style={{
                      fontSize: "25",
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                    animate={{
                      scale: [1, 1.02, 1],
                      color:
                        theme === "dark"
                          ? ["#D1D5DB", "#4ADE80", "#D1D5DB"]
                          : ["#1F2937", "#6366F1", "#1F2937"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    {messageIndication}
                  </motion.p>
                </motion.div>

                <motion.div
                  className="flex justify-center items-center space-x-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.div
                    className="h-3 w-3 rounded-full bg-blue-500"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 0.2,
                    }}
                  />
                  <motion.div
                    className="h-3 w-3 rounded-full bg-indigo-500"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 0.4,
                    }}
                  />
                  <motion.div
                    className="h-3 w-3 rounded-full bg-purple-500"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 0.6,
                    }}
                  />
                </motion.div>
              </motion.div>
            ) : (
              <>
                {/* Bouton de fermeture */}
                <button
                  className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition-all duration-300"
                  onClick={closePopup}
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>

                <h2 className="text-center text-2xl font-bold mb-8">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                    {live_language.create_db_text}
                  </span>
                </h2>

                {/* Step indicators */}
                <div className="flex justify-center mb-10">
                  {[0, 1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <motion.div
                        className={`flex items-center justify-center w-12 h-12 rounded-full ${
                          currentStep >= step
                            ? "bg-blue-600 text-white"
                            : theme === "dark"
                            ? "bg-gray-700 text-gray-400"
                            : "bg-gray-200 text-gray-500"
                        } transition-colors duration-300`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          currentStep > step && setCurrentStep(step)
                        }
                      >
                        {currentStep > step ? (
                          <BsCheckCircleFill className="w-6 h-6" />
                        ) : (
                          stepIcons[step]
                        )}
                      </motion.div>

                      {/* Line connector */}
                      {step < 3 && (
                        <div
                          className={`w-16 h-1 mx-1 ${
                            currentStep > step
                              ? "bg-blue-600"
                              : theme === "dark"
                              ? "bg-gray-700"
                              : "bg-gray-200"
                          } transition-colors duration-300`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step labels */}
                <div className="text-center mb-8">
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={currentStep}
                      className="text-xl font-semibold"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {stepLabels[currentStep]}
                    </motion.h3>
                  </AnimatePresence>
                </div>

                {/* Error display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.1 }}
                    className="w-80 mx-auto"
                  >
                    <Error text={error} />
                  </motion.div>
                )}

                {/* Step content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-10 w-80 mx-auto"
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex justify-between pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center px-6 py-2 rounded-lg ${
                      currentStep === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : theme === "dark"
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors duration-300`}
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <HiOutlineArrowNarrowLeft className="mr-2" />
                    {live_language.previous}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center px-6 py-2 rounded-lg ${
                      theme === "dark"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    } transition-colors duration-300`}
                    onClick={nextStep}
                  >
                    {currentStep === 3 ? (
                      <>
                        {db === null
                          ? live_language.create_btn_text
                          : live_language.update_btn_text}
                        <BsCheckCircleFill className="ml-2" />
                      </>
                    ) : (
                      <>
                        {live_language.next}
                        <HiOutlineArrowNarrowRight className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default DatabaseCreator;
