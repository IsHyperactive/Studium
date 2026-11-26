# <img src="recursos/icono.svg" width="56" align="left" alt="Icono de Studium" /> Studium

<p align="center"><img src="recursos/icono.svg" width="160" alt="Studium: libro abierto con una chispa" /></p>

<p align="center"><strong>Tu espacio portable para organizar el aprendizaje.</strong><br/>Biblioteca · Notas · Tarjetas · Sesiones de enfoque · Seguimiento</p>

Studium es un espacio local-first para organizar el aprendizaje. Sin cuentas, sin sincronización obligatoria y con una distribución **portable**: extrae/abre el paquete y conserva el archivo de datos junto a la aplicación.

## Función principal: crear método desde un archivo
- Importa PDF, EPUB, DOCX, TXT y Markdown.
- Extrae texto localmente y genera un resumen, esquema, conceptos clave, preguntas de práctica y un plan de estudio.
- Crea tarjetas de recuerdo automáticamente y las añade a Repaso.
- Guarda la guía y el material importado en Biblioteca.
- Los PDF escaneados requieren OCR; todavía no está incluido.

## Funciones disponibles
- Biblioteca: crear, editar, eliminar y buscar materiales; filtrar por materia; guardar apuntes, libros, enlaces y recursos.
- Notas: editor de texto sencillo.
- Repaso: tarjetas pregunta/respuesta con intervalos básicos.
- Sesiones: temporizador de 15, 25, 45 y 60 minutos, pausa, reinicio, registro manual y registro al terminar.
- Progreso: minutos diarios, objetivo, materiales, tarjetas pendientes y materias.
- Respaldo: exportar/importar JSON y borrar los datos locales.

**Limitaciones:** el método se genera con heurísticas locales (no IA); no hay OCR para documentos escaneados, exámenes, audio, anotaciones con lápiz, sincronización ni cuentas. Es un MVP; algunas funciones necesitan pruebas en dispositivos reales.

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
