import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Play, ChevronRight, FileText,
  Clock, Users, BarChart2, School, Video
} from 'lucide-react';

import { useLanguage, useTheme } from '../contexts';

const TutorialsSection = ({ isOthersBGColors }) => {
  const { live_language } = useLanguage();
  const { theme, text_color } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  // Tutorial categories
  const categories = [
    { id: 'all', name: live_language.all_text || 'Tous' },
    { id: 'getting-started', name: live_language.getting_started || 'Démarrage' },
    { id: 'students', name: live_language.students_text || 'Élèves' },
    { id: 'reports', name: live_language.bulletins_nav || 'Bulletins' },
    { id: 'analytics', name: live_language.analytics_nav || 'Analyses' }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  // Tutorial data
  const tutorials = [
    {
      id: 1,
      title: live_language.tutorial_1_title || 'Créer votre première base de données',
      description: live_language.tutorial_1_desc || 'Apprenez à configurer votre école en quelques minutes',
      thumbnail: 'https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Database+Setup',
      category: 'getting-started',
      duration: '4:30',
      difficulty: 'beginner',
      icon: School
    },
    {
      id: 2,
      title: live_language.tutorial_2_title || 'Gestion des élèves et des classes',
      description: live_language.tutorial_2_desc || 'Comment ajouter, modifier et organiser vos élèves par classe',
      thumbnail: 'https://placehold.co/600x400/8b5cf6/FFFFFF/png?text=Students+Management',
      category: 'students',
      duration: '6:15',
      difficulty: 'beginner',
      icon: Users
    },
    {
      id: 3,
      title: live_language.tutorial_3_title || 'Création des bulletins personnalisés',
      description: live_language.tutorial_3_desc || 'Configurez les modèles de bulletins adaptés à votre établissement',
      thumbnail: 'https://placehold.co/600x400/10b981/FFFFFF/png?text=Custom+Reports',
      category: 'reports',
      duration: '8:45',
      difficulty: 'intermediate',
      icon: FileText
    },
    {
      id: 4,
      title: live_language.tutorial_4_title || 'Analyse des performances par classe',
      description: live_language.tutorial_4_desc || 'Interprétez les statistiques et améliorez les résultats',
      thumbnail: 'https://placehold.co/600x400/ef4444/FFFFFF/png?text=Performance+Analysis',
      category: 'analytics',
      duration: '7:20',
      difficulty: 'advanced',
      icon: BarChart2
    },
    {
      id: 5,
      title: live_language.tutorial_5_title || 'Gestion des compositions et évaluations',
      description: live_language.tutorial_5_desc || 'Enregistrez et calculez les notes efficacement',
      thumbnail: 'https://placehold.co/600x400/f59e0b/FFFFFF/png?text=Evaluations+Setup',
      category: 'reports',
      duration: '5:55',
      difficulty: 'intermediate',
      icon: Clock
    },
    {
      id: 6,
      title: live_language.tutorial_6_title || 'Guide complet pour nouveaux utilisateurs',
      description: live_language.tutorial_6_desc || 'Tour d\'horizon des fonctionnalités essentielles',
      thumbnail: 'https://placehold.co/600x400/06b6d4/FFFFFF/png?text=Complete+Guide',
      category: 'getting-started',
      duration: '12:30',
      difficulty: 'beginner',
      icon: Video
    }
  ];

  // Filter tutorials based on search term and active category
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tutorial.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-500';
      case 'intermediate':
        return 'text-yellow-500';
      case 'advanced':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return live_language.beginner || 'Débutant';
      case 'intermediate':
        return live_language.intermediate || 'Intermédiaire';
      case 'advanced':
        return live_language.advanced || 'Avancé';
      default:
        return difficulty;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const _texts_color = isOthersBGColors ? "text-gray-700" : text_color;

  return (
    <section id="tutorials" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 inline-block  text-transparent 
            ${isOthersBGColors ? text_color : "bg-gradient-to-r from-blue-600 to-purple-600"}
          `}>
            {live_language.tutorials_title || "Tutoriels et ressources"}
          </h2>
          <p className="max-w-2xl mx-auto text-lg opacity-75 mb-8">
            {live_language.tutorials_subtitle || "Apprenez à utiliser toutes les fonctionnalités de SchoolManager avec nos guides vidéo étape par étape."}
          </p>

          {/* Search and filter */}
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={live_language.search_tutorials || "Rechercher des tutoriels..."}
                className={`block w-full pl-10 pr-3 py-3 border-gray-300 dark:border-gray-600 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                  } focus:ring-blue-500 focus:border-blue-500`}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tutorials grid */}
        {filteredTutorials.length > 0 ? (
          <motion.div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${_texts_color}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredTutorials.map(tutorial => {
              const TutorialIcon = tutorial.icon;
              return (
                <motion.div
                  key={tutorial.id}
                  variants={itemVariants}
                  className={`group rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                  whileHover={{ y: -5 }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </motion.div>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black bg-opacity-60 rounded text-white text-xs font-medium">
                      {tutorial.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-100'}`}>
                        <TutorialIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className={`text-sm font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                        {getDifficultyText(tutorial.difficulty)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{tutorial.title}</h3>
                    <p className="text-sm opacity-75 mb-4 line-clamp-2">{tutorial.description}</p>
                    <motion.button
                      className="flex items-center text-blue-600 font-medium text-sm"
                      whileHover={{ x: 4 }}
                    >
                      {live_language.watch_tutorial || "Regarder le tutoriel"}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className={`${_texts_color} text-center py-12 px-6 rounded-lg mx-auto max-w-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">
              {live_language.no_tutorials_found || "Aucun tutoriel trouvé"}
            </h3>
            <p className="opacity-75">
              {live_language.no_tutorials_message || "Essayez d'autres termes de recherche ou une autre catégorie."}
            </p>
            <motion.button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {live_language.reset_filters || "Réinitialiser les filtres"}
            </motion.button>
          </motion.div>
        )}

        {/* Help center link */}
        <motion.div
          className={`${_texts_color} mt-16 p-8 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-3">
            {live_language.need_more_help || "Besoin d'aide supplémentaire ?"}
          </h3>
          <p className="max-w-2xl mx-auto opacity-75 mb-6">
            {live_language.help_center_message || "Consultez notre centre d'aide complet ou contactez directement notre équipe de support."}
          </p>
          <motion.button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg inline-flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {live_language.visit_help_center || "Visiter le centre d'aide"}
            <ChevronRight className="ml-2 w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TutorialsSection; 