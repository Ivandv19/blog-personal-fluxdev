import { describe, it, expect } from 'vitest'
import { getTranslatedPath } from './posts'

describe('getTranslatedPath', () => {
    const mockPosts = {
        "../pages/blog/post-es.md": {
            frontmatter: { ref_id: "post-1" }
        },
        "../pages/en/blog/post-en.md": {
            frontmatter: { ref_id: "post-1" }
        },
        "../pages/index.astro": {}, // Should be ignored
        "../pages/en/index.astro": {}
    }

    it('should translate Spanish path to English path', () => {
        const result = getTranslatedPath("/blog/post-es", "en", mockPosts);
        expect(result).toBe("/en/blog/post-en");
    });

    it('should translate English path to Spanish path', () => {
        const result = getTranslatedPath("/en/blog/post-en", "es", mockPosts);
        expect(result).toBe("/blog/post-es");
    });

    it('should return null if no ref_id is found', () => {
        const emptyPosts = {
            "../pages/blog/no-ref.md": { frontmatter: {} }
        };
        const result = getTranslatedPath("/blog/no-ref", "en", emptyPosts);
        expect(result).toBeNull();
    });

    it('should handle index pages correctly', () => {
        const indexPosts = {
            "../pages/index.md": { frontmatter: { ref_id: "home" } },
            "../pages/en/index.md": { frontmatter: { ref_id: "home" } }
        };
        const esToEn = getTranslatedPath("/", "en", indexPosts);
        expect(esToEn).toBe("/en");

        const enToEs = getTranslatedPath("/en", "es", indexPosts);
        expect(enToEs).toBe("/");
    });
});
