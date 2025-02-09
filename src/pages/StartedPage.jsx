import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useTheme } from "../components/contexts";

import SideBar from "../components/SideBar.jsx";
import ColorsSelector from "../components/ColorsSelector.jsx";
import Popup from "../components/Popup.jsx";
import Navbar from "../components/NavBar.jsx";


const StartedPage = () => {

	const [isOpenPopup, setIsOpenPopup] = useState(false);
	const [school_name, setSchool_name] = useState("S");

	const { app_bg_color, text_color } = useTheme();

	const navigate = useNavigate();

	useEffect(() => {
		window.electron.getDatabase().then((data) => {
			if (data.name === undefined) { navigate("/"); }
			setSchool_name(data.name);
			// console.log(data.version);
		});
	}, []);

	const OpenThePopup = () => {
		// console.log(isOpenPopup);
		const popup_bool = isOpenPopup === true ? false : isOpenPopup === false ? true : false;
		setIsOpenPopup(popup_bool);
	};

	return (
		<div
			className={`${app_bg_color} transition-all duration-500`}
		>

			{/* La Navbar s'affiche en haut du contenu restant */}
			<Navbar />

			<SideBar
				setIsOpenPopup={setIsOpenPopup}
				school_name={school_name}
				text_color={text_color}
			/>

			{/* Zone de contenu principale */}
			<div style={{ marginLeft: "250px", padding: "1rem" }}>
				{/* Vos autres composants ou contenu */}
				<h1 className="text-2xl">Bienvenue dans l'application !</h1>
			</div>

			<Popup
				isOpenPopup={isOpenPopup}
				setIsOpenPopup={setIsOpenPopup}
				children={
					<ColorsSelector OpenThePopup={OpenThePopup} />
				}
			/>

		</div>
	);
};


export default StartedPage;