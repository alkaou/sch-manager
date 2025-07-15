import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, Loader, RefreshCw, InfoIcon } from "lucide-react";
import { useLanguage, useFlashNotification } from "../components/contexts";
import { translate } from "../components/events/events_translator";
import {
  getAllEvents,
  filterEvents,
  sortEvents,
  deleteEvent,
} from "../components/events/EventsMethodes";
import EventsList from "../components/events/EventsList.jsx";
import EventFilters from "../components/events/EventFilters.jsx";
import EventForm from "../components/events/EventForm.jsx";
import EventValidationForm from "../components/events/EventValidationForm.jsx";
import EventDetails from "../components/events/EventDetails.jsx";
import EventsInfoPopup from "../components/events/EventsInfoPopup.jsx";
import ActionConfirmePopup from "../components/popups/ActionConfirmePopup.jsx";

export default function EventsPage() {
  const {
    theme,
    app_bg_color,
    text_color,
    database,
    loadingData,
    refreshData,
    setActiveSideBarBtn,
  } = useOutletContext();

  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();

  const events_text_color = theme === "dark" ? text_color : "text-gray-700";

  // États pour les événements
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // États pour les modales
  const [showEventForm, setShowEventForm] = useState(false);
  const [showValidationForm, setShowValidationForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // États pour les événements sélectionnés
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [eventToValidate, setEventToValidate] = useState(null);

  // Charger les événements
  const loadEvents = useCallback(() => {
    try {
      setIsLoading(true);
      const eventsData = getAllEvents(database);
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      setFlashMessage({
        type: "error",
        message: translate("error_loading_events", language),
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [database, language, setFlashMessage]);

  // Actualiser les événements
  const refreshEvents = useCallback(async () => {
    try {
      setIsRefreshing(true);
      // Recharger les données depuis la base de données
      await refreshData();
      // Recharger les événements
      loadEvents();
      setFlashMessage({
        type: "success",
        message: translate("data_refreshed_success", language),
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors de l'actualisation:", error);
      setFlashMessage({
        type: "error",
        message: translate("data_refresh_error", language),
        duration: 5000,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [loadEvents, refreshData, language, setFlashMessage]);

  // Charger les événements au montage
  useEffect(() => {
    setActiveSideBarBtn(13);
    if (database) {
      loadEvents();
    }
  }, [database, loadEvents]);

  // Gérer les filtres
  const handleFiltersChange = useCallback(
    (filters) => {
      let filtered = filterEvents(events, filters);
      filtered = sortEvents(filtered, filters.sortBy, filters.sortOrder);
      setFilteredEvents(filtered);
    },
    [events]
  );

  // Gestionnaires d'événements
  const handleAddEvent = () => {
    setEventToEdit(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (event) => {
    // console.log(event);
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  const handleValidateEvent = (event) => {
    setEventToValidate(event);
    setShowValidationForm(true);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(
          eventToDelete.id,
          database,
          setFlashMessage,
          language
        );
        // Recharger les données depuis la base de données
        await refreshData();
        // Recharger les événements
        loadEvents();
        setShowDeleteConfirm(false);
        setEventToDelete(null);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  // Gestionnaires de sauvegarde
  const handleEventSaved = async () => {
    // Recharger les données depuis la base de données
    await refreshData();
    // Recharger les événements
    loadEvents();
    setShowEventForm(false);
    setEventToEdit(null);
  };

  const handleEventValidated = async () => {
    // Recharger les données depuis la base de données
    await refreshData();
    // Recharger les événements
    loadEvents();
    setShowValidationForm(false);
    setEventToValidate(null);
  };

  // Fermer les modales
  const closeEventForm = () => {
    setShowEventForm(false);
    setEventToEdit(null);
  };

  const closeValidationForm = () => {
    setShowValidationForm(false);
    setEventToValidate(null);
  };

  const closeEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setEventToDelete(null);
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  if (loadingData) {
    return (
      <div
        style={{ marginLeft: "4%", height: "88vh", marginTop: "6%" }}
        className={`h-screen overflow-hidden ${app_bg_color} ${events_text_color}`}
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-medium">
              {translate("loading", language)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{ marginLeft: "4%", height: "88vh", marginTop: "6%" }}
      className={`h-screen overflow-hidden ${app_bg_color} ${events_text_color}`}
    >
      <div className="h-full p-6 overflow-y-auto scrollbar-custom">
        {/* En-tête */}
        <motion.div
          variants={headerVariants}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {translate("events_manager", language)}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-2"
                  onClick={() => setShowInfoPopup(true)}
                >
                  <InfoIcon size={20} className="text-blue-400" />
                </motion.button>
              </h1>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : text_color
                }`}
              >
                {translate("events_manager_description", language)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bouton d'actualisation */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshEvents}
              disabled={isRefreshing}
              className={`p-3 rounded-lg transition-colors flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={translate("refresh", language)}
            >
              <RefreshCw
                size={20}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </motion.button>

            {/* Bouton d'ajout */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddEvent}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              {translate("add_event", language)}
            </motion.button>
          </div>
        </motion.div>

        {/* Filtres */}
        <motion.div variants={headerVariants} className="mb-6">
          <EventFilters
            onFiltersChange={handleFiltersChange}
            theme={theme}
            text_color={events_text_color}
          />
        </motion.div>

        {/* Liste des événements */}
        <motion.div variants={headerVariants}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {translate("loading_events", language)}
                </p>
              </div>
            </div>
          ) : (
            <EventsList
              events={filteredEvents}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onValidateEvent={handleValidateEvent}
              onViewDetails={handleViewDetails}
              theme={theme}
              app_bg_color={app_bg_color}
              text_color={events_text_color}
              database={database}
              setFlashMessage={setFlashMessage}
            />
          )}
        </motion.div>

        {/* Modales */}
        <AnimatePresence>
          {/* Formulaire d'événement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <EventForm
              isOpen={showEventForm}
              onClose={closeEventForm}
              event={eventToEdit}
              database={database}
              setFlashMessage={setFlashMessage}
              onEventSaved={handleEventSaved}
              theme={theme}
              app_bg_color={app_bg_color}
              text_color={events_text_color}
            />
            <EventForm
              isOpen={showEventForm}
              onClose={closeEventForm}
              event={eventToEdit}
              database={database}
              setFlashMessage={setFlashMessage}
              onEventSaved={handleEventSaved}
              theme={theme}
              app_bg_color={app_bg_color}
              text_color={events_text_color}
            />

            {/* Formulaire de validation */}
            <EventValidationForm
              isOpen={showValidationForm}
              onClose={closeValidationForm}
              event={eventToValidate}
              database={database}
              setFlashMessage={setFlashMessage}
              onEventValidated={handleEventValidated}
              theme={theme}
              app_bg_color={app_bg_color}
              text_color={events_text_color}
            />

            {/* Détails de l'événement */}
            <EventDetails
              isOpen={showEventDetails}
              onClose={closeEventDetails}
              event={selectedEvent}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onValidate={handleValidateEvent}
              theme={theme}
              text_color={events_text_color}
            />

            {/* Popup d'information */}
            <EventsInfoPopup
              isOpen={showInfoPopup}
              onClose={() => setShowInfoPopup(false)}
              theme={theme}
            />

            {/* Confirmation de suppression */}
            {showDeleteConfirm && eventToDelete && (
              <ActionConfirmePopup
                isOpenConfirmPopup={showDeleteConfirm}
                setIsOpenConfirmPopup={closeDeleteConfirm}
                handleConfirmeAction={confirmDelete}
                title={translate("confirm_delete", language)}
                message={`${translate("confirm_delete_event", language)} "${
                  eventToDelete.title
                }" ?`}
                actionType="danger"
                element_info=""
                text_color={events_text_color}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
