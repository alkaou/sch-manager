import React, { useState, useEffect } from 'react';
import secureLocalStorage from "react-secure-storage";

import { LanguageContext } from '../components/contexts';
import { Translator } from '../utils/Translator';

export default function LanguageProvider({ children }) {

    const [language, setLanguage] = useState("Français");

    useEffect(() => {
        let applanguage = secureLocalStorage.getItem("language");
        if (applanguage !== undefined && applanguage !== null) {
            setLanguage(applanguage);
            // console.log(applanguage);
        }
    }, []);

    const live_language = Translator[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, live_language }}>
            <>
                {children}
            </>
        </LanguageContext.Provider>
    );
};
