import { useState, useCallback, useMemo } from "react";
import { PROMPTS } from "./constants/prompts";
import ImageUploader from "./components/ImageUploader";
import PromptSelector from "./components/PromptSelector";
import PromptEnter from "./components/PromptEnter";
import ResultPanel from "./components/ResultPanel";
import TabView from "./components/TabView";
import { InstagramIcon } from "./components/icons/Icons";
import {
  generateImage as geminiGenerateImage,
  generateText as geminiGenerateText,
} from "./lib/gemini";
import { isFileTooLarge, readFileAsDataUrl } from "./lib/image";
import { copyToClipboard, downloadDataUrl } from "./lib/io";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [isCaptionLoading, setIsCaptionLoading] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  const selectedPrompt = useMemo(() => {
    return PROMPTS.find((p) => p.id === selectedPromptId);
  }, [selectedPromptId]);

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (isFileTooLarge(file)) {
      setError("File size exceeds 10MB. Please upload a smaller image.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSelectedImage(dataUrl);
      setGeneratedImage(null);
      setGeneratedCaption("");
      setError(null);
    } catch {
      setError("Failed to read the image file. Please try again.");
    }
  }, []);

  const handleGenerateImage = useCallback(async () => {
    if (!selectedImage || !selectedPrompt) {
      setError("Please upload an image and choose a style.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedCaption("");

    try {
      const imageUrl = await geminiGenerateImage({
        text: selectedPrompt.prompt,
        dataUrl: selectedImage,
      });
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError(`An error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage, selectedPrompt]);

  const handleGenerateCaption = useCallback(async () => {
    if (!selectedPrompt) return;
    setIsCaptionLoading(true);
    setGeneratedCaption("");
    setError(null);

    try {
      const captionPrompt = `Create a catchy and witty Instagram caption that matches the following theme. Add popular related English hashtags at the end. Keep it short and engaging. Theme: ${selectedPrompt.title}`;
      const text = await geminiGenerateText({ text: captionPrompt });
      setGeneratedCaption(text);
    } catch (err) {
      console.error(err);
      setError(
        `An error occurred while generating the caption: ${err.message}`
      );
    } finally {
      setIsCaptionLoading(false);
    }
  }, [selectedPrompt]);

  const handleGenerateCaptionForCustomPrompt = useCallback(async () => {
    const promptText = customPrompt.trim();
    if (!promptText) return;
    setIsCaptionLoading(true);
    setGeneratedCaption("");
    setError(null);

    try {
      const captionPrompt = `Create a catchy and witty Instagram caption based on the following prompt. Add popular related English hashtags at the end. Keep it short and engaging. Prompt: ${promptText}`;
      const text = await geminiGenerateText({ text: captionPrompt });
      setGeneratedCaption(text);
    } catch (err) {
      console.error(err);
      setError(
        `An error occurred while generating the caption: ${err.message}`
      );
    } finally {
      setIsCaptionLoading(false);
    }
  }, [customPrompt]);

  const handleCopyCaption = useCallback(async () => {
    if (!generatedCaption) return;
    const success = await copyToClipboard(generatedCaption);
    if (success) {
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2000);
    } else {
      setError("Failed to copy text to clipboard.");
    }
  }, [generatedCaption]);

  const handleDownload = useCallback(async () => {
    if (!generatedImage) return;

    const safeTitle = (selectedPrompt?.title || "image")
      .toLowerCase()
      .replace(/\s+/g, "-");
    const ok = await downloadDataUrl(
      generatedImage,
      `trendy-ai-${safeTitle}.png`
    );
    if (!ok) {
      setError(
        "An error occurred while downloading the image. Please try again."
      );
    }
  }, [generatedImage, selectedPrompt]);

  const handleGenerateFromCustomPrompt = useCallback(async () => {
    const hasImage = !!selectedImage;
    const hasPrompt = !!customPrompt.trim();
    if (!hasPrompt && !hasImage) {
      setError("Please enter a prompt or upload an image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedCaption("");

    try {
      const imageUrl = await geminiGenerateImage({
        text: hasPrompt ? customPrompt.trim() : undefined,
        dataUrl: hasImage ? selectedImage : undefined,
      });
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError(`An error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [customPrompt, selectedImage]);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">
            Trendy AI
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Upload your photo, choose your style, and catch viral trends!
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <p className="text-gray-500 text-sm">Created by Ersin Bahar.</p>
            <a
              href="https://www.instagram.com/ersinbahaar"
              target="_blank"
              rel="noopener noreferrer"
              title="Ersin Bahar Instagram"
              className="text-gray-400 hover:text-blue-500 transition-colors">
              <InstagramIcon />
            </a>
          </div>
        </header>

        <main>
          <TabView
            tabs={[
              {
                id: "trend",
                label: "Trend",
                content: (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-6">
                      <ImageUploader
                        selectedImage={selectedImage}
                        onChange={handleImageUpload}
                      />
                      <PromptSelector
                        prompts={PROMPTS}
                        selectedPromptId={selectedPromptId}
                        onSelect={setSelectedPromptId}
                      />
                      <button
                        onClick={handleGenerateImage}
                        disabled={
                          !selectedImage || !selectedPromptId || isLoading
                        }
                        className="w-full mt-auto py-3 px-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-200 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                        {isLoading ? "Generating..." : "Transform Image"}
                      </button>
                    </div>

                    <ResultPanel
                      isLoading={isLoading}
                      error={error}
                      generatedImage={generatedImage}
                      generatedCaption={generatedCaption}
                      isCaptionLoading={isCaptionLoading}
                      captionCopied={captionCopied}
                      onDownload={handleDownload}
                      onGenerateCaption={handleGenerateCaption}
                      onCopyCaption={handleCopyCaption}
                    />
                  </div>
                ),
              },
              {
                id: "custom",
                label: "Custom",
                content: (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-6">
                      <ImageUploader
                        selectedImage={selectedImage}
                        onChange={handleImageUpload}
                      />
                      <PromptEnter
                        value={customPrompt}
                        onChange={setCustomPrompt}
                      />
                      <button
                        onClick={handleGenerateFromCustomPrompt}
                        disabled={
                          (!customPrompt.trim() && !selectedImage) || isLoading
                        }
                        className="w-full mt-auto py-3 px-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-200 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                        {isLoading ? "Generating..." : "Generate"}
                      </button>
                    </div>

                    <ResultPanel
                      isLoading={isLoading}
                      error={error}
                      generatedImage={generatedImage}
                      generatedCaption={generatedCaption}
                      isCaptionLoading={isCaptionLoading}
                      captionCopied={captionCopied}
                      onDownload={handleDownload}
                      onGenerateCaption={handleGenerateCaptionForCustomPrompt}
                      onCopyCaption={handleCopyCaption}
                    />
                  </div>
                ),
              },
            ]}
            initialActiveId="joy"
          />
        </main>
      </div>
    </div>
  );
};

export default App;
