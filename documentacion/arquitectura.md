# Arquitectura inicial

## Estado

Esta arquitectura es una base mínima para habilitar compilación y validar el arranque multiplataforma. No representa todavía la arquitectura funcional del producto. La matriz de paquetes se está ampliando; solo los artefactos de un workflow exitoso deben considerarse disponibles.

## Stack inicial

- **Tauri 2 + Rust:** shell nativo y núcleo de aplicación.
- **Vite + TypeScript:** frontend web compilado y servido dentro de Tauri.
- **HTML/CSS:** interfaz de bienvenida de prueba, responsive y con preferencia de tema del sistema.
- **GitHub Actions:** CI y releases preliminares para desktop y Android.

## Plataformas y formatos objetivo

| Sistema | Arquitectura | Formatos |
|---|---|---|
| Windows | x86, x64, ARM64 | NSIS installer y ZIP portable |
| Linux | x64, ARM64 | AppImage, DEB, TAR.GZ |
| macOS | Intel x64, Apple Silicon ARM64 | DMG y ZIP de .app |
| Android | ARM64, x86_64 | APK |

Los paquetes no están firmados ni notarizados. La compatibilidad real se confirma por plataforma tras una compilación exitosa.

## Estructura actual

- `src/`: frontend.
- `src-tauri/src/`: código Rust.
- `src-tauri/tauri.conf.json`: configuración de Tauri.
- `.github/workflows/compilar.yml`: CI, matriz de compilación y publicación automática.

## Build local

Requisitos generales: Node.js, npm, Rust y las dependencias de plataforma indicadas en la [guía oficial de Tauri](https://v2.tauri.app/start/prerequisites/).

- Frontend: `npm install` y `npm run build`.
- Desktop: `npm run tauri build`.
- Android: configurar SDK/NDK/JDK, ejecutar `npm run tauri android init`, luego `npm run tauri android build -- --apk --target aarch64`.

## Publicaciones

Cuando todas las matrices concluyen correctamente en `main`, el workflow prepara un Release preliminar versionado por número de ejecución. Incluye:
- Archivos con nombres de sistema/arquitectura y formato.
- Notas automáticas: estado de desarrollo, formatos disponibles, compatibilidad y requisitos, instrucciones básicas, limitaciones, commit y link a la ejecución.
- `SHA256SUMS.txt` con hashes de archivos para comprobar integridad.

Los builds preliminares no son releases estables, no están firmados y pueden tener advertencias de seguridad al instalar.

## Decisiones pendientes

- Arquitectura funcional y modelo de datos del MVP.
- Persistencia y migraciones.
- Gestión de importación y formatos.
- Pruebas automatizadas.
- Identidad visual definitiva e iconos de instalador.
- Firma, notarización y canales de distribución estables.
