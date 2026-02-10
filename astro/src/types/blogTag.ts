export type BlogTag = {
	id: number;
	name: string;
};

export type BlogItem = {
	id: string;
	title: string;
	content: string;
	description?: string;
	author: string;
	thumbnail?: string;
	published_at: string;
	tags: string[];
};
