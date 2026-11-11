/* Slope scores: exact game events, account-bound runs, explicit local/online scopes. */
(() => {
  'use strict';
  const rules = window.FrivAccountRules, api = window.FrivAccountAPI;
  const key = 'friv_slope_scores_v5';
  const frame = document.getElementById('game-frame');
  const container = document.getElementById('slope-leaderboard');
  if (!frame || !container) return;
  let online = false, rows = [], run = null, channel = crypto.randomUUID(), boundId = null, hasBound = false;
  let notice = '', filter = '', scope = 'local', refreshing = false;
  let creatingGuest = false;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const session = () => window.FrivAuth?.getSession();
  function localScores() {
    try {
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(list) ? list.filter(s => s && typeof s.userId === 'string' && Number.isSafeInteger(s.score) && s.score > 0 && s.score <= rules.maxScore && rules.nickname(s.nick).ok) : [];
    } catch { return []; }
  }
  function weekly() {
    const best = new Map();
    for (const s of localScores().filter(s => s.weekStart === rules.weekStart())) {
      if (!best.has(s.userId) || s.score > best.get(s.userId).score) best.set(s.userId, s);
    }
    return [...best.values()].sort((a,b) => b.score-a.score || a.timestamp-b.timestamp).slice(0,10);
  }
  function image(entry, size) {
    const src = rules.avatar(entry.avatarData) || window.FrivAuth.generateLetterAvatar(entry.nick, size);
    return `<img src="${esc(src)}" alt="" width="${size}" height="${size}">`;
  }
  function render() {
    const user = session(), scores = scope === 'global' ? rows : weekly();
    const shown = filter ? scores.filter(s => s.nick.toLocaleLowerCase('pt-BR').includes(filter.toLocaleLowerCase('pt-BR'))) : scores;
    const podium = [1,0,2].map(i => {
      const entry = scores[i], place = ['first','second','third'][i];
      const medal = ['🥇','🥈','🥉'][i];
      const crown = (i === 0 && entry) ? '<div class="podium-crown">👑</div>' : '';
      return `<div class="podium-item podium-${place}${entry?'':' empty'}">${crown}<div class="podium-medal">${medal}</div><div class="podium-avatar${entry?'':' empty-slot'}">${entry ? image(entry,60) : '?'}</div><div class="podium-nick${entry?'':' empty'}">${entry?esc(entry.nick):`${i+1}º Lugar Vago`}</div><div class="podium-score${entry?'':' empty'}">${entry?entry.score.toLocaleString('pt-BR')+' pts':'— pts'}</div><div class="podium-block"><span class="podium-rank-num">${i+1}</span></div></div>`;
    }).join('');

    let tableContent = '';
    if (filter) {
      tableContent = shown.length > 0 ? shown.map(s => {
        const rank = scores.indexOf(s) + 1;
        const isMe = s.userId === user?.id;
        return `<div class="lb-row${isMe ? ' my-score' : ''}"><span class="lb-rank">#${rank}</span><div class="lb-avatar">${image(s,38)}</div><span class="lb-nick">${esc(s.nick)}${isMe ? ' <span style="font-size:11px;color:#ffdd00;font-weight:800;margin-left:4px;">(VOCÊ)</span>' : ''}</span><span class="lb-score">${s.score.toLocaleString('pt-BR')} pts</span></div>`;
      }).join('') : '<p class="lb-empty-notice">Nenhum jogador encontrado para essa busca.</p>';
    } else {
      const tableRows = [];
      for (let rank = 4; rank <= 10; rank++) {
        const s = scores[rank - 1] || null;
        if (s) {
          const isMe = s.userId === user?.id;
          tableRows.push(`<div class="lb-row${isMe ? ' my-score' : ''}"><span class="lb-rank">#${rank}</span><div class="lb-avatar">${image(s,38)}</div><span class="lb-nick">${esc(s.nick)}${isMe ? ' <span style="font-size:11px;color:#ffdd00;font-weight:800;margin-left:4px;">(VOCÊ)</span>' : ''}</span><span class="lb-score">${s.score.toLocaleString('pt-BR')} pts</span></div>`);
        } else {
          tableRows.push(`<div class="lb-row empty-row"><span class="lb-rank">#${rank}</span><div class="lb-avatar empty-slot">?</div><span class="lb-nick empty">${rank}º Lugar Vago</span><span class="lb-score empty">— pts</span></div>`);
        }
      }
      tableContent = tableRows.join('');
    }

    container.innerHTML = `<div class="leaderboard-header"><h2 class="leaderboard-title">🏆 Slope — ranking semanal</h2><span>Segunda-feira · horário de Brasília</span></div>
      <p id="lb-status" role="status">${esc(notice || (online ? 'Placar online disponível.' : 'Modo local: pontos visíveis apenas neste navegador. O placar online aguarda ativação.'))}</p>
      <div class="lb-submit-row"><label>Placar <select id="lb-scope">${online?'<option value="global">Online — todos os computadores</option>':''}<option value="local">Neste navegador</option></select></label><label>Buscar jogador <input id="lb-name-filter" maxlength="20" placeholder="Nome do jogador" value="${esc(filter)}"></label><button id="lb-refresh" type="button">Atualizar</button></div>
      ${filter?'':`<div class="leaderboard-podium">${podium}</div>`}
      <div class="leaderboard-table">
        <div class="lb-table-header">
          <span class="lb-th-rank">Posição</span>
          <span class="lb-th-player">Jogador</span>
          <span class="lb-th-score">Pontuação</span>
        </div>
        ${tableContent}
      </div>
      <div class="lb-anti-cheat-card">
        <div class="lb-shield-icon">🛡️</div>
        <div class="lb-shield-info">
          <h4>Pontuação 100% Automática & Anti-Trapaça</h4>
          <p>Jogue no Slope 3D acima. Ao cair da pista ou finalizar a partida, seus pontos sobem sozinhos direto para o pódio sem risco de trapaça!</p>
        </div>
        <div class="lb-live-pulse"><span class="pulse-dot"></span>Ao vivo</div>
      </div>
      <div class="lb-guest-invite">
        <span>${user && user.scope === 'global' ? `✅ Conectado como <strong>${esc(user.nick)}</strong> — Seus recordes sobem no ranking online!` : user ? `👤 Jogando como <strong>${esc(user.nick)}</strong> (local). Crie sua conta online para subir no ranking global!` : '👤 Jogando como Visitante. Crie sua conta para salvar seu recorde no placar online!'}</span>
        <button type="button" class="lb-guest-btn" id="lb-login">${user && user.scope === 'global' ? 'Minha Conta' : 'Entrar / Criar Conta'}</button>
      </div>
      <p class="pn-game-note">Registramos a pontuação da partida concluída. Recordes antigos não são atribuídos à conta atual. Pontos capturados pelo navegador não são uma garantia contra trapaças.</p>`;
    container.querySelector('#lb-scope').value = scope;
    container.querySelector('#lb-scope').onchange = event => { scope = event.target.value; render(); };
    container.querySelector('#lb-name-filter').oninput = event => {
      const pos = event.target.selectionStart; filter = event.target.value; render();
      const input = container.querySelector('#lb-name-filter'); input.focus(); input.setSelectionRange(pos,pos);
    };
    container.querySelector('#lb-refresh').onclick = () => refresh(true);
    container.querySelector('#lb-login').onclick = () => window.FrivAuth.openModal();
  }
  async function refresh(explicit = false) {
    if (refreshing) return;
    refreshing = true;
    try {
      if (explicit && !online && (await api.status(true)).online) { online = true; scope = 'global'; }
      if (online) {
        const data = await api.request('scores/leaderboard');
        rows = (data.leaderboard || []).filter(s => rules.nickname(s.nick).ok && Number.isSafeInteger(s.score) && s.score > 0 && s.score <= rules.maxScore);
        if (explicit) notice = 'Placar atualizado.';
      }
    } catch { notice = 'Não foi possível atualizar o placar online. Tente novamente; nenhum ponto antigo será reenviado.'; }
    finally { refreshing = false; render(); }
  }
  function bind(force = false) {
    const user = session();
    if (!force && hasBound && boundId === (user?.id || null)) return;
    hasBound = true;
    boundId = user?.id || null; run = null; channel = crypto.randomUUID();
    frame.contentWindow?.postMessage({ type:'FRIV_SLOPE_BIND', channel }, location.origin);
  }
  function identityChanged() {
    if (creatingGuest) return;
    const id = session()?.id || null;
    if (boundId !== null && id !== boundId) {
      // A match started by a previous user must never finish under the next account.
      frame.src = frame.src;
      notice = 'Conta alterada. O jogo foi reiniciado para separar as partidas.';
    }
    bind(); refresh();
  }
  window.addEventListener('message', async event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow || !event.data || typeof event.data !== 'object') return;
    const data = event.data;
    if (data.type === 'FRIV_SLOPE_READY') { bind(true); return; }
    if (data.channel !== channel) return;
    if (data.type === 'FRIV_SLOPE_START') {
      if (run && !run.finished) return;
      creatingGuest = true;
      const user = session() || window.FrivAuth.createGuestSession();
      creatingGuest = false; boundId = user.id;
      const current = { id: crypto.randomUUID(), user: {...user}, finished:false };
      run = current;
      current.remote = online && user.scope === 'global' ? api.request('scores/run', {}).then(x=>x.runId) : Promise.resolve(null);
      // Keep a rejected start promise handled even if the game never finishes.
      current.remote.catch(() => {});
      return;
    }
    if (data.type !== 'FRIV_SLOPE_FINISH' || !run || run.finished || run.user.id !== session()?.id) return;
    if (!Number.isSafeInteger(data.score) || data.score < 1 || data.score > rules.maxScore) return;
    const finished = run; finished.finished = true;
    try {
      const runId = await finished.remote;
      if (finished.user.id !== session()?.id) return;
      if (online && finished.user.scope === 'global') {
        await api.request('scores/submit', { runId, score:data.score });
        notice = `${data.score} pontos registrados para ${finished.user.nick}.`;
        scope = 'global';
      } else {
        const list = localScores().filter(s=>s.weekStart >= rules.weekStart()-14*86400000);
        list.push({ userId:finished.user.id, nick:finished.user.nick, avatarData:finished.user.avatarData, score:data.score, weekStart:rules.weekStart(), timestamp:Date.now(), runId:finished.id });
        localStorage.setItem(key, JSON.stringify(list.slice(-1000)));
        notice = `${data.score} pontos salvos neste navegador para ${finished.user.nick}.`;
        scope = 'local';
      }
    } catch (error) { notice = 'A partida terminou, mas o placar não conseguiu salvar: ' + error.message; }
    refresh();
  });
  frame.addEventListener('load', () => bind(true));
  for (const name of ['friv:login','friv:logout']) window.addEventListener(name, identityChanged);
  window.addEventListener('friv:avatarUpdated', () => refresh());
  window.addEventListener('storage', event => { if (event.key === 'friv_session') identityChanged(); else if (event.key === key) render(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  setInterval(() => { if (!document.hidden && online) refresh(); }, 30000);
  window.FrivLeaderboard = { getWeeklyScores:weekly, refresh, renderLeaderboard:render };
  if (!session()) window.FrivAuth.createGuestSession();
  render();
  api.status().then(status => { online = status.online; scope = online?'global':'local'; bind(); refresh(); });
})();
