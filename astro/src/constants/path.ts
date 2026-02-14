export const PATH = {
	HOME: "/homepage",
	BLOGS: "/homepage/blogs",
	FAQ: "/homepage/faq/",
	BLOG: {
		GROUP_ACTIVITIES: "/homepage/blogs/group-activities/",
	},
	IMAGES: (path: string) => `/homepage/images/${path}`,
	CMS: {
		BLOGS: `${import.meta.env.PUBLIC_CMS_URL}/api/blogs`,
		SEARCH: `${import.meta.env.PUBLIC_CMS_URL}/api/blogs/search`,
		TAGS: `${import.meta.env.PUBLIC_CMS_URL}/api/tags`,
	},
};
