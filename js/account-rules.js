/* Shared validation for accounts and the Pages API. */
(() => {
  'use strict';
  const clean = value => typeof value === 'string' ? value.normalize('NFKC').trim().replace(/\s+/g, ' ') : '';
  function nickname(value) {
    const nick = clean(value);
    if (!/^[\p{L}\p{N}_. -]{2,20}$/u.test(nick)) return { ok: false, message: 'Use 2 a 20 letras, números, espaços, ponto, hífen ou sublinhado.' };
    const folded = nick.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[013457@]/g, c => ({0:'o',1:'i',3:'e',4:'a',5:'s',7:'t','@':'a'}[c]));
    const blocked = /^(?:caralho|porra|puta|puto|buceta|foder|viado|nazista)$/;
    if (folded.split(/[ ._-]+/).some(word => blocked.test(word)) || blocked.test(folded.replace(/[ ._-]/g, ''))) return { ok: false, message: 'Escolha um nome sem palavras ofensivas.' };
    return { ok: true, nick, key: nick.toLocaleLowerCase('pt-BR') };
  }
  const avatar = value => typeof value === 'string' && value.length <= 60000 && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value) ? value : null;
  // Monday 00:00 in Sao Paulo, independent of the visitor's clock/timezone.
  function weekStart(now = Date.now()) {
    const offset = 3 * 3600000, date = new Date(now - offset);
    date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
    date.setUTCHours(0, 0, 0, 0);
    return date.getTime() + offset;
  }
  globalThis.FrivAccountRules = { nickname, avatar, weekStart, maxScore: 3000 };
})();
