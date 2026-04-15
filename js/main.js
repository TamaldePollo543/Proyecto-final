import { AuthService } from './auth/authService.js';
import { FirestoreService } from './db/firestore.js';
import { ApiService } from './api/index.js';
import { UI, SpeechHelper } from './utils/helpers.js';
import { SYLLABUS } from './data.js';
import { ContentLoader } from './content/loader.js';
import { ReadingView } from './views/readingView.js';

// Elementos DOM
const screens = { auth: document.getElementById('auth-screen'), main: document.getElementById('main-content') };
const views = ['home', 'profile', 'topic', 'practice'].reduce((acc, v) => {
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

    const titles = { home: 'Inicio', profile: 'Perfil', topic: 'Lección', practice: 'Centro de Práctica' };
    document.getElementById('screen-title').textContent = titles[viewId] || 'ENGLISH';
    
    if (viewId === 'practice') {
        initPracticeHub();
    }
}

document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// ========== PRÁCTICA HUB ==========
let practiceLevel = "Básico";

function initPracticeHub() {
    // 1. Inicializar Lectura por defecto
    ReadingView.init(currentUser);

    // 2. Gestionar Tabs
    document.querySelectorAll('.practice-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.practice-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.getElementById(`practice-${target}-content`).classList.add('active');

            if (target === 'reading') {
                ReadingView.init(currentUser);
                document.getElementById('screen-title').textContent = 'Comprensión de Lectura';
            } else {
                document.getElementById('screen-title').textContent = 'Práctica de Escritura';
            }
        });
    });

    // 3. Gestionar Chips de Nivel
    document.querySelectorAll('#practice-level-chips .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#practice-level-chips .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            practiceLevel = chip.dataset.level;
            UI.showToast(`Nivel cambiado a: ${practiceLevel}`, 'info');
        });
    });
}

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

    // Mostrar área de práctica integrada
    const practiceArea = document.getElementById('integrated-practice-area');
    if (practiceArea) {
        practiceArea.classList.remove('hidden');
        // Resetear resultados al cambiar de nivel
        document.getElementById('result-container').classList.add('hidden');
        document.getElementById('exercise-input').value = '';
    }

    const container = document.getElementById('syllabus-container');
    let html = '';
    level.sections.forEach(sec => {
        html += `<div class="section-label"><ion-icon name="${sec.icon}"></ion-icon>${sec.type}</div><div class="syllabus-grid">`;
        sec.topics.forEach(topic => {
            html += `<div class="syllabus-card topic-card" data-id="${topic.id}" data-title="${topic.title}" data-desc="${topic.description}" data-level="${level.title}">
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
    const topicId = dataset.id; // Necesitamos el ID del dataset
    switchView('topic');
    document.getElementById('screen-title').textContent = 'Lección';
    document.getElementById('topic-title-display').textContent = dataset.title;
    document.getElementById('topic-level-badge').textContent = dataset.level;

    const container = document.getElementById('topic-explanation');
    
    // 1. Intentar cargar contenido estático primero
    const staticHtml = ContentLoader.getContent(topicId);
    
    if (staticHtml) {
        container.innerHTML = staticHtml;
        console.log(`Cargado contenido estático para: ${topicId}`);
        return;
    }

    // 2. Si no hay contenido estático, mostrar mensaje de error
    UI.showSkeleton(container, 3);
    container.innerHTML = `
        <div class="fallback-lesson">
            <h3>📖 ${dataset.title}</h3>
            <p>El contenido de esta lección no está disponible para este nivel.</p>
        </div>`;
}

// ========== AUDIO ==========
document.getElementById('btn-play-audio')?.addEventListener('click', () => {
    const content = document.getElementById('topic-explanation');
    if (!content) return;

    // Crear un clon para manipular el contenido sin afectar la UI
    const clone = content.cloneNode(true);
    
    // 1. Eliminar etiquetas <em> que suelen contener las traducciones
    clone.querySelectorAll('em').forEach(el => el.remove());

    // 2. Limpiar encabezados que tienen formato "English / Español"
    clone.querySelectorAll('h3, h4').forEach(h => {
        const parts = h.textContent.split('/');
        if (parts.length > 1) h.textContent = parts[0].trim();
    });

    // 3. Limpiar etiquetas EN: / ES: y el contenido que sigue a <br>
    clone.querySelectorAll('li').forEach(li => {
        // Si hay un <br>, usualmente lo que sigue es español (ya manejado por el em.remove() pero por si acaso)
        const htmlParts = li.innerHTML.split('<br>');
        if (htmlParts.length > 1) {
            li.innerHTML = htmlParts[0];
        }
        // Quitar prefijos "EN:"
        li.textContent = li.textContent.replace(/EN:\s*/g, '').trim();
    });

    // 4. Extraer el texto final
    const EnglishText = Array.from(clone.querySelectorAll('p, li, h3, h4'))
        .map(el => el.textContent.trim())
        .filter(text => text.length > 0)
        .join('. ');

    console.log("Locución seleccionada:", EnglishText);
    SpeechHelper.speak(EnglishText, 'en-US');
});

// ========== DICCIONARIO ==========
document.getElementById('btn-topic-dict')?.addEventListener('click', async () => {
    const input = document.getElementById('topic-dict-input').value.trim();
    if (!input) return UI.showToast('Escribe una palabra', 'warning');

    const resultDiv = document.getElementById('topic-dict-result');
    resultDiv.style.display = 'block';
    
    UI.showSkeleton(resultDiv, 1);
    
    try {
        const definitionData = await ApiService.getWordDefinition(input);
        ApiService.renderWordDefinition(definitionData, resultDiv);
    } catch (error) {
        resultDiv.innerHTML = `<p>No se encontró la definición de "${input}".</p>`;
    }
});

// ========== EJERCICIOS ==========
document.getElementById('btn-translate')?.addEventListener('click', async () => {
    const input = document.getElementById('exercise-input').value.trim();
    if (!input) return UI.showToast('Escribe algo para traducir', 'warning');
    
    const resultContainer = document.getElementById('result-container');
    const correctionDiv = document.getElementById('correction-content');
    
    resultContainer.classList.remove('hidden');
    UI.showSkeleton(correctionDiv, 1);

    try {
        const translation = await ApiService.translateToSpanish(input);
        correctionDiv.innerHTML = `<p><strong>Traducción:</strong> ${translation}</p>`;
    } catch (error) {
        UI.showToast('Error al traducir', 'error');
    }
});

document.getElementById('btn-check')?.addEventListener('click', async () => {
    const input = document.getElementById('exercise-input').value.trim();
    if (!input) return UI.showToast('Escribe algo', 'warning');

    const correctionDiv = document.getElementById('correction-content');
    document.getElementById('result-container').classList.remove('hidden');

    UI.showSkeleton(correctionDiv, 2);

    const ltRes = await ApiService.checkGrammar(input);

    // Renderizar corrección gramatical
    const matches = ltRes.matches || [];
    if (matches.length === 0) {
        correctionDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; color: var(--accent-emerald);">
                <ion-icon name="checkmark-circle" style="font-size: 24px;"></ion-icon>
                <p style="margin: 0;"><strong>¡Perfecto!</strong> Tu gramática es correcta.</p>
            </div>`;
    } else {
        let highlightedText = input;
        matches.sort((a, b) => b.offset - a.offset).forEach(m => {
            const start = m.offset;
            const end = m.offset + m.length;
            highlightedText = highlightedText.slice(0, start) + 
                `<span class="highlight-error">${highlightedText.slice(start, end)}</span>` + 
                highlightedText.slice(end);
        });

        let corrHtml = `<p class="highlighted-text">${highlightedText}</p><p style="margin-bottom: 15px; font-weight: 600;">Se encontraron ${matches.length} sugerencias:</p>`;
        matches.forEach(m => {
            const errorText = m.context.text.substr(m.context.offset, m.context.length);
            const suggestion = m.replacements[0]?.value || 'N/A';
            corrHtml += `
            <div class="correction-item">
                <p>⚠️ Error: <strong>"${errorText}"</strong></p>
                <p style="font-size: 13px; color: var(--text-muted);">${m.message}</p>
                <div class="suggestion">💡 Sugerencia: <strong>${suggestion}</strong></div>
            </div>`;
        });
        correctionDiv.innerHTML = corrHtml;
    }

    if (currentUser) {
        await FirestoreService.saveResult(currentUser.uid, input, ltRes, "");
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
    try {
        const { word, translation } = await ApiService.getRandomWordWithTranslation();
        container.innerHTML = `<h2>${word}</h2><p>${translation}</p>`;
    } catch (e) {
        container.innerHTML = '<h2>language</h2><p>idioma</p>';
    }
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
document.getElementById('btn-speak-word')?.addEventListener('click', () => {
    const word = document.querySelector('#word-container h2')?.textContent;
    if (word) SpeechHelper.speak(word, 'en-US');
});
document.getElementById('btn-back-levels')?.addEventListener('click', () => {
    document.getElementById('level-selection-container').classList.remove('hidden');
    document.getElementById('syllabus-view').classList.add('hidden');
});
document.getElementById('btn-back-syllabus')?.addEventListener('click', () => {
    switchView('home');
});