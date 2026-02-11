import { useEffect, useRef, useState } from "preact/hooks";
import useSWR from "swr";
import { PATH } from "@/constants";
import { type FetchBlogsResult, fetchBlogs } from "@/hooks/fetchBlogs";

/** 検索窓の空白を+に変換して q パラメータ用の文字列を生成 */
function toQueryString(value: string): string {
	return value.trim().replace(/\s+/g, "+");
}

/** URL の q パラメータを検索窓表示用に変換（+ → 空白） */
function fromQueryString(q: string): string {
	return q.replace(/\+/g, " ");
}

export function useBlogList() {
	const searchParams = new URLSearchParams(window.location.search);
	const initialQ = searchParams.get("q") ?? "";
	const initialPage = Number(searchParams.get("page") ?? "1");

	const [query, setQuery] = useState(initialQ);
	const [inputValue, setInputValue] = useState(fromQueryString(initialQ));
	const [page, setPage] = useState(initialPage);
	const isFirstPageEffect = useRef(true);

	const handleSearchSubmit = () => {
		const formatted = toQueryString(inputValue);
		setQuery(formatted);
		setPage(1);
	};

	const handleTagClick = (tag: string) => {
		const tagQuery = `tag:${tag}`;
		setInputValue(tagQuery);
		setQuery(tagQuery);
		setPage(1);
	};

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);

		if (query) {
			params.set("q", query);
		} else {
			params.delete("q");
		}

		params.set("page", String(page));

		const newSearch = params.toString();
		const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}`;

		window.history.replaceState(null, "", newUrl);
	}, [query, page]);

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
		`${PATH.CMS.BLOGS}?q=${encodeURIComponent(query)}&page=${page}&limit=9`,
		() => fetchBlogs({ q: query || undefined, page, limit: 9 }),
	);

	return {
		inputValue,
		setInputValue,
		page,
		setPage,
		handleSearchSubmit,
		handleTagClick,
		data,
		error,
		isLoading,
	};
}
