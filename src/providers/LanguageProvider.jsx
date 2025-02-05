import React, { useState } from 'react';

import { LanguageContext } from '../components/contexts';
import { Translator } from '../utils/Translator';

export default function LanguageProvider({ children }) {

    const [language, setLanguage] = useState("Français");

    const live_language = Translator[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, live_language }}>
            <>
                {children}
            </>
        </LanguageContext.Provider>
    );
};
