<div align="center">
  <h1>Trendy AI</h1>
  <p><strong>Turn any photo into viral, stylized images and auto-generate Instagram-ready captions using Google Gemini.</strong></p>
  <p>
    <img alt="Vite" src="https://img.shields.io/badge/build-Vite_7-646CFF" />
    <img alt="React" src="https://img.shields.io/badge/React-19-61dafb" />
    <img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-4-38B2AC" />
  </p>
</div>

## ✨ Features

- Upload an image and transform it into trendy visual styles powered by Gemini 2.5
- Curated style presets (e.g., 3D Toy Figurine, Polaroid Photo, Magazine Cover)
- One-click download of generated images
- AI-generated Instagram caption with popular hashtags
- Clean, responsive UI built with TailwindCSS

## 🧩 Tech Stack

- React 19 + Vite 7
- TailwindCSS 4
- Google Gemini API (image+text generation)

## 🚀 Quick Start

1. Clone and install

```bash
git clone https://github.com/ersincodes/trendyAI.git
cd trendyAI
npm install
```

2. Set your API key

```bash
cp .env.example .env
# edit .env and set VITE_GOOGLE_API_KEY=your_key
```

3. Run the app

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

## 🔑 Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```
VITE_GOOGLE_API_KEY=your_google_generative_language_api_key
```

This key is used by:

- Image generation: `gemini-2.5-flash-image-preview:generateContent`
- Caption generation: `gemini-2.5-flash-preview-05-20:generateContent`

## 🖼️ How It Works

1. Upload a photo (max 10MB). It’s read as Base64 in the browser.
2. Choose a style preset. Each preset provides a carefully crafted prompt.
3. Click “Transform Image”. The app sends the prompt + image to Gemini and receives a generated image.
4. Optionally, click “Generate Instagram Caption” to get a short caption with hashtags.
5. Download your final image.

## 📦 Project Structure

```
src/
  components/
    ImageUploader.jsx      # File input + preview
    PromptSelector.jsx     # Style preset grid
    ResultPanel.jsx        # Render result, download, caption actions
    icons/Icons.jsx        # Minimal icon set
  constants/prompts.js     # Curated prompt presets
  App.jsx                  # App state, API calls, UI layout
  index.css, App.css       # Tailwind layers
```

## 🧠 Notable Implementation Details

- Client-only implementation; no server required
- Strict 10MB image size check and friendly error handling
- Accessible buttons/labels and keyboard-friendly interactions
- Safe filename generation for downloads

## ❗ Important Notes

- Make sure your Google Generative Language API project has access to the referenced models.
- Never commit your real API key. Use `.env` and the provided `.gitignore` already excludes it.

## 🛠️ Scripts

```bash
npm run dev       # Start local dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Lint source files
```

## 📜 License

MIT © 2025 Ersin Bahar

## 👤 Author

Created by **Ersin Bahar** · Instagram: [@ersinbahaar](https://www.instagram.com/ersinbahaar)
