/**
 * FRIV DIGITAL — Auth System (js/auth.js)
 * Login, Register, Guest mode, Avatar upload
 * Shared accounts use the same-origin Pages API. Local accounts stay explicitly local.
 */
(function () {
  'use strict';
  const rules = window.FrivAccountRules;
  const api = window.FrivAccountAPI;
  const makeId = () => crypto.randomUUID();
  let temporaryUsers = [], temporarySession = null, storageFailed = false;

  /* =====================================================
     1. UTILITIES
     ===================================================== */

  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getUsers() {
    if (storageFailed) return temporaryUsers;
    try {
      const value = JSON.parse(localStorage.getItem('friv_users') || '[]');
      if (!Array.isArray(value)) return [];
      const users = value.filter(u => u && typeof u.nick === 'string' && typeof u.passwordHash === 'string');
      let changed = false;
      for (const user of users) if (!user.id) { user.id = makeId(); changed = true; }
      if (changed) saveUsers(users);
      return users;
    } catch { return []; }
  }
  function saveUsers(users) {
    temporaryUsers = users;
    try { localStorage.setItem('friv_users', JSON.stringify(users)); } catch { storageFailed = true; }
  }

  function getSession() {
    if (storageFailed) return temporarySession;
    try {
      const s = JSON.parse(localStorage.getItem('friv_session') || 'null');
      if (!s) return null;
      if (s.expiry && Date.now() > s.expiry) { localStorage.removeItem('friv_session'); return null; }
      if (typeof s.nick !== 'string') return null;
      if (!s.id) {
        s.id = (!s.isGuest && getUsers().find(u => u.nick.toLowerCase() === s.nick.toLowerCase())?.id) || makeId();
        s.scope = 'local';
        saveSession(s);
      }
      s.avatarData = rules.avatar(s.avatarData);
      return s;
    } catch { return null; }
  }
  function saveSession(session) {
    temporarySession = session;
    try { localStorage.setItem('friv_session', JSON.stringify(session)); } catch { storageFailed = true; }
  }
  function clearSession() {
    temporarySession = null;
    try { localStorage.removeItem('friv_session'); } catch { storageFailed = true; }
  }

  /* =====================================================
     2. AVATAR HELPERS
     ===================================================== */

  function generateLetterAvatar(nick, size = 100) {
    const colors = ['#7c3aed','#9b59b6','#8b5cf6','#6d28d9','#4c1d95','#c026d3','#7e22ce'];
    const bg = colors[(nick.charCodeAt(0) || 0) % colors.length];
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.floor(size * 0.45)}px Fredoka, Rubik, system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((nick[0] || '?').toUpperCase(), size / 2, size / 2 + 2);
    return c.toDataURL('image/png');
  }

  function resizeImage(file, size, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const ctx = c.getContext('2d');
        // Cover-crop to square
        const min = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = (img.naturalWidth - min) / 2;
        const sy = (img.naturalHeight - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        callback(c.toDataURL('image/jpeg', 0.88));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function renderAvatarImg(el, avatarData, nick, extraClass) {
    avatarData = rules.avatar(avatarData);
    nick = escHtml(nick);
    if (avatarData) {
      el.style.background = 'transparent';
      el.innerHTML = `<img src="${avatarData}" alt="${nick}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" class="${extraClass || ''}">`;
    } else {
      el.style.background = '';
      el.innerHTML = `<img src="${generateLetterAvatar(nick)}" alt="${nick}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" class="${extraClass || ''}">`;
    }
  }

  /* =====================================================
     3. BUILD MODAL HTML
     ===================================================== */

  function buildModal() {
    if (document.getElementById('auth-backdrop')) return;
    const html = `
<div id="auth-backdrop" class="auth-backdrop" role="dialog" aria-modal="true" aria-label="Login FRIV DIGITAL">
  <div class="auth-modal">
    <button class="auth-close-btn" id="auth-close" aria-label="Fechar">×</button>
    <div class="auth-logo">FRIV <span>DIGITAL</span></div>
    <div class="auth-tabs">
      <button class="auth-tab-btn active" data-tab="login">Entrar</button>
      <button class="auth-tab-btn" data-tab="register">Criar Conta</button>
    </div>
    <p id="auth-mode-note" role="status" style="margin:8px 0;font-size:13px">Verificando contas online…</p>

    <!-- Login Form -->
    <div class="auth-form active" id="auth-form-login">
      <div class="auth-field">
        <label for="login-nick">Nick</label>
        <input type="text" id="login-nick" placeholder="Seu nick..." maxlength="30" autocomplete="username">
        <div class="auth-error" id="login-nick-err"></div>
      </div>
      <div class="auth-field">
        <label for="login-pass">Senha</label>
        <input type="password" id="login-pass" placeholder="Sua senha..." maxlength="64" autocomplete="current-password">
        <div class="auth-error" id="login-pass-err"></div>
      </div>
      <button class="auth-submit-btn" id="login-submit-btn">Entrar 🎮</button>
      <button class="auth-guest-btn" id="guest-btn">Continuar como Visitante 👻</button>
    </div>

    <!-- Register Form -->
    <div class="auth-form" id="auth-form-register">
      <div class="auth-field">
        <label for="reg-nick">Nick</label>
        <input type="text" id="reg-nick" placeholder="Escolha um nick..." maxlength="30" autocomplete="username">
        <div class="auth-error" id="reg-nick-err"></div>
      </div>
      <div class="auth-field">
        <label for="reg-pass">Senha</label>
        <input type="password" id="reg-pass" placeholder="Crie uma senha..." maxlength="64" autocomplete="new-password">
        <div class="auth-error" id="reg-pass-err"></div>
      </div>
      <div class="auth-field">
        <label for="reg-pass2">Confirmar Senha</label>
        <input type="password" id="reg-pass2" placeholder="Repita a senha..." maxlength="64" autocomplete="new-password">
        <div class="auth-error" id="reg-pass2-err"></div>
      </div>
      <button class="auth-submit-btn" id="reg-submit-btn">Criar Conta 🚀</button>
      <button class="auth-guest-btn" id="guest-btn2">Continuar como Visitante 👻</button>
    </div>
  </div>
</div>

<!-- Hidden file input for avatar upload -->
<input type="file" id="profile-file-input" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none">
`;
    document.body.insertAdjacentHTML('beforeend', html);
    bindModalEvents();
  }

  /* =====================================================
     4. MEMORY CARD & SAVES SYSTEM (PS2 STYLE)
     ===================================================== */

  const SAVES_STORAGE_KEY = 'friv_memory_card_v1';

  function getAllSaves() {
    try {
      return JSON.parse(localStorage.getItem(SAVES_STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function saveAllSaves(all) {
    localStorage.setItem(SAVES_STORAGE_KEY, JSON.stringify(all));
  }

  function getMemoryCardUserKey() {
    const session = getSession();
    if (session && session.nick) return session.nick.toLowerCase().trim();
    return 'visitante';
  }

  function buildMemoryCardModal() {
    if (document.getElementById('mc-backdrop')) return;
    const html = `
<div id="mc-backdrop" class="mc-backdrop" role="dialog" aria-modal="true" aria-label="Memory Card FRIV DIGITAL">
  <div class="mc-modal">
    <div class="mc-header">
      <div class="mc-header-brand">
        <div class="mc-ps2-logo-pill">
          <span class="mc-brand-icon">🎴</span>
          <span class="mc-led-indicator"></span>
        </div>
        <div class="mc-brand-text">
          <h3 class="mc-brand-title">PS2 MEMORY CARD <span>(8MB)</span></h3>
          <p class="mc-brand-sub" id="mc-user-sub">Saves &amp; Momentos Gravados</p>
        </div>
      </div>
      <button class="mc-close-btn" id="mc-close" type="button" aria-label="Fechar Memory Card">✕</button>
    </div>

    <div class="mc-slot-bar">
      <div class="mc-slot-left">
        <span class="mc-slot-tag">SLOT 1</span>
        <div class="mc-storage-meter">
          <div class="mc-storage-fill" id="mc-storage-fill" style="width: 12%;"></div>
        </div>
        <span class="mc-slot-status" id="mc-slot-count">Calculando saves...</span>
      </div>
      <button class="mc-clear-all-btn" id="mc-clear-all" type="button" title="Excluir todos os saves">🗑️ Limpar Todos</button>
    </div>

    <div class="mc-body">
      <div class="mc-grid" id="mc-grid"></div>
    </div>
  </div>
</div>
`;
    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('mc-close').addEventListener('click', closeMemoryCardModal);
    document.getElementById('mc-backdrop').addEventListener('click', function (e) {
      if (e.target === this) closeMemoryCardModal();
    });
    document.getElementById('mc-clear-all').addEventListener('click', function () {
      const userKey = getMemoryCardUserKey();
      const allSaves = getAllSaves();
      const hasUserSaves = allSaves[userKey] && Object.keys(allSaves[userKey]).length > 0;
      const hasGuestSaves = allSaves['visitante'] && Object.keys(allSaves['visitante']).length > 0;
      if (!hasUserSaves && !hasGuestSaves) {
        alert('Seu Memory Card já está vazio!');
        return;
      }
      if (confirm('Tem certeza que deseja apagar todos os saves do seu Memory Card?')) {
        delete allSaves[userKey];
        delete allSaves['visitante'];
        saveAllSaves(allSaves);
        renderMemoryCardGrid();
      }
    });
  }

  function renderMemoryCardGrid() {
    const grid = document.getElementById('mc-grid');
    const slotCountEl = document.getElementById('mc-slot-count');
    const storageFillEl = document.getElementById('mc-storage-fill');
    const userSubEl = document.getElementById('mc-user-sub');
    if (!grid) return;

    const userKey = getMemoryCardUserKey();
    const session = getSession();
    const displayName = session ? session.nick : 'Visitante';
    if (userSubEl) {
      userSubEl.textContent = `Saves de ${displayName} • PS2 / Web Edition`;
    }

    const allSaves = getAllSaves();
    let userSaves = Object.assign({}, allSaves['visitante'] || {}, allSaves[userKey] || {});

    const saveKeys = Object.keys(userSaves);
    const count = saveKeys.length;

    if (slotCountEl) {
      slotCountEl.textContent = `${count} / 8 Blocos Usados • ${Math.max(0, 8 - count)} Livres`;
    }
    if (storageFillEl) {
      const pct = Math.min(100, Math.max(12, (count / 8) * 100));
      storageFillEl.style.width = pct + '%';
    }

    if (count === 0) {
      grid.innerHTML = `
        <div class="mc-empty">
          <div class="mc-empty-icon">🎴</div>
          <h4>Nenhum Save Encontrado</h4>
          <p>Você ainda não tem jogos salvos no seu Memory Card.</p>
          <div class="mc-empty-guide">
            <strong>Como Salvar o Momento do Jogo:</strong>
            <ol>
              <li>Abra qualquer jogo clássico (como <b>GTA San Andreas 2D</b>, <b>Crash Bandicoot</b>, <b>Crazy Taxi</b> ou <b>Basket Random</b>).</li>
              <li>Aperte o botão <b>💾 Salvar</b> na barra superior ou a tecla <b>F5</b> a qualquer momento.</li>
              <li>Veja a <b>bolinha girando salvando</b> no canto da tela com som clássico!</li>
              <li>Volte aqui no Memory Card e clique em <b>▶ Continuar Jogando</b> para voltar na hora!</li>
            </ol>
          </div>
        </div>
      `;
      return;
    }

    const sortedEntries = Object.values(userSaves).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    const isInGames = window.location.pathname.includes('/games/');
    const rootPath = isInGames ? '../../' : './';

    grid.innerHTML = sortedEntries.map(entry => {
      let imageSrc = entry.screenshot;
      const isScreenshot = Boolean(imageSrc);

      if (!imageSrc) {
        let coverRel = entry.cover;
        try {
          if (window.PlaynovaCatalogIndex && Array.isArray(window.PlaynovaCatalogIndex.games)) {
            const item = window.PlaynovaCatalogIndex.games.find(g => g.id === entry.gameId);
            if (item && item.cover) coverRel = item.cover;
          }
        } catch(e) {}
        if (!coverRel) coverRel = 'assets/brand/frivdigital-logo.png';
        imageSrc = coverRel.startsWith('http') || coverRel.startsWith('data:') 
          ? coverRel 
          : `${rootPath}${coverRel.replace(/^(\.\/|\.\.\/\.\.\/)/, '')}`;
      }

      const dateStr = entry.dateStr || 'Salvo recentemente';
      const summary = entry.summary || 'Progresso do jogo salvo';
      const gameUrl = isInGames ? `../${entry.gameId}/index.html?load_save=true` : `games/${entry.gameId}/index.html?load_save=true`;

      return `
        <div class="mc-card" data-game-id="${escHtml(entry.gameId)}">
          <div class="mc-card-media ${isScreenshot ? 'has-shot' : ''}">
            <img src="${escHtml(imageSrc)}" alt="${escHtml(entry.gameTitle)}" class="mc-card-img" onerror="this.onerror=null;this.parentElement.classList.add('no-img');this.style.display='none';">
            <span class="mc-card-badge">${isScreenshot ? '📸 FOTO DO JOGO' : '🎴 SLOT SALVO'}</span>
            <span class="mc-card-time-pill">🕒 ${escHtml(dateStr)}</span>
          </div>
          <div class="mc-card-details">
            <h4 class="mc-card-game-title">${escHtml(entry.gameTitle)}</h4>
            <div class="mc-card-summary" title="${escHtml(summary)}">📍 ${escHtml(summary)}</div>
          </div>
          <div class="mc-card-actions">
            <a href="${escHtml(gameUrl)}" class="mc-action-play">▶ Continuar Jogando</a>
            <button type="button" class="mc-action-del" data-delete-id="${escHtml(entry.gameId)}" title="Excluir este save">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.mc-action-del').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const gid = this.dataset.deleteId;
        if (!gid) return;
        if (confirm(`Deseja apagar o save de "${gid}"?`)) {
          const curAll = getAllSaves();
          const k = getMemoryCardUserKey();
          if (curAll[k] && curAll[k][gid]) delete curAll[k][gid];
          if (curAll['visitante'] && curAll['visitante'][gid]) delete curAll['visitante'][gid];
          saveAllSaves(curAll);
          renderMemoryCardGrid();
        }
      });
    });
  }

  function openMemoryCardModal() {
    buildMemoryCardModal();
    const bd = document.getElementById('mc-backdrop');
    if (bd) {
      bd.classList.add('open');
      renderMemoryCardGrid();
    }
  }

  function closeMemoryCardModal() {
    const bd = document.getElementById('mc-backdrop');
    if (bd) bd.classList.remove('open');
  }

  /* =====================================================
     5. HEADER USER WIDGET
     ===================================================== */

  function buildHeaderWidget() {
    // Find or create the container in header-top or game-bar
    let headerTop = document.querySelector('.header-top.page-width, .header-top, .game-bar');
    if (!headerTop) return;

    // Remove any existing widget
    const existing = document.getElementById('header-auth-area');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.id = 'header-auth-area';
    wrapper.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:auto;';

    const session = getSession();
    const mcBtnHtml = `<button class="header-mc-btn" id="header-mc-btn" type="button" title="Abrir Memory Card (Seus Saves)">🎴 Saves</button>`;

    if (!session) {
      wrapper.innerHTML = `
        ${mcBtnHtml}
        <button class="login-btn" id="login-btn" type="button">👤 Entrar</button>
      `;
      wrapper.querySelector('#login-btn').addEventListener('click', openModal);
      wrapper.querySelector('#header-mc-btn').addEventListener('click', openMemoryCardModal);
    } else {
      wrapper.innerHTML = `
        ${mcBtnHtml}
        <div id="header-user-widget">
          <div class="header-avatar-wrap" id="header-avatar-wrap" title="Meu perfil">
            <div class="header-avatar" id="header-avatar-el" style="display:flex;align-items:center;justify-content:center;"></div>
            <span class="header-avatar-cam">📷</span>
            <!-- Profile popup -->
            <div class="profile-popup" id="profile-popup">
              <div class="profile-popup-avatar" id="profile-popup-avatar" style="display:flex;align-items:center;justify-content:center;"></div>
              <div class="profile-popup-nick" id="profile-popup-nick">${escHtml(session.nick)}</div>
              <button class="profile-mc-btn" id="profile-mc-btn" type="button">🎴 Meus Saves (Memory Card)</button>
              <label class="profile-upload-btn" for="profile-file-input">📷 Trocar foto de perfil</label>
            </div>
          </div>
          <span class="header-nick" id="header-nick">${escHtml(session.nick)}</span>
          <button class="header-sair-btn" id="header-sair-btn" type="button">Sair</button>
        </div>
      `;

      wrapper.querySelector('#header-mc-btn').addEventListener('click', openMemoryCardModal);
      const profileMcBtn = wrapper.querySelector('#profile-mc-btn');
      if (profileMcBtn) {
        profileMcBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          const p = document.getElementById('profile-popup');
          if (p) p.classList.remove('open');
          openMemoryCardModal();
        });
      }

      // Set avatars
      setTimeout(() => {
        const avatarEl = document.getElementById('header-avatar-el');
        const popupAvatarEl = document.getElementById('profile-popup-avatar');
        if (avatarEl) renderAvatarImg(avatarEl, session.avatarData, session.nick, 'header-avatar');
        if (popupAvatarEl) renderAvatarImg(popupAvatarEl, session.avatarData, session.nick, 'profile-popup-avatar');
      }, 0);
    }

    const fsBtn = headerTop.querySelector('#fullscreen');
    if (fsBtn) {
      headerTop.insertBefore(wrapper, fsBtn);
    } else {
      headerTop.appendChild(wrapper);
    }
    if (session) bindLoggedInEvents();
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function bindLoggedInEvents() {
    const wrap = document.getElementById('header-avatar-wrap');
    const popup = document.getElementById('profile-popup');
    const sairBtn = document.getElementById('header-sair-btn');
    const fileInput = document.getElementById('profile-file-input');

    if (wrap && popup) {
      wrap.addEventListener('click', function (e) {
        e.stopPropagation();
        popup.classList.toggle('open');
      });
      document.addEventListener('click', function () {
        popup && popup.classList.remove('open');
      });
    }

    if (sairBtn) {
      sairBtn.addEventListener('click', async function () {
        const previous = getSession();
        if (previous?.scope === 'global') {
          try { await api.request('auth/logout', {}); }
          catch { showErr('login-nick-err', 'Não foi possível encerrar a sessão online. Tente novamente.'); openModal(); return; }
        }
        clearSession();
        buildHeaderWidget();
        window.dispatchEvent(new CustomEvent('friv:logout'));
      });
    }

    if (fileInput) {
      fileInput.onchange = function () {
        const file = fileInput.files[0];
        if (!file) return;
        resizeImage(file, 100, async function (dataUrl) {
          // Update session
          const session = getSession();
          if (!session) return;
          if (session.scope === 'global') {
            try { await api.request('auth/avatar', { avatarData: dataUrl }); }
            catch (error) { showErr('login-nick-err', error.message); openModal(); return; }
            if (getSession()?.id !== session.id) return;
          }
          session.avatarData = dataUrl;
          saveSession(session);

          // Update in users array too
          const users = getUsers();
          const idx = users.findIndex(u => session.scope !== 'global' && u.id === session.id);
          if (idx !== -1) { users[idx].avatarData = dataUrl; saveUsers(users); }

          buildHeaderWidget();
          window.dispatchEvent(new CustomEvent('friv:avatarUpdated', { detail: { avatarData: dataUrl } }));
        });
        fileInput.value = '';
      };
    }
  }

  /* =====================================================
     5. MODAL EVENTS
     ===================================================== */

  function openModal() {
    const bd = document.getElementById('auth-backdrop');
    if (bd) bd.classList.add('open');
    clearAuthErrors();
  }
  function closeModal() {
    const bd = document.getElementById('auth-backdrop');
    if (bd) bd.classList.remove('open');
  }

  function clearAuthErrors() {
    document.querySelectorAll('.auth-error').forEach(el => { el.classList.remove('visible'); el.textContent = ''; });
  }

  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('visible'); }
  }

  function bindModalEvents() {
    // Close
    document.getElementById('auth-close').addEventListener('click', closeModal);
    document.getElementById('auth-backdrop').addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });

    // Tabs
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('auth-form-' + this.dataset.tab).classList.add('active');
        clearAuthErrors();
      });
    });

    // Login submit
    document.getElementById('login-submit-btn').addEventListener('click', handleLogin);
    document.getElementById('login-pass').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleLogin();
    });

    // Register submit
    document.getElementById('reg-submit-btn').addEventListener('click', handleRegister);
    document.getElementById('reg-pass2').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleRegister();
    });

    // Guest buttons
    document.getElementById('guest-btn').addEventListener('click', handleGuest);
    document.getElementById('guest-btn2').addEventListener('click', handleGuest);
  }

  async function handleLogin() {
    clearAuthErrors();
    const nick = document.getElementById('login-nick').value.trim();
    const pass = document.getElementById('login-pass').value;

    let valid = true;
    if (!nick) { showErr('login-nick-err', 'Informe o nick.'); valid = false; }
    if (!pass) { showErr('login-pass-err', 'Informe a senha.'); valid = false; }
    if (!valid) return;
    if ((await api.status()).online) {
      try {
        const data = await api.request('auth/login', { nick, password: pass });
        finishOnlineLogin(data.user);
      } catch (error) { showErr('login-nick-err', error.message); }
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.nick.toLowerCase() === nick.toLowerCase());
    if (!user) { showErr('login-nick-err', 'Nick não encontrado.'); return; }

    const hash = await sha256(pass);
    if (hash !== user.passwordHash) { showErr('login-pass-err', 'Senha incorreta.'); return; }

    const session = {
      id: user.id,
      scope: 'local',
      nick: user.nick,
      avatarData: user.avatarData || null,
      token: Math.random().toString(36).slice(2),
      expiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      isGuest: false
    };
    saveSession(session);
    closeModal();
    buildHeaderWidget();
    window.dispatchEvent(new CustomEvent('friv:login', { detail: session }));
  }

  async function handleRegister() {
    clearAuthErrors();
    const nick = document.getElementById('reg-nick').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;

    let valid = true;
    const checked = rules.nickname(nick);
    if (!checked.ok) { showErr('reg-nick-err', checked.message); valid = false; }
    if (!nick || nick.length < 2) { showErr('reg-nick-err', 'Nick deve ter ao menos 2 caracteres.'); valid = false; }
    if (nick.length > 20) { showErr('reg-nick-err', 'Nick deve ter no máximo 20 caracteres.'); valid = false; }
    if (!pass || pass.length < 8) { showErr('reg-pass-err', 'Senha deve ter ao menos 8 caracteres.'); valid = false; }
    if (pass !== pass2) { showErr('reg-pass2-err', 'As senhas não coincidem.'); valid = false; }
    if (!valid) return;
    if ((await api.status()).online) {
      try {
        const data = await api.request('auth/register', { nick: checked.nick, password: pass });
        finishOnlineLogin(data.user);
      } catch (error) { showErr('reg-nick-err', error.message); }
      return;
    }

    const users = getUsers();
    if (users.find(u => u.nick.toLowerCase() === nick.toLowerCase())) {
      showErr('reg-nick-err', 'Este nick já está em uso. Escolha outro.');
      return;
    }

    const passwordHash = await sha256(pass);
    const newUser = { id: makeId(), nick: checked.nick, passwordHash, avatarData: null, createdAt: Date.now() };
    users.push(newUser);
    saveUsers(users);

    const session = {
      id: newUser.id,
      scope: 'local',
      nick,
      avatarData: null,
      token: Math.random().toString(36).slice(2),
      expiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
      isGuest: false
    };
    saveSession(session);
    closeModal();
    buildHeaderWidget();
    window.dispatchEvent(new CustomEvent('friv:login', { detail: session }));
  }

  function handleGuest() {
    const nick = 'Visitante' + Math.floor(1000 + Math.random() * 9000);
    const session = {
      id: makeId(),
      scope: 'local',
      nick,
      avatarData: null,
      token: null,
      expiry: Date.now() + 24 * 60 * 60 * 1000, // 1 day
      isGuest: true
    };
    saveSession(session);
    closeModal();
    buildHeaderWidget();
    window.dispatchEvent(new CustomEvent('friv:login', { detail: session }));
  }

  /* =====================================================
     6. INIT
     ===================================================== */

  function finishOnlineLogin(user) {
    const session = { ...user, scope: 'global', isGuest: false, expiry: Date.now() + 30 * 86400000 };
    saveSession(session); closeModal(); buildHeaderWidget();
    window.dispatchEvent(new CustomEvent('friv:login', { detail: session }));
  }

  async function init() {
    buildModal();
    buildMemoryCardModal();
    buildHeaderWidget();
    const status = await api.status();
    const note = document.getElementById('auth-mode-note');
    if (note) note.textContent = status.online ? 'Conta online: use o mesmo login em qualquer computador. Contas antigas deste navegador precisam de cadastro online.' : 'Modo local: contas e pontos ficam somente neste navegador. O placar online aguarda ativação.';
    if (status.online) {
      try {
        const data = await api.request('auth/me');
        finishOnlineLogin(data.user);
      } catch (error) {
        if (getSession()?.scope === 'global' && error.status === 401) { clearSession(); buildHeaderWidget(); window.dispatchEvent(new CustomEvent('friv:logout')); }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* =====================================================
     7. PUBLIC API (window.FrivAuth & window.FrivMemoryCard)
     ===================================================== */
  window.FrivAuth = {
    getSession,
    openModal,
    closeModal,
    openMemoryCard: openMemoryCardModal,
    closeMemoryCard: closeMemoryCardModal,
    clearSession,
    generateLetterAvatar,
    renderAvatarImg,
    createGuestSession: function () {
      let s = getSession();
      if (!s) {
        s = {
          id: makeId(),
          scope: 'local',
          nick: 'Visitante' + Math.floor(100 + Math.random() * 900),
          avatarData: null,
          token: null,
          expiry: Date.now() + 24 * 60 * 60 * 1000,
          isGuest: true
        };
        saveSession(s);
        buildHeaderWidget();
        window.dispatchEvent(new CustomEvent('friv:login', { detail: s }));
      }
      return s;
    }
  };

  window.FrivMemoryCard = {
    open: openMemoryCardModal,
    close: closeMemoryCardModal,
    getAllSaves,
    getMemoryCardUserKey
  };
})();
