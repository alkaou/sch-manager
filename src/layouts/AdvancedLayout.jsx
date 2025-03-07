import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../components/contexts";
import Navbar from "../components/NavBar.jsx";
import SideBar from "../components/SideBar.jsx";
import Popup from "../components/Popup.jsx";
import FloatingMenu from "../components/MenuFloatting.jsx";
import AppParameters from "../components/AppParameters.jsx";
import ColorsSelector from "../components/ColorsSelector.jsx";

const AdvancedLayout = ({ children }) => {
  // États communs pour toute l’interface avancée
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [school_name, setSchool_name] = useState("S");
  const [school_short_name, setSchool_short_name] = useState("GSAD");
  const [database, setDatabase] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClassesOpen, setIsClassesOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isShowParameters, setIsShowParameters] = useState(false);
  const [isShowBgColorSelector, setisShowBgColorSelector] = useState(false);
  const [activeSideBarBtn, setActiveSideBarBtn] = useState(1);

  // États spécifiques à certaines actions (ex: affichage de formulaires)
  const [isAddStudentActive, setIsAddStudentActive] = useState(false);
  const [isManageClassesActive, setIsManageClassesActive] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsForUpdate, setStudentsForUpdate] = useState([]);

  const dropdownRef = useRef(null);
  const { app_bg_color, text_color, theme } = useTheme();
  const navigate = useNavigate();

  // Gestion du clic en dehors des dropdowns
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsClassesOpen(false);
      setIsFilterOpen(false);
      setOpenDropdown(null);
    }
  };

  // Récupération des données de la BDD et initialisation
  useEffect(() => {
    window.electron.getDatabase().then((data) => {
      if (data.name === undefined) {
        navigate("/");
      }
      setSchool_name(data.name);
      setSchool_short_name(data.short_name);
      setDatabase(data);
      if (data.students !== undefined && data.students !== null) {
        setStudents(data.students);
      }
    });

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const refreshData = () => {
    window.electron.getDatabase().then((data) => {
      setSchool_name(data.name);
      setSchool_short_name(data.short_name);
      setDatabase(data);
      if (data.students !== undefined && data.students !== null) {
        setStudents(data.students);
      }
    });
  };

  // Fonction pour ouvrir/fermer le popup en gérant certains états
  const OpenThePopup = (closeAddUser = false) => {
    if (isOpenPopup) {
      setActiveSideBarBtn(1);
      setIsShowParameters(false);
      setisShowBgColorSelector(false);
      if (closeAddUser) {
        setIsAddStudentActive(false);
      }
    }
    setIsOpenPopup(!isOpenPopup);
  };

  // Injection des états et fonctions communs dans le composant enfant via cloneElement
  const childrenWithProps = React.cloneElement(children, {
    isAddStudentActive,
    setIsAddStudentActive,
    isManageClassesActive,
    setIsManageClassesActive,
    students,
    setStudents,
    studentsForUpdate,
    setStudentsForUpdate,
    refreshData,
    database,
    isFilterOpen,
    setIsFilterOpen,
    isClassesOpen,
    setIsClassesOpen,
    openDropdown,
    setOpenDropdown,
    app_bg_color,
    text_color,
    theme,
    OpenThePopup
  });

  return (
    <div className={`${app_bg_color} transition-all duration-500`}>
      <div ref={dropdownRef} />
      
      {/* Navbar toujours visible */}
      <Navbar
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        isClassesOpen={isClassesOpen}
        setIsClassesOpen={setIsClassesOpen}
        setIsAddStudentActive={setIsAddStudentActive}
        setIsManageClassesActive={setIsManageClassesActive}
      />

      {/* Sidebar personnalisé */}
      <SideBar
        setIsOpenPopup={OpenThePopup}
        setIsShowParameters={setIsShowParameters}
        setisShowBgColorSelector={setisShowBgColorSelector}
        school_name={school_name}
        school_short_name={school_short_name || "GSAD"}
        text_color={text_color}
        activeSideBarBtn={activeSideBarBtn}
        setActiveSideBarBtn={setActiveSideBarBtn}
        db={database}
        refreshData={refreshData}
      />

      {/* Zone de contenu principal (sera rempli par la page enfant) */}
      <div
        // style={{
        //   marginTop: "4%",
        //   marginLeft: "5%",
        //   width: "95%",
        //   maxWidth: "95%",
        //   minWidth: "95%",
        //   height: "92vh" // hauteur ajustée en fonction de la Navbar
        // }}
      >
        {childrenWithProps}
      </div>

      <FloatingMenu />

      <Popup
        isOpenPopup={isOpenPopup}
        setIsOpenPopup={setIsOpenPopup}
        btnActiveVal={1}
        setActiveSideBarBtn={setActiveSideBarBtn}
      >
        {isShowParameters ? (
          <AppParameters />
        ) : isShowBgColorSelector ? (
          <ColorsSelector OpenThePopup={OpenThePopup} />
        ) : null}
      </Popup>
    </div>
  );
};

export default AdvancedLayout;
