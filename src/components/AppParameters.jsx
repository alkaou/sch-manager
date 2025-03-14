import React, { useState } from 'react';
import { FaCog, FaGlobe, FaChevronRight } from 'react-icons/fa';

import LanguageSelector from './LanguageSelector.jsx';
import { useLanguage, useTheme } from './contexts.js';

function AppParameters() {
    const [showPanel, setShowPanel] = useState(false);
    const [onHover, setOnHover] = useState(false);

    const showLangPanel = () => setShowPanel(!showPanel);

    const { theme } = useTheme();

    const hideLangPanel = () => {
        if (onHover === false && showPanel === true) {
            setShowPanel(false);
        }
    }

    const { live_language } = useLanguage();

    return (
        <section onClick={hideLangPanel} className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6`} style={{ minHeight: "50vh" }}>
            <div className="flex items-center mb-6 border-b pb-4">
                <FaCog className={`${theme === "dark" ? "text-white" : "text-blue-600"} text-2xl mr-3`} />
                <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>{live_language.parameters || "Parameters"}</h2>
            </div>

            <div className="space-y-6">
                {/* Language Settings */}
                <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all">
                    <div className="justify-between flex items-center">
                        <div className="flex items-center">
                            <FaGlobe className="text-blue-500 mr-3" />
                            <div>
                                <p className="font-semibold text-xl text-gray-700">{live_language.lang_name_text}</p>
                                <p className="text-sm text-gray-500">{live_language.language_description || "Change the application language"}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <LanguageSelector
                                isParams={true}
                                showLangPanel={showLangPanel}
                                showPanel={showPanel}
                                setShowPanel={setShowPanel}
                                setOnHover={setOnHover}
                            />
                            <FaChevronRight className="text-gray-400 ml-2" />
                        </div>
                    </div>
                </div>

                {/* Additional parameter sections can be added here */}
                {/* For example: Theme, Notifications, etc. */}
            </div>
        </section>
    );
};

export default AppParameters;