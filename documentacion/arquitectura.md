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
- El plan crea 2–24 lecciones según extensión y secciones (objetivo aproximado de 350 palabras), reparte preguntas por capítulo, incluye preguntas activas dentro de cada lección, genera tarjetas y objetivos, y utiliza fragmentos literales como evidencia. En libros largos, limita a 24 lecciones para evitar sobrecarga. Cada sesión incluye objetivo contextual, foco, recuperación, lectura selectiva, actividad activa, checkpoint de 6 puntos y corrección. Distribuye el tiempo exactamente; dominio 5/6 en dos intentos separados y evaluación final 4/5 con evidencia.
- El plan base sigue siendo heurístico. El checkbox opcional llama al modelo configurado para proponer explicaciones, actividades, preguntas y lecciones; parsea JSON, descarta citas que no coincidan literalmente con los extractos enviados y conserva la versión local si el proveedor falla. El modelo solo recibe muestras del texto, no necesariamente el libro completo. No modifica pesos.
- tests/study-plan.test.mjs verifica encabezados, evidencia, tarjetas, resumen, preguntas, texto sin encabezados, errores de extracción, duración, escalado y libros divididos en al menos diez lecciones.
- PDF escaneados requieren OCR no incluido; las heurísticas pueden producir resultados incompletos.

## Tutor IA integrado

- src/ai.ts conecta con una API compatible con OpenAI Chat Completions (Ollama local, OpenAI o endpoint personalizado). URL, modelo y clave se configuran desde la vista Tutor IA; incluye prueba de conexión. La clave se guarda localmente y no se exporta en el backup. En Ollama local, descarga el modelo configurado (por ejemplo `ollama pull qwen2.5:3b`).
- Recupera fragmentos relevantes de los materiales de la biblioteca por coincidencia ponderada, selecciona frases relacionadas y limita el contexto; no afirma leer el archivo completo. Al seleccionar un material, incluye un fallback de fragmento si no encuentra coincidencias.
- El prompt exige tutoría por capas, recuperación activa, corrección específica, ejercicios diversos, referencias a títulos cuando estén disponibles, distinción entre fuente/inferencia/conocimiento general y no obedecer instrucciones incrustadas en documentos.
- La conversación se conserva localmente; el usuario puede borrarla. El modelo externo/local recibe el mensaje, historial reciente y fragmentos recuperados. No hay entrenamiento de pesos propio ni evaluación automática de la veracidad del modelo.

## Base de conocimiento

src/knowledge-base.ts contiene principios originales sobre aprendizaje, planificación, tutoría, evaluación, ciencias, lenguas, fiabilidad, privacidad y accesibilidad. La recuperación se pondera por título, keywords, contenido y grupos de sinónimos; se inyecta como orientación al tutor, no como entrenamiento.

## Funciones

Biblioteca CRUD, notas, enlaces, tarjetas de repaso, temporizador, historial, meta diaria, progreso y respaldo JSON.

## Almacenamiento portable

La shell Rust expone load_portable_data, save_portable_data y portable_data_path. El archivo se crea junto a la aplicación; mantén Studium-data.json con ella. localStorage migra como respaldo en escritorio y sigue siendo el almacenamiento del navegador.

## Windows sin consola

src-tauri/src/main.rs establece el subsistema Windows GUI. src-tauri/build.rs también fija /SUBSYSTEM:WINDOWS para el binario. CI inspecciona el PE del debug, release y asset final: arquitectura x64/ARM64 y subsistema GUI 2. Los paquetes son EXE directos, no scripts o instaladores que abran consola.

## Distribución

Una release estable v0.1.1 con Windows x64/ARM64 EXE, Linux x64/ARM64 AppImage y macOS Intel/Apple Silicon ZIP con app. CI verifica assets, formatos y SHA-256 antes de retirar releases/tags antiguos.

## Limitaciones

No hay OCR, modelo IA incluido, entrenamiento de pesos, exámenes adaptativos con evaluación estructurada, audio, anotación con lápiz, sincronización ni cuentas. Verifica el plan y fragmentos generados antes de estudiar.
