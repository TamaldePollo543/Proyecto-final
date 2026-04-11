# ENGLISH - Asistente Interactivo de Inglés (Mashup)

Este proyecto es una aplicación web diseñada para ayudar a los usuarios a mejorar su inglés mediante correcciones gramaticales en tiempo real, explicaciones potenciadas por IA y un seguimiento personalizado del progreso.

## 🚀 Configuración Rápida

Para que la aplicación funcione correctamente, debes configurar tus propias claves de API en el archivo `js/config.js`.

### 1. Firebase (Autenticación y Base de Datos)
1. Ve a [Firebase Console](https://console.firebase.google.com/).
2. Crea un nuevo proyecto llamado "English Mashup".
3. Habilita **Authentication** (Métodos de inicio de sesión: Email/Password y Google).
4. Habilita **Firestore Database** en modo prueba o producción con reglas de lectura/escritura para usuarios autenticados.
5. Registra una aplicación web para obtener tu objeto de configuración y cópialo en `js/config.js` dentro de la sección `FIREBASE`.

### 2. OpenAI API
1. Obtén tu clave de API en [OpenAI Platform](https://platform.openai.com/).
2. Copia la clave en `OPENAI_API_KEY` dentro de `js/config.js`.

### 3. APIs Públicas
Las siguientes APIs se utilizan con sus endpoints públicos, no requieren configuración adicional inmediata:
- **LanguageTool API**: Para corrección gramatical.
- **Random Word API**: Para la palabra del día.
- **MyMemory API**: Para traducciones rápidas.

## 🛠️ Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Diseño**: Siguiendo los principios de **Google Stitch AI**.
- **Backend-as-a-Service**: Firebase (Auth & Firestore).
- **IA/ML**: OpenAI GPT-3.5 API.
- **Herramientas**: Fetch API, Promise context (all/race).

## ⚠️ Nota de Seguridad
En un entorno de producción, las claves de OpenAI no deben exponerse en el frontend. Se recomienda usar un Backend o Firebase Functions como proxy. Para este proyecto académico, se mantienen en `js/config.js` por simplicidad, pero se advierte sobre su riesgo.
