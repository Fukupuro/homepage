import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface Blog {
	id: number;
	title: string;
	description: string;
	content: string;
	author: string;
	published_at: string;
	tags: string[];
	thumbnail: string;
	created_at: string;
	updated_at: string;
}

interface BlogsApiResponse {
	data: Blog[];
	meta: {
		current_page: number;
		total_pages: number;
		total_count: number;
		limit: number;
	};
}

function escapeYamlString(s: string): string {
	if (s.includes("\n") || s.includes(":") || s.includes('"') || s.includes("'")) {
		return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
	}
	return s;
}

function toFrontmatter(blog: Blog): string {
	const title = blog.title;
	const author = blog.author ?? "";
	const description = blog.description ?? "";
	const publishedAt = blog.published_at;
	const tags = Array.isArray(blog.tags) ? blog.tags : [];
	const thumbnail = blog.thumbnail ?? "";
	const lines = [
		"---",
		`title: ${escapeYamlString(title)}`,
		`author: ${escapeYamlString(author)}`,
		`description: ${escapeYamlString(description)}`,
		`published_at: ${escapeYamlString(publishedAt)}`,
		"tags:",
		...tags.map((t) => `  - ${escapeYamlString(t)}`),
		`thumbnail: ${escapeYamlString(thumbnail)}`,
		"",
		"---",
		"",
	];
	return lines.join("\n");
}

async function fetchAllBlogs(cmsUrl: string): Promise<Blog[]> {
	const limit = 100;
	const allBlogs: Blog[] = [];

	const firstUrl = new URL(`${cmsUrl}/api/blogs`);
	firstUrl.searchParams.set("limit", String(limit));
	firstUrl.searchParams.set("page", "1");

	const firstRes = await fetch(firstUrl, {
		signal: AbortSignal.timeout(10_000),
	});

	if (!firstRes.ok) {
		throw new Error(`Failed to fetch blogs (page 1): ${firstRes.status} ${firstRes.statusText}`);
	}

	const firstJson = (await firstRes.json()) as BlogsApiResponse;
	allBlogs.push(...firstJson.data);

	const totalPages = firstJson.meta.total_pages;

	for (let page = 2; page <= totalPages; page++) {
		const url = new URL(`${cmsUrl}/api/blogs`);
		url.searchParams.set("limit", String(limit));
		url.searchParams.set("page", String(page));

		const res = await fetch(url, {
			signal: AbortSignal.timeout(10_000),
		});

		if (!res.ok) {
			throw new Error(`Failed to fetch blogs (page ${page}): ${res.status} ${res.statusText}`);
		}

		const json = (await res.json()) as BlogsApiResponse;
		allBlogs.push(...json.data);
	}

	return allBlogs;
}

export async function fetchBlogsDuringBuild() {
	const cmsUrl = process.env.PUBLIC_CMS_URL;
	if (!cmsUrl) {
		throw new Error("PUBLIC_CMS_URL is not set");
	}

	const data = await fetchAllBlogs(cmsUrl);
	const contentsDir = join(__dirname, "..", "contents", "blogs");
	await mkdir(contentsDir, { recursive: true });

	for (const blog of data) {
		const body = `${toFrontmatter(blog)} ${(blog.content ?? "").trimEnd()}\n`;
		const path = join(contentsDir, `${blog.id}.md`);
		await writeFile(path, body, "utf-8");
		// biome-ignore lint: ブログの内容をファイルに書き込んだことを示すためにログを出力
		console.log(`Wrote ${blog.id}.md: ${blog.title}`);
	}

	// biome-ignore lint: ブログの内容をファイルに書き込んだことを示すためにログを出力
	console.log(`Done. Wrote ${data.length} blog(s) to src/contents/blogs/`);
}

fetchBlogsDuringBuild();
