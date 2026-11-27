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
   10. Línea de tiempo de la página.
   11. Paleta de comandos.
   12. Demo «cortar silencios».
   13. Consola y código Konami.
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
      /* con un <dialog> modal abierto, lo de fuera no se puede seleccionar */
      var host = document.querySelector('dialog[open]') || document.body;
      host.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      host.removeChild(area);
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

  /* ── 10. Línea de tiempo de la página ───────────────────────── */
  /* Un «clip» por cada <section data-clip>, con ancho proporcional a su altura. */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[data-clip]'));
  var header = document.querySelector('.site-header');

  if (header && sections.length > 1) {
    var timeline = document.createElement('nav');
    timeline.className = 'timeline';
    timeline.setAttribute('aria-label', 'Secciones de la página');
    timeline.innerHTML =
      '<div class="wrap timeline__inner">' +
        '<span class="timeline__label" aria-hidden="true"></span>' +
        '<div class="timeline__track"><span class="timeline__head" aria-hidden="true"></span></div>' +
        '<span class="timeline__keys" aria-hidden="true">J anterior, L siguiente</span>' +
      '</div>';
    var label = timeline.querySelector('.timeline__label');
    var track = timeline.querySelector('.timeline__track');
    var playhead = timeline.querySelector('.timeline__head');

    var clips = sections.map(function (section) {
      var link = document.createElement('a');
      var name = section.getAttribute('data-clip');
      link.className = 'timeline__clip';
      link.href = '#' + section.id;
      link.title = name;
      link.setAttribute('aria-label', name);
      link.setAttribute('aria-keyshortcuts', 'J L');
      link.innerHTML = '<span class="timeline__bar"><span class="timeline__fill"></span></span>';
      track.insertBefore(link, playhead);
      return { section: section, link: link, fill: link.querySelector('.timeline__fill'), name: name };
    });
    header.parentNode.insertBefore(timeline, header.nextSibling);
    document.documentElement.classList.add('has-timeline');

    var current = 0;
    var frameRequested = false;
    var clamp = function (n) { return Math.max(0, Math.min(1, n)); };

    var update = function () {
      frameRequested = false;
      var doc = document.documentElement;
      var view = window.innerHeight;
      var max = doc.scrollHeight - view;
      var offset = parseFloat(getComputedStyle(doc).scrollPaddingTop) || 0;
      /* La línea de lectura está bajo la cabecera; en la última pantalla
         baja hasta el borde para que las secciones finales se completen. */
      var tail = clamp(1 - (max - window.pageYOffset) / view);
      var line = offset + 2 + tail * (view - offset);
      var trackBox = track.getBoundingClientRect();
      var headX = 0;
      current = -1;

      clips.forEach(function (clip, i) {
        var box = clip.section.getBoundingClientRect();
        var done = clamp((line - box.top) / box.height);
        clip.fill.style.transform = 'scaleX(' + done + ')';
        if (box.top <= line) {
          current = i;
          var linkBox = clip.link.getBoundingClientRect();
          headX = linkBox.left - trackBox.left + linkBox.width * done;
        }
      });
      clips.forEach(function (clip, i) {
        if (i === current) clip.link.setAttribute('aria-current', 'location');
        else clip.link.removeAttribute('aria-current');
      });
      label.textContent = clips[Math.max(0, current)].name;
      playhead.style.transform = 'translateX(' + headX + 'px)';
    };
    var requestUpdate = function () {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(update);
    };
    var measure = function () {
      clips.forEach(function (clip) { clip.link.style.flexGrow = clip.section.offsetHeight; });
      requestUpdate();
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', measure);
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
    measure();

    /* En móvil es solo informativa: sin enlaces pulsables ni enfocables */
    var small = window.matchMedia('(max-width: 640px)');
    var setInert = function () {
      timeline.inert = small.matches;
      if (small.matches) timeline.setAttribute('aria-hidden', 'true');
      else timeline.removeAttribute('aria-hidden');
    };
    setInert();
    if (small.addEventListener) small.addEventListener('change', setInert);

    /* J / L, como en un editor: solo con el foco dentro de la línea de tiempo */
    timeline.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var key = e.key.toLowerCase();
      if (key !== 'j' && key !== 'l') return;
      e.preventDefault();
      var focused = clips.map(function (c) { return c.link; }).indexOf(document.activeElement);
      var next = (focused < 0 ? current : focused) + (key === 'l' ? 1 : -1);
      var clip = clips[Math.max(0, Math.min(clips.length - 1, next))];
      clip.link.click();
      clip.link.focus({ preventScroll: true });   /* tras el salto, que mueve el foco */
    });
  }

  /* ── 11. Paleta de comandos (Ctrl+K / ⌘K) ───────────────────── */
  var palette = document.createElement('dialog');

  if (headerInner && typeof palette.showModal === 'function') {
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || '');
    var shortcut = isMac ? '⌘K' : 'Ctrl+K';

    palette.className = 'palette';
    palette.setAttribute('aria-label', 'Paleta de comandos');
    palette.innerHTML =
      '<div class="palette__top">' +
        '<input class="palette__input" type="text" role="combobox" aria-expanded="true" ' +
          'aria-controls="palette-list" aria-autocomplete="list" aria-label="Buscar una acción" ' +
          'placeholder="Buscar una acción" autocomplete="off" spellcheck="false" />' +
        '<button class="palette__close" type="button">Cerrar</button>' +
      '</div>' +
      '<ul class="palette__list" id="palette-list" role="listbox" aria-label="Acciones"></ul>' +
      '<p class="palette__status" role="status"></p>';
    document.body.appendChild(palette);

    var input = palette.querySelector('.palette__input');
    var list = palette.querySelector('.palette__list');
    var status = palette.querySelector('.palette__status');
    var shown = [];
    var selected = 0;
    var closeTimer;

    /* raíz del sitio según la ruta de este script: 404.html puede mostrarse desde cualquier URL */
    var ownScript = document.querySelector('script[src$="js/marfil.js"]');
    var root = ownScript ? ownScript.src.replace(/js\/marfil\.js$/, '') : '';
    var go = function (url) { return function () { palette.close(); window.location.href = root + url; }; };
    var download = function (url) {
      return function () {
        var link = document.createElement('a');
        link.href = root + url;
        link.download = '';
        palette.close();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    };
    var external = function (url) { return function () { palette.close(); window.open(url, '_blank', 'noopener'); }; };

    var commands = [
      { text: 'Portada', group: 'Ir a', run: go('index.html') },
      { text: 'Programación', group: 'Ir a', run: go('dev.html') },
      { text: 'Edición de vídeo', group: 'Ir a', run: go('video.html') },
      { text: 'BatoiLOGIC', group: 'Ir a', run: go('batoilogic.html') },
      { text: 'Sobre mí', group: 'Ir a', run: go('about.html') },
      { text: 'Contacto', group: 'Ir a', run: go('contact.html') }
    ];
    sections.forEach(function (section) {
      commands.push({ text: section.getAttribute('data-clip'), group: 'En esta página', run: function () {
        palette.close();
        if (window.location.hash === '#' + section.id) section.scrollIntoView();
        else window.location.hash = section.id;
      } });
    });
    var mailLink = document.querySelector('a[href^="mailto:"]');
    var address = mailLink ? mailLink.getAttribute('href').replace(/^mailto:/, '') : 'joanferrecontact@gmail.com';
    commands.push(
      { text: 'Copiar correo', group: 'Acción', run: function () {
        var say = function (message) {
          status.textContent = message;
          clearTimeout(closeTimer);
        };
        copyText(address).then(
          function () { say('Correo copiado'); closeTimer = setTimeout(function () { palette.close(); }, 900); },
          function () { say('No se pudo copiar. El correo es ' + address); }
        );
      } },
      { text: 'Descargar CV', group: 'Acción', run: download('cv/joan-ferre-cv.pdf') },
      { text: 'Cambiar tema claro u oscuro', group: 'Acción', run: function () { palette.close(); toggleTheme(); } },
      { text: 'Abrir GitHub', group: 'Pestaña nueva', run: external('https://github.com/joanferrevano') },
      { text: 'Abrir LinkedIn', group: 'Pestaña nueva', run: external('https://www.linkedin.com/in/joan-ferre-vano') }
    );

    /* sin tildes ni mayúsculas: «edicion» encuentra «Edición» */
    var plain = function (text) {
      text = text.toLowerCase();
      return text.normalize ? text.normalize('NFD').replace(/[̀-ͯ]/g, '') : text;
    };

    var select = function (index) {
      selected = shown.length ? (index + shown.length) % shown.length : 0;
      Array.prototype.forEach.call(list.children, function (item, i) {
        item.setAttribute('aria-selected', i === selected ? 'true' : 'false');
      });
      var active = list.children[selected];
      if (active) {
        input.setAttribute('aria-activedescendant', active.id);
        active.scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    };

    var render = function () {
      var query = plain(input.value.trim());
      shown = commands.filter(function (c) { return plain(c.group + ' ' + c.text).indexOf(query) !== -1; });
      list.textContent = '';
      shown.forEach(function (command, i) {
        var item = document.createElement('li');
        item.className = 'palette__option';
        item.id = 'palette-option-' + i;
        item.setAttribute('role', 'option');
        var text = document.createElement('span');
        text.textContent = command.text;
        var group = document.createElement('span');
        group.className = 'palette__group';
        group.textContent = command.group;
        item.appendChild(text);
        item.appendChild(group);
        item.addEventListener('mousemove', function () { if (selected !== i) select(i); });
        item.addEventListener('click', function () { select(i); command.run(); });
        list.appendChild(item);
      });
      status.textContent = shown.length ? '' : 'No hay acciones con ese nombre.';
      select(0);
    };

    var openPalette = function () {
      if (palette.open) return;
      input.value = '';
      render();
      palette.showModal();
      list.scrollTop = 0;
      input.focus();
    };

    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        select(selected + (e.key === 'ArrowDown' ? 1 : -1));
      } else if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        if (shown[selected] && !e.repeat) shown[selected].run();
      }
    });
    palette.querySelector('.palette__close').addEventListener('click', function () { palette.close(); });
    /* pulsar fuera (en el fondo) cierra */
    palette.addEventListener('click', function (e) { if (e.target === palette) palette.close(); });
    palette.addEventListener('close', function () { clearTimeout(closeTimer); });

    document.addEventListener('keydown', function (e) {
      if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey || e.key.toLowerCase() !== 'k') return;
      e.preventDefault();
      if (palette.open) palette.close();
      else openPalette();
    });

    var paletteBtn = document.createElement('button');
    paletteBtn.type = 'button';
    paletteBtn.className = 'palette-toggle';
    paletteBtn.setAttribute('aria-label', 'Paleta de comandos');
    paletteBtn.setAttribute('aria-haspopup', 'dialog');
    paletteBtn.setAttribute('aria-keyshortcuts', 'Control+K Meta+K');
    paletteBtn.title = 'Paleta de comandos (' + shortcut + ')';
    paletteBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
      '<circle cx="7.75" cy="7.75" r="5.5"/><path d="M12 12l4 4"/></svg>';
    paletteBtn.addEventListener('click', openPalette);
    headerInner.insertBefore(paletteBtn, themeBtn);
  }

  /* ── 12. Demo «cortar silencios» ────────────────────────────── */
  /* Ilustración de lo que hace el script: no procesa ningún vídeo. */
  var demoRow = document.querySelector('[data-demo="silencios"]');
  if (demoRow) {
    /* tramos en % del ancho: [duración, es silencio] */
    var parts = [[20, false], [10, true], [16, false], [12, true], [24, false], [8, true], [10, false]];
    var demo = document.createElement('div');
    demo.className = 'silence';
    demo.innerHTML =
      '<div class="silence__track" aria-hidden="true"></div>' +
      '<div class="silence__controls">' +
        '<button class="btn btn--outline" type="button">Cortar silencios</button>' +
        '<p class="silence__note">Ilustración, no procesa ningún vídeo. El script detecta los silencios ' +
          'con FFmpeg y une los fragmentos restantes.</p>' +
      '</div>' +
      '<p class="sr-only" role="status"></p>';

    var demoTrack = demo.querySelector('.silence__track');
    var start = 0;
    var removed = 0;
    var cuts = 0;
    var seed = 7;
    parts.forEach(function (part) {
      var width = part[0];
      var block = document.createElement('span');
      block.style.left = start + '%';
      block.style.width = width + '%';
      if (part[1]) {
        block.className = 'silence__gap';
        removed += width;
        cuts++;
      } else {
        block.className = 'silence__clip';
        /* translateX en % es relativo al propio clip; 2px separan los cortes */
        var joined = removed ? 'calc(' + (-removed / width * 100) + '% + ' + (cuts * 2) + 'px)' : '0px';
        block.style.setProperty('--shift', joined);
        var bars = '';
        for (var x = 2; x < width * 4 - 2; x += 4) {
          seed = (seed * 37 + 11) % 101;   /* alturas fijas, iguales en cada visita */
          var h = 8 + seed % 30;
          bars += '<rect x="' + x + '" y="' + (20 - h / 2) + '" width="2" height="' + h + '"/>';
        }
        block.innerHTML = '<svg viewBox="0 0 ' + width * 4 + ' 40" preserveAspectRatio="none" fill="currentColor">' + bars + '</svg>';
      }
      demoTrack.appendChild(block);
      start += width;
    });

    var demoBtn = demo.querySelector('button');
    var demoStatus = demo.querySelector('[role="status"]');
    demoBtn.addEventListener('click', function () {
      var cut = demo.classList.toggle('is-cut');
      demoBtn.textContent = cut ? 'Ver el original' : 'Cortar silencios';
      demoStatus.textContent = cut
        ? 'Ilustración: silencios cortados y fragmentos unidos.'
        : 'Ilustración: audio original, con silencios.';
    });
    demoRow.appendChild(demo);
  }

  /* ── 13. Consola y código Konami ────────────────────────────── */
  if (window.console && console.log) {
    console.log('Hola, soy Joan. Si miras la consola, quizá te interese mi GitHub: ' +
      'https://github.com/joanferrevano\n(Y hay algo escondido en el código Konami.)');
  }

  var KONAMI = 'arrowup arrowup arrowdown arrowdown arrowleft arrowright arrowleft arrowright b a';
  var typed = [];
  var montage = null;

  function toggleMontage() {
    if (montage) {
      document.body.removeChild(montage);
      montage = null;
      announcer.textContent = 'Vista de montaje cerrada';
      return;
    }
    montage = document.createElement('div');
    montage.className = 'montage';
    montage.setAttribute('aria-hidden', 'true');
    montage.innerHTML =
      '<div class="wrap"><div class="montage__grid">' + new Array(13).join('<span></span>') + '</div></div>' +
      '<div class="montage__safe"><span>Acción 90 %</span></div>' +
      '<div class="montage__safe montage__safe--title"><span>Título 80 %</span></div>' +
      '<p class="montage__help">Vista de montaje. Esc para cerrar.</p>';
    document.body.appendChild(montage);
    announcer.textContent = 'Vista de montaje: rejilla y márgenes de seguridad. Escape para cerrar.';
  }

  document.addEventListener('keydown', function (e) {
    var target = e.target;
    /* no actuar al escribir ni con la paleta abierta */
    if (document.querySelector('dialog[open]') || e.ctrlKey || e.metaKey || e.altKey ||
        (target.closest && target.closest('input, textarea, select, [contenteditable]'))) {
      typed = [];
      return;
    }
    if (e.key === 'Escape') {
      typed = [];
      if (montage) toggleMontage();
      return;
    }
    if (e.key === 'Shift' || e.repeat) return;
    typed.push(String(e.key).toLowerCase());
    typed = typed.slice(-10);
    if (typed.join(' ') === KONAMI) {
      typed = [];
      toggleMontage();
    }
  });
})();
