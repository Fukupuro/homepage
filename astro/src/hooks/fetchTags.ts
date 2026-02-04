import { MOCK_BLOGS, PATH } from "@/constants";
import { fetchBlogs } from "@/hooks/fetchBlogs";

function getTagsFromMock(): string[] {
	const allTags = new Set<string>();
	MOCK_BLOGS.forEach((blog) => {
		blog.tags.forEach((tag) => {
			allTags.add(tag);
		});
	});
	return Array.from(allTags).sort();
}

async function fetchTagsFromApi(): Promise<string[]> {
	const res = await fetch(PATH.TAGS);
	if (!res.ok) {
		throw new Error(`Tags fetch failed: ${res.status} ${res.statusText}`);
	}
	const data = (await res.json()) as { tags: string[] };
	return (data.tags ?? []).sort();
}

/**
 * タグ一覧を取得する
 * 開発・テスト時はモックブログからユニークなタグを返し、
 * 本番ではタグAPI（PATH.TAGS）を呼ぶ。API失敗時はブログ検索結果からタグを抽出
 */
export async function fetchTags(): Promise<string[]> {
	const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;
	const isTest =
		(typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") ||
		(typeof process !== "undefined" && process.env?.NODE_ENV === "test");

	try {
		if (isDev || isTest) {
			return getTagsFromMock();
		}

		try {
			return await fetchTagsFromApi();
		} catch (_apiError) {
			// タグAPIが未実装・エラー時はブログ検索からタグを抽出
			const { blogs } = await fetchBlogs({ limit: 1000, page: 1 });
			const allTags = new Set<string>();
			blogs.forEach((blog) => {
				blog.tags.forEach((tag) => {
					allTags.add(tag);
				});
			});
			return Array.from(allTags).sort();
		}
	} catch (_error) {
		// biome-ignore lint: まだタグAPIができていないためエラーを出力
		console.error(_error);
		return [];
	}
}
