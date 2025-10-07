import type { Prompt } from "../types";

type Props = {
  prompts: Prompt[];
  selectedPromptId?: number | null;
  onSelect: (id: number) => void;
};

const PromptSelector = ({ prompts, selectedPromptId, onSelect }: Props) => (
  <div>
    <h2 className="text-2xl font-bold mb-4 border-b-2 border-blue-500 pb-2">
      2. Choose a Style
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => onSelect(prompt.id)}
          className={`p-3 text-center rounded-lg transition-all duration-200 text-sm font-semibold ${
            selectedPromptId === prompt.id
              ? "bg-blue-600 text-white shadow-lg ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-500"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          aria-pressed={selectedPromptId === prompt.id}>
          {prompt.title}
        </button>
      ))}
    </div>
  </div>
);

export default PromptSelector;
