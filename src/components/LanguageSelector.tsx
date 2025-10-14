import { useCallback } from "react";
import i18n from "../i18n";

const languages = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "tr", flag: "🇹🇷", label: "Türkçe" },
];

const LanguageSelector = () => {
  const handleLanguageChange = useCallback((code: string) => {
    void i18n.changeLanguage(code);
  }, []);

  const currentLanguage = i18n.language;

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Language selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          aria-label={`Switch to ${lang.label}`}
          title={lang.label}
          className={`text-2xl transition-all duration-200 hover:scale-110 ${
            currentLanguage === lang.code
              ? "opacity-100 scale-110"
              : "opacity-50 hover:opacity-75"
          }`}>
          {lang.flag}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
