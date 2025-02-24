import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

import { useTheme, useLanguage } from "../components/contexts";
import SideBar from "../components/SideBar.jsx";
import FloatingMenu from "../components/MenuFloatting.jsx";
import ColorsSelector from "../components/ColorsSelector.jsx";
import Popup from "../components/Popup.jsx";
import Navbar from "../components/NavBar.jsx";
import StudentsTable from "../components/StudentsTable.jsx";
import AppParameters from "../components/AppParameters.jsx";

const StartedPage = () => {
	const [isOpenPopup, setIsOpenPopup] = useState(false);
	const [school_name, setSchool_name] = useState("S");
	const [students, setStudents] = useState([]);
	const [database, setDatabase] = useState(null);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [isClassesOpen, setIsClassesOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(null);

	const [isShowParameters, setIsShowParameters] = useState(false);
	const [isShowBgColorSelector, setisShowBgColorSelector] = useState(false);
	const [activeSideBarBtn, setActiveSideBarBtn] = useState(1);

	const dropdownRef = useRef(null);

	const { app_bg_color, text_color, theme } = useTheme();
	const { language } = useLanguage();
	const navigate = useNavigate();

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsClassesOpen(false);
			setIsFilterOpen(false);
			setOpenDropdown(null);
			// console.log("clicked !!!");
		}
	};


	useEffect(() => {
		window.electron.getDatabase().then((data) => {
			if (data.name === undefined) {
				navigate("/");
			}
			setSchool_name(data.name);
			setDatabase(data);
			if (data.students !== undefined && data.students !== null) {
				setStudents(data.students);
			}
			// console.log(data.students);
		});

		// Ajoute l'écouteur lors du montage
		document.addEventListener("mousedown", handleClickOutside);
		// Nettoyage lors du démontage
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};

	}, []);

	const OpenThePopup = () => {
		if (isOpenPopup === true) {
			setIsShowParameters(false);
			setisShowBgColorSelector(false);
		}
		setIsOpenPopup(!isOpenPopup);
	};

	return (
		<div className={`${app_bg_color} transition-all duration-500`}>
			<div ref={dropdownRef} />

			{/* Navbar toujours fixée en haut */}
			<Navbar
				isFilterOpen={isFilterOpen}
				setIsFilterOpen={setIsFilterOpen}
				isClassesOpen={isClassesOpen}
				setIsClassesOpen={setIsClassesOpen}
			/>

			{/* Sidebar */}
			<SideBar
				setIsOpenPopup={OpenThePopup}
				setIsShowParameters={setIsShowParameters}
				setisShowBgColorSelector={setisShowBgColorSelector}
				school_name={school_name}
				text_color={text_color}
				activeSideBarBtn={activeSideBarBtn}
				setActiveSideBarBtn={setActiveSideBarBtn}
			/>

			{/* Zone de contenu principale avec hauteur définie et overflow caché pour le scroll global */}
			<div
				style={{
					overflow: "hidden",
					marginTop: "4%",
					marginLeft: "5%",
					width: "95%",
					maxWidth: "95%",
					minWidth: "95%",
					height: "92vh" // Ajustez 80px en fonction de la hauteur de votre Navbar
				}}
			>
				{/* Conteneur scrollable pour le tableau */}
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
						openDropdown={openDropdown}
						setOpenDropdown={setOpenDropdown}
						app_bg_color={app_bg_color}
						text_color={text_color}
						theme={theme}
					/>
				</div>
			</div>

			 <FloatingMenu/> 

			<Popup
				isOpenPopup={isOpenPopup}
				setIsOpenPopup={setIsOpenPopup}
				children={
					isShowParameters === true ?
						<AppParameters />
						:
						isShowBgColorSelector === true ?
							<ColorsSelector OpenThePopup={OpenThePopup} />
							:
							null
				}
			/>
		</div>
	);
};

export default StartedPage;
