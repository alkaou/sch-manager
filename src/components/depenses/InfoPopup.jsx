import React from "react";
import { motion } from "framer-motion";
import { 
  X, AlertTriangle, Info, Check, BookOpen, PenLine, 
  Calendar, DollarSign, FileText, TrendingUp, Clock,
  Shield, ExternalLink, Target, List, BarChart, Zap,
  HelpCircle, Database, Sliders
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
      modal: `w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`,
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
    title: "Guide complet de gestion des dépenses",
    intro: {
      title: "Vue d'ensemble",
      content: "Le système de gestion des dépenses est conçu pour vous aider à suivre efficacement toutes les dépenses de votre établissement scolaire. Organisé par années scolaires, il vous permet de maintenir une comptabilité précise et de générer des rapports détaillés sur vos finances.",
      icon: <BookOpen size={24} className="text-blue-500" />
    },
    
    structure: {
      title: "Structure du système",
      content: "Le système est structuré en deux niveaux hiérarchiques principaux :",
      items: [
        {
          icon: <Calendar className="text-green-500" size={20} />,
          title: "Années scolaires",
          desc: "Chaque année scolaire représente un cadre temporel défini par une date de début et une date de fin. Ces périodes servent de conteneurs pour toutes vos dépenses."
        },
        {
          icon: <DollarSign className="text-purple-500" size={20} />,
          title: "Dépenses",
          desc: "Les dépenses individuelles sont associées à une année scolaire spécifique. Chaque dépense comprend un nom, un montant, une catégorie, une date et une description détaillée."
        }
      ]
    },
    
    workflow: {
      title: "Flux de travail recommandé",
      steps: [
        "Créez d'abord une année scolaire avec des dates précises couvrant votre période académique.",
        "Ajoutez progressivement vos dépenses dans l'ordre chronologique au fur et à mesure qu'elles surviennent.",
        "Utilisez des catégories cohérentes pour faciliter le suivi et l'analyse ultérieure.",
        "Consultez régulièrement les totaux et les statistiques pour surveiller vos finances.",
        "Archivez automatiquement les années expirées tout en conservant l'accès pour référence future."
      ]
    },
    
    bestPractices: {
      title: "Bonnes pratiques",
      practices: [
        {
          icon: <Clock size={20} className="text-amber-500" />,
          title: "Chronologie stricte",
          content: "Enregistrez vos dépenses dans l'ordre chronologique pour maintenir une trace précise et cohérente. Évitez d'ajouter des dépenses en désordre, ce qui pourrait compliquer l'analyse financière."
        },
        {
          icon: <List size={20} className="text-blue-500" />,
          title: "Catégorisation cohérente",
          content: "Utilisez systématiquement les mêmes catégories pour des dépenses similaires afin de garantir des rapports et des analyses précis."
        },
        {
          icon: <FileText size={20} className="text-green-500" />,
          title: "Descriptions détaillées",
          content: "Rédigez des descriptions complètes pour chaque dépense (minimum 30 caractères) incluant le contexte, la justification et les parties prenantes concernées."
        },
        {
          icon: <TrendingUp size={20} className="text-purple-500" />,
          title: "Vérification régulière",
          content: "Examinez périodiquement vos dépenses pour identifier les tendances et optimiser votre budget futur."
        },
        {
          icon: <Database size={20} className="text-indigo-500" />,
          title: "Sauvegarde des données",
          content: "Effectuez régulièrement des sauvegardes de vos données financières pour éviter toute perte d'information."
        }
      ]
    },
    
    warnings: [
      {
        icon: <AlertTriangle className="text-amber-500" size={20} />,
        title: "Années scolaires expirées",
        content: "Une année scolaire devient automatiquement en lecture seule lorsque sa date de fin est dépassée. Vous ne pourrez ni la modifier, ni la supprimer, ni ajouter ou modifier ses dépenses. Cette restriction garantit l'intégrité de vos données historiques."
      },
      {
        icon: <AlertTriangle className="text-amber-500" size={20} />,
        title: "Descriptions obligatoires",
        content: "Chaque dépense nécessite une description détaillée entre 30 et 10 000 caractères. Cette exigence assure une documentation complète et favorise la transparence financière."
      },
      {
        icon: <AlertTriangle className="text-amber-500" size={20} />,
        title: "Dates des dépenses",
        content: "La date d'une dépense doit obligatoirement se situer entre la date de début et la date de fin de son année scolaire. Toute date en dehors de cette plage sera refusée."
      },
      {
        icon: <AlertTriangle className="text-amber-500" size={20} />,
        title: "Années scolaires dupliquées",
        content: "Le système empêche la création d'années scolaires en double. Deux années ne peuvent pas avoir simultanément le même titre, la même date de début et la même date de fin."
      }
    ],
    
    features: {
      title: "Fonctionnalités principales",
      items: [
        {
          icon: <Sliders size={24} className="text-green-500" />,
          title: "Filtrage avancé",
          desc: "Filtrez les dépenses par catégorie, date ou mot-clé pour trouver rapidement ce que vous cherchez."
        },
        {
          icon: <BarChart size={24} className="text-blue-500" />,
          title: "Visualisation des totaux",
          desc: "Consultez instantanément le total des dépenses pour chaque année scolaire et catégorie."
        },
        {
          icon: <Shield size={24} className="text-purple-500" />,
          title: "Protection des données",
          desc: "Les années expirées sont automatiquement verrouillées pour préserver l'intégrité des données historiques."
        },
        {
          icon: <Zap size={24} className="text-amber-500" />,
          title: "Interface réactive",
          desc: "Profitez d'une expérience utilisateur fluide grâce à des transitions animées et un design responsive."
        }
      ]
    },
    
    tips: [
      {
        icon: <Check className="text-green-500" size={20} />,
        title: "Planification préalable",
        content: "Créez votre nouvelle année scolaire avant la fin de l'année en cours pour assurer une transition sans heurts."
      },
      {
        icon: <Check className="text-green-500" size={20} />,
        title: "Nomenclature cohérente",
        content: "Utilisez un système de nommage uniforme pour toutes vos dépenses afin de faciliter les recherches et le tri."
      },
      {
        icon: <Check className="text-green-500" size={20} />,
        title: "Vérification mensuelle",
        content: "Réservez du temps chaque mois pour vérifier que toutes les dépenses ont été correctement enregistrées."
      },
      {
        icon: <Check className="text-green-500" size={20} />,
        title: "Analyse trimestrielle",
        content: "Analysez vos dépenses par trimestre pour identifier les tendances et ajuster votre budget en conséquence."
      }
    ],
    
    footer: "Une gestion rigoureuse des dépenses est essentielle pour optimiser votre budget scolaire et assurer la pérennité financière de votre établissement.",
    
    close: "Fermer"
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
              <span className="ml-2">Avertissements importants</span>
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
              <span className="ml-2">Conseils pratiques</span>
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
              <h4 className="text-lg font-bold text-red-500 dark:text-red-400">Ordre chronologique essentiel</h4>
              <p className="mt-2">
                <strong>Il est fortement recommandé de créer vos dépenses dans l'ordre chronologique.</strong> Cette pratique est cruciale pour maintenir une comptabilité précise et faciliter les audits financiers. La création de dépenses en désordre peut entraîner des erreurs d'analyse et compliquer la gestion budgétaire.
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