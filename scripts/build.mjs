import { cp, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const client = resolve(root, 'dist', 'client');
const server = resolve(root, 'dist', 'server');

await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });
await cp(resolve(root, 'public'), client, { recursive: true, force: true });

const worker = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/" || !url.pathname.split("/").pop().includes(".")) {
      url.pathname = "/index.html";
    }
    const response = await env.ASSETS.fetch(new Request(url, request));
    if (response.status !== 404) return response;
    url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url, request));
  }
};
`;

await writeFile(resolve(server, 'index.js'), worker);
