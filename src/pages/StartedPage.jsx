import React, { useEffect } from "react";
import { useNavigate } from "react-router";

import { useTheme } from "../components/contexts";

import SideBar from "../components/SideBar.jsx";


const StartedPage = () => {

	const { theme } = useTheme();

	const navigate = useNavigate();

	useEffect(() => {
		window.electron.getDatabase().then((data) => {
			if (data.name === undefined) { navigate("/"); }
			// console.log(data.name);
			// console.log(data.version);
		});
	}, []);

	return (
		<div
			className={`min-h-screen flex items-center justify-center transition-all duration-500 ${theme === "light" ? "bg-gray-100 text-gray-800" : "bg-gray-900 text-white"
				}`}
		>
			<SideBar />
		</div>
	);
};


export default StartedPage;