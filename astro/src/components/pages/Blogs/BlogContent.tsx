import BlogListWithPagination from "./BlogListWithPagination";
import LoadingView from "./LoadingView";
import SearchForm from "./SearchForm";
import { useBlogList } from "./useBlogList";

export default function BlogContent() {
	const { inputValue, setInputValue, setPage, handleSearchSubmit, data, error, isLoading } =
		useBlogList();

	return (
		<section id="blogs">
			<SearchForm value={inputValue} onChange={setInputValue} onSubmit={handleSearchSubmit} />
			{error && <div>Error: {error.message}</div>}
			{isLoading && !data && <LoadingView />}
			{data?.status === "success" && (
				<BlogListWithPagination
					blogs={data.blogs}
					isLoading={isLoading}
					currentPage={data.currentPage}
					totalPages={data.totalPages}
					onPageChange={setPage}
				/>
			)}
		</section>
	);
}
