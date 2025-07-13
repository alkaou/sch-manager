import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  AlertCircle,
  PlayCircle,
  XCircle
} from 'lucide-react';
import { useLanguage } from '../contexts';
import { translate } from './events_translator';
import {
  determineEventStatus,
  canEditEvent,
  canDeleteEvent,
  canValidateEvent,
  formatEventDuration,
  EVENT_STATUS
} from './EventsMethodes';

const EventCard = ({
  event,
  theme,
  app_bg_color,
  text_color,
  onEdit,
  onDelete,
  onValidate,
  onViewDetails,
  index
}) => {
  const { language } = useLanguage();
  const currentStatus = determineEventStatus(event);

  // Couleurs selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case EVENT_STATUS.PENDING:
        return 'bg-yellow-500';
      case EVENT_STATUS.ONGOING:
        return 'bg-green-500';
      case EVENT_STATUS.PAST:
        return 'bg-gray-500';
      case EVENT_STATUS.VALIDATED:
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case EVENT_STATUS.PENDING:
        return <Clock size={16} />;
      case EVENT_STATUS.ONGOING:
        return <PlayCircle size={16} />;
      case EVENT_STATUS.PAST:
        return <XCircle size={16} />;
      case EVENT_STATUS.VALIDATED:
        return <CheckCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getBorderColor = () => {
    if (theme === 'dark') {
      return 'border-gray-600 hover:border-gray-500';
    }
    return 'border-gray-200 hover:border-gray-300';
  };

  const getCardBackground = () => {
    if (theme === 'dark') {
      return 'bg-gray-800 hover:bg-gray-750';
    }
    return 'bg-white hover:bg-gray-50';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time.slice(0, 5); // HH:MM
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`relative rounded-xl border-2 ${getBorderColor()} ${getCardBackground()} ${text_color} p-6 shadow-lg transition-all duration-300`}
    >
      {/* Badge de statut */}
      <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(currentStatus)}`}>
        {getStatusIcon(currentStatus)}
        <span>{translate(currentStatus, language)}</span>
      </div>

      {/* Titre de l'événement */}
      <div className="mb-4 pr-24">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          {event.title}
        </h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
          {event.description}
        </p>
      </div>

      {/* Type d'événement */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}>
          {translate(event.type, language)}
        </span>
      </div>

      {/* Informations de date et heure */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-blue-500" />
          <div className="flex-1">
            <div className="text-sm font-medium">
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {translate('duration', language)}: {formatEventDuration(event.startDate, event.startTime, event.endDate, event.endTime)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock size={16} className="text-green-500" />
          <div className="text-sm">
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </div>
        </div>
      </div>

      {/* Dates de création et modification */}
      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4 space-y-1`}>
        <div>
          {translate('created_at', language)}: {formatDate(event.createdAt)}
        </div>
        {event.updatedAt !== event.createdAt && (
          <div>
            {translate('updated_at', language)}: {formatDate(event.updatedAt)}
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          {/* Bouton Voir détails */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onViewDetails(event)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            title={translate('view_details', language)}
          >
            <Eye size={16} />
          </motion.button>

          {/* Bouton Modifier */}
          {canEditEvent(event) && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => onEdit(event)}
              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              title={translate('edit_event', language)}
            >
              <Edit2 size={16} />
            </motion.button>
          )}

          {/* Bouton Supprimer */}
          {canDeleteEvent(event) && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => onDelete(event)}
              className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
              title={translate('delete_event', language)}
            >
              <Trash2 size={16} />
            </motion.button>
          )}
        </div>

        {/* Bouton Valider */}
        {canValidateEvent(event) && (
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onValidate(event)}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors flex items-center gap-2"
          >
            <CheckCircle size={16} />
            {translate('validate_event', language)}
          </motion.button>
        )}
      </div>

      {/* Indicateur de validation */}
      {event.validation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mt-4 p-3 rounded-lg border-l-4 border-green-500 ${
            theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
          }`}
        >
          <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
            ✓ Événement validé le {formatDate(event.validation.validatedAt)}
          </div>
          <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Cliquez sur "Voir détails" pour consulter le rapport de validation
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EventCard;