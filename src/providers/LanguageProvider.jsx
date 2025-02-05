import React, { useState } from 'react';

import { LanguageContext } from '../components/contexts';

export default function LanguageProvider({ children }) {

    const [language, setLanguage] = useState("Français");

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            <>
                {children}
            </>
        </LanguageContext.Provider>
    );
};
