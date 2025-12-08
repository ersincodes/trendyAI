export const generateText = async ({
  text,
}: {
  text: string;
}): Promise<string> => {
  if (!text) throw new Error("Text prompt is required");
  const response = await fetch("/api/gemini/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.error || `API request failed: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  if (!data?.text) throw new Error("No valid text received from the API.");
  return data.text;
};

export const generateImage = async ({
  text,
  dataUrl,
  inlineData,
}: {
  text?: string;
  dataUrl?: string;
  inlineData?: { mimeType: string; data: string };
}): Promise<string> => {
  const response = await fetch("/api/gemini/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, dataUrl, inlineData }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.error || `API request failed: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  if (data?.image) return data.image as string;
  if (data?.textFallback) throw new Error(data.textFallback);
  throw new Error(
    "No valid image data received from the API. Please try again with a different input."
  );
};

export const GeminiApi = {
  generateText,
  generateImage,
};

export default GeminiApi;
