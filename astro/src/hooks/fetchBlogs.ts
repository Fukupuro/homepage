import { MOCK_BLOGS } from "@/constants";
import { PATH } from "@/constants/path";
import type { BlogItem } from "@/types";

export type FetchBlogsParams = {
	/** 検索クエリ（例: tag:JavaScript+使い方+author:山田太郎、空白は+に変換） */
	q?: string;
	limit?: number;
	page?: number;
};

/** q パラメータをパースして tag / author / キーワードを抽出 */
export function parseQuery(q: string): {
	tag?: string;
	author?: string;
	keywords: string[];
} {
	const parts = q.split("+").filter(Boolean);
	const result: { tag?: string; author?: string; keywords: string[] } = {
		keywords: [],
	};

	for (const part of parts) {
		if (part.startsWith("tag:")) {
			result.tag = part.slice(4).trim();
		} else if (part.startsWith("author:")) {
			result.author = part.slice(7).trim();
		} else if (part.trim()) {
			result.keywords.push(part.trim());
		}
	}

	return result;
}

/** APIレスポンスの型定義 */
export type SearchApiResponse = {
	posts: Array<{
		id: number | string;
		title: string;
		author: string;
		published_at: string;
		header_image_url: string | null;
		description?: string;
		tags: string[];
	}>;
	pagination: {
		total: number;
		page: number;
		per_page: number;
		total_pages: number;
	};
};

export type FetchBlogsResult = {
	blogs: BlogItem[];
	totalPages: number;
	currentPage: number;
};

/** APIレスポンスをBlogItemに変換 */
function transformApiResponseToBlogItem(
	post: SearchApiResponse["posts"][0],
	basePath: string = "/blogs",
): BlogItem {
	return {
		id: String(post.id),
		title: post.title,
		content: post.description || "",
		description: post.description,
		author: post.author,
		link: `${basePath}/${post.id}/`,
		thumbnail: post.header_image_url ?? undefined,
		published_at: post.published_at,
		tags: post.tags,
	};
}

function getMockBlogs(params: FetchBlogsParams): FetchBlogsResult {
	const { q, limit = 10, page = 1 } = params;

	let filtered = [...MOCK_BLOGS];

	if (q) {
		const { tag, author, keywords } = parseQuery(q);

		if (tag) {
			filtered = filtered.filter((b) => b.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
		}
		if (author) {
			filtered = filtered.filter((b) => b.author.toLowerCase().includes(author.toLowerCase()));
		}
		for (const kw of keywords) {
			const k = kw.toLowerCase();
			filtered = filtered.filter(
				(b) =>
					b.title.toLowerCase().includes(k) ||
					b.content.toLowerCase().includes(k) ||
					b.description?.toLowerCase().includes(k),
			);
		}
	}

	const safePage = Math.max(1, page);
	const start = (safePage - 1) * limit;
	const blogs = filtered.slice(start, start + limit);

	return { blogs, totalPages: Math.ceil(filtered.length / limit), currentPage: safePage };
}

async function fetchBlogsFromApi(params: FetchBlogsParams): Promise<FetchBlogsResult> {
	const { q, limit = 10, page = 1 } = params;
	const searchParams = new URLSearchParams();

	if (q) searchParams.set("q", q);
	searchParams.set("limit", String(limit));
	searchParams.set("page", String(page));

	const url = `${PATH.SEARCH}?${searchParams.toString()}`;
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`Blog search failed: ${res.status} ${res.statusText}`);
	}

	const data = (await res.json()) as SearchApiResponse;
	const blogs = data.posts.map((post) => transformApiResponseToBlogItem(post));
	const totalPages = data.pagination.total_pages;
	const currentPage = data.pagination.page;

	return { blogs, totalPages, currentPage };
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

/**
 * 全てのブログからユニークなタグのリストを取得
 */
export async function fetchAllTags(): Promise<string[]> {
	const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;
	const isTest =
		(typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") ||
		(typeof process !== "undefined" && process.env?.NODE_ENV === "test");

	try {
		if (isDev || isTest) {
			// モックデータから全てのタグを取得
			const allTags = new Set<string>();
			MOCK_BLOGS.forEach((blog) => {
				blog.tags.forEach((tag) => {
					allTags.add(tag);
				});
			});
			return Array.from(allTags).sort();
		}

		// APIから全てのブログを取得してタグを抽出
		// 注意: 実際のAPIでは全件取得のエンドポイントが必要かもしれません
		const result = await fetchBlogsFromApi({ limit: 1000, page: 1 });
		const allTags = new Set<string>();
		result.blogs.forEach((blog) => {
			blog.tags.forEach((tag) => {
				allTags.add(tag);
			});
		});
		return Array.from(allTags).sort();
	} catch (_error) {
		// エラー時はモックデータから取得
		const allTags = new Set<string>();
		MOCK_BLOGS.forEach((blog) => {
			blog.tags.forEach((tag) => {
				allTags.add(tag);
			});
		});
		return Array.from(allTags).sort();
	}
}
