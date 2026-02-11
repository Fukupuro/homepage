import { Icon } from "@iconify/react";
import { PATH } from "@/constants";

type Props = {
	tags: string[];
};

export default function TagListClient({ tags }: Props) {
	if (tags.length === 0) {
		return null;
	}

	return (
		<div className="mt-2 flex flex-wrap gap-2">
			{tags.map((tag) => (
				<a
					key={tag}
					href={`${PATH.BLOGS}?q=tag:${encodeURIComponent(tag)}`}
					className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-600 text-sm transition-colors hover:bg-gray-200"
				>
					<Icon icon="ri:hashtag" className="h-4 w-4 text-gray-800" />
					<span>{tag}</span>
				</a>
			))}
		</div>
	);
}
