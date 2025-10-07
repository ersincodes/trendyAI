import { useState, useCallback, useMemo } from "react";
import { PROMPTS } from "./constants/prompts.ts";
import ResultPanel from "./components/ResultPanel.tsx";
import TabView from "./components/TabView.tsx";
import InputPanel from "./components/InputPanel.tsx";
import PageHeader from "./components/PageHeader.tsx";
import Footer from "./components/Footer.tsx";
import BackgroundLayer from "./components/BackgroundLayer.tsx";
import { downloadDataUrl } from "./lib/io.ts";
import useImageUpload from "./hooks/useImageUpload.ts";
import useImageGenerator from "./hooks/useImageGenerator.ts";
import useCaptionGenerator from "./hooks/useCaptionGenerator.ts";
import type { Prompt } from "./types";

const App = () => {
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");

  const imageUpload = useImageUpload();
  const imageGenerator = useImageGenerator();
  const captionGenerator = useCaptionGenerator();

  const selectedPrompt = useMemo<Prompt | undefined>(
    () => PROMPTS.find((p) => p.id === selectedPromptId),
    [selectedPromptId]
  );

  const error =
    imageUpload.error || imageGenerator.error || captionGenerator.error;

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      await imageUpload.handleImageUpload(event);
      imageGenerator.resetState();
      captionGenerator.resetState();
    },
    [imageUpload, imageGenerator, captionGenerator]
  );

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

  const handleCopyCaption = useCallback(async () => {
    const success = await captionGenerator.copyCaption(
      captionGenerator.generatedCaption
    );
    if (!success) {
      imageGenerator.setError("Failed to copy text to clipboard.");
    }
  }, [captionGenerator, imageGenerator]);

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

  const renderTrendTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <InputPanel
        mode="trend"
        selectedImage={imageUpload.selectedImage ?? undefined}
        onImageUpload={handleImageUpload}
        prompts={PROMPTS}
        selectedPromptId={selectedPromptId ?? undefined}
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
        error={error ?? undefined}
        generatedImage={imageGenerator.generatedImage ?? undefined}
        generatedCaption={captionGenerator.generatedCaption || undefined}
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
        selectedImage={imageUpload.selectedImage ?? undefined}
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
        error={error ?? undefined}
        generatedImage={imageGenerator.generatedImage ?? undefined}
        generatedCaption={captionGenerator.generatedCaption || undefined}
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
              { id: "trend", label: "Trend", content: renderTrendTab() },
              { id: "custom", label: "Custom", content: renderCustomTab() },
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
