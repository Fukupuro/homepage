import type { FetchBlogsResult } from "@/hooks/fetchBlogs";
import BlogCard from "@/components/ui/BlogCard";
import type { BlogItem } from "@/types";
import SearchForm from "./SearchForm";
import Pagination from "./Pagination";
import { useBlogList } from "./useBlogList";
import NoDataView from "./NoDataView";
import LoadingView from "./LoadingView";

export default function BlogContent() {
  const {
    inputValue,
    setInputValue,
    page,
    setPage,
    handleSearchSubmit,
    data,
    error,
    isLoading,
  } = useBlogList();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { blogs, totalPages, currentPage } = data ?? { blogs: [], totalPages: 0, currentPage: 1 };

  return (
    <section id="blogs">
      <SearchForm
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSearchSubmit}
      />
      <div className="py-6">
        {isLoading ? (
          <LoadingView />
        ) : blogs.length === 0 ? (
          <NoDataView />
        ) : (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 py-6">
            {blogs.map((blog: BlogItem) => (
              <BlogCard key={blog.id ?? blog.link} blog={blog} />
            ))}
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setPage}
      />
    </section>
  );
}
