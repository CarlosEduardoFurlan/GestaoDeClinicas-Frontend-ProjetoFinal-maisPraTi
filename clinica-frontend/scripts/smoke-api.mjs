// Smoke HTTP isolado: não acessa o backend ou banco e não usa credenciais reais.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const requests = [];
let failNext = 0;
let delayNext = 0;
let items = [];
let nextId = 1;
const profiles = ['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL'];
const temporary = await mkdtemp(path.join(tmpdir(), 'praclinic-smoke-'));
const server = createServer(async (req, res) => {
  let text = '';
  for await (const chunk of req) text += chunk;
  const body = text ? JSON.parse(text) : undefined;
  const profile = req.headers.authorization?.replace('Bearer token-', '');
  requests.push({ method: req.method, url: req.url, body, authorization: req.headers.authorization });
  const reply = (status, value) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(value === undefined ? undefined : JSON.stringify(value));
  };
  const reject = (status) => reply(status, {
    timestamp: '2026-10-26T12:00:00', status, error: 'Smoke Error',
    message: `Erro HTTP ${status}`, path: req.url, details: ['name: exemplo de validação'],
  });
  if (delayNext) { const delay = delayNext; delayNext = 0; await new Promise((resolve) => setTimeout(resolve, delay)); }
  if (failNext) { const status = failNext; failNext = 0; reject(status); return; }
  if (req.url === '/api/auth/login') {
    if (body.password !== 'smoke-only' || !profiles.includes(body.email)) { reject(401); return; }
    reply(200, { accessToken: `token-${body.email}`, tokenType: 'Bearer', expiresIn: 900 });
    return;
  }
  if (!profiles.includes(profile)) { reject(401); return; }
  if (req.url === '/api/auth/me') {
    reply(200, { userId: `user-${profile}`, name: profile, email: `${profile}@example.test`, profile, professionalId: profile === 'PROFESSIONAL' ? 'own-professional' : null });
    return;
  }
  if (req.url?.startsWith('/api/specialties')) {
    if (req.method === 'GET') { reply(200, items); return; }
    if (profile !== 'ADMIN') { reject(403); return; }
    if (req.method === 'POST') {
      const item = { id: `00000000-0000-0000-0000-${String(nextId++).padStart(12, '0')}`, ...body, created: null };
      items.push(item); reply(201, item); return;
    }
    const id = req.url.split('/').at(-1);
    if (!items.some((item) => item.id === id)) { reject(404); return; }
    if (req.method === 'PUT') {
      items = items.map((item) => item.id === id ? { ...item, ...body } : item);
      reply(200, items.find((item) => item.id === id)); return;
    }
    if (req.method === 'DELETE') { items = items.filter((item) => item.id !== id); reply(204); return; }
  }
  reject(404);
});

