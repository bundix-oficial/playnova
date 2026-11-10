/**
 * FRIV DIGITAL — Auth System (js/auth.js)
 * Login, Register, Guest mode, Avatar upload
 * Uses localStorage as the "database" (no backend required yet)
 */
(function () {
  'use strict';

  /* =====================================================
     1. UTILITIES
     ===================================================== */

  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getUsers() {
    try { return JSON.parse(localStorage.getItem('friv_users') || '[]'); } catch { return []; }
  }
  function saveUsers(users) {
    localStorage.setItem('friv_users', JSON.stringify(users));
  }

  function getSession() {
    try {
      const s = JSON.parse(localStorage.getItem('friv_session') || 'null');
      if (!s) return null;
      if (s.expiry && Date.now() > s.expiry) { localStorage.removeItem('friv_session'); return null; }
      return s;
    } catch { return null; }
  }
  function saveSession(session) {
    localStorage.setItem('friv_session', JSON.stringify(session));
  }
  function clearSession() {
    localStorage.removeItem('friv_session');
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
     4. HEADER USER WIDGET
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
    if (!session) {
      const btn = document.createElement('button');
      btn.className = 'login-btn';
      btn.id = 'login-btn';
      btn.textContent = '👤 Entrar';
      btn.addEventListener('click', openModal);
      wrapper.appendChild(btn);
    } else {
      wrapper.innerHTML = `
        <div id="header-user-widget">
          <div class="header-avatar-wrap" id="header-avatar-wrap" title="Meu perfil">
            <div class="header-avatar" id="header-avatar-el" style="display:flex;align-items:center;justify-content:center;"></div>
            <span class="header-avatar-cam">📷</span>
            <!-- Profile popup -->
            <div class="profile-popup" id="profile-popup">
              <div class="profile-popup-avatar" id="profile-popup-avatar" style="display:flex;align-items:center;justify-content:center;"></div>
              <div class="profile-popup-nick" id="profile-popup-nick">${escHtml(session.nick)}</div>
              <label class="profile-upload-btn" for="profile-file-input">📷 Trocar foto de perfil</label>
            </div>
          </div>
          <span class="header-nick" id="header-nick">${escHtml(session.nick)}</span>
          <button class="header-sair-btn" id="header-sair-btn">Sair</button>
        </div>
      `;

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
      sairBtn.addEventListener('click', function () {
        clearSession();
        buildHeaderWidget();
        window.dispatchEvent(new CustomEvent('friv:logout'));
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        if (!file) return;
        resizeImage(file, 100, function (dataUrl) {
          // Update session
          const session = getSession();
          if (!session) return;
          session.avatarData = dataUrl;
          saveSession(session);

          // Update in users array too
          const users = getUsers();
          const idx = users.findIndex(u => u.nick.toLowerCase() === session.nick.toLowerCase());
          if (idx !== -1) { users[idx].avatarData = dataUrl; saveUsers(users); }

          buildHeaderWidget();
          window.dispatchEvent(new CustomEvent('friv:avatarUpdated', { detail: { avatarData: dataUrl } }));
        });
        fileInput.value = '';
      });
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

    const users = getUsers();
    const user = users.find(u => u.nick.toLowerCase() === nick.toLowerCase());
    if (!user) { showErr('login-nick-err', 'Nick não encontrado.'); return; }

    const hash = await sha256(pass);
    if (hash !== user.passwordHash) { showErr('login-pass-err', 'Senha incorreta.'); return; }

    const session = {
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
    if (!nick || nick.length < 2) { showErr('reg-nick-err', 'Nick deve ter ao menos 2 caracteres.'); valid = false; }
    if (nick.length > 20) { showErr('reg-nick-err', 'Nick deve ter no máximo 20 caracteres.'); valid = false; }
    if (!pass || pass.length < 4) { showErr('reg-pass-err', 'Senha deve ter ao menos 4 caracteres.'); valid = false; }
    if (pass !== pass2) { showErr('reg-pass2-err', 'As senhas não coincidem.'); valid = false; }
    if (!valid) return;

    const users = getUsers();
    if (users.find(u => u.nick.toLowerCase() === nick.toLowerCase())) {
      showErr('reg-nick-err', 'Este nick já está em uso. Escolha outro.');
      return;
    }

    const passwordHash = await sha256(pass);
    const newUser = { nick, passwordHash, avatarData: null, createdAt: Date.now() };
    users.push(newUser);
    saveUsers(users);

    const session = {
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

  function init() {
    buildModal();
    buildHeaderWidget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* =====================================================
     7. PUBLIC API (window.FrivAuth)
     ===================================================== */
  window.FrivAuth = {
    getSession,
    openModal,
    closeModal,
    clearSession,
    generateLetterAvatar,
    renderAvatarImg,
    createGuestSession: function () {
      let s = getSession();
      if (!s) {
        s = {
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
})();
