import { PATH } from "@/constants/path";
import { MOCK_BLOGS } from "@/constants";
import type { BlogItem } from "@/types";

export type FetchBlogsParams = {
	keyword?: string;
	tag?: string;
	limit?: number;
	page?: number;
};

export type FetchBlogsResult = {
	blogs: BlogItem[];
	totalPages: number;
	currentPage: number;
};

function getMockBlogs(params: FetchBlogsParams): FetchBlogsResult {
	const { keyword, tag, limit = 10, page = 1 } = params;

	let filtered = [...MOCK_BLOGS];

	if (keyword) {
		const k = keyword.toLowerCase();
		filtered = filtered.filter(
			(b) => b.title.toLowerCase().includes(k) || b.content.toLowerCase().includes(k),
		);
	}
	if (tag) {
		filtered = filtered.filter((b) =>
			b.tags.some((t) => t.name.toLowerCase() === tag.toLowerCase()),
		);
	}

	const safePage = Math.max(1, page);
	const start = (safePage - 1) * limit;
	const blogs = filtered.slice(start, start + limit);

	return { blogs, totalPages: Math.ceil(filtered.length / limit), currentPage: safePage };
}

async function fetchBlogsFromApi(params: FetchBlogsParams): Promise<FetchBlogsResult> {
	const { keyword, tag, limit = 10, page = 1 } = params;
	const searchParams = new URLSearchParams();

	if (keyword) searchParams.set("keyword", keyword);
	if (tag) searchParams.set("tag", tag);
	searchParams.set("limit", String(limit));
	searchParams.set("page", String(page));

	const url = `${PATH.SEARCH}?${searchParams.toString()}`;
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`Blog search failed: ${res.status} ${res.statusText}`);
	}

	const data = (await res.json()) as FetchBlogsResult;
	return data;
}

/**
 * ブログ検索
 * 開発環境ではモックデータを返します。
 */
export async function fetchBlogs(params: FetchBlogsParams = {}): Promise<FetchBlogsResult> {
	const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;
	const isTest =
		(typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") ||
		(typeof process !== "undefined" && process.env?.NODE_ENV === "test");

	try {
		if (isDev || isTest) {
			return getMockBlogs(params);
		}

		return await fetchBlogsFromApi(params);
	} catch (_error) {
		return getMockBlogs(params);
	}
}
