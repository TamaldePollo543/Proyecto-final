# ENGLISH - Plataforma Interactiva de Aprendizaje de Inglés

Este proyecto es una aplicación web diseñada para ayudar a los usuarios a mejorar su inglés mediante correcciones gramaticales en tiempo real, ejercicios de comprensión de lectura y un seguimiento personalizado del progreso.

## 🚀 Configuración Rápida

Para que la aplicación funcione correctamente, debes configurar los servicios de Firebase en el archivo `js/config.js`.

### 1. Firebase (Autenticación y Base de Datos)
1. Ve a [Firebase Console](https://console.firebase.google.com/).
2. Crea un nuevo proyecto llamado "English App".
3. Habilita **Authentication** (Métodos de inicio de sesión: Email/Password y Google).
4. Habilita **Firestore Database** en modo prueba o producción con reglas de lectura/escritura para usuarios autenticados.
5. Registra una aplicación web para obtener tu objeto de configuración y cópialo en `js/config.js` dentro de la sección `FIREBASE`.

### 2. APIs Públicas
Las siguientes APIs se utilizan con sus endpoints públicos:
- **LanguageTool API**: Para corrección gramatical.
- **Datamuse API**: Para la palabra del día.
- **MyMemory API**: Para traducciones rápidas.

## 🛠️ Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Contenido**: Dataset RACE para ejercicios de lectura.
- **Backend-as-a-Service**: Firebase (Auth & Firestore).
- **Herramientas**: Fetch API, Promise context (all/race), LocalStorage.

## 📖 Funcionalidades
- **Niveles A1-C2**: Temario estructurado por niveles de competencia.
- **Comprensión de Lectura**: Ejercicios basados en el dataset RACE con retroalimentación inmediata.
- **Corrección Gramatical**: Análisis de texto en tiempo real.
- **Palabra del Día**: Ampliación diaria de vocabulario.
- **Historial**: Seguimiento de errores y progreso guardado en Firestore.
