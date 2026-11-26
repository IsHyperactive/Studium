# <img src="recursos/icono.svg" width="56" align="left" alt="Icono de Studium" /> Studium

<p align="center"><img src="recursos/icono.svg" width="160" alt="Studium: libro abierto con una chispa" /></p>

<p align="center"><strong>Tu espacio portable para organizar el aprendizaje.</strong><br/>Biblioteca · Notas · Tarjetas · Sesiones de enfoque · Seguimiento</p>

Studium es un espacio local-first para organizar el aprendizaje. Sin cuentas, sin sincronización obligatoria y con una distribución **portable**: extrae/abre el paquete y conserva el archivo de datos junto a la aplicación.

## Profesor IA y aprendizaje
- Tutor conversacional que enseña con explicación por niveles, ejemplos, práctica guiada y preguntas de recuperación.
- Contexto local: recupera fragmentos de materiales de la Biblioteca y muestra los títulos usados como fuentes.
- Generación de guías desde PDF, EPUB, DOCX, TXT y Markdown: resumen, esquema, conceptos, preguntas, plan por sesiones y tarjetas.
- Base pedagógica interna (protocolos de enseñanza) que orienta al modelo; **no es entrenamiento ni fine-tuning de un modelo**.
- Conecta un proveedor compatible con la API Chat Completions: Ollama local o API remota compatible. No se incluye modelo de IA dentro del instalador.
- La URL, modelo y temperatura se guardan localmente; la clave API solo se conserva en memoria durante la sesión.
- Al usar IA, el texto de tus materiales se envía al proveedor configurado. Si quieres privacidad local, utiliza un modelo local en Ollama.
- Si la IA falla, la guía usa heurísticas locales como respaldo; se indica qué modo la generó.
- Los PDF escaneados requieren OCR; todavía no está incluido.

## Funciones disponibles
- Biblioteca: crear, editar, eliminar y buscar materiales; filtrar por materia; guardar apuntes, libros, enlaces y recursos.
- Notas: editor de texto sencillo.
- Repaso: tarjetas pregunta/respuesta con intervalos básicos.
- Sesiones: temporizador de 15, 25, 45 y 60 minutos, pausa, reinicio, registro manual y registro al terminar.
- Progreso: minutos diarios, objetivo, materiales, tarjetas pendientes y materias.
- Respaldo: exportar/importar JSON y borrar los datos locales.

**Limitaciones:** no hay fine-tuning, OCR, sistema de exámenes adaptativos, audio, anotaciones con lápiz, sincronización ni cuentas. El tutor requiere un proveedor/modelo configurado y su calidad depende del modelo; funciones en desarrollo requieren pruebas de uso real.

## Distribución portable única
Cada compilación reemplaza la release anterior. No se publican instaladores, DEB, DMG, APK ni archivos duplicados.

| Plataforma | Arquitectura | Formato |
|---|---|---|
| Windows | x64 | ZIP portable |
| Windows | ARM64 | ZIP portable |
| Linux | x64 | AppImage |
| Linux | ARM64 | AppImage |
| macOS | Intel x64 | ZIP con .app |
| macOS | Apple Silicon ARM64 | ZIP con .app |

[**Descargar la única release portable**](https://github.com/IsHyperactive/Studium/releases)

## Datos y portabilidad
En la app de escritorio, Studium crea `Studium-data.json` en la carpeta portable junto al ejecutable (en macOS, junto al `.app`). Mantén ese archivo con la app al moverla. También puedes exportar un respaldo desde Ajustes.

- Windows: necesita WebView2 Runtime. La firma Authenticode se activa si se configuran `WINDOWS_SIGNING_CERT_BASE64` y `WINDOWS_SIGNING_CERT_PASSWORD` en GitHub Secrets. Sin certificado, el ejecutable sigue sin firma y SmartScreen puede mostrar avisos; una firma válida tampoco garantiza eliminar advertencias de reputación.
- Linux AppImage: puede requerir FUSE 2.
- macOS: paquete sin firma/notarización; Gatekeeper puede mostrar una advertencia.
- La carpeta debe permitir escritura. No ejecutes la portable desde una carpeta de solo lectura.

La versión web de desarrollo usa el almacenamiento local del navegador.

## CI y releases
[Releases](https://github.com/IsHyperactive/Studium/releases) · [Actions](https://github.com/IsHyperactive/Studium/actions)

Las compilaciones verifican TypeScript y el frontend antes de empaquetar. La publicación contiene inventario, notas, commit, enlace de workflow y SHA-256.

## Desarrollo
Requisitos: Node, npm, Rust y prerrequisitos Tauri.

```sh
npm install
npm run typecheck
npm run build
npm run tauri dev
```

Consulta [arquitectura](documentacion/arquitectura.md), [AGENTS](AGENTS.md) y [contribución](CONTRIBUTING.md).

MIT. Ver [LICENSE](LICENSE).
