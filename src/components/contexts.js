import { createContext, useContext } from "react";


// Theme Context
const ThemeContext = createContext();
const LanguageContext = createContext();
const LoaderPageContext = createContext();

const useTheme = () => useContext(ThemeContext);
const useLanguage = () => useContext(LanguageContext);
const usePageLoader = () => useContext(LoaderPageContext);

export { 
    ThemeContext,
    LanguageContext,
    LoaderPageContext,
    useTheme,
    useLanguage,
    usePageLoader
};