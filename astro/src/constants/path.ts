export const PATH = {
	HOME: "/",
	BLOGS: "/blogs",
	FAQ: "/faq/",
	BLOG: {
		GROUP_ACTIVITIES: "/blogs/group-activities/",
	},
	CMS: {
		BLOGS: `${import.meta.env.PUBLIC_CMS_URL}/api/blogs`,
		SEARCH: `${import.meta.env.PUBLIC_CMS_URL}/api/blogs/search`,
		TAGS: `${import.meta.env.PUBLIC_CMS_URL}/api/tags`,
	},
};
