// StudentsTable.jsx
import React from "react";
import { MoreVertical, User } from "lucide-react";
import { gradients } from "../utils/colors";

const StudentsTable = ({
    students,
    openDropdown,
    setOpenDropdown,
    app_bg_color,
    text_color,
    theme,
}) => {
    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const popup_bg_hover_color =
        app_bg_color === gradients[1] || theme === "dark"
            ? "hover:bg-gray-500"
            : "hover:bg-blue-400";
    const head_bg_color = app_bg_color === gradients[1] ? "bg-gray-300" : app_bg_color;

    return (
        <div
            className="p-4 overflow-y-auto overflow-x-auto"
            style={{ height: "100vh", marginTop: "2%" }}
        >
            {students.length <= 0 ? (
                <div
                    style={{ marginTop: "20%" }}
                    className={`flex flex-col items-center justify-center p-6 space-y-4 ${app_bg_color} animate-fadeIn`}
                >
                    <p className={`${text_color} font-medium text-center`}>
                        Vous n'avez aucune classe et aucun élève dans votre base de donnée.
                    </p>
                    <p className={`${text_color} font-medium text-center`}>
                        Veuillez cliquer sur le bouton ci-dessous pour créer une classe.
                    </p>
                    <button className="flex items-center px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Créer une classe
                    </button>
                </div>
            ) : (
                <div style={{marginBottom:"40%"}}>
                    {/* Informations sommaires */}
                    <div style={{ marginLeft: "5%" }} className="mt-2 mb-2 animate-fadeIn">
                        <p
                            className={`${app_bg_color === gradients[1] ? "text-gray-500" : text_color} font-bold text-lg transition-transform duration-300 transform hover:scale-105`}
                        >
                            Le nombre total des élèves : 500
                        </p>
                        <p
                            className={`${app_bg_color === gradients[1] ? "text-gray-500" : text_color} font-bold text-lg transition-transform duration-300 transform hover:scale-105`}
                        >
                            Le nombre total des classes : 12
                        </p>
                    </div>

                    {/* Conteneur scrollable verticalement */}
                    <>
                        <table
                            className="min-w-full table-fixed border-collapse"
                            style={{
                                borderWidth: "2px",
                                borderColor: app_bg_color === gradients[1] ? "#e9e9e9" : "white",
                            }}
                        >
                            <thead
                                className={`sticky -top-2 ${head_bg_color} ${text_color} shadow-lg`}
                                style={{
                                    borderWidth: "2px",
                                    borderColor: app_bg_color === gradients[1] ? "#e9e9e9" : "white",
                                    zIndex: 10,
                                    margin: 0,
                                    padding: 0,
                                }}
                            >
                                <tr className="divide-x divide-white">
                                    <th className="w-20 py-2 px-4 border-b border-gray-300 text-center">
                                        Profile
                                    </th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">
                                        Full Name
                                    </th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">
                                        First Name
                                    </th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">
                                        Surname
                                    </th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">
                                        Last Name
                                    </th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">
                                        Sexe
                                    </th>
                                    <th className="w-28 py-2 px-4 border-b border-gray-300 text-center">
                                        Birth Date
                                    </th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">
                                        Father
                                    </th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">
                                        Mother
                                    </th>
                                    <th className="w-24 py-2 px-4 border-b border-gray-300 text-center">
                                        Contact
                                    </th>
                                    <th className="w-28 py-2 px-4 border-b border-gray-300 text-center">
                                        Added
                                    </th>
                                    <th className="w-28 py-2 px-4 border-b border-gray-300 text-center">
                                        Updated
                                    </th>
                                    <th className="w-20 py-2 px-4 border-b border-gray-300 text-center">
                                        Options
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-300">
                                {students.map((student, index) => (
                                    <tr
                                        key={student.id}
                                        className={`${text_color} divide-x divide-gray-300 ${app_bg_color === gradients[1] ? 'hover:bg-white' : 'hover:bg-gray-50'} hover:text-gray-700 transition-colors duration-300`}
                                    >
                                        <td className="py-2 px-4 flex justify-center">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-gray-500 text-xs">
                                                    <User />
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 text-center">{student.name_complet}</td>
                                        <td className="py-2 px-4 text-center">{student.first_name}</td>
                                        <td className="py-2 px-4 text-center">{student.surname}</td>
                                        <td className="py-2 px-4 text-center">{student.last_name}</td>
                                        <td className="py-2 px-4 text-center">{student.sexe}</td>
                                        <td className="py-2 px-4 text-center">
                                            {new Date(student.birth_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 text-center">{student.father_name}</td>
                                        <td className="py-2 px-4 text-center">{student.mother_name}</td>
                                        <td className="py-2 px-4 text-center">{student.parents_contact}</td>
                                        <td className="py-2 px-4 text-center">
                                            {new Date(student.added_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 text-center">
                                            {new Date(student.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 relative text-center">
                                            <button
                                                onClick={() => toggleDropdown(index)}
                                                className="p-2 rounded hover:bg-gray-200 transition-colors duration-200"
                                            >
                                                <MoreVertical size={20} />
                                            </button>
                                            {openDropdown === index && (
                                                <div
                                                    className={`${app_bg_color} ${text_color} absolute right-0 top-full -mt-10 w-40 border border-gray-200 rounded shadow-lg z-50 animate-fadeIn`}
                                                >
                                                    <ul>
                                                        <li
                                                            className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer transition-colors duration-200`}
                                                        >
                                                            Modify
                                                        </li>
                                                        <li
                                                            className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer transition-colors duration-200`}
                                                        >
                                                            See details
                                                        </li>
                                                        <li
                                                            className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer transition-colors duration-200`}
                                                        >
                                                            Deactivate
                                                        </li>
                                                        <li
                                                            className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer transition-colors duration-200`}
                                                        >
                                                            Delete
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                </div>
            )}
        </div>
    );
};

export default StudentsTable;
