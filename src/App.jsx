import { useState, useCallback, useMemo } from "react";
import { PROMPTS } from "./constants/prompts";
import ResultPanel from "./components/ResultPanel";
import TabView from "./components/TabView";
import InputPanel from "./components/InputPanel";
import PageHeader from "./components/PageHeader";
import Footer from "./components/Footer";
import BackgroundLayer from "./components/BackgroundLayer";
import { downloadDataUrl } from "./lib/io";
import useImageUpload from "./hooks/useImageUpload";
import useImageGenerator from "./hooks/useImageGenerator";
import useCaptionGenerator from "./hooks/useCaptionGenerator";

/**
 * Main App component - refactored to follow SOLID and DRY principles
 * - Uses custom hooks for separated concerns (SRP)
 * - Extracts reusable components (DRY)
 * - Delegates responsibilities to specialized modules (Dependency Inversion)
 */
const App = () => {
  // State management
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");

  // Custom hooks for different concerns (SRP)
  const imageUpload = useImageUpload();
  const imageGenerator = useImageGenerator();
  const captionGenerator = useCaptionGenerator();

  // Memoized values
  const selectedPrompt = useMemo(
    () => PROMPTS.find((p) => p.id === selectedPromptId),
    [selectedPromptId]
  );

  // Unified error state
  const error =
    imageUpload.error || imageGenerator.error || captionGenerator.error;

  // Handler for image upload with state reset
  const handleImageUpload = useCallback(
    async (event) => {
      await imageUpload.handleImageUpload(event);
      imageGenerator.resetState();
      captionGenerator.resetState();
    },
    [imageUpload, imageGenerator, captionGenerator]
  );

  // Handler for Trend tab image generation
  const handleGenerateImage = useCallback(async () => {
    if (!imageUpload.selectedImage || !selectedPrompt) {
      imageGenerator.setError("Please upload an image and choose a style.");
      return;
    }

    captionGenerator.resetState();
    await imageGenerator.generateImage({
      text: selectedPrompt.prompt,
      dataUrl: imageUpload.selectedImage,
    });
  }, [
    imageUpload.selectedImage,
    selectedPrompt,
    imageGenerator,
    captionGenerator,
  ]);

  // Handler for Custom tab image generation
  const handleGenerateFromCustomPrompt = useCallback(async () => {
    const hasImage = !!imageUpload.selectedImage;
    const hasPrompt = !!customPrompt.trim();

    if (!hasPrompt && !hasImage) {
      imageGenerator.setError("Please enter a prompt or upload an image.");
      return;
    }

    captionGenerator.resetState();
    await imageGenerator.generateImage({
      text: hasPrompt ? customPrompt.trim() : undefined,
      dataUrl: hasImage ? imageUpload.selectedImage : undefined,
    });
  }, [
    customPrompt,
    imageUpload.selectedImage,
    imageGenerator,
    captionGenerator,
  ]);

  // Handler for caption generation (Trend tab)
  const handleGenerateCaption = useCallback(async () => {
    if (!selectedPrompt) return;

    const result = await captionGenerator.generateCaption({
      type: "theme",
      value: selectedPrompt.title,
    });

    if (!result.success && result.error) {
      imageGenerator.setError(result.error);
    }
  }, [selectedPrompt, captionGenerator, imageGenerator]);

  // Handler for caption generation (Custom tab)
  const handleGenerateCaptionForCustomPrompt = useCallback(async () => {
    const promptText = customPrompt.trim();
    if (!promptText) return;

    const result = await captionGenerator.generateCaption({
      type: "custom",
      value: promptText,
    });

    if (!result.success && result.error) {
      imageGenerator.setError(result.error);
    }
  }, [customPrompt, captionGenerator, imageGenerator]);

  // Handler for caption copy
  const handleCopyCaption = useCallback(async () => {
    const success = await captionGenerator.copyCaption(
      captionGenerator.generatedCaption
    );
    if (!success) {
      imageGenerator.setError("Failed to copy text to clipboard.");
    }
  }, [captionGenerator, imageGenerator]);

  // Handler for image download
  const handleDownload = useCallback(async () => {
    if (!imageGenerator.generatedImage) return;

    const safeTitle = (selectedPrompt?.title || "image")
      .toLowerCase()
      .replace(/\s+/g, "-");
    const ok = await downloadDataUrl(
      imageGenerator.generatedImage,
      `trendy-ai-${safeTitle}.png`
    );

    if (!ok) {
      imageGenerator.setError(
        "An error occurred while downloading the image. Please try again."
      );
    }
  }, [imageGenerator, selectedPrompt]);

  // Render tabs content using InputPanel component (DRY)
  const renderTrendTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <InputPanel
        mode="trend"
        selectedImage={imageUpload.selectedImage}
        onImageUpload={handleImageUpload}
        prompts={PROMPTS}
        selectedPromptId={selectedPromptId}
        onPromptSelect={setSelectedPromptId}
        onGenerate={handleGenerateImage}
        isLoading={imageGenerator.isLoading}
        isDisabled={
          !imageUpload.selectedImage ||
          !selectedPromptId ||
          imageGenerator.isLoading
        }
      />
      <ResultPanel
        isLoading={imageGenerator.isLoading}
        error={error}
        generatedImage={imageGenerator.generatedImage}
        generatedCaption={captionGenerator.generatedCaption}
        isCaptionLoading={captionGenerator.isLoading}
        captionCopied={captionGenerator.isCopied}
        onDownload={handleDownload}
        onGenerateCaption={handleGenerateCaption}
        onCopyCaption={handleCopyCaption}
      />
    </div>
  );

  const renderCustomTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <InputPanel
        mode="custom"
        selectedImage={imageUpload.selectedImage}
        onImageUpload={handleImageUpload}
        customPrompt={customPrompt}
        onCustomPromptChange={setCustomPrompt}
        onGenerate={handleGenerateFromCustomPrompt}
        isLoading={imageGenerator.isLoading}
        isDisabled={
          (!customPrompt.trim() && !imageUpload.selectedImage) ||
          imageGenerator.isLoading
        }
      />
      <ResultPanel
        isLoading={imageGenerator.isLoading}
        error={error}
        generatedImage={imageGenerator.generatedImage}
        generatedCaption={captionGenerator.generatedCaption}
        isCaptionLoading={captionGenerator.isLoading}
        captionCopied={captionGenerator.isCopied}
        onDownload={handleDownload}
        onGenerateCaption={handleGenerateCaptionForCustomPrompt}
        onCopyCaption={handleCopyCaption}
      />
    </div>
  );

  return (
    <div className="relative text-white min-h-screen font-sans p-4 sm:p-6 lg:p-8 overflow-hidden">
      <BackgroundLayer />

      <div className="container mx-auto max-w-7xl relative z-10 pb-32">
        <PageHeader />

        <main>
          <TabView
            tabs={[
              {
                id: "trend",
                label: "Trend",
                content: renderTrendTab(),
              },
              {
                id: "custom",
                label: "Custom",
                content: renderCustomTab(),
              },
            ]}
            initialActiveId="joy"
          />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
