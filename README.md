# Studium

Studium es una aplicación de escritorio local-first para organizar el aprendizaje. Sin cuentas ni sincronización obligatoria; los paquetes portables conservan sus datos junto a la aplicación.

## Crear un curso desde un libro o documento

- Importa PDF, EPUB, DOCX, TXT y Markdown. La extracción se realiza en el dispositivo y conserva encabezados, apartados y separación de párrafos cuando el formato lo permite.
- Genera resumen, índice, conceptos clave, preguntas y tarjetas ancladas al material.
- **Curso IA por etapas:** primero construye un mapa del libro (secciones, orden, objetivos, prerequisitos y conexiones), después desarrolla las lecciones de cada segmento por separado, en vez de resumir unas pocas muestras del documento.
- Elige profundidad estándar, profunda o muy profunda. La segmentación puede crear hasta 48 unidades; cada lección incluye objetivo medible, prerequisitos, ideas clave, explicación paso a paso, ejemplo respaldado o claramente hipotético, actividades variadas, preguntas progresivas con respuestas, evidencia literal y checkpoints.
- La generación valida las citas contra el texto extraído. Si una lección IA falla, Studium conserva un respaldo heurístico claramente identificado y muestra advertencias de cobertura. La IA puede equivocarse y no se garantiza que cubra cada detalle del libro.
- El plan local sin modelo sigue disponible, es heurístico y menos profundo. Los PDF escaneados requieren OCR, aún no incluido.

## Tutor IA

- Chat configurable con Ollama local, OpenAI o cualquier endpoint compatible con Chat Completions.
- Recuperación contextual por secciones de tus materiales: el tutor busca pasajes relacionados y muestra las fuentes recuperadas.
- Enseñanza progresiva, práctica, diagnóstico de errores, quizzes, pistas y conexiones entre conceptos.
- Para libros y tutoría compleja, recomendamos un modelo de **7B parámetros o superior** y contexto amplio; modelos pequeños suelen simplificar. La capacidad depende del modelo conectado y del equipo/proveedor.
- Studium no incluye ni entrena un modelo propio. Los modelos locales deben instalarse; los proveedores remotos reciben el contexto seleccionado. La clave se guarda localmente y no se exporta en el backup.

## Funciones

- Biblioteca: crear, editar, eliminar, buscar y filtrar materiales por materia.
- Notas y enlaces.
- Tarjetas pregunta/respuesta y repaso por intervalos básicos.
- Temporizador de enfoque, pausa, reinicio y registro.
- Progreso y meta diaria.
- Respaldo JSON exportar/importar y borrar datos locales.

## Descargas portables

La última release estable publicada se encuentra aquí:

[Descargar Studium](https://github.com/IsHyperactive/Studium/releases)

| Sistema | Arquitectura | Formato |
|---|---|---|
| Windows | x64 | EXE directo |
| Windows | ARM64 | EXE directo |
| Linux | x64 | AppImage |
| Linux | ARM64 | AppImage |
| macOS | Intel x64 | ZIP con app |
| macOS | Apple Silicon ARM64 | ZIP con app |

Windows necesita WebView2 Runtime. Los EXE no están firmados si no se configura el certificado de Authenticode en GitHub Secrets. Linux puede requerir FUSE 2. macOS no está firmado ni notarizado.

## Datos y portabilidad

En escritorio se guarda Studium-data.json junto al ejecutable o bundle. Mantén el archivo de datos con la app al moverla. La versión web de desarrollo usa localStorage.

## CI y desarrollo

Actions verifica TypeScript, pruebas y frontend. La publicación portable se ejecuta manualmente para evitar reemplazar la release estable en cada push de desarrollo.

Requisitos: Node, npm, Rust y prerrequisitos Tauri.

Comandos: npm install · npm run typecheck · npm run test · npm run build · npm run tauri dev.

Consulta AGENTS.md y documentacion/arquitectura.md.

MIT.
