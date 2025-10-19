import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./i18n/en.json";
import uz from "./i18n/uz.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uz: { translation: uz },
  },
  lng: "uz", 
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
