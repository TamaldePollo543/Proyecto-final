import { CONFIG } from '../config.js';

export const OpenAIAPI = {
    async getExplanation(text, topicContext = null) {
        let prompt = `Actúa como profesor de inglés. Analiza: "${text}". Explica errores y da 2 ejemplos.`;
        if (topicContext) {
            prompt += `\nEl estudiante practica: "${topicContext.title}". Evalúa si aplica correctamente.`;
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return data.choices[0].message.content;
        } catch (error) {
            console.warn("OpenAI falló:", error);
            return null;
        }
    }
};