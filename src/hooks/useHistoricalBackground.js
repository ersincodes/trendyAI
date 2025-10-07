import { useState, useEffect } from "react";

/**
 * Custom hook to fetch historical events and related images for today's date
 * Uses Wikipedia API for events and Unsplash API for images
 */
const useHistoricalBackground = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalEvents = async () => {
      try {
        setIsLoading(true);

        // Get current date
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const monthName = today.toLocaleString("en-US", { month: "long" });

        // Fetch from Wikipedia API for events on this day
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;

        const response = await fetch(wikiUrl);
        const data = await response.json();

        if (data.events && data.events.length > 0) {
          // Get multiple significant events (prioritize older events with images)
          const significantEvents = data.events
            .filter(
              (event) =>
                event.year < 2000 &&
                event.text &&
                event.pages &&
                event.pages.length > 0
            )
            .slice(0, 10); // Get up to 10 events

          // If we don't have enough significant events, add some recent ones
          const allEvents =
            significantEvents.length >= 5
              ? significantEvents
              : [
                  ...significantEvents,
                  ...data.events
                    .filter((e) => e.text)
                    .slice(0, 10 - significantEvents.length),
                ];

          // Process each event to extract image and details
          const processedEvents = await Promise.all(
            allEvents.slice(0, 8).map(async (event) => {
              let imageUrl = null;

              // Get image from the event's page if available
              if (event.pages && event.pages[0]) {
                const page = event.pages[0];
                if (page.thumbnail && page.thumbnail.source) {
                  imageUrl = page.thumbnail.source.replace(
                    /\/\d+px-/,
                    "/1200px-"
                  );
                } else if (page.originalimage && page.originalimage.source) {
                  imageUrl = page.originalimage.source;
                }
              }

              // If no image from Wikipedia, try Unsplash with event keywords
              if (!imageUrl) {
                const keywords = extractKeywords(event.text);
                imageUrl = await fetchUnsplashImage(keywords);
              }

              return {
                text: event.text,
                year: event.year,
                date: `${monthName} ${parseInt(day)}`,
                imageUrl,
              };
            })
          );

          setEvents(processedEvents.filter((e) => e.imageUrl)); // Only keep events with images
        }
      } catch (error) {
        console.error("Error fetching historical events:", error);
        // Fallback to a default event
        setEvents([
          {
            text: "Explore space history and significant moments in time.",
            year: new Date().getFullYear(),
            date: new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            }),
            imageUrl:
              "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1200",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalEvents();
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const currentEvent = events[currentIndex] || null;
  const backgroundImage = currentEvent?.imageUrl || null;
  const eventInfo = currentEvent
    ? {
        text: currentEvent.text,
        year: currentEvent.year,
        date: currentEvent.date,
      }
    : null;

  return {
    backgroundImage,
    eventInfo,
    isLoading,
    goToNext,
    goToPrevious,
    currentIndex,
    totalEvents: events.length,
  };
};

/**
 * Extract keywords from event text for image search
 */
const extractKeywords = (text) => {
  // Remove common words and extract meaningful terms
  const commonWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
  ];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter((word) => word.length > 3 && !commonWords.includes(word));

  return words.slice(0, 3).join(" ") || "space exploration history";
};

/**
 * Fetch image from Unsplash API
 */
const fetchUnsplashImage = async (query) => {
  try {
    // Using Unsplash Source API (no key required for basic usage)
    const searchQuery = encodeURIComponent(query);
    return `https://source.unsplash.com/1600x900/?${searchQuery},historic`;
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
    return "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1200";
  }
};

export default useHistoricalBackground;
