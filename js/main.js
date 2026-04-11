import { AuthService } from './auth/authService.js';
import { FirestoreService } from './db/firestore.js';
import { GeminiAPI, GrammarAPI, WordAPI } from './api/index.js';
import { UI, SpeechHelper } from './utils/helpers.js';
import { SYLLABUS } from './data.js';
import { initChat } from './ui/chat.js';

// Elementos DOM
const screens = { auth: document.getElementById('auth-screen'), main: document.getElementById('main-content') };
const views = ['home', 'exercises', 'history', 'profile', 'chat-ai', 'topic'].reduce((acc, v) => {
    acc[v] = document.getElementById(`${v}-view`);
    return acc;
}, {});

let currentUser = null;
let currentLevel = null;

// ========== AUTENTICACIÓN ==========
const authForm = document.getElementById('auth-form');
let authMode = 'login';

document.getElementById('tab-login')?.addEventListener('click', () => setAuthMode('login'));
document.getElementById('tab-signup')?.addEventListener('click', () => setAuthMode('signup'));
document.getElementById('google-login')?.addEventListener('click', async () => {
    try {
        await AuthService.loginWithGoogle();
    } catch (error) {
        UI.showToast(error.message, 'error');
    }
});
document.getElementById('btn-logout')?.addEventListener('click', () => AuthService.logout());

