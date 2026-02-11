import type { BlogItem } from "@/types";

type MarkdownModule = {
	frontmatter: {
		title: string;
		description?: string;
		thumbnail?: string;
		tags: string[];
		author: string;
		published_at: string;
	};
	rawContent: () => string;
};

const modules = import.meta.glob<MarkdownModule>("../contents/blogs/*.md", {
	eager: true,
});

function toBlogItem([path, mod]: [string, MarkdownModule]): BlogItem {
	const filename = path.split("/").pop() ?? "";
	const id = filename.replace(/\.md$/, "");
	const { frontmatter } = mod;
	return {
		id,
		title: frontmatter.title,
		content: frontmatter.description ?? "",
		description: frontmatter.description,
		author: frontmatter.author,
		thumbnail: frontmatter.thumbnail,
		published_at: frontmatter.published_at,
		tags: frontmatter.tags ?? [],
	};
}

export const MOCK_BLOGS: BlogItem[] = Object.entries(modules)
	.map(toBlogItem)
	.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
