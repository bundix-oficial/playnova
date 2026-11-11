/* Portal preferences only. This does not grant or enforce consent for external game providers. */
(() => {
  'use strict';
  const root = new URL('../', document.currentScript.src);
  const COOKIE = 'pn_cookie_consent';
  const VERSION = 'v1';
  const duration = 180 * 24 * 60 * 60;
  const valid = value => /^v1:(essential|all)$/.test(value);
  const make = (tag, attrs = {}, text) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function current() {
    try {
      const value = decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) || '');
      if (valid(value)) return value;
    } catch { /* Storage may be blocked. */ }
    try {
      const stored = JSON.parse(localStorage.getItem(COOKIE));
      if (stored?.expires > Date.now() && valid(stored.value)) return stored.value;
    } catch { /* Corrupt or expired preferences must not hide the notice. */ }
    return '';
  }
  function save(choice) {
    const value = `${VERSION}:${choice}`;
    try { document.cookie = `${COOKIE}=${encodeURIComponent(value)}; Path=${root.pathname}; Max-Age=${duration}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`; } catch {}
    try { localStorage.setItem(COOKIE, JSON.stringify({ value, expires: Date.now() + duration * 1000 })); } catch {}
  }
  let opener;
  function openSettings() {
    const dialog = document.getElementById('cookie-settings');
    if (!dialog || dialog.open) return;
    opener = document.activeElement;
    dialog.showModal();
  }
  function finish(choice) {
    save(choice);
    document.getElementById('cookie-banner')?.remove();
    document.getElementById('cookie-settings')?.close();
  }
  function reset() {
    for (const path of new Set([root.pathname, '/'])) {
      try { document.cookie = `${COOKIE}=; Path=${path}; Max-Age=0; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`; } catch {}
    }
    try { localStorage.removeItem(COOKIE); } catch {}
    location.reload();
  }
  function setup() {
    const dialog = make('dialog', { id: 'cookie-settings', class: 'cookie-dialog', 'aria-labelledby': 'cookie-settings-title' });
    const close = make('button', { type: 'button', class: 'cookie-close', 'aria-label': 'Fechar configurações' }, '×');
    close.onclick = () => dialog.close();
    dialog.addEventListener('close', () => { if (opener?.isConnected) opener.focus(); });
    dialog.append(close, make('h2', { id: 'cookie-settings-title' }, 'Configurar cookies'), make('p', {}, 'O portal guarda esta preferência, favoritos, listas e histórico neste navegador. Há anúncios de terceiros para monetização. Esta configuração controla somente o aviso do portal; não controla os cookies dos anunciantes. Contas online usam um cookie de sessão.'));
    const row = make('label', { class: 'cookie-option' });
    row.append(make('input', { type: 'checkbox', checked: 'checked', disabled: 'disabled' }), make('span', {}, 'Essencial — lembrar esta preferência'));
    const saveButton = make('button', { type: 'button', class: 'cookie-button primary' }, 'Salvar preferência');
    saveButton.onclick = () => finish('essential');
    dialog.append(row, saveButton);
    document.body.append(dialog);
    document.getElementById('reset-cookie-preference')?.addEventListener('click', reset);
    const links = make('nav', { class: 'pn-cookie-links', 'aria-label': 'Privacidade e condições de uso' });
    const settings = make('button', { type: 'button' }, 'Configurar cookies'); settings.onclick = openSettings;
    links.append(make('a', { href: new URL('privacy.html', root).href }, 'Privacidade'), make('a', { href: new URL('terms.html', root).href }, 'Termos'), settings);
    document.body.append(links);
    if (current()) return;
    const banner = make('section', { id: 'cookie-banner', class: 'cookie-banner', role: 'region', 'aria-labelledby': 'cookie-title' });
    const copy = make('div', { class: 'cookie-copy' });
    const text = make('p');
    text.append(document.createTextNode('Usamos armazenamento local, sessão de conta e anúncios de terceiros. Este botão registra a leitura do aviso. '), make('a', { href: new URL('privacy.html', root).href }, 'Privacidade'));
    copy.append(make('h2', { id: 'cookie-title' }, 'Cookies e privacidade'), text);
    const actions = make('div', { class: 'cookie-actions' });
    const configure = make('button', { type: 'button', class: 'cookie-button secondary' }, 'Configurar'); configure.onclick = openSettings;
    const essential = make('button', { id: 'cookie-ack', type: 'button', class: 'cookie-button primary' }, 'Entendi'); essential.onclick = () => finish('essential');
    actions.append(configure, essential);banner.append(copy, actions);document.body.append(banner);
  }
  window.PlaynovaCookieConsent = { openSettings, reset };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true }); else setup();
})();
