export type BlogTag = {
	id: number;
	name: string;
};

export type BlogItem = {
	id: number;
	title: string;
	content: string;
	author: string;
	link: string;
	thumbnail?: string;
	published_at: string;
	tags: BlogTag[];
};
