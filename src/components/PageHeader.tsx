import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import logo from "../assets/logo/ETHR-logo.png";

const PageHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="mb-5">
      <nav className="flex items-center justify-between py-4 px-2">
        <div className="flex-1 flex items-center">
          <a
            href="https://www.ersinbahar.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Ersin Bahar's website">
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-16 sm:h-18 sm:w-18 rounded-lg object-cover hover:opacity-80 transition-opacity cursor-pointer"
            />
          </a>
        </div>
        <div className="flex flex-col items-center text-center flex-1">
          <h1 className="text-4xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">
            {t("headers.title")}
          </h1>
          <p className="hidden sm:block text-gray-400 mt-1 text-sm sm:text-base">
            {t("headers.subtitle")}
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          <LanguageSelector />
        </div>
      </nav>
    </header>
  );
};

export default PageHeader;
