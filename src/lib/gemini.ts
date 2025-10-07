const API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const MODELS = {
  image: "gemini-2.5-flash-image-preview:generateContent",
  text: "gemini-2.5-flash-preview-05-20:generateContent",
} as const;

const getApiKey = (): string => {
  const key = (import.meta.env.VITE_GOOGLE_API_KEY || "").trim();
  if (!key) {
    throw new Error(
      "Missing API key. Please add VITE_GOOGLE_API_KEY to your .env file."
    );
  }
  return key;
};

const postModel = async (modelPath: string, payload: unknown): Promise<any> => {
  const apiKey = getApiKey();
  const url = `${API_BASE}/models/${modelPath}?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.error?.message || `API request failed: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

const buildContents = (parts: unknown[]) => ({ contents: [{ parts }] });

const extractImageBase64FromResponse = (json: any): string | null => {
  return (
    json?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)
      ?.inlineData?.data || null
  );
};

const extractTextFromResponse = (json: any): string | null => {
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || null;
};

export const generateText = async ({
  text,
}: {
  text: string;
}): Promise<string> => {
  if (!text) throw new Error("Text prompt is required");
  const payload = buildContents([{ text }]);
  const json = await postModel(MODELS.text, payload);
  const resultText = extractTextFromResponse(json);
  if (!resultText) throw new Error("No valid text received from the API.");
  return resultText;
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
  const parts: any[] = [];
  if (text) parts.push({ text });
  if (inlineData) {
    parts.push({ inlineData });
  } else if (dataUrl) {
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
    const mimeType = match?.[1] || "image/jpeg";
    const data = match?.[2] || "";
    parts.push({ inlineData: { mimeType, data } });
  }
  const payload = {
    ...buildContents(parts),
    generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
  };
  const json = await postModel(MODELS.image, payload);
  const base64Data = extractImageBase64FromResponse(json);
  if (base64Data) {
    return `data:image/png;base64,${base64Data}`;
  }
  const textFallback = extractTextFromResponse(json);
  throw new Error(
    textFallback ||
      "No valid image data received from the API. Please try again with a different input."
  );
};

export const GeminiApi = {
  generateText,
  generateImage,
};

export default GeminiApi;
