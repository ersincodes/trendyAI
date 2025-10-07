import PropTypes from "prop-types";

/**
 * Reusable generate button component
 * Follows SRP and DRY - Single, reusable button component
 */
const GenerateButton = ({ onClick, isDisabled, label }) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="w-full mt-auto py-3 px-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-200 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
      {label}
    </button>
  );
};

GenerateButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

export default GenerateButton;
