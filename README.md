# Studium

Studium es una aplicación de escritorio local-first para organizar el aprendizaje. Sin cuentas ni sincronización obligatoria; los paquetes portables conservan sus datos junto a la aplicación.

## Crear una guía desde un archivo

- Importa PDF, EPUB, DOCX, TXT y Markdown; la extracción se realiza en el dispositivo y conserva, cuando el formato lo permite, encabezados y separación de párrafos para contextualizar la guía.
- Genera un resumen diverso, esquema, conceptos clave, preguntas y tarjetas vinculadas a fragmentos del archivo.
- El plan local divide el material en 2–24 lecciones adaptativas (aprox. 350 palabras o una sección), conserva el orden del documento y cubre cada capítulo con preguntas específicas. Incluye objetivos, evidencia, recuperación activa, lectura selectiva, práctica, checkpoint y corrección. Es heurístico local, no IA. Cada sesión tiene objetivo contextual, evidencia, recuperación, práctica activa, checkpoint de 6 puntos y corrección; muestra alertas cuando faltan encabezados o conceptos. El dominio requiere 5/6 en dos intentos separados.
- Utiliza un corpus pedagógico local para orientar las actividades. No es IA ni comprensión humana: la segmentación y selección de preguntas son heurísticas. Studium aún no conecta un modelo generativo al creador de planes; no inventa contenido externo y muestra limitaciones de extracción.
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
