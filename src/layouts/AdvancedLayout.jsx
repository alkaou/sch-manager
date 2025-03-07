// AdvancedLayout.jsx
import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../components/contexts";
import Navbar from "../components/NavBar.jsx";
import SideBar from "../components/SideBar.jsx";
import Popup from "../components/Popup.jsx";
import FloatingMenu from "../components/MenuFloatting.jsx";
import AppParameters from "../components/AppParameters.jsx";
import ColorsSelector from "../components/ColorsSelector.jsx";

const AdvancedLayout = () => {
  // États et logique communs
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

  // États spécifiques pour certaines actions
  const [isAddStudentActive, setIsAddStudentActive] = useState(false);
  const [isManageClassesActive, setIsManageClassesActive] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsForUpdate, setStudentsForUpdate] = useState([]);

  const dropdownRef = useRef(null);
  const { app_bg_color, text_color, theme } = useTheme();
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsClassesOpen(false);
      setIsFilterOpen(false);
      setOpenDropdown(null);
    }
  };

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
  }, [navigate]);

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

  const OpenThePopup = (closeAddUser = false) => {
    if (isOpenPopup) {
      // setActiveSideBarBtn(1);
      setIsShowParameters(false);
      setisShowBgColorSelector(false);
      if (closeAddUser) {
        setIsAddStudentActive(false);
      }
    }
    setIsOpenPopup(!isOpenPopup);
  };

  return (
    <div className={`${app_bg_color} transition-all duration-500`}>
      <div ref={dropdownRef} />

      {/* Navbar */}
      <Navbar
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        isClassesOpen={isClassesOpen}
        setIsClassesOpen={setIsClassesOpen}
        setIsAddStudentActive={setIsAddStudentActive}
        setIsManageClassesActive={setIsManageClassesActive}
      />

      {/* Sidebar */}
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

      {/* Contenu spécifique rendu via Outlet */}
      <div
        // style={{
        //   marginTop: "4%",
        //   marginLeft: "5%",
        //   width: "95%",
        //   maxWidth: "95%",
        //   minWidth: "95%",
        //   height: "92vh"
        // }}
      >
        <Outlet
          context={{
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
          }}
        />
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
