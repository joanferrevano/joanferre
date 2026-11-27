/* ══════════════════════════════════════════════════════════════
   marfil.js — Interacciones mínimas del sistema «Marfil»
   1. Año del pie.
   2. Revelado suave al hacer scroll (solo mejora; sin JS todo se ve).
   3. Vídeos bajo demanda: el reproductor solo se carga al pulsar.
   4. Formulario de contacto (Formspree + antispam, lógica conservada).
   5. Tema claro / oscuro.
   6. Copiar correo.
   7. Hora local en el pie.
   8. Filas escalonadas y cita por palabras.
   9. Título compartido en la transición entre páginas.
   Los controles de 5 a 7 se crean aquí: sin JS no hay botones muertos.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Señal para el aviso de seguridad de la cabecera (si este script falla,
     el CSS muestra igualmente todo el contenido pasados 3 s). */
  document.documentElement.setAttribute('data-ready', '1');

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Año del pie ─────────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ── 2. Revelado al hacer scroll ────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ── 3. Vídeos bajo demanda ─────────────────────────────────── */
  /* Marcado esperado (ver video.html / preview-dev):
     <a class="video-facade" href="https://www.youtube.com/watch?v=ID"
        data-video-id="ID" data-title="Título">…</a>
     Sin JS el enlace abre YouTube. Con JS se inserta el reproductor
     (youtube-nocookie) en el mismo escenario, respetando su proporción. */
  document.querySelectorAll('.video-facade[data-video-id]').forEach(function (facade) {
    var id = facade.getAttribute('data-video-id') || '';
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) return;

    facade.setAttribute('role', 'button');

    function load(e) {
      if (e) e.preventDefault();
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
      frame.title = facade.getAttribute('data-title') || 'Vídeo';
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      facade.parentNode.replaceChild(frame, facade);
      frame.focus();
    }

    facade.addEventListener('click', load);
    facade.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Spacebar') load(e);   /* Enter ya activa el enlace */
    });
  });

  /* ── 4. Formulario de contacto ──────────────────────────────── */
  var form  = document.getElementById('contact-form');
  var aviso = document.getElementById('form-aviso');

  if (form && aviso) {
    /* Configuración antispam (valores originales) */
    var COOLDOWN_MS       = 90  * 1000;
    var BLOCK_COUNT       = 3;
    var BLOCK_WINDOW_MS   = 2   * 60 * 1000;
    var BLOCK_DURATION_MS = 15  * 60 * 1000;
    var BTN_COOLDOWN_S    = 60;
    var TURNSTILE_ENABLED = false;
    var FORM_ENDPOINT     = 'https://formspree.io/f/xvzyeobb';

    var LS_LAST  = 'jfv_form_last';
    var LS_TIMES = 'jfv_form_times';
    var LS_BLOCK = 'jfv_form_block';

    function lsGet(k)    { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function lsSet(k, v) { try { localStorage.setItem(k, v); }     catch (e) {} }
    function getTimes() {
      try { return JSON.parse(lsGet(LS_TIMES) || '[]'); } catch (e) { return []; }
    }
    function isBlocked() { return Date.now() < parseInt(lsGet(LS_BLOCK) || '0', 10); }
    function blockRemainSecs() {
      return Math.ceil((parseInt(lsGet(LS_BLOCK) || '0', 10) - Date.now()) / 1000);
    }
    function cooldownRemainSecs() {
      var last = parseInt(lsGet(LS_LAST) || '0', 10);
      return Math.max(0, Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 1000));
    }
    function recordSubmit() {
      var now   = Date.now();
      var times = getTimes().filter(function (t) { return now - t < BLOCK_WINDOW_MS; });
      times.push(now);
      lsSet(LS_LAST,  now);
      lsSet(LS_TIMES, JSON.stringify(times));
      if (times.length >= BLOCK_COUNT) lsSet(LS_BLOCK, now + BLOCK_DURATION_MS);
    }

    function startBtnCooldown(btn, secs) {
      btn.disabled = true;
      btn.textContent = 'Espera ' + secs + 's…';
      var t = setInterval(function () {
        secs--;
        if (secs <= 0) {
          clearInterval(t);
          btn.disabled = false;
          btn.textContent = 'Enviar mensaje';
        } else {
          btn.textContent = 'Espera ' + secs + 's…';
        }
      }, 1000);
    }

    var FIELDS = ['nombre', 'email', 'asunto', 'mensaje'];

    function clearInvalid(field) {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
    FIELDS.forEach(function (id) {
      var field = form.querySelector('#' + id);
      if (field) field.addEventListener('input', function () { clearInvalid(field); });
    });

    /* Devuelve null o { msg, field }: el campo que hay que corregir */
    function validateFields() {
      var nombre  = ((form.querySelector('#nombre')  || {}).value || '').trim();
      var email   = ((form.querySelector('#email')   || {}).value || '').trim();
      var asunto  = ((form.querySelector('#asunto')  || {}).value || '').trim();
      var mensaje = ((form.querySelector('#mensaje') || {}).value || '').trim();

      if (!nombre || !email || !asunto || !mensaje)
        return { msg: 'Completa todos los campos obligatorios.',
                 field: FIELDS[[nombre, email, asunto, mensaje].indexOf('')] };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { msg: 'El email no tiene un formato válido.', field: 'email' };
      if (nombre.length < 2)
        return { msg: 'El nombre es demasiado corto.', field: 'nombre' };
      if (mensaje.length < 10)
        return { msg: 'El mensaje es demasiado corto (mín. 10 caracteres).', field: 'mensaje' };
      return null;
    }

    /* Los avisos usan clases (is-error / is-warn / is-ok) en vez de colores
       en línea, para mantener el contraste sobre el fondo marfil. */
    function setAviso(msg, kind) {
      aviso.className = 'form__aviso';
      void aviso.offsetWidth;   /* reinicia la entrada si se repite el aviso */
      aviso.textContent = msg;
      aviso.className = 'form__aviso' + (kind ? ' is-' + kind : '');
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn = document.getElementById('form-submit-btn');

      /* 1 · Honeypot */
      var hp = form.querySelector('[name="website"]');
      if (hp && hp.value !== '') {
        setAviso('Mensaje enviado. Te respondo pronto.', 'ok');
        form.reset();
        return;
      }

      /* 2 · Bloqueo por ráfaga */
      if (isBlocked()) {
        var mins = Math.ceil(blockRemainSecs() / 60);
        setAviso('Demasiados envíos. Espera ' + mins + ' min.', 'error');
        return;
      }

      /* 3 · Cooldown entre envíos */
      var wait = cooldownRemainSecs();
      if (wait > 0) {
        setAviso('Espera ' + wait + 's antes del próximo envío.', 'warn');
        return;
      }

      /* 4 · Validación */
      FIELDS.forEach(function (id) {
        var field = form.querySelector('#' + id);
        if (field) clearInvalid(field);
      });
      var err = validateFields();
      if (err) {
        setAviso(err.msg, 'error');
        var bad = form.querySelector('#' + err.field);
        if (bad) {
          bad.setAttribute('aria-invalid', 'true');
          bad.setAttribute('aria-describedby', 'form-aviso');
          bad.focus();
        }
        return;
      }

      /* 5 · Turnstile (desactivado, como en la versión original) */
      if (TURNSTILE_ENABLED) {
        var token = form.querySelector('[name="cf-turnstile-response"]');
        if (!token || !token.value) {
          setAviso('Completa el captcha antes de enviar.', 'error');
          return;
        }
      }

      /* 6 · Envío a Formspree */
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
      setAviso('', '');

      try {
        var res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (res.ok) {
          recordSubmit();
          setAviso('Mensaje enviado. Te respondo pronto.', 'ok');
          form.reset();
          if (TURNSTILE_ENABLED && window.turnstile) window.turnstile.reset();
          if (btn) {
            btn.textContent = 'Enviado ✓';
            setTimeout(function () { startBtnCooldown(btn, BTN_COOLDOWN_S); }, 1600);
          }
        } else {
          throw new Error('HTTP ' + res.status);
        }
      } catch (fetchErr) {
        setAviso('Error al enviar. Escríbeme directamente al email.', 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Enviar mensaje'; }
      }
    });
  }

  /* ── 5. Tema claro / oscuro ─────────────────────────────────── */
  /* Sin elección guardada se sigue al sistema. El script del <head>
     aplica la elección antes de pintar, para evitar destellos. */
  var THEME_KEY = 'jfv_theme';
  var root = document.documentElement;
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var themeBtn = null;

  function storedTheme() {
    try {
      var t = localStorage.getItem(THEME_KEY);
      return t === 'light' || t === 'dark' ? t : null;
    } catch (e) { return null; }
  }
  function systemTheme() { return darkQuery && darkQuery.matches ? 'dark' : 'light'; }
  function currentTheme() { return root.getAttribute('data-theme') || systemTheme(); }

  /* Refleja el tema vigente en el botón y en la barra del navegador */
  function syncTheme() {
    var dark = currentTheme() === 'dark';
    if (themeBtn) themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    var meta = document.querySelector('meta[name="theme-color"]');
    var bg = getComputedStyle(root).getPropertyValue('--ivory').trim();
    if (meta && bg) meta.setAttribute('content', bg);
  }

  function applyStoredTheme() {
    var t = storedTheme();
    if (t) root.setAttribute('data-theme', t);
    else root.removeAttribute('data-theme');
    syncTheme();
  }

  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';

    function apply() {
      root.classList.add('theme-switching');
      /* Si coincide con el sistema no se guarda nada: se vuelve a seguirlo */
      if (next === systemTheme()) {
        root.removeAttribute('data-theme');
        try { localStorage.removeItem(THEME_KEY); } catch (e) {}
      } else {
        root.setAttribute('data-theme', next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      }
      syncTheme();   /* fuerza el recálculo de estilos antes de quitar la clase */
      requestAnimationFrame(function () { root.classList.remove('theme-switching'); });
    }

    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !calm) document.startViewTransition(apply);
    else apply();
  }

  var headerInner = document.querySelector('.site-header__inner');
  if (headerInner) {
    themeBtn = document.createElement('button');
    themeBtn.type = 'button';
    themeBtn.className = 'theme-toggle';
    themeBtn.setAttribute('aria-label', 'Modo oscuro');
    themeBtn.title = 'Modo oscuro';
    themeBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">' +
      '<circle cx="9" cy="9" r="7.25" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M9 1.75a7.25 7.25 0 0 1 0 14.5z" fill="currentColor"/></svg>';
    themeBtn.addEventListener('click', toggleTheme);
    headerInner.appendChild(themeBtn);
  }

  syncTheme();
  if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener('change', syncTheme);
  /* Otra pestaña, o volver con «atrás» a una página guardada en caché */
  window.addEventListener('storage', function (e) { if (e.key === THEME_KEY) applyStoredTheme(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) applyStoredTheme(); });

  /* ── 6. Copiar correo ───────────────────────────────────────── */
  var announcer = document.createElement('p');
  announcer.className = 'sr-only';
  announcer.setAttribute('role', 'status');
  document.body.appendChild(announcer);

  /* Método antiguo, para navegadores sin API de portapapeles o sin permiso */
  function copyFallback(text) {
    return new Promise(function (resolve, reject) {
      var previous = document.activeElement;
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.className = 'sr-only';
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(area);
      if (previous && previous.focus) previous.focus({ preventScroll: true });
      if (ok) resolve(); else reject(new Error('copy'));
    });
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return copyFallback(text); });
    }
    return copyFallback(text);
  }

  document.querySelectorAll('.site-footer__mail, .contact-mail').forEach(function (link) {
    var email = (link.getAttribute('href') || '').replace(/^mailto:/, '');
    if (!email) return;

    var box = document.createElement('div');
    box.className = 'mail-copy';
    link.parentNode.insertBefore(box, link);
    box.appendChild(link);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.setAttribute('data-state', 'idle');
    btn.innerHTML =
      '<span class="copy-btn__state copy-btn__state--idle">Copiar correo</span>' +
      '<span class="copy-btn__state copy-btn__state--ok">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path d="M2.5 8.5l3.5 3.5 7.5-8"/></svg>Copiado</span>' +
      '<span class="copy-btn__state copy-btn__state--error">No se pudo copiar</span>';
    box.appendChild(btn);

    var timer;
    function show(state, message) {
      btn.setAttribute('data-state', state);
      announcer.textContent = message;
      clearTimeout(timer);
      timer = setTimeout(function () {
        btn.setAttribute('data-state', 'idle');
        announcer.textContent = '';
      }, 2400);
    }

    btn.addEventListener('click', function () {
      copyText(email).then(
        function () { show('ok', 'Correo copiado'); },
        function () { show('error', 'No se pudo copiar el correo. Selecciónalo a mano.'); }
      );
    });
  });

  /* ── 7. Hora local en el pie ────────────────────────────────── */
  var footBottom = document.querySelector('.site-footer__bottom');
  var clockFormat = null;
  try {
    clockFormat = new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
  } catch (e) {}   /* sin soporte de zonas horarias no se muestra nada */

  if (footBottom && clockFormat) {
    var clock = document.createElement('span');
    footBottom.insertBefore(clock, footBottom.children[1] || null);
    var clockTimer;
    var tick = function () {
      clock.textContent = 'Banyeres de Mariola, ' + clockFormat.format(new Date());
      clearTimeout(clockTimer);
      clockTimer = setTimeout(tick, 60000 - (Date.now() % 60000) + 50);   /* al cambiar de minuto */
    };
    tick();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
  }

  /* ── 8. Filas escalonadas y cita por palabras ───────────────── */
  var canObserve = !reducedMotion && 'IntersectionObserver' in window;
  var items = document.querySelectorAll('.stagger > *');
  var quote = document.querySelector('.quote');

  if (!canObserve) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    /* el turno cuenta solo los elementos que entran a la vez */
    var rowObserver = new IntersectionObserver(function (entries) {
      var turn = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty('--i', turn++);
        entry.target.classList.add('is-in');
        rowObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { rowObserver.observe(el); });

    if (quote) {
      var words = quote.textContent.trim().split(/\s+/);
      quote.textContent = '';
      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = 'quote__word';
        span.style.setProperty('--i', i);
        span.textContent = word;
        if (i) quote.appendChild(document.createTextNode(' '));
        quote.appendChild(span);
      });
      var quoteObserver = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        quote.classList.add('is-in');
        quoteObserver.disconnect();
      }, { threshold: 0.4 });
      quoteObserver.observe(quote);
    }
  }

  /* ── 9. Título compartido entre páginas ─────────────────────── */
  /* Al pulsar un acceso con [data-vt-title="destino"], ese nombre viaja
     hasta el <h1> de la página nueva (la recibe el script del <head>). */
  var clicked = null;
  var traveling = null;
  function releaseTitle() {
    if (traveling) traveling.style.viewTransitionName = '';
    traveling = null;
  }
  document.addEventListener('click', function (e) {
    clicked = e.target.closest ? e.target.closest('a[href]') : null;
  });
  window.addEventListener('pageswap', function (e) {
    if (!e.viewTransition || !clicked || !e.activation || !e.activation.entry) return;
    if (e.activation.entry.url !== clicked.href) return;
    var box = clicked.closest('.area, .feature');
    var title = box && box.querySelector('[data-vt-title]');
    if (!title || title.getAttribute('data-vt-title') !== clicked.getAttribute('href')) return;
    traveling = title;
    title.style.viewTransitionName = 'page-title';
    try { sessionStorage.setItem('jfv_vt', '1'); } catch (err) {}
  });
  window.addEventListener('pageshow', releaseTitle);
})();
