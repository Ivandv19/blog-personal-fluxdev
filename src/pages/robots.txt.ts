import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
	const baseUrl = site?.href.replace(/\/$/, "") ?? "";
	const sitemap = `${baseUrl}/sitemap-index.xml`;
	const content = ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemap}`].join(
		"\n",
	);

	return new Response(content, {
		headers: { "Content-Type": "text/plain" },
	});
};
