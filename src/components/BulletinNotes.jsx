import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RefreshCcw, ChevronDown, X, UserMinus, AlertTriangle, Check } from 'lucide-react';
import { useLanguage, useFlashNotification } from './contexts.js';

const BulletinNotes = ({
    selectedComposition,
    selectedClass,
    db,
    textClass,
    theme,
    getClasseName,
    handleCloseComponent,
    refreshData
}) => {
    const { live_language, language } = useLanguage();
    const { setFlashMessage } = useFlashNotification();
    
    const [bulletin, setBulletin] = useState(null);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeCell, setActiveCell] = useState(null);
    const [activeCoef, setActiveCoef] = useState(null);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    
    // Références pour les menus déroulants
    const dropdownRef = useRef(null);
    const coefDropdownRef = useRef(null);
    
    // Styles conditionnels
    const tableBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const tableHeaderBg = theme === "dark" ? "bg-gray-700" : "bg-blue-50";
    const tableSubHeaderBg = theme === "dark" ? "bg-gray-600" : "bg-blue-100";
    const tableRowHoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-blue-50";
    const tableBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
    const cellBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
    const cellActiveBgColor = theme === "dark" ? "bg-blue-700" : "bg-blue-100";
    const dropdownBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const dropdownHoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-blue-50";
    
    // Générer les options pour les notes
    const wholeNumberOptions = Array.from({ length: 21 }, (_, i) => i);
    const decimalOptions = ["00", "25", "50", "75"];
    
    // Coefficients disponibles
    const coefficients = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
    
    // Récupérer le bulletin et initialiser les données
    useEffect(() => {
        if (!db || !selectedClass || !selectedComposition) return;
        
        setLoading(true);
        
        // Trouver le bulletin correspondant
        const existingBulletin = db.bulletins?.find(
            bulletin => bulletin.compositionId === selectedComposition.id && bulletin.classId === selectedClass
        );
        
        if (existingBulletin) {
            setBulletin(existingBulletin);
            setSubjects(existingBulletin.subjects || []);
            
            // Préparer les données des élèves avec leurs notes
            const studentsWithNotes = existingBulletin.students.map(student => {
                // S'assurer que chaque élève a un objet notes pour chaque matière
                const notes = { ...student.notes };
                
                existingBulletin.subjects.forEach(subject => {
                    if (!notes[subject.name]) {
                        notes[subject.name] = {
                            classe: null,
                            composition: null
                        };
                    }
                });
                
                return {
                    ...student,
                    notes
                };
            });
            
            setStudents(studentsWithNotes);
        }
        
        setLoading(false);
    }, [db, selectedClass, selectedComposition]);
    
    // Fermer les menus déroulants lorsqu'on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveCell(null);
            }
            
            if (coefDropdownRef.current && !coefDropdownRef.current.contains(event.target)) {
                setActiveCoef(null);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Formater une note pour l'affichage
    const formatNote = (note) => {
        if (note === null || note === undefined) return "-";
        
        // Convertir en nombre si c'est une chaîne
        const numericNote = typeof note === 'string' ? parseFloat(note) : note;
        
        // Vérifier si c'est un nombre valide
        if (isNaN(numericNote)) return "-";
        
        // Formater avec 2 décimales
        return numericNote.toFixed(2);
    };
    
    // Calculer la moyenne d'un élève pour une matière
    const calculateSubjectAverage = (studentId, subjectName) => {
        const student = students.find(s => s.id === studentId);
        if (!student || !student.notes[subjectName]) return "-";
        
        const classeNote = student.notes[subjectName].classe;
        const compoNote = student.notes[subjectName].composition;
        
        // Si l'une des notes est manquante, retourner l'autre note
        if (classeNote === null && compoNote !== null) return formatNote(compoNote);
        if (classeNote !== null && compoNote === null) return formatNote(classeNote);
        if (classeNote === null && compoNote === null) return "-";
        
        // Calculer la moyenne (classe compte pour 1/3, composition pour 2/3)
        const average = (classeNote + (compoNote * 2)) / 3;
        return formatNote(average);
    };
    
    // Calculer la moyenne générale d'un élève
    const calculateGeneralAverage = (studentId) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return "-";
        
        let totalPoints = 0;
        let totalCoefficients = 0;
        
        subjects.forEach(subject => {
            const subjectAvg = calculateSubjectAverage(studentId, subject.name);
            if (subjectAvg !== "-") {
                totalPoints += parseFloat(subjectAvg) * subject.coefficient;
                totalCoefficients += subject.coefficient;
            }
        });
        
        if (totalCoefficients === 0) return "-";
        return (totalPoints / totalCoefficients).toFixed(2);
    };
    
    // Mettre à jour une note
    const updateNote = async (studentId, subjectName, noteType, value) => {
        // Trouver l'élève
        const studentIndex = students.findIndex(s => s.id === studentId);
        if (studentIndex === -1) return;
        
        // Créer une copie des élèves
        const updatedStudents = [...students];
        
        // Mettre à jour la note
        if (!updatedStudents[studentIndex].notes[subjectName]) {
            updatedStudents[studentIndex].notes[subjectName] = {
                classe: null,
                composition: null
            };
        }
        
        updatedStudents[studentIndex].notes[subjectName][noteType] = value;
        
        // Mettre à jour l'état
        setStudents(updatedStudents);
        setHasChanges(true);
        
        // Mettre à jour la base de données
        await saveChangesToDatabase(updatedStudents);
    };
    
    // Mettre à jour un coefficient
    const updateCoefficient = async (subjectName, newCoefficient) => {
        // Créer une copie des matières
        const updatedSubjects = subjects.map(subject => 
            subject.name === subjectName 
                ? { ...subject, coefficient: newCoefficient } 
                : subject
        );
        
        // Mettre à jour l'état
        setSubjects(updatedSubjects);
        setHasChanges(true);
        
        // Mettre à jour la base de données
        await saveChangesToDatabase(students, updatedSubjects);
    };
    
    // Sauvegarder les changements dans la base de données
    const saveChangesToDatabase = async (updatedStudents = students, updatedSubjects = subjects) => {
        setSaving(true);
        
        try {
            // Mettre à jour le bulletin
            const updatedBulletins = db.bulletins.map(b => {
                if (b.id === bulletin.id) {
                    return {
                        ...b,
                        students: updatedStudents,
                        subjects: updatedSubjects
                    };
                }
                return b;
            });
            
            // Mettre à jour la base de données
            const updatedDB = { ...db, bulletins: updatedBulletins };
            await window.electron.saveDatabase(updatedDB);
            
            // Mettre à jour le bulletin local
            setBulletin({
                ...bulletin,
                students: updatedStudents,
                subjects: updatedSubjects
            });
            
            setHasChanges(false);
            
            setFlashMessage({
                message: "Les notes ont été enregistrées avec succès !",
                type: "success",
                duration: 3000
            });
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des notes:", error);
            setFlashMessage({
                message: "Une erreur est survenue lors de la sauvegarde des notes.",
                type: "error",
                duration: 5000
            });
        } finally {
            setSaving(false);
        }
    };
    
    // Supprimer un élève du bulletin
    const removeStudentFromBulletin = async (studentId) => {
        try {
            // Filtrer l'élève à supprimer
            const updatedStudents = students.filter(student => student.id !== studentId);
            
            // Mettre à jour la base de données
            await saveChangesToDatabase(updatedStudents);
            
            // Mettre à jour l'état local
            setStudents(updatedStudents);
            setShowRemoveConfirm(null);
            
            setFlashMessage({
                message: "L'élève a été retiré du bulletin avec succès !",
                type: "success",
                duration: 3000
            });
        } catch (error) {
            console.error("Erreur lors de la suppression de l'élève:", error);
            setFlashMessage({
                message: "Une erreur est survenue lors de la suppression de l'élève.",
                type: "error",
                duration: 5000
            });
        }
    };
    
    // Gérer la sélection d'une note entière
    const handleWholeNumberSelect = (studentId, subjectName, noteType, value) => {
        // Si la valeur est 20, on met automatiquement la partie décimale à 0
        if (value === 20) {
            updateNote(studentId, subjectName, noteType, 20);
        } else {
            // Récupérer la partie décimale actuelle
            const student = students.find(s => s.id === studentId);
            const currentNote = student?.notes[subjectName]?.[noteType];
            const decimalPart = currentNote !== null && currentNote !== undefined 
                ? Math.round((currentNote % 1) * 100) / 100 
                : 0;
            
            // Mettre à jour avec la nouvelle partie entière et l'ancienne partie décimale
            updateNote(studentId, subjectName, noteType, value + decimalPart);
        }
        
        // Fermer le menu déroulant
        setActiveCell(null);
    };
    
    // Gérer la sélection d'une partie décimale
    const handleDecimalSelect = (studentId, subjectName, noteType, decimalStr) => {
        // Récupérer la partie entière actuelle
        const student = students.find(s => s.id === studentId);
        const currentNote = student?.notes[subjectName]?.[noteType];
        const wholePart = currentNote !== null && currentNote !== undefined 
            ? Math.floor(currentNote) 
            : 0;
        
        // Convertir la partie décimale en nombre
        const decimalPart = parseInt(decimalStr) / 100;
        
        // Mettre à jour avec la partie entière actuelle et la nouvelle partie décimale
        updateNote(studentId, subjectName, noteType, wholePart + decimalPart);
        
        // Fermer le menu déroulant
        setActiveCell(null);
    };
    
    // Obtenir le nom de la classe
    const className = db?.classes?.find(cls => cls.id === selectedClass)
        ? getClasseName(`${db.classes.find(cls => cls.id === selectedClass).level} ${db.classes.find(cls => cls.id === selectedClass).name}`, language)
        : "";
    
    return (
        <motion.div
            className={`${textClass} w-full`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {/* En-tête */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Saisie des notes pour le bulletin :</h3>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div>
                        <span className="font-medium">Composition :</span> {selectedComposition.label}
                    </div>
                    <div>
                        <span className="font-medium">Classe :</span> {className}
                    </div>
                    <div>
                        <span className="font-medium">Élèves :</span> {students.length}
                    </div>
                </div>
            </div>
            
            {/* Tableau des notes */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <RefreshCcw size={32} className="animate-spin mr-3" />
                    <span className="text-lg">Chargement des données...</span>
                </div>
                        ) : students.length === 0 ? (
                            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg text-yellow-800 dark:text-yellow-200 mb-6">
                                <div className="flex items-center">
                                    <AlertTriangle size={24} className="mr-3" />
                                    <p>Aucun élève n'a été ajouté à ce bulletin. Veuillez d'abord ajouter des élèves.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="inline-block min-w-full align-middle">
                                    <div className="overflow-hidden border rounded-lg shadow-md">
                                        <table className={`min-w-full divide-y ${tableBorderColor}`}>
                                            {/* En-tête des matières */}
                                            <thead className={`${tableHeaderBg}`}>
                                                <tr>
                                                    <th scope="col" className="px-3 py-3 text-left font-semibold w-12">#</th>
                                                    <th scope="col" className="px-3 py-3 text-left font-semibold w-48">Élève</th>
                                                    {subjects.map((subject) => (
                                                        <th 
                                                            key={subject.name} 
                                                            scope="col" 
                                                            colSpan="2" 
                                                            className="px-3 py-3 text-center font-semibold"
                                                        >
                                                            {subject.name}
                                                        </th>
                                                    ))}
                                                    <th scope="col" className="px-3 py-3 text-center font-semibold">Moyenne</th>
                                                    <th scope="col" className="px-3 py-3 text-center font-semibold w-16">Action</th>
                                                </tr>
                                                
                                                {/* Sous-en-tête des coefficients */}
                                                <tr className={`${tableSubHeaderBg}`}>
                                                    <th scope="col" className="px-3 py-2"></th>
                                                    <th scope="col" className="px-3 py-2 text-left font-medium">Nom & Prénom</th>
                                                    {subjects.map((subject) => (
                                                        <React.Fragment key={`coef-${subject.name}`}>
                                                            <th 
                                                                colSpan="2" 
                                                                className="px-3 py-2 text-center font-medium relative"
                                                            >
                                                                <div 
                                                                    className="flex justify-center items-center cursor-pointer"
                                                                    onClick={() => setActiveCoef(subject.name)}
                                                                >
                                                                    Coef. {subject.coefficient}
                                                                    <ChevronDown size={16} className="ml-1" />
                                                                </div>
                                                                
                                                                {/* Menu déroulant pour les coefficients */}
                                                                {activeCoef === subject.name && (
                                                                    <div 
                                                                        ref={coefDropdownRef}
                                                                        className={`absolute z-10 mt-1 w-24 rounded-md shadow-lg ${dropdownBgColor} ring-1 ring-black ring-opacity-5 focus:outline-none`}
                                                                        style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
                                                                    >
                                                                        <div className="py-1 max-h-48 overflow-y-auto">
                                                                            {coefficients.map((coef) => (
                                                                                <button
                                                                                    key={coef}
                                                                                    className={`block w-full text-left px-4 py-2 text-sm ${dropdownHoverBgColor} ${coef === subject.coefficient ? 'bg-blue-100 dark:bg-blue-800' : ''}`}
                                                                                    onClick={() => {
                                                                                        updateCoefficient(subject.name, coef);
                                                                                        setActiveCoef(null);
                                                                                    }}
                                                                                >
                                                                                    {coef}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </th>
                                                        </React.Fragment>
                                                    ))}
                                                    <th scope="col" className="px-3 py-2 text-center font-medium">Générale</th>
                                                    <th scope="col" className="px-3 py-2"></th>
                                                </tr>
                                                
                                                {/* Sous-en-tête des types de notes */}
                                                <tr className={`${tableSubHeaderBg}`}>
                                                    <th scope="col" className="px-3 py-2"></th>
                                                    <th scope="col" className="px-3 py-2"></th>
                                                    {subjects.map((subject) => (
                                                        <React.Fragment key={`type-${subject.name}`}>
                                                            <th scope="col" className="px-3 py-2 text-center text-sm font-medium">N.classe</th>
                                                            <th scope="col" className="px-3 py-2 text-center text-sm font-medium">N.compo</th>
                                                        </React.Fragment>
                                                    ))}
                                                    <th scope="col" className="px-3 py-2"></th>
                                                    <th scope="col" className="px-3 py-2"></th>
                                                </tr>
                                            </thead>
                                            
                                            {/* Corps du tableau */}
                                            <tbody className={`${tableBgColor} divide-y ${tableBorderColor}`}>
                                                {students.map((student, index) => (
                                                    <React.Fragment key={student.id}>
                                                        <tr className={`${tableRowHoverBg}`}>
                                                            <td className="px-3 py-3 whitespace-nowrap text-center">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-3 py-3 whitespace-nowrap">
                                                                <div className="font-medium">{student.fullName || `${student.first_name} ${student.sure_name || ''}`}</div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">{student.last_name}</div>
                                                            </td>
                                                            
                                                            {/* Notes pour chaque matière */}
                                                            {subjects.map((subject) => (
                                                                <React.Fragment key={`notes-${student.id}-${subject.name}`}>
                                                                    {/* Note de classe */}
                                                                    <td className="px-3 py-3 whitespace-nowrap text-center">
                                                                        <div 
                                                                            className={`inline-block px-3 py-1 rounded cursor-pointer ${
                                                                                activeCell === `${student.id}-${subject.name}-classe` 
                                                                                    ? cellActiveBgColor 
                                                                                    : cellBgColor
                                                                            }`}
                                                                            onClick={() => setActiveCell(`${student.id}-${subject.name}-classe`)}
                                                                        >
                                                                            {formatNote(student.notes[subject.name]?.classe)}
                                                                            <ChevronDown size={14} className="inline ml-1" />
                                                                        </div>
                                                                        
                                                                        {/* Menu déroulant pour la note de classe */}
                                                                        {activeCell === `${student.id}-${subject.name}-classe` && (
                                                                            <div 
                                                                                ref={dropdownRef}
                                                                                className={`absolute z-20 mt-1 rounded-md shadow-lg ${dropdownBgColor} ring-1 ring-black ring-opacity-5 focus:outline-none`}
                                                                                style={{ minWidth: '200px' }}
                                                                            >
                                                                                <div className="p-2">
                                                                                    <div className="mb-2">
                                                                                        <p className="text-sm font-medium mb-1">Partie entière</p>
                                                                                        <div className="grid grid-cols-7 gap-1">
                                                                                            {wholeNumberOptions.map((num) => (
                                                                                                <button
                                                                                                    key={num}
                                                                                                    className={`px-2 py-1 text-center rounded ${dropdownHoverBgColor}`}
                                                                                                    onClick={() => handleWholeNumberSelect(student.id, subject.name, 'classe', num)}
                                                                                                >
                                                                                                    {num}
                                                                                                </button>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    <div>
                                                                                        <p className="text-sm font-medium mb-1">Partie décimale</p>
                                                                                        <div className="grid grid-cols-4 gap-1">
                                                                                            {decimalOptions.map((decimal) => (
                                                                                                <button
                                                                                                    key={decimal}
                                                                                                    className={`px-2 py-1 text-center rounded ${dropdownHoverBgColor}`}
                                                                                                    onClick={() => handleDecimalSelect(student.id, subject.name, 'classe', decimal)}
                                                                                                    disabled={student.notes[subject.name]?.classe === 20}
                                                                                                >
                                                                                                    0.{decimal}
                                                                                                </button>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    
                                                                    {/* Note de composition */}
                                                                    <td className="px-3 py-3 whitespace-nowrap text-center">
                                                                        <div 
                                                                            className={`inline-block px-3 py-1 rounded cursor-pointer ${
                                                                                activeCell === `${student.id}-${subject.name}-composition` 
                                                                                    ? cellActiveBgColor 
                                                                                    : cellBgColor
                                                                            }`}
                                                                            onClick={() => setActiveCell(`${student.id}-${subject.name}-composition`)}
                                                                        >
                                                                            {formatNote(student.notes[subject.name]?.composition)}
                                                                            <ChevronDown size={14} className="inline ml-1" />
                                                                        </div>
                                                                        
                                                                        {/* Menu déroulant pour la note de composition */}
                                                                        {activeCell === `${student.id}-${subject.name}-composition` && (
                                                                            <div 
                                                                                ref={dropdownRef}
                                                                                className={`absolute z-20 mt-1 rounded-md shadow-lg ${dropdownBgColor} ring-1 ring-black ring-opacity-5 focus:outline-none`}
                                                                                style={{ minWidth: '200px' }}
                                                                            >
                                                                                <div className="p-2">
                                                                                    <div className="mb-2">
                                                                                        <p className="text-sm font-medium mb-1">Partie entière</p>
                                                                                        <div className="grid grid-cols-7 gap-1">
                                                                                            {wholeNumberOptions.map((num) => (
                                                                                                <button
                                                                                                    key={num}
                                                                                                    className={`px-2 py-1 text-center rounded ${dropdownHoverBgColor}`}
                                                                                                    onClick={() => handleWholeNumberSelect(student.id, subject.name, 'composition', num)}
                                                                                                >
                                                                                                    {num}
                                                                                                </button>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    <div>
                                                                                        <p className="text-sm font-medium mb-1">Partie décimale</p>
                                                                                        <div className="grid grid-cols-4 gap-1">
                                                                                            {decimalOptions.map((decimal) => (
                                                                                                <button
                                                                                                    key={decimal}
                                                                                                    className={`px-2 py-1 text-center rounded ${dropdownHoverBgColor}`}
                                                                                                    onClick={() => handleDecimalSelect(student.id, subject.name, 'composition', decimal)}
                                                                                                    disabled={student.notes[subject.name]?.composition === 20}
                                                                                                >
                                                                                                    0.{decimal}
                                                                                                </button>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </React.Fragment>
                                                            ))}
                                                            
                                                            {/* Moyenne générale */}
                                                            <td className="px-3 py-3 whitespace-nowrap text-center font-medium">
                                                                <div className="bg-blue-50 dark:bg-blue-900 px-3 py-1 rounded">
                                                                    {calculateGeneralAverage(student.id)}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Actions */}
                                                            <td className="px-3 py-3 whitespace-nowrap text-center">
                                                                <button
                                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                                    onClick={() => setShowRemoveConfirm(student.id)}
                                                                    title="Retirer l'élève du bulletin"
                                                                >
                                                                    <UserMinus size={18} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        
                                                        {/* Confirmation de suppression */}
                                                        {showRemoveConfirm === student.id && (
                                                            <tr className="bg-red-50 dark:bg-red-900">
                                                                <td colSpan={subjects.length * 2 + 4} className="px-3 py-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center text-red-700 dark:text-red-300">
                                                                        <AlertTriangle size={18} className="mr-2" />
                                                                            <span>Êtes-vous sûr de vouloir retirer {student.fullName || `${student.first_name} ${student.sure_name || ''}`} du bulletin ?</span>
                                                                        </div>
                                                                        <div className="flex space-x-2">
                                                                            <button
                                                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
                                                                                onClick={() => removeStudentFromBulletin(student.id)}
                                                                            >
                                                                                <Check size={16} className="mr-1" />
                                                                                Confirmer
                                                                            </button>
                                                                            <button
                                                                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center"
                                                                                onClick={() => setShowRemoveConfirm(null)}
                                                                            >
                                                                                <X size={16} className="mr-1" />
                                                                                Annuler
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
            
            {/* Boutons d'action */}
            <div className="flex justify-between mt-6">
                <button
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center"
                    onClick={handleCloseComponent}
                >
                    <X size={18} className="mr-2" />
                    Fermer
                </button>
                
                <div className="flex space-x-3">
                    <button
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
                        onClick={() => refreshData()}
                        disabled={loading || saving}
                    >
                        <RefreshCcw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Actualiser
                    </button>
                    
                    <button
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
                        onClick={() => saveChangesToDatabase()}
                        disabled={!hasChanges || saving}
                    >
                        <Save size={18} className="mr-2" />
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default BulletinNotes;