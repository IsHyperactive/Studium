# Arquitectura de Studium

## Estado
MVP local-first de escritorio, distribuido en una sola release portable. No tiene backend, cuenta ni sincronización.

## Stack
- Tauri 2 + Rust (contenedor y comandos locales).
- Vite + TypeScript sin framework.
- CSS adaptable y modo claro/oscuro del sistema.
- JSON local portable `Studium-data.json`; localStorage queda como respaldo/migración para navegador.

## Funciones implementadas
- Materiales CRUD, búsqueda, filtros por materia y tipos.
- Editor sencillo de apuntes y enlaces.
- Tarjetas de repaso con intervalos básicos.
- Temporizador, pausa, reinicio, historial y registro manual.
- Dashboard y meta diaria.
- Respaldo JSON importar/exportar y borrado de datos.
- Lectura de PDF con texto, EPUB, DOCX, TXT y Markdown.
- Tutor IA opcional (API compatible con Chat Completions): instrucciones pedagógicas internas, contexto recuperado desde biblioteca y títulos de fuente visibles.
- Guías de estudio generadas por IA con validación de campos y fallback local.

## IA: diseño y privacidad
- `src/ai.ts` contiene el núcleo de tutoría, protocolos pedagógicos, recuperación de fragmentos y cliente HTTP.
- La base pedagógica es texto de instrucciones curado, no un dataset de entrenamiento ni pesos de modelo entrenados.
- El modelo se ejecuta en el proveedor que el usuario configura. Ollama permite ejecución local si el usuario instala y descarga un modelo compatible; proveedores remotos reciben los prompts y fragmentos enviados.
- La API key no se escribe en el almacenamiento local; permanece en memoria durante la sesión. URL, modelo y temperatura sí se guardan localmente.
- El contenido de documentos se trata como datos y las instrucciones incrustadas se ignoran; no se garantiza protección completa frente a prompt injection.
- Respuestas generadas no son verificación factual; el tutor debe declarar incertidumbre y usar títulos de fuentes, sin inventar páginas.
- El frontend tiene timeout de 90 segundos y validación de la estructura del plan. La generación puede fallar con modelos pequeños o contextos insuficientes.

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
No hay OCR, exámenes adaptativos completos, audio, lápiz, gestos, sync, cifrado ni pruebas automatizadas de flujos. El tutor depende de un proveedor/modelo configurado; no incluye modelo integrado ni fine-tuning. El ranking de biblioteca es heurístico, no búsqueda semántica vectorial. Las funciones actuales necesitan pruebas en hardware y revisión de accesibilidad.
