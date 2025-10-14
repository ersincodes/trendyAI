import LoadingSpinner from "./LoadingSpinner";
import { DownloadIcon, CopyIcon, CheckIcon } from "../assets/icons/Icons";
import { useTranslation } from "react-i18next";

type Props = {
  isLoading: boolean;
  error?: string | null;
  generatedImage?: string | null;
  generatedCaption?: string | null;
  isCaptionLoading: boolean;
  captionCopied: boolean;
  onDownload: () => void;
  onGenerateCaption: () => void;
  onCopyCaption: () => void;
};

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
}: Props) => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center min-h-[400px] lg:min-h-0">
      <h2 className="text-2xl font-bold mb-4 self-start border-b-2 border-blue-500 pb-2">
        {t("steps.resultTitle")}
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
              alt={t("common.generatedImageAlt")!}
              className="max-w-full max-h-[60vh] rounded-lg object-contain shadow-2xl"
            />
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={onDownload}
                title={t("common.downloadImageTitle")!}
                className="py-2 px-6 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 flex items-center gap-2">
                <DownloadIcon /> {t("common.download")}
              </button>
              <button
                onClick={onGenerateCaption}
                disabled={isCaptionLoading || !!generatedCaption}
                title={t("common.generateCaptionTitle")!}
                className="py-2 px-6 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2">
                {isCaptionLoading
                  ? t("common.generating")
                  : t("common.generateCaption")}
              </button>
            </div>
            {isCaptionLoading && (
              <p className="text-gray-400 mt-2 text-sm">
                {t("common.aiInspiration")}
              </p>
            )}
            {generatedCaption && (
              <div className="mt-4 w-full p-4 bg-gray-900/50 rounded-lg border border-gray-700 relative">
                <p className="text-gray-300 whitespace-pre-wrap text-sm">
                  {generatedCaption}
                </p>
                <button
                  onClick={onCopyCaption}
                  title={t("common.copyText")!}
                  className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded text-xs flex items-center gap-1 transition-all">
                  {captionCopied ? (
                    <>
                      <CheckIcon /> {t("common.copied")}
                    </>
                  ) : (
                    <>
                      <CopyIcon /> {t("common.copy")}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
        {!isLoading && !error && !generatedImage && (
          <p className="text-gray-500">
            {t("common.generatedImagePlaceholder")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultPanel;
