import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, Check, CheckSquare, Square, Users } from "lucide-react";

const StudentSelector = ({
    db,
    onClose,
    onAddStudents,
    theme,
    text_color,
    alreadySelectedIds = []
}) => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterClass, setFilterClass] = useState("All");
    const [filterLevel, setFilterLevel] = useState("All");

    // Styles based on theme
    const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const textClass = theme === "dark" ? text_color : "text-gray-700";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
    const tableBgColor = theme === "dark" ? "bg-gray-900" : "bg-white";
    const tableHeaderBg = theme === "dark" ? "bg-gray-800" : "bg-gray-100";
    const tableRowHoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

    // Load students from database
    useEffect(() => {
        if (db && db.students) {
            // Only get active students
            const activeStudents = db.students
                .filter(student => student.status === "actif")
                .map(student => ({
                    ...student,
                    isAlreadySelected: alreadySelectedIds.includes(student.id)
                }));

            setStudents(activeStudents);
            setFilteredStudents(activeStudents);
        }
    }, [db, alreadySelectedIds]);

    // Apply filters when search term or filters change
    useEffect(() => {
        if (!students.length) return;

        let filtered = [...students];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                student =>
                    (student.first_name && student.first_name.toLowerCase().includes(term)) ||
                    (student.last_name && student.last_name.toLowerCase().includes(term)) ||
                    (student.matricule && student.matricule.toLowerCase().includes(term))
            );
        }

        // Apply class filter
        if (filterClass !== "All") {
            filtered = filtered.filter(student => student.classe === filterClass);
        }

        // Apply level filter
        if (filterLevel !== "All") {
            filtered = filtered.filter(student => {
                const classLevel = student.classe.split(" ")[0];
                return classLevel === filterLevel;
            });
        }

        setFilteredStudents(filtered);
    }, [students, searchTerm, filterClass, filterLevel]);

    // Get unique classes and levels for filters
    const classes = Array.from(new Set(students.map(s => s.classe))).sort();
    const levels = Array.from(new Set(students.map(s => s.classe.split(" ")[0]))).sort((a, b) => a - b);

    // Handle selection toggle
    const toggleSelectStudent = (studentId) => {
        setSelectedIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    // Handle select all
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredStudents.filter(s => !s.isAlreadySelected).length) {
            // Deselect all
            setSelectedIds([]);
        } else {
            // Select all that aren't already selected
            setSelectedIds(
                filteredStudents
                    .filter(s => !s.isAlreadySelected)
                    .map(s => s.id)
            );
        }
    };

    // Handle add selected students
    const handleAddStudents = () => {
        const selectedStudents = students.filter(s => selectedIds.includes(s.id));
        onAddStudents(selectedStudents);
    };

    // Check if all filtered students are selected
    const areAllSelected = filteredStudents.length > 0 &&
        selectedIds.length === filteredStudents.filter(s => !s.isAlreadySelected).length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                className={`${bgColor} rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <Users className={`h-6 w-6 mr-2 ${textClass}`} />
                        <h2 className={`text-xl font-semibold ${textClass}`}>Sélectionner des élèves</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher un élève..."
                                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${borderColor} ${inputBgColor} ${textClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center">
                            <Filter className="h-5 w-5 mr-2 text-gray-400" />
                            <select
                                value={filterClass}
                                onChange={(e) => setFilterClass(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBgColor} ${textClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            >
                                <option value="All">Toutes les classes</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center">
                            <Filter className="h-5 w-5 mr-2 text-gray-400" />
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBgColor} ${textClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            >
                                <option value="All">Tous les niveaux</option>
                                {levels.map(level => (
                                    <option key={level} value={level}>Niveau {level}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Student list */}
                <div className="flex-1 overflow-auto p-4">
                    <table className={`min-w-full ${tableBgColor} border ${borderColor}`}>
                        <thead className={tableHeaderBg}>
                            <tr>
                                <th className="px-4 py-2 text-left">
                                    <div className="flex items-center">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={toggleSelectAll}
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
                                                        <CheckSquare className="h-5 w-5 text-blue-500" />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="unchecked"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Square className="h-5 w-5 text-gray-400" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                        <span className={`font-semibold ${textClass}`}>Sélectionner</span>
                                    </div>
                                </th>
                                <th className={`px-4 py-2 text-left ${textClass}`}>Matricule</th>
                                <th className={`px-4 py-2 text-left ${textClass}`}>Nom</th>
                                <th className={`px-4 py-2 text-left ${textClass}`}>Prénom</th>
                                <th className={`px-4 py-2 text-left ${textClass}`}>Classe</th>
                                <th className={`px-4 py-2 text-left ${textClass}`}>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={`px-4 py-4 text-center ${textClass}`}>
                                        Aucun élève trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map(student => (
                                    <tr
                                        key={student.id}
                                        className={`${tableRowHoverBg} ${student.isAlreadySelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                    >
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => toggleSelectStudent(student.id)}
                                                    className="mr-2 focus:outline-none"
                                                    disabled={student.isAlreadySelected}
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {selectedIds.includes(student.id) || student.isAlreadySelected ? (
                                                            <motion.div
                                                                key="checked"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <CheckSquare className={`h-5 w-5 ${student.isAlreadySelected ? 'text-gray-400' : 'text-blue-500'}`} />
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key="unchecked"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <Square className="h-5 w-5 text-gray-400" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.button>
                                                {student.isAlreadySelected && (
                                                    <span className="text-xs text-blue-500 dark:text-blue-400">Déjà ajouté</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className={`px-4 py-2 ${textClass}`}>{student.matricule || "-"}</td>
                                        <td className={`px-4 py-2 ${textClass} font-medium`}>{student.last_name}</td>
                                        <td className={`px-4 py-2 ${textClass}`}>{student.first_name}</td>
                                        <td className={`px-4 py-2 ${textClass}`}>{student.classe}</td>
                                        <td className={`px-4 py-2 ${textClass}`}>
                                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                Actif
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer with action buttons */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className={textClass}>
                        {selectedIds.length} élève{selectedIds.length !== 1 ? 's' : ''} sélectionné{selectedIds.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex space-x-3">
                        <motion.button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Annuler
                        </motion.button>
                        <motion.button
                            onClick={handleAddStudents}
                            className="px-4 py-2 rounded-md bg-blue-600 text-white"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={selectedIds.length === 0}
                        >
                            Ajouter {selectedIds.length} élève{selectedIds.length !== 1 ? 's' : ''}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentSelector;