/**
 * FRIV DIGITAL — Slope Leaderboard (js/leaderboard.js)
 * Weekly leaderboard with podium, localStorage scores, score submission
 * Depends on: js/auth.js (must be loaded first)
 */
(function () {
  'use strict';

  const SCORES_KEY = 'friv_slope_scores';
  const MAX_SCORE = 99999;
  const TOP_N = 10;

  /* =====================================================
     1. WEEK HELPERS
     ===================================================== */

  function getWeekStart() {
    const now = new Date();
    // Monday 00:00
    const day = now.getDay(); // 0=Sun
    const diff = (day === 0) ? 6 : day - 1;
    const mon = new Date(now);
    mon.setHours(0, 0, 0, 0);
    mon.setDate(mon.getDate() - diff);
    return mon.getTime();
  }

  function getAllScores() {
    try {
      const stored = localStorage.getItem(SCORES_KEY);
      if (stored) return JSON.parse(stored);
      // Scores iniciais da semana para o ranking começar animado!
      const w = getWeekStart();
      const initial = [
        { nick: 'Davi (Criador)', avatarData: null, score: 1450, weekStart: w, timestamp: Date.now() - 3600000 },
        { nick: 'Samuel VIP', avatarData: null, score: 1120, weekStart: w, timestamp: Date.now() - 7200000 },
        { nick: 'SlopeMaster', avatarData: null, score: 890, weekStart: w, timestamp: Date.now() - 14400000 },
        { nick: 'CyberBall', avatarData: null, score: 620, weekStart: w, timestamp: Date.now() - 28800000 },
        { nick: 'Astro3D', avatarData: null, score: 480, weekStart: w, timestamp: Date.now() - 43200000 }
      ];
      saveAllScores(initial);
      return initial;
    } catch { return []; }
  }
  function saveAllScores(arr) {
    localStorage.setItem(SCORES_KEY, JSON.stringify(arr));
  }

  function getWeeklyScores() {
    const weekStart = getWeekStart();
    const all = getAllScores();
    // Keep only current week; best score per nick
    const thisWeek = all.filter(s => s.weekStart === weekStart);
    const best = {};
    thisWeek.forEach(s => {
      if (!best[s.nick] || s.score > best[s.nick].score) best[s.nick] = s;
    });
    return Object.values(best).sort((a, b) => b.score - a.score).slice(0, TOP_N);
  }

  /* =====================================================
     2. SUBMISSION (rate limit per session)
     ===================================================== */

  let sessionSubmissions = 0;
  const MAX_SUBMISSIONS = 3;

  function submitScore(nick, avatarData, score) {
    if (typeof score !== 'number' || isNaN(score) || score <= 0) return { ok: false, msg: 'Score inválido.' };
    if (score > MAX_SCORE) return { ok: false, msg: `Score máximo permitido: ${MAX_SCORE}.` };
    if (sessionSubmissions >= MAX_SUBMISSIONS) return { ok: false, msg: 'Limite de envios desta sessão atingido (3).' };

    const entry = {
      nick,
      avatarData: avatarData || null,
      score: Math.floor(score),
      weekStart: getWeekStart(),
      timestamp: Date.now()
    };
    const all = getAllScores();
    all.push(entry);
    // Keep only scores from last 2 weeks to avoid bloat
    const twoWeeksAgo = getWeekStart() - 7 * 24 * 60 * 60 * 1000;
    const trimmed = all.filter(s => s.weekStart >= twoWeeksAgo);
    saveAllScores(trimmed);
    sessionSubmissions++;
    return { ok: true, msg: 'Score enviado! 🎉' };
  }

  /* =====================================================
     3. AVATAR RENDER HELPER (reuse FrivAuth if available)
     ===================================================== */

  function getLetterAvatar(nick) {
    if (window.FrivAuth && window.FrivAuth.generateLetterAvatar) {
      return window.FrivAuth.generateLetterAvatar(nick, 56);
    }
    // Fallback: simple colored square
    const c = document.createElement('canvas');
    c.width = c.height = 56;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(0, 0, 56, 56);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((nick[0] || '?').toUpperCase(), 28, 30);
    return c.toDataURL('image/png');
  }

  function avatarImgTag(entry, size) {
    const src = entry.avatarData || getLetterAvatar(entry.nick);
    return `<img src="${src}" alt="${escHtml(entry.nick)}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;display:block;">`;
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* =====================================================
     4. RENDER LEADERBOARD
     ===================================================== */

  function renderLeaderboard(container) {
    if (!container) return;
    const scores = getWeeklyScores();
    const session = window.FrivAuth ? window.FrivAuth.getSession() : null;
    const myNick = session ? session.nick : null;

    const medals = ['🥇','🥈','🥉'];
    const podiumColors = ['gold','silver','#cd7f32'];

    // Build podium HTML (top 3)
    let podiumHtml = '';
    if (scores.length > 0) {
      // Reorder for display: 2nd, 1st, 3rd
      const display = [];
      if (scores[1]) display.push({ ...scores[1], medal: medals[1] });
      if (scores[0]) display.push({ ...scores[0], medal: medals[0] });
      if (scores[2]) display.push({ ...scores[2], medal: medals[2] });

      podiumHtml = `<div class="leaderboard-podium">` +
        display.map(e => `
          <div class="podium-item">
            <div class="podium-medal">${e.medal}</div>
            <div class="podium-avatar">${avatarImgTag(e, 56)}</div>
            <div class="podium-nick">${escHtml(e.nick)}</div>
            <div class="podium-score">${e.score.toLocaleString('pt-BR')}</div>
            <div class="podium-block"></div>
          </div>
        `).join('') +
        `</div>`;
    }

    // Build table HTML (ranks 4–10)
    const tableRows = scores.slice(3).map((e, i) => {
      const rank = i + 4;
      const isMe = myNick && e.nick.toLowerCase() === myNick.toLowerCase();
      return `
        <div class="lb-row${isMe ? ' my-score' : ''}">
          <span class="lb-rank">${rank}</span>
          <div class="lb-avatar">${avatarImgTag(e, 36)}</div>
          <span class="lb-nick">${escHtml(e.nick)}${isMe ? ' <span style="font-size:10px;color:#9b59b6;">▶ você</span>' : ''}</span>
          <span class="lb-score">${e.score.toLocaleString('pt-BR')}</span>
        </div>
      `;
    }).join('');

    // Also highlight user in top 3 within podium (via CSS or inline note)
    // We handle highlight via CSS class .my-score only in table

    // Guest notice / submit area
    let submitHtml = '';
    if (!session || session.isGuest) {
      submitHtml = `
        <div class="lb-guest-notice">
          <span>👻 Faça login ou crie sua conta para salvar seu recorde no ranking semanal!</span>
          <button class="lb-guest-btn" id="lb-guest-login-btn">👤 Entrar / Criar Conta</button>
        </div>
      `;
    } else {
      submitHtml = `
        <div class="leaderboard-submit-area">
          <p class="lb-submit-title">📤 Enviar meu score</p>
          <div class="lb-submit-row">
            <input type="number" class="lb-score-input" id="lb-score-input" placeholder="Seu score..." min="1" max="${MAX_SCORE}">
            <button class="lb-submit-btn" id="lb-submit-btn">Enviar</button>
          </div>
          <div class="lb-submit-msg" id="lb-submit-msg">Envios restantes nesta sessão: ${MAX_SUBMISSIONS - sessionSubmissions}</div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="leaderboard-header">
        <h2 class="leaderboard-title">🏆 Ranking Slope — Semana Atual</h2>
        <span class="leaderboard-reset-note">🔄 Reseta toda segunda-feira</span>
      </div>
      ${scores.length === 0 ? '<div class="lb-empty">Nenhum score ainda esta semana. Seja o primeiro! 🎮</div>' : podiumHtml}
      ${scores.length > 3 ? `<div class="leaderboard-table">${tableRows}</div>` : ''}
      ${submitHtml}
    `;

    // Bind submit button
    const submitBtn = document.getElementById('lb-submit-btn');
    const scoreInput = document.getElementById('lb-score-input');
    const msgEl = document.getElementById('lb-submit-msg');

    if (submitBtn && scoreInput && msgEl) {
      submitBtn.addEventListener('click', function () {
        const val = parseInt(scoreInput.value, 10);
        if (!val || isNaN(val) || val <= 0) {
          msgEl.textContent = 'Digite um score válido.';
          msgEl.className = 'lb-submit-msg err';
          return;
        }
        const result = submitScore(session.nick, session.avatarData, val);
        msgEl.textContent = result.msg;
        msgEl.className = 'lb-submit-msg ' + (result.ok ? 'ok' : 'err');
        if (result.ok) {
          scoreInput.value = '';
          renderLeaderboard(container);
        }
      });
      scoreInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') submitBtn.click();
      });
    }

    // Bind guest login button
    const guestLoginBtn = document.getElementById('lb-guest-login-btn');
    if (guestLoginBtn) {
      guestLoginBtn.addEventListener('click', function () {
        if (window.FrivAuth && window.FrivAuth.openModal) {
          window.FrivAuth.openModal();
        }
      });
    }
  }

  /* =====================================================
     5. LISTEN FOR POSTMESSAGE FROM SLOPE IFRAME
     ===================================================== */

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'SLOPE_SCORE') return;
    const score = Number(e.data.score);
    if (!score || score <= 0) return;

    const session = window.FrivAuth ? window.FrivAuth.getSession() : null;
    if (!session || session.isGuest) return;

    const result = submitScore(session.nick, session.avatarData, score);
    if (result.ok) {
      const container = document.getElementById('slope-leaderboard');
      if (container) renderLeaderboard(container);
    }
  });

  /* =====================================================
     6. AUTH EVENT LISTENERS — refresh on login/logout/avatar
     ===================================================== */

  window.addEventListener('friv:login', function () {
    sessionSubmissions = 0; // reset on new login
    const container = document.getElementById('slope-leaderboard');
    if (container) renderLeaderboard(container);
  });
  window.addEventListener('friv:logout', function () {
    const container = document.getElementById('slope-leaderboard');
    if (container) renderLeaderboard(container);
  });
  window.addEventListener('friv:avatarUpdated', function () {
    const container = document.getElementById('slope-leaderboard');
    if (container) renderLeaderboard(container);
  });

  /* =====================================================
     7. INIT
     ===================================================== */

  function init() {
    const container = document.getElementById('slope-leaderboard');
    if (container) renderLeaderboard(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  window.FrivLeaderboard = { submitScore, getWeeklyScores, renderLeaderboard };
})();
