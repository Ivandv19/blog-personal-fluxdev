export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

export const ui = {
  es: {
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'blog.readMore': 'Leer más',
    'blog.readTime': 'min lectura',
    'blog.published': 'Publicado el',
    'blog.back': 'Volver al inicio',
    'footer.copyright': 'desarrollado por Flux.',
    'search.placeholder': 'Buscar...',
    'tags.exploring': 'Explorando',
    'tags.title': 'Artículos sobre',
    'home.hero.title': 'Desarrollo de software, crecimiento personal, tutoriales y',
    'home.hero.subtitle': 'un poco de mí.',
    'home.welcome': '¡Bienvenido a mi blog! Estaré compartiendo artículos sobre desarrollo de software, tecnología y productividad. Mi objetivo es ayudarte a crecer tanto profesional como personalmente con base en mis estudios, experiencia y aprendizajes.',
    'home.popular': 'Temas Populares',
    'home.note': 'Nota:',
    'home.note2': 'Esta página web es nueva, por ende es posible que tenga algunos bugs visuales, artículos que no cargan o mal rendimiento en general. No te preocupes si ves errores, estoy trabajando en ello :)'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'blog.readMore': 'Read more',
    'blog.readTime': 'min read',
    'blog.published': 'Published on',
    'blog.back': 'Back to home',
    'footer.copyright': 'developed by Flux.',
    'search.placeholder': 'Search...',
    'tags.exploring': 'Exploring',
    'tags.title': 'Articles about',
    'home.hero.title': 'Software development, personal growth, tutorials and',
    'home.hero.subtitle': 'a bit of me.',
    'home.welcome': 'Welcome to my blog! I will be sharing articles about software development, technology and productivity. My goal is to help you grow both professionally and personally based on my studies, experience and learnings.',
    'home.popular': 'Popular Topics',
    'home.note': 'Note:',
    'home.note2': 'This website is new, therefore it may have some visual bugs, articles that do not load or poor performance in general. Do not worry if you see errors, I am working on it :)'
  },
} as const;

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}
