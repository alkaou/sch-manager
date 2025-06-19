import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import StudentsTable from "../components/StudentsTable.jsx";
import AddStudent from "../components/AddStudent.jsx";
import ManageClasses from "../components/ManageClasses.jsx";
import PageLoading from "../components/PageLoading.jsx";
import { updateCurrentSnapshot } from "../utils/snapshotManager.js";

const StartedPageContent = ({
  isAddStudentActive,
  isManageClassesActive,
  students,
  classes,
  openDropdown,
  setOpenDropdown,
  setIsAddStudentActive,
  setIsManageClassesActive,
  OpenThePopup,
  refreshData,
  database,
  loadingData,
  setStudentsForUpdate,
  studentsForUpdate,
  app_bg_color,
  text_color,
  theme,
}) => {


  // Générer un snapshot au démarrage de l'application
  useEffect(() => {
    const initializeSnapshot = async () => {
      if (database && !loadingData) {
        try {
          await updateCurrentSnapshot(database);
        } catch (error) {
          console.error("Erreur lors de la génération du snapshot initial:", error);
        }
      }
    };

    initializeSnapshot();
  }, [database, loadingData]);

  // Styles spécifiques au contenu - using percentage-based dimensions for better responsiveness
  const style_1 = {
    width: "100%",
    maxWidth: "100%",
  };

  const style_2 = {
    width: "96%",
    maxWidth: "96%",
    marginLeft: "4%",
    marginTop: "6%",
  };

  if (loadingData) {
    return (
      <PageLoading />
    );
  };

  // Rendu conditionnel selon l'action sélectionnée dans le sidebar
  if (isAddStudentActive) {
    return (
      <div
        style={{ ...style_1, height: "100vh" }}
        className="w-full px-2 md:px-4 overflow-hidden"
      >
        <div
          className="w-full scrollbar-custom overflow-auto"
          style={{ ...style_2, height: "90vh" }}
        >
          <AddStudent
            setIsAddStudentActive={setIsAddStudentActive}
            app_bg_color={app_bg_color}
            text_color={text_color}
            theme={theme}
            studentsForUpdate={studentsForUpdate}
            setStudentsForUpdate={setStudentsForUpdate}
          />
        </div>
      </div>
    );
  } else if (isManageClassesActive) {
    return (
      <div
        className="w-full px-2 md:px-4 overflow-hidden"
        style={{ ...style_1, height: "100vh" }}
      >
        <div
          className="w-full scrollbar-custom overflow-auto"
          style={{ ...style_2, height: "88vh" }}
        >
          <ManageClasses
            setIsManageClassesActive={setIsManageClassesActive}
            app_bg_color={app_bg_color}
            text_color={text_color}
            theme={theme}
            database={database}
          />
        </div>
      </div>
    );

  } else {
    return (
      <div
        className="w-full px-2 md:px-4 overflow-hidden"
        style={{ ...style_1, height: "100vh", overflow: "hidden" }}
      >
        <div
          style={{
            width: "96%",
            maxWidth: "96%",
            marginLeft: "4%",
            overflow: "auto",
            maxHeight: "87vh",
            marginTop: "6.5%",
          }}
          className="scrollbar-custom border-2 rounded border-emerald-400 p-1"
        >
          <StudentsTable
            students={students}
            classes={classes}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            app_bg_color={app_bg_color}
            text_color={text_color}
            theme={theme}
            setIsAddStudentActive={setIsAddStudentActive}
            setIsManageClassesActive={setIsManageClassesActive}
            OpenThePopup={OpenThePopup}
            refreshData={refreshData}
            database={database}
            setStudentsForUpdate={setStudentsForUpdate}
          />
        </div>
      </div>
    );
  }
};

const StartedPage = () => {
  // Récupère le contexte fourni par le layout via Outlet
  const context = useOutletContext();
  return <StartedPageContent {...context} />;
};

export default StartedPage;
