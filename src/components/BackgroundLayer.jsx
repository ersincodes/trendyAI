import PropTypes from "prop-types";

/**
 * Background layer component with dynamic image
 * Follows SRP - Single responsibility of rendering background
 */
const BackgroundLayer = ({ backgroundImage, isLoading, currentIndex }) => {
  return (
    <>
      {/* Default Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />

      {/* Dynamic Background Image */}
      <div
        key={currentIndex}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out animate-fade-in"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          opacity: isLoading ? 0 : 1,
        }}
      />

      {/* Overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/70 backdrop-blur-sm" />
    </>
  );
};

BackgroundLayer.propTypes = {
  backgroundImage: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  currentIndex: PropTypes.number.isRequired,
};

export default BackgroundLayer;
