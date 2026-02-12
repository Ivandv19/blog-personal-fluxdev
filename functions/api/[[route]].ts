import type { Context, Next } from "hono";
import { Hono } from "hono";
import { z } from "zod";

/**
 * Tipos para Cloudflare Workers
 */
type Env = {
    DB: D1Database;
    KV: KVNamespace;
    TURNSTILE_SECRET_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

/**
 * Schema de validación para comentarios usando Zod
 * Más robusto y legible que validaciones manuales con if/else
 */
const CommentSchema = z.object({
    author: z.string().min(1, "Author required").max(50, "Author too long"),
    content: z.string().min(1, "Content required").max(1000, "Content too long"),
    token: z.string().min(1, "Captcha token required"),
});

/**
 * Rate Limiting usando KV (igual que en el proyecto Pomodoro)
 * Previene spam limitando a 5 comentarios cada 15 minutos por IP
 */
const checkRateLimit = async (
    kv: KVNamespace,
    ip: string,
): Promise<boolean> => {
    const key = `rate-limit:comment:${ip}`;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutos
    const maxAttempts = 5;

    const data = (await kv.get(key, "json")) as {
        attempts: number;
        resetAt: number;
    } | null;

    if (!data || now > data.resetAt) {
        // Primera vez o ventana expirada
        await kv.put(
            key,
            JSON.stringify({ attempts: 1, resetAt: now + windowMs }),
            {
                expirationTtl: 900, // 15 minutos
            },
        );
        return true;
    }

    if (data.attempts >= maxAttempts) {
        return false; // Bloqueado
    }

    // Incrementar intentos
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
 * Middleware para validar que el slug existe
 * Evita duplicar código en cada endpoint
 */
const validateSlug = async (c: Context, next: Next) => {
    const slug = c.req.param("slug");
    if (!slug) {
        return c.json({ error: "Slug required" }, 400);
    }
    return next();
};

/**
 * GET /api/comments/:slug
 * Obtiene comentarios con cache en KV (5 minutos)
 * Reduce reads a D1 en ~95% para posts populares
 */
app.get("/api/comments/:slug", validateSlug, async (c) => {
    const slug = c.req.param("slug")!;

    try {
        // Intentar obtener del cache primero
        const cached = await c.env.KV.get(`comments:${slug}`, "json");
        if (cached) {
            return c.json(cached, 200, {
                "X-Cache": "HIT",
            });
        }

        // Si no está en cache, consultar D1
        const { results } = await c.env.DB.prepare(
            "SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC",
        )
            .bind(slug)
            .all();

        // Guardar en cache por 5 minutos
        await c.env.KV.put(`comments:${slug}`, JSON.stringify(results), {
            expirationTtl: 300, // 5 minutos
        });

        return c.json(results, 200, {
            "X-Cache": "MISS",
        });
    } catch (e) {
        console.error(e);
        return c.json({ error: "Error fetching comments" }, 500);
    }
});

/**
 * POST /api/comments/:slug
 * Crea un nuevo comentario con:
 * - Rate limiting (5 intentos / 15 min)
 * - Validación con Zod
 * - Verificación de Turnstile
 * - Invalidación de cache
 */
app.post("/api/comments/:slug", validateSlug, async (c) => {
    const slug = c.req.param("slug")!;

    try {
        // 1. Rate Limiting
        const ip = c.req.header("CF-Connecting-IP") || "unknown";
        const allowed = await checkRateLimit(c.env.KV, ip);

        if (!allowed) {
            return c.json(
                {
                    error: "Too many comments. Please try again in 15 minutes.",
                },
                429,
            );
        }

        // 2. Validación con Zod
        const body = await c.req.json();
        const result = CommentSchema.safeParse(body);

        if (!result.success) {
            return c.json(
                {
                    error: "Invalid data",
                    details: result.error.issues,
                },
                400,
            );
        }

        const { author, content, token } = result.data;

        // 3. Verificar Turnstile
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

        // 5. Invalidar cache para este post
        await c.env.KV.delete(`comments:${slug}`);

        return c.json({ message: "Comment added" }, 201);
    } catch (e) {
        console.error(e);
        return c.json({ error: "Server error" }, 500);
    }
});

export default app;
