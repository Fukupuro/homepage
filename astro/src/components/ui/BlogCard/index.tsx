import dayjs from "dayjs";
import type React from "preact/compat";
import { PATH } from "@/constants";
import type { BlogItem } from "@/types";
import { blogCardStyles } from "./styles";

type Props = {
	blog: BlogItem;
};

export default function BlogCard({ blog }: Props) {
	return (
		<div className={blogCardStyles.container}>
			<img
				src={blog.thumbnail ?? PATH.IMAGES("default-thumbnail.jpg")}
				alt={blog.title}
				className={blogCardStyles.thumbnail}
			/>
			<div>
				<p className={blogCardStyles.publishedAt}>
					{dayjs(blog.published_at).format("YYYY-MM-DD")}
				</p>
				<a href={`${PATH.BLOGS}/${blog.id}`}>
					<h3 className={blogCardStyles.title}>{blog.title}</h3>
				</a>

				<div className={blogCardStyles.tags}>
					{blog.tags.map((tag) => (
						<a
							key={tag}
							className={blogCardStyles.tag}
							href={`${PATH.BLOGS}?q=tag:${encodeURIComponent(tag)}`}
						>
							<RiHashtag />
							<span className={blogCardStyles.tagText}>{tag}</span>
						</a>
					))}
				</div>
			</div>
		</div>
	);
}

const RiHashtag = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={16}
			height={16}
			viewBox="0 0 24 24"
			aria-hidden="true"
			{...props}
		>
			<path
				fill="currentColor"
				d="m7.784 14l.42-4H4V8h4.415l.525-5h2.011l-.525 5h3.989l.525-5h2.011l-.525 5H20v2h-3.784l-.42 4H20v2h-4.415l-.525 5h-2.011l.525-5H9.585l-.525 5H7.049l.525-5H4v-2zm2.011 0h3.99l.42-4h-3.99z"
			></path>
		</svg>
	);
};
