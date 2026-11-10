/* PLAYNOVA game-shell.js v2 - Fullscreen + Anti-ad + Anti-redirect */
(function () {
  'use strict';

  /* ── Fullscreen button ── */
  const fullscreenButton =
    document.getElementById('fullscreen') ||
    document.getElementById('btn-fullscreen');
  fullscreenButton?.addEventListener('click', async () => {
    const frame =
      document.getElementById('game-frame') ||
      document.getElementById('online-stage') ||
      document.querySelector('iframe');
    if (!frame) return;
    if (frame.requestFullscreen) {
      try { await frame.requestFullscreen(); }
      catch { fullscreenButton.title = 'O navegador não permitiu tela cheia.'; frame.focus(); }
    } else { frame.focus(); }
  });

  /* ── Block external navigation from iframes (postMessage) ── */
  window.addEventListener('message', (e) => {
    if (!e.data) return;
    const raw = typeof e.data === 'string' ? e.data : JSON.stringify(e.data);
    if (/navigate|redirect|location\.href/i.test(raw)) {
      e.stopImmediatePropagation();
    }
  }, true);

  /* ── Block external link clicks on this page ── */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    if (a.dataset.playnovaOutbound === 'true') {
      try {
        const destination = new URL(a.href, location.href);
        if ((destination.protocol === 'https:' && ['github.com','wa.me'].includes(destination.hostname)) || destination.protocol === 'mailto:') return;
      } catch (_) {}
    }
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#') || href.startsWith('javascript')) return;
    try {
      const url = new URL(href, location.href);
      if (url.hostname !== location.hostname) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    } catch (_) {}
  }, true);

  /* ── Inject anti-ad payload into same-origin iframes ── */
  const ANTI_AD_SCRIPT = `
(function() {
  // Block popups
  window.open = function() { return null; };
  // Block top navigation
  try {
    Object.defineProperty(window, 'top', { get: function() { return window; }, configurable: true });
  } catch(e) {}
  // Mock Poki SDK - auto-resolve all breaks
  window.PokiSDK = {
    init: () => Promise.resolve(),
    gameLoadingStart: () => {},
    gameLoadingFinished: () => {},
    gameplayStart: () => {},
    gameplayStop: () => {},
    commercialBreak: (fn) => { if(typeof fn === 'function') fn(); return Promise.resolve(); },
    rewardedBreak: (fn) => { if(typeof fn === 'function') fn(true); return Promise.resolve(true); },
    happyTime: () => {},
    shareableURL: () => Promise.resolve(location.href),
    getURLParam: () => null,
    isAdBlocked: () => true,
  };
  // Mock CrazyGames SDK
  window.CrazyGames = window.CrazyGames || {};
  window.CrazyGames.SDK = {
    init: () => Promise.resolve(),
    game: { sdkGameLoadingStart: ()=>{}, sdkGameLoadingStop: ()=>{}, gameplayStart: ()=>{}, gameplayStop: ()=>{}, happytime: ()=>{} },
    ad: { requestAd: (t, cbs) => { if(cbs && cbs.adFinished) cbs.adFinished(); return Promise.resolve(); }, hasAdblock: true },
    user: { isUserAccountAvailable: false, showAuthPrompt: ()=>Promise.resolve(null) },
    data: {},
    game_settings: {},
  };
  // Mock GameDistribution
  window.GD_OPTIONS = window.GD_OPTIONS || { gameId: 'playnova', onEvent: ()=>{} };
  window.gdsdk = { showAd: ()=>Promise.resolve(), preloadAd: ()=>Promise.resolve() };
  // Remove external home buttons after page settles
  function removeExternalLinks() {
    var killerSelectors = [
      'a[href*="crazygames"]','a[href*="poki.com"]','a[href*="kongregate"]',
      'a[href*="newgrounds"]','a[href*="armorgames"]','a[href*="miniclip"]',
      'a[href*="gamedistribution"]','a[href*="y8.com"]','a[href*="silvergames"]',
      'a[href*="3kh0"]','a[href*="selenite"]','a[href*="unblocked"]',
      'a[href*="github.com"]',
      '.home-btn','.home-button','#home-btn','#homeBtn',
      '.btn-home','.button-home','[class*="home"]','[id*="home"]',
      '.back-to-portal','.portal-link','#portal-btn','.powered-by',
      '.watermark','#watermark','.branding','#branding',
    ];
    killerSelectors.forEach(function(sel) {
      try {
        document.querySelectorAll(sel).forEach(function(el) {
          if (el.tagName === 'A') {
            el.removeAttribute('href');
            el.style.pointerEvents = 'none';
            el.style.cursor = 'default';
          } else {
            el.style.display = 'none';
          }
        });
      } catch(e) {}
    });
  }
  // Run after 1s and 3s to catch dynamically added elements
  setTimeout(removeExternalLinks, 1000);
  setTimeout(removeExternalLinks, 3000);
  // Override window.location.assign and replace for external URLs
  var _assign = window.location.assign.bind(window.location);
  var _replace = window.location.replace.bind(window.location);
  try {
    window.location.assign = function(url) {
      try { if (new URL(url).hostname !== location.hostname) { console.warn('[PLAYNOVA] Blocked assign:', url); return; } } catch(e) {}
      _assign(url);
    };
    window.location.replace = function(url) {
      try { if (new URL(url).hostname !== location.hostname) { console.warn('[PLAYNOVA] Blocked replace:', url); return; } } catch(e) {}
      _replace(url);
    };
  } catch(e) {}
})();
`;

  /* Inject into iframe on load */
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(function(frame) {
    // Flash runners already deny script access, popups and SWF networking.
    // Their CSP deliberately rejects injected inline scripts.
    if (frame.getAttribute('src') === 'runner.html') return;
    frame.addEventListener('load', function() {
      try {
        const iDoc = frame.contentDocument || frame.contentWindow && frame.contentWindow.document;
        if (!iDoc || !iDoc.head) return;
        const s = iDoc.createElement('script');
        s.textContent = ANTI_AD_SCRIPT;
        iDoc.head.insertBefore(s, iDoc.head.firstChild);
      } catch (e) {
        /* Cross-origin - sandbox already handles navigation blocking */
      }
    });
    // Trigger for already-loaded iframes
    try {
      const iDoc = frame.contentDocument;
      if (iDoc && iDoc.readyState === 'complete') {
        const s = iDoc.createElement('script');
        s.textContent = ANTI_AD_SCRIPT;
        iDoc.head.insertBefore(s, iDoc.head.firstChild);
      }
    } catch(e) {}
  });

  /* =========================================================
     FRIV DIGITAL — GAME SAVE & LOAD (QUICKSAVE / MEMORY CARD)
     ========================================================= */
  const SAVES_STORAGE_KEY = 'friv_memory_card_v1';

  // Extract Game ID from path
  const gameMatch = location.pathname.match(/\/games\/([^/]+)/);
  const currentGameId = gameMatch ? gameMatch[1] : null;

  // Web Audio Synth Chimes
  const SaveAudio = {
    ctx: null,
    init() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    playTone(f, type, dur, vol, slide) {
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        if (slide) osc.frequency.exponentialRampToValueAtTime(slide, this.ctx.currentTime + dur);
        g.gain.setValueAtTime(vol, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + dur);
      } catch(e) {}
    },
    saveChime() {
      this.init();
      this.playTone(523, 'triangle', 0.12, 0.25);
      setTimeout(() => this.playTone(659, 'triangle', 0.14, 0.25), 80);
      setTimeout(() => this.playTone(784, 'triangle', 0.22, 0.3), 160);
    },
    loadChime() {
      this.init();
      this.playTone(440, 'sine', 0.15, 0.25, 880);
      setTimeout(() => this.playTone(880, 'triangle', 0.22, 0.3), 100);
    }
  };

  // Console-style Animated Save Indicator ("Bolinha Salvando Retrô")
  function showSaveIndicator(type, title, subtitle) {
    let el = document.getElementById('friv-save-indicator');
    if (!el) {
      el = document.createElement('div');
      el.id = 'friv-save-indicator';
      el.className = 'friv-save-indicator';
      document.body.appendChild(el);
    }

    let orbHtml = '';
    if (type === 'saving' || type === 'loading') {
      orbHtml = `
        <div class="friv-save-orb-wrap">
          <div class="friv-save-orb-spinner"></div>
          <div class="friv-save-orb-core"></div>
        </div>
      `;
    } else if (type === 'success') {
      orbHtml = `
        <div class="friv-save-orb-wrap success">
          <div class="friv-save-check">✓</div>
        </div>
      `;
    } else {
      orbHtml = `
        <div class="friv-save-orb-wrap warn">
          <div class="friv-save-warn">!</div>
        </div>
      `;
    }

    el.innerHTML = `
      ${orbHtml}
      <div class="friv-save-info">
        <span class="friv-save-heading">${title}</span>
        <span class="friv-save-subtext">${subtitle || ''}</span>
      </div>
    `;

    el.className = 'friv-save-indicator show ' + type;

    clearTimeout(el._hideTimer);
    if (type !== 'saving' && type !== 'loading') {
      el._hideTimer = setTimeout(() => {
        el.className = 'friv-save-indicator ' + type;
      }, 3500);
    }
  }

  // Get current session user nick
  function getCurrentUserKey() {
    try {
      const sess = JSON.parse(localStorage.getItem('friv_session') || 'null');
      if (sess && sess.nick) return sess.nick.toLowerCase().trim();
    } catch(e) {}
    return 'visitante';
  }

  // Save Game Progress / Snapshot
  function doQuickSave() {
    if (!currentGameId) return;
    SaveAudio.init();

    // Show glowing animated PS2-style saving orb immediately
    showSaveIndicator('saving', 'SALVANDO NO MEMORY CARD...', 'Slot 1 • Gravando momento exato');

    const frame = document.getElementById('game-frame') || document.querySelector('iframe');
    const userKey = getCurrentUserKey();
    const gameTitle = document.querySelector('.game-bar h1')?.textContent || document.title.split('—')[0].trim();
    const rootPath = location.pathname.includes('/games/') ? '../../' : './';

    // 1. Resolve exact cover path from Catalog Index so it never 404s
    let coverPath = null;
    try {
      if (window.PlaynovaCatalogIndex && Array.isArray(window.PlaynovaCatalogIndex.games)) {
        const item = window.PlaynovaCatalogIndex.games.find(g => g.id === currentGameId);
        if (item && item.cover) coverPath = `${rootPath}${item.cover.replace(/^\.\//, '')}`;
      }
    } catch(e) {}
    if (!coverPath) {
      coverPath = `${rootPath}assets/brand/frivdigital-logo.png`;
    }

    // 2. Capture real in-game canvas screenshot if accessible
    let screenshot = null;
    try {
      if (frame && frame.contentDocument) {
        const cvs = frame.contentDocument.querySelector('canvas');
        if (cvs && cvs.width > 0 && cvs.height > 0) {
          const thumb = document.createElement('canvas');
          thumb.width = 320;
          thumb.height = 180;
          const tctx = thumb.getContext('2d');
          tctx.drawImage(cvs, 0, 0, 320, 180);
          screenshot = thumb.toDataURL('image/jpeg', 0.75);
        }
      }
    } catch(err) {
      /* cross-origin canvas or tainted */
    }

    let responded = false;

    // Listen for custom snapshot from iframe
    function onSaveResponse(e) {
      if (e.data && e.data.type === 'FRIV_SAVE_DATA') {
        responded = true;
        window.removeEventListener('message', onSaveResponse);
        const finalSnapImg = e.data.screenshot || screenshot;
        commitSave(e.data.data, e.data.summary, finalSnapImg);
      }
    }
    window.addEventListener('message', onSaveResponse);

    // Ask iframe for custom snapshot
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ type: 'FRIV_SAVE_REQUEST' }, '*');
    }

    // Fallback if game has no custom snapshot (after 300ms)
    setTimeout(() => {
      if (!responded) {
        window.removeEventListener('message', onSaveResponse);
        commitSave(null, 'Momento salvo no Memory Card', screenshot);
      }
    }, 300);

    function commitSave(snapshot, summary, snapImg) {
      try {
        const allSaves = JSON.parse(localStorage.getItem(SAVES_STORAGE_KEY) || '{}');
        if (!allSaves[userKey]) allSaves[userKey] = {};

        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        allSaves[userKey][currentGameId] = {
          gameId: currentGameId,
          gameTitle: gameTitle,
          cover: coverPath,
          screenshot: snapImg || null,
          timestamp: Date.now(),
          dateStr: dateStr,
          summary: summary || 'Momento salvo no jogo',
          snapshot: snapshot || null
        };

        localStorage.setItem(SAVES_STORAGE_KEY, JSON.stringify(allSaves));
        SaveAudio.saveChime();
        showSaveIndicator('success', 'MOMENTO SALVO COM SUCESSO! 💾', summary || dateStr);
      } catch (err) {
        showSaveIndicator('warn', 'NÃO FOI POSSÍVEL SALVAR ⚠️', 'Armazenamento cheio ou desativado.');
      }
    }
  }

  // Load Game Progress / Snapshot
  function doQuickLoad() {
    if (!currentGameId) return;
    SaveAudio.init();

    const userKey = getCurrentUserKey();
    let saveEntry = null;

    try {
      const allSaves = JSON.parse(localStorage.getItem(SAVES_STORAGE_KEY) || '{}');
      if (allSaves[userKey] && allSaves[userKey][currentGameId]) {
        saveEntry = allSaves[userKey][currentGameId];
      } else if (allSaves['visitante'] && allSaves['visitante'][currentGameId]) {
        saveEntry = allSaves['visitante'][currentGameId];
      }
    } catch(e) {}

    if (!saveEntry) {
      showSaveIndicator('warn', 'NENHUM SAVE ENCONTRADO ⚠️', 'Aperte F5 ou Salvar para registrar seu ponto de parada.');
      return;
    }

    showSaveIndicator('loading', 'CARREGANDO DO MEMORY CARD...', saveEntry.summary || 'Restaurando momento salvo');

    const frame = document.getElementById('game-frame') || document.querySelector('iframe');
    if (frame && frame.contentWindow && saveEntry.snapshot) {
      frame.contentWindow.postMessage({ type: 'FRIV_LOAD_DATA', data: saveEntry.snapshot }, '*');
      setTimeout(() => {
        SaveAudio.loadChime();
        showSaveIndicator('success', 'MOMENTO RESTAURADO COM SUCESSO! ⚡', saveEntry.summary || 'Save aplicado');
      }, 400);
    } else {
      setTimeout(() => {
        SaveAudio.loadChime();
        showSaveIndicator('success', 'SAVE CARREGADO DO MEMORY CARD! ⚡', saveEntry.summary || 'Progresso pronto');
      }, 400);
    }
  }

  // Keyboard Shortcuts: F5 = Save, F8/F9 = Load
  window.addEventListener('keydown', e => {
    if (e.key === 'F5') {
      e.preventDefault();
      doQuickSave();
    } else if (e.key === 'F8' || e.key === 'F9') {
      e.preventDefault();
      doQuickLoad();
    }
  });

  // Inject Save Bar into Header
  function injectSaveControls() {
    const bar = document.querySelector('.game-bar');
    if (!bar || document.getElementById('game-save-bar')) return;

    const wrap = document.createElement('div');
    wrap.id = 'game-save-bar';
    wrap.className = 'game-save-bar';
    wrap.innerHTML = `
      <button id="btn-save-moment" class="game-bar-btn btn-save" title="Salvar Momento (Atalho: F5)">💾 Salvar</button>
      <button id="btn-load-moment" class="game-bar-btn btn-load" title="Carregar Momento (Atalho: F8)">⚡ Carregar</button>
    `;

    const fsBtn = bar.querySelector('#fullscreen') || bar.lastElementChild;
    bar.insertBefore(wrap, fsBtn);

    document.getElementById('btn-save-moment').addEventListener('click', doQuickSave);
    document.getElementById('btn-load-moment').addEventListener('click', doQuickLoad);

    // Auto-load if navigated with ?load_save=true
    if (location.search.includes('load_save=true')) {
      const frame = document.getElementById('game-frame') || document.querySelector('iframe');
      let loaded = false;
      function tryAutoLoad() {
        if (loaded) return;
        loaded = true;
        setTimeout(doQuickLoad, 400);
      }
      window.addEventListener('message', e => {
        if (e.data && e.data.type === 'FRIV_GAME_READY') {
          tryAutoLoad();
        }
      });
      if (frame) {
        frame.addEventListener('load', tryAutoLoad);
      }
      setTimeout(tryAutoLoad, 1200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSaveControls);
  } else {
    injectSaveControls();
  }

  /* ── Inject Skyscraper Side Ads (160x600) ── */
  function injectSkyscraperAds() {
    if (window.innerWidth < 1280) return;
    const frame = document.getElementById('game-frame') || document.querySelector('.game-main iframe');
    if (!frame || frame.closest('.game-play-area')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'game-play-area';

    const rootPath = location.pathname.includes('/games/') ? '../../' : './';
    const adUrl = rootPath + 'assets/ads/banner-160x600.html';

    const leftAside = document.createElement('aside');
    leftAside.className = 'game-ad-skyscraper left';
    leftAside.setAttribute('aria-label', 'Publicidade Lateral');
    const leftFrame = document.createElement('iframe');
    leftFrame.src = adUrl;
    leftFrame.width = "160";
    leftFrame.height = "600";
    leftFrame.setAttribute('frameborder', '0');
    leftFrame.setAttribute('scrolling', 'no');
    leftAside.appendChild(leftFrame);

    const rightAside = document.createElement('aside');
    rightAside.className = 'game-ad-skyscraper right';
    rightAside.setAttribute('aria-label', 'Publicidade Lateral');
    const rightFrame = document.createElement('iframe');
    rightFrame.src = adUrl;
    rightFrame.width = "160";
    rightFrame.height = "600";
    rightFrame.setAttribute('frameborder', '0');
    rightFrame.setAttribute('scrolling', 'no');
    rightAside.appendChild(rightFrame);

    frame.parentNode.insertBefore(wrapper, frame);
    wrapper.appendChild(leftAside);
    wrapper.appendChild(frame);
    wrapper.appendChild(rightAside);

    // Refresh side ads every 15 minutes
    setInterval(() => {
      try {
        leftFrame.src = adUrl + '?t=' + Date.now();
        rightFrame.src = adUrl + '?t=' + Date.now();
      } catch (_) {}
    }, 15 * 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSkyscraperAds);
  } else {
    injectSkyscraperAds();
  }
})();
