import { PATH } from "@/constants/path";
import type { BlogItem } from "@/types";

export type FetchBlogsParams = {
	keyword?: string;
	tag?: string;
	limit?: number;
	page?: number;
};

export type FetchBlogsResult = {
	blogs: BlogItem[];
};

const MOCK_BLOGS: BlogItem[] = [
	{
		id: 1,
		title: "Railsの基本",
		content:
			"これはRailsに関するブログ記事です。APIの作成方法やReactとの連携について解説しています。",
		author: "著者1",
		link: "/blogs/1/",
		thumbnail: undefined,
		published_at: "2026-01-30T07:52:45.912Z",
		tags: [
			{ id: 1, name: "Rails" },
			{ id: 3, name: "JavaScript" },
			{ id: 4, name: "Ruby" },
		],
	},
	{
		id: 2,
		title:
			"限界学生の就職活動体験記 ～貯金ゼロ、ES全滅、面接連敗の僕が、それでもスーツを着て今日も社会に祈りを捧げる話～",
		content: "キーワード検索・タグ検索のテスト用です。",
		author: "著者2",
		link: "/blogs/2/",
		thumbnail: undefined,
		published_at: "2026-01-10T00:00:00.000Z",
		tags: [
			{ id: 5, name: "就職活動" },
			{ id: 6, name: "ポエム" },
			{ id: 7, name: "IT業界" },
			{ id: 8, name: "反面教師" },
		],
	},
	{
		id: 3,
		title: "サンプル記事",
		content: "サンプル記事です。",
		author: "著者3",
		link: "/blogs/3/",
		thumbnail: undefined,
		published_at: "2026-01-01T00:00:00.000Z",
		tags: [{ id: 9, name: "お知らせ" }],
	},
];

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

	return { blogs };
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
