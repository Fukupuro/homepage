import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import DefaultImage from "@/assets/images/default-image.jpeg";
import { PATH } from "@/constants";
import type { BlogItem } from "@/types";

type Props = {
	blog: BlogItem;
};

export default function BlogCard({ blog }: Props) {
	return (
		<div className="flex flex-row-reverse justify-between rounded-md border bg-white p-4 shadow-md md:block">
			<img
				src={blog.thumbnail ?? DefaultImage.src}
				alt={blog.title}
				className="h-40 w-40 flex-shrink-0 object-cover md:h-40 md:w-80"
			/>
			<div>
				<p className="text-gray-500 text-sm">{dayjs(blog.published_at).format("YYYY-MM-DD")}</p>
				<a href={blog.link} target="_blank" rel="noopener noreferrer">
					<h3 className="line-clamp-3 font-bold text-gray-800 text-lg hover:underline">
						{blog.title}
					</h3>
				</a>
				<div className="mt-2 flex flex-wrap gap-2">
					{blog.tags.map((tag) => (
						<a
							key={tag}
							href={`${PATH.BLOGS}?q=tag:${encodeURIComponent(tag)}`}
							className="flex items-center"
						>
							<Icon icon="ri:hashtag" />
							<span className="text-gray-500 text-sm">{tag}</span>
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
