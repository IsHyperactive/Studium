# Plan de evolución de Studium

Este plan prioriza una app de aprendizaje funcional sobre una lista de funciones llamativas. Todo debe pasar por compilación, pruebas y revisión de accesibilidad antes de integrarse.

## Fase 0 — Estabilización (en curso)
- [x] Separar el trabajo del lanzamiento estable mediante una rama de desarrollo.
- [x] Validación de TypeScript y build frontend en Actions.
- [x] Rediseño visual inicial responsive.
- [x] Núcleo del tutor y protocolos pedagógicos internos.
- [x] Conexión con proveedor compatible, timeout y manejo de errores.
- [x] Contexto recuperado de materiales locales y nombres de fuentes.
- [x] Generador de guías con validación de salida y modo local de respaldo.
- [ ] Pruebas manuales de los flujos completos y revisión de UI en Windows, Linux y Surface.
- [x] Corregir los errores detectados por CI y dejar typecheck, pruebas y build web verdes en el último commit.

## Fase 1 — Profesor IA sólido
- [ ] Configuración de proveedores simplificada, instrucciones claras para Ollama y proveedores remotos.
- [x] Conversaciones separadas: crear, abrir, borrar y persistir historial.\n- [ ] Renombrar y exportar conversaciones individualmente.
- [ ] Mostrar fuentes con fragmentos consultados; abrir material original.
- [x] Recuperación léxica mejorada: normalización de acentos, señales por título/materia, fragmentos y límite de contexto.\n- [ ] Añadir filtros de materia y fuentes consultables.
- [ ] Modo tutor: pregunta primero, pista, segundo intento y explicación.
- [x] Quiz secuencial, evaluación, feedback y adaptación de dificultad dentro de la sesión.
- [x] Atajos de explicación, plan, recuperación activa, quiz y diagnóstico de lagunas.\n- [ ] Añadir acciones de resumen, tarjetas y aclarar errores.
- [x] Cancelar chat y conservar el mensaje de cancelación/error en el historial.
- [ ] Pruebas contra respuestas vacías, JSON inválido, timeout y API no disponible.

## Fase 2 — Motor de estudio
- [x] Objetivo y duración por sesión (15/25/30/45/60), sesiones progresivas y checkpoints; valida el plan IA y usa fallback local.
- [ ] Guía con progreso y tareas; completar, posponer o reprogramar.
- [ ] Tarjetas generadas con control de calidad y edición antes de guardar.
- [ ] Repaso espaciado ajustado por respuesta, no solo botones de intervalos fijos.
- [ ] Evaluación de dominio: recuerdo, explicación, aplicación y transferencia.
- [ ] Detección de lagunas y plan de refuerzo.
- [ ] Historial de aprendizaje con progreso útil, no métricas decorativas.

## Fase 3 — Experiencia e interfaz
- [ ] Revisión visual completa: jerarquía, navegación, biblioteca, lectura y estudio.
- [ ] Estados vacíos, loading, error, offline y éxito consistentes.
- [ ] Mejor lectura de documentos y selección de fragmentos.
- [ ] Atajos de teclado y accesibilidad; tamaños táctiles apropiados.
- [ ] Móvil, tablet 3:2 y escritorio ancho; test en Surface.
- [ ] Tema claro/oscuro y preferencias.

## Fase 4 — Calidad y distribución
- [x] Tests de unidad para ranking, normalización, parser/validación de guías, planificador local y quiz.
- [ ] Tests de unidad para programación de repaso y almacenamiento.
- [ ] Tests de integración de importación/exportación y almacenamiento portable.
- [ ] CI: typecheck, build, pruebas y empaquetado por arquitectura.
- [ ] Test manual de cada portable; revisar que no abra consola.
- [ ] Release notes, hashes y assets verificados. Nunca limpiar la release anterior antes de verificar la nueva.

## Principios
1. No simular capacidades ni prometer que una IA está entrenada.
2. El usuario controla el proveedor y sabe qué material sale de su dispositivo.
3. No perder materiales o chats por errores del modelo.
4. La IA apoya la enseñanza; el aprendizaje se verifica con práctica.
5. Cada cambio pequeño se valida antes de continuar.
