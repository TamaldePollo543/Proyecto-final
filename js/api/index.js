// js/api/index.js
import { GrammarAPI } from './grammarApi.js';
import { WordAPI } from './wordApi.js';
import { CONFIG } from '../config.js';

/**
 * Helper: usa Promise.race para establecer un timeout en cualquier promesa.
 * Si la promesa no se resuelve en `ms` milisegundos, se rechaza con un error de timeout.
 */
function fetchWithTimeout(promise, ms = 10000) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout: la petición tardó más de ${ms / 1000}s`)), ms)
    );
    return Promise.race([promise, timeout]);
}

export const ApiService = {
    _explanationCache: new Map(),

    async getRandomWordWithTranslation() {
        try {
            // Promise.race: la petición compite contra un timeout de 10 segundos
            return await fetchWithTimeout(WordAPI.getRandomWordWithTranslation(), 10000);
        } catch (error) {
            console.warn("Word API falló o timeout:", error.message);
            return { word: "English", translation: "Inglés" };
        }
    },

    async checkGrammar(text) {
        try {
            // Promise.race: timeout de 15s para corrección gramatical (puede tardar más)
            return await fetchWithTimeout(GrammarAPI.checkGrammar(text), 15000);
        } catch (error) {
            console.warn("Grammar API falló o timeout:", error.message);
            return { matches: [] };
        }
    },

    async getWordDefinition(word) {
        // Promise.race: timeout de 10s para definiciones
        return await fetchWithTimeout(WordAPI.getWordDefinition(word), 10000);
    },

    renderWordDefinition(data, container) {
        WordAPI.renderDefinition(data, container);
    },

    async translateToSpanish(text) {
        // Promise.race: timeout de 10s para traducciones
        return await fetchWithTimeout(WordAPI.translateToSpanish(text), 10000);
    }
};