try {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const baseURL = `http://127.0.0.1:${server.address().port}/api`;
  const bundle = path.join(temporary, 'client.mjs');
  await build({
    stdin: { contents: [
      "export { api } from './src/services/api';",
      "export { AuthService } from './src/services/auth.service';",
      "export { SpecialtyService } from './src/services/specialty.service';",
      "export { tokenStorage, onSessionInvalidated } from './src/lib/session';",
      "export { ApiError, normalizeApiError } from './src/lib/api-error';",
      "export { routeProfiles } from './src/config/permissions';",
    ].join('\n'), resolveDir: process.cwd() },
    bundle: true, platform: 'node', format: 'esm', outfile: bundle,
    // Node usa require em dependências CJS empacotadas.
    banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
    define: { 'import.meta.env.VITE_API_URL': JSON.stringify(baseURL) },
  });
  const storage = new Map();
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  };
  const { api, AuthService, SpecialtyService, tokenStorage, onSessionInvalidated, ApiError, routeProfiles } = await import(pathToFileURL(bundle).href);
  let invalidations = 0;
  const unsubscribe = onSessionInvalidated(() => invalidations++);

  tokenStorage.set('old-token');
  await assert.rejects(AuthService.login({ email: 'ADMIN', password: 'wrong' }), (error) => error instanceof ApiError && error.status === 401);
  assert.equal(tokenStorage.get(), 'old-token');
  assert.equal(invalidations, 0);
  assert.equal(requests.at(-1).authorization, undefined);
  console.log('PASS: credencial inválida não dispara logout global; login não envia Bearer antigo');

  for (const profile of profiles) {
    const login = await AuthService.login({ email: profile, password: 'smoke-only' });
    tokenStorage.set(login.accessToken);
    const me = await AuthService.me();
    assert.equal(me.profile, profile);
    assert.equal(me.professionalId, profile === 'PROFESSIONAL' ? 'own-professional' : null);
    assert.deepEqual(await SpecialtyService.getAll(), items);
    assert.equal((await AuthService.me()).userId, me.userId);
    assert.ok(routeProfiles['/specialties'].includes(profile));
    assert.equal(routeProfiles['/users'].includes(profile), profile === 'ADMIN');
    assert.equal(routeProfiles['/patients'].includes(profile), profile !== 'PROFESSIONAL');
    assert.equal(routeProfiles['/professionals'].includes(profile), profile !== 'PROFESSIONAL');
    assert.equal(routeProfiles['/medical-records'].includes(profile), profile !== 'RECEPTIONIST');
    if (profile !== 'ADMIN') {
      await assert.rejects(SpecialtyService.create({ name: 'Negada' }), (error) => error.status === 403);
      assert.equal(tokenStorage.get(), login.accessToken);
    }
  }
  console.log('PASS: login/me, nova consulta de sessão, leitura e matriz de perfis; 403 preserva token');

  tokenStorage.set('token-ADMIN');
  const created = await SpecialtyService.create({ name: 'Smoke', description: null });
  assert.equal(created.description, null);
  assert.equal(created.created, null);
  const updated = await SpecialtyService.update(created.id, { name: 'Atualizada', description: 'Descrição' });
  assert.equal(updated.name, 'Atualizada');
  for (const status of [400, 403, 404, 409]) {
    failNext = status;
    await assert.rejects(SpecialtyService.update(created.id, { name: 'Erro' }), (error) =>
      error instanceof ApiError && error.status === status && error.message === `Erro HTTP ${status}` && error.details[0].startsWith('name:'));
    assert.equal(tokenStorage.get(), 'token-ADMIN');
    assert.equal((await SpecialtyService.getAll())[0].name, 'Atualizada');
  }
  await SpecialtyService.delete(created.id);
  assert.deepEqual(await SpecialtyService.getAll(), []);
  console.log('PASS: CRUD, UUID da resposta, description/created nulos, erros 400/403/404/409 sem perda de dados');

  failNext = 401;
  await assert.rejects(AuthService.me(), (error) => error.status === 401);
  assert.equal(tokenStorage.get(), null);
  assert.equal(invalidations, 1);
  tokenStorage.set('invalid');
  await assert.rejects(AuthService.me(), (error) => error.status === 401);
  assert.equal(tokenStorage.get(), null);
  assert.equal(invalidations, 2);
  console.log('PASS: 401 de sessão e token inválido removem token e notificam o contexto');

  tokenStorage.set('token-ADMIN');
  delayNext = 80;
  failNext = 401;
  const oldRequest = AuthService.me().catch((error) => error);
  while (delayNext !== 0) await new Promise((resolve) => setTimeout(resolve, 1));
  tokenStorage.set('token-RECEPTIONIST');
  assert.equal((await oldRequest).status, 401);
  assert.equal(tokenStorage.get(), 'token-RECEPTIONIST');
  console.log('PASS: 401 tardio da sessão anterior preserva a sessão nova');

  const controller = new AbortController();
  controller.abort();
  await assert.rejects(SpecialtyService.getAll(controller.signal), (error) => error.code === 'ERR_CANCELED');
  tokenStorage.clear();
  assert.equal(tokenStorage.get(), null);
  unsubscribe();
  api.defaults.timeout = 10;
  tokenStorage.set('token-ADMIN');
  delayNext = 80;
  await assert.rejects(AuthService.me(), (error) => error.status === 0 && error.message.includes('demorou'));
  assert.equal(tokenStorage.get(), 'token-ADMIN');
  console.log('PASS: cancelamento, limpeza de token e timeout sem logout');
  await new Promise((resolve) => server.close(resolve));
  await assert.rejects(AuthService.me(), (error) => error.status === 0 && error.message.includes('conectar'));
  console.log('PASS: erro de rede possui mensagem própria');
  console.log('Smoke concluído. Valida cliente/services por HTTP isolado; não substitui teste de UI/backend real.');
} finally {
  server.closeAllConnections();
  server.close();
  const resolved = path.resolve(temporary);
  assert.equal(path.dirname(resolved), path.resolve(tmpdir()));
  assert.ok(path.basename(resolved).startsWith('praclinic-smoke-'));
  await rm(resolved, { recursive: true, force: true });
}
