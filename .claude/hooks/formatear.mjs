// Hook PostToolUse: aplica Prettier al archivo que el agente acaba de editar o crear.
// Recibe por stdin el JSON del evento de Claude Code y lee tool_input.file_path.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';

const EXTENSIONES = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.html', '.css', '.yml', '.yaml']);

let entrada = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (trozo) => (entrada += trozo));
process.stdin.on('end', () => {
  let ruta;
  try {
    ruta = JSON.parse(entrada)?.tool_input?.file_path;
  } catch {
    process.exit(0);
  }
  if (typeof ruta !== 'string' || !existsSync(ruta)) process.exit(0);
  // Nunca tocar archivos de claves.
  if (basename(ruta).startsWith('.env')) process.exit(0);
  if (!EXTENSIONES.has(extname(ruta).toLowerCase())) process.exit(0);

  const raiz = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  if (relative(raiz, ruta).startsWith('..')) process.exit(0);

  const prettier = join(raiz, 'node_modules', 'prettier', 'bin', 'prettier.cjs');
  if (!existsSync(prettier)) process.exit(0);

  const r = spawnSync(process.execPath, [prettier, '--write', '--ignore-unknown', ruta], { cwd: raiz, encoding: 'utf8' });
  if (r.status !== 0) {
    process.stderr.write(`Prettier no pudo formatear ${ruta}:\n${r.stderr}`);
    process.exit(2);
  }
});
