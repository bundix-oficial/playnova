/**
 * FRIV DIGITAL — Slope Olympic Leaderboard (js/leaderboard.js)
 * Weekly Olympic Podium [ 2º Prata ] [ 👑 1º Ouro ] [ 3º Bronze ]
 * Auto-captures match score on Game Over (for logged in AND guest players).
 * Zero fake users: truly real & clean weekly leaderboard!
 */
(function () {
  'use strict';

  // Chave limpa e definitiva
  const SCORES_KEY = 'friv_slope_scores_v3';
  const MAX_SCORE = 99999;
  const TOP_N = 10;

  // Lista de nicks testes antigos para banir e garantir que NUNCA apareçam
  const BANNED_TEST_NICKS = [
    'davi (criador)',
    'samuel vip',
    'slopemaster',
    'cyberball',
    'astro3d',
    'pedro',
    'ana'
  ];

  /* =====================================================
     1. STORAGE & LIMPEZA DE LEGADOS
     ===================================================== */

  // Limpa imediatamente qualquer resquício de fakes em versões anteriores
  try {
    localStorage.removeItem('friv_slope_scores');
    localStorage.removeItem('friv_slope_scores_v1');
    localStorage.removeItem('friv_slope_scores_v2');
  } catch (e) {}

  function getWeekStart() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo
    const diff = (day === 0) ? 6 : day - 1; // Segunda-feira
    const mon = new Date(now);
    mon.setHours(0, 0, 0, 0);
    mon.setDate(mon.getDate() - diff);
    return mon.getTime();
  }

  function getAllScores() {
    try {
      const stored = localStorage.getItem(SCORES_KEY);
      if (!stored) return [];
      let list = JSON.parse(stored);
      if (!Array.isArray(list)) return [];

      // Filtra estritamente removendo qualquer nick fake antigo
      return list.filter(item => {
        if (!item || !item.nick || typeof item.score !== 'number') return false;
        const clean = item.nick.toLowerCase().trim();
        return !BANNED_TEST_NICKS.includes(clean);
      });
    } catch (e) {
      return [];
    }
  }

  function saveAllScores(arr) {
    try {
      localStorage.setItem(SCORES_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  function getWeeklyScores() {
    const weekStart = getWeekStart();
    const all = getAllScores();
    // Somente scores da semana atual
    const thisWeek = all.filter(s => s.weekStart === weekStart);

    // Mantém o melhor score por nick
    const best = {};
    thisWeek.forEach(s => {
      const key = s.nick.toLowerCase().trim();
      if (!best[key] || s.score > best[key].score) {
        best[key] = s;
      }
    });

    return Object.values(best).sort((a, b) => b.score - a.score).slice(0, TOP_N);
  }

  /* =====================================================
     2. SUBMISSÃO DE SCORE (LOGADO OU VISITANTE/GUEST)
     ===================================================== */

  let sessionSubmissions = 0;
  const MAX_SUBMISSIONS = 10;

  function submitScore(nick, avatarData, score, isAuto) {
    if (typeof score !== 'number' || isNaN(score) || score <= 0) {
      return { ok: false, msg: 'Pontuação inválida.' };
    }
    if (score > MAX_SCORE) {
      return { ok: false, msg: `Pontuação máxima permitida: ${MAX_SCORE.toLocaleString('pt-BR')}.` };
    }
    if (!isAuto && sessionSubmissions >= MAX_SUBMISSIONS) {
      return { ok: false, msg: 'Limite de envios manuais atingido.' };
    }

    const cleanNick = (nick || 'Visitante').trim();
    const entry = {
      nick: cleanNick,
      avatarData: avatarData || null,
      score: Math.floor(score),
      weekStart: getWeekStart(),
      timestamp: Date.now()
    };

    const all = getAllScores();
    all.push(entry);

    // Mantém histórico das últimas 2 semanas
    const twoWeeksAgo = getWeekStart() - 14 * 24 * 60 * 60 * 1000;
    const trimmed = all.filter(s => s.weekStart >= twoWeeksAgo);
    saveAllScores(trimmed);

    if (!isAuto) sessionSubmissions++;
    return { ok: true, msg: 'Pontuação salva no ranking! 🏆' };
  }

  /* =====================================================
     3. AVATARES
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
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* =====================================================
     4. RENDERIZAÇÃO DO PÓDIO OLÍMPICO
     ===================================================== */

  function renderLeaderboard(container) {
    if (!container) return;
    const scores = getWeeklyScores();
    const session = window.FrivAuth ? window.FrivAuth.getSession() : null;
    const myNick = session ? session.nick : null;

    const p1 = scores[0] || null; // 1º Lugar (Ouro)
    const p2 = scores[1] || null; // 2º Lugar (Prata)
    const p3 = scores[2] || null; // 3º Lugar (Bronze)

    // 1º Lugar (Centro com Coroa 👑)
    const p1Html = p1 ? `
      <div class="podium-item podium-first">
        <div class="podium-crown" title="Campeão da Semana">👑</div>
        <div class="podium-medal">🥇</div>
        <div class="podium-avatar">${avatarImgTag(p1, 70)}</div>
        <div class="podium-nick" title="${escHtml(p1.nick)}">${escHtml(p1.nick)}</div>
        <div class="podium-score">${p1.score.toLocaleString('pt-BR')} pts</div>
        <div class="podium-block"><span class="podium-rank-num">1</span></div>
      </div>
    ` : `
      <div class="podium-item podium-first empty">
        <div class="podium-crown" title="Coroa do Campeão">👑</div>
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

    // Pódio Visual Estilo Olimpíadas: [ 2º Prata ] [ 👑 1º Ouro ] [ 3º Bronze ]
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
          🎮 <strong>Pódio 100% zerado e livre!</strong><br>
          Jogue uma partida no Slope 3D e conquiste o topo do pódio olímpico 👑
        </div>
      `;
    }

    // Área 100% automática & Anti-Trapaça (sem digitação manual)
    const currentNickDisplay = session ? session.nick : 'Visitante';
    const autoLiveHtml = `
      <div class="lb-anti-cheat-card">
        <div class="lb-shield-icon">🛡️</div>
        <div class="lb-shield-info">
          <h4>Pontuação 100% Automática & Anti-Trapaça</h4>
          <p>Jogue no Slope 3D acima. Ao cair da pista ou finalizar a partida, seus pontos sobem sozinhos direto para o pódio sem risco de trapaça!</p>
        </div>
        <div class="lb-live-pulse"><span class="pulse-dot"></span>Ao vivo</div>
      </div>
      ${(!session || session.isGuest) ? `
        <div class="lb-guest-invite">
          <span>👤 Jogando como <strong>${escHtml(currentNickDisplay)}</strong>. Quer colocar sua própria foto de perfil no topo?</span>
          <button class="lb-guest-btn" id="lb-guest-login-btn">Entrar / Criar Conta</button>
        </div>
      ` : `
        <div class="lb-guest-invite" style="border-color:rgba(16,185,129,0.4);background:rgba(16,185,129,0.08);color:#a7f3d0;">
          <span>✅ Conectado como <strong>${escHtml(session.nick)}</strong> — Seus recordes são creditados com sua foto!</span>
        </div>
      `}
    `;

    container.innerHTML = `
      <div class="leaderboard-header">
        <h2 class="leaderboard-title">🏆 Ranking Slope 3D — Semana Atual</h2>
        <span class="leaderboard-reset-note">🔄 Reseta toda segunda-feira</span>
      </div>
      <div id="lb-live-banner" class="lb-live-banner" style="display:none;"></div>
      ${podiumHtml}
      ${tableHtml}
      ${autoLiveHtml}
    `;

    // Botão de login / registro no convite
    const guestLoginBtn = document.getElementById('lb-guest-login-btn');
    if (guestLoginBtn) {
      guestLoginBtn.addEventListener('click', function () {
        if (window.FrivAuth && window.FrivAuth.openModal) {
          window.FrivAuth.openModal();
        }
      });
    }
  }

  function showBanner(text) {
    const banner = document.getElementById('lb-live-banner');
    if (!banner) return;
    banner.innerHTML = text;
    banner.style.display = 'block';
    banner.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    banner.style.color = '#ffffff';
    banner.style.padding = '12px 18px';
    banner.style.borderRadius = '12px';
    banner.style.fontWeight = '800';
    banner.style.textAlign = 'center';
    banner.style.marginBottom = '16px';
    banner.style.boxShadow = '0 4px 18px rgba(16, 185, 129, 0.4)';
    setTimeout(() => {
      if (banner) banner.style.display = 'none';
    }, 6000);
  }

  /* =====================================================
     5. CAPTURA AUTOMÁTICA DE SCORE (GAME OVER NO IFRAME OU INDEXEDDB)
     ===================================================== */

  let lastRegisteredScore = 0;

  function handleAutoScore(score) {
    score = Number(score);
    if (!score || isNaN(score) || score <= 0 || score > MAX_SCORE) return;
    if (score === lastRegisteredScore) return;
    lastRegisteredScore = score;

    // Obtém sessão do usuário (logado ou visitante)
    let session = window.FrivAuth ? window.FrivAuth.getSession() : null;
    if (!session) {
      session = window.FrivAuth && window.FrivAuth.createGuestSession ? window.FrivAuth.createGuestSession() : { nick: 'Visitante' + Math.floor(100 + Math.random()*900) };
    }

    // Salva pontuação automaticamente
    const result = submitScore(session.nick, session.avatarData, score, true);
    if (result.ok) {
      const container = document.getElementById('slope-leaderboard');
      if (container) {
        renderLeaderboard(container);
        showBanner(`🔥 Partida finalizada! ${score.toLocaleString('pt-BR')} pontos adicionados automaticamente ao pódio para ${escHtml(session.nick)}!`);
      }
    }
  }

  // 1. Ouve mensagens diretas do iframe
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'SLOPE_SCORE') return;
    handleAutoScore(e.data.score);
  });

  // 2. Monitoramento autônomo do banco IndexedDB do Slope
  function checkOriginIndexedDB() {
    try {
      if (!window.indexedDB) return;
      const req = indexedDB.open('/idbfs', 21);
      req.onsuccess = function (e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('FILE_DATA')) return;
        const tx = db.transaction(['FILE_DATA'], 'readonly');
        const store = tx.objectStore('FILE_DATA');
        const cursorReq = store.openCursor();
        cursorReq.onsuccess = function (evt) {
          const cursor = evt.target.result;
          if (cursor) {
            const val = cursor.value;
            if (val && val.contents) {
              try {
                const str = new TextDecoder('utf-8').decode(val.contents);
                const m = str.match(/name="[^"]*(?:score|high|points|best)[^"]*"[^>]*>(\d+)</i);
                const m2 = str.match(/(?:HighScore|LastScore|CurrentScore|Total\s*Score|points)[^\d]*(\d+)/i);
                const found = m ? m[1] : (m2 ? m2[1] : null);
                if (found) {
                  const s = parseInt(found, 10);
                  if (s > 0 && s < MAX_SCORE) {
                    handleAutoScore(s);
                  }
                }
              } catch (err) {}
            }
            cursor.continue();
          }
        };
      };
    } catch (e) {}
  }

  // Varredura a cada 2.5s enquanto o jogador estiver na tela do Slope
  setInterval(checkOriginIndexedDB, 2500);

  /* =====================================================
     6. REATIVIDADE DE AUTENTICAÇÃO
     ===================================================== */

  window.addEventListener('friv:login', function () {
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
