-- Esquema de base de datos D1 (SQLite) para gestión de comentarios del blog.
-- Sincronizado con validaciones del endpoint API y estructura de datos del frontend.

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Identificador único autoincremental
  post_slug TEXT NOT NULL,                 -- Slug del post (índice para consultas rápidas)
  author TEXT NOT NULL,                    -- Nombre del autor (validado API: 1-50 chars)
  content TEXT NOT NULL,                   -- Texto del comentario (validado API: 1-1000 chars)
  created_at INTEGER NOT NULL DEFAULT (unixepoch()) -- Timestamp UNIX en segundos (auto-generado)
);

-- Índice para optimizar consultas GET /api/comments/:slug
-- Reduce escaneo completo a búsqueda indexada O(log n)
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);