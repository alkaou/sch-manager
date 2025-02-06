import React, { useEffect, useContext, useState } from 'react';

import TextInput from './TextInput.jsx';
import { ThemeContext, LanguageContext } from "./contexts";
import Error from './Error.jsx';
import { getFormattedDateTime } from '../utils/helpers.js';

const useTheme = () => useContext(ThemeContext);
const useLang = () => useContext(LanguageContext);

function DatabaseCreator({setIsOpenPopup}) {
	const [dbName, setDbName] = useState("Compexe-Scolaire-Dembele");
	const [error, setError] = useState("");
	const { app_bg_color } = useTheme();
	const { live_language } = useLang();
	const [db, setDb] = useState(null);

	useEffect(() => {
		window.electron.getDatabase().then((data) => {
			setDb(data);
		});
	}, []);

	const changeInputVal = (e) => {
		// console.log(e.target.value);
		setError("");
		setDbName(e.target.value);
	}

	const createNewDatabase = () => {
		const name = dbName.trim();

		// Vérification : Champ vide
		if (!name) {
			setError(live_language.error_empty);
			return;
		}

		// Vérification : Longueur minimale
		if (name.length < 3) {
			setError(live_language.error_minLength);
			return;
		}

		// Vérification : Longueur maximale
		if (name.length > 30) {
			setError(live_language.error_maxLength);
			return;
		}

		// Vérification : Caractères invalides (uniquement lettres, chiffres, - et _)
		const validNameRegex = /^[a-zA-Z0-9-_]+$/;
		if (!validNameRegex.test(name)) {
			setError(live_language.error_invalidChars);
			return;
		}

		// Si tout est valide, suppression de l'erreur et exécution de la création
		setError("");

		const {date, hour} = getFormattedDateTime();

		const updatedDb = {
			...db, 
			name: name,
			version: "1.0.0",
			created_at: date,
			created_time: hour,
		 }; // Modifie tes données ici

		window.electron.saveDatabase(updatedDb).then(() => {
			setIsOpenPopup(false);
			// alert('Database saved!');
			// console.log("✅ Base de données créée avec succès :", name);
			// console.log(db);
		});
	};


	return (
		<div className="flex flex-col justify-center items-center w-full gap-4">
			{/* Conteneur pour le champ de texte */}
			<div className="w-64">
				<TextInput
					name={live_language.create_input_info_text}
					type='text'
					value={dbName}
					setValue={changeInputVal}
				/>
			</div>

			<div>
				{error.length >= 1 ? <Error text={error} /> : null}
			</div>

			{/* Bouton stylisé avec animation */}
			<button
				className={`px-6 py-2 ${app_bg_color} text-white border-2 font-medium rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105 active:scale-95`}
				onClick={createNewDatabase}
			>
				{live_language.create_btn_text_2}
			</button>
		</div>
	);
};

export default DatabaseCreator;