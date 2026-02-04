import type { FetchBlogsResult } from "@/hooks/fetchBlogs";
import BlogCard from "@/components/ui/BlogCard";
import type { BlogItem } from "@/types";
import SearchForm from "./SearchForm";
import Pagination from "./Pagination";
import { useBlogList } from "./useBlogList";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  const { blogs, totalPages, currentPage } = data as FetchBlogsResult;

  return (
    <>
      <SearchForm
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSearchSubmit}
      />

      <section
        id="blogs"
        className="grid md:grid-cols-3 grid-cols-1 gap-4 py-6"
      >
        {blogs.map((blog: BlogItem) => (
          <BlogCard key={blog.id ?? blog.link} blog={blog} />
        ))}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setPage}
      />
    </>
  );
}
