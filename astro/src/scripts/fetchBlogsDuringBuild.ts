import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface BlogFromApi {
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

function escapeYamlString(s: string): string {
	if (s.includes("\n") || s.includes(":") || s.includes('"') || s.includes("'")) {
		return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
	}
	return s;
}

function toFrontmatter(blog: BlogFromApi): string {
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

export async function fetchBlogsDuringBuild() {
	const cmsUrl = process.env.CMS_URL;
	if (!cmsUrl) {
		throw new Error("CMS_URL is not set");
	}

	const res = await fetch(`${cmsUrl}/api/blogs`, {
		signal: AbortSignal.timeout(10_000),
	});
	if (!res.ok) {
		throw new Error(`Failed to fetch blogs: ${res.status} ${res.statusText}`);
	}

	const data = (await res.json()) as BlogFromApi[];
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
