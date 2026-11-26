# Arquitectura de Studium

## Estado

Aplicación local-first de escritorio, sin backend, cuenta ni sincronización.

## Stack

- Tauri 2 y Rust para la shell y almacenamiento portable.
- Vite y TypeScript sin framework.
- CSS adaptable y temas del sistema.
- JSON portable Studium-data.json; localStorage como respaldo/migración para navegador.

## Función de estudio desde archivo

- Extracción local de PDF, EPUB, DOCX, TXT y Markdown.
- src/study-plan.ts detecta encabezados, agrupa texto en bloques, selecciona términos y fragmentos, construye un resumen diverso, preguntas y tarjetas con evidencia.
- El plan calcula entre 2 y 5 sesiones según extensión/estructura, reparte minutos de forma exacta y usa objetivos observables, recuperación activa, estudio dirigido, práctica, checkpoint y registro de errores.
- Recupera hasta tres principios del corpus src/knowledge-base.ts y los incorpora como orientación pedagógica. Es heurístico local; no es IA ni entrenamiento de pesos.
- tests/study-plan.test.mjs verifica encabezados, evidencia, tarjetas, resumen, preguntas, texto sin encabezados, errores de extracción, duración y escalado.
- PDF escaneados requieren OCR no incluido; las heurísticas pueden producir resultados incompletos.

## Base de conocimiento

src/knowledge-base.ts contiene principios originales sobre aprendizaje, planificación, tutoría, evaluación, ciencias, lenguas, fiabilidad, privacidad y accesibilidad. Se recuperan por coincidencia de términos. src/ai.ts prepara el prompt del tutor, pero la conexión del chat IA a la interfaz sigue pendiente.

## Funciones

Biblioteca CRUD, notas, enlaces, tarjetas de repaso, temporizador, historial, meta diaria, progreso y respaldo JSON.

## Almacenamiento portable

La shell Rust expone load_portable_data, save_portable_data y portable_data_path. El archivo se crea junto a la aplicación; mantén Studium-data.json con ella. localStorage migra como respaldo en escritorio y sigue siendo el almacenamiento del navegador.

## Windows sin consola

src-tauri/src/main.rs establece el subsistema Windows GUI. src-tauri/build.rs también fija /SUBSYSTEM:WINDOWS para el binario. CI inspecciona el PE del debug, release y asset final: arquitectura x64/ARM64 y subsistema GUI 2. Los paquetes son EXE directos, no scripts o instaladores que abran consola.

## Distribución

Una release estable v0.1.1 con Windows x64/ARM64 EXE, Linux x64/ARM64 AppImage y macOS Intel/Apple Silicon ZIP con app. CI verifica assets, formatos y SHA-256 antes de retirar releases/tags antiguos.

## Limitaciones

No hay OCR, tutor IA conectado, exámenes interactivos, audio, anotación con lápiz, sincronización ni cuentas. Verifica el plan y fragmentos generados antes de estudiar.
