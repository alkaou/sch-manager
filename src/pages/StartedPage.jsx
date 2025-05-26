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
          // console.log("Génération du snapshot initial...");
          // const success = await updateCurrentSnapshot(database);
          await updateCurrentSnapshot(database);
          // if (success) {
          //   console.log("Snapshot initial généré avec succès");
          // } else {
          //   console.log("Snapshot initial non généré - vérifiez s'il existe déjà des données valides");
          // }
        } catch (error) {
          console.error("Erreur lors de la génération du snapshot initial:", error);
        }
      }
    };
    
    initializeSnapshot();
  }, [database, loadingData]);
  
  // Styles spécifiques au contenu
  const style_1 = {
    marginLeft: "5%",
    width: "95%",
    maxWidth: "95%",
    minWidth: "95%",
  };
  const style_2 = {
    width: "98%",
    marginLeft: "1.5%",
  };

  if (loadingData) {
    return (
      <PageLoading />
    );
  };

  // Rendu conditionnel selon l'action sélectionnée dans le sidebar
  if (isAddStudentActive) {
    return (
      <div style={style_1}>
        <div style={style_2}>
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
      <div style={style_1}>
        <div style={style_2}>
          <ManageClasses
            setIsManageClassesActive={setIsManageClassesActive}
            app_bg_color={app_bg_color}
            text_color={text_color}
            theme={theme}
          />
        </div>
      </div>
    );
  } else if (showEnrollmentStats) {
    return (
      <div style={{...style_1, marginTop: "5%"}}>
        <div style={style_2}>
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
      <div
        style={{
          overflow: "hidden",
          marginTop: "4%",
          marginLeft: "6%",
          width: "94%",
          maxWidth: "94%",
          minWidth: "94%",
          height: "92vh",
        }}
      > 
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            minWidth: "100%",
            height: "100%",
            overflow: "hidden",
          }}
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
