/**
 * FRIV DIGITAL — Slope Olympic Leaderboard (js/leaderboard.js)
 * Weekly Olympic Podium [ 2º Prata ] [ 👑 1º Ouro ] [ 3º Bronze ]
 * Table for ranks 4–10 below.
 * Pure real scores (no fake data), weekly Monday reset, anti-cheat limits.
 */
(function () {
  'use strict';

  const SCORES_KEY = 'friv_slope_scores_v2';
  const MAX_SCORE = 99999;
  const TOP_N = 10;

  /* =====================================================
     1. WEEK & STORAGE HELPERS
     ===================================================== */

  function getWeekStart() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun
    const diff = (day === 0) ? 6 : day - 1; // Monday of current week
    const mon = new Date(now);
    mon.setHours(0, 0, 0, 0);
    mon.setDate(mon.getDate() - diff);
    return mon.getTime();
  }

  function getAllScores() {
    try {
      // Remove any old mock key to keep board 100% clean
      localStorage.removeItem('friv_slope_scores');
      const stored = localStorage.getItem(SCORES_KEY);
      if (stored) return JSON.parse(stored);
      return []; // Truly empty: zero fakes!
    } catch {
      return [];
    }
  }

  function saveAllScores(arr) {
    localStorage.setItem(SCORES_KEY, JSON.stringify(arr));
  }

  function getWeeklyScores() {
    const weekStart = getWeekStart();
    const all = getAllScores();
    // Keep only current week scores
    const thisWeek = all.filter(s => s.weekStart === weekStart);
    // Best score per player nick
    const best = {};
    thisWeek.forEach(s => {
      const lower = s.nick.toLowerCase();
      if (!best[lower] || s.score > best[lower].score) {
        best[lower] = s;
      }
    });
    return Object.values(best).sort((a, b) => b.score - a.score).slice(0, TOP_N);
  }

  /* =====================================================
     2. SCORE SUBMISSION
     ===================================================== */

  let sessionSubmissions = 0;
  const MAX_SUBMISSIONS = 3;

  function submitScore(nick, avatarData, score) {
    if (typeof score !== 'number' || isNaN(score) || score <= 0) {
      return { ok: false, msg: 'Score inválido.' };
    }
    if (score > MAX_SCORE) {
      return { ok: false, msg: `Score máximo permitido: ${MAX_SCORE.toLocaleString('pt-BR')}.` };
    }
    if (sessionSubmissions >= MAX_SUBMISSIONS) {
      return { ok: false, msg: 'Limite de envios desta sessão atingido (3).' };
    }

    const entry = {
      nick,
      avatarData: avatarData || null,
      score: Math.floor(score),
      weekStart: getWeekStart(),
      timestamp: Date.now()
    };

    const all = getAllScores();
    all.push(entry);

    // Keep up to 2 weeks of history
    const twoWeeksAgo = getWeekStart() - 7 * 24 * 60 * 60 * 1000;
    const trimmed = all.filter(s => s.weekStart >= twoWeeksAgo);
    saveAllScores(trimmed);

    sessionSubmissions++;
    return { ok: true, msg: 'Score registrado com sucesso! 🏆' };
  }

  /* =====================================================
     3. AVATAR HELPERS
     ===================================================== */

  function getLetterAvatar(nick, size) {
    if (window.FrivAuth && window.FrivAuth.generateLetterAvatar) {
      return window.FrivAuth.generateLetterAvatar(nick, size);
    }
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.floor(size * 0.45)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((nick[0] || '?').toUpperCase(), size / 2, size / 2 + 2);
    return c.toDataURL('image/png');
  }

  function avatarImgTag(entry, size) {
    const src = entry.avatarData || getLetterAvatar(entry.nick, size);
    return `<img src="${src}" alt="${escHtml(entry.nick)}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;display:block;">`;
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* =====================================================
     4. RENDER OLYMPIC LEADERBOARD
     ===================================================== */

  function renderLeaderboard(container) {
    if (!container) return;
    const scores = getWeeklyScores();
    const session = window.FrivAuth ? window.FrivAuth.getSession() : null;
    const myNick = session ? session.nick : null;

    // Slots do Pódio Olímpico:
    // scores[0] = 1º Lugar (Ouro)
    // scores[1] = 2º Lugar (Prata)
    // scores[2] = 3º Lugar (Bronze)
    const p1 = scores[0] || null;
    const p2 = scores[1] || null;
    const p3 = scores[2] || null;

    // 1º Lugar (Centro com Coroa 👑)
    const p1Html = p1 ? `
      <div class="podium-item podium-first">
        <div class="podium-crown" title="Campeão">👑</div>
        <div class="podium-medal">🥇</div>
        <div class="podium-avatar">${avatarImgTag(p1, 70)}</div>
        <div class="podium-nick" title="${escHtml(p1.nick)}">${escHtml(p1.nick)}</div>
        <div class="podium-score">${p1.score.toLocaleString('pt-BR')} pts</div>
        <div class="podium-block"><span class="podium-rank-num">1</span></div>
      </div>
    ` : `
      <div class="podium-item podium-first empty">
        <div class="podium-crown" title="Coroa de Campeão">👑</div>
        <div class="podium-medal">🥇</div>
        <div class="podium-avatar empty-slot">?</div>
        <div class="podium-nick empty">1º Lugar Vago</div>
        <div class="podium-score empty">— pts</div>
        <div class="podium-block"><span class="podium-rank-num">1</span></div>
      </div>
    `;

    // 2º Lugar (Esquerda - Prata)
    const p2Html = p2 ? `
      <div class="podium-item podium-second">
        <div class="podium-medal">🥈</div>
        <div class="podium-avatar">${avatarImgTag(p2, 58)}</div>
        <div class="podium-nick" title="${escHtml(p2.nick)}">${escHtml(p2.nick)}</div>
        <div class="podium-score">${p2.score.toLocaleString('pt-BR')} pts</div>
        <div class="podium-block"><span class="podium-rank-num">2</span></div>
      </div>
    ` : `
      <div class="podium-item podium-second empty">
        <div class="podium-medal">🥈</div>
        <div class="podium-avatar empty-slot">?</div>
        <div class="podium-nick empty">2º Lugar Vago</div>
        <div class="podium-score empty">— pts</div>
        <div class="podium-block"><span class="podium-rank-num">2</span></div>
      </div>
    `;

    // 3º Lugar (Direita - Bronze)
    const p3Html = p3 ? `
      <div class="podium-item podium-third">
        <div class="podium-medal">🥉</div>
        <div class="podium-avatar">${avatarImgTag(p3, 54)}</div>
        <div class="podium-nick" title="${escHtml(p3.nick)}">${escHtml(p3.nick)}</div>
        <div class="podium-score">${p3.score.toLocaleString('pt-BR')} pts</div>
        <div class="podium-block"><span class="podium-rank-num">3</span></div>
      </div>
    ` : `
      <div class="podium-item podium-third empty">
        <div class="podium-medal">🥉</div>
        <div class="podium-avatar empty-slot">?</div>
        <div class="podium-nick empty">3º Lugar Vago</div>
        <div class="podium-score empty">— pts</div>
        <div class="podium-block"><span class="podium-rank-num">3</span></div>
      </div>
    `;

    // Pódio Visual em ordem Olímpica: [ 2º Prata ] [ 👑 1º Ouro ] [ 3º Bronze ]
    const podiumHtml = `
      <div class="leaderboard-podium">
        ${p2Html}
        ${p1Html}
        ${p3Html}
      </div>
    `;

    // Tabela para 4º ao 10º Lugar
    const remaining = scores.slice(3);
    let tableHtml = '';
    if (remaining.length > 0) {
      const rows = remaining.map((e, idx) => {
        const rank = idx + 4;
        const isMe = myNick && e.nick.toLowerCase() === myNick.toLowerCase();
        return `
          <div class="lb-row${isMe ? ' my-score' : ''}">
            <span class="lb-rank">#${rank}</span>
            <div class="lb-avatar">${avatarImgTag(e, 38)}</div>
            <span class="lb-nick">${escHtml(e.nick)}${isMe ? ' <span style="font-size:11px;color:#ffdd00;font-weight:800;margin-left:4px;">(VOCÊ)</span>' : ''}</span>
            <span class="lb-score">${e.score.toLocaleString('pt-BR')} pts</span>
          </div>
        `;
      }).join('');

      tableHtml = `
        <div class="leaderboard-table">
          <div class="lb-table-header">
            <span class="lb-th-rank">Pos</span>
            <span class="lb-th-player">Jogador</span>
            <span class="lb-th-score">Pontuação</span>
          </div>
          ${rows}
        </div>
      `;
    } else if (scores.length === 0) {
      tableHtml = `
        <div class="lb-empty-notice">
          🎮 <strong>Pódio zerado para a semana atual!</strong><br>
          Jogue o Slope 3D agora e seja o primeiro a conquistar a Coroa de Campeão 👑
        </div>
      `;
    }

    // Formulário de Envio ou Convite de Login
    let submitHtml = '';
    if (!session || session.isGuest) {
      submitHtml = `
        <div class="lb-guest-notice">
          <span>👻 Faça login ou crie sua conta para registrar seu recorde no ranking semanal!</span>
          <button class="lb-guest-btn" id="lb-guest-login-btn">👤 Entrar / Criar Conta</button>
        </div>
      `;
    } else {
      submitHtml = `
        <div class="leaderboard-submit-area">
          <p class="lb-submit-title">📤 Salvar meu recorde no Slope</p>
          <div class="lb-submit-row">
            <input type="number" class="lb-score-input" id="lb-score-input" placeholder="Pontuação obtida..." min="1" max="${MAX_SCORE}">
            <button class="lb-submit-btn" id="lb-submit-btn">Salvar Score</button>
          </div>
          <div class="lb-submit-msg" id="lb-submit-msg">Envios restantes nesta sessão: ${MAX_SUBMISSIONS - sessionSubmissions}</div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="leaderboard-header">
        <h2 class="leaderboard-title">🏆 Ranking Slope 3D — Semana Atual</h2>
        <span class="leaderboard-reset-note">🔄 Reseta toda segunda-feira</span>
      </div>
      ${podiumHtml}
      ${tableHtml}
      ${submitHtml}
    `;

    // Bind evento do botão de envio
    const submitBtn = document.getElementById('lb-submit-btn');
    const scoreInput = document.getElementById('lb-score-input');
    const msgEl = document.getElementById('lb-submit-msg');

    if (submitBtn && scoreInput && msgEl) {
      submitBtn.addEventListener('click', function () {
        const val = parseInt(scoreInput.value, 10);
        if (!val || isNaN(val) || val <= 0) {
          msgEl.textContent = 'Digite uma pontuação válida acima de 0.';
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

    // Bind botão de login para visitante
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
     5. CAPTURA AUTOMÁTICA DE SCORE VIA POSTMESSAGE
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
     6. ATUALIZAÇÃO REATIVA DE AUTENTICAÇÃO
     ===================================================== */

  window.addEventListener('friv:login', function () {
    sessionSubmissions = 0;
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
     7. INICIALIZAÇÃO
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

  // API Pública
  window.FrivLeaderboard = { submitScore, getWeeklyScores, renderLeaderboard };
})();
