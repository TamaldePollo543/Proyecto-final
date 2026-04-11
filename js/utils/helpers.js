export const UI = {
    showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = msg;
        document.getElementById('toast-container')?.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    showSkeleton(container, count = 3) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `<div class="skeleton-text" style="height: 20px; margin-bottom: 10px;"></div>`;
        }
        container.innerHTML = html;
    },

    hideSkeleton(container, content) {
        container.innerHTML = content;
    }
};

export const SpeechHelper = {
    speak(text, lang = 'en-US') {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            return false;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
        return true;
    },

    cancel() {
        window.speechSynthesis.cancel();
    }
};