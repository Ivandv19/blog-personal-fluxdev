// @ts-check

import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import { toString as toString_ } from "mdast-util-to-string";
import getReadingTime from "reading-time";

/**
 * Plugin de Remark para calcular tiempo estimado de lectura de posts.
 * @returns {Function} Función de transformación de AST de Markdown
 */
export function remarkReadingTime() {
	// @ts-expect-error - Plugin de Remark con tipos implícitos
	return (tree, { data }) => {
		// 1. Extraer texto plano del árbol de sintaxis abstracta (AST) del Markdown
		const textOnPage = toString_(tree);

		// 2. Calcular tiempo de lectura en minutos usando la librería reading-time
		const readingTime = getReadingTime(textOnPage);

		// 3. Inyectar resultado en frontmatter para acceso en componentes Astro
		data.astro.frontmatter.minutesRead = readingTime.minutes;
	};
}

/**
 * Configuración principal del proyecto Astro.
 * Define build, i18n, integraciones y procesamiento de Markdown.
 */
export default defineConfig({
	/**
	 * URL base del sitio en producción.
	 * Usada para generar URLs absolutas en sitemap, RSS y meta tags.
	 */
	site: "https://fluxdev-nebula.mgdc.site/",

	/**
	 * Modo de salida: generación de HTML estático (SSG).
	 * @note La API (/api/*) se maneja por separado en un Hono Worker.
	 */
	output: "static",

	/**
	 * Integraciones de Astro habilitadas.
	 * - sitemap: Genera sitemap.xml automático para SEO
	 */
	integrations: [sitemap()],

	/**
	 * Configuración de internacionalización (i18n).
	 * - defaultLocale: Idioma por defecto (español)
	 * - locales: Idiomas soportados
	 * - prefixDefaultLocale: false = rutas en español sin prefijo /es/
	 */
	i18n: {
		defaultLocale: "es",
		locales: ["es", "en"],
		routing: {
			prefixDefaultLocale: false,
		},
	},

	/**
	 * Configuración de procesamiento de Markdown.
	 * - remarkPlugins: Transformaciones aplicadas antes del renderizado
	 * - remarkReadingTime: Inyecta `minutesRead` en frontmatter de cada post
	 */
	markdown: {
		remarkPlugins: [remarkReadingTime],
	},

	/**
	 * Configuración de Vite (bundler de Astro).
	 * - tailwindcss: Plugin para habilitar Tailwind CSS v4
	 */
	vite: {
		plugins: [tailwindcss()],
	},
});
