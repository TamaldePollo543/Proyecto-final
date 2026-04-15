// js/api/index.js
import { GrammarAPI } from './grammarApi.js';
import { WordAPI } from './wordApi.js';
import { CONFIG } from '../config.js';

export const ApiService = {
    _explanationCache: new Map(),

    async getRandomWordWithTranslation() {
        try {
            return await WordAPI.getRandomWordWithTranslation();
        } catch (error) {
            return { word: "English", translation: "Inglés" };
        }
    },

    async checkGrammar(text) {
        try {
            return await GrammarAPI.checkGrammar(text);
        } catch (error) {
            return { matches: [] };
        }
    },

    async getWordDefinition(word) {
        return await WordAPI.getWordDefinition(word);
    },

    renderWordDefinition(data, container) {
        WordAPI.renderDefinition(data, container);
    },

    async translateToSpanish(text) {
        return await WordAPI.translateToSpanish(text);
    }
};