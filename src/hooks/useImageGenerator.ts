import { useState, useCallback } from "react";
import { generateImage as geminiGenerateImage } from "../lib/gemini";

const useImageGenerator = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setGeneratedImage(null);
    setError(null);
  }, []);

  const generateImage = useCallback(
    async ({ text, dataUrl }: { text?: string; dataUrl?: string }) => {
      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);

      try {
        const imageUrl = await geminiGenerateImage({ text, dataUrl });
        setGeneratedImage(imageUrl);
        return { success: true as const, imageUrl };
      } catch (err: any) {
        console.error(err);
        const errorMessage = `An error occurred: ${err.message}`;
        setError(errorMessage);
        return { success: false as const, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    generatedImage,
    isLoading,
    error,
    generateImage,
    resetState,
    setError,
  } as const;
};

export default useImageGenerator;
