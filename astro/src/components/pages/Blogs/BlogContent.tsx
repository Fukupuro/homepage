import BlogCard from "@/components/ui/BlogCard";
import type { BlogItem } from "@/types";
import LoadingView from "./LoadingView";
import NoDataView from "./NoDataView";
import Pagination from "./Pagination";
import SearchForm from "./SearchForm";
import { useBlogList } from "./useBlogList";

export default function BlogContent() {
	const { inputValue, setInputValue, setPage, handleSearchSubmit, data, error, isLoading } =
		useBlogList();

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const { blogs, totalPages, currentPage } = data ?? { blogs: [], totalPages: 0, currentPage: 1 };

	return (
		<section id="blogs">
			<SearchForm value={inputValue} onChange={setInputValue} onSubmit={handleSearchSubmit} />

			<Pagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
			<div>
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
			</div>
			<Pagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
		</section>
	);
}
