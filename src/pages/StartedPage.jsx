import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useTheme, useLanguage } from "../components/contexts";
import SideBar from "../components/SideBar.jsx";
import ColorsSelector from "../components/ColorsSelector.jsx";
import Popup from "../components/Popup.jsx";
import Navbar from "../components/NavBar.jsx";
import StudentsTable from "../components/StudentsTable.jsx";

const StartedPage = () => {
	const [isOpenPopup, setIsOpenPopup] = useState(false);
	const [school_name, setSchool_name] = useState("S");
	const [students, setStudents] = useState([]);
	const [database, setDatabase] = useState(null);

	const { app_bg_color, text_color } = useTheme();
	const { language } = useLanguage();
	const navigate = useNavigate();

	useEffect(() => {
		window.electron.getDatabase().then((data) => {
			if (data.name === undefined) {
				navigate("/");
			}
			setSchool_name(data.name);
			setDatabase(data);
			setStudents(data.students);
		});
	}, []);

	const OpenThePopup = () => {
		setIsOpenPopup(!isOpenPopup);
	};

	return (
		<div className={`${app_bg_color} transition-all duration-500`}>

			{/* Navbar toujours fixée en haut */}
			<Navbar />

			{/* Sidebar */}
			<SideBar
				setIsOpenPopup={setIsOpenPopup}
				school_name={school_name}
				text_color={text_color}
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
					}}
				>
					<StudentsTable students={students} />
				</div>
			</div>

			<Popup
				isOpenPopup={isOpenPopup}
				setIsOpenPopup={setIsOpenPopup}
				children={<ColorsSelector OpenThePopup={OpenThePopup} />}
			/>
		</div>
	);
};

export default StartedPage;
