import { useState, useCallback } from "react";
import { generateImage as geminiGenerateImage } from "../lib/gemini";

/**
 * Custom hook to handle image generation logic
 * Follows SRP - Single responsibility of managing image generation state and logic
 */
const useImageGenerator = () => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetState = useCallback(() => {
    setGeneratedImage(null);
    setError(null);
  }, []);

  const generateImage = useCallback(async ({ text, dataUrl }) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await geminiGenerateImage({
        text,
        dataUrl,
      });
      setGeneratedImage(imageUrl);
      return { success: true, imageUrl };
    } catch (err) {
      console.error(err);
      const errorMessage = `An error occurred: ${err.message}`;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generatedImage,
    isLoading,
    error,
    generateImage,
    resetState,
    setError,
  };
};

export default useImageGenerator;
