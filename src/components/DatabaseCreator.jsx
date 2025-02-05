import React, { useContext } from 'react';

import TextInput from './TextInput.jsx';
import { ThemeContext } from "./contexts";

const useTheme = () => useContext(ThemeContext);

function DatabaseCreator() {

	const { app_bg_color } = useTheme();

	return (
		<div className="flex flex-col justify-center items-center w-full gap-4">
			{/* Conteneur pour le champ de texte */}
			<div className="w-64">
				<TextInput />
			</div>

			{/* Bouton stylisé avec animation */}
			<button className={`px-6 py-2 ${app_bg_color} text-white border-2 font-medium rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105 active:scale-95`}>
				Create Now
			</button>
		</div>
	);
};

export default DatabaseCreator;