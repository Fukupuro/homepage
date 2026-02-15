import { PATH } from "@/constants";
import type { BlogTag } from "@/types";

export type FetchTagsResult = {
	tags: BlogTag[];
	count: number;
};

/**
 * タグ一覧を取得する
 */
export async function fetchTags(): Promise<FetchTagsResult> {
	const url = `${PATH.CMS.TAGS}`;
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Tags fetch failed: ${res.status} ${res.statusText}`);
	}
	const { tags, count } = await res.json();
	return {
		tags,
		count,
	};
}
