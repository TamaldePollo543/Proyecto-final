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
      <div style="margin-top: 10px;">
        <strong style="color: var(--secondary);">${m.partOfSpeech}</strong>
        <ul style="margin-top: 5px; padding-left: 20px;">
          ${m.definitions.slice(0, 2).map(d => `<li>${d.definition}</li>`).join('')}
        </ul>
      </div>
    `).join('');

        container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
        <h3 style="margin: 0; color: var(--primary);">${data.word}</h3>
        <span style="color: #64748b;">${phonetics}</span>
        ${audioBtn}
      </div>
      ${meaningsHtml}
    `;
    }
};