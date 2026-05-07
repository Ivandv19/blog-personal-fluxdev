/**
 * Utilidades para resolución de rutas y gestión de posts del blog.
 */

/**
 * Obtiene todos los archivos de contenido (.md, .mdx) de la carpeta pages.
 * @returns {Record<string, any>} Mapa de rutas a módulos de posts con frontmatter
 */
type PostModule = {
	frontmatter: { ref_id?: string; [key: string]: unknown };
	url?: string;
};
type PostMap = Record<string, PostModule>;

export function getPosts(): PostMap {
	return import.meta.glob("../pages/**/*.{md,mdx}", { eager: true }) as PostMap;
}

/**
 * Resuelve la ruta equivalente de un post en otro idioma mediante ref_id compartido.
 *
 * @param {string} currentPath - Ruta URL actual (ej: "/blog/post" o "/en/blog/post")
 * @param {'es' | 'en'} targetLang - Idioma destino para la traducción
 * @param {Record<string, any>} [postsOverride] - Mapa de posts opcional para testing
 * @returns {string | null} Ruta traducida si existe, null si no hay traducción disponible
 *
 * @behavior
 * - Normaliza rutas de archivo a formato URL para comparación
 * - Busca ref_id del post actual en el mapa de posts
 * - Retorna null si el post no tiene ref_id definido
 * - Busca post con mismo ref_id en idioma destino
 * - Retorna null si no encuentra contraparte en el idioma objetivo
 *
 * @example
 * getTranslatedPath("/blog/hola", "en", posts) // → "/en/blog/hello"
 * getTranslatedPath("/en/about", "es", posts)  // → "/about"
 * getTranslatedPath("/sin-ref", "en", posts)   // → null
 */
export function getTranslatedPath(
	currentPath: string,
	targetLang: string,
	postsOverride?: PostMap,
) {
	// Usar mapa de posts proporcionado o importar dinámicamente desde filesystem
	const posts = postsOverride || getPosts();

	// FASE 1: Identificar el post actual y extraer su ref_id
	let refId: string | undefined;

	for (const path in posts) {
		const post = posts[path];

		// 1.1. Normalizar ruta de archivo a formato URL para comparación
		// Ej: "../pages/blog/post.md" → "/blog/post"
		// Ej: "../pages/en/blog/post.md" → "/en/blog/post"
		// Ej: "../pages/index.md" → "/"
		let generatedPath = path
			.replace("../pages", "")
			.replace(/\.mdx?$/, "")
			.replace(/\/index$/, "");

		if (generatedPath === "") generatedPath = "/";

		// 1.2. Normalizar rutas para comparación (ignorar trailing slash)
		const normalizedCurrent = currentPath.replace(/\/$/, "") || "/";
		const normalizedGenerated = generatedPath.replace(/\/$/, "") || "/";

		// 1.3. Si hay match, extraer ref_id y salir del bucle
		if (normalizedCurrent === normalizedGenerated) {
			refId = post.frontmatter?.ref_id;
			break;
		}
	}

	// 1.4. Si no hay ref_id, no es posible resolver traducción
	if (!refId) return null;

	// FASE 2: Buscar contraparte con mismo ref_id en idioma destino
	for (const path in posts) {
		const post = posts[path];

		// 2.1. Filtrar posts que compartan el mismo ref_id
		if (post.frontmatter?.ref_id === refId) {
			// 2.2. Normalizar ruta del candidato para evaluación
			let generatedPath = path
				.replace("../pages", "")
				.replace(/\.mdx?$/, "")
				.replace(/\/index$/, "");

			if (generatedPath === "") generatedPath = "/";

			// 2.3. Determinar si el candidato está en inglés (prefijo /en)
			const isEn = generatedPath.startsWith("/en");

			// 2.4. Retornar ruta si coincide con idioma destino solicitado
			if (targetLang === "en" && isEn) return generatedPath;
			if (targetLang === "es" && !isEn) return generatedPath;
		}
	}

	// 2.5. Si no se encontró contraparte en idioma destino, retornar null
	return null;
}
