/**
 * Reusable navigation arrow button component
 * Follows SRP and DRY - Single, reusable component for navigation arrows
 *
 * @param {Object} props
 * @param {string} props.direction - Arrow direction ("left" or "right")
 * @param {Function} props.onClick - Click handler
 * @param {string} props.ariaLabel - Aria label for accessibility
 */
const NavigationArrow = ({ direction, onClick, ariaLabel }) => {
  const isLeft = direction === "left";
  const positionClasses = isLeft
    ? "left-0 -translate-x-12 group-hover:-translate-x-14"
    : "right-0 translate-x-12 group-hover:translate-x-14";

  const arrowPath = isLeft ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7";

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      tabIndex={0}
      className={`absolute ${positionClasses} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-blue-600/80 hover:bg-blue-500 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-blue-500/50 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400`}>
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={arrowPath}
        />
      </svg>
    </button>
  );
};

export default NavigationArrow;
