import { CONFIG } from '../config.js';

export const GrammarAPI = {
    async checkGrammar(text) {
        const params = new URLSearchParams();
        params.append('text', text);
        params.append('language', 'en-US');

        try {
            const response = await fetch(CONFIG.LANGUAGETOOL_URL, {
                method: 'POST',
                body: params
            });
            return await response.json();
        } catch (error) {
            console.error("LanguageTool error:", error);
            return { matches: [] };
        }
    },

    renderCorrection(data, container) {
        if (data.matches.length === 0) {
            container.innerHTML = '<p class="suggestion">¡Excelente! No se encontraron errores gramaticales.</p>';
            return;
        }

        let html = '<ul>';
        data.matches.forEach(m => {
            const context = m.context.text.substr(m.context.offset, m.context.length);
            const suggestion = m.replacements[0]?.value || 'N/A';
            html += `<li><strong>"${context}"</strong>: ${m.message}. <br> Sugerencia: <span class="suggestion">${suggestion}</span></li>`;
        });
        html += '</ul>';
        container.innerHTML = html;
    }
};
