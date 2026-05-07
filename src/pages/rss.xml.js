/**
 * Endpoint para generar feed RSS del blog con artículos de todos los idiomas.
 */

import rss from "@astrojs/rss";
import { defaultLang, ui } from "../i18n/ui";

/**
 * Handler GET para generar el feed RSS con todos los posts del sitio.
 * @param {Object} context - Contexto de Astro con información del sitio
 * @returns {Promise<Response>} Respuesta RSS con metadata y lista de artículos
 */
export async function GET(context) {
	// 1. Importar posts en español desde carpeta ./blog/
	const postsImportResultEs = import.meta.glob("./blog/*.md", { eager: true });
	// 2. Importar posts en inglés desde carpeta ./en/blog/
	const postsImportResultEn = import.meta.glob("./en/blog/*.md", {
		eager: true,
	});

	// 3. Combinar arrays de posts de ambos idiomas
	const postsEs = Object.values(postsImportResultEs);
	const postsEn = Object.values(postsImportResultEn);
	const allPosts = [...postsEs, ...postsEn];

	// 4. Ordenar todos los posts por fecha descendente (más recientes primero)
	allPosts.sort(
		(a, b) =>
			new Date(b.frontmatter.date).valueOf() -
			new Date(a.frontmatter.date).valueOf(),
	);

	// 5. Generar y retornar feed RSS con configuración y lista de items
	return rss({
		// Metadata del feed: título, descripción y URL base del sitio
		title: "Flux Blog",
		description: ui[defaultLang]["home.welcome"],
		site: context.site,

		// Items del feed: mapear cada post a formato RSS estándar
		items: allPosts.map((post) => ({
			title: post.frontmatter.title,
			pubDate: new Date(post.frontmatter.date),
			description: post.frontmatter.description,
			link: post.url,
		})),

		// Metadata adicional: idioma por defecto del sitio en formato RSS
		customData: `<language>${defaultLang}</language>`,
	});
}
