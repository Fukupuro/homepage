export const PATH = {
	HOME: "/homepage",
	BLOGS: "/homepage/blogs",
	FAQ: "/homepage/faq/",
	BLOG: {
		GROUP_ACTIVITIES: "/homepage/blogs/group-activities/",
	},
	CONTACT: {
		FORM: "https://docs.google.com/forms/d/e/1FAIpQLSf1lpB-oW8lFqb9DoeeZBdGyXILeFbclGEdF-xl1pBJJ7HxsQ/viewform",
		MAIL: "fukuyamaprogramming@gmail.com",
	},
	SNS: {
		GITHUB: "https://github.com/Fukupro2023",
		X: "https://x.com/fukupro2023",
	},
	IMAGES: (path: string) => `/homepage/images/${path}`,
	CMS: {
		BLOGS: `${import.meta.env.PUBLIC_CMS_URL}/api/blogs`,
		SEARCH: `${import.meta.env.PUBLIC_CMS_URL}/api/blogs/search`,
		TAGS: `${import.meta.env.PUBLIC_CMS_URL}/api/tags`,
	},
};
