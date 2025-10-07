import { useEffect } from "react";

/**
 * Custom hook to handle keyboard navigation
 * Follows SRP - Single responsibility of managing keyboard events
 */
const useKeyboardNavigation = ({ onNext, onPrevious, isEnabled }) => {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        onPrevious();
      } else if (event.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrevious, isEnabled]);
};

export default useKeyboardNavigation;
