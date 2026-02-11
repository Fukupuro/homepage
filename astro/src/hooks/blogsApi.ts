import { PATH } from "@/constants/path";
import type { BlogItem } from "@/types/blogTag";

export type FetchBlogsParams = {
	q?: string;
	limit?: number;
	page?: number;
};

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

/** 検索APIレスポンスの型定義（Rails/CMS）
 * Rails 側の `/api/blogs` と同じ構造に揃えます。
 * { data: Blog[], meta: { current_page, total_pages, total_count, limit } }
 */
export type SearchPost = {
	id: number;
	title: string;
	description: string;
	content: string;
	author: string;
	published_at: string;
	tags: string[];
	thumbnail: string;
};

export type SearchApiResponse = {
	data: SearchPost[];
	meta: {
		current_page: number;
		total_pages: number;
		total_count: number;
		limit: number;
	};
};

export type FetchBlogsResult = {
	blogs: BlogItem[];
	totalPages: number;
	currentPage: number;
};

function transformApiResponseToBlogItem(post: SearchPost, basePath: string = "/blogs"): BlogItem {
	return {
		id: String(post.id),
		title: post.title,
		content: post.content || post.description || "",
		description: post.description ?? post.content,
		author: post.author,
		thumbnail: post.thumbnail ?? undefined,
		published_at: post.published_at,
		tags: post.tags,
	};
}

async function fetchBlogsFromApi(params: FetchBlogsParams): Promise<FetchBlogsResult> {
	const { q, limit = 10, page = 1 } = params;
	const searchParams = new URLSearchParams();

	if (q) searchParams.set("q", q);
	searchParams.set("limit", String(limit));
	searchParams.set("page", String(page));

	const url = `${PATH.CMS.SEARCH}?${searchParams.toString()}`;
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`Blog search failed: ${res.status} ${res.statusText}`);
	}

	const json = (await res.json()) as SearchApiResponse;

	const blogs = json.data.map((post) => transformApiResponseToBlogItem(post));
	const totalPages = json.meta.total_pages;
	const currentPage = json.meta.current_page;

	return { blogs, totalPages, currentPage };
}

/**
 * 記事検索
 */
export async function fetchBlogs(params: FetchBlogsParams = {}): Promise<FetchBlogsResult> {
	try {
		return await fetchBlogsFromApi(params);
	} catch (error) {
		console.error(error);
		return { blogs: [], totalPages: 0, currentPage: 1 };
	}
}
