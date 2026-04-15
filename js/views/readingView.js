import { RACE_DATA } from '../data/raceData.js';
import { FirestoreService } from '../db/firestore.js';
import { UI } from '../utils/helpers.js';

export const ReadingView = {
    currentArticle: null,
    currentQuestionIndex: 0,
    score: 0,
    userAnswers: [],

    init(user = null) {
        this.currentUser = user;
        this.container = document.getElementById('practice-reading-content');
        this.loadRandomArticle();
    },

    loadRandomArticle() {
        const randomIndex = Math.floor(Math.random() * RACE_DATA.length);
        this.currentArticle = RACE_DATA[randomIndex];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.render();
    },

    render() {
        if (!this.currentArticle) return;

        const isLastQuestion = this.currentQuestionIndex >= this.currentArticle.questions.length;
        
        if (isLastQuestion) {
            this.renderResults();
            return;
        }

        const question = this.currentArticle.questions[this.currentQuestionIndex];
        const options = this.currentArticle.options[this.currentQuestionIndex];
        const total = this.currentArticle.questions.length;
        const progress = Math.round(((this.currentQuestionIndex) / total) * 100);
        
        this.container.innerHTML = `
            <div class="reading-container animate-fade-in">
                <div class="card article-card card-premium">
                    <div class="card-header">
                        <span class="badge-accent">📖 Reading Passage</span>
                        <div class="progress-info">${this.currentQuestionIndex + 1} / ${total}</div>
                    </div>
                    <div style="height:3px; background: rgba(255,255,255,0.07); border-radius:4px; margin-bottom:16px; overflow:hidden;">
                        <div style="height:100%; width:${progress}%; background: linear-gradient(90deg, #6366f1, #a855f7); border-radius:4px; transition: width 0.5s ease;"></div>
                    </div>
                    <div class="article-content">
                        <p>${this.currentArticle.article}</p>
                    </div>
                </div>

                <div class="card question-card card-premium">
                    <h3 class="question-text">❓ ${question}</h3>
                    <div class="options-grid">
                        ${options.map((option, idx) => `
                            <button class="option-btn" data-index="${idx}">
                                <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                                <span class="option-label">${option}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div id="feedback-area" class="feedback-area hidden"></div>
                    <div class="navigation-actions hidden" id="nav-actions">
                        <button id="btn-next-question" class="btn-primary">
                            ${this.currentQuestionIndex + 1 >= total ? '🏁 Ver resultados' : 'Siguiente pregunta →'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const optionBtns = this.container.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswer(parseInt(btn.dataset.index)));
        });

        const nextBtn = this.container.querySelector('#btn-next-question');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentQuestionIndex++;
                this.render();
            });
        }
    },

    async handleAnswer(selectedIndex) {
        const correctAnswerLetter = this.currentArticle.answers[this.currentQuestionIndex];
        const correctIndex = correctAnswerLetter.charCodeAt(0) - 65;
        const isCorrect = selectedIndex === correctIndex;

        if (isCorrect) this.score++;

        // Disable all buttons
        const optionBtns = this.container.querySelectorAll('.option-btn');
        optionBtns.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === correctIndex) {
                btn.classList.add('correct');
            } else if (idx === selectedIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Show feedback
        const feedbackArea = this.container.querySelector('#feedback-area');
        const explanation = this.currentArticle.explanations[this.currentQuestionIndex];
        
        feedbackArea.innerHTML = `
            <div class="feedback-content ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="feedback-header">
                    <ion-icon name="${isCorrect ? 'checkmark-circle' : 'close-circle'}"></ion-icon>
                    <span>${isCorrect ? '¡Correcto!' : 'Incorrecto'}</span>
                </div>
                <p class="explanation-text">${explanation}</p>
            </div>
        `;
        feedbackArea.classList.remove('hidden');
        this.container.querySelector('#nav-actions').classList.remove('hidden');
    },

    renderResults() {
        const totalQuestions = this.currentArticle.questions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);
        const emoji = percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '💪';
        const msg = percentage >= 80 ? '¡Excelente trabajo!' : percentage >= 50 ? '¡Buen esfuerzo!' : '¡Sigue practicando!';

        this.container.innerHTML = `
            <div class="results-container animate-fade-in">
                <div class="card results-card card-premium text-center">
                    <div class="score-circle">
                        <span class="score-number">${this.score}/${totalQuestions}</span>
                        <span class="score-label">Puntos</span>
                    </div>
                    <h2>${emoji} ${msg}</h2>
                    <p>Obtuviste un <strong style="color: var(--primary-solid);">${percentage}%</strong> de aciertos en esta lectura.</p>
                    
                    <div class="actions">
                        <button id="btn-retry" class="btn-secondary">🔁 Reintentar</button>
                        <button id="btn-new-reading" class="btn-primary">📚 Nueva lectura</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btn-retry').addEventListener('click', () => {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.render();
        });

        document.getElementById('btn-new-reading').addEventListener('click', () => {
            this.loadRandomArticle();
        });

        // Optional: Save score to Firestore
        this.saveScore(percentage);
    },

    async saveScore(percentage) {
        if (!this.currentUser) return;
        
        console.log(`Saving score: ${percentage}% and ${this.score} correct answers`);
        try {
            await FirestoreService.saveReadingResult(this.currentUser.uid, percentage);
        } catch (e) {
            console.error("Error saving score:", e);
        }
    }
};
