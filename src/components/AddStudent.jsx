import React, { useState, useEffect } from 'react';
// On suppose que la méthode addStudent est importée depuis votre module de gestion
// Elle doit accepter deux paramètres : studentData et db
import { saveStudent } from '../utils/database_methods';

const AddStudent = ({setIsAddStudentActive}) => {

    const [db, setDb] = useState(null);

    useEffect(() => {
        window.electron.getDatabase().then((data) => {
            setDb(data);
            // console.log(data.name);
            // console.log(data.version);
        });
    }, []);

    // Objet initial pour un élève (toutes les infos sont vides)
    const initialStudent = {
        first_name: '',
        sure_name: '',
        last_name: '',
        classe: '',
        sexe: '',
        birth_date: '', // format yyyy-mm-dd pour le <input type="date">
        father_name: '',
        mother_name: '',
        parents_contact: ''
    };

    // On démarre avec un seul formulaire d'élève
    const [students, setStudents] = useState([initialStudent]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mise à jour des champs d'un sous-formulaire à partir de son index et du nom du champ
    const handleInputChange = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value;
        setStudents(updatedStudents);
    };

    // Ajoute un nouveau formulaire d'élève
    const handleAddForm = () => {
        setStudents([...students, initialStudent]);
    };

    // Supprime le formulaire de l'élève à l'index donné (s'il y a plus d'un formulaire)
    const handleRemoveForm = (index) => {
        if (students.length > 1) {
            const updatedStudents = students.filter((_, i) => i !== index);
            setStudents(updatedStudents);
        }
    };

    // Soumission du formulaire général
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            // Pour chaque élève, on convertit la date de naissance au format timestamp
            // et on appelle la méthode saveStudent en passant db en paramètre
            for (const student of students) {
                const studentData = {
                    ...student,
                    birth_date: new Date(student.birth_date).getTime()
                };
                await saveStudent(studentData, db);
            }
            // En cas de succès, redirection ou affichage d'un message
            // navigate('/started_page');
            setIsAddStudentActive(false);
        } catch (err) {
            console.error("Erreur lors de l'ajout des élèves :", err);
            setError("Une erreur est survenue lors de l'ajout des élèves.");
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Ajouter plusieurs élèves</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                {students.map((student, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded p-4 mb-4 relative transition-all duration-300"
                    >
                        <h3 className="text-xl font-semibold mb-2">Élève {index + 1}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Prénom */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                <input
                                    type="text"
                                    value={student.first_name}
                                    onChange={(e) => handleInputChange(index, 'first_name', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            {/* Nom */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    value={student.sure_name}
                                    onChange={(e) => handleInputChange(index, 'sure_name', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {/* Nom complet (champ personnalisé si besoin) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                                <input
                                    type="text"
                                    value={student.last_name}
                                    onChange={(e) => handleInputChange(index, 'last_name', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            {/* Classe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Classe</label>
                                <input
                                    type="text"
                                    value={student.classe}
                                    onChange={(e) => handleInputChange(index, 'classe', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {/* Sexe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sexe</label>
                                <select
                                    value={student.sexe}
                                    onChange={(e) => handleInputChange(index, 'sexe', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">Sélectionnez</option>
                                    <option value="M">Masculin</option>
                                    <option value="F">Féminin</option>
                                </select>
                            </div>
                            {/* Date de naissance */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                                <input
                                    type="date"
                                    value={student.birth_date}
                                    onChange={(e) => handleInputChange(index, 'birth_date', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {/* Nom du père */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom du père</label>
                                <input
                                    type="text"
                                    value={student.father_name}
                                    onChange={(e) => handleInputChange(index, 'father_name', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            {/* Nom de la mère */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom de la mère</label>
                                <input
                                    type="text"
                                    value={student.mother_name}
                                    onChange={(e) => handleInputChange(index, 'mother_name', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            {/* Contact des parents */}
                            <label className="block text-sm font-medium text-gray-700">Contact des parents</label>
                            <input
                                type="text"
                                value={student.parents_contact}
                                onChange={(e) => handleInputChange(index, 'parents_contact', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        {/* Boutons d'ajout/suppression du sous-formulaire */}
                        <div className="flex justify-end mt-2 space-x-2">
                            {students.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveForm(index)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    {/* Icône moins */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                            )}
                            {index === students.length - 1 && (
                                <button
                                    type="button"
                                    onClick={handleAddForm}
                                    className="text-green-500 hover:text-green-700 transition-colors"
                                >
                                    {/* Icône plus */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        {isLoading ? "Sauvegarde en cours..." : "Sauvegarder tous les élèves"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;
