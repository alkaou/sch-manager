import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useTheme } from "../components/contexts";

import SideBar from "../components/SideBar.jsx";
import ColorsSelector from "../components/ColorsSelector.jsx";
import Popup from "../components/Popup.jsx";


const StartedPage = () => {

	const [isOpenPopup, setIsOpenPopup] = useState(false);
	const [school_name, setSchool_name] = useState("School");

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
			className={`min-h-screen ${app_bg_color} flex items-center justify-center transition-all duration-500`}
		>
			<Popup
				isOpenPopup={isOpenPopup}
				setIsOpenPopup={setIsOpenPopup}
				children={
					<ColorsSelector OpenThePopup={OpenThePopup} />
				}
			/>
			<SideBar
				school_name={school_name}
				text_color={text_color}
			/>
		</div>
	);
};


export default StartedPage;