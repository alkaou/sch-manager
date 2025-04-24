import { createContext, useContext } from "react";

// Theme Context
const ThemeContext = createContext();
const LanguageContext = createContext();
const ProtectionsContext = createContext();
const FlashNotificationContext = createContext(null);

const useTheme = () => useContext(ThemeContext);
const useLanguage = () => useContext(LanguageContext);
const useProtections = () => useContext(ProtectionsContext);
const useFlashNotification = () => useContext(FlashNotificationContext);

export {
    ThemeContext,
    LanguageContext,
    ProtectionsContext,
    FlashNotificationContext,
    useTheme,
    useLanguage,
    useProtections,
    useFlashNotification
};