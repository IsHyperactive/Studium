# Studium 0.2 — rediseño y aprendizaje adaptativo

## Dirección de producto

Studium debe sentirse como un espacio de aprendizaje personal, no como una plantilla fija. Mantener la app local-first, portable, multiplataforma, sin cuentas obligatorias y usable con teclado, pantalla táctil y lápiz.

## Entregas

### 1. Personalización de interfaz (inicio)
- Tema del sistema, claro u oscuro.
- Cuatro colores de acento.
- Escala tipográfica pequeña/normal/grande.
- Densidad cómoda/compacta.
- Guardado local independiente del respaldo académico.
- Revisar contraste, focus visible y responsive.

### 2. Rediseño integral (siguiente)
- Navegación adaptable: barra lateral escritorio, navegación compacta/táctil en tamaños pequeños.
- Dashboard configurable por bloques (progreso, continuar, tareas, repasos, calendario, materias).
- Biblioteca con vista lista/cuadrícula, etiquetas, filtros, ordenar, colecciones y favoritos.
- Espacio de estudio por materia con objetivos, materiales, notas, tareas y calendario.
- Personalización de distribución y ocultar/reordenar widgets.
- Accesibilidad: escala, contraste, reducir animación, teclado y lápiz.

### 3. Funciones de estudio
- Planificador semanal con sesiones movibles, prioridades, fecha objetivo y estimación de carga.
- Exámenes/simulacros por tipo (recuerdo, aplicación, explicación, opción múltiple) y corrección explicada.
- Tarjetas de repetición espaciada con algoritmo mejorado, historial y control de confianza.
- Notas conectadas a materiales, etiquetas y búsqueda global.
- Modo lectura con resaltado, anotaciones y extractos con localizador cuando exista.
- Registro de hábitos y progreso por competencia, no solo minutos.
- Importación de PDF, EPUB, DOCX, TXT, Markdown; OCR local como módulo opcional.

### 4. Tutor IA: primero una conexión real, luego mejora
- Chat integrado con proveedores compatibles OpenAI API, Ollama y endpoint configurable; controles de conexión y errores.
- Tutor con modos: explicar, tutor socrático, practicar idioma, generar examen, resumir y planificar.
- RAG local: buscar fragmentos en biblioteca y citas/localizadores reales; nunca inventar páginas.
- Memoria de aprendizaje local editable: metas, preferencias pedagógicas, conceptos débiles, errores recientes, dominio y calendario; excluir datos sensibles y permitir borrar.
- Contexto de la IA ajustado con resultados del usuario y preferencias, con consentimiento/controles transparentes.
- Corpus pedagógico versionado, ampliado y probado; rúbricas y ejemplos de respuesta, misconceptions, preguntas de calidad y reglas de seguridad.
- Evaluación con conjuntos de pruebas (fidelidad a fuente, exactitud, nivel, calidad de preguntas, planificación, feedback, idioma y rechazo de afirmaciones no sustentadas).

## Qué significa “entrenar”
No se puede entrenar un modelo base comparable a ChatGPT desde esta aplicación sin modelos, datos, cómputo y un proceso de entrenamiento especializados. No fingir que se cambian pesos. Studium mejorará la tutoría mediante:
1. Base de conocimiento curada y local.
2. Recuperación de fuentes del usuario.
3. Memoria de progreso y preferencias revisable.
4. Prompts/plantillas pedagógicas especializados.
5. Evaluación automatizada y corrección de fallos.
6. Opcionalmente, modelos locales compatibles instalados por el usuario; no descargar modelos enormes ni usar servicios externos sin aviso.

## Criterios de calidad
- Cada función tiene tests y estados vacíos/error/cargando.
- Typecheck, tests y build frontend deben pasar antes de publicar.
- Probar portable data, import/export y migraciones.
- No publicar una release hasta verificar assets, arquitectura y ejecución GUI.
- No vender IA o OCR como disponibles hasta estar conectados y probados.

## Prioridad inmediata
Personalización básica implementada en esta rama de trabajo: tema, color de acento, escala tipográfica y densidad. Validar compilación y ajustar los defectos encontrados antes de ampliar.
