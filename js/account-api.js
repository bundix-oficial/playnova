/* The API stays on the site's own origin. No keys or passwords are stored here. */
(() => {
  'use strict';
  const root = new URL('../', document.currentScript.src);
  let statusPromise;
  async function request(path, body, method) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(new URL('api/' + path, root), {
        method: method || (body === undefined ? 'GET' : 'POST'),
        credentials: 'same-origin', cache: 'no-store', signal: controller.signal,
        headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw Object.assign(new Error(data.error || 'Serviço indisponível. Tente novamente.'), { status: response.status });
      return data;
    } finally { clearTimeout(timer); }
  }
  function status(refresh = false) {
    if (refresh) statusPromise = null;
    return statusPromise ||= request('status').then(x => ({ online: x.ready === true })).catch(() => ({ online: false }));
  }
  window.FrivAccountAPI = { request, status };
})();
