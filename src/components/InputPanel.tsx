import ImageUploader from "./ImageUploader";
import PromptSelector from "./PromptSelector";
import PromptEnter from "./PromptEnter";
import GenerateButton from "./GenerateButton";
import type { Prompt } from "../types";
import { useTranslation } from "react-i18next";

type Props =
  | {
      mode: "trend";
      selectedImage?: string | null;
      onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
      prompts: Prompt[];
      selectedPromptId?: number | null;
      onPromptSelect: (id: number | null) => void;
      onGenerate: () => void;
      isLoading: boolean;
      isDisabled: boolean;
    }
  | {
      mode: "custom";
      selectedImage?: string | null;
      onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
      customPrompt: string;
      onCustomPromptChange: (value: string) => void;
      onGenerate: () => void;
      isLoading: boolean;
      isDisabled: boolean;
    };

const InputPanel = (props: Props) => {
  const isTrendMode = props.mode === "trend";
  const { t } = useTranslation();
  const buttonLabel = props.isLoading
    ? t("common.generating")
    : isTrendMode
    ? t("input.transformImage")
    : t("input.generate");

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-6">
      <ImageUploader
        selectedImage={props.selectedImage ?? undefined}
        onChange={props.onImageUpload}
      />

      {isTrendMode ? (
        <PromptSelector
          prompts={(props as any).prompts}
          selectedPromptId={(props as any).selectedPromptId ?? undefined}
          onSelect={(props as any).onPromptSelect}
        />
      ) : (
        <PromptEnter
          value={(props as any).customPrompt}
          onChange={(props as any).onCustomPromptChange}
        />
      )}

      <GenerateButton
        onClick={props.onGenerate}
        isDisabled={props.isDisabled}
        label={buttonLabel}
      />
    </div>
  );
};

export default InputPanel;
