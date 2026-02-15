import BlogCard from "@/components/ui/BlogCard/index.tsx";
import type { BlogItem } from "@/types";
import LoadingView from "./LoadingView";
import NoDataView from "./NoDataView";
import Pagination from "./Pagination";

type Props = {
	blogs: BlogItem[];
	isLoading: boolean;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export default function BlogListWithPagination({
	blogs,
	isLoading,
	currentPage,
	totalPages,
	onPageChange,
}: Props) {
	return (
		<>
			<Pagination currentPage={currentPage} totalPages={totalPages} onChange={onPageChange} />
			{isLoading ? (
				<LoadingView />
			) : blogs.length === 0 ? (
				<NoDataView />
			) : (
				<div className="grid grid-cols-1 gap-4 py-3 md:grid-cols-3">
					{blogs.map((blog: BlogItem) => (
						<BlogCard key={blog.id} blog={blog} />
					))}
				</div>
			)}
			<Pagination currentPage={currentPage} totalPages={totalPages} onChange={onPageChange} />
		</>
	);
}
