import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash, Check, X, Save } from 'lucide-react';
import secureLocalStorage from "react-secure-storage";
import { useLanguage, useFlashNotification } from "./contexts.js";
import { gradients } from '../utils/colors.js';

const CreateBulletin = ({
    selectedComposition,
    selectedClass,
    language,
    db,
    textClass,
    app_bg_color,
    theme,
    getClasseName,
    handleCloseComponent,
    refreshData
}) => {
    const [subjects, setSubjects] = useState({
        "Premier cycle": [],
        "Second cycle": [],
        "Lycée": [],
        "Professionnel": [],
        "Personnalisé": []
    });
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [activeSection, setActiveSection] = useState(null);
    const [customSubject, setCustomSubject] = useState({ name: '', coefficient: 1 });
    const [customSubjectError, setCustomSubjectError] = useState('');
    const [deleteMode, setDeleteMode] = useState(false);
    const [subjectsToDelete, setSubjectsToDelete] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { live_language } = useLanguage();
    const { setFlashMessage } = useFlashNotification();

    // Définir les coefficients disponibles
    const coefficients = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20];

    // Fonction existante pour déterminer le niveau de la classe
    const getClassLevel = () => {
        const classObj = db?.classes?.find(cls => cls.id === selectedClass);
        if (!classObj) return null;
        const levelRaw = classObj.level;
        const numericLevel = parseInt(levelRaw, 10);
        if (!isNaN(numericLevel)) {
            if ([1, 2, 3, 4].includes(numericLevel) && selectedComposition.helper === "Trim") {
                return "Professionnel";
            }
            if (numericLevel < 7) {
                return "Premier cycle";
            }
            if ([7, 8, 9].includes(numericLevel)) {
                return "Second cycle";
            }
            if ([10, 11, 12].includes(numericLevel)) {
                return "Lycée";
            }
        }
        const level = String(levelRaw).toLowerCase();
        if (level.includes('1ère année') || level.includes('2ème année') ||
            level.includes('3ème année') || level.includes('4ème année') ||
            level.includes('5ème année') || level.includes('6ème année')) {
            return "Premier cycle";
        } else if (level.includes('7ème année') || level.includes('8ème année') ||
            level.includes('9ème année') || level.includes('10ème année')) {
            return "Second cycle";
        } else if (level.includes('11ème année') || level.includes('12ème année') ||
            level.includes('terminale')) {
            return "Lycée";
        } else if (level.includes('pro') || level.includes('bts') ||
            level.includes('cap') || level.includes('bep')) {
            return "Professionnel";
        }
        return "Premier cycle";
    };

    // Fonction modifiée pour définir les sections autorisées en fonction du niveau
    const getAuthorizedSections = () => {
        const classObj = db?.classes?.find(cls => cls.id === selectedClass);
        if (!classObj) return [];
        const numericLevel = parseInt(classObj.level, 10);
        if (!isNaN(numericLevel)) {
            if (numericLevel < 7) {
                return ["Premier cycle", "Personnalisé", "Professionnel"];
            }
            if ([7, 8, 9].includes(numericLevel)) {
                return ["Second cycle", "Personnalisé"];
            }
            if ([10, 11, 12].includes(numericLevel)) {
                return ["Lycée", "Professionnel", "Personnalisé"];
            }
        }
        return ["Premier cycle", "Personnalisé", "Professionnel"];
    };

    // Initialiser les matières par défaut
    useEffect(() => {
        const defaultSubjects = {
            "Premier cycle": [
                { name: "Anglais", coefficient: 1 },
                { name: "Chant", coefficient: 1 },
                { name: "Dictée & Question", coefficient: 2 },
                { name: "Dessin", coefficient: 1 },
                { name: "ECM", coefficient: 1 },
                { name: "EPS", coefficient: 1 },
                { name: "Écriture", coefficient: 1 },
                { name: "Histoire-Géo", coefficient: 2 },
                { name: "Informatique", coefficient: 1 },
                { name: "Mathématique", coefficient: 3 },
                { name: "Question de cours", coefficient: 2 },
                { name: "Rédaction", coefficient: 3 },
                { name: "Récitation", coefficient: 1 },
                { name: "Science d'observation", coefficient: 2 },
                { name: "Science naturelle", coefficient: 2 },
                { name: "Technologie", coefficient: 1 }
            ],
            "Second cycle": [
                { name: "Rédaction", coefficient: 3 },
                { name: "Mathématique", coefficient: 3 },
                { name: "Biologie", coefficient: 2 },
                { name: "Anglais", coefficient: 2 },
                { name: "Dictée & Question", coefficient: 3 },
                { name: "Physique", coefficient: 1.5 },
                { name: "Chimie", coefficient: 1.5 },
                { name: "Histoire-Géo", coefficient: 2 },
                { name: "ECM", coefficient: 1 },
                { name: "EPS", coefficient: 1 },
                { name: "Dessin", coefficient: 1 },
                { name: "Musique", coefficient: 1 },
                { name: "Lecture", coefficient: 1 },
                { name: "Récitation", coefficient: 1 },
            ],
            "Lycée": [
                { name: "Art", coefficient: 3 },
                { name: "Droit", coefficient: 3 },
                { name: "ECM", coefficient: 3 },
                { name: "Économie", coefficient: 3 },
                { name: "Français", coefficient: 3 },
                { name: "Géologie", coefficient: 3 },
                { name: "Langue nationale", coefficient: 3 },
                { name: "LVI", coefficient: 3 },
                { name: "LVII", coefficient: 3 },
                { name: "Mathématique", coefficient: 3 },
                { name: "Statistique", coefficient: 3 },
                { name: "SVT", coefficient: 3 }
            ],
            "Professionnel": [
                { name: "Art", coefficient: 3 },
                { name: "Comptabilité", coefficient: 3 },
                { name: "Droit", coefficient: 3 },
                { name: "ECM", coefficient: 3 },
                { name: "Économie", coefficient: 3 },
                { name: "Langue nationale", coefficient: 3 },
                { name: "LVI", coefficient: 3 },
                { name: "LVII", coefficient: 3 },
                { name: "Mathématique Financière", coefficient: 3 },
                { name: "Mathématique Générale", coefficient: 3 },
                { name: "Statistique", coefficient: 3 }
            ],
            "Personnalisé": []
        };


        const savedCustomSubjects = secureLocalStorage.getItem("customSubjects");
        if (savedCustomSubjects) {
            defaultSubjects["Personnalisé"] = savedCustomSubjects;
        }

        setSubjects(defaultSubjects);

        const authorizedSections = getAuthorizedSections();
        // Par défaut, sélectionner la première section autre que "Personnalisé"
        const defaultSection = authorizedSections.find(s => s !== "Personnalisé") || null;
        setActiveSection(defaultSection);

        const existingBulletin = db?.bulletins?.find(
            bulletin => bulletin.compositionId === selectedComposition.id && bulletin.classId === selectedClass
        );

        if (existingBulletin && existingBulletin.subjects) {
            setSelectedSubjects(existingBulletin.subjects);
        } else {
            setSelectedSubjects([{ name: "Conduite", coefficient: 1 }]);
        }
    }, [db, selectedClass, selectedComposition]);

    const handleSubjectSelection = (subject, isChecked) => {
        if (isChecked) {
            if (!selectedSubjects.some(s => s.name === subject.name)) {
                if (activeSection === null || activeSection === "Personnalisé") {
                    setActiveSection(getClassLevel());
                }
                setSelectedSubjects([...selectedSubjects, subject]);
            }
        } else {
            setSelectedSubjects(selectedSubjects.filter(s => s.name !== subject.name));
            if (selectedSubjects.length <= 1) {
                setActiveSection(null);
            }
        }
    };

    const isSubjectSelected = (subjectName) => {
        return selectedSubjects.some(s => s.name === subjectName);
    };

    const handleSelectAllInSection = (section, isChecked) => {
        if (isChecked) {
            const newSubjects = subjects[section].filter(subject =>
                !selectedSubjects.some(s => s.name === subject.name)
            );
            setSelectedSubjects([...selectedSubjects, ...newSubjects]);
            setActiveSection(section);
        } else {
            setSelectedSubjects(selectedSubjects.filter(subject =>
                !subjects[section].some(s => s.name === subject.name) || subject.name === "Conduite"
            ));
            if (selectedSubjects.length <= 1) {
                setActiveSection(null);
            }
        }
    };

    const areAllSubjectsSelectedInSection = (section) => {
        return subjects[section].every(subject => isSubjectSelected(subject.name));
    };

    const handleAddCustomSubject = () => {
        if (customSubject.name.length < 2 || customSubject.name.length > 30) {
            setCustomSubjectError("Le nom de la matière doit contenir entre 2 et 30 caractères.");
            return;
        }

        if (selectedSubjects.some(s => s.name.toLowerCase() === customSubject.name.toLowerCase())) {
            setCustomSubjectError("Cette matière existe déjà dans la liste.");
            return;
        }

        const newCustomSubject = { ...customSubject };
        const updatedCustomSubjects = [...subjects["Personnalisé"], newCustomSubject];
        setSubjects({
            ...subjects,
            "Personnalisé": updatedCustomSubjects
        });
        secureLocalStorage.setItem("customSubjects", updatedCustomSubjects);
        setCustomSubject({ name: '', coefficient: 1 });
        setCustomSubjectError('');
    };

    const handleDeleteCustomSubjects = () => {
        if (subjectsToDelete.length === 0) {
            setDeleteMode(false);
            return;
        }
        const updatedCustomSubjects = subjects["Personnalisé"].filter(
            subject => !subjectsToDelete.includes(subject.name)
        );
        setSubjects({
            ...subjects,
            "Personnalisé": updatedCustomSubjects
        });
        setSelectedSubjects(selectedSubjects.filter(
            subject => !subjectsToDelete.includes(subject.name)
        ));
        secureLocalStorage.setItem("customSubjects", updatedCustomSubjects);
        setSubjectsToDelete([]);
        setDeleteMode(false);
    };

    const handleToggleDeleteSubject = (subjectName) => {
        if (subjectsToDelete.includes(subjectName)) {
            setSubjectsToDelete(subjectsToDelete.filter(name => name !== subjectName));
        } else {
            setSubjectsToDelete([...subjectsToDelete, subjectName]);
        }
    };

    const handleSaveBulletin = async () => {
        const uniqueNames = new Set(selectedSubjects.map(s => s.name.toLowerCase()));
        if (uniqueNames.size !== selectedSubjects.length) {
            setError("Le bulletin ne peut pas contenir de matières dupliquées.");
            return;
        }
        if (selectedSubjects.length < 2) {
            setError("Veuillez sélectionner au moins une matière en plus de 'Conduite'.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const existingBulletinIndex = db.bulletins.findIndex(
                bulletin => bulletin.compositionId === selectedComposition.id && bulletin.classId === selectedClass
            );
            const bulletinData = {
                id: existingBulletinIndex >= 0 ? db.bulletins[existingBulletinIndex].id : Date.now().toString(),
                compositionId: selectedComposition.id,
                classId: selectedClass,
                isLocked: false,
                subjects: selectedSubjects,
                students: existingBulletinIndex >= 0 ? db.bulletins[existingBulletinIndex].students || [] : []
            };
            let updatedBulletins;
            if (existingBulletinIndex >= 0) {
                updatedBulletins = [...db.bulletins];
                updatedBulletins[existingBulletinIndex] = bulletinData;
            } else {
                updatedBulletins = [...db.bulletins, bulletinData];
            }
            const updatedDB = { ...db, bulletins: updatedBulletins };
            await window.electron.saveDatabase(updatedDB);
            refreshData();
            handleCloseComponent();
            setFlashMessage({
                message: "Bulletin sauvegardé avec succès !",
                type: "success",
                duration: 5000,
            });
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du bulletin:", error);
            setError("Une erreur est survenue lors de la sauvegarde du bulletin.");
        } finally {
            setLoading(false);
        }
    };

    const className = db?.classes?.find(cls => cls.id === selectedClass)
        ? getClasseName(`${db.classes.find(cls => cls.id === selectedClass).level} ${db.classes.find(cls => cls.id === selectedClass).name}`, language)
        : "";

    const authorizedSections = getAuthorizedSections();

    const inputBgColor = theme === "dark" || app_bg_color === gradients[1] || 
                app_bg_color === gradients[2] ? `${app_bg_color} ${textClass} bg-opacity-50` : 
                "bg-gray-700 text-white bg-opacity-70"
    

    return (
        <div className={`${textClass}`}>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Configuration du bulletin pour :</h3>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div>
                        <span className="font-medium">Composition :</span> {selectedComposition.label}
                    </div>
                    <div>
                        <span className="font-medium">Classe :</span> {className}
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Matières sélectionnées :</h3>
                {selectedSubjects.length <= 1 ? (
                    <p className="italic text-yellow-600">Aucune matière sélectionnée en plus de "Conduite"</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {selectedSubjects.map((subject) => (
                            <div key={subject.name} className="flex items-center justify-between p-2 border rounded">
                                <span>{subject.name}</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                    Coef. {subject.coefficient}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Sélection des matières :</h3>
                <div className="space-y-4">
                    {authorizedSections.filter(section => section !== "Personnalisé").map((section) => (
                        <div key={section} className="border rounded p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-lg">{section}</h4>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={areAllSubjectsSelectedInSection(section)}
                                        onChange={(e) => handleSelectAllInSection(section, e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span>Tout sélectionner</span>
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {subjects[section].map((subject) => (
                                    <div
                                        key={subject.name}
                                        className="flex items-center justify-between p-2 border rounded"
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={isSubjectSelected(subject.name)}
                                                onChange={(e) => handleSubjectSelection(subject, e.target.checked)}
                                                disabled={subject.name === "Conduite"}
                                                className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                                            />
                                            <span>{subject.name}</span>
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                            Coef. {subject.coefficient}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div key="Personnalisé" className="border rounded p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-lg">Personnalisé</h4>
                            <div className="flex space-x-2">
                                {deleteMode ? (
                                    <>
                                        <button
                                            onClick={handleDeleteCustomSubjects}
                                            className="flex items-center space-x-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            <Check size={16} />
                                            <span>Confirmer</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeleteMode(false);
                                                setSubjectsToDelete([]);
                                            }}
                                            className="flex items-center space-x-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                        >
                                            <X size={16} />
                                            <span>Annuler</span>
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setDeleteMode(true)}
                                        className="flex items-center space-x-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        disabled={subjects["Personnalisé"].length === 0}
                                    >
                                        <Trash size={16} />
                                        <span>Supprimer</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        {subjects["Personnalisé"].length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                                {subjects["Personnalisé"].map((subject) => (
                                    <div
                                        key={subject.name}
                                        className={`flex items-center justify-between p-2 border rounded ${deleteMode && subjectsToDelete.includes(subject.name)
                                            ? 'bg-red-100'
                                            : ''
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            {deleteMode ? (
                                                <input
                                                    type="checkbox"
                                                    checked={subjectsToDelete.includes(subject.name)}
                                                    onChange={() => handleToggleDeleteSubject(subject.name)}
                                                    className="form-checkbox h-5 w-5 text-red-600 mr-2"
                                                />
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    checked={isSubjectSelected(subject.name)}
                                                    onChange={(e) => handleSubjectSelection(subject, e.target.checked)}
                                                    disabled={subject.name === "Conduite"}
                                                    className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                                                />
                                            )}
                                            <span>{subject.name}</span>
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                            Coef. {subject.coefficient}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!deleteMode && (
                            <div className={`p-3 border rounded ${app_bg_color} ${textClass}`}>
                                <h5 className="font-medium mb-2">Ajouter une matière personnalisée</h5>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="flex-grow">
                                        <input
                                            type="text"
                                            value={customSubject.name}
                                            onChange={(e) => setCustomSubject({ ...customSubject, name: e.target.value })}
                                            placeholder="Nom de la matière"
                                            className={`${inputBgColor} w-full px-3 py-2 border rounded`}
                                        />
                                    </div>
                                    <div>
                                        <select
                                            value={customSubject.coefficient}
                                            onChange={(e) => setCustomSubject({ ...customSubject, coefficient: parseFloat(e.target.value) })}
                                            className={`${inputBgColor} w-full px-3 py-2 border rounded bg-opacity-50`}
                                        >
                                            {coefficients.map((coef) => (
                                                <option key={coef} value={coef}>Coef. {coef}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <button
                                            onClick={handleAddCustomSubject}
                                            className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
                                        >
                                            <Plus size={16} className="mr-1" />
                                            Ajouter
                                        </button>
                                    </div>
                                </div>
                                {customSubjectError && (
                                    <p className="text-red-600 text-sm mt-1">{customSubjectError}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <motion.button
                    onClick={handleSaveBulletin}
                    disabled={loading || selectedSubjects.length < 2}
                    className={`flex items-center space-x-2 px-4 py-2 rounded text-white ${selectedSubjects.length < 2
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    whileHover={{ scale: selectedSubjects.length < 2 ? 1 : 1.05 }}
                    whileTap={{ scale: selectedSubjects.length < 2 ? 1 : 0.95 }}
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <Save size={20} />
                    )}
                    <span>Sauvegarder le bulletin</span>
                </motion.button>
            </div>
        </div>
    );
};

export default CreateBulletin;
