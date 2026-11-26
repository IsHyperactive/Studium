import { readFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const svg = await readFile("recursos/icono.svg");
await mkdir(".tmp", { recursive: true });
const source = ".tmp/studium-icon.png";
await sharp(svg).resize(1024, 1024).png().toFile(source);
const cli = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(cli, ["tauri", "icon", source, "--output", "src-tauri/icons"], { stdio: "inherit", shell: process.platform === "win32" });
if (result.status !== 0) process.exit(result.status ?? 1);
