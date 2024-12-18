import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi) // Load translations using http
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Bind i18next to React
  .init({
    supportedLngs: ["en", "uz"], // List of supported languages
    fallbackLng: "en", // Default language if detection fails
    debug: false, // Enable debug logs for development
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to translation files
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"], // Order of language detection
      caches: ["cookie"], // Cache the detected language
    },
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
  });

export default i18n;
