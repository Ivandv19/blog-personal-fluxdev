/**
 * Pruebas unitarias para el sistema de traducciones (useTranslations).
 *
 * @suite useTranslations
 * @framework vitest
 * @coverage
 * - Traducción correcta para idioma por defecto (es)
 * - Traducción correcta para idioma secundario (en)
 * - Fallback a idioma por defecto cuando falta una clave
 * - Manejo seguro de claves inexistentes
 */

import { describe, expect, it } from "vitest";
import { defaultLang, ui, useTranslations } from "./ui";

describe("useTranslations", () => {
	/**
	 * Verifica que useTranslations retorne la función correcta para acceder a las traducciones del idioma por defecto.
	 */
	it("debe devolver la traduccion correcta para el idioma por defecto", () => {
		// 1. Inicializar hook con idioma por defecto
		const t = useTranslations(defaultLang);
		// 2. Verificar que la clave se resuelve al valor esperado en ui[defaultLang]
		expect(t("nav.home")).toBe(ui[defaultLang]["nav.home"]);
	});

	/**
	 * Verifica que useTranslations funcione correctamente con un idioma secundario configurado.
	 */
	it("debe devolver la traduccion correcta para ingles", () => {
		// 1. Inicializar hook con idioma 'en'
		const t = useTranslations("en");
		// 2. Verificar que la clave se resuelve al valor esperado en ui['en']
		expect(t("nav.home")).toBe(ui.en["nav.home"]);
	});

	/**
	 * Verifica el comportamiento de fallback: si una clave no existe en el idioma destino,
	 * se retorna el valor del idioma por defecto en lugar de undefined.
	 */
	it("debe recurrir al idioma por defecto si la llave falta en el idioma destino", () => {
		// 1. Inicializar hook con idioma 'en' (que puede tener claves incompletas)
		const t = useTranslations("en");
		// 2. Solicitar clave que no existe en 'en' pero sí en defaultLang
		// 3. Verificar que se retorna el fallback ('About') en lugar de undefined
		expect(t("nav.about")).toBe("About");
	});

	/**
	 * Verifica que el sistema maneje de forma predecible las claves que no existen
	 * en ningún idioma configurado.
	 */
	it("debe manejar llaves desconocidas de forma segura", () => {
		// 1. Inicializar hook con idioma por defecto
		const t = useTranslations("es");
		// 2. Solicitar clave inexistente en cualquier idioma
		// 3. Verificar que retorna undefined en lugar de lanzar error
		// @ts-expect-error: probando comportamiento con clave no tipada
		expect(t("unknown.key")).toBeUndefined();
	});
});
