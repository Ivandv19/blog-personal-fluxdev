---
layout: ../../layouts/BlogPost.astro
ref_id: blog-guia-markdown
title: "Guía Rápida de Markdown"
date: "2026-01-05"
description: "Aprende la sintaxis básica de Markdown para escribir documentación, READMEs y artículos de blog de forma rápida y limpia."
tags: ["markdown", "escritura", "documentacion", "guia"]
---

Markdown es un lenguaje de marcado ligero que puedes usar para añadir formato a elementos de texto simple. Es el estándar en GitHub (`README.md`), blogs técnicos y documentación.

## Lo Básico

### Encabezados
Usa almohadillas (`#`) para los títulos:
`# H1` -> Título Principal
`## H2` -> Subtítulo
`### H3` -> Sección

### Énfasis
*   **Negrita**: `**Texto**` o `__Texto__`
*   *Cursiva*: `*Texto*` o `_Texto_`
*   ~~Tachado~~: `~~Texto~~`

### Listas

**No ordenadas:**
```markdown
* Elemento 1
* Elemento 2
  * Sub-elemento
```

**Ordenadas:**
```markdown
1. Primer paso
2. Segundo paso
```

## Código

Para código en línea usa backticks: \`const a = 1;\`.

Para bloques de código usa tres backticks:

\`\`\`javascript
function hola() {
  console.log("Mundo");
}
\`\`\`

## Enlaces e Imágenes

*   **Enlace**: `[Texto](https://url.com)`
*   **Imagen**: `![Texto Alt](/ruta/imagen.png)`

## Citas

> "El código es poesía ejecutada por máquinas."

Usa `>` al inicio de la línea.

Markdown es increíblemente simple pero poderoso. Convertir texto plano a HTML rico sin tocar una sola etiqueta `<div>` es una superpotencia que todo dev debe tener.
