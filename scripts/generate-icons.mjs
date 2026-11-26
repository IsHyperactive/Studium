import { readFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const svg = await readFile("recursos/icono.svg");
await mkdir(".tmp", { recursive: true });
await mkdir("src-tauri/icons", { recursive: true });
const source = ".tmp/studium-icon.png";
await sharp(svg).resize(1024, 1024).png().toFile(source);
// AppImage bundler requires a square PNG icon available at the configured path.
await sharp(svg).resize(512, 512, { fit: "contain" }).png().toFile("src-tauri/icons/icon.png");
const cli = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(cli, ["tauri", "icon", source, "--output", "src-tauri/icons"], { stdio: "inherit", shell: process.platform === "win32" });
if (result.status !== 0) process.exit(result.status ?? 1);
