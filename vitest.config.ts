/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

/**
 * Configuración de Vitest para pruebas unitarias del proyecto.
 * Define entorno de ejecución, plugins de transformación y archivos de inicialización.
 */
export default defineConfig({
    plugins: [
        /**
         * Plugin personalizado para mockear archivos Markdown/MDX durante pruebas.
         * @purpose Evitar errores de importación de .md/.mdx que no son procesables en entorno de test
         * @behavior Reemplaza el contenido de archivos .md/.mdx con un objeto vacío exportado
         */
        {
            name: 'mock-markdown',
            transform(code, id) {
                // Interceptar imports de archivos Markdown y retornar mock seguro para tests
                if (id.endsWith('.md') || id.endsWith('.mdx')) {
                    return {
                        code: 'export default {}',
                        map: null
                    };
                }
            }
        }
    ],
    test: {
        /**
         * Entorno de ejecución para pruebas que interactúan con DOM.
         * jsdom simula un entorno de navegador para componentes que renderizan HTML.
         */
        environment: 'jsdom',

        /**
         * Habilita variables globales de Vitest (describe, it, expect) sin necesidad de importarlas.
         * @note Mantener en true para consistencia con el estilo de tests del proyecto
         */
        globals: true,

        /**
         * Archivo de inicialización que se ejecuta antes de cada suite de pruebas.
         * Usado para configuraciones globales, mocks compartidos o utilidades de test.
         */
        setupFiles: ['./src/test/setup.ts'],
    },
});