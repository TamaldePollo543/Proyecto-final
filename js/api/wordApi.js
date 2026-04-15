import { CONFIG } from '../config.js';

export const WordAPI = {
    async getRandomWord() {
        // Datamuse: busca palabras comunes que empiecen con una letra aleatoria
        const letters = 'abcdefghijklmnoprstw';
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const response = await fetch(`${CONFIG.RANDOM_WORD_API}?sp=${letter}*&max=50`);
        const words = await response.json();
        // Filtramos solo palabras simples (sin espacios) y de longitud razonable
        const single = words.filter(w => !w.word.includes(' ') && w.word.length >= 4 && w.word.length <= 10);
        if (!single || single.length === 0) return 'language';
        const randomIndex = Math.floor(Math.random() * single.length);
        return single[randomIndex].word;
    },

    async translateToSpanish(text) {
        const response = await fetch(`${CONFIG.MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=en|es`);
        const data = await response.json();
        return data.responseData.translatedText;
    },

    async getRandomWordWithTranslation() {
        try {
            const word = await this.getRandomWord();
            const translation = await this.translateToSpanish(word);
            return { word, translation };
        } catch (error) {
            console.error('WordAPI error:', error);
            return { word: 'language', translation: 'idioma' };
        }
    },

    async getWordDefinition(word) {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!response.ok) throw new Error("Palabra no encontrada");
        const data = await response.json();
        return data[0];
    },

    renderDefinition(data, container) {
        const audioUrl = data.phonetics?.find(p => p.audio)?.audio;
        const audioBtn = audioUrl ? `<button class="btn-icon" onclick="new Audio('${audioUrl}').play()"><ion-icon name="volume-high"></ion-icon></button>` : '';

        const phonetics = data.phonetics?.find(p => p.text)?.text || '';
        const meaningsHtml = data.meanings.map(m => `
      <div style="margin-top: 15px;">
        <strong style="color: var(--secondary); text-transform: capitalize;">${m.partOfSpeech}</strong>
        <ul class="definition-list" style="margin-top: 5px; padding-left: 20px; list-style-type: disc;">
          ${m.definitions.slice(0, 2).map(d => `<li class="def-item">${d.definition}</li>`).join('')}
        </ul>
      </div>
    `).join('');

        container.innerHTML = `
      <div class="dict-result-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <h3 style="margin: 0; color: var(--primary); font-size: 1.5rem;">${data.word}</h3>
            <span style="color: #64748b; font-family: monospace;">${phonetics}</span>
            ${audioBtn}
        </div>
        <button id="btn-translate-def" class="btn-secondary" style="padding: 5px 12px; font-size: 12px; height: auto;">
            <ion-icon name="language-outline"></ion-icon> Traducir
        </button>
      </div>
      <div id="english-definitions">
        ${meaningsHtml}
      </div>
      <div id="spanish-definitions" class="hidden" style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--glass-border); background: rgba(16, 185, 129, 0.05); border-radius: 8px; padding: 10px;">
        <p style="font-size: 12px; color: var(--accent-emerald); margin-bottom: 5px; font-weight: 600;">TRADUCCIÓN:</p>
        <div id="translated-content"></div>
      </div>
    `;

        // Agregar evento al botón de traducir
        container.querySelector('#btn-translate-def')?.addEventListener('click', async (e) => {
            const btn = e.currentTarget;
            const target = container.querySelector('#spanish-definitions');
            const content = container.querySelector('#translated-content');
            
            if (!target.classList.contains('hidden')) {
                target.classList.add('hidden');
                btn.innerHTML = '<ion-icon name="language-outline"></ion-icon> Traducir';
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<ion-icon name="sync-outline" class="animate-spin"></ion-icon> Traduciendo...';
            
            try {
                // Recopilar todas las definiciones para traducir de una vez
                const defs = Array.from(container.querySelectorAll('.def-item')).map(el => el.textContent);
                const textToTranslate = defs.join(' || ');
                const translatedText = await this.translateToSpanish(textToTranslate);
                const translatedDefs = translatedText.split(' || ');
                
                content.innerHTML = translatedDefs.map(d => `<p style="margin-bottom: 5px; font-size: 0.95rem;">• ${d.trim()}</p>`).join('');
                target.classList.remove('hidden');
                btn.innerHTML = '<ion-icon name="eye-off-outline"></ion-icon> Ocultar';
            } catch (err) {
                console.error("Error al traducir definiciones:", err);
            } finally {
                btn.disabled = false;
            }
        });
    }
};