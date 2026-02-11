export const PATH = {
	HOME: "/",
	BLOGS: "/blogs",
	FAQ: "/faq/",
	BLOG: {
		GROUP_ACTIVITIES: "/blogs/group-activities/",
	},
	CMS: {
		BLOGS: `${import.meta.env.CMS_URL}/api/blogs`,
		SEARCH: `${import.meta.env.CMS_URL}/api/blogs/search`,
		TAGS: `${import.meta.env.CMS_URL}/api/tags`,
	},
};
