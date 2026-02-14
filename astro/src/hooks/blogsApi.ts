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
	status: "success";
	blogs: BlogItem[];
	totalPages: number;
	currentPage: number;
};

function transformApiResponseToBlogItem(post: SearchPost, _basePath: string = "/blogs"): BlogItem {
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
	const { q, limit, page } = params;

	const DEFAULT_LIMIT = 10;
	const DEFAULT_PAGE = 1;

	const parsedPage = Number(page ?? DEFAULT_PAGE);
	const safePage = Math.max(1, Number.isNaN(parsedPage) ? DEFAULT_PAGE : parsedPage);

	const parsedLimit = Number(limit ?? DEFAULT_LIMIT);
	const safeLimit = Math.max(1, Number.isNaN(parsedLimit) ? DEFAULT_LIMIT : parsedLimit);

	const searchParams = new URLSearchParams();

	if (q) searchParams.set("q", q);
	searchParams.set("limit", String(safeLimit));
	searchParams.set("page", String(safePage));

	const url = `${PATH.CMS.SEARCH}?${searchParams.toString()}`;
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`Blog search failed: ${res.status} ${res.statusText}`);
	}

	const json = (await res.json()) as SearchApiResponse;

	const blogs = json.data.map((post) => transformApiResponseToBlogItem(post));
	const totalPages = json.meta.total_pages;
	const currentPage = json.meta.current_page;

	return { status: "success", blogs, totalPages, currentPage };
}

/**
 * 記事検索。成功時は FetchBlogsResult を返し、失敗時は Error を throw する。
 */
export async function fetchBlogs(params: FetchBlogsParams = {}): Promise<FetchBlogsResult> {
	try {
		return await fetchBlogsFromApi(params);
	} catch (e) {
		throw e instanceof Error ? e : new Error("Failed to fetch blogs");
	}
}
