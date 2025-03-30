import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";

const HeaderSelector = ({
    headers,
    customHeaders,
    onToggle,
    onAddCustom,
    theme,
    text_color
}) => {
    const [newHeaderName, setNewHeaderName] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);

    // Styles based on theme
    const textClass = theme === "dark" ? text_color : "text-gray-700";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
    const checkboxBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
    const checkboxActiveBgColor = theme === "dark" ? "bg-blue-600" : "bg-blue-500";

    // Count selected headers
    const selectedCount = [...headers, ...customHeaders].filter(h => h.selected).length;

    // Handle form submission
    const handleAddHeader = (e) => {
        e.preventDefault();
        if (newHeaderName.trim()) {
            onAddCustom(newHeaderName.trim());
            setNewHeaderName("");
            setShowAddForm(false);
        }
    };

    return (
        <div>
            <p className={`text-sm mb-3 ${textClass}`}>
                Sélectionnez entre 3 et 10 colonnes pour votre liste.
                <span className="font-semibold"> Actuellement: {selectedCount}/6</span>
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
                {headers.map(header => (
                    <motion.div
                        key={header.id}
                        className={`flex items-center p-2 rounded-md border ${borderColor} ${header.selected ? "bg-blue-50 dark:bg-blue-900/30" : ""
                            }`}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div
                            className={`w-5 h-5 rounded border ${borderColor} mr-2 flex items-center justify-center cursor-pointer ${header.selected ? checkboxActiveBgColor : checkboxBgColor
                                }`}
                            onClick={() => onToggle(header.id)}
                        >
                            {header.selected && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <span
                            className={`${textClass} ${header.required ? "font-semibold" : ""}`}
                            style={{ opacity: header.required ? 1 : 0.9 }}
                        >
                            {header.label}
                        </span>
                        {header.required && (
                            <span className="ml-1 text-red-500 text-xs">*</span>
                        )}
                    </motion.div>
                ))}

                {customHeaders.map(header => (
                    <motion.div
                        key={header.id}
                        className={`flex items-center p-2 rounded-md border ${borderColor} ${header.selected ? "bg-blue-50 dark:bg-blue-900/30" : ""
                            }`}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div
                            className={`w-5 h-5 rounded border ${borderColor} mr-2 flex items-center justify-center cursor-pointer ${header.selected ? checkboxActiveBgColor : checkboxBgColor
                                }`}
                            onClick={() => onToggle(header.id)}
                        >
                            {header.selected && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <span className={textClass}>{header.label}</span>
                        <span className="ml-1 text-xs text-blue-500">(personnalisé)</span>
                    </motion.div>
                ))}
            </div>

            {/* Add custom header button/form */}
            {!showAddForm ? (
                <motion.button
                    onClick={() => setShowAddForm(true)}
                    className={`flex items-center p-2 rounded-md border ${borderColor} w-full justify-center`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus className={`h-4 w-4 mr-1 ${textClass}`} />
                    <span className={`text-sm ${textClass}`}>Ajouter une colonne personnalisée</span>
                </motion.button>
            ) : (
                <motion.form
                    onSubmit={handleAddHeader}
                    className={`flex items-center p-2 rounded-md border ${borderColor} w-full`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <input
                        type="text"
                        value={newHeaderName}
                        onChange={(e) => setNewHeaderName(e.target.value)}
                        placeholder="Nom de la colonne"
                        className={`flex-1 px-2 py-1 rounded ${inputBgColor} ${borderColor} ${textClass}`}
                        autoFocus
                    />
                    <motion.button
                        type="submit"
                        className="ml-2 p-1 bg-green-600 text-white rounded"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={!newHeaderName.trim()}
                    >
                        <Check className="h-4 w-4" />
                    </motion.button>
                </motion.form>
            )}
        </div>
    );
};

export default HeaderSelector;