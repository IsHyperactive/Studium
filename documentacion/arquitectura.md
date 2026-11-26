# Arquitectura de Studium

## Estado actual
El MVP ya no es solo una pantalla de muestra: incluye interfaz y flujos local-first. No existe backend ni sincronización.

## Stack
- Tauri 2 + Rust para el contenedor.
- Vite + TypeScript sin framework.
- CSS responsive y tema del sistema.
- localStorage, clave `studium-local-v1`, estructura JSON.

## Funciones
- Materiales CRUD, búsqueda, filtros por materia, apuntes/libros/enlaces/recursos.
- Tarjetas de repaso con intervalos básicos ajustados por respuesta.
- Sesiones de estudio, timer, pausa, reinicio, historial y registro manual.
- Dashboard y objetivo diario.
- Respaldo JSON importar/exportar y borrado de datos.

## Privacidad y persistencia
Los datos se guardan en el WebView local al dispositivo. No hay cuenta, sync o cifrado. El respaldo es JSON de texto, así que debe guardarse de forma privada. Los datos pueden perderse al borrar datos de la aplicación o desinstalar; exporta respaldo periódicamente.

## Archivos principales
- `src/main.ts`: lógica, vistas, formularios y acciones.
- `src/style.css`: estilos adaptables y modo oscuro.
- `src-tauri/src/`: shell Rust.
- `src-tauri/tauri.conf.json`: configuración.
- `.github/workflows/compilar.yml`: CI.

## Verificación local
```sh
npm install
npm run typecheck
npm run build
npm run tauri dev
```

Android necesita SDK, NDK y JDK. La inicialización Android se realiza con Tauri CLI en el entorno de compilación.

## Pendiente
Lectura/importación PDF y EPUB, exámenes, repetición espaciada más sólida y tests, persistencia robusta/migraciones, adjuntos, backup automático, sync opcional, accesibilidad, lápiz/gestos y pruebas en dispositivos reales.
