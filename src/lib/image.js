// Image helpers for validation, reading files, and data URL parsing

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB

export const isFileTooLarge = (file, maxBytes = MAX_IMAGE_BYTES) => {
  if (!file) return false;
  return file.size > maxBytes;
};

export const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

export const parseDataUrl = (dataUrl) => {
  if (!dataUrl) return { mimeType: null, base64: null };
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  return {
    mimeType: match?.[1] || "image/jpeg",
    base64: match?.[2] || null,
  };
};
