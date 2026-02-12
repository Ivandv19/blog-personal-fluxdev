/**
 * Tipos de ambiente para Astro + Cloudflare Workers
 *
 * Este archivo define los tipos de TypeScript para el runtime de Cloudflare Workers.
 * Estos tipos son usados por el Hono Worker en functions/api/[[route]].ts
 */

/// <reference path="../.astro/types.d.ts" />

/**
 * Tipos importados de Cloudflare Workers
 * Necesarios para que TypeScript reconozca D1Database y KVNamespace
 */
type D1Database = import("@cloudflare/workers-types").D1Database;
type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

/**
 * ENV: Variables de entorno y bindings de Cloudflare
 *
 * Estos recursos están disponibles en el Hono Worker:
 * - c.env.DB: Base de datos D1 para comentarios
 * - c.env.KV: KV Namespace para cache y rate limiting
 * - c.env.TURNSTILE_SECRET_KEY: Secret key de Turnstile
 *
 * Nota: Astro NO tiene acceso a estos recursos porque es 100% estático.
 * Solo el Worker de Hono los usa.
 */
type ENV = {
	/** Base de datos D1 (SQLite en el Edge) para comentarios del blog */
	DB: D1Database;
	/** KV Namespace para cache de comentarios y rate limiting */
	KV: KVNamespace;
	/** Secret key de Cloudflare Turnstile para validación de captcha */
	TURNSTILE_SECRET_KEY: string;
};
