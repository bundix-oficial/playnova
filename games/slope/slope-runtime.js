// Register the existing local Unity framework without executing a blob: script.
// The site's CSP intentionally does not permit blob: in script-src.
(function () {
  'use strict';

  var container = document.getElementById('gameContainer');
  var error = document.getElementById('slope-error');

  function fail(message) {
    container.dataset.ready = 'false';
    error.textContent = message;
    error.hidden = false;
  }

  /* =========================================================
     SLOPE AUTOMATIC SCORE DETECTOR & DISPATCHER
     ========================================================= */
  var bestReportedScore = 0;

  function notifyParentScore(score) {
    score = parseInt(score, 10);
    if (!score || isNaN(score) || score <= 0 || score > 99999) return;
    if (score <= bestReportedScore) return; // avoid duplicate notifications
    bestReportedScore = score;
    try {
      window.parent.postMessage({ type: 'SLOPE_SCORE', score: score }, '*');
      console.log('[FRIV DIGITAL] Score do Slope capturado automaticamente:', score);
    } catch (e) {}
  }

  // 1. Intercepta requisições HTTP do Unity (ID.net / Playtomic / APIs)
  try {
    var origXhrOpen = XMLHttpRequest.prototype.open;
    var origXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
      this._slopeUrl = url;
      this._slopeMethod = method;
      return origXhrOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
      try {
        if (body) {
          var str = '';
          if (typeof body === 'string') {
            str = body;
          } else if (body instanceof ArrayBuffer || (body && body.buffer instanceof ArrayBuffer)) {
            var u8 = body instanceof Uint8Array ? body : new Uint8Array(body.buffer || body);
            str = new TextDecoder('utf-8').decode(u8);
          }
          if (str) {
            var m = str.match(/["']?(?:score|points|value|highscore)["']?\s*[:=]\s*["']?(\d+)["']?/i);
            if (m) notifyParentScore(m[1]);
          }
        }
        if (this._slopeUrl) {
          var urlMatch = this._slopeUrl.match(/[?&](?:score|points|value|highscore)=(\d+)/i);
          if (urlMatch) notifyParentScore(urlMatch[1]);
        }
      } catch (err) {}
      return origXhrSend.apply(this, arguments);
    };
  } catch (e) {}

  // 2. Intercepta PlayerPrefs salvos no Virtual File System (FS / IndexedDB)
  var slopeFS = null;
  function scanFSPrefs(fs) {
    if (!fs) return;
    try {
      function walk(dir) {
        var items = fs.readdir(dir);
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item === '.' || item === '..') continue;
          var full = (dir === '/' ? '' : dir) + '/' + item;
          try {
            var stat = fs.stat(full);
            if (fs.isDir(stat.mode)) {
              walk(full);
            } else {
              var bytes = fs.readFile(full);
              if (bytes && bytes.length > 0) {
                var str = new TextDecoder('utf-8').decode(bytes);
                // Procura tags de PlayerPrefs: <pref name="HighScore" type="int">123</pref>
                var m = str.match(/name="[^"]*(?:score|high|points|best)[^"]*"[^>]*>(\d+)</i);
                if (m) notifyParentScore(m[1]);
                var m2 = str.match(/(?:HighScore|LastScore|CurrentScore|Total\s*Score|points)[^\d]*(\d+)/i);
                if (m2) notifyParentScore(m2[1]);
              }
            }
          } catch (err) {}
        }
      }
      walk('/idbfs');
    } catch (e) {}
  }

  // 3. Stubs de ID.net / Ads para capturar no Game Over
  window.IDNet = {
    init: function () {},
    submit_score: function (d) {
      var s = typeof d === 'object' ? (d.score || d.points || d.value) : d;
      notifyParentScore(s);
    },
    sendScore: function (s) { notifyParentScore(s); }
  };
  window.ShowAd = function () { if (slopeFS) scanFSPrefs(slopeFS); };
  window.LoadAd = function () { if (slopeFS) scanFSPrefs(slopeFS); };

  // Varredura periódica a cada 2.5s para capturar o score assim que a partida terminar
  setInterval(function () {
    if (slopeFS) scanFSPrefs(slopeFS);
  }, 2500);

  if (!window.UnityLoader || typeof UnityLoader.playnovaSlopeFramework !== 'function') {
    fail('Não foi possível carregar os arquivos do Slope. Atualize a página para tentar novamente.');
    return;
  }

  UnityLoader.processWasmFrameworkJob = function (module, job) {
    UnityLoader.playnovaSlopeFramework(module);
    job.complete();

    // Vincula o Virtual File System (FS)
    try {
      if (module.FS) {
        slopeFS = module.FS;
        if (module.FS.syncfs) {
          var origSyncfs = module.FS.syncfs;
          module.FS.syncfs = function (populate, callback) {
            if (!populate) {
              // Salvando dados da partida para o IndexedDB
              setTimeout(function () {
                scanFSPrefs(module.FS);
              }, 60);
            }
            return origSyncfs.apply(this, arguments);
          };
        }
      }
    } catch (e) {}
  };

  window.gameInstance = UnityLoader.instantiate('gameContainer', 'build/slope.json', {
    onProgress: function (instance, progress) {
      if (progress === 1) container.dataset.ready = 'true';
    },
    onError: function (message) {
      fail('O Slope não conseguiu iniciar: ' + message);
    }
  });
})();
