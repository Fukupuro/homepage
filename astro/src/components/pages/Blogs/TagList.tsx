import { useState } from "preact/hooks";
import { Icon } from "@iconify/react";

type Props = {
  tags: string[];
  onTagClick: (tag: string) => void;
};

export default function TagList({ tags, onTagClick }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        <Icon
          icon={isExpanded ? "ri:arrow-up-s-line" : "ri:arrow-down-s-line"}
          className="w-5 h-5"
        />
        <span>タグ一覧</span>
      </button>
      {isExpanded && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick(tag)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Icon icon="ri:hashtag" className="w-4 h-4" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
