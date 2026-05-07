/**
 * API de comentarios para el blog: gestión de CRUD con Hono, D1, KV y Turnstile.
 *
 * @description Endpoint para obtener y crear comentarios con validación, rate limiting y cache.
 * @runtime Cloudflare Pages Functions (adaptado desde Workers)
 * @dependencies D1 (persistencia), KV (cache + rate limiting), Turnstile (anti-spam)
 */

import type { Context, Next } from "hono";
import { Hono } from "hono";
import { z } from "zod";

/**
 * Tipo de función compatible con Cloudflare Pages Functions.
 * Adapta el contexto de Pages al formato esperado por Hono.
 */
type PagesFunction<Env = unknown> = (context: {
	request: Request;
	env: Env;
	params: Record<string, string>;
	waitUntil: (promise: Promise<unknown>) => void;
	next: () => Promise<Response>;
	data: Record<string, unknown>;
}) => Response | Promise<Response>;

/**
 * Bindings de Cloudflare disponibles en el runtime del Worker.
 */
type Env = {
	DB: D1Database; // Base de datos D1 para comentarios
	KV: KVNamespace; // KV para cache y rate limiting
	TURNSTILE_SECRET_KEY: string; // Clave secreta para validar captcha
};

const app = new Hono<{ Bindings: Env }>();

/**
 * Schema de validación para comentarios usando Zod.
 * Define reglas de entrada y mensajes de error centralizados.
 */
const CommentSchema = z.object({
	author: z.string().min(1, "Author required").max(50, "Author too long"),
	content: z.string().min(1, "Content required").max(1000, "Content too long"),
	token: z.string().min(1, "Captcha token required"),
});

/**
 * Verifica rate limiting por IP usando KV Namespace.
 * @param kv - Instancia de KV Namespace
 * @param ip - Dirección IP del cliente
 * @returns {Promise<boolean>} true si la petición está permitida, false si excede el límite
 *
 * @behavior
 * - Ventana de tiempo: 15 minutos
 * - Límite: 5 intentos por IP
 * - Almacena contador con TTL automático en KV
 */
const checkRateLimit = async (
	kv: KVNamespace,
	ip: string,
): Promise<boolean> => {
	const key = `rate-limit:comment:${ip}`;
	const now = Date.now();
	const windowMs = 15 * 60 * 1000;
	const maxAttempts = 5;

	const data = (await kv.get(key, "json")) as {
		attempts: number;
		resetAt: number;
	} | null;

	// Caso 1: Primer intento o ventana expirada → resetear contador
	if (!data || now > data.resetAt) {
		await kv.put(
			key,
			JSON.stringify({ attempts: 1, resetAt: now + windowMs }),
			{ expirationTtl: 900 },
		);
		return true;
	}

	// Caso 2: Límite excedido → bloquear
	if (data.attempts >= maxAttempts) {
		return false;
	}

	// Caso 3: Dentro del límite → incrementar contador
	await kv.put(
		key,
		JSON.stringify({ attempts: data.attempts + 1, resetAt: data.resetAt }),
		{
			expirationTtl: Math.floor((data.resetAt - now) / 1000),
		},
	);

	return true;
};

/**
 * Middleware para validar presencia del parámetro slug en la ruta.
 * @param c - Contexto de Hono
 * @param next - Función para continuar la cadena de middleware
 * @returns {Response | Promise<void>} 400 si falta slug, next() si es válido
 */
const validateSlug = async (c: Context, next: Next) => {
	const slug = c.req.param("slug");
	if (!slug) {
		return c.json({ error: "Slug required" }, 400);
	}
	return next();
};

/**
 * GET /api/comments/:slug - Obtiene comentarios para un post.
 *
 * @behavior
 * - Primero consulta cache en KV (TTL: 5 min)
 * - Si no hay cache, consulta D1 y popula cache
 * - Retorna header X-Cache: HIT/MISS para debugging
 *
 * @response 200: Array de comentarios | 400: Slug faltante | 500: Error de servidor
 */
app.get("/api/comments/:slug", validateSlug, async (c) => {
	const slug = c.req.param("slug") as string;

	try {
		// 1. Intentar obtener desde cache KV
		const cached = await c.env.KV.get(`comments:${slug}`, "json");
		if (cached) {
			return c.json(cached, 200, { "X-Cache": "HIT" });
		}

		// 2. Consultar D1 si no hay cache
		const { results } = await c.env.DB.prepare(
			"SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC",
		)
			.bind(slug)
			.all();

		// 3. Guardar resultado en cache por 5 minutos
		await c.env.KV.put(`comments:${slug}`, JSON.stringify(results), {
			expirationTtl: 300,
		});

		return c.json(results, 200, { "X-Cache": "MISS" });
	} catch (e) {
		console.error(e);
		return c.json({ error: "Error fetching comments" }, 500);
	}
});

/**
 * POST /api/comments/:slug - Crea un nuevo comentario.
 *
 * @behavior
 * 1. Rate limiting: 5 intentos por IP cada 15 min
 * 2. Validación de entrada con Zod (author, content, token)
 * 3. Verificación de token Turnstile con API de Cloudflare
 * 4. Inserción en D1 con parámetros vinculados (previene SQL injection)
 * 5. Invalidación de cache para el post afectado
 *
 * @response 201: Creado | 400: Validación fallida | 403: Captcha inválido | 429: Rate limit | 500: Error de servidor
 */
app.post("/api/comments/:slug", validateSlug, async (c) => {
	const slug = c.req.param("slug") as string;

	try {
		// 1. Rate limiting por IP
		const ip = c.req.header("CF-Connecting-IP") || "unknown";
		const allowed = await checkRateLimit(c.env.KV, ip);
		if (!allowed) {
			return c.json(
				{ error: "Too many comments. Please try again in 15 minutes." },
				429,
			);
		}

		// 2. Validación de cuerpo con Zod
		const body = await c.req.json();
		const result = CommentSchema.safeParse(body);
		if (!result.success) {
			return c.json(
				{ error: "Invalid data", details: result.error.issues },
				400,
			);
		}
		const { author, content, token } = result.data;

		// 3. Verificación de token Turnstile
		const formData = new FormData();
		formData.append("secret", c.env.TURNSTILE_SECRET_KEY);
		formData.append("response", token);
		formData.append("remoteip", ip);

		const verifyResult = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				body: formData,
			},
		);
		const outcome = (await verifyResult.json()) as { success: boolean };

		if (!outcome.success) {
			return c.json({ error: "Invalid Captcha" }, 403);
		}

		// 4. Insertar comentario en D1
		const { success } = await c.env.DB.prepare(
			"INSERT INTO comments (post_slug, author, content) VALUES (?, ?, ?)",
		)
			.bind(slug, author, content)
			.run();

		if (!success) {
			return c.json({ error: "Failed to add comment" }, 500);
		}

		// 5. Invalidar cache del post para reflejar nuevo comentario
		await c.env.KV.delete(`comments:${slug}`);

		return c.json({ message: "Comment added" }, 201);
	} catch (e) {
		console.error(e);
		return c.json({ error: "Server error" }, 500);
	}
});

/**
 * Adapter para Cloudflare Pages Functions.
 * Convierte el contexto de Pages al formato que espera Hono.
 * @param context - Contexto de Cloudflare Pages
 * @returns {Promise<Response>} Respuesta generada por Hono
 */
export const onRequest: PagesFunction<Env> = async (context) => {
	return app.fetch(context.request, context.env);
};
