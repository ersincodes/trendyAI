import NavigationArrow from "./NavigationArrow";

/**
 * Component for displaying historical event information
 * Follows SRP - Single responsibility of rendering event badge
 *
 * @param {Object} props
 * @param {Object} props.eventInfo - Event information object
 * @param {string} props.eventInfo.date - Event date
 * @param {number} props.eventInfo.year - Event year
 * @param {string} props.eventInfo.text - Event description
 * @param {number} props.currentIndex - Current event index
 * @param {number} props.totalEvents - Total number of events
 * @param {Function} props.onNext - Handler for next event
 * @param {Function} props.onPrevious - Handler for previous event
 * @param {boolean} props.isLoading - Loading state
 */
const HistoricalEventBadge = ({
  eventInfo,
  currentIndex,
  totalEvents,
  onNext,
  onPrevious,
  isLoading,
}) => {
  if (!eventInfo || isLoading || totalEvents === 0) {
    return null;
  }

  const hasMultipleEvents = totalEvents > 1;

  return (
    <div className="mt-6 mx-auto max-w-3xl relative group">
      <div className="bg-blue-600/20 backdrop-blur-md border border-blue-400/30 rounded-lg p-4 shadow-lg transition-all duration-300 hover:border-blue-400/50">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-blue-300 font-semibold">
            On This Day in History - {eventInfo.date}
          </p>
          <span className="text-xs text-blue-400 font-medium">
            {currentIndex + 1} / {totalEvents}
          </span>
        </div>
        <p className="text-sm text-gray-200">
          <span className="font-bold text-blue-400">{eventInfo.year}:</span>{" "}
          {eventInfo.text}
        </p>
        {hasMultipleEvents && (
          <p className="text-xs text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            💡 Use arrow keys or hover to navigate
          </p>
        )}
      </div>

      {hasMultipleEvents && (
        <>
          <NavigationArrow
            direction="left"
            onClick={onPrevious}
            ariaLabel="Previous event"
          />
          <NavigationArrow
            direction="right"
            onClick={onNext}
            ariaLabel="Next event"
          />
        </>
      )}
    </div>
  );
};

export default HistoricalEventBadge;
