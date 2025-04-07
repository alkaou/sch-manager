import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, useFlashNotification } from '../components/contexts';
import StudentListMenu from "../components/student_liste/StudentListMenu.jsx";
import StudentListEditor from "../components/student_liste/StudentListEditor.jsx";
import StudentListNamePopup from "../components/student_liste/StudentListNamePopup.jsx";

const ListeElevesPageContent = ({
  app_bg_color,
  text_color,
  theme,
}) => {
  const { live_language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();

  const [db, setDb] = useState(null);
  const [studentLists, setStudentLists] = useState([]);
  const [showMenu, setShowMenu] = useState(true);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch database and student lists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const database = await window.electron.getDatabase();
        setDb(database);

        const lists = await window.electron.getStudentLists();
        setStudentLists(lists);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFlashMessage({
          message: "Erreur lors du chargement des données",
          type: "error",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle creating a new list
  const handleCreateNewList = () => {
    setShowNamePopup(true);
  };

  // Handle editing an existing list
  const handleEditList = (list) => {
    setCurrentList(list);
    setShowMenu(false);
  };

  // Handle saving a list name from popup
  const handleSaveListName = (name) => {
    const newList = {
      id: Date.now().toString(),
      name: name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      headers: ["Prénom", "Nom"],
      customHeaders: [],
      students: [],
      title: {
        text: name,
        style: {
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          color: "#000000",
          fontFamily: "Arial",
          fontStyle: "normal",
          textDecoration: "none",
        }
      },
      orientation: "portrait",
      customMessage: {
        show: false,
        text: "Le Directeur",
        date: new Date().toISOString().split('T')[0]
      },
      countryInfosHeader: {
        show: true,
        isCAP: true,
      }
    };

    setCurrentList(newList);
    setShowNamePopup(false);
    setShowMenu(false);
  };

  // Handle returning to menu and saving changes
  const handleReturnToMenu = async () => {
    if (currentList) {
      try {
        setIsLoading(true);
        // Update the last modified date
        const updatedList = {
          ...currentList,
          updatedAt: new Date().toISOString()
        };

        await window.electron.saveStudentList(updatedList);

        // Refresh the list of student lists
        const lists = await window.electron.getStudentLists();
        setStudentLists(lists);

        setFlashMessage({
          message: "Liste sauvegardée avec succès",
          type: "success",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error saving list:", error);
        setFlashMessage({
          message: "Erreur lors de la sauvegarde de la liste",
          type: "error",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    }

    setCurrentList(null);
    setShowMenu(true);
  };

  // Handle deleting a list
  const handleDeleteList = async (listId) => {
    try {
      setIsLoading(true);
      await window.electron.deleteStudentList(listId);

      // Refresh the list of student lists
      const lists = await window.electron.getStudentLists();
      setStudentLists(lists);

      setFlashMessage({
        message: "Liste supprimée avec succès",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting list:", error);
      setFlashMessage({
        message: "Erreur lors de la suppression de la liste",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating the current list (from editor)
  const handleUpdateCurrentList = (updatedList) => {
    setCurrentList(updatedList);
  };

  return (
    <div className={`p-4 mt-20 ml-20 ${app_bg_color}`}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            {showMenu && (
              <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <StudentListMenu
                  studentLists={studentLists}
                  onCreateNew={handleCreateNewList}
                  onEditList={handleEditList}
                  onDeleteList={handleDeleteList}
                  theme={theme}
                  textClass={text_color}
                  appBgColor={app_bg_color}
                />
              </motion.div>
            )}

            {!showMenu && currentList && (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <StudentListEditor
                  list={currentList}
                  onUpdateList={handleUpdateCurrentList}
                  onReturnToMenu={handleReturnToMenu}
                  db={db}
                  theme={theme}
                  textClass={text_color}
                  appBgColor={app_bg_color}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showNamePopup && (
              <StudentListNamePopup
                onSave={handleSaveListName}
                onCancel={() => setShowNamePopup(false)}
                theme={theme}
                textClass={text_color}
                appBgColor={app_bg_color}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

const ListeElevesPage = () => {
  const outletContext = useOutletContext();
  return <ListeElevesPageContent {...outletContext} />;
};

export default ListeElevesPage;