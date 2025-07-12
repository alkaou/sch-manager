import React, { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronRight, ExternalLink, Mail, Github, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../components/contexts';

const HelpersPageContent = ({
  // app_bg_color,
  text_color,
  theme,
}) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    gettingStarted: true,
    students: false,
    classes: false,
    compositions: false,
    bulletins: false,
    payments: false,
    statistics: false,
    database: false,
    settings: false,
  });

  // Styles based on theme
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const inputTextColor = theme === "dark" ? text_color : "text-gray-600";
  const sectionHeaderBg = theme === "dark" ? "bg-gray-750" : "bg-gray-50";
  const linkColor = theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700";

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Filter help content based on search term
  const filterContent = (content) => {
    if (!searchTerm) return true;
    return content.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // Help section component
  const HelpSection = ({ id, title, content, icon }) => {
    const isExpanded = expandedSections[id];
    const Icon = icon;
    
    // Check if this section should be shown based on search
    const shouldShow = filterContent(title) || (isExpanded && filterContent(content));
    
    if (!shouldShow) return null;
    
    return (
      <div className={`mb-4 rounded-lg overflow-hidden ${cardBgColor} shadow-sm border ${borderColor}`}>
        <button 
          onClick={() => toggleSection(id)}
          className={`w-full p-4 flex items-center justify-between ${sectionHeaderBg} ${borderColor} border-b`}
        >
          <div className="flex items-center">
            {Icon && <Icon className={`mr-2 ${inputTextColor}`} size={20} />}
            <h3 className={`font-semibold ${inputTextColor}`}>{title}</h3>
          </div>
          {isExpanded ? 
            <ChevronDown className={inputTextColor} size={20} /> : 
            <ChevronRight className={inputTextColor} size={20} />
          }
        </button>
        
        {isExpanded && (
          <div className="p-4">
            <div className={`${inputTextColor} prose max-w-none dark:prose-invert`} 
                 dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
      </div>
    );
  };

  // Help content sections
  const helpSections = [
    {
      id: "gettingStarted",
      title: language === "Français" ? "Démarrage" : language === "Bambara" ? "Ka daminɛ" : "Getting Started",
      icon: ChevronRight,
      content: language === "Français" ? 
        `<p>Bienvenue dans SchoolManager ! Voici comment commencer :</p>
         <ol>
           <li>Créez une base de données en spécifiant le nom de votre école</li>
           <li>Configurez les classes disponibles dans votre établissement</li>
           <li>Ajoutez vos élèves en utilisant le formulaire d'ajout</li>
           <li>Explorez les différentes fonctionnalités depuis le menu latéral</li>
         </ol>` 
        : language === "Bambara" ?
        `<p>Aw bisimila SchoolManager kɔnɔ! Nin ye a daminɛcogo ye:</p>
         <ol>
           <li>Aw ka lakɔliso tɔgɔ sɛbɛn walasa ka database dɔ da</li>
           <li>Aw ka aw ka lakɔliso kalan yɔrɔw labɛn</li>
           <li>Aw ka kalandenw tɔgɔ sɛbɛn ni fɔrɔmɛ in ye</li>
           <li>Aw ka baara kɛ ni fan kɛrɛfɛ menu ye</li>
         </ol>`
        : 
        `<p>Welcome to SchoolManager! Here's how to get started:</p>
         <ol>
           <li>Create a database by specifying your school name</li>
           <li>Set up the available classes in your institution</li>
           <li>Add your students using the add form</li>
           <li>Explore the different features from the sidebar menu</li>
         </ol>`
    },
    {
      id: "students",
      title: language === "Français" ? "Gestion des élèves" : language === "Bambara" ? "Kalandenw ladonni" : "Student Management",
      icon: ChevronRight,
      content: language === "Français" ? 
        `<p>La gestion des élèves vous permet de :</p>
         <ul>
           <li>Ajouter de nouveaux élèves avec leurs informations complètes</li>
           <li>Modifier les informations des élèves existants</li>
           <li>Supprimer des élèves</li>
           <li>Rechercher des élèves par nom, classe ou autres critères</li>
           <li>Générer des listes d'élèves par classe</li>
         </ul>
         <p>Pour ajouter un élève, cliquez sur le bouton "Ajouter un élève" dans la page principale.</p>`
        : language === "Bambara" ?
        `<p>Kalandenw ladonni b'a to i ka se ka:</p>
         <ul>
           <li>Kalanden kuraw fara ni u ka kunnafoni dafalen ye</li>
           <li>Kalanden kɔrɔw ka kunnafoni yɛlɛma</li>
           <li>Kalandenw bɔ</li>
           <li>Kalandenw ɲini u tɔgɔ, u ka kalan yɔrɔ walima fɛn wɛrɛw fɛ</li>
           <li>Kalandenw tɔgɔ sɛbɛnw bɔ kalan yɔrɔ kɔnɔ</li>
         </ul>
         <p>Walasa ka kalanden dɔ fara, i ka "Kalanden fara" bonyɛ digi jamana fɔlɔ kan.</p>`
        : 
        `<p>Student management allows you to:</p>
         <ul>
           <li>Add new students with their complete information</li>
           <li>Edit existing student information</li>
           <li>Delete students</li>
           <li>Search for students by name, class, or other criteria</li>
           <li>Generate student lists by class</li>
         </ul>
         <p>To add a student, click on the "Add Student" button on the main page.</p>`
    },
    {
      id: "classes",
      title: language === "Français" ? "Gestion des classes" : language === "Bambara" ? "Kalan yɔrɔw ladonni" : "Class Management",
      icon: ChevronRight,
      content: language === "Français" ? 
        `<p>La gestion des classes vous permet de :</p>
         <ul>
           <li>Créer de nouvelles classes</li>
           <li>Modifier les informations des classes existantes</li>
           <li>Supprimer des classes</li>
           <li>Assigner des élèves à des classes spécifiques</li>
         </ul>
         <p>Pour gérer les classes, accédez à la section "Gérer les classes" depuis le menu latéral.</p>`
        : language === "Bambara" ?
        `<p>Kalan yɔrɔw ladonni b'a to i ka se ka:</p>
         <ul>
           <li>Kalan yɔrɔ kuraw da</li>
           <li>Kalan yɔrɔ kɔrɔw ka kunnafoni yɛlɛma</li>
           <li>Kalan yɔrɔw bɔ</li>
           <li>Kalandenw bila kalan yɔrɔ kɛrɛnkɛrɛnnenw na</li>
         </ul>
         <p>Walasa ka kalan yɔrɔw ladon, i ka taa "Kalan yɔrɔw ladon" yɔrɔ la fan kɛrɛfɛ menu kɔnɔ.</p>`
        : 
        `<p>Class management allows you to:</p>
         <ul>
           <li>Create new classes</li>
           <li>Edit existing class information</li>
           <li>Delete classes</li>
           <li>Assign students to specific classes</li>
         </ul>
         <p>To manage classes, access the "Manage Classes" section from the sidebar menu.</p>`
    },
    {
      id: "compositions",
      title: language === "Français" ? "Compositions" : language === "Bambara" ? "Sɛgɛsɛgɛliw" : "Compositions",
      icon: ChevronRight,
      content: language === "Français" ? 
        `<p>La section Compositions vous permet de :</p>
         <ul>
           <li>Créer de nouvelles périodes d'évaluation</li>
           <li>Définir les classes concernées par chaque composition</li>
           <li>Gérer les dates des compositions</li>
           <li>Préparer les bulletins basés sur ces compositions</li>
         </ul>
         <p>Pour créer une nouvelle composition, accédez à la page "Compositions" et cliquez sur "Créer une composition".</p>`
        : language === "Bambara" ?
        `<p>Sɛgɛsɛgɛliw yɔrɔ b'a to i ka se ka:</p>
         <ul>
           <li>Sɛgɛsɛgɛli waati kuraw da</li>
           <li>Kalan yɔrɔw sɛbɛn minnu bɛ sɛgɛsɛgɛli kɛ</li>
           <li>Sɛgɛsɛgɛliw ka donw ladon</li>
           <li>Sɛbɛnw labɛn ka da nin sɛgɛsɛgɛliw kan</li>
         </ul>
         <p>Walasa ka sɛgɛsɛgɛli kura da, i ka taa "Sɛgɛsɛgɛliw" jamana na ka "Sɛgɛsɛgɛli da" bonyɛ digi.</p>`
        : 
        `<p>The Compositions section allows you to:</p>
         <ul>
           <li>Create new evaluation periods</li>
           <li>Define which classes are involved in each composition</li>
           <li>Manage composition dates</li>
           <li>Prepare report cards based on these compositions</li>
         </ul>
         <p>To create a new composition, go to the "Compositions" page and click on "Create Composition".</p>`
    },
    {
      id: "bulletins",
      title: language === "Français" ? "Bulletins" : language === "Bambara" ? "Sɛbɛnw" : "Report Cards",
      icon: ChevronRight,
      content: language === "Français" ? 
        `<p>La section Bulletins vous permet de :</p>
         <ul>
           <li>Générer des bulletins pour chaque élève</li>
           <li>Saisir les notes par matière</li>
           <li>Calculer automatiquement les moyennes</li>
           <li>Imprimer les bulletins individuels ou par classe</li>
           <li>Verrouiller les bulletins pour éviter les modifications</li>
         </ul>
         <p>Pour créer des bulletins, vous devez d'abord avoir configuré une composition.</p>`
        : language === "Bambara" ?
        `<p>Sɛbɛnw yɔrɔ b'a to i ka se ka:</p>
         <ul>
           <li>Sɛbɛnw bɔ kalanden kelen kelen bɛɛ ye</li>
           <li>Kalanni fan hakɛw sɛbɛn</li>
           <li>Hakɛw cɛmancɛ jate yɛrɛma</li>
           <li>Sɛbɛnw bɔ kalanden kelen kelen walima kalan yɔrɔ bɛɛ ye</li>
           <li>Sɛbɛnw datugu walasa u kana se ka yɛlɛma</li>
         </ul>
         <p>Walasa ka sɛbɛnw bɔ, i ka kan ka sɛgɛsɛgɛli dɔ labɛn fɔlɔ.</p>`
        : 
        `<p>The Report Cards section allows you to:</p>
         <ul>
           <li>Generate report cards for each student</li>
           <li>Enter grades by subject</li>
           <li>Automatically calculate averages</li>
           <li>Print individual or class report cards</li>
           <li>Lock report cards to prevent modifications</li>
         </ul>
         <p>To create report cards, you must first have set up a composition.</p>`
    },
    {
      id: "payments",
      title: language === "Français" ? "Paiements" : language === "Bambara" ? "Saraw" : "Payments",
      icon: ChevronRight,
      content: language === "Français" ? 
        `<p>La section Paiements vous permet de :</p>
         <ul>
           <li>Créer différents systèmes de paiement (frais de scolarité, cantine, etc.)</li>
           <li>Enregistrer les paiements des élèves</li>
           <li>Suivre les paiements en retard</li>
           <li>Générer des reçus</li>
           <li>Consulter l'historique des paiements</li>
         </ul>
         <p>Pour créer un nouveau système de paiement, accédez à la page "Paiements" et utilisez l'option "Ajouter un système".</p>`
        : language === "Bambara" ?
        `<p>Saraw yɔrɔ b'a to i ka se ka:</p>
         <ul>
           <li>Sara cogoya suguya caman da (kalanni sara, dumuni, ani wɛrɛw)</li>
           <li>Kalandenw ka saraw sɛbɛn</li>
           <li>Sara labannenw kɔlɔsi</li>
           <li>Sara sɛbɛnw bɔ</li>
           <li>Sara kɔrɔw lajɛ</li>
         </ul>
         <p>Walasa ka sara cogoya kura da, i ka taa "Saraw" jamana na ka "Sara cogoya fara" sugandi.</p>`
        : 
        `<p>The Payments section allows you to:</p>
         <ul>
           <li>Create different payment systems (tuition, cafeteria, etc.)</li>
           <li>Record student payments</li>
           <li>Track overdue payments</li>
           <li>Generate receipts</li>
           <li>View payment history</li>
         </ul>
         <p>To create a new payment system, go to the "Payments" page and use the "Add System" option.</p>`
    },
    {
      id: "statistics",
      title: language === "Français" ? "Statistiques" : language === "Bambara" ? "Jatetaw" : "Statistics",
      icon: ChevronRight,
      content: language === "Français" ? 
        `<p>La section Statistiques vous offre :</p>
         <ul>
           <li>Des graphiques sur les performances des élèves</li>
           <li>Des statistiques de réussite par classe</li>
           <li>Des analyses des tendances sur plusieurs périodes</li>
           <li>Des rapports sur les paiements et les finances</li>
         </ul>
         <p>Les statistiques sont générées automatiquement à partir des données de votre école.</p>`
        : language === "Bambara" ?
        `<p>Jatetaw yɔrɔ b'a di i ma:</p>
         <ul>
           <li>Kalandenw ka baara ɲuman jabiw ja fɛgɛnw</li>
           <li>Kalan yɔrɔw ka ɲɛtaa jatetaw</li>
           <li>Waati caman kɔnɔ fɛn yɛlɛmaw sɛgɛsɛgɛli</li>
           <li>Saraw ni wariw kan kibaroyaw</li>
         </ul>
         <p>Jatetaw bɛ bɔ yɛrɛma ka bɔ i ka lakɔliso kunnafoniw la.</p>`
        : 
        `<p>The Statistics section offers you:</p>
         <ul>
           <li>Graphs on student performance</li>
           <li>Success statistics by class</li>
           <li>Trend analyses over multiple periods</li>
           <li>Reports on payments and finances</li>
         </ul>
         <p>Statistics are automatically generated from your school's data.</p>`
    },
    {
      id: "database",
      title: language === "Français" ? "Base de données" : language === "Bambara" ? "Kunnafoni marayɔrɔ" : "Database",
      icon: ChevronRight,
      content: language === "Français" ? 
        `<p>La section Base de données vous permet de :</p>
         <ul>
           <li>Sauvegarder vos données</li>
           <li>Restaurer des sauvegardes précédentes</li>
           <li>Synchroniser avec le cloud (version premium)</li>
           <li>Gérer plusieurs bases de données</li>
         </ul>
         <p>Il est recommandé de faire des sauvegardes régulières pour éviter toute perte de données.</p>`
        : language === "Bambara" ?
        `<p>Kunnafoni marayɔrɔ b'a to i ka se ka:</p>
         <ul>
           <li>I ka kunnafoniw maracogo ɲuman kɛ</li>
           <li>Kunnafoni maralenw kɔrɔw lasegin</li>
           <li>I ka kunnafoniw ni sankolo synchroniser (premium version)</li>
           <li>Kunnafoni marayɔrɔ caman ladon</li>
         </ul>
         <p>A ka ɲi ka kunnafoniw mara tuma ni tuma walasa u kana tunu.</p>`
        : 
        `<p>The Database section allows you to:</p>
         <ul>
           <li>Back up your data</li>
           <li>Restore previous backups</li>
           <li>Sync with the cloud (premium version)</li>
           <li>Manage multiple databases</li>
         </ul>
         <p>It is recommended to make regular backups to avoid any data loss.</p>`
    },
    {
      id: "settings",
      title: language === "Français" ? "Paramètres" : language === "Bambara" ? "Labɛnw" : "Settings",
      icon: ChevronRight,
      content: language === "Français" ? 
        `<p>La section Paramètres vous permet de personnaliser :</p>
         <ul>
           <li>Le thème de l'application (clair/sombre)</li>
           <li>La langue de l'interface</li>
           <li>Les couleurs et l'apparence</li>
           <li>Les informations de votre école</li>
           <li>Les préférences d'affichage</li>
         </ul>
         <p>Accédez aux paramètres en cliquant sur l'icône d'engrenage dans la barre latérale.</p>`
        : language === "Bambara" ?
        `<p>Labɛnw yɔrɔ b'a to i ka se ka nin fɛnw labɛn:</p>
         <ul>
           <li>Porogaramu cogoya (yeelen/dibi)</li>
           <li>Porogaramu kan</li>
           <li>Ɲɛw ni cogoya</li>
           <li>I ka lakɔliso kunnafoniw</li>
           <li>Yirali cogoyaw</li>
         </ul>
         <p>I ka se ka labɛnw sɔrɔ ni i ye nɛgɛso ja digi fan kɛrɛfɛ bari kan.</p>`
        : 
        `<p>The Settings section allows you to customize:</p>
         <ul>
           <li>The application theme (light/dark)</li>
           <li>The interface language</li>
           <li>Colors and appearance</li>
           <li>Your school information</li>
           <li>Display preferences</li>
         </ul>
         <p>Access settings by clicking on the gear icon in the sidebar.</p>`
    }
  ];

  // Language-specific text content
  const getContent = (fr, en, bm) => {
    if (language === 'Français') return fr;
    if (language === 'Anglais') return en;
    if (language === 'Bambara') return bm;
    return fr; // Default to French
  };

  return (
    <div className="container mt-20 mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        <Link to="/" style={{fontWeight: "bold"}} className={`inline-flex items-center mb-6 btn btn-primary`}>
          <ArrowLeft className="mr-2" size={18} />
          {getContent(
            'Retour à l\'accueil', 
            'Back to Home',
            'Segin so kɔnɔ'
          )}
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${text_color}`}>
            {language === "Français" ? "Aide et Documentation" : 
             language === "Bambara" ? "Dɛmɛ ni Sɛbɛnw" : 
             "Help and Documentation"}
          </h1>
        </div>

        {/* Search bar */}
        <div className={`relative mb-6 ${cardBgColor} rounded-lg shadow-sm border ${borderColor} p-2`}>
          <div className="flex items-center">
            <Search className={`${inputTextColor} ml-2`} size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === "Français" ? "Rechercher dans l'aide..." : 
                          language === "Bambara" ? "Dɛmɛ kɔnɔ ɲini..." : 
                          "Search help..."}
              className={`w-full p-2 ${inputBgColor} ${inputTextColor} focus:outline-none rounded-md`}
            />
          </div>
        </div>

        {/* Help content */}
        <div className="space-y-4">
          {helpSections.map(section => (
            <HelpSection 
              key={section.id}
              id={section.id}
              title={section.title}
              content={section.content}
              icon={section.icon}
            />
          ))}
        </div>

        {/* Contact and resources section */}
        <div className={`mt-8 p-6 rounded-lg ${cardBgColor} border ${borderColor} shadow-sm`}>
          <h2 className={`text-xl font-bold mb-4 ${inputTextColor}`}>
            {language === "Français" ? "Ressources supplémentaires" : 
             language === "Bambara" ? "Dɛmɛ fɛn wɛrɛw" : 
             "Additional Resources"}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className={`font-semibold mb-2 ${inputTextColor}`}>
                {language === "Français" ? "Contactez-nous" : 
                 language === "Bambara" ? "An joɲɔgɔnya" : 
                 "Contact Us"}
              </h3>
              <div className="space-y-2">
                <a href="mailto:support@schoolmanager.com" className={`flex items-center ${linkColor}`}>
                  <Mail size={16} className="mr-2" />
                  support@schoolmanager.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const HelpersPage = () => {
  const outletContext = useOutletContext();
  return <HelpersPageContent {...outletContext} />;
};

export default HelpersPage;