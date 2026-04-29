import { describe, it, expect } from 'vitest';
import { useTranslations, defaultLang, ui } from './ui';

// Pruebas unitarias para el sistema de traducciones
describe('useTranslations', () => {
    it('debe devolver la traduccion correcta para el idioma por defecto', () => {
        // Verifica el idioma base (español)
        const t = useTranslations(defaultLang);
        expect(t('nav.home')).toBe(ui[defaultLang]['nav.home']);
    });

    it('debe devolver la traduccion correcta para ingles', () => {
        // Verifica la traduccion al ingles
        const t = useTranslations('en');
        expect(t('nav.home')).toBe(ui['en']['nav.home']);
    });

    it('debe recurrir al idioma por defecto si la llave falta en el idioma destino', () => {
        // Verifica que si una llave no existe en el idioma destino, se use el valor del idioma base
        const t = useTranslations('en');
        expect(t('nav.about')).toBe('About');
    });

    it('debe manejar llaves desconocidas de forma segura', () => {
        // Verifica el comportamiento ante llaves inexistentes
        const t = useTranslations('es');
        // @ts-ignore
        expect(t('unknown.key')).toBeUndefined();
    });
});
