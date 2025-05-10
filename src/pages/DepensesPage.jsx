import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Info, PlusCircle, RefreshCw } from "lucide-react";
import PageLoading from "../components/PageLoading.jsx";
import { useLanguage, useFlashNotification } from '../components/contexts';
import SchoolYearsList from "../components/depenses/SchoolYearsList.jsx";
import SchoolYearForm from "../components/depenses/SchoolYearForm.jsx";
import ExpensesList from "../components/depenses/ExpensesList.jsx";
import ExpenseForm from "../components/depenses/ExpenseForm.jsx";
import InfoPopup from "../components/depenses/InfoPopup.jsx";
import AlertPopup from "../components/AlertPopup.jsx";
import ActionConfirmePopup from "../components/ActionConfirmePopup.jsx";
import translations from "../components/depenses/depense_translator.js";
import { gradients } from "../utils/colors";

const DepensesPageContent = ({
  app_bg_color,
  text_color,
  theme,
  database,
  refreshData,
}) => {
  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();
  const [db, setDb] = useState(database);
  const [loading, setLoading] = useState(true);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isAddingSchoolYear, setIsAddingSchoolYear] = useState(false);
  const [isEditingSchoolYear, setIsEditingSchoolYear] = useState(null);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isEditingExpense, setIsEditingExpense] = useState(null);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
  const [schoolYears, setSchoolYears] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showExpenseDeleteConfirm, setShowExpenseDeleteConfirm] = useState(null);
  const [showAlert, setShowAlert] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isOthersBGColors = app_bg_color === gradients[1] || app_bg_color === gradients[2] || theme === "dark" ? false : true;
  const form_text_color = isOthersBGColors ? "text-gray-700" : text_color;
  
  // Translation helper
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };
  
  // Load database on mount
  useEffect(() => {
    loadData();
  }, [database]);

  const loadData = async () => {
    try {
      setLoading(true);
      const freshData = await window.electron.getDatabase();
      setDb(freshData);
      
      // Initialize the expenses array in database if it doesn't exist
      if (!freshData.schoolYears) {
        const updatedDb = { ...freshData, schoolYears: [], expenses: [] };
        await window.electron.saveDatabase(updatedDb);
        setDb(updatedDb);
        setSchoolYears([]);
        setExpenses([]);
      } else {
        // Sort school years from newest to oldest
        const sortedSchoolYears = (freshData.schoolYears || []).sort((a, b) => {
          return new Date(b.start_date) - new Date(a.start_date);
        });
        // Sort expenses from newest to oldest
        const sortedExpenses = (freshData.expenses || []).sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        
        setSchoolYears(sortedSchoolYears);
        setExpenses(sortedExpenses);
        
        // If we have a selectedSchoolYear, make sure it's updated with fresh data
        if (selectedSchoolYear) {
          const updatedSelectedYear = sortedSchoolYears.find(y => y.id === selectedSchoolYear.id);
          if (updatedSelectedYear) {
            setSelectedSchoolYear(updatedSelectedYear);
          } else {
            // If the selected year no longer exists, deselect it
            setSelectedSchoolYear(null);
          }
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    await loadData();
    
    setTimeout(() => {
      setIsRefreshing(false);
      setFlashMessage({
        message: t('data_refreshed'),
        type: "success",
        duration: 3000,
      });
    }, 800);
  };

  const handleDeleteSchoolYear = async (schoolYear) => {
    if (checkYearExpired(schoolYear)) {
      setShowAlert({
        title: t('school_year_expired'),
        message: t('school_year_expired_readonly')
      });
      return;
    }
    
    setShowDeleteConfirm(schoolYear);
  };

  const confirmDeleteSchoolYear = async () => {
    try {
      if (!showDeleteConfirm) return;
      
      // Delete the school year and all associated expenses
      const updatedSchoolYears = schoolYears.filter(y => y.id !== showDeleteConfirm.id);
      const updatedExpenses = expenses.filter(e => e.depense_scolaire_id !== showDeleteConfirm.id);
      
      const updatedDb = {
        ...db,
        schoolYears: updatedSchoolYears,
        expenses: updatedExpenses
      };
      
      await window.electron.saveDatabase(updatedDb);
      setDb(updatedDb);
      setSchoolYears(updatedSchoolYears);
      setExpenses(updatedExpenses);
      
      if (selectedSchoolYear && selectedSchoolYear.id === showDeleteConfirm.id) {
        setSelectedSchoolYear(null);
      }
      
      setFlashMessage({
        message: t('school_year_deleted'),
        type: "success",
        duration: 3000,
      });
      
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting school year:", error);
      setFlashMessage({
        message: t('delete_error'),
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleDeleteExpense = (expense) => {
    if (selectedSchoolYear && checkYearExpired(selectedSchoolYear)) {
      setShowAlert({
        title: t('school_year_expired'),
        message: t('school_year_expired_readonly')
      });
      return;
    }
    
    setShowExpenseDeleteConfirm(expense);
  };

  const confirmDeleteExpense = async () => {
    try {
      if (!showExpenseDeleteConfirm) return;
      
      const updatedExpenses = expenses.filter(e => e.id !== showExpenseDeleteConfirm.id);
      
      const updatedDb = {
        ...db,
        expenses: updatedExpenses
      };
      
      await window.electron.saveDatabase(updatedDb);
      setDb(updatedDb);
      setExpenses(updatedExpenses);
      
      setFlashMessage({
        message: t('expense_deleted'),
        type: "success",
        duration: 3000,
      });
      
      setShowExpenseDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting expense:", error);
      setFlashMessage({
        message: t('delete_error'),
        type: "error",
        duration: 3000,
      });
    }
  };

  const checkYearExpired = (schoolYear) => {
    if (!schoolYear) return false;
    const endDate = new Date(schoolYear.end_date);
    const now = new Date();
    return endDate < now;
  };

  const getFilteredExpenses = () => {
    if (!selectedSchoolYear) return [];
    
    return expenses
      .filter(expense => expense.depense_scolaire_id === selectedSchoolYear.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest to oldest
  };

  const getTotalExpenseAmount = (schoolYearId) => {
    if (!schoolYearId) return 0;
    return expenses
      .filter(expense => expense.depense_scolaire_id === schoolYearId)
      .reduce((total, expense) => total + (parseInt(expense.amount) || 0), 0);
  };

  const getExpenseCount = (schoolYearId) => {
    if (!schoolYearId) return 0;
    return expenses.filter(expense => expense.depense_scolaire_id === schoolYearId).length;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Determine page content based on state
  const renderContent = () => {
    if (isAddingSchoolYear || isEditingSchoolYear) {
      return (
        <SchoolYearForm 
          db={db}
          schoolYears={schoolYears}
          setSchoolYears={setSchoolYears}
          schoolYear={isEditingSchoolYear}
          onCancel={() => {
            setIsAddingSchoolYear(false);
            setIsEditingSchoolYear(null);
          }}
          // app_bg_color={app_bg_color}
          text_color={form_text_color}
          theme={theme}
        />
      );
    }

    if (isAddingExpense || isEditingExpense) {
      return (
        <ExpenseForm 
          db={db}
          expenses={expenses}
          setExpenses={setExpenses}
          expense={isEditingExpense}
          schoolYearId={selectedSchoolYear?.id}
          onCancel={() => {
            setIsAddingExpense(false);
            setIsEditingExpense(null);
          }}
          // app_bg_color={app_bg_color}
          text_color={form_text_color}
          theme={theme}
        />
      );
    }

    if (selectedSchoolYear) {
      return (
        <ExpensesList
          expenses={getFilteredExpenses()}
          schoolYear={selectedSchoolYear}
          onBack={() => setSelectedSchoolYear(null)}
          onAddExpense={() => {
            if (checkYearExpired(selectedSchoolYear)) {
              setShowAlert({
                title: t('school_year_expired'),
                message: t('school_year_expired_readonly')
              });
              return;
            }
            setIsAddingExpense(true);
          }}
          onEditExpense={(expense) => {
            if (checkYearExpired(selectedSchoolYear)) {
              setShowAlert({
                title: t('school_year_expired'),
                message: t('school_year_expired_readonly')
              });
              return;
            }
            setIsEditingExpense(expense);
          }}
          onDeleteExpense={handleDeleteExpense}
          isExpired={checkYearExpired(selectedSchoolYear)}
          app_bg_color={app_bg_color}
          text_color={text_color}
          theme={theme}
        />
      );
    }

    return (
      <SchoolYearsList
        schoolYears={schoolYears}
        onSelectSchoolYear={setSelectedSchoolYear}
        onAddSchoolYear={() => setIsAddingSchoolYear(true)}
        onEditSchoolYear={(schoolYear) => {
          if (checkYearExpired(schoolYear)) {
            setShowAlert({
              title: t('school_year_expired'),
              message: t('school_year_expired_readonly')
            });
            return;
          }
          setIsEditingSchoolYear(schoolYear);
        }}
        onDeleteSchoolYear={handleDeleteSchoolYear}
        getExpenseCount={getExpenseCount}
        getTotalExpenseAmount={getTotalExpenseAmount}
        checkYearExpired={checkYearExpired}
        app_bg_color={app_bg_color}
        text_color={text_color}
        theme={theme}
      />
    );
  };
  
  if (loading) {
    return <PageLoading />;
  };

  return (
    <div style={{marginLeft: "7%"}} className={`p-4 mt-20 ${app_bg_color} ${text_color} min-h-screen`}>
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with info button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">
              {t('expenses_management')}
            </h1>
            <button 
              onClick={() => setShowInfoPopup(true)}
              className="ml-3 p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors duration-200"
              aria-label="Information"
              title={t('view_help')}
            >
              <Info size={24} className="text-blue-400" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-full ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-all duration-300`}
              title={t('refresh')}
            >
              <RefreshCw size={20} className={`${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            
            {!selectedSchoolYear && !isAddingSchoolYear && !isEditingSchoolYear && (
              <button
                onClick={() => setIsAddingSchoolYear(true)}
                className={`p-2 flex items-center gap-2 rounded-lg ${theme === "dark" ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white transition-all duration-300`}
                title={t('add_school_year_tooltip')}
              >
                <PlusCircle size={20} />
                <span>{t('add_school_year')}</span>
              </button>
            )}
          </div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {renderContent()}
        </motion.div>
      </motion.div>
      
      {/* Popups */}
      <AnimatePresence>
        {showInfoPopup && (
          <InfoPopup
            isOpen={showInfoPopup}
            onClose={() => setShowInfoPopup(false)}
            theme={theme}
          />
        )}
      </AnimatePresence>
      
      <ActionConfirmePopup
        isOpenConfirmPopup={showDeleteConfirm !== null}
        setIsOpenConfirmPopup={() => setShowDeleteConfirm(null)}
        handleConfirmeAction={confirmDeleteSchoolYear}
        title={t('confirm_delete_year')}
        message={t('confirm_delete_year_msg')}
        element_info={showDeleteConfirm?.title}
        actionType="danger"
      />
      
      <ActionConfirmePopup
        isOpenConfirmPopup={showExpenseDeleteConfirm !== null}
        setIsOpenConfirmPopup={() => setShowExpenseDeleteConfirm(null)}
        handleConfirmeAction={confirmDeleteExpense}
        title={t('confirm_delete_expense')}
        message={t('confirm_delete_expense_msg')}
        element_info={showExpenseDeleteConfirm?.name}
        actionType="danger"
      />
      
      <AlertPopup
        isOpenAlertPopup={showAlert !== null}
        setIsOpenAlertPopup={() => setShowAlert(null)}
        title={showAlert?.title || ""}
        message={showAlert?.message || ""}
      />
    </div>
  );
};

const DepensesPage = () => {
  const context = useOutletContext();
  return <DepensesPageContent {...context} />;
};

export default DepensesPage;
