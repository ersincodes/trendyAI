import PropTypes from "prop-types";
import ImageUploader from "./ImageUploader";
import PromptSelector from "./PromptSelector";
import PromptEnter from "./PromptEnter";
import GenerateButton from "./GenerateButton";

/**
 * Reusable input panel component for both Trend and Custom tabs
 * Follows DRY principle - eliminates duplicated tab content structure
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

InputPanel.propTypes = {
  mode: PropTypes.oneOf(["trend", "custom"]).isRequired,
  selectedImage: PropTypes.string,
  onImageUpload: PropTypes.func.isRequired,
  prompts: PropTypes.array,
  selectedPromptId: PropTypes.number,
  onPromptSelect: PropTypes.func,
  customPrompt: PropTypes.string,
  onCustomPromptChange: PropTypes.func,
  onGenerate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default InputPanel;
