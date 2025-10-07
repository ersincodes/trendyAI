import { useState, useCallback } from "react";
import { isFileTooLarge, readFileAsDataUrl } from "../lib/image";

const useImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return { success: false as const };

      if (isFileTooLarge(file)) {
        const errorMessage =
          "File size exceeds 10MB. Please upload a smaller image.";
        setError(errorMessage);
        return { success: false as const, error: errorMessage };
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        setSelectedImage(dataUrl);
        setError(null);
        return { success: true as const, dataUrl };
      } catch (err) {
        const errorMessage = "Failed to read the image file. Please try again.";
        setError(errorMessage);
        return { success: false as const, error: errorMessage };
      }
    },
    []
  );

  const clearImage = useCallback(() => {
    setSelectedImage(null);
    setError(null);
  }, []);

  return {
    selectedImage,
    error,
    handleImageUpload,
    clearImage,
    setError,
  } as const;
};

export default useImageUpload;
