// Only public build configuration is checked here. Never print credentials.
const value = process.env.VITE_API_URL?.trim();
let url;
try { url = new URL(value); } catch { throw new Error('Defina a variável VITE_API_URL do ambiente github-pages com a API HTTPS real.'); }
const host = url.hostname.toLowerCase();
if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash ||
    host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.invalid') ||
    ['example.com', 'example.org', 'example.net'].some(domain => host === domain || host.endsWith('.' + domain)) ||
    host === '[::1]' || host === '0.0.0.0' || host.startsWith('127.')) {
  throw new Error('VITE_API_URL deve apontar para a API HTTPS real, sem credenciais ou endereço local/de exemplo.');
}
console.log('Configuração pública de API validada; confirme disponibilidade e CORS no ambiente de entrega.');
