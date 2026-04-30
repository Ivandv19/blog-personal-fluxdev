/**
 * Configuración global de pruebas unitarias.
 * Extiende Vitest con matchers de @testing-library/jest-dom para aserciones de DOM.
 */

import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

/**
 * Registra los matchers de jest-dom en el objeto expect de Vitest.
 * @sideEffects - Añade métodos como toBeInTheDocument, toHaveClass, etc. al contexto global de tests
 */
expect.extend(matchers);