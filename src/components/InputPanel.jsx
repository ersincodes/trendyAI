import ImageUploader from "./ImageUploader";
import PromptSelector from "./PromptSelector";
import PromptEnter from "./PromptEnter";
import GenerateButton from "./GenerateButton";

/**
 * Reusable input panel component for both Trend and Custom tabs
 * Follows DRY principle - eliminates duplicated tab content structure
 *
 * @param {Object} props
 * @param {string} props.mode - Mode of the panel ("trend" or "custom")
 * @param {string} props.selectedImage - Selected image URL
 * @param {Function} props.onImageUpload - Handler for image upload
 * @param {Array} props.prompts - Array of prompt options (for trend mode)
 * @param {number} props.selectedPromptId - Selected prompt ID (for trend mode)
 * @param {Function} props.onPromptSelect - Handler for prompt selection (for trend mode)
 * @param {string} props.customPrompt - Custom prompt text (for custom mode)
 * @param {Function} props.onCustomPromptChange - Handler for custom prompt change (for custom mode)
 * @param {Function} props.onGenerate - Handler for generate button click
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isDisabled - Disabled state
 */
const InputPanel = ({
  mode,
  selectedImage,
  onImageUpload,
  prompts,
  selectedPromptId,
  onPromptSelect,
  customPrompt,
  onCustomPromptChange,
  onGenerate,
  isLoading,
  isDisabled,
}) => {
  const isTrendMode = mode === "trend";
  const buttonLabel = isLoading
    ? "Generating..."
    : isTrendMode
    ? "Transform Image"
    : "Generate";

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-6">
      <ImageUploader selectedImage={selectedImage} onChange={onImageUpload} />

      {isTrendMode ? (
        <PromptSelector
          prompts={prompts}
          selectedPromptId={selectedPromptId}
          onSelect={onPromptSelect}
        />
      ) : (
        <PromptEnter value={customPrompt} onChange={onCustomPromptChange} />
      )}

      <GenerateButton
        onClick={onGenerate}
        isDisabled={isDisabled}
        label={buttonLabel}
      />
    </div>
  );
};

export default InputPanel;
