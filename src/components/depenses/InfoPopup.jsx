import React from "react";
import { motion } from "framer-motion";
import { X, AlertTriangle, Info, Check, BookOpen, PenLine, Calendar, DollarSign } from "lucide-react";
import { useLanguage } from "../contexts";

const InfoPopup = ({ isOpen, onClose, theme }) => {
  const { live_language, language } = useLanguage();
  
  // Dynamic content based on language
  const content = {
    title: language === "Français" ? "Guide de gestion des dépenses" : 
           language === "Bambara" ? "Musaka kɛcogo kunnafonini" : 
           "Expense Management Guide",
    
    sections: [
      {
        icon: <BookOpen className="text-blue-500" size={24} />,
        title: language === "Français" ? "Vue d'ensemble" : 
               language === "Bambara" ? "Cogo ɲɛfɔli" : 
               "Overview",
        content: language === "Français" ? 
          "Le système de gestion des dépenses est organisé par années scolaires. Chaque année scolaire contient ses propres dépenses. Cette organisation vous permet de suivre les finances de votre école de manière structurée et chronologique." : 
          language === "Bambara" ? 
          "Musaka kɛcogo labɛnnen don ka kɔn ni kalansen sanji ye. Sanji kelen kelen bɛɛ ni a ta musaka ye. Nin labɛnni b'a to i ka se ka i ka lakɔli musaka kɔlɔsi cogoya ni waati kɔnɔ." : 
          "The expense management system is organized by school years. Each school year contains its own expenses. This organization allows you to track your school's finances in a structured and chronological manner."
      },
      {
        icon: <Calendar className="text-green-500" size={24} />,
        title: language === "Français" ? "Années scolaires" : 
               language === "Bambara" ? "Kalansen sanjaw" : 
               "School Years",
        content: language === "Français" ? 
          "Créez d'abord une année scolaire avec un titre, une description, une date de début et une date de fin. Les dates doivent couvrir votre année scolaire réelle. Une fois l'année scolaire créée, vous pourrez y ajouter des dépenses. Une année scolaire expire automatiquement lorsque sa date de fin est dépassée." : 
          language === "Bambara" ? 
          "Fɔlɔ i ka kan ka kalansen san dɔ da ni tɔgɔ, bayɛlɛmali, daminɛ don ni laban don ye. Donw ka kan ka i ka lakɔli kalansen san kura daminɛ ni a laban ɲɛfɔ. Kalansen san dalen kɔfɛ, i bɛ se ka musakaw fara a kan. Kalansen san bɛ ban yɛrɛma ni a laban don tɛmɛna." : 
          "First create a school year with a title, description, start date, and end date. The dates should cover your actual school year. Once the school year is created, you can add expenses to it. A school year automatically expires when its end date has passed."
      },
      {
        icon: <DollarSign className="text-purple-500" size={24} />,
        title: language === "Français" ? "Dépenses" : 
               language === "Bambara" ? "Musakaw" : 
               "Expenses",
        content: language === "Français" ? 
          "Pour chaque dépense, saisissez un nom, un montant, une catégorie, une date et une description détaillée. La description doit contenir entre 30 et 10 000 caractères et est essentielle pour garder une trace des détails de vos dépenses. Organisez vos dépenses dans un ordre chronologique pour faciliter le suivi financier." : 
          language === "Bambara" ? 
          "Musaka kelen kelen bɛɛ kama, i ka tɔgɔ, hakɛ, suguyali, don ni bayɛlɛmali dɔ sɛbɛn. Bayɛlɛmali ka kan ka sira sɛbɛn 30 ni 10 000 cɛ, a man kan ka fɔn i ka musaka kunnafoniw. I ka i ka musaka ladonni kɛ waati kɔnɔ walasa ka wari kɔlɔsili nɔgɔya." : 
          "For each expense, enter a name, amount, category, date, and detailed description. The description must be between 30 and 10,000 characters and is essential for keeping track of your expense details. Organize your expenses in chronological order to facilitate financial tracking."
      },
      {
        icon: <PenLine className="text-orange-500" size={24} />,
        title: language === "Français" ? "Bonnes pratiques" : 
               language === "Bambara" ? "Baarakɛcogo ɲumanw" : 
               "Best Practices",
        content: language === "Français" ? 
          "Créez vos dépenses dans un ordre chronologique pour maintenir une trace claire de vos finances. Utilisez des catégories cohérentes pour faciliter l'analyse future. Ajoutez des descriptions détaillées qui permettront de comprendre le contexte de chaque dépense même des mois plus tard. Effectuez des sauvegardes régulières de vos données." : 
          language === "Bambara" ? 
          "I ka i ka musakaw da waati kɔnɔ walasa ka i ka wari kunnafoniw ladon ɲuman ye. I ka suguyali kelen kelen baara kɛ walasa ka sɛgɛsɛgɛli nɔgɔya kɔfɛ. I ka bayɛlɛmali dakɔrɔlen dɔ da min bɛna a to i ka musaka kunnafoniw ka faamu hali kalo caman tɛmɛnen kɔfɛ. I ka i ka kunnafoniw maracogo ɲuman kɛ tuma bɛɛ." : 
          "Create your expenses in chronological order to maintain a clear track of your finances. Use consistent categories to facilitate future analysis. Add detailed descriptions that will allow you to understand the context of each expense even months later. Make regular backups of your data."
      }
    ],
    
    warnings: [
      {
        icon: <AlertTriangle className="text-amber-500" size={20} />,
        title: language === "Français" ? "Restrictions sur les années expirées" : 
               language === "Bambara" ? "Kalansen san tɛmɛnew danw" : 
               "Expired Year Restrictions",
        content: language === "Français" ? 
          "Une année scolaire expirée ne peut pas être modifiée ou supprimée. Elle devient accessible en lecture seule pour préserver l'intégrité des données historiques." : 
          language === "Bambara" ? 
          "Kalansen san tɛmɛnen tɛ se ka yɛlɛma walima ka jɔsi. A bɛ se ka kalan dɔrɔn walasa ka kɔrɔlen kunnafoniw kisi." : 
          "An expired school year cannot be modified or deleted. It becomes read-only to preserve the integrity of historical data."
      },
      {
        icon: <AlertTriangle className="text-amber-500" size={20} />,
        title: language === "Français" ? "Validation des descriptions" : 
               language === "Bambara" ? "Bayɛlɛmaliw sɛgɛsɛgɛli" : 
               "Description Validation",
        content: language === "Français" ? 
          "La description d'une dépense est obligatoire et doit contenir entre 30 et 10 000 caractères. Une description complète est essentielle pour la transparence financière." : 
          language === "Bambara" ? 
          "Musaka dɔ bayɛlɛmali ka kan ka kɛ, o sira ka kan ka kɛ 30 ni 10 000 cɛ. Bayɛlɛmali dafalen nafa ka bon wari kunnafoni ɲɛfɔli la." : 
          "The description of an expense is mandatory and must contain between 30 and 10,000 characters. A complete description is essential for financial transparency."
      },
      {
        icon: <AlertTriangle className="text-amber-500" size={20} />,
        title: language === "Français" ? "Années scolaires dupliquées" : 
               language === "Bambara" ? "Kalansen san kɛlen fila ye" : 
               "Duplicate School Years",
        content: language === "Français" ? 
          "Vous ne pouvez pas créer deux années scolaires avec le même titre, la même date de début et la même date de fin. Chaque année scolaire doit être unique." : 
          language === "Bambara" ? 
          "I tɛ se ka kalansen san fila da ni tɔgɔ kelen, daminɛ don kelen ani laban don kelen ye. Kalansen san kelen kelen bɛɛ ka kan ka kɛ a kelen ye." : 
          "You cannot create two school years with the same title, start date, and end date. Each school year must be unique."
      }
    ],
    
    tips: [
      {
        icon: <Check className="text-green-500" size={20} />,
        title: language === "Français" ? "Créez dans l'ordre" : 
               language === "Bambara" ? "Da ɲɔgɔn kɔ" : 
               "Create in Order",
        content: language === "Français" ? 
          "Créez vos dépenses chronologiquement pour faciliter le suivi et l'analyse financière." : 
          language === "Bambara" ? 
          "I ka i ka musakaw da waati kɔnɔ walasa ka kɔlɔsili ni sɛgɛsɛgɛli nɔgɔya." : 
          "Create your expenses chronologically to facilitate tracking and financial analysis."
      },
      {
        icon: <Check className="text-green-500" size={20} />,
        title: language === "Français" ? "Soyez précis" : 
               language === "Bambara" ? "Kɛ dakɔrɔlenba ye" : 
               "Be Precise",
        content: language === "Français" ? 
          "Utilisez des noms clairs et des catégories cohérentes pour faciliter les recherches ultérieures." : 
          language === "Bambara" ? 
          "I ka tɔgɔ jɛlenw ni suguyali kɛlen kelen kelen baara kɛ walasa ka ɲininiw nɔgɔya kɔfɛ." : 
          "Use clear names and consistent categories to facilitate later searches."
      },
      {
        icon: <Check className="text-green-500" size={20} />,
        title: language === "Français" ? "Planifiez à l'avance" : 
               language === "Bambara" ? "Labɛn kɔrɔlen k'a ɲɛ" : 
               "Plan Ahead",
        content: language === "Français" ? 
          "Créez votre nouvelle année scolaire avant la fin de l'année en cours pour assurer une transition fluide." : 
          language === "Bambara" ? 
          "I ka i ka kalansen san kura da sisan san ban ɲɛ walasa ka yɛlɛma nɔgɔya." : 
          "Create your new school year before the end of the current year to ensure a smooth transition."
      }
    ],
    
    footer: language === "Français" ? 
      "Une gestion rigoureuse des dépenses vous aidera à optimiser votre budget scolaire." : 
      language === "Bambara" ? 
      "Musaka kɛcogo ɲuman b'a to i ka i ka lakɔli wari ladon ka ɲɛ." : 
      "Rigorous expense management will help you optimize your school budget.",
    
    close: language === "Français" ? "Fermer" : 
           language === "Bambara" ? "Datugu" : 
           "Close"
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
      backdrop: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4",
      modal: `w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`,
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
      footer: `mt-6 pt-6 border-t ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'} text-center italic`
    };
  };

  const styles = getStyles();

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
          {/* Main sections */}
          {content.sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h3 className={styles.sectionTitle}>
                {section.icon}
                <span className="ml-2">{section.title}</span>
              </h3>
              <p className={styles.sectionContent}>{section.content}</p>
            </div>
          ))}
          
          {/* Warnings section */}
          <div className="mb-8">
            <h3 className={`${styles.sectionTitle} text-amber-500`}>
              <AlertTriangle size={24} />
              <span className="ml-2">
                {language === "Français" ? "Avertissements importants" : 
                language === "Bambara" ? "Lasɔmi nafamaw" : 
                "Important Warnings"}
              </span>
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
              <span className="ml-2">
                {language === "Français" ? "Conseils pratiques" : 
                language === "Bambara" ? "Ladilikan balikuw" : 
                "Practical Tips"}
              </span>
            </h3>
            <div className="grid md:grid-cols-3 gap-3 mt-4">
              {content.tips.map((tip, index) => (
                <div key={index} className={styles.tipCard}>
                  <span className="mt-1">{tip.icon}</span>
                  <div>
                    <h4 className={styles.tipTitle}>{tip.title}</h4>
                    <p className="mt-1 text-sm">{tip.content}</p>
                  </div>
                </div>
              ))}
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