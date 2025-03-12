import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Save, RefreshCcw, Search, CheckSquare, Square } from 'lucide-react';
import { useLanguage, useFlashNotification } from './contexts.js';

const GetBulletinStudents = ({
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
    
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [bulletin, setBulletin] = useState(null);
    
    // Styles conditionnels
    const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
    const tableBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const tableHeaderBg = theme === "dark" ? "bg-gray-700" : "bg-blue-50";
    const tableRowHoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-blue-50";
    const tableBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
    const checkboxBgColor = theme === "dark" ? "bg-gray-600" : "bg-white";
    const whileHoverbackgroundColor = theme === "dark" ? "rgba(55, 65, 81, 0.7)" : "rgba(239, 246, 255, 0.7)";
    
    // Récupérer les élèves de la classe sélectionnée
    useEffect(() => {
        if (!db || !selectedClass) return;
        
        setLoading(true);
        
        // Trouver la classe dans la base de données
        const classObj = db.classes.find(cls => cls.id === selectedClass);
        if (!classObj) {
            setLoading(false);
            return;
        }
        
        // Construire le nom complet de la classe
        const className = `${classObj.level} ${classObj.name}`;
        
        // Filtrer les élèves actifs de cette classe
        const classStudents = db.students
            .filter(student => student.classe === className && student.status === "actif")
            .map(student => ({
                ...student,
                fullName: `${student.first_name} ${student.sure_name ? student.sure_name : ''}`.trim(),
                isSelected: false
            }))
            .sort((a, b) => a.last_name.localeCompare(b.last_name)); // Tri alphabétique par nom
        
        setStudents(classStudents);
        setFilteredStudents(classStudents);
        
        // Récupérer le bulletin existant s'il y en a un
        const existingBulletin = db.bulletins?.find(
            bulletin => bulletin.compositionId === selectedComposition.id && bulletin.classId === selectedClass
        );
        
        if (existingBulletin) {
            setBulletin(existingBulletin);
            
            // Marquer les élèves déjà sélectionnés
            if (existingBulletin.students && existingBulletin.students.length > 0) {
                const selectedIds = existingBulletin.students.map(s => s.id);
                setSelectedStudents(selectedIds);
            }
        }
        
        setLoading(false);
    }, [db, selectedClass, selectedComposition]);
    
    // Filtrer les élèves en fonction du terme de recherche
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredStudents(students);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = students.filter(
                student => 
                    student.fullName.toLowerCase().includes(term) || 
                    student.last_name.toLowerCase().includes(term)
            );
            setFilteredStudents(filtered);
        }
    }, [searchTerm, students]);
    
    // Gérer la sélection/désélection de tous les élèves
    const handleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            // Tout désélectionner
            setSelectedStudents([]);
        } else {
            // Tout sélectionner
            setSelectedStudents(filteredStudents.map(student => student.id));
        }
    };
    
    // Gérer la sélection/désélection d'un élève
    const handleSelectStudent = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            // Désélectionner
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        } else {
            // Sélectionner
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };
    
    // Vérifier si tous les élèves sont sélectionnés
    const areAllSelected = filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length;
    
    // Sauvegarder les élèves sélectionnés dans le bulletin
    const handleSaveStudents = async () => {
        setSaving(true);
        
        try {
            // Récupérer les détails complets des élèves sélectionnés
            const studentsDetails = students
                .filter(student => selectedStudents.includes(student.id))
                .map(student => ({
                    id: student.id,
                    first_name: student.first_name,
                    sure_name: student.sure_name || '',
                    last_name: student.last_name,
                    matricule: student.matricule || '',
                    notes: {} // Les notes seront ajoutées ultérieurement
                }));
            
            let updatedBulletins;
            
            if (bulletin) {
                // Mettre à jour un bulletin existant
                updatedBulletins = db.bulletins.map(b => {
                    if (b.id === bulletin.id) {
                        return {
                            ...b,
                            students: studentsDetails
                        };
                    }
                    return b;
                });
            } else {
                // Créer un nouveau bulletin
                const newBulletin = {
                    id: Date.now().toString(),
                    compositionId: selectedComposition.id,
                    classId: selectedClass,
                    subjects: [{ name: "Conduite", coefficient: 1 }], // Sujet par défaut
                    students: studentsDetails
                };
                
                updatedBulletins = [...(db.bulletins || []), newBulletin];
            }
            
            // Mettre à jour la base de données
            const updatedDB = { ...db, bulletins: updatedBulletins };
            await window.electron.saveDatabase(updatedDB);
            
            setFlashMessage({
                message: "Les élèves ont été enregistrés avec succès dans le bulletin !",
                type: "success",
                duration: 5000
            });
            
            // Fermer le composant et rafraîchir les données
            setTimeout(() => {
                handleCloseComponent();
                refreshData();
            }, 1000);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des élèves:", error);
            setFlashMessage({
                message: "Une erreur est survenue lors de la sauvegarde des élèves.",
                type: "error",
                duration: 5000
            });
        } finally {
            setSaving(false);
        }
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
                <h3 className="text-xl font-semibold mb-2">Sélection des élèves pour le bulletin :</h3>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div>
                        <span className="font-medium">Composition :</span> {selectedComposition.label}
                    </div>
                    <div>
                        <span className="font-medium">Classe :</span> {className}
                    </div>
                </div>
            </div>
            
            {/* Barre de recherche */}
            <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className={textClass} />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un élève..."
                    className={`pl-10 pr-4 py-2 w-full rounded-lg border ${tableBorderColor} ${inputBgColor} ${textClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                />
            </div>
            
            {/* Tableau des élèves */}
            <div className="overflow-hidden rounded-lg border shadow-md mb-6">
                <table className={`min-w-full divide-y ${tableBorderColor}`}>
                    <thead className={`${tableHeaderBg}`}>
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left">
                                <div className="flex items-center">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSelectAll}
                                        className="mr-2 focus:outline-none"
                                    >
                                        <AnimatePresence mode="wait">
                                            {areAllSelected ? (
                                                <motion.div
                                                    key="checked"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <CheckSquare size={20} className="text-blue-500" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="unchecked"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Square size={20} className={textClass} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                    <span className="font-semibold">Tous</span>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left font-semibold">Prénom</th>
                            <th scope="col" className="px-6 py-3 text-left font-semibold">Nom</th>
                            <th scope="col" className="px-6 py-3 text-left font-semibold">Matricule</th>
                        </tr>
                    </thead>
                    <tbody className={`${tableBgColor} divide-y ${tableBorderColor}`}>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center">
                                    <div className="flex justify-center items-center">
                                        <RefreshCcw size={24} className="animate-spin mr-2" />
                                        <span>Chargement des élèves...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center italic">
                                    Aucun élève trouvé pour cette classe.
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <motion.tr
                                    key={student.id}
                                    className={`${tableRowHoverBg} cursor-pointer`}
                                    onClick={() => handleSelectStudent(student.id)}
                                    whileHover={
                                        selectedStudents.includes(student.id) === true ? 
                                        { backgroundColor: whileHoverbackgroundColor } : {}
                                    }
                                    transition={{ duration: 0.2 }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="mr-2"
                                            >
                                                <AnimatePresence mode="wait">
                                                    {selectedStudents.includes(student.id) ? (
                                                        <motion.div
                                                            key="checked"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <CheckSquare size={20} className="text-blue-500" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="unchecked"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <Square size={20} className={textClass} />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {student.fullName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {student.last_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {student.matricule || "-"}
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Informations et statistiques */}
            <div className="mb-6 bg-blue-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-600">Total des élèves: <span className="font-bold">{students.length}</span></p>
                        <p className="font-medium text-gray-600">Élèves sélectionnés: <span className="font-bold">{selectedStudents.length}</span></p>
                    </div>
                    <div className="mt-3 md:mt-0">
                        {selectedStudents.length > 0 ? (
                            <p className="text-green-600 dark:text-green-400">
                                {selectedStudents.length === students.length 
                                    ? "Tous les élèves sont sélectionnés" 
                                    : `${selectedStudents.length} élève(s) sélectionné(s) sur ${students.length}`}
                            </p>
                        ) : (
                            <p className="text-yellow-600 dark:text-yellow-400">
                                Aucun élève sélectionné
                            </p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4">
                <motion.button
                    onClick={handleCloseComponent}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Annuler
                </motion.button>
                
                <motion.button
                    onClick={handleSaveStudents}
                    disabled={saving}
                    className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    whileHover={saving ? {} : { scale: 1.05 }}
                    whileTap={saving ? {} : { scale: 0.95 }}
                >
                    {saving ? (
                        <>
                            <RefreshCcw size={18} className="animate-spin mr-2" />
                            Enregistrement...
                        </>
                    ) : (
                        <>
                            <Save size={18} className="mr-2" />
                            Enregistrer les élèves
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default GetBulletinStudents;