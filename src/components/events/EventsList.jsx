import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../contexts';
import { translate } from './events_translator';
import EventCard from './EventCard.jsx';
import { getEventStatistics } from './EventsMethodes';

const EventsList = ({
  events,
  onEditEvent,
  onDeleteEvent,
  onValidateEvent,
  onViewDetails,
  theme,
  app_bg_color,
  text_color,
  database,
  setFlashMessage
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedSections, setExpandedSections] = useState({
    all: true,
    pending: true,
    validated: true,
    ongoing: true,
    past: true
  });

  // Grouper les événements par statut
  const groupedEvents = {
    all: events,
    pending: events.filter(event => event.currentStatus === 'pending'),
    validated: events.filter(event => event.currentStatus === 'validated'),
    ongoing: events.filter(event => event.currentStatus === 'ongoing'),
    past: events.filter(event => event.currentStatus === 'past')
  };

  // Statistiques
  const stats = getEventStatistics(events);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'validated':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'ongoing':
        return <PlayCircle className="text-blue-500" size={20} />;
      case 'past':
        return <XCircle className="text-gray-500" size={20} />;
      default:
        return <Calendar className="text-purple-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'validated':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'past':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const tabs = [
    { key: 'all', label: translate('all_events', language), count: stats.total },
    { key: 'pending', label: translate('pending', language), count: stats.pending },
    { key: 'validated', label: translate('validated', language), count: stats.validated },
    { key: 'ongoing', label: translate('ongoing', language), count: stats.ongoing },
    { key: 'past', label: translate('past', language), count: stats.past }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const sectionVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    },
    exit: { 
      height: 0, 
      opacity: 0,
      transition: {
        opacity: { duration: 0.1 },
        height: { duration: 0.2, delay: 0.1 }
      }
    }
  };

  const renderEventSection = (sectionKey, sectionEvents, title) => {
    if (sectionKey !== 'all' && sectionEvents.length === 0) return null;

    return (
      <motion.div
        key={sectionKey}
        variants={itemVariants}
        className={`rounded-xl shadow-lg border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
      >
        {/* En-tête de section */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toggleSection(sectionKey)}
          className={`w-full p-4 flex items-center justify-between transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(sectionKey === 'all' ? 'all' : sectionKey)}
            <h3 className="text-lg font-semibold">{title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
              sectionKey === 'all' 
                ? 'bg-purple-100 text-purple-800 border-purple-200'
                : getStatusColor(sectionKey)
            }`}>
              {sectionEvents.length}
            </span>
          </div>
          <motion.div
            animate={{ rotate: expandedSections[sectionKey] ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={20} />
          </motion.div>
        </motion.button>

        {/* Contenu de la section */}
        <AnimatePresence>
          {expandedSections[sectionKey] && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden"
            >
              <div className={`p-4 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                {sectionEvents.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center py-8 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">
                      {translate('no_events', language)}
                    </p>
                    <p className="text-sm">
                      {translate('no_events_description', language)}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {sectionEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        variants={itemVariants}
                        transition={{ delay: index * 0.05 }}
                      >
                        <EventCard
                          event={event}
                          onEdit={onEditEvent}
                          onDelete={onDeleteEvent}
                          onValidate={onValidateEvent}
                          onViewDetails={onViewDetails}
                          theme={theme}
                          text_color={text_color}
                          database={database}
                          setFlashMessage={setFlashMessage}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-xl shadow-lg border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } ${text_color}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="text-purple-600" size={20} />
            </div>
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {translate('total_events', language)}
              </p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-xl shadow-lg border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } ${text_color}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PlayCircle className="text-blue-600" size={20} />
            </div>
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {translate('ongoing', language)}
              </p>
              <p className="text-xl font-bold">{stats.ongoing}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-xl shadow-lg border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } ${text_color}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {translate('pending', language)}
              </p>
              <p className="text-xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-xl shadow-lg border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } ${text_color}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {translate('validated', language)}
              </p>
              <p className="text-xl font-bold">{stats.validated}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Onglets de navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-wrap gap-2 p-2 rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}
      >
        {tabs.map(tab => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white shadow-lg'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-1 rounded-full text-xs ${
              activeTab === tab.key
                ? 'bg-white bg-opacity-20'
                : theme === 'dark'
                  ? 'bg-gray-600'
                  : 'bg-gray-200'
            }`}>
              {tab.count}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Liste des événements */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {activeTab === 'all' ? (
          // Afficher toutes les sections
          <>
            {renderEventSection('pending', groupedEvents.pending, translate('pending_events', language))}
            {renderEventSection('ongoing', groupedEvents.ongoing, translate('ongoing_events', language))}
            {renderEventSection('validated', groupedEvents.validated, translate('validated_events', language))}
            {renderEventSection('past', groupedEvents.past, translate('past_events', language))}
          </>
        ) : (
          // Afficher seulement la section sélectionnée
          renderEventSection(activeTab, groupedEvents[activeTab], tabs.find(t => t.key === activeTab)?.label)
        )}
      </motion.div>
    </div>
  );
};

export default EventsList;