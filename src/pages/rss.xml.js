import rss from "@astrojs/rss";
import { defaultLang, ui } from "../i18n/ui";

export async function GET(context) {
	// Get all posts from both languages
	const postsImportResultEs = import.meta.glob("./blog/*.md", { eager: true });
	const postsImportResultEn = import.meta.glob("./en/blog/*.md", {
		eager: true,
	});

	const postsEs = Object.values(postsImportResultEs);
	const postsEn = Object.values(postsImportResultEn);

	const allPosts = [...postsEs, ...postsEn];

	// Sort by date desc
	allPosts.sort(
		(a, b) =>
			new Date(b.frontmatter.date).valueOf() -
			new Date(a.frontmatter.date).valueOf(),
	);

	return rss({
		title: "Flux Blog",
		description: ui[defaultLang]["home.welcome"], // Using the welcome message as description or a generic one
		site: context.site,
		items: allPosts.map((post) => ({
			title: post.frontmatter.title,
			pubDate: new Date(post.frontmatter.date),
			description: post.frontmatter.description,
			link: post.url,
		})),
		customData: `<language>${defaultLang}</language>`,
	});
}
