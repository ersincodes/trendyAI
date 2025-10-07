export type Prompt = {
  id: number;
  title: string;
  prompt: string;
};

export type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

export type CaptionInput =
  | { type: "theme"; value: string }
  | { type: "custom"; value: string };

export type GenerateImageArgs = {
  text?: string;
  dataUrl?: string;
  inlineData?: { mimeType: string; data: string };
};

export type GenerateResult<T> =
  | { success: true; result: T }
  | { success: false; error: string };

export type SocialImg = {
  name: string;
  imgPath: string;
  url: string;
};
