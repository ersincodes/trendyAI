import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const MODEL_PATH = "gemini-2.5-flash-image-preview:generateContent";

const getApiKey = (res: VercelResponse): string | null => {
  const key = (process.env.GOOGLE_API_KEY || "").trim();
  if (key) return key;
  res
    .status(500)
    .json({ error: "Server misconfiguration: missing GOOGLE_API_KEY." });
  return null;
};

const parseBody = (req: VercelRequest): any => {
  if (req.body && typeof req.body === "object") return req.body;
  if (!req.body) return {};
  try {
    return JSON.parse(req.body as string);
  } catch {
    return {};
  }
};

const buildContents = (parts: unknown[]) => ({ contents: [{ parts }] });

const toInlineData = (
  dataUrl?: string | null
): { mimeType: string; data: string } | null => {
  if (!dataUrl) return null;
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!match) return null;
  const mimeType = match?.[1] || "image/jpeg";
  const data = match?.[2] || "";
  if (!data) return null;
  return { mimeType, data };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = getApiKey(res);
  if (!apiKey) return;

  const body = parseBody(req);
  const text =
    typeof body?.text === "string" && body.text.trim().length > 0
      ? body.text.trim()
      : undefined;

  const inlineData =
    body?.inlineData && typeof body.inlineData === "object"
      ? {
          mimeType: String(body.inlineData.mimeType || "image/jpeg"),
          data: String(body.inlineData.data || ""),
        }
      : toInlineData(body?.dataUrl);

  if (!text && (!inlineData || !inlineData.data)) {
    res.status(400).json({
      error:
        "Please provide text, dataUrl, or inlineData to generate an image.",
    });
    return;
  }

  const parts: any[] = [];
  if (text) parts.push({ text });
  if (inlineData) parts.push({ inlineData });

  const url = `${API_BASE}/models/${MODEL_PATH}?key=${apiKey}`;
  const payload = {
    ...buildContents(parts),
    generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message =
        errorData?.error?.message ||
        `Upstream error: ${response.status} ${response.statusText}`;
      res.status(response.status).json({ error: message });
      return;
    }

    const json = await response.json();
    const imageData =
      json?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)
        ?.inlineData?.data || null;

    if (imageData) {
      res.status(200).json({ image: `data:image/png;base64,${imageData}` });
      return;
    }

    const textFallback = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textFallback) {
      res.status(200).json({ textFallback });
      return;
    }

    res.status(502).json({
      error:
        "No valid image data received from the model. Please try again with a different input.",
    });
  } catch (err: any) {
    res.status(500).json({
      error: err?.message || "Unexpected error while contacting the model.",
    });
  }
}
