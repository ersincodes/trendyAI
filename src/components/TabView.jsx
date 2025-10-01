import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TabView = ({ tabs = [], initialActiveId, onChange }) => {
  const validTabs = useMemo(
    () => tabs.filter((t) => t && t.id && t.label),
    [tabs]
  );
  const defaultActiveId = useMemo(() => {
    if (initialActiveId && validTabs.some((t) => t.id === initialActiveId)) {
      return initialActiveId;
    }
    return validTabs[0]?.id || null;
  }, [initialActiveId, validTabs]);

  const [activeId, setActiveId] = useState(defaultActiveId);
  const tabButtonRefs = useRef([]);

  useEffect(() => {
    setActiveId(defaultActiveId);
  }, [defaultActiveId]);

  const handleSelect = useCallback(
    (id, index) => {
      if (!id) return;
      setActiveId(id);
      if (typeof onChange === "function") onChange(id);
      const btn = tabButtonRefs.current[index];
      if (btn) btn.focus();
    },
    [onChange]
  );

  const focusTabByIndex = useCallback(
    (index) => {
      if (index < 0 || index >= validTabs.length) return;
      const id = validTabs[index].id;
      setActiveId(id);
      const btn = tabButtonRefs.current[index];
      if (btn) btn.focus();
      if (typeof onChange === "function") onChange(id);
    },
    [onChange, validTabs]
  );

  const handleKeyDown = useCallback(
    (event, index) => {
      const key = event.key;
      if (key === "ArrowRight") {
        event.preventDefault();
        const next = (index + 1) % validTabs.length;
        focusTabByIndex(next);
        return;
      }
      if (key === "ArrowLeft") {
        event.preventDefault();
        const prev = (index - 1 + validTabs.length) % validTabs.length;
        focusTabByIndex(prev);
        return;
      }
      if (key === "Home") {
        event.preventDefault();
        focusTabByIndex(0);
        return;
      }
      if (key === "End") {
        event.preventDefault();
        focusTabByIndex(validTabs.length - 1);
      }
    },
    [focusTabByIndex, validTabs.length]
  );

  if (validTabs.length === 0) return null;

  const activeIndex = validTabs.findIndex((t) => t.id === activeId);
  const activeTab = activeIndex >= 0 ? validTabs[activeIndex] : validTabs[0];

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex items-end justify-center gap-2 border-b border-gray-700">
        {validTabs.map((tab, index) => {
          const isSelected = tab.id === activeTab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => (tabButtonRefs.current[index] = el)}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleSelect(tab.id, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              title={tab.label}
              className="relative -mb-px rounded-t-lg px-4 py-2 text-sm font-medium text-gray-400 border-b-2 border-transparent hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 aria-selected:text-white aria-selected:border-blue-500 aria-selected:bg-gray-800">
              <span className="select-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`panel-${activeTab.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab.id}`}
        tabIndex={0}
        className="mt-4">
        {activeTab.content}
      </div>
    </div>
  );
};

export default TabView;
