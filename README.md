# Studium

Studium es una aplicación local-first para organizar materiales, aprender con tarjetas de memoria y mantener hábitos de estudio. El MVP funcional no requiere cuenta ni conexión para sus funciones principales.

## Funciones implementadas
- **Biblioteca:** crear, editar, eliminar y buscar recursos; filtrar por materia; guardar apuntes, libros, enlaces y recursos.
- **Notas:** editor de texto simple, títulos y materias.
- **Repaso:** tarjetas pregunta/respuesta con calificación y programación básica de intervalos.
- **Sesiones:** temporizador de 15, 25, 45 y 60 minutos, pausa, reinicio, registro manual y al terminar.
- **Progreso:** minutos de hoy, objetivo diario, materiales, tarjetas pendientes y materias.
- **Respaldo:** exportar/importar JSON y borrar datos locales.

Los datos se guardan en localStorage del WebView/dispositivo. No hay sincronización, cuentas, importación real de PDF/EPUB, OCR, exámenes, IA, audio ni anotaciones con lápiz todavía.

## Plataformas objetivo
Windows x86/x64/ARM64 (instalador y ZIP); Linux x64/ARM64 (AppImage, DEB y TAR.GZ); macOS Intel/Apple Silicon (DMG/ZIP); Android ARM64/x86_64 (APK). La matriz de CI no garantiza que todos los formatos estén disponibles en la publicación actual. Paquetes pueden carecer de firma/notarización.

## Descargas y CI
[Releases](https://github.com/IsHyperactive/Studium/releases) · [Actions](https://github.com/IsHyperactive/Studium/actions)

Los releases de desarrollo deben incluir inventario de archivos, requisitos, instrucciones, limitaciones, commit y hashes.

## Desarrollo
Requisitos: Node, npm, Rust y prerrequisitos Tauri.

```sh
npm install
npm run typecheck
npm run build
npm run tauri dev
```

Build desktop: `npm run tauri build`. Para Android instala SDK/NDK/JDK e inicializa Tauri Android antes de compilar.

Consulta [arquitectura](documentacion/arquitectura.md), [AGENTS](AGENTS.md) y [contribución](CONTRIBUTING.md).

MIT. Ver [LICENSE](LICENSE).
