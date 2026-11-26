# Studium

Studium es una aplicación de escritorio local-first para organizar el aprendizaje. Sin cuentas ni sincronización obligatoria; los paquetes portables conservan sus datos junto a la aplicación.

## Crear una guía desde un archivo

- Importa PDF, EPUB, DOCX, TXT y Markdown; la extracción se realiza en el dispositivo.
- Genera un resumen diverso, esquema, conceptos clave, preguntas y tarjetas vinculadas a fragmentos del archivo.
- El plan local organiza entre 2 y 5 sesiones según extensión/estructura, con objetivos observables, bloques de tiempo, recuperación activa, práctica, checkpoints, registro de errores y repasos espaciados.
- Utiliza un corpus pedagógico local para orientar el plan. No es IA y no modifica pesos de modelos; el tutor IA todavía no está conectado a la interfaz.
- Los PDF escaneados requieren OCR, aún no incluido. Revisa los fragmentos y el plan: las heurísticas pueden omitir o interpretar mal texto extraído.

## Funciones

- Biblioteca: crear, editar, eliminar, buscar y filtrar materiales por materia.
- Notas y enlaces.
- Tarjetas pregunta/respuesta y repaso por intervalos básicos.
- Temporizador de enfoque, pausa, reinicio y registro.
- Progreso y meta diaria.
- Respaldo JSON exportar/importar y borrar datos locales.

## Descargas portables

Una única release oficial:

| Sistema | Arquitectura | Formato |
|---|---|---|
| Windows | x64 | EXE directo |
| Windows | ARM64 | EXE directo |
| Linux | x64 | AppImage |
| Linux | ARM64 | AppImage |
| macOS | Intel x64 | ZIP con app |
| macOS | Apple Silicon ARM64 | ZIP con app |

[Descargar Studium](https://github.com/IsHyperactive/Studium/releases)

Windows necesita WebView2 Runtime. Los EXE no están firmados si no se configura el certificado de Authenticode en GitHub Secrets. Linux puede requerir FUSE 2. macOS no está firmado ni notarizado.

## Datos y portabilidad

En escritorio se guarda Studium-data.json junto al ejecutable o bundle. Mantén el archivo de datos con la app al moverla. La versión web de desarrollo usa localStorage.

## CI y desarrollo

Actions verifica TypeScript, pruebas del plan local y frontend. La release incluye notas, commit, workflow y SHA-256.

Requisitos: Node, npm, Rust y prerrequisitos Tauri.

Comandos: npm install · npm run typecheck · npm run test · npm run build · npm run tauri dev.

Consulta AGENTS.md y documentacion/arquitectura.md.

MIT.
