import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import StudentListMenu from "../components/student_liste/StudentListMenu.jsx";
import StudentListEditor from "../components/student_liste/StudentListEditor.jsx";
import secureLocalStorage from "react-secure-storage";

const ListeElevesPageContent = ({
  app_bg_color,
  text_color,
  theme,
}) => {
  const [db, setDb] = useState(null);
  const [view, setView] = useState("menu"); // menu, create, edit
  const [currentList, setCurrentList] = useState(null);
  const [savedLists, setSavedLists] = useState([]);

  // Load database and saved lists
  useEffect(() => {
    // Load database
    window.electron.getDatabase().then((data) => {
      setDb(data);
    });

    // Load saved lists from secure storage
    const lists = secureLocalStorage.getItem("student_lists");
    if (lists) {
      setSavedLists(JSON.parse(lists));
    }
    
    // Load lists from database
    loadListsFromDatabase();
  }, []);
  
  // Load lists from database
  const loadListsFromDatabase = async () => {
    try {
      const dbLists = await window.electron.getStudentLists();
      if (dbLists && dbLists.length > 0) {
        // Merge with local lists, prioritizing database lists
        const localLists = secureLocalStorage.getItem("student_lists");
        const parsedLocalLists = localLists ? JSON.parse(localLists) : [];
        
        // Create a map of existing lists by ID
        const listsMap = new Map();
        parsedLocalLists.forEach(list => listsMap.set(list.id, list));
        
        // Add or update with database lists
        dbLists.forEach(dbList => {
          listsMap.set(dbList.id, dbList);
        });
        
        const mergedLists = Array.from(listsMap.values());
        setSavedLists(mergedLists);
        secureLocalStorage.setItem("student_lists", JSON.stringify(mergedLists));
      }
    } catch (error) {
      console.error("Error loading lists from database:", error);
    }
  };

  // Save a new list or update existing one
  const saveList = (list) => {
    const updatedLists = currentList 
      ? savedLists.map(l => l.id === list.id ? list : l)
      : [...savedLists, { ...list, id: Date.now().toString() }];
    
    setSavedLists(updatedLists);
    secureLocalStorage.setItem("student_lists", JSON.stringify(updatedLists));
    
    if (!currentList) {
      setCurrentList(updatedLists[updatedLists.length - 1]);
    }
  };

  // Delete a list
  const deleteList = async (listId) => {
    try {
      // Delete from database if it exists there
      await window.electron.deleteStudentList(listId);
      
      // Update local state
      const updatedLists = savedLists.filter(list => list.id !== listId);
      setSavedLists(updatedLists);
      secureLocalStorage.setItem("student_lists", JSON.stringify(updatedLists));
      
      if (currentList && currentList.id === listId) {
        setCurrentList(null);
        setView("menu");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Erreur lors de la suppression de la liste");
    }
  };

  return (
    <div className="p-4 mt-20 ml-20">
      {view === "menu" && (
        <StudentListMenu 
          savedLists={savedLists}
          setView={setView}
          setCurrentList={setCurrentList}
          deleteList={deleteList}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
          refreshLists={loadListsFromDatabase}
        />
      )}
      
      {(view === "create" || view === "edit") && (
        <StudentListEditor
          db={db}
          currentList={currentList}
          saveList={saveList}
          setView={setView}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
          mode={view}
        />
      )}
    </div>
  );
};

const ListeElevesPage = () => {
  const context = useOutletContext();
  return <ListeElevesPageContent {...context} />;
};

export default ListeElevesPage;
