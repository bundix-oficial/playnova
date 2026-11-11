import '../js/account-rules.js';

const rules = globalThis.FrivAccountRules;
const encoder = new TextEncoder();
const sessionDays = 30;
const cookieName = 'friv_session_v2';
const hex = bytes => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
const random = () => hex(crypto.getRandomValues(new Uint8Array(32)));
const digest = async value => hex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: 100000 }, key, 256));
}
function equal(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), { status, headers: {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', ...extra
  } });
}
function cookie(request, value, maxAge = sessionDays * 86400) {
  return `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}
function tokenFrom(request) {
  return (request.headers.get('Cookie') || '').split(';').map(v => v.trim()).find(v => v.startsWith(cookieName + '='))?.slice(cookieName.length + 1) || '';
}
async function userFrom(request, db) {
  const token = tokenFrom(request);
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  return db.prepare(`SELECT u.id,u.nick,u.avatar_data AS avatarData FROM playnova_sessions_v2 s
    JOIN playnova_users_v2 u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?`).bind(await digest(token), Date.now()).first();
}
async function openSession(request, db, user) {
  const token = random();
  await db.prepare('INSERT INTO playnova_sessions_v2 (token_hash,user_id,expires_at) VALUES (?,?,?)')
    .bind(await digest(token), user.id, Date.now() + sessionDays * 86400000).run();
  return json({ success: true, user, scope: 'global' }, 200, { 'Set-Cookie': cookie(request, token) });
}
async function rateLimit(request, db, identity, limit) {
  const window = Math.floor(Date.now() / 300000);
  const key = await digest((request.headers.get('CF-Connecting-IP') || 'local') + ':' + identity + ':' + window);
  await db.prepare(`INSERT INTO playnova_auth_limits_v2 (bucket,attempts,expires_at) VALUES (?,1,?)
    ON CONFLICT(bucket) DO UPDATE SET attempts=attempts+1`).bind(key, Date.now() + 600000).run();
  const row = await db.prepare('SELECT attempts FROM playnova_auth_limits_v2 WHERE bucket=?').bind(key).first();
  await db.prepare('DELETE FROM playnova_auth_limits_v2 WHERE expires_at<?').bind(Date.now()).run();
  return row.attempts <= limit;
}
async function api(request, env) {
  const url = new URL(request.url), path = url.pathname.replace(/\/$/, '');
  if (!path.startsWith('/api/')) return env.ASSETS ? env.ASSETS.fetch(request) : json({ error: 'Não encontrado.' }, 404);
  if (!env.DB) return json({ ready: false, error: 'O placar online precisa do banco D1 configurado.' }, 503);
  if (path === '/api/status' && request.method === 'GET') {
    try { await env.DB.prepare('SELECT id FROM playnova_users_v2 LIMIT 1').first(); }
    catch { return json({ ready: false, error: 'As tabelas do placar ainda não foram preparadas.' }, 503); }
    return json({ ready: true, version: 2, scope: 'global' });
  }
  if (request.method !== 'GET' && request.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);
  const origin = request.headers.get('Origin');
  if (request.method === 'POST' && ((origin && origin !== url.origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site')) return json({ error: 'Origem não permitida.' }, 403);
  let body = {};
  if (request.method === 'POST') {
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ error: 'Envie JSON.' }, 415);
    if (Number(request.headers.get('Content-Length') || 0) > 70000) return json({ error: 'Pedido muito grande.' }, 413);
    const text = await request.text();
    if (text.length > 70000) return json({ error: 'Pedido muito grande.' }, 413);
    try { body = JSON.parse(text); } catch { return json({ error: 'JSON inválido.' }, 400); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Pedido inválido.' }, 400);
  }
  const db = env.DB;
  if (['/api/auth/register', '/api/auth/login'].includes(path) && request.method === 'POST') {
    const nick = rules.nickname(body.nick);
    const registering = path.endsWith('/register');
    if (!(await rateLimit(request, db, registering ? 'register' : 'login:' + (nick.key || ''), registering ? 60 : 20))) return json({ error: 'Muitas tentativas. Aguarde alguns minutos.' }, 429);
    if (!nick.ok) return json({ error: nick.message }, 400);
    if (typeof body.password !== 'string' || body.password.length < 8 || body.password.length > 128) return json({ error: 'Use uma senha de 8 a 128 caracteres.' }, 400);
    if (path.endsWith('/register')) {
      if (await db.prepare('SELECT id FROM playnova_users_v2 WHERE nick_key=?').bind(nick.key).first()) return json({ error: 'Este nome já está em uso.' }, 409);
      const user = { id: crypto.randomUUID(), nick: nick.nick, avatarData: rules.avatar(body.avatarData) };
      const salt = random();
      try {
        await db.prepare('INSERT INTO playnova_users_v2 (id,nick,nick_key,password_hash,salt,avatar_data,created_at) VALUES (?,?,?,?,?,?,?)')
          .bind(user.id, user.nick, nick.key, await passwordHash(body.password, salt), salt, user.avatarData, Date.now()).run();
      } catch (error) {
        if (/unique/i.test(String(error))) return json({ error: 'Este nome já está em uso.' }, 409);
        throw error;
      }
      return openSession(request, db, user);
    }
    const user = await db.prepare('SELECT id,nick,password_hash,salt,avatar_data AS avatarData FROM playnova_users_v2 WHERE nick_key=?').bind(nick.key).first();
    // Equal cost for missing users avoids a cheap account enumeration timing test.
    const hash = await passwordHash(body.password, user?.salt || 'missing-account-salt');
    if (!user || !equal(hash, user.password_hash)) return json({ error: 'Nome ou senha incorretos.' }, 401);
    return openSession(request, db, { id: user.id, nick: user.nick, avatarData: user.avatarData });
  }
  if (path === '/api/scores/leaderboard' && request.method === 'GET') {
    const weekStart = rules.weekStart();
    const result = await db.prepare(`SELECT s.user_id AS userId,u.nick,u.avatar_data AS avatarData,s.score,s.submitted_at AS timestamp
      FROM playnova_scores_v2 s JOIN playnova_users_v2 u ON u.id=s.user_id
      WHERE s.week_start=? ORDER BY s.score DESC,s.submitted_at ASC,s.user_id ASC LIMIT 10`).bind(weekStart).all();
    return json({ scope: 'global', weekStart, leaderboard: result.results || [] });
  }
  const user = await userFrom(request, db);
  if (!user) return json({ error: 'Entre novamente na sua conta.' }, 401);
  if (path === '/api/auth/me' && request.method === 'GET') return json({ user, scope: 'global' });
  if (path === '/api/auth/logout' && request.method === 'POST') {
    await db.prepare('DELETE FROM playnova_sessions_v2 WHERE token_hash=?').bind(await digest(tokenFrom(request))).run();
    return json({ success: true }, 200, { 'Set-Cookie': cookie(request, '', 0) });
  }
  if (path === '/api/auth/avatar' && request.method === 'POST') {
    const avatar = rules.avatar(body.avatarData);
    if (!avatar) return json({ error: 'Imagem inválida.' }, 400);
    await db.prepare('UPDATE playnova_users_v2 SET avatar_data=? WHERE id=?').bind(avatar, user.id).run();
    return json({ success: true, avatarData: avatar });
  }
  if (path === '/api/scores/run' && request.method === 'POST') {
    const now = Date.now();
    const recent = await db.prepare('SELECT COUNT(*) AS count FROM playnova_runs_v2 WHERE user_id=? AND started_at>?').bind(user.id, now - 60000).first();
    if (recent.count >= 30) return json({ error: 'Aguarde um instante para iniciar outra partida.' }, 429);
    await db.prepare('DELETE FROM playnova_runs_v2 WHERE started_at<?').bind(now - 86400000).run();
    const runId = crypto.randomUUID();
    await db.prepare('INSERT INTO playnova_runs_v2 (id,user_id,started_at,used) VALUES (?,?,?,0)').bind(runId, user.id, now).run();
    return json({ runId });
  }
  if (path === '/api/scores/submit' && request.method === 'POST') {
    const score = body.score;
    if (!Number.isSafeInteger(score) || score < 1 || score > rules.maxScore || typeof body.runId !== 'string') return json({ error: 'Pontuação inválida.' }, 400);
    const run = await db.prepare('SELECT user_id,started_at,used FROM playnova_runs_v2 WHERE id=?').bind(body.runId).first();
    const now = Date.now();
    if (!run || run.user_id !== user.id || run.used || now - run.started_at > 86400000) return json({ error: 'Partida expirada ou já registrada.' }, 409);
    // Sanity limit only: client-side game scores cannot provide a cheat-proof guarantee.
    if (score > Math.max(25, Math.floor((now - run.started_at) / 1000) * 20)) return json({ error: 'Pontuação incompatível com o tempo de partida.' }, 400);
    // Both writes commit together. A DB failure must not consume an unsaved run.
    const results = await db.batch([
      db.prepare(`INSERT INTO playnova_scores_v2 (user_id,week_start,score,submitted_at)
        SELECT user_id,?,?,? FROM playnova_runs_v2 WHERE id=? AND user_id=? AND used=0
        ON CONFLICT(user_id,week_start) DO UPDATE SET score=excluded.score,submitted_at=excluded.submitted_at WHERE excluded.score>playnova_scores_v2.score`)
        .bind(rules.weekStart(now), score, now, body.runId, user.id),
      db.prepare('UPDATE playnova_runs_v2 SET used=1 WHERE id=? AND user_id=? AND used=0').bind(body.runId, user.id)
    ]);
    if (results[1].meta?.changes !== 1) return json({ error: 'Partida já registrada.' }, 409);
    return json({ success: true, score });
  }
  return json({ error: 'Não encontrado.' }, 404);
}
export default {
  async fetch(request, env) {
    try { return await api(request, env); }
    catch (error) { console.error('Community API:', error?.message); return json({ error: 'O serviço de contas está indisponível. Tente novamente.' }, 503); }
  }
};
