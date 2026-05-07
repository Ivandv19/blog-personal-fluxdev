/**
 * Módulo de internacionalización (i18n) para gestión de textos traducidos.
 *
 * @description Define idiomas soportados, diccionario de traducciones y hook para acceso seguro.
 * @pattern Fallback: si una clave no existe en el idioma destino, se usa el valor del idioma por defecto.
 */

// Idiomas soportados: código ISO → etiqueta visible en UI.
export const languages = {
	es: "Español",
	en: "English",
};

// Idioma por defecto del sitio: se usa como fallback y para inicialización.
export const defaultLang = "es";

/**
 * Diccionario de textos traducidos organizados por idioma y clave.
 *
 * @structure
 * - Claves en formato dot-case: "seccion.elemento" (ej: "nav.home", "comments.submit")
 * - Valores: strings localizados para cada idioma soportado
 * - Tipado con `as const` para inferencia estricta de claves en TypeScript
 *
 * @maintenance
 * - Agregar nuevas claves en ambos idiomas para evitar fallbacks inesperados
 * - Usar prefijos consistentes: nav.*, blog.*, footer.*, comments.*, etc.
 * - Evitar interpolación dinámica en valores; usar parámetros en el componente si es necesario
 */
export const ui = {
	es: {
		"nav.home": "Inicio",
		"nav.about": "Acerca de",
		"blog.readMore": "Leer más",
		"blog.readTime": "min lectura",
		"blog.published": "Publicado el",
		"blog.back": "Volver al inicio",
		"footer.copyright": "Flux.",
		"footer.rights": "Todos los derechos reservados.",
		"footer.developedBy": "Desarrollado por",
		"footer.description":
			"Un espacio para compartir conocimientos sobre desarrollo, tecnología y crecimiento personal.",
		"footer.nav": "Navegación",
		"footer.legal": "Legal",
		"footer.subscribe": "Suscríbete",
		"footer.subscribePlaceholder": "Tu correo electrónico",
		"footer.subscribeButton": "Suscribirse",
		"footer.terms": "Términos y Condiciones",
		"footer.privacy": "Política de Privacidad",
		"search.placeholder": "Buscar...",
		"tags.exploring": "Explorando",
		"tags.title": "Artículos sobre",
		"home.hero.title":
			"Desarrollo de software, crecimiento personal, tutoriales y",
		"home.hero.subtitle": "un poco de mí.",
		"home.welcome":
			"¡Bienvenido a mi blog! Estaré compartiendo artículos sobre desarrollo de software, tecnología y productividad. Mi objetivo es ayudarte a crecer tanto profesional como personalmente con base en mis estudios, experiencia y aprendizajes.",
		"home.popular": "Temas Populares",
		"home.note": "Nota:",
		"home.note2":
			"Esta página web es nueva, por ende es posible que tenga algunos bugs visuales, artículos que no cargan o mal rendimiento en general. No te preocupes si ves errores, estoy trabajando en ello :)",
		"comments.title": "Comentarios",
		"comments.loading": "Cargando comentarios...",
		"comments.leave": "Deja un comentario",
		"comments.name": "Nombre",
		"comments.namePlaceholder": "Tu nombre",
		"comments.comment": "Comentario",
		"comments.commentPlaceholder": "Escribe tu opinión...",
		"comments.submit": "Publicar comentario",
		"comments.submitting": "Enviando...",
		"comments.success": "¡Comentario publicado!",
		"comments.error": "Hubo un error al enviar el comentario.",
		"comments.empty": "Sé el primero en comentar.",
		"comments.loadError": "Error al cargar comentarios.",
	},
	en: {
		"nav.home": "Home",
		"nav.about": "About",
		"blog.readMore": "Read more",
		"blog.readTime": "min read",
		"blog.published": "Published on",
		"blog.back": "Back to home",
		"footer.copyright": "Flux.",
		"footer.rights": "All rights reserved.",
		"footer.developedBy": "Developed by",
		"footer.description":
			"A space to share knowledge about development, technology, and personal growth.",
		"footer.nav": "Navigation",
		"footer.legal": "Legal",
		"footer.subscribe": "Subscribe",
		"footer.subscribePlaceholder": "Your email",
		"footer.subscribeButton": "Subscribe",
		"footer.terms": "Terms and Conditions",
		"footer.privacy": "Privacy Policy",
		"search.placeholder": "Search...",
		"tags.exploring": "Exploring",
		"tags.title": "Articles about",
		"home.hero.title": "Software development, personal growth, tutorials and",
		"home.hero.subtitle": "a bit of me.",
		"home.welcome":
			"Welcome to my blog! I will be sharing articles about software development, technology and productivity. My goal is to help you grow both professionally and personally based on my studies, experience and learnings.",
		"home.popular": "Popular Topics",
		"home.note": "Note:",
		"home.note2":
			"This website is new, therefore it may have some visual bugs, articles that do not load or poor performance in general. Do not worry if you see errors, I am working on it :)",
		"comments.title": "Comments",
		"comments.loading": "Loading comments...",
		"comments.leave": "Leave a comment",
		"comments.name": "Name",
		"comments.namePlaceholder": "Your name",
		"comments.comment": "Comment",
		"comments.commentPlaceholder": "Write your opinion...",
		"comments.submit": "Post comment",
		"comments.submitting": "Submitting...",
		"comments.success": "Comment posted!",
		"comments.error": "There was an error posting the comment.",
		"comments.empty": "Be the first to comment.",
		"comments.loadError": "Error loading comments.",
	},
} as const;

/**
 * Hook para obtener función de traducción según el idioma seleccionado.
 *
 * @param {keyof typeof ui} lang - Código de idioma soportado ('es' | 'en')
 * @returns {(key: keyof (typeof ui)[typeof defaultLang]) => string} Función t(key) que retorna texto localizado
 *
 * @behavior
 * - Si la clave existe en el idioma destino: retorna ese valor
 * - Si la clave no existe en el idioma destino: retorna valor del idioma por defecto (fallback)
 * - Si la clave no existe en ningún idioma: retorna undefined (manejar en componente)
 *
 * @example
 * ```ts
 * const t = useTranslations('en');
 * t('nav.home'); // → "Home"
 * t('clave.inexistente'); // → undefined (fallback no aplica)
 * ```
 *
 * @note El tipado con `as const` en `ui` permite autocompletado y validación de claves en tiempo de compilación.
 */
export function useTranslations(lang: keyof typeof ui) {
	return function t(key: keyof (typeof ui)[typeof defaultLang]) {
		// 1. Intentar obtener valor en el idioma destino
		// 2. Si no existe, fallback al idioma por defecto
		// 3. Si tampoco existe, retorna undefined (comportamiento seguro)
		return ui[lang][key] || ui[defaultLang][key];
	};
}
