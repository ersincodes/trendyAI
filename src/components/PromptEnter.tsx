import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

const PromptEnter = ({ value, onChange, maxLength = 1000 }: Props) => {
  const remainingChars = useMemo(() => {
    if (!value) return maxLength;
    return Math.max(0, maxLength - value.length);
  }, [value, maxLength]);

  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3 border-b-2 border-blue-500 pb-2">
        {t("steps.enterPromptTitle")}
      </h2>
      <label htmlFor="custom-prompt" className="sr-only">
        {t("common.enterPromptLabel")}
      </label>
      <textarea
        id="custom-prompt"
        aria-label={t("common.enterPromptLabel")!}
        placeholder={t("common.enterPromptPlaceholder")!}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        rows={6}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none p-3 text-gray-200 placeholder-gray-500"
      />
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-gray-400">
          {t("common.maxCharacters", { max: maxLength })}
        </span>
        <span className="text-gray-500" aria-live="polite">
          {t("common.remainingLeft", { count: remainingChars })}
        </span>
      </div>
    </div>
  );
};

export default PromptEnter;
