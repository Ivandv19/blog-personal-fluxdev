/**
 * Pruebas unitarias para la función getTranslatedPath de resolución de rutas traducidas.
 * 
 * @suite getTranslatedPath
 * @framework vitest
 * @coverage
 * - Traducción de ruta español → inglés mediante ref_id
 * - Traducción de ruta inglés → español mediante ref_id
 * - Retorno null cuando no existe ref_id en el post
 * - Manejo correcto de páginas índice (/ y /en)
 */

import { describe, it, expect } from 'vitest';
import { getTranslatedPath } from './posts';

/**
 * Suite de pruebas para getTranslatedPath: valida resolución de rutas entre idiomas.
 * Utiliza un mock de posts con estructura de frontmatter.ref_id para simular el mapa de traducciones.
 */
describe('getTranslatedPath', () => {
    // Mock de posts: simula el resultado de import.meta.glob con frontmatter.ref_id
    // Estructura: { ruta: { frontmatter: { ref_id: string } } }
    // Notas:
    // - Posts con mismo ref_id en diferentes idiomas son traducciones entre sí
    // - Archivos sin ref_id se ignoran en la resolución
    // - Rutas de índice ("/", "/en") requieren manejo especial
    const mockPosts = {
        "../pages/blog/post-es.md": {
            frontmatter: { ref_id: "post-1" }
        },
        "../pages/en/blog/post-en.md": {
            frontmatter: { ref_id: "post-1" }
        },
        "../pages/index.astro": {},
        "../pages/en/index.astro": {}
    };

    /**
     * Valida que una ruta en español se resuelva correctamente a su equivalente en inglés.
     * Escenario: post con ref_id "post-1" existe en ambos idiomas.
     */
    it('should translate Spanish path to English path', () => {
        // 1. Ejecutar función con ruta en español y idioma destino 'en'
        const result = getTranslatedPath("/blog/post-es", "en", mockPosts);
        // 2. Verificar que retorna la ruta traducida en inglés
        expect(result).toBe("/en/blog/post-en");
    });

    /**
     * Valida que una ruta en inglés se resuelva correctamente a su equivalente en español.
     * Escenario: post con ref_id "post-1" existe en ambos idiomas.
     */
    it('should translate English path to Spanish path', () => {
        // 1. Ejecutar función con ruta en inglés y idioma destino 'es'
        const result = getTranslatedPath("/en/blog/post-en", "es", mockPosts);
        // 2. Verificar que retorna la ruta traducida en español
        expect(result).toBe("/blog/post-es");
    });

    /**
     * Valida que la función retorne null cuando el post origen no tiene ref_id definido.
     * Escenario: post sin metadata de traducción no puede resolverse a otro idioma.
     */
    it('should return null if no ref_id is found', () => {
        // 1. Mock con post que carece de ref_id en frontmatter
        const emptyPosts = {
            "../pages/blog/no-ref.md": { frontmatter: {} }
        };
        // 2. Ejecutar función y verificar que retorna null (sin traducción disponible)
        const result = getTranslatedPath("/blog/no-ref", "en", emptyPosts);
        expect(result).toBeNull();
    });

    /**
     * Valida el manejo especial de páginas índice: "/" en español ↔ "/en" en inglés.
     * Escenario: páginas raíz con ref_id "home" deben traducirse correctamente.
     */
    it('should handle index pages correctly', () => {
        // 1. Mock de páginas índice con ref_id compartido "home"
        const indexPosts = {
            "../pages/index.md": { frontmatter: { ref_id: "home" } },
            "../pages/en/index.md": { frontmatter: { ref_id: "home" } }
        };

        // 2. Probar traducción español → inglés para ruta raíz
        const esToEn = getTranslatedPath("/", "en", indexPosts);
        expect(esToEn).toBe("/en");

        // 3. Probar traducción inglés → español para ruta raíz
        const enToEs = getTranslatedPath("/en", "es", indexPosts);
        expect(enToEs).toBe("/");
    });
});