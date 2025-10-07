import { socialImgs } from "../lib/constants";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 md:gap-0 px-4 md:px-8 py-6 md:py-6 w-full backdrop-blur-sm z-20">
      {/* Left section - Terms */}
      <div className="flex-1 text-center md:text-left order-3 md:order-1">
        <a
          href="#"
          className="text-white text-xs md:text-sm hover:text-gray-300 transition-colors"
          aria-label="Terms and Conditions">
          Terms & Conditions
        </a>
      </div>

      {/* Center section - Social Icons */}
      <div className="flex items-center gap-2 md:gap-3 flex-1 justify-center order-1 md:order-2">
        {socialImgs.map((socialImg, index) => (
          <a
            key={index}
            href={socialImg.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
            aria-label={`Visit our ${socialImg.name || "social media"} page`}>
            <img
              src={socialImg.imgPath}
              alt={`${socialImg.name || "social"} icon`}
              className="w-4 h-4 md:w-5 md:h-5"
            />
          </a>
        ))}
      </div>

      {/* Right section - Copyright */}
      <div className="flex-1 text-center md:text-right order-2 md:order-3">
        <a
          href="https://www.ersinbahar.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-xs md:text-sm">
          © 2025 Ersin Bahar. All rights reserved.
        </a>
      </div>
    </footer>
  );
};

export default Footer;
