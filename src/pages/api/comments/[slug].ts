export const prerender = false;

import type { APIContext } from "astro";

export async function GET({ params, locals }: APIContext) {
	const { slug } = params;

	if (!slug) {
		return new Response(JSON.stringify({ error: "Slug required" }), {
			status: 400,
		});
	}

	try {
		const { results } = await locals.runtime.env.DB.prepare(
			"SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC",
		)
			.bind(slug)
			.all();

		return new Response(JSON.stringify(results), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify({ error: "Error fetching comments" }), {
			status: 500,
		});
	}
}

export async function POST({ params, request, locals }: APIContext) {
	const { slug } = params;

	if (!slug) {
		return new Response(JSON.stringify({ error: "Slug required" }), {
			status: 400,
		});
	}

	try {
		const data = await request.json();
		const { author, content, token } = data; // Receive token

		if (!author || !content) {
			return new Response(
				JSON.stringify({ error: "Author and content required" }),
				{ status: 400 },
			);
		}

		// Verify Turnstile Token
		if (!token) {
			return new Response(JSON.stringify({ error: "Captcha required" }), {
				status: 400,
			});
		}

		const SECRET_KEY = locals.runtime.env.TURNSTILE_SECRET_KEY as string;

		const formData = new FormData();
		formData.append("secret", SECRET_KEY);
		formData.append("response", token);
		formData.append("remoteip", request.headers.get("CF-Connecting-IP") || "");

		const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
		const result = await fetch(url, {
			body: formData,
			method: "POST",
		});

		const outcome = await result.json();
		if (!outcome.success) {
			return new Response(JSON.stringify({ error: "Invalid Captcha" }), {
				status: 403,
			});
		}

		// Basic anti-spam validation
		if (content.length > 1000) {
			return new Response(JSON.stringify({ error: "Comment too long" }), {
				status: 400,
			});
		}

		const { success } = await locals.runtime.env.DB.prepare(
			"INSERT INTO comments (post_slug, author, content) VALUES (?, ?, ?)",
		)
			.bind(slug, author, content)
			.run();

		if (success) {
			return new Response(JSON.stringify({ message: "Comment added" }), {
				status: 201,
			});
		} else {
			return new Response(JSON.stringify({ error: "Failed to add comment" }), {
				status: 500,
			});
		}
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify({ error: "Server error" }), {
			status: 500,
		});
	}
}
