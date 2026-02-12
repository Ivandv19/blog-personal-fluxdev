export function getTranslatedPath(currentPath: string, targetLang: string) {
	const posts = import.meta.glob("../pages/**/*.{md,mdx}", { eager: true });

	// 1. Identify the current post based on the path
	let refId: string | undefined;

	for (const path in posts) {
		const post = posts[path] as any;

		// Normalize file path to URL path
		// ../pages/blog/post.md -> /blog/post
		// ../pages/en/blog/post.md -> /en/blog/post
		let generatedPath = path
			.replace("../pages", "")
			.replace(/\.mdx?$/, "")
			.replace(/\/index$/, "");

		if (generatedPath === "") generatedPath = "/";

		// Match against currentPath (ignoring trailing slash)
		const normalizedCurrent = currentPath.replace(/\/$/, "") || "/";
		const normalizedGenerated = generatedPath.replace(/\/$/, "") || "/";

		if (normalizedCurrent === normalizedGenerated) {
			refId = post.frontmatter?.ref_id;
			break;
		}
	}

	if (!refId) return null;

	// 2. Find the counterpart with the same ref_id and targetLang
	for (const path in posts) {
		const post = posts[path] as any;
		if (post.frontmatter?.ref_id === refId) {
			let generatedPath = path
				.replace("../pages", "")
				.replace(/\.mdx?$/, "")
				.replace(/\/index$/, "");

			if (generatedPath === "") generatedPath = "/";

			const isEn = generatedPath.startsWith("/en");

			if (targetLang === "en" && isEn) return generatedPath;
			if (targetLang === "es" && !isEn) return generatedPath;
		}
	}

	return null;
}
