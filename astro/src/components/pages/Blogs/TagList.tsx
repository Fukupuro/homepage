import { Icon } from "@iconify/react";
import { useState } from "preact/hooks";
import type { BlogTag } from "@/types";

type Props = {
	tags: BlogTag[] | undefined;
	onTagClick: (tag: string) => void;
};

export default function TagList({ tags, onTagClick }: Props) {
	const [isExpanded, setIsExpanded] = useState(false);

	if (!tags || tags.length === 0) {
		return null;
	}

	return (
		<div className="mt-4">
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-800"
			>
				<Icon
					icon={isExpanded ? "ri:arrow-up-s-line" : "ri:arrow-down-s-line"}
					className="h-5 w-5"
				/>
				<span>タグ一覧</span>
			</button>
			{isExpanded && (
				<div className="mt-2 flex flex-wrap gap-2">
					{tags.map((tag) => (
						<button
							key={tag.name}
							type="button"
							onClick={() => onTagClick(tag.name)}
							className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-600 text-sm transition-colors hover:bg-gray-200"
						>
							<Icon icon="ri:hashtag" className="h-4 w-4" />
							<span>{tag.name}</span>
							<span className="text-gray-400 text-xs">({tag.count})</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
