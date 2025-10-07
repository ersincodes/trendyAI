import { useState, useCallback } from "react";
import { generateText as geminiGenerateText } from "../lib/gemini";

/**
 * Custom hook to handle caption generation logic
 * Follows SRP and DRY - Centralizes all caption generation logic
 */
const useCaptionGenerator = () => {
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const buildCaptionPrompt = useCallback((input) => {
    const basePrompt = "Create a catchy and witty Instagram caption";
    const suffix =
      "Add popular related English hashtags at the end. Keep it short and engaging.";

    if (input.type === "theme") {
      return `${basePrompt} that matches the following theme. ${suffix} Theme: ${input.value}`;
    }

    if (input.type === "custom") {
      return `${basePrompt} based on the following prompt. ${suffix} Prompt: ${input.value}`;
    }

    throw new Error("Invalid caption input type");
  }, []);

  const generateCaption = useCallback(
    async (input) => {
      if (!input?.value) return { success: false, error: "No input provided" };

      setIsLoading(true);
      setGeneratedCaption("");

      try {
        const captionPrompt = buildCaptionPrompt(input);
        const text = await geminiGenerateText({ text: captionPrompt });
        setGeneratedCaption(text);
        return { success: true, caption: text };
      } catch (err) {
        console.error(err);
        const errorMessage = `An error occurred while generating the caption: ${err.message}`;
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [buildCaptionPrompt]
  );

  const copyCaption = useCallback(async (caption) => {
    if (!caption) return false;

    try {
      await navigator.clipboard.writeText(caption);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (err) {
      console.error("Failed to copy caption:", err);
      return false;
    }
  }, []);

  const resetState = useCallback(() => {
    setGeneratedCaption("");
    setIsCopied(false);
  }, []);

  return {
    generatedCaption,
    isLoading,
    isCopied,
    generateCaption,
    copyCaption,
    resetState,
  };
};

export default useCaptionGenerator;
