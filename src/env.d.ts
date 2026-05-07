/**
 * Definición de tipos de TypeScript para el runtime de Cloudflare Workers.
 *
 * @description Proporciona tipado para bindings de Cloudflare (D1, KV, secrets) disponibles en el Hono Worker.
 * @scope functions/api/[[route]].ts - Solo accesible en el Worker, no en componentes Astro estáticos.
 */

/// <reference path="../.astro/types.d.ts" />

// Tipos de Cloudflare Workers importados dinámicamente para evitar dependencia global.
type D1Database = import("@cloudflare/workers-types").D1Database;
type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

/**
 * Bindings y variables de entorno disponibles en el contexto del Hono Worker.
 *
 * @note Estos recursos solo están disponibles en el runtime del Worker (Edge).
 * Los componentes Astro estáticos no tienen acceso a ENV.
 *
 * @example Uso en handler de Hono:
 * ```ts
 * app.post("/comments", async (c) => {
 *   const db = c.env.DB; // D1Database
 *   const kv = c.env.KV; // KVNamespace
 *   const key = c.env.TURNSTILE_SECRET_KEY; // string
 * })
 * ```
 */
type ENV = {
	/**
	 * Base de datos D1 (SQLite en el Edge) para operaciones de comentarios.
	 * @see https://developers.cloudflare.com/d1/
	 */
	DB: D1Database;

	/**
	 * KV Namespace para cache de respuestas y rate limiting por IP.
	 * @see https://developers.cloudflare.com/kv/
	 */
	KV: KVNamespace;

	/**
	 * Secret key de Cloudflare Turnstile para validar tokens de captcha en backend.
	 * @note Nunca exponer en cliente; solo usar en validación server-side.
	 */
	TURNSTILE_SECRET_KEY: string;
};
