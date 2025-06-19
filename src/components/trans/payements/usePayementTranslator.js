import { useLanguage } from "../contexts";
import translations from "./payements_translator";

export function usePayementTranslator() {
  const { language } = useLanguage();
  
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  return { t };
} 