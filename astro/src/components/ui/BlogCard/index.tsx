import dayjs from "dayjs";
import DefaultImage from "@/assets/images/default-image.jpeg";
import type { BlogItem } from "@/types";
import Tags from "../TagList/index.astro";
import { PATH } from "@/constants";

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
				<a href={`${PATH.BLOGS}/${blog.id}`} target="_blank" rel="noopener noreferrer">
					<h3 className="line-clamp-3 font-bold text-gray-800 text-lg hover:underline">
						{blog.title}
					</h3>
				</a>
				<Tags tags={blog.tags} />
			</div>
		</div>
	);
}
