import { useEffect, useRef, useState } from "preact/hooks";
import useSWR from "swr";
import { fetchBlogs, type FetchBlogsResult } from "@/hooks/fetchBlogs";

export function useBlogList() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialQ = searchParams.get("q") ?? "";
  const initialTag = searchParams.get("tag") ?? undefined;
  const initialPage = Number(searchParams.get("page") ?? "1");

  const [query, setQuery] = useState(initialQ);
  const [inputValue, setInputValue] = useState(initialQ);
  const [page, setPage] = useState(initialPage);
  const [tag] = useState(initialTag);
  const isFirstPageEffect = useRef(true);

  const handleSearchSubmit = () => {
    setQuery(inputValue.trim());
    setPage(1);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }

    params.set("page", String(page));

    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${
      newSearch ? `?${newSearch}` : ""
    }`;

    window.history.replaceState(null, "", newUrl);
  }, [query, tag, page]);

  useEffect(() => {
    if (isFirstPageEffect.current) {
      isFirstPageEffect.current = false;
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const { data, error, isLoading } = useSWR<FetchBlogsResult>(
    `/api/blogs?q=${query}&tag=${tag ?? ""}&page=${page}&limit=9`,
    () => fetchBlogs({ q: query || undefined, tag, page, limit: 9 })
  );

  return {
    inputValue,
    setInputValue,
    page,
    setPage,
    handleSearchSubmit,
    data,
    error,
    isLoading,
  };
}

