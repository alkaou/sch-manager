import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import StudentsTable from "../components/StudentsTable.jsx";
import AddStudent from "../components/AddStudent.jsx";
import ManageClasses from "../components/ManageClasses.jsx";
import PageLoading from "../components/PageLoading.jsx";
import EnrollmentStats from "../components/enrollements/EnrollmentStats.jsx";
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
  // États pour l'affichage des statistiques d'effectifs
  const [showEnrollmentStats, setShowEnrollmentStats] = useState(false);
  
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
    marginTop: "6%",
  };
  
  const style_2 = {
    width: "96%",
    maxWidth: "96%",
    marginLeft: "4%"
  };

  if (loadingData) {
    return (
      <PageLoading />
    );
  };

  // Rendu conditionnel selon l'action sélectionnée dans le sidebar
  if (isAddStudentActive) {
    return (
      <div className="w-full px-2 md:px-4" style={style_1}>
        <div className="w-full" style={style_2}>
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
      <div className="w-full px-2 md:px-4" style={style_1}>
        <div className="w-full" style={style_2}>
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
  } else if (showEnrollmentStats) {
    return (
      <div className="w-full px-2 md:px-4 mt-4" style={style_1}>
        <div className="w-full" style={style_2}>
          <EnrollmentStats
            setShowEnrollmentStats={setShowEnrollmentStats}
            app_bg_color={app_bg_color}
            text_color={text_color}
            theme={theme}
            database={database}
            refreshData={refreshData}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div style={style_1} className="overflow-hidden">
        <div style={style_2} className="scrollbar-custom">
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
