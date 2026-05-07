# AGENTS.md — Blog Personal FluxDev

## Descripción del Proyecto

Blog personal sobre desarrollo y tecnología con artículos, búsqueda instantánea, sistema de comentarios y soporte multilingüe (español/inglés). Desplegado en Cloudflare Pages.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Astro 6 (static output) |
| UI | Tailwind CSS 4 + Iconify |
| Backend API | Hono (Cloudflare Pages Functions) |
| Comentarios | Cloudflare D1 + Turnstile anti-spam + rate limiting via KV |
| Búsqueda | Pagefind (static search indexing) |
| Runtime | Bun 1.3 |
| Deploy | Cloudflare Pages (Wrangler) |
| Lint/Format | Biome 2 |
| Tests | Vitest + jsdom |
| i18n | Astro i18n (es default, en) |

## Estructura del Código

```
src/
├── components/        # Componentes Astro
│   ├── BaseHead.astro
│   ├── Comments.astro
│   ├── LanguagePicker.astro
│   ├── Search.astro
│   ├── ShareButtons.astro
│   ├── ThemeToggle.astro
│   └── UmamiAnalytics.astro
├── i18n/
│   ├── ui.ts             # Diccionarios es/en
│   └── ui.test.ts        # Tests de i18n
├── layouts/
│   ├── BlogPost.astro
│   └── Layout.astro
├── pages/
│   ├── [...page].astro
│   ├── 404.astro
│   ├── about.astro
│   ├── blog/              # Artículos en español (.md)
│   ├── en/                # Rutas en inglés
│   ├── etiquetas/         # Páginas por tag
│   └── legal/             # Privacidad y términos
├── styles/
│   └── global.css
├── test/
│   └── setup.ts
└── utils/
    ├── posts.ts
    └── posts.test.ts

functions/
└── api/[[route]].ts      # API Hono (comentarios CRUD)

db/
└── schema.sql            # Schema D1 (tabla comments)
```

## Comandos Disponibles

| Comando | Descripción |
|---|---|
| `bun run dev` | Servidor de desarrollo |
| `bun run build` | Build de producción + index Pagefind |
| `bun run preview` | Preview del build |
| `bun run lint` | Biome lint (solo reportar) |
| `bun run check` | Biome lint + format (auto-fix) |
| `bun run format` | Biome format (auto-fix) |
| `bun run test` | Vitest (run mode) |

## Convenciones de Código

- **Indentación**: Tabs (configurado en Biome)
- **Comillas**: Dobles (`"`) en JS/TS
- **Imports**: Organizados automáticamente por Biome
- **Tipado**: TypeScript (extends `astro/tsconfigs/base`)
- **Estilos**: Tailwind CSS 4 utility classes
- **Nombres**: camelCase para utils, PascalCase para componentes

## Base de Datos

Tabla principal en D1:
- `comments` — Comentarios de artículos (id, slug, author, content, created_at)

## API de Comentarios

- `GET /api/comments/:slug` — Obtener comentarios de un artículo
- `POST /api/comments/:slug` — Crear comentario (con validación Turnstile + rate limiting por IP via KV)

## Variables de Entorno

| Variable | Uso |
|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Site key de Cloudflare Turnstile (frontend) |
| `TURNSTILE_SECRET_KEY` | Secret key de Turnstile (server-side, en .dev.vars local) |

## Reglas para el Agente

1. Siempre correr `bun run lint` y `bun run test` después de cambios
2. No alterar el schema de DB sin confirmar
3. Mantener i18n consistente (agregar claves en es Y en)
4. Usar Biome para formato, no Prettier
5. No usar emojis en commits ni código (salvo que el usuario lo pida)
6. Seguir la convención de tabs + comillas dobles de Biome
