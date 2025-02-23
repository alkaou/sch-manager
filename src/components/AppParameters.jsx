import React, { useState } from 'react';

import LanguageSelector from './LanguageSelector.jsx';
import { useLanguage } from './contexts.js';

function AppParameters() {

    const [showPanel, setShowPanel] = useState(false);
    const [onHover, setOnHover] = useState(false);

    const showLangPanel = () => setShowPanel(!showPanel);

    const hideLangPanel = () => {
        if (onHover === false && showPanel === true) {
            setShowPanel(false);
        }
    }

    const { live_language } = useLanguage()

    return (
        <section onClick={hideLangPanel} style={{ minHeight: "70vh" }}>
            <div style={{ marginTop: "15%" }}>
                <div className="justify-between flex">
                    <div>
                        <p className="font-semibold text-xl">{live_language.lang_name_text}</p>
                    </div>
                    <div>
                        <LanguageSelector
                            isParams={true}
                            showLangPanel={showLangPanel}
                            showPanel={showPanel}
                            setShowPanel={setShowPanel}
                            setOnHover={setOnHover}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppParameters;