// StudentsTable.jsx
import React from "react";
import { MoreVertical, User } from "lucide-react";

import { gradients } from "../utils/colors";

const StudentsTable = ({ students, openDropdown, setOpenDropdown, app_bg_color, text_color, theme }) => {

    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const popup_bg_hover_color = app_bg_color === gradients[1] || theme === "dark" ? "hover:bg-gray-500" : "hover:bg-blue-400";
    const head_bg_color = app_bg_color === gradients[1] ? "bg-gray-300" : app_bg_color;

    return (
        <div className="overflow-y-auto p-4"
            style={{
                height: "100vh",
                marginTop: "2%",
            }}
        >

            {students.length <= 0 ?
                (
                    <div className="text-center justify-center">
                        <p>Vous n'avez aucune classe et aucun élève dans votre base de donnée.</p>
                        <p>Veuillez cliquer sur le button ci-dessous pour créer une classe.</p>
                    </div>
                )
                :
                (
                    <>
                        <div className="text-center bold mt-5 mb-5">
                            <p>Le nombres des élèves</p>
                        </div>

                        <table
                            className="w-full table-fixed border-collapse"
                            style={{
                                marginBottom: "25%",
                                borderWidth: "2px",
                                borderColor: app_bg_color === gradients[1] ? "#e9e9e9" : "white",
                            }}
                        >
                            <thead
                                className={`sticky -top-5 ${head_bg_color} ${text_color}`}
                                style={{
                                    borderWidth: "2px",
                                    borderColor: app_bg_color === gradients[1] ? "#e9e9e9" : "white",
                                }}
                            >
                                <tr
                                    className="divide-x divide-white"
                                >
                                    {/* Vous pouvez définir des classes de largeur explicite pour aligner chaque en-tête */}
                                    <th className="w-20 py-2 px-4 border-b border-gray-300 text-center">Profile</th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">Full Name</th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">First Name</th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">Surname</th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">Last Name</th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">Sexe</th>
                                    <th className="w-28 py-2 px-4 border-b border-gray-300 text-center">Birth Date</th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">Father</th>
                                    <th className="w-1/6 py-2 px-4 border-b border-gray-300 text-center">Mother</th>
                                    <th className="w-24 py-2 px-4 border-b border-gray-300 text-center">Contact</th>
                                    <th className="w-28 py-2 px-4 border-b border-gray-300 text-center">Added</th>
                                    <th className="w-28 py-2 px-4 border-b border-gray-300 text-center">Updated</th>
                                    <th className="w-20 py-2 px-4 border-b border-gray-300 text-center">Options</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-300">
                                {students.map((student, index) => (
                                    <tr key={student.id} className={`${text_color} divide-x divide-gray-300 hover:bg-white hover:text-gray-700`}>
                                        <td className="py-2 px-4">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-gray-500 text-xs">
                                                    <User />
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-2 px-4">{student.name_complet}</td>
                                        <td className="py-2 px-4">{student.first_name}</td>
                                        <td className="py-2 px-4">{student.surname}</td>
                                        <td className="py-2 px-4">{student.last_name}</td>
                                        <td className="py-2 px-4">{student.sexe}</td>
                                        <td className="py-2 px-4">
                                            {new Date(student.birth_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4">{student.father_name}</td>
                                        <td className="py-2 px-4">{student.mother_name}</td>
                                        <td className="py-2 px-4">{student.parents_contact}</td>
                                        <td className="py-2 px-4">
                                            {new Date(student.added_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4">
                                            {new Date(student.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => toggleDropdown(index)}
                                                className="p-2 rounded hover:bg-gray-200"
                                                style={{ zIndex: "-99999" }}
                                            >
                                                <MoreVertical size={20} />
                                            </button>

                                            <div className="relative">
                                                {openDropdown === index && (
                                                    <div className={`${app_bg_color} ${text_color} absolute -right-3 -top-5 w-40 border border-gray-200 rounded shadow-lg`}>
                                                        <ul>
                                                            <li className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer`}>Modify</li>
                                                            <li className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer`}>See details</li>
                                                            <li className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer`}>Deactivate</li>
                                                            <li className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer`}>Delete</li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </>
                )
            }

        </div>
    );
};

export default StudentsTable;
