import { useState, useCallback, useMemo } from "react";
import { PROMPTS } from "./constants/prompts";
import ImageUploader from "./components/ImageUploader";
import PromptSelector from "./components/PromptSelector";
import ResultPanel from "./components/ResultPanel";
import { InstagramIcon } from "./components/icons/Icons";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [isCaptionLoading, setIsCaptionLoading] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const selectedPrompt = useMemo(() => {
    return PROMPTS.find((p) => p.id === selectedPromptId);
  }, [selectedPromptId]);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError("File size exceeds 10MB. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setGeneratedImage(null);
      setGeneratedCaption("");
      setError(null);
    };
    reader.readAsDataURL(file);
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
      const base64ImageData = selectedImage.split(",")[1];
      const mimeMatch = selectedImage.match(/^data:(.*?);base64,/);
      const mimeType = mimeMatch?.[1] || "image/jpeg";

      const payload = {
        contents: [
          {
            parts: [
              { text: selectedPrompt.prompt },
              { inlineData: { mimeType, data: base64ImageData } },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      };

      const apiKey = (import.meta.env.VITE_GOOGLE_API_KEY || "").trim();
      if (!apiKey) {
        throw new Error(
          "Missing API key. Please add VITE_GOOGLE_API_KEY to your .env file."
        );
      }
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error?.message || `API request failed: ${response.status}`
        );
      }

      const result = await response.json();
      const base64Data = result?.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData
      )?.inlineData?.data;

      if (base64Data) {
        setGeneratedImage(`data:image/png;base64,${base64Data}`);
      } else {
        const textResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        throw new Error(
          textResponse ||
            "No valid image data received from the API. Please try again with a different image."
        );
      }
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
      const payload = {
        contents: [{ parts: [{ text: captionPrompt }] }],
      };
      const apiKey = (import.meta.env.VITE_GOOGLE_API_KEY || "").trim();
      if (!apiKey) {
        throw new Error(
          "Missing API key. Please add VITE_GOOGLE_API_KEY to your .env file."
        );
      }
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error?.message || "Failed to generate the caption."
        );
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        setGeneratedCaption(text);
      } else {
        throw new Error("No valid text received from the API.");
      }
    } catch (err) {
      console.error(err);
      setError(
        `An error occurred while generating the caption: ${err.message}`
      );
    } finally {
      setIsCaptionLoading(false);
    }
  }, [selectedPrompt]);

  const handleCopyCaption = useCallback(() => {
    if (!generatedCaption) return;
    navigator.clipboard
      .writeText(generatedCaption)
      .then(() => {
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        try {
          const textArea = document.createElement("textarea");
          textArea.value = generatedCaption;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCaptionCopied(true);
          setTimeout(() => setCaptionCopied(false), 2000);
        } catch {
          setError("Failed to copy text to clipboard.");
        }
      });
  }, [generatedCaption]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;

    fetch(generatedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const safeTitle = (selectedPrompt?.title || "image")
          .toLowerCase()
          .replace(/\s+/g, "-");
        a.download = `trendy-ai-${safeTitle}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("Error during download:", err);
        setError(
          "An error occurred while downloading the image. Please try again."
        );
      });
  }, [generatedImage, selectedPrompt]);

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

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              disabled={!selectedImage || !selectedPromptId || isLoading}
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
        </main>
      </div>
    </div>
  );
};

export default App;
