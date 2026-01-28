---
layout: ../../../layouts/BlogPost.astro
ref_id: blog-guia-markdown
title: "Quick Markdown Guide"
date: "2026-01-05"
description: "Learn the basic syntax of Markdown to write documentation, READMEs, and blog posts quickly and cleanly."
tags: ["markdown", "writing", "documentation", "guide"]
---

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. It is the standard on GitHub (`README.md`), technical blogs, and documentation.

## The Basics

### Headers
Use hashes (`#`) for titles:
`# H1` -> Main Title
`## H2` -> Subtitle
`### H3` -> Section

### Emphasis
*   **Bold**: `**Text**` or `__Text__`
*   *Italic*: `*Text*` or `_Text_`
*   ~~Strikethrough~~: `~~Text~~`

### Lists

**Unordered:**
```markdown
* Item 1
* Item 2
  * Sub-item
```

**Ordered:**
```markdown
1. First step
2. Second step
```

## Code

For inline code use backticks: \`const a = 1;\`.

For code blocks use three backticks:

\`\`\`javascript
function hello() {
  console.log("World");
}
\`\`\`

## Links and Images

*   **Link**: `[Text](https://url.com)`
*   **Image**: `![Alt Text](/path/image.png)`

## Blockquotes

> "Code is poetry executed by machines."

Use `>` at the beginning of the line.

Markdown is incredibly simple yet powerful. Converting plain text to rich HTML without touching a single `<div>` tag is a superpower every dev should have.
