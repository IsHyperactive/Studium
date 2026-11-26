# Studium

<p align="center">
  <strong>Studium</strong><br>
  Una herramienta para organizar el aprendizaje y estudiar con intención.
</p>

> **Estado del proyecto:** esqueleto inicial en construcción. La primera pantalla es demostrativa; las funciones del MVP aún no están implementadas. Los paquetes multiplataforma se están validando en CI y las publicaciones automáticas son compilaciones preliminares.

## Objetivo

Studium está pensado como una aplicación de estudio con una experiencia adaptable a móvil, tablet y escritorio. La interfaz prioriza el uso táctil, controles cómodos, gestos y compatibilidad con lápiz cuando la plataforma lo permita.

## Plataformas y distribuciones previstas

| Plataforma / arquitectura | Formatos previstos |
|---|---|
| Windows x86 (32 bits) | Instalador NSIS y ZIP portable |
| Windows x64 | Instalador NSIS y ZIP portable |
| Windows ARM64 | Instalador NSIS y ZIP portable |
| Linux x64 | AppImage, DEB y TAR.GZ portable |
| Linux ARM64 | AppImage, DEB y TAR.GZ portable |
| macOS Intel x64 | DMG y ZIP de la app |
| macOS Apple Silicon ARM64 | DMG y ZIP de la app |
| Android ARM64 | APK |
| Android x86_64 (emuladores) | APK |

La matriz refleja objetivos de compilación; cada formato se considera disponible solo cuando aparece en una publicación exitosa. Los paquetes todavía no están firmados/notarizados.

## Releases y descargas

Cada compilación exitosa de `main` está configurada para publicar un Release preliminar de GitHub. Las publicaciones incluirán:
- Instaladores y archivos portables identificados por plataforma y arquitectura.
- Notas de publicación con estado, compatibilidad, instrucciones, limitaciones, commit y enlace al workflow.
- Archivo `SHA256SUMS.txt` para comprobar integridad.
- Versiones automáticas con identificador único de compilación; no sobrescriben releases anteriores.

[Releases y descargas](https://github.com/IsHyperactive/Studium/releases) · [Compilaciones CI](https://github.com/IsHyperactive/Studium/actions)

### Qué significa portable

- **Windows ZIP:** ejecutable empaquetado; requiere Windows y WebView2 Runtime. No es una versión que garantice guardar datos en la carpeta del ZIP.
- **Linux AppImage:** formato autocontenido pensado para ejecutar sin instalar. El TAR.GZ contiene el ejecutable y sigue requiriendo bibliotecas del sistema compatibles.
- **macOS ZIP:** contiene `Studium.app`; sin firma ni notarización en esta etapa.
- **Android:** APK instalable directamente; no es un paquete portable de escritorio.

## Plan de desarrollo

- **Fase 1 — MVP:** organización del material, planificación, lecciones, exámenes, repaso espaciado, progreso y respaldo/restauración.
- **Fase 2 — Voces y Profesor IA:** funciones asistidas que se definirán antes de implementarse.
- **Fase 3 — Escritura, pronunciación y sincronización:** herramientas adicionales y sincronización entre dispositivos.

Las fases representan objetivos, no funciones ya disponibles.

## MVP: seguimiento

La planificación inicial está abierta en GitHub Issues:

1. [Importar material](https://github.com/IsHyperactive/Studium/issues/1)
2. [Organizar material en colecciones](https://github.com/IsHyperactive/Studium/issues/2)
3. [Plan de aprendizaje](https://github.com/IsHyperactive/Studium/issues/3)
4. [Lecciones](https://github.com/IsHyperactive/Studium/issues/4)
5. [Exámenes y evaluación](https://github.com/IsHyperactive/Studium/issues/5)
6. [Repaso espaciado (FSRS)](https://github.com/IsHyperactive/Studium/issues/6)
7. [Seguimiento del progreso](https://github.com/IsHyperactive/Studium/issues/7)
8. [Respaldo e importación/exportación](https://github.com/IsHyperactive/Studium/issues/8)
9. [Tema claro y oscuro](https://github.com/IsHyperactive/Studium/issues/9)
10. [Diagnóstico de plataforma](https://github.com/IsHyperactive/Studium/issues/10)

## Desarrollo

Requisitos generales: Node.js, npm, Rust y las dependencias de plataforma indicadas en la [guía oficial de Tauri](https://v2.tauri.app/start/prerequisites/).

- Frontend: `npm install` y `npm run build`.
- Desktop: `npm run tauri build`.
- Android: configurar SDK/NDK/JDK, ejecutar `npm run tauri android init`, luego `npm run tauri android build -- --apk --target aarch64`.

Consulta [documentacion/arquitectura.md](documentacion/arquitectura.md) y [AGENTS.md](AGENTS.md).

## Contribuir

Consulta las plantillas de incidencias para reportar errores o proponer mejoras. Las contribuciones deben explicar el cambio, su alcance y cómo se verificó.

## Licencia

Este proyecto está publicado bajo la licencia MIT. Consulta [LICENSE](LICENSE).
