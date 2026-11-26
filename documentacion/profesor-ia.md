# Profesor IA de Studium

## Qué es

Studium no modifica los pesos de un modelo ni entrena un LLM desde cero. En su lugar, incorpora una **base pedagógica propia** como instrucciones y protocolos de tutoría, y conecta un modelo de lenguaje local o remoto. Esto permite orientar su conducta específicamente a aprender.

## Conocimiento pedagógico integrado

- Diagnóstico del objetivo, nivel y prerequisitos.
- Explicación por capas: intuición, precisión, ejemplo resuelto y práctica.
- Segmentación y reducción de carga cognitiva.
- Recuperación activa, elaboración, intercalado y repaso espaciado.
- Feedback correctivo, pistas progresivas y transferencia.
- Planes con metas observables, sesiones, ejercicios, checkpoints y autoevaluación.
- Práctica de idiomas contextualizada y corrección selectiva.

## Contexto de tus materiales (RAG local)

Studium busca coincidencias en títulos, materias y texto de tu biblioteca; puntúa materiales y selecciona fragmentos relevantes para incluirlos en el prompt. El chat y las guías guardan títulos de materiales utilizados. Esta versión usa búsqueda léxica local, no embeddings/vector DB; puede recuperar fragmentos imperfectos y no inventa páginas/citas.

## Conectar un modelo local con Ollama

1. Instala Ollama y descarga un modelo compatible con la API OpenAI.
2. En equipos modestos, prueba un modelo pequeño como Qwen 2.5 3B: `ollama run qwen2.5:3b`
3. En Studium → Ajustes → Profesor IA:
   - Proveedor: Ollama
   - URL base: `http://localhost:11434/v1`
   - Modelo: `qwen2.5:3b`
4. Guarda y prueba. El modelo debe estar descargado y Ollama ejecutándose.
5. Si la conexión falla por CORS, ajusta los orígenes de Ollama para permitir el WebView de Studium. No habilites acceso abierto a la red sin entender el riesgo.

## Proveedor remoto

En Ajustes selecciona OpenAI o Compatible / otro. Introduce URL base del endpoint `/v1`, el nombre exacto del modelo y la API key. La clave no se guarda en el archivo de datos ni en localStorage: solo vive en memoria hasta cerrar la app. Las preguntas y fragmentos recuperados pueden enviarse al proveedor remoto; revisa sus políticas y no incluyas información sensible.

## Límites actuales

- No hay fine-tuning ni entrenamiento de pesos.
- La clave no se conserva al reiniciar.
- La búsqueda de biblioteca es lexical y no semántica.
- La IA requiere un proveedor/modelo accesible; no es una IA offline por sí misma. Con Ollama y un modelo descargado, la inferencia puede ser local.
- La extracción de PDF escaneados necesita OCR (no incluido).
- El modelo puede cometer errores; contrasta información importante.
