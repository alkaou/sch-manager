import { createContext, useContext } from "react";


// Theme Context
const ThemeContext = createContext();
const LanguageContext = createContext();
const LoaderPageContext = createContext();
const FlashNotificationContext = createContext(null);

const useTheme = () => useContext(ThemeContext);
const useLanguage = () => useContext(LanguageContext);
const usePageLoader = () => useContext(LoaderPageContext);
const useFlashNotification = () => useContext(FlashNotificationContext);

export { 
    ThemeContext,
    LanguageContext,
    LoaderPageContext,
    FlashNotificationContext,
    useTheme,
    useLanguage,
    usePageLoader,
    useFlashNotification
};