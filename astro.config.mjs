// @ts-check

import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

/**
 * Plugin de Remark para calcular el tiempo de lectura
 *
 * Este plugin personalizado se ejecuta durante el procesamiento de archivos Markdown.
 * Calcula automáticamente cuántos minutos toma leer un post basándose en el contenido.
 */
export function remarkReadingTime() {
	// @ts-ignore - Plugin de Remark con tipos implícitos
	return (tree, { data }) => {
		// Extrae todo el texto del árbol de sintaxis abstracta (AST) del Markdown
		const textOnPage = toString(tree);

		// Calcula el tiempo de lectura usando la librería reading-time
		const readingTime = getReadingTime(textOnPage);

		// Inyecta el tiempo de lectura en el frontmatter del post
		// Esto permite acceder a `minutesRead` en cualquier componente Astro
		data.astro.frontmatter.minutesRead = readingTime.minutes;
	};
}

/**
 * Configuración Principal de Astro
 *
 * Este archivo define cómo se construye y despliega el blog.
 */
export default defineConfig({
	/**
	 * URL base del sitio en producción
	 * Usado para generar URLs absolutas en el sitemap y RSS
	 */
	site: "https://fluxdev.mgdc.site/",

	/**
	 * Modo de salida: "static" genera HTML estático
	 * Alternativas: "server" (SSR) o "hybrid" (mixto)
	 *
	 * Como es estático puro, no necesita adaptador de Cloudflare.
	 * Cloudflare Pages puede servir HTML estático directamente.
	 */
	output: "static",

	/**
	 * Integraciones de Astro
	 *
	 * - sitemap: Genera automáticamente sitemap.xml para SEO
	 */
	integrations: [sitemap()],

	/**
	 * Configuración de Internacionalización (i18n)
	 *
	 * Permite tener contenido en español e inglés con rutas limpias.
	 * - defaultLocale: Idioma por defecto (español)
	 * - locales: Idiomas soportados
	 * - prefixDefaultLocale: false = rutas en español sin /es/ (ej: /blog en vez de /es/blog)
	 */
	i18n: {
		defaultLocale: "es",
		locales: ["es", "en"],
		routing: {
			prefixDefaultLocale: false,
		},
	},

	/**
	 * Configuración de Markdown
	 *
	 * remarkPlugins: Plugins que transforman el Markdown antes de renderizarlo
	 * - remarkReadingTime: Calcula el tiempo de lectura automáticamente
	 */
	markdown: {
		remarkPlugins: [remarkReadingTime],
	},

	/**
	 * Configuración de Vite (el bundler que usa Astro)
	 *
	 * - tailwindcss: Plugin de Vite para Tailwind CSS v4
	 */
	vite: {
		plugins: [tailwindcss()],
	},
});
