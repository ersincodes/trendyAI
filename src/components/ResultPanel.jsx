import LoadingSpinner from "./LoadingSpinner";
import { DownloadIcon, CopyIcon, CheckIcon } from "../assets/icons/Icons";

const ResultPanel = ({
  isLoading,
  error,
  generatedImage,
  generatedCaption,
  isCaptionLoading,
  captionCopied,
  onDownload,
  onGenerateCaption,
  onCopyCaption,
}) => (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center min-h-[400px] lg:min-h-0">
    <h2 className="text-2xl font-bold mb-4 self-start border-b-2 border-blue-500 pb-2">
      3. Result
    </h2>
    <div className="w-full h-full flex items-center justify-center">
      {isLoading && <LoadingSpinner />}
      {error && (
        <p className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>
      )}
      {!isLoading && !error && generatedImage && (
        <div className="w-full flex flex-col items-center gap-4">
          <img
            src={generatedImage}
            alt="Generated image"
            className="max-w-full max-h-[60vh] rounded-lg object-contain shadow-2xl"
          />
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onDownload}
              title="Download image"
              className="py-2 px-6 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 flex items-center gap-2">
              <DownloadIcon /> Download
            </button>
            <button
              onClick={onGenerateCaption}
              disabled={isCaptionLoading || !!generatedCaption}
              title="Generate Instagram Caption with AI"
              className="py-2 px-6 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2">
              {isCaptionLoading
                ? "Generating..."
                : "✨ Generate Instagram Caption"}
            </button>
          </div>
          {isCaptionLoading && (
            <p className="text-gray-400 mt-2 text-sm">
              The AI is gathering inspiration...
            </p>
          )}
          {generatedCaption && (
            <div className="mt-4 w-full p-4 bg-gray-900/50 rounded-lg border border-gray-700 relative">
              <p className="text-gray-300 whitespace-pre-wrap text-sm">
                {generatedCaption}
              </p>
              <button
                onClick={onCopyCaption}
                title="Copy text"
                className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded text-xs flex items-center gap-1 transition-all">
                {captionCopied ? (
                  <>
                    <CheckIcon /> Copied
                  </>
                ) : (
                  <>
                    <CopyIcon /> Copy
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
      {!isLoading && !error && !generatedImage && (
        <p className="text-gray-500">Your generated image will appear here.</p>
      )}
    </div>
  </div>
);

export default ResultPanel;
