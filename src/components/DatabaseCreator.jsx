import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from 'framer-motion';
import { BsCheckCircleFill, BsDatabaseAdd } from 'react-icons/bs';
import { FaSchool, FaMapMarkerAlt, FaBookOpen } from 'react-icons/fa';
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from 'react-icons/hi';

import TextInput from './TextInput.jsx';
import { useLanguage as useLang, useTheme, usePageLoader, useFlashNotification } from "./contexts";
import Error from './Error.jsx';
import { getFormattedDateTime, getDateTime } from '../utils/helpers';

function DatabaseCreator({ setIsOpenPopup }) {
	const [dbName, setDbName] = useState("Compexe-Scolaire-Dembele");
	const [shortName, setShortName] = useState("GSALKD");
	const [academie, setAcademie] = useState("Kati");
	const [zone, setZone] = useState("Kati");
	const [error, setError] = useState("");
	const [currentStep, setCurrentStep] = useState(0);
	const { app_bg_color, text_color, primary_color, secondary_color } = useTheme();
	const { live_language } = useLang();
	const [db, setDb] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	const [progress, setProgress] = useState(0);

	const navigate = useNavigate();
	const { setIsLoading, setTypeLoader, setText } = usePageLoader();
	const { setFlashMessage } = useFlashNotification();

	useEffect(() => {
		window.electron.getDatabase().then((data) => {
			setDb(data);
			if (data.name !== undefined) { navigate("/started_page"); }
		});
	}, []);

	// Effect for progress animation
	useEffect(() => {
		if (isCreating && progress < 100) {
			const timer = setTimeout(() => {
				setProgress(prev => Math.min(prev + 1, 100));
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [isCreating, progress]);

	const changeInputVal = (field, value) => {
		setError("");
		
		switch(field) {
			case 'dbName':
				setDbName(value);
				break;
			case 'shortName':
				setShortName(value);
				break;
			case 'academie':
				setAcademie(value);
				break;
			case 'zone':
				setZone(value);
				break;
			default:
				break;
		}
	}

	const validateStep = () => {
		switch(currentStep) {
			case 0:
				return validateDbName();
			case 1:
				return validateShortName();
			case 2:
				return validateAcademie();
			case 3:
				return validateZone();
			default:
				return true;
		}
	}

	const validateDbName = () => {
		const name = dbName.trim();

		if (!name) {
			setError(live_language.error_empty);
			return false;
		}

		if (name.length < 3) {
			setError(live_language.error_minLength);
			return false;
		}

		if (name.length > 45) {
			setError(live_language.error_maxLength);
			return false;
		}

		const validNameRegex = /^[a-zA-Z0-9-_]+$/;
		if (!validNameRegex.test(name)) {
			setError(live_language.error_invalidChars);
			return false;
		}

		setError("");
		return true;
	}

	const validateShortName = () => {
		const name = shortName.trim();
		
		if (!name) {
			setError(live_language.error_empty);
			return false;
		}

		if (name.length < 2 || name.length > 10) {
			setError(live_language.error_shortname_length);
			return false;
		}

		setError("");
		return true;
	}

	const validateAcademie = () => {
		if (!academie.trim()) {
			setError(live_language.error_academie_empty);
			return false;
		}
		setError("");
		return true;
	}

	const validateZone = () => {
		if (!zone.trim()) {
			setError(live_language.error_zone_empty);
			return false;
		}
		setError("");
		return true;
	}

	const nextStep = () => {
		if (validateStep()) {
			if (currentStep < 3) {
				setCurrentStep(currentStep + 1);
			} else {
				createNewDatabase();
			}
		}
	}

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	}

	const createNewDatabase = () => {
		setIsCreating(true);
		setProgress(0);
		
		const created_hour = getFormattedDateTime();
		const created_date = getDateTime();

		const date = created_date.dateTime;
		const hour = created_hour.formattedTime;

		const updatedDb = {
			...db,
			name: dbName.trim(),
			short_name: shortName.trim(),
			academie: academie.trim(),
			zone: zone.trim(),
			version: "1.0.0",
			created_at: date,
			created_time: hour,
			updated_at: date,
			updated_time: hour
		};

		window.electron.saveDatabase(updatedDb).then(() => {
			setText(live_language.creating_db_message);
			setTypeLoader(2);
			setIsLoading(true);

			setTimeout(() => {
				setText(live_language.loading_patient_message);

				setTimeout(() => {
					setText(live_language.created_db_message);

					setTimeout(() => {
						setIsOpenPopup(false);
						setIsLoading(false);
						setText("");
						setTypeLoader(0);
						setFlashMessage({
							message: `${live_language.database_created_success} ${dbName}`,
							type: "success",
							duration: 5000,
						});
						navigate("/started_page");
					}, 5000);

				}, 5000);

			}, 5000);
		});
	};

	const stepIcons = [
		<BsDatabaseAdd size={24} />,
		<FaBookOpen size={24} />,
		<FaSchool size={24} />,
		<FaMapMarkerAlt size={24} />
	];

	const stepLabels = [
		live_language.db_name,
		live_language.short_name,
		live_language.academie,
		live_language.zone
	];

	const renderStepContent = () => {
		switch(currentStep) {
			case 0:
				return (
					<TextInput
						name={live_language.create_input_info_text}
						type='text'
						value={dbName}
						setValue={(e) => changeInputVal('dbName', e.target.value)}
						icon={<BsDatabaseAdd className="text-gray-500" />}
					/>
				);
			case 1:
				return (
					<TextInput
						name={live_language.short_name}
						type='text'
						value={shortName}
						setValue={(e) => changeInputVal('shortName', e.target.value)}
						icon={<FaBookOpen className="text-gray-500" />}
					/>
				);
			case 2:
				return (
					<TextInput
						name={live_language.academie}
						type='text'
						value={academie}
						setValue={(e) => changeInputVal('academie', e.target.value)}
						icon={<FaSchool className="text-gray-500" />}
					/>
				);
			case 3:
				return (
					<TextInput
						name={live_language.zone}
						type='text'
						value={zone}
						setValue={(e) => changeInputVal('zone', e.target.value)}
						icon={<FaMapMarkerAlt className="text-gray-500" />}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div />
	);
};

export default DatabaseCreator;