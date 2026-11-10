/**
 * FRIV DIGITAL — Backend API (Cloudflare Worker)
 * Endpoints:
 *   POST /api/auth/register      -> Criar conta (nick, senha, avatar)
 *   POST /api/auth/login         -> Entrar com nick e senha
 *   GET  /api/auth/me            -> Verificar sessão
 *   POST /api/scores/submit      -> Enviar pontuação do Slope
 *   GET  /api/scores/leaderboard -> Buscar ranking semanal
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const json = (data, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    };

    try {
      // 1. REGISTRO
      if (url.pathname === '/api/auth/register' && request.method === 'POST') {
        const body = await request.json();
        const { nick, passwordHash, avatarData } = body;

        if (!nick || nick.length < 2 || nick.length > 20) {
          return json({ error: 'Nick inválido (2 a 20 caracteres).' }, 400);
        }
        if (!passwordHash) {
          return json({ error: 'Hash de senha obrigatório.' }, 400);
        }

        const existing = await env.DB.prepare('SELECT id FROM users WHERE nick = ? COLLATE NOCASE').bind(nick).first();
        if (existing) {
          return json({ error: 'Este nick já está cadastrado.' }, 409);
        }

        const userId = crypto.randomUUID();
        const now = Date.now();
        await env.DB.prepare(
          'INSERT INTO users (id, nick, password_hash, avatar_data, created_at) VALUES (?, ?, ?, ?, ?)'
        ).bind(userId, nick, passwordHash, avatarData || null, now).run();

        const token = crypto.randomUUID();
        return json({ success: true, user: { id: userId, nick, avatarData }, token });
      }

      // 2. LOGIN
      if (url.pathname === '/api/auth/login' && request.method === 'POST') {
        const body = await request.json();
        const { nick, passwordHash } = body;

        const user = await env.DB.prepare(
          'SELECT id, nick, password_hash, avatar_data FROM users WHERE nick = ? COLLATE NOCASE'
        ).bind(nick).first();

        if (!user || user.password_hash !== passwordHash) {
          return json({ error: 'Nick ou senha incorretos.' }, 401);
        }

        const token = crypto.randomUUID();
        return json({
          success: true,
          user: { id: user.id, nick: user.nick, avatarData: user.avatar_data },
          token
        });
      }

      // 3. ENVIAR SCORE (SLOPE)
      if (url.pathname === '/api/scores/submit' && request.method === 'POST') {
        const body = await request.json();
        const { userId, nick, avatarData, score } = body;

        if (!score || typeof score !== 'number' || score < 1 || score > 99999) {
          return json({ error: 'Pontuação inválida (1 a 99.999).' }, 400);
        }

        // Calcula segunda-feira 00:00 da semana atual
        const now = new Date();
        const day = now.getUTCDay();
        const diff = (day === 0 ? 6 : day - 1);
        const mon = new Date(now);
        mon.setUTCDate(mon.getUTCDate() - diff);
        mon.setUTCHours(0, 0, 0, 0);
        const weekStart = mon.getTime();

        // Verifica melhor score do usuário nesta semana
        const prev = await env.DB.prepare(
          'SELECT id, score FROM slope_scores WHERE (user_id = ? OR nick = ?) AND week_start = ?'
        ).bind(userId || nick, nick, weekStart).first();

        if (prev) {
          if (score > prev.score) {
            await env.DB.prepare(
              'UPDATE slope_scores SET score = ?, avatar_data = ?, submitted_at = ? WHERE id = ?'
            ).bind(score, avatarData || null, Date.now(), prev.id).run();
          }
        } else {
          await env.DB.prepare(
            'INSERT INTO slope_scores (user_id, nick, avatar_data, score, week_start, submitted_at) VALUES (?, ?, ?, ?, ?, ?)'
          ).bind(userId || nick, nick, avatarData || null, score, weekStart, Date.now()).run();
        }

        return json({ success: true, message: 'Score registrado com sucesso!' });
      }

      // 4. RANKING SEMANAL DO SLOPE
      if (url.pathname === '/api/scores/leaderboard' && request.method === 'GET') {
        const now = new Date();
        const day = now.getUTCDay();
        const diff = (day === 0 ? 6 : day - 1);
        const mon = new Date(now);
        mon.setUTCDate(mon.getUTCDate() - diff);
        mon.setUTCHours(0, 0, 0, 0);
        const weekStart = mon.getTime();

        const results = await env.DB.prepare(
          'SELECT nick, avatar_data as avatarData, score, submitted_at as timestamp FROM slope_scores WHERE week_start = ? ORDER BY score DESC LIMIT 10'
        ).bind(weekStart).all();

        return json({
          weekStart,
          leaderboard: results.results || []
        });
      }

      return json({ error: 'Endpoint não encontrado.' }, 404);
    } catch (err) {
      return json({ error: 'Erro interno do servidor', details: err.message }, 500);
    }
  }
};

