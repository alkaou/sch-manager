import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, useFlashNotification } from '../components/contexts';
import StudentListMenu from "../components/liste_rapide/StudentListMenu.jsx";
import StudentListEditor from "../components/liste_rapide/StudentListEditor.jsx";
import StudentListNamePopup from "../components/liste_rapide/StudentListNamePopup.jsx";
import translations from "../components/liste_rapide/liste_rapide_translator";

const ListesPagePageContent = ({
  app_bg_color,
  text_color,
  theme,
}) => {
  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();

  // Translation helper
  const t = (key, params = {}) => {
    if (!translations[key]) return key;
    let text = translations[key][language] || translations[key]["Français"];
    
    // Replace any parameters in the text
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };

  const [db, setDb] = useState(null);
  const [studentLists, setStudentLists] = useState([]);
  const [showMenu, setShowMenu] = useState(true);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSmallLoading, setIsSmallLoading] = useState(false);

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
          message: t("error_loading_data"),
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
  const handleSaveListName = (name, listType = 'students') => {
    const newList = {
      id: Date.now().toString(),
      listType: listType, // 'students' or 'employees'
      name: name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      headers: [t("first_name"), t("last_name")],
      customHeaders: [],
      students: [],
      employees: [],
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
      langue: language,
      customMessage: {
        show: false,
        text: t("director"),
        name: "",
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
          message: t("list_saved_successfully"),
          type: "success",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error saving list:", error);
        setFlashMessage({
          message: t("error_saving_list"),
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
      setIsSmallLoading(true);
      await window.electron.deleteStudentList(listId);

      // Refresh the list of student lists
      const lists = await window.electron.getStudentLists();
      setStudentLists(lists);

      setFlashMessage({
        message: t("list_deleted_successfully"),
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting list:", error);
      setFlashMessage({
        message: t("error_deleting_list"),
        type: "error",
        duration: 5000,
      });
      setIsSmallLoading(false);
    } finally {
      setTimeout(() => {
        setIsSmallLoading(false);
      }, 1000);
    }
  };

  // Handle updating the current list (from editor)
  const handleUpdateCurrentList = (updatedList) => {
    setCurrentList(updatedList);
  };

  const some_text_color = theme === "dark" ? text_color : "text-gray-700";

  return (
    <div
      className="p-4 overflow-auto scrollbar-custom"
      style={{ marginLeft: "4%", height: "88vh", marginTop: "6%" }}
    >
      {isLoading ? (
        <div
          className="items-center absolute z-40 justify-center"
          style={{
            top: "50%",
            left: "50%",
          }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {isSmallLoading && (
            <div
              className="bg-blue-100 bg-opacity-40 z-40 justify-center fixed"
              style={{
                borderRadius: "100%",
                padding: "20px",
                border: "2px solid lightblue",
                marginLeft: "42%",
                marginTop: "20%"
              }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
            </div>
          )}
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
                textClass={some_text_color}
                appBgColor={app_bg_color}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

const ListesPagePage = () => {
  const outletContext = useOutletContext();
  return <ListesPagePageContent {...outletContext} />;
};

export default ListesPagePage;