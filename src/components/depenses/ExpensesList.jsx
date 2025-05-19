import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, PlusCircle, Calendar, Clock, 
  Edit, Trash2, Search, SortAsc, SortDesc, ChevronRight, 
  ChevronDown, Lock, FileText, X, Filter, Users, RefreshCw, CalendarIcon, DollarSign, Eye, Pencil
} from "lucide-react";
import { useLanguage } from '../contexts';
import translations from './depense_translator';
import PayEmployeesForm from "./PayEmployeesForm.jsx";

import { getPostNameTrans } from "../../utils/helpers";

const ExpensesList = ({
  expenses,
  schoolYear,
  onBack,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  isExpired,
  app_bg_color,
  text_color,
  theme,
  db,
  setExpenses
}) => {
  const { language } = useLanguage();
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [expandedExpense, setExpandedExpense] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: ''
  });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortField, setSortField] = useState("date");
  const [expandedExpenseId, setExpandedExpenseId] = useState(null);
  const [isPayingEmployees, setIsPayingEmployees] = useState(false);
  
  // Translation helper
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };
  
  // Theme-based styling
  const cardBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textClass = theme === 'dark' ? text_color : 'text-gray-700';
  const inputBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const headerBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const altRowColor = theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50';
  
  // Filter and sort expenses
  useEffect(() => {
    let result = [...expenses];
    
    // Search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(expense => 
        expense.name.toLowerCase().includes(lowercasedSearch) || 
        expense.description.toLowerCase().includes(lowercasedSearch) ||
        expense.category.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(expense => expense.category === categoryFilter);
    }
    
    // Date filter
    if (dateFilter.start) {
      result = result.filter(expense => new Date(expense.date) >= new Date(dateFilter.start));
    }
    
    if (dateFilter.end) {
      result = result.filter(expense => new Date(expense.date) <= new Date(dateFilter.end));
    }
    
    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'amount') {
          return sortConfig.direction === 'asc'
            ? parseFloat(a.amount) - parseFloat(b.amount)
            : parseFloat(b.amount) - parseFloat(a.amount);
        }
        
        if (sortConfig.key === 'date') {
          return sortConfig.direction === 'asc'
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        }
        
        if (sortConfig.key === 'name') {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return sortConfig.direction === 'asc'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
        
        return 0;
      });
    }
    
    setFilteredExpenses(result);
  }, [expenses, searchTerm, sortConfig, categoryFilter, dateFilter]);

  // Default sort is now date DESC (newest to oldest)
  useEffect(() => {
    setSortConfig({ key: 'date', direction: 'desc' });
  }, []);
  
  // Handle sort changes
  const handleSortChange = (field) => {
    setSortConfig(prevConfig => ({
      key: field,
      direction: prevConfig.key === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Toggle expense details
  const toggleExpenseDetails = (id) => {
    setExpandedExpense(expandedExpense === id ? null : id);
  };
  
  // Format date for display with translated months
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Get translated month name
    const monthNames = [
      'month_january', 'month_february', 'month_march', 'month_april',
      'month_may', 'month_june', 'month_july', 'month_august',
      'month_september', 'month_october', 'month_november', 'month_december'
    ];
    
    const translatedMonth = t(monthNames[month]);
    
    // Format based on language
    if (language === 'Anglais') {
      return `${translatedMonth} ${day}, ${year}`;
    } else {
      return `${day} ${translatedMonth} ${year}`;
    }
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // If it's already in HH:MM:SS format, return as is
    if (timeString.includes(':')) {
      return timeString.split(':').slice(0, 2).join(':');
    }
    
    // If it's a timestamp, convert to time
    const date = new Date(parseInt(timeString));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Get category name translation
  const getCategoryName = (category) => {
    return t(`category_${category}`) || category;
  };
  
  // Get unique categories from expenses
  const categories = ['all', ...new Set(expenses.map(expense => expense.category))];
  
  // Calculate total sum
  const totalSum = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setDateFilter({ start: '', end: '' });
    setSortConfig({ key: 'date', direction: 'desc' });
  };
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  const renderDetailRow = (label, value) => (
    <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700 text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
  
  // Render employee payment details
  const renderEmployeePayments = (expense) => {
    if (!expense.payment_details || !expense.payment_details.employees || expense.payment_details.employees.length === 0) {
      return null;
    }
    
    return (
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-semibold mb-3">{t('employee_payments') || "Détails des paiements employés"}</h4>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"} border-collapse`}>
            <thead className={`${headerBgColor} text-left`}>
              <tr>
                <th className="px-4 py-2 border ${borderColor}">{t('employee_name') || "Employé"}</th>
                <th className="px-4 py-2 border ${borderColor}">{t('employee_post') || "Poste"}</th>
                <th className="px-4 py-2 border ${borderColor}">{t('original_amount') || "Montant initial"}</th>
                <th className="px-4 py-2 border ${borderColor}">{t('percentage') || "Pourcentage"}</th>
                <th className="px-4 py-2 border ${borderColor}">{t('paid_amount') || "Montant payé"}</th>
                <th className="px-4 py-2 border ${borderColor}">{t('work_hours') || "Heures travaillées"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {expense.payment_details.employees.map((employee, empIndex) => (
                employee.positions.map((position, posIndex) => (
                  <tr 
                    key={`${employee.employee_id}-${posIndex}`}
                    className={empIndex % 2 === 1 ? altRowColor : ''}
                  >
                    {posIndex === 0 && (
                      <td 
                        className="px-4 py-3 align-top border ${borderColor}" 
                        rowSpan={employee.positions.length}
                      >
                        {employee.employee_name}
                      </td>
                    )}
                    <td className="px-4 py-3 border ${borderColor}">{getPostNameTrans(position.position_name, language)}</td>
                    <td className="px-4 py-3 border ${borderColor}">{formatCurrency(position.original_amount)}</td>
                    <td className="px-4 py-3 border ${borderColor}">{position.percentage}%</td>
                    <td className="px-4 py-3 font-medium text-green-600 dark:text-green-400 border ${borderColor}">
                      {formatCurrency(position.paid_amount)}
                    </td>
                    <td className="px-4 py-3 border ${borderColor}">
                      {position.work_hours ? (
                        <>
                          {position.work_hours.hours}h
                          {position.work_hours.minutes > 0 && ` ${position.work_hours.minutes}min`}
                        </>
                      ) : "-"}
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  const renderDetailSection = (expense) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-4 text-sm ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
      >
        {renderDetailRow(t('id'), expense.id)}
        {renderDetailRow(t('date'), formatDate(expense.date))}
        {renderDetailRow(t('category'), getCategoryName(expense.category))}
        {renderDetailRow(t('amount'), formatCurrency(expense.amount))}
        {renderDetailRow(t('created_on'), formatDate(expense.createdAt))}
        {renderDetailRow(t('updated_on'), formatDate(expense.updatedAt))}
      </motion.div>
    </AnimatePresence>
  );
  
  const onPayEmployees = () => {
    if (isExpired) {
      // Handle expired school year case
      return;
    }
    setIsPayingEmployees(true);
  };
  
  // Render main content or pay employees form
  if (isPayingEmployees) {
    return (
      <PayEmployeesForm
        db={db}
        expenses={expenses}
        setExpenses={setExpenses}
        schoolYearId={schoolYear.id}
        onCancel={() => setIsPayingEmployees(false)}
        text_color={text_color}
        theme={theme}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Header with back button and title */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 mr-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={t('back')}
            title={t('back')}
          >
            <ArrowLeft size={24} className={textClass} />
          </button>
          <div>
            <h2 className={`text-2xl font-bold ${textClass}`}>
              {schoolYear.title}
            </h2>
            <p className={`text-sm opacity-75 ${textClass}`}>
              {formatDate(schoolYear.start_date)} - {formatDate(schoolYear.end_date)}
            </p>
          </div>
        </div>
        
        {isExpired ? (
          <div className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
            <Lock size={16} className="mr-2" />
            {t('expired_year')}
          </div>
        ) : (
          <div className="flex justify-between">
            <button
              onClick={onPayEmployees}
              className="px-4 py-2 mr-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center transition-colors duration-200"
              title={t('add_expense')}
            >
              <Users size={20} className="mr-2" />
              {t('pay_employees')}
            </button>
            <button
              onClick={onAddExpense}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center transition-colors duration-200"
              title={t('add_expense')}
            >
              <PlusCircle size={20} className="mr-2" />
              {t('add_expense')}
            </button>
          </div>
        )}
      </div>
      
      {/* Filter and search section */}
      <div className={`${cardBgColor} border ${borderColor} rounded-lg mb-6 overflow-hidden shadow-sm`}>
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-4">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className={textClass} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-10 py-2 w-full rounded-lg ${inputBgColor} ${textClass} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder={t('search_expenses')}
                title={t('search_expenses')}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  title={t('clear_search')}
                >
                  <X size={18} className={textClass} />
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className={`flex items-center px-3 py-2 rounded-lg border ${borderColor} ${textClass}`}
                title={t('filters')}
              >
                <Filter size={18} className="mr-2" />
                {t('filters')}
                {isFilterExpanded ? 
                  <ChevronDown size={18} className="ml-2" /> : 
                  <ChevronRight size={18} className="ml-2" />
                }
              </button>
              
              <button
                onClick={resetFilters}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                title={t('reset_filters')}
              >
                {t('reset_filters')}
              </button>
            </div>
          </div>
          
          {/* Advanced filters */}
          {isFilterExpanded && (
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
              >
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category filter */}
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                      {t('category')}
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className={`w-full p-2 rounded-lg ${inputBgColor} ${textClass} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      title={t('category')}
                    >
                      <option value="all">{t('all_categories')}</option>
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>
                          {t(`category_${category}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Date range filter */}
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                      {t('start_date')}
                    </label>
                    <input
                      type="date"
                      value={dateFilter.start}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                      className={`w-full p-2 rounded-lg ${inputBgColor} ${textClass} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      title={t('start_date')}
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                      {t('end_date')}
                    </label>
                    <input
                      type="date"
                      value={dateFilter.end}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                      className={`w-full p-2 rounded-lg ${inputBgColor} ${textClass} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      title={t('end_date')}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        
        {/* Summary */}
        <div className={`${headerBgColor} p-4 border-t ${borderColor} flex justify-between items-center`}>
          <div className={`${textClass}`}>
            <span className="font-medium">{filteredExpenses.length}</span> {t('expenses_found')}
            {filteredExpenses.length !== expenses.length && (
              <span className={`ml-2 opacity-75 ${textClass}`}>
                ({t('filtered_from')} {expenses.length})
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span className={`${textClass} mr-2`}>{t('total')}: </span>
            <span className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalSum)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Expenses table */}
      {filteredExpenses.length > 0 ? (
        <motion.div 
          className={`${cardBgColor} border ${borderColor} rounded-lg overflow-hidden shadow-sm`}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Table header */}
          <div className={`${headerBgColor} p-4 flex border-b ${borderColor}`}>
            {/* Action buttons column for repositioned edit/delete */}
            <div className="w-1/12 text-center">
              <span className={`font-medium ${textClass}`}></span>
            </div>
            
            <div className="w-4/12 sm:w-3/12 flex items-center">
              <button
                onClick={() => handleSortChange('name')}
                className="flex items-center font-medium"
                title={t('expense_name')}
              >
                <span className={textClass}>{t('expense_name')}</span>
                {sortConfig.key === 'name' && (
                  sortConfig.direction === 'asc' ? 
                  <SortAsc size={16} className="ml-1 text-blue-500" /> : 
                  <SortDesc size={16} className="ml-1 text-blue-500" />
                )}
              </button>
            </div>
            <div className="w-4/12 sm:w-3/12 flex items-center">
              <button
                onClick={() => handleSortChange('date')}
                className="flex items-center font-medium"
                title={t('date')}
              >
                <span className={textClass}>{t('date')}</span>
                {sortConfig.key === 'date' && (
                  sortConfig.direction === 'asc' ? 
                  <SortAsc size={16} className="ml-1 text-blue-500" /> : 
                  <SortDesc size={16} className="ml-1 text-blue-500" />
                )}
              </button>
            </div>
            <div className="w-3/12 sm:w-2/12 flex items-center">
              <button
                onClick={() => handleSortChange('amount')}
                className="flex items-center font-medium"
                title={t('amount')}
              >
                <span className={textClass}>{t('amount')}</span>
                {sortConfig.key === 'amount' && (
                  sortConfig.direction === 'asc' ? 
                  <SortAsc size={16} className="ml-1 text-blue-500" /> : 
                  <SortDesc size={16} className="ml-1 text-blue-500" />
                )}
              </button>
            </div>
            <div className="hidden sm:block sm:w-3/12 flex items-center">
              <span className={`font-medium ${textClass}`}>{t('category')}</span>
            </div>
          </div>
          
          {/* Expenses list */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredExpenses.map((expense, index) => (
              <motion.div 
                key={expense.id}
                variants={item}
                className={`${index % 2 === 1 ? altRowColor : ''}`}
              >
                <div className={`p-4 cursor-pointer ${textClass}`} onClick={() => toggleExpenseDetails(expense.id)}>
                  <div className="flex items-center">
                    {/* Edit/Delete Icons - Repositioned to the left */}
                    <div className="w-1/12 flex justify-center space-x-1">
                      {!isExpired && (
                        <>
                        { expense.type && 
                          expense.type === "employees" ? null :
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditExpense(expense);
                              }}
                              className="p-1 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
                              title={t('edit')}
                            >
                              <Edit size={14} />
                            </button>
                        }

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteExpense(expense);
                            }}
                            className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                            title={t('delete')}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                    
                    <div className="w-4/12 sm:w-3/12">
                      <span className="font-medium">{expense.name}</span>
                    </div>
                    <div className="w-4/12 sm:w-3/12 flex items-center">
                      <Calendar size={16} className="mr-2 opacity-75" />
                      <span>{formatDate(expense.date)}</span>
                    </div>
                    <div className="w-3/12 sm:w-2/12 text-green-600 dark:text-green-400 font-bold">
                      {formatCurrency(expense.amount)}
                    </div>
                    <div className="hidden sm:block sm:w-3/12">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                        {t(`category_${expense.category}`)}
                      </span>
                    </div>
                    
                    {/* Expand/Collapse indicator */}
                    <div className="ml-auto">
                      {expandedExpense === expense.id ? (
                        <ChevronDown size={20} className={textClass} />
                      ) : (
                        <ChevronRight size={20} className={textClass} />
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  <AnimatePresence>
                    {expandedExpense === expense.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
                      >
                        {/* Category for mobile view */}
                        <div className="block sm:hidden">
                          <span className="text-sm font-medium opacity-75">{t('category')}:</span>
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                            {t(`category_${expense.category}`)}
                          </span>
                        </div>
                        
                        {/* Description */}
                        {expense.description && (
                          <div>
                            <span className="text-sm font-medium opacity-75">{t('description')}:</span>
                            <p className="whitespace-pre-wrap">{expense.description}</p>
                          </div>
                        )}
                        
                        {/* Employee payment details */}
                        {expense.type && expense.type === "employees" && renderEmployeePayments(expense)}
                        
                        {/* Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium opacity-75">{t('created_at')}:</span>
                            <div className="flex items-center mt-1">
                              <Calendar size={14} className="mr-1 opacity-75" />
                              <span>{formatDate(new Date(expense.created_at))}</span>
                              <Clock size={14} className="ml-3 mr-1 opacity-75" />
                              <span>{formatTime(expense.created_time || expense.created_at)}</span>
                            </div>
                          </div>
                          
                          {expense.updated_at && expense.updated_at !== expense.created_at && (
                            <div>
                              <span className="font-medium opacity-75">{t('updated_at')}:</span>
                              <div className="flex items-center mt-1">
                                <Calendar size={14} className="mr-1 opacity-75" />
                                <span>{formatDate(new Date(expense.updated_at))}</span>
                                <Clock size={14} className="ml-3 mr-1 opacity-75" />
                                <span>{formatTime(expense.updated_time || expense.updated_at)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className={`${cardBgColor} border ${borderColor} rounded-lg p-8 text-center shadow-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center">
            <FileText size={64} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {searchTerm || categoryFilter !== 'all' || dateFilter.start || dateFilter.end
                ? t('no_matching_expenses')
                : t('no_expenses')}
            </h3>
            <p className="mb-6 opacity-75">
              {searchTerm || categoryFilter !== 'all' || dateFilter.start || dateFilter.end
                ? t('try_different_filters')
                : t('add_first_expense')}
            </p>
            
            {!isExpired && (
              <button
                onClick={searchTerm || categoryFilter !== 'all' || dateFilter.start || dateFilter.end ? resetFilters : onAddExpense}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors duration-200"
                title={searchTerm || categoryFilter !== 'all' || dateFilter.start || dateFilter.end ? t('reset_filters') : t('add_expense')}
              >
                {searchTerm || categoryFilter !== 'all' || dateFilter.start || dateFilter.end ? (
                  <>
                    <X size={20} className="mr-2" />
                    {t('reset_filters')}
                  </>
                ) : (
                  <>
                    <PlusCircle size={20} className="mr-2" />
                    {t('add_expense')}
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ExpensesList; 