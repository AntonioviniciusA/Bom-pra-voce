import { readFile } from 'node:fs/promises';
const env = Object.fromEntries((await readFile(new URL('../.env.local', import.meta.url), 'utf8')).split(/\r?\n/).filter(line => /^[A-Z_]+=/.test(line)).map(line => { const i = line.indexOf('='); return [line.slice(0,i),line.slice(i+1).trim().replace(/^['"]|['"]$/g,'')]; }));
const base = env.VITE_SUPABASE_URL, key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!base?.startsWith('https://') || !key?.startsWith('sb_publishable_')) throw new Error('Public Supabase configuration is missing');
const checks = [
  ['promotion-admin', 'OPTIONS', 'null', 204],
  ['rh-applications', 'OPTIONS', 'http://127.0.0.1:5174', 204],
  ['promotion-admin', 'POST', 'null', 401],
  ['rh-applications', 'POST', 'null', 401],
  ['promotion-admin', 'OPTIONS', 'https://untrusted.example', 403],
  ['public-promotions?meta=1', 'GET', 'https://bom-pra-voce-vert.vercel.app', 200],
  ['application-init', 'POST', 'https://bom-pra-voce-vert.vercel.app', [400,503]],
];
const results = await Promise.all(checks.map(async ([name,method,origin,expected]) => {
  const response = await fetch(`${base}/functions/v1/${name}`, { method, headers: { apikey:key, Origin:origin, 'Content-Type':'application/json', ...(name === 'application-init' ? { 'Idempotency-Key':crypto.randomUUID() } : {}) }, ...(method === 'POST' ? { body:'{"action":"list"}' } : {}), signal:AbortSignal.timeout(20000) });
  const body = await response.text(); let code; try { code=JSON.parse(body).error; } catch {}
  return { function:name, method, origin, status:response.status, expected, allowOrigin:response.headers.get('access-control-allow-origin'), ...(code ? {code} : {}) };
}));
console.log(JSON.stringify({ at: new Date().toISOString(), checks:results },null,2));
if (results.some(result => !(Array.isArray(result.expected) ? result.expected : [result.expected]).includes(result.status) || (result.expected !== 403 && result.allowOrigin !== result.origin) || (result.function === 'application-init' && !['CHALLENGE_REQUIRED','APPLICATIONS_DISABLED'].includes(result.code)))) process.exitCode=1;