function setAuthMode(mode) {
    authMode = mode;
    document.getElementById('auth-submit').textContent = mode === 'login' ? 'Entrar' : 'Registrarse';
    document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${mode}`).classList.add('active');
}

authForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        if (authMode === 'login') await AuthService.login(email, password);
        else await AuthService.signup(email, password);
    } catch (error) {
        UI.showToast(error.message, 'error');
    }
});

// ========== NAVEGACIÓN ==========
function switchView(viewId) {
    Object.values(views).forEach(v => v?.classList.add('hidden'));
    views[viewId]?.classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`[data-view="${viewId}"]`)?.classList.add('active');

    const titles = { home: 'Inicio', exercises: 'Ejercicios', history: 'Historial', profile: 'Perfil', 'chat-ai': 'Tutor IA' };
    document.getElementById('screen-title').textContent = titles[viewId];

    if (viewId === 'history') loadHistory();
    if (viewId === 'exercises') updatePracticeView();
}

document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// ========== NIVELES Y TEMARIO ==========
function renderLevels() {
    const container = document.getElementById('levels-grid');
    container.innerHTML = SYLLABUS.map(level => `
    <div class="level-card" data-level-id="${level.id}">
      <div class="level-card-icon" style="background: ${level.bgLight}; color: ${level.themeColor}">
        <ion-icon name="${level.id === 'level-basic' ? 'school' : level.id === 'level-intermediate' ? 'laptop' : 'medal'}-outline"></ion-icon>
      </div>
      <div class="level-card-info"><h4>${level.title}</h4><p>${level.sections.length} secciones</p></div>
    </div>
  `).join('');

    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', () => showSyllabus(card.dataset.levelId));
    });
}

function showSyllabus(levelId) {
    const level = SYLLABUS.find(l => l.id === levelId);
    if (!level) return;
    currentLevel = level;

    document.getElementById('level-selection-container').classList.add('hidden');
    document.getElementById('syllabus-view').classList.remove('hidden');
    document.getElementById('current-level-title').textContent = level.title;

    const container = document.getElementById('syllabus-container');
    let html = '';
    level.sections.forEach(sec => {
        html += `<div class="section-label"><ion-icon name="${sec.icon}"></ion-icon>${sec.type}</div><div class="syllabus-grid">`;
        sec.topics.forEach(topic => {
            html += `<div class="syllabus-card topic-card" data-title="${topic.title}" data-desc="${topic.description}" data-level="${level.title}">
        <div class="syllabus-icon" style="background: ${level.bgLight}; color: ${level.themeColor}"><ion-icon name="book-outline"></ion-icon></div>
        <div class="syllabus-info"><h4>${topic.title}</h4><p>${topic.description}</p></div>
        <ion-icon name="chevron-forward"></ion-icon>
      </div>`;
        });
        html += `</div>`;
    });
    container.innerHTML = html;

    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', () => openTopic(card.dataset));
    });
}

async function openTopic(dataset) {
    switchView('topic');
    document.getElementById('screen-title').textContent = 'Lección';
    document.getElementById('topic-title-display').textContent = dataset.title;
    document.getElementById('topic-level-badge').textContent = dataset.level;

    const container = document.getElementById('topic-explanation');
    UI.showSkeleton(container, 3);

    const html = await GeminiAPI.getTopicExplanation(dataset.title, dataset.desc);
    container.innerHTML = html;
}

// ========== EJERCICIOS ==========
document.getElementById('btn-check')?.addEventListener('click', async () => {
    const input = document.getElementById('exercise-input').value.trim();
    if (!input) return UI.showToast('Escribe algo', 'warning');

    const correctionDiv = document.getElementById('correction-content');
    const aiDiv = document.getElementById('ai-content');
    document.getElementById('result-container').classList.remove('hidden');

    UI.showSkeleton(correctionDiv, 2);
    UI.showSkeleton(aiDiv, 3);

    const [ltRes, aiRes] = await Promise.all([
        GrammarAPI.checkGrammar(input),
        GeminiAPI.generate(`Analiza esta frase en inglés: "${input}". Explica errores y da 2 ejemplos corregidos.`)
    ]);

    GrammarAPI.renderCorrection(ltRes, correctionDiv);
    aiDiv.innerHTML = `<p>${aiRes}</p>`;

    if (currentUser) {
        await FirestoreService.saveResult(currentUser.uid, input, ltRes, aiRes);
    }
});

// ========== HISTORIAL ==========
async function loadHistory() {
    if (!currentUser) return;
    const container = document.getElementById('history-items');
    const history = await FirestoreService.loadHistory(currentUser.uid);

    if (history.length === 0) {
        container.innerHTML = '<div class="empty-state"><ion-icon name="document-text-outline"></ion-icon><p>No hay historial</p></div>';
        return;
    }

    container.innerHTML = history.map(h => `
    <div class="card history-card">
      <div class="card-header">
        <span class="badge">${new Date(h.timestamp.toDate()).toLocaleDateString()}</span>
        <span class="badge" style="background: ${h.errors > 0 ? '#fee2e2' : '#ecfdf5'}; color: ${h.errors > 0 ? '#ef4444' : '#10b981'}">${h.errors} errores</span>
      </div>
      <p><strong>Frase:</strong> ${h.text}</p>
      <div class="explanation-box"><small>${h.explanation?.substring(0, 100)}...</small></div>
    </div>
  `).join('');
}

// ========== PALABRA DEL DÍA ==========
async function loadDailyWord() {
    const container = document.getElementById('word-container');
    container.innerHTML = '<div class="skeleton-text" style="width: 60%; height: 32px;"></div>';
    const { word, translation } = await WordAPI.getRandomWordWithTranslation();
    container.innerHTML = `<h2>${word}</h2><p>${translation}</p>`;
}

// ========== INICIALIZACIÓN ==========
function updateUserProfile(user) {
    const name = user.displayName || 'Estudiante';
    const photo = user.photoURL || `https://ui-avatars.com/api/?name=${name}&background=10b981&color=fff`;
    document.getElementById('user-img').src = photo;
    document.getElementById('profile-img').src = photo;
    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-email').textContent = user.email;
}

function updatePracticeView() {
    const badge = document.getElementById('practice-level-badge');
    if (currentLevel) {
        badge.textContent = currentLevel.title;
        badge.style.background = currentLevel.bgLight;
    }
}

AuthService.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        
        // Cambio de pantallas inmediato para mejorar la respuesta UI
        screens.auth.classList.remove('active');
        screens.main.classList.add('active');
        switchView('home');

        // Carga de componentes secundarios con manejo de errores individual
        try {
            updateUserProfile(user);
            renderLevels();
            loadDailyWord(); 
            initChat();
        } catch (error) {
            console.error("Error al cargar componentes tras login:", error);
        }
    } else {
        currentUser = null;
        screens.main.classList.remove('active');
        screens.auth.classList.add('active');
    }
});

// Eventos adicionales
document.getElementById('refresh-word')?.addEventListener('click', loadDailyWord);
document.getElementById('btn-back-levels')?.addEventListener('click', () => {
    document.getElementById('level-selection-container').classList.remove('hidden');
    document.getElementById('syllabus-view').classList.add('hidden');
});
document.getElementById('btn-back-syllabus')?.addEventListener('click', () => {
    document.getElementById('level-selection-container').classList.add('hidden');
    document.getElementById('syllabus-view').classList.remove('hidden');
});