import { useState, useCallback } from "react";
import { generateText as geminiGenerateText } from "../lib/gemini";
import type { CaptionInput } from "../types";

const useCaptionGenerator = () => {
  const [generatedCaption, setGeneratedCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buildCaptionPrompt = useCallback((input: CaptionInput) => {
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
    async (input: CaptionInput) => {
      if (!input?.value)
        return { success: false as const, error: "No input provided" };

      setIsLoading(true);
      setGeneratedCaption("");
      setError(null);

      try {
        const captionPrompt = buildCaptionPrompt(input);
        const text = await geminiGenerateText({ text: captionPrompt });
        setGeneratedCaption(text);
        return { success: true as const, caption: text };
      } catch (err: any) {
        console.error(err);
        const errorMessage = `An error occurred while generating the caption: ${err.message}`;
        setError(errorMessage);
        return { success: false as const, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [buildCaptionPrompt]
  );

  const copyCaption = useCallback(async (caption: string): Promise<boolean> => {
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
    error,
    generateCaption,
    copyCaption,
    resetState,
  } as const;
};

export default useCaptionGenerator;
