import { CONFIG } from '../config.js';

export const GeminiAPI = {
    async generate(prompt) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Gemini Error:", error);
            return "Lo siento, la IA no ha podido cargar la explicación.";
        }
    },

    async getTopicExplanation(title, description) {
        const prompt = `Actúa como un profesor de inglés experto. 
        Explica el tema: "${title}" (${description}). 
        Usa HTML simple para formatear (h3 para títulos, p para párrafos, ul/li para listas). 
        Incluye ejemplos claros y una breve conclusión. 
        No incluyas etiquetas de bloque de código markdown, solo el HTML puro.`;
        
        return await this.generate(prompt);
    }
};