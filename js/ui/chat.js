import { GeminiAPI } from '../api/index.js';

export function initChat() {
    const chatContainer = document.getElementById('chat-messages');
    const inputField = document.getElementById('chat-input-field');
    const sendBtn = document.getElementById('btn-send-chat');

    if (!chatContainer || !inputField || !sendBtn) return;

    const appendMessage = (text, sender) => {
        const bubble = document.createElement('div');
        bubble.className = `msg-bubble ${sender}-bubble`;
        bubble.textContent = text;
        chatContainer.appendChild(bubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    const handleSend = async () => {
        const text = inputField.value.trim();
        if (!text) return;

        inputField.value = '';
        appendMessage(text, 'user');

        // Indicador de escritura
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.innerHTML = '<span></span><span></span><span></span>';
        chatContainer.appendChild(typing);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        try {
            const aiResponse = await GeminiAPI.generate(`Actúa como un tutor de inglés amable y motivador. Responde al siguiente mensaje del estudiante en inglés (con una breve traducción o explicación en español si es necesario): "${text}"`);
            typing.remove();
            appendMessage(aiResponse, 'ai');
        } catch (error) {
            typing.remove();
            appendMessage("Lo siento, hubo un problema con la conexión del tutor.", 'ai');
        }
    };

    // Limpiar eventos previos si los hay (para evitar duplicados en re-inicializaciones)
    const newSendBtn = sendBtn.cloneNode(true);
    sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
    
    newSendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    console.log("Chat IA inicializado correctamente.");
}