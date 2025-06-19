import React from "react";
import { motion } from "framer-motion";
import { 
  X, AlertTriangle, Info, Check, BookOpen, PenLine, 
  Calendar, DollarSign, FileText, TrendingUp, Clock,
  Shield, Target, List, BarChart, Zap,
  Database, Sliders
} from "lucide-react";
import { useLanguage } from "../contexts";
import translations from "./depense_translator";

const InfoPopup = ({ isOpen, onClose, theme }) => {
  const { language } = useLanguage();
  
  // Get translation function
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 500 } }
  };

  // Style configurations
  const getStyles = () => {
    const isDark = theme === "dark";
    
    return {
      backdrop: "fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm",
      modal: `w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-custom rounded-xl shadow-2xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`,
      header: `px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center sticky top-0 ${isDark ? 'bg-gray-800' : 'bg-white'} z-10`,
      closeButton: `p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`,
      content: "p-6 space-y-8",
      sectionTitle: `flex items-center text-xl font-bold mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`,
      sectionContent: `ml-9 ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`,
      warningCard: `p-4 rounded-lg mt-2 mb-4 flex items-start space-x-3 ${isDark ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-amber-50 border border-amber-200'}`,
      warningTitle: `font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`,
      warningContent: `${isDark ? 'text-amber-200' : 'text-amber-700'} mt-1`,
      tipCard: `p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} flex items-start space-x-3 my-2`,
      tipTitle: "font-semibold",
      footer: `mt-6 pt-6 border-t ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'} text-center italic`,
      accentBox: `p-5 rounded-lg my-6 ${isDark ? 'bg-blue-900/30 border border-blue-800/50' : 'bg-blue-50 border border-blue-200'}`,
      link: `${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline transition-colors`,
      tabButton: `px-4 py-2 rounded-t-lg font-medium transition-colors`,
      activeTab: isDark ? 'bg-gray-700 text-white' : 'bg-white text-blue-600 border-t border-l border-r border-gray-200',
      inactiveTab: isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      stepNumber: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`,
      stepItem: `flex items-start p-3 rounded-lg mb-3 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`,
      gridItem: `p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} flex flex-col items-center text-center`
    };
  };

  const styles = getStyles();

  // Define the detailed content
  const content = {
    title: t('complete_guide'),
    intro: {
      title: t('overview'),
      content: t('guide_intro_content'),
      icon: <BookOpen size={24} className="text-blue-500" />
    },
    
    structure: {
      title: t('system_structure'),
      content: t('system_structured_levels'),
      items: [
        {
          icon: <Calendar className="text-green-500" size={20} />,
          title: t('school_years_structure'),
          desc: t('school_years_desc')
        },
        {
          icon: <DollarSign className="text-purple-500" size={20} />,
          title: t('expenses_structure'),
          desc: t('expenses_desc')
        }
      ]
    },
    
    workflow: {
      title: t('recommended_workflow'),
      steps: [
        t('workflow_step1'),
        t('workflow_step2'),
        t('workflow_step3'),
        t('workflow_step4'),
        t('workflow_step5')
      ]
    },
    
    bestPractices: {
      title: t('best_practices'),
      practices: [
        {
          icon: <Clock size={20} className="text-amber-500" />,
          title: t('strict_timeline'),
          content: t('strict_timeline_content')
        },
        {
          icon: <List size={20} className="text-blue-500" />,
          title: t('consistent_categorization'),
          content: t('consistent_categorization_content')
        },
        {
          icon: <FileText size={20} className="text-green-500" />,
          title: t('detailed_descriptions'),
          content: t('detailed_descriptions_content')
        },
        {
          icon: <TrendingUp size={20} className="text-purple-500" />,
          title: t('regular_verification'),
          content: t('regular_verification_content')
        },
        {
          icon: <Database size={20} className="text-indigo-500" />,
          title: t('data_backup'),
          content: t('data_backup_content')
        }
      ]
    },
    
    warnings: [
      {
        icon: <AlertTriangle className="text-amber-500" size={20} />,
        title: t('expired_school_years_warning'),
        content: t('expired_school_years_content')
      },
      {
        icon: <AlertTriangle className="text-amber-500" size={20} />,
        title: t('mandatory_descriptions_warning'),
        content: t('mandatory_descriptions_content')
      },
      {
        icon: <AlertTriangle className="text-amber-500" size={20} />,
        title: t('expense_dates_warning'),
        content: t('expense_dates_content')
      },
      {
        icon: <AlertTriangle className="text-amber-500" size={20} />,
        title: t('duplicate_years_warning'),
        content: t('duplicate_years_content')
      }
    ],
    
    features: {
      title: t('main_features'),
      items: [
        {
          icon: <Sliders size={24} className="text-green-500" />,
          title: t('advanced_filtering'),
          desc: t('advanced_filtering_desc')
        },
        {
          icon: <BarChart size={24} className="text-blue-500" />,
          title: t('totals_visualization'),
          desc: t('totals_visualization_desc')
        },
        {
          icon: <Shield size={24} className="text-purple-500" />,
          title: t('data_protection'),
          desc: t('data_protection_desc')
        },
        {
          icon: <Zap size={24} className="text-amber-500" />,
          title: t('responsive_interface'),
          desc: t('responsive_interface_desc')
        }
      ]
    },
    
    tips: [
      {
        icon: <Check className="text-green-500" size={20} />,
        title: t('advance_planning'),
        content: t('advance_planning_content')
      },
      {
        icon: <Check className="text-green-500" size={20} />,
        title: t('consistent_naming'),
        content: t('consistent_naming_content')
      },
      {
        icon: <Check className="text-green-500" size={20} />,
        title: t('monthly_check'),
        content: t('monthly_check_content')
      },
      {
        icon: <Check className="text-green-500" size={20} />,
        title: t('quarterly_analysis'),
        content: t('quarterly_analysis_content')
      }
    ],
    
    footer: t('footer_note'),
    
    close: t('close')
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className={styles.backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
    >
      <motion.div
        className={styles.modal}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className="text-2xl font-bold flex items-center">
            <Info className="mr-2 text-blue-500" size={24} />
            {content.title}
          </h2>
          <button 
            onClick={onClose}
            className={styles.closeButton}
            title={content.close}
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Main content */}
        <div className={styles.content}>
          {/* Introduction */}
          <div className="mb-8">
            <h3 className={styles.sectionTitle}>
              {content.intro.icon}
              <span className="ml-2">{content.intro.title}</span>
            </h3>
            <div className={styles.accentBox}>
              <p className="text-lg leading-relaxed">{content.intro.content}</p>
            </div>
          </div>
          
          {/* System Structure */}
          <div className="mb-8">
            <h3 className={styles.sectionTitle}>
              <TrendingUp size={24} className="text-blue-500" />
              <span className="ml-2">{content.structure.title}</span>
            </h3>
            <p className={styles.sectionContent + " mb-4"}>{content.structure.content}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-9">
              {content.structure.items.map((item, index) => (
                <div key={index} className={styles.tipCard + " flex-col items-start"}>
                  <div className="flex items-center w-full mb-2">
                    {item.icon}
                    <h4 className={styles.tipTitle + " ml-2"}>{item.title}</h4>
                  </div>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Workflow */}
          <div className="mb-8">
            <h3 className={styles.sectionTitle}>
              <Target size={24} className="text-blue-500" />
              <span className="ml-2">{content.workflow.title}</span>
            </h3>
            
            <div className="ml-9 space-y-3">
              {content.workflow.steps.map((step, index) => (
                <div key={index} className={styles.stepItem}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <div>{step}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Features */}
          <div className="mb-8">
            <h3 className={styles.sectionTitle}>
              <Zap size={24} className="text-blue-500" />
              <span className="ml-2">{content.features.title}</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-9">
              {content.features.items.map((feature, index) => (
                <div key={index} className={styles.gridItem}>
                  {feature.icon}
                  <h4 className="font-bold mt-2 mb-1">{feature.title}</h4>
                  <p className="text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Best Practices */}
          <div className="mb-8">
            <h3 className={styles.sectionTitle}>
              <PenLine size={24} className="text-blue-500" />
              <span className="ml-2">{content.bestPractices.title}</span>
            </h3>
            
            <div className="space-y-4 ml-9">
              {content.bestPractices.practices.map((practice, index) => (
                <div key={index} className={styles.warningCard.replace('amber', 'blue')}>
                  <span className="mt-1">{practice.icon}</span>
                  <div className="flex-1">
                    <h4 className={styles.warningTitle.replace('amber', 'blue')}>{practice.title}</h4>
                    <p className={styles.warningContent.replace('amber', 'blue')}>{practice.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Warnings section */}
          <div className="mb-8">
            <h3 className={`${styles.sectionTitle} text-amber-500`}>
              <AlertTriangle size={24} />
              <span className="ml-2">{t('important_warnings')}</span>
            </h3>
            <div className="space-y-3 mt-4">
              {content.warnings.map((warning, index) => (
                <div key={index} className={styles.warningCard}>
                  <span className="mt-1">{warning.icon}</span>
                  <div className="flex-1">
                    <h4 className={styles.warningTitle}>{warning.title}</h4>
                    <p className={styles.warningContent}>{warning.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tips section */}
          <div className="mb-8">
            <h3 className={`${styles.sectionTitle} text-green-500`}>
              <Check size={24} />
              <span className="ml-2">{t('practical_tips')}</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              {content.tips.map((tip, index) => (
                <div key={index} className={styles.tipCard}>
                  <span className="mt-1">{tip.icon}</span>
                  <div>
                    <h4 className={styles.tipTitle}>{tip.title}</h4>
                    <p className="mt-1">{tip.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Important note about chronological order */}
          <div className={`${styles.warningCard} border-l-4 border-l-red-500`}>
            <AlertTriangle size={24} className="text-red-500 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-bold text-red-500 dark:text-red-400">{t('chronological_order_title')}</h4>
              <p className="mt-2">
                <strong>{t('chronological_order_strong')}</strong> {t('chronological_order_content')}
              </p>
            </div>
          </div>
          
          {/* Footer note */}
          <div className={styles.footer}>
            {content.footer}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InfoPopup; 