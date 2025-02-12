// StudentsTable.jsx
import React, { useState } from "react";
import { MoreVertical, User } from "lucide-react";

const StudentsTable = ({ students }) => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    return (
        <div className="overflow-x-auto overflow-y-auto p-4"
            style={{ height: "100vh" }}
        >
            <table
                className="w-full table-fixed border-collapse"
                style={{
                    marginBottom: "20%",
                    borderWidth: "2px",
                    borderColor: "#FFF",
                }}
            >
                <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr className="divide-x divide-gray-300">
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
                        <tr key={student.id} className="divide-x divide-gray-300 hover:bg-white">
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
                            <td className="py-2 px-4 relative">
                                <button
                                    onClick={() => toggleDropdown(index)}
                                    className="p-2 rounded hover:bg-gray-200"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {openDropdown === index && (
                                    <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-20">
                                        <ul>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Modify</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">See details</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Deactivate</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
                                        </ul>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default StudentsTable;
