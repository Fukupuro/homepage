import useSWR from "swr";
import { fetchBlogs } from "@/hooks/fetchBlogs";
import BlogCard from "@/components/ui/BlogCard";
import type { BlogItem } from "@/types";

export default function BlogContent() {
  const q = new URLSearchParams(window.location.search).get("q") ?? undefined;
  const tag = new URLSearchParams(window.location.search).get("tag") ?? undefined;
  const page = Number(new URLSearchParams(window.location.search).get("page") ?? "1");

  const { data, error, isLoading } = useSWR(
    `/api/blogs?q=${q}&tag=${tag}&page=${page}&limit=9`,
    () => fetchBlogs({ q, tag, page, limit: 9 })
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  const { blogs, totalPages, currentPage } = data;

  return (
    <section
      id="blogs"
      className="grid md:grid-cols-3 grid-cols-1 gap-4 py-6"
    >
      {blogs.map((blog: BlogItem) => (
        <BlogCard key={blog.id ?? blog.link} blog={blog} />
      ))}
    </section>
  );
}
