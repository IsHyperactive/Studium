# Arquitectura inicial

## Estado

Esta arquitectura es una base mínima para habilitar compilación y validar el arranque multiplataforma. No representa todavía la arquitectura funcional del producto.

## Stack inicial

- **Tauri 2 + Rust:** shell nativo y núcleo de aplicación.
- **Vite + TypeScript:** frontend web compilado y servido dentro de Tauri.
- **HTML/CSS:** interfaz de bienvenida de prueba, responsive y con preferencia de tema del sistema.
- **GitHub Actions:** compilación Windows x64, Windows ARM64 y Android ARM64.

## Estructura actual

- `src/`: frontend.
- `src-tauri/src/`: código Rust.
- `src-tauri/tauri.conf.json`: configuración de Tauri.
- `.github/workflows/compilar.yml`: CI.

## Build local

Requisitos generales: Node.js, npm, Rust y las dependencias de plataforma indicadas en la [guía oficial de Tauri](https://v2.tauri.app/start/prerequisites/).

- Frontend: `npm install` y `npm run build`.
- Desktop: `npm run tauri build`.
- Android: configurar SDK/NDK/JDK, ejecutar `npm run tauri android init`, luego `npm run tauri android build -- --apk --target aarch64`.

## CI

El workflow compila y publica artefactos temporales (14 días) para revisión. No crea releases, no firma binarios y no despliega automáticamente.

Los lockfiles se generan durante el trabajo de CI y se publican como artefactos para poder revisarlos. Deben incorporarse al repositorio una vez validados.

## Decisiones pendientes

- Arquitectura funcional y modelo de datos del MVP.
- Persistencia y migraciones.
- Gestión de importación y formatos.
- Pruebas automatizadas.
- Identidad visual definitiva e iconos de instalador.
- Firma y distribución.
