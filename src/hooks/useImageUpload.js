import { useState, useCallback } from "react";
import { isFileTooLarge, readFileAsDataUrl } from "../lib/image";

/**
 * Custom hook to handle image upload logic
 * Follows SRP - Single responsibility of managing image upload state
 */
const useImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return { success: false };

    if (isFileTooLarge(file)) {
      const errorMessage =
        "File size exceeds 10MB. Please upload a smaller image.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSelectedImage(dataUrl);
      setError(null);
      return { success: true, dataUrl };
    } catch (err) {
      const errorMessage = "Failed to read the image file. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

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
  };
};

export default useImageUpload;
