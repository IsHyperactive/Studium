# Arquitectura de Studium

## Estado
MVP local-first de escritorio, distribuido en una sola release portable. No tiene backend, cuenta ni sincronización.

## Stack
- Tauri 2 + Rust (contenedor y comandos locales).
- Vite + TypeScript sin framework.
- CSS adaptable y modo claro/oscuro del sistema.
- JSON local portable `Studium-data.json`; localStorage queda como respaldo/migración para navegador.

## Base de conocimiento pedagógica\n- `src/knowledge-base.ts`: corpus original de principios de aprendizaje, tutoría, planificación, evaluación, lenguas, ciencias, humanidades, fiabilidad, privacidad y accesibilidad. Recuperación por coincidencia de términos para añadir contexto relevante.\n- `src/ai.ts`: `learningSystemPrompt()` combina el rol tutor con artículos recuperados y contexto de materiales del estudiante.\n- No modifica los pesos de un modelo ni entrena una IA; aporta conocimiento contextual (RAG ligero). La conexión del tutor a la interfaz y la ejecución de proveedor IA siguen pendientes.\n\n## Funciones implementadas
- Materiales CRUD, búsqueda, filtros por materia y tipos.
- Editor sencillo de apuntes y enlaces.
- Tarjetas de repaso con intervalos básicos.
- Temporizador, pausa, reinicio, historial y registro manual.
- Dashboard y meta diaria.
- Respaldo JSON importar/exportar y borrado de datos.

## Almacenamiento portable
La shell Rust expone `load_portable_data`, `save_portable_data` y `portable_data_path`. El archivo se crea junto al ejecutable; AppImage usa la ruta del archivo AppImage y macOS coloca los datos junto al bundle `.app`. Mantén `Studium-data.json` con la aplicación al mover/copiar la carpeta. La carpeta requiere permisos de escritura.

El frontend usa localStorage como respaldo y migra sus datos existentes al archivo portable en el primer inicio de escritorio cuando este no existe. En navegador, permanece en localStorage.

## Distribución
Solo paquetes portables:
- Windows x64 y ARM64: ZIP con `Studium.exe`.
- Linux x64 y ARM64: AppImage.
- macOS Intel y Apple Silicon: ZIP con bundle `.app`.

No se publican NSIS, DEB, DMG, APK ni versiones redundantes. Cada build exitoso actualiza la única release `v0.1.0-portable` y elimina releases/tags de distribución anteriores.

## Archivos principales
- `src/main.ts`: lógica, vistas, formularios y acciones.
- `src/style.css`: diseño adaptable, tema claro/oscuro.
- `src-tauri/src/lib.rs`: almacenamiento portable.
- `src-tauri/tauri.conf.json`: configuración Tauri.
- `.github/workflows/compilar.yml`: CI y publicación unificada.

## Limitaciones conocidas
No hay importación/lectura de PDF o EPUB, OCR, exámenes, IA, audio, lápiz, gestos, sync, cifrado ni pruebas automatizadas de los flujos. Las funciones actuales necesitan pruebas en hardware y revisión de accesibilidad.
