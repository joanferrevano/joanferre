/* ══════════════════════════════════════════════════════════════
   marfil.js — Interacciones mínimas del sistema «Marfil»
   1. Año del pie.
   2. Revelado suave al hacer scroll (solo mejora; sin JS todo se ve).
   3. Vídeos bajo demanda: el reproductor solo se carga al pulsar.
   4. Formulario de contacto (Formspree + antispam, lógica conservada).
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

    function validateFields() {
      var nombre  = ((form.querySelector('#nombre')  || {}).value || '').trim();
      var email   = ((form.querySelector('#email')   || {}).value || '').trim();
      var asunto  = ((form.querySelector('#asunto')  || {}).value || '').trim();
      var mensaje = ((form.querySelector('#mensaje') || {}).value || '').trim();

      if (!nombre || !email || !asunto || !mensaje)
        return 'Completa todos los campos obligatorios.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return 'El email no tiene un formato válido.';
      if (nombre.length < 2)
        return 'El nombre es demasiado corto.';
      if (mensaje.length < 10)
        return 'El mensaje es demasiado corto (mín. 10 caracteres).';
      return null;
    }

    /* Los avisos usan clases (is-error / is-warn / is-ok) en vez de colores
       en línea, para mantener el contraste sobre el fondo marfil. */
    function setAviso(msg, kind) {
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
      var err = validateFields();
      if (err) { setAviso(err, 'error'); return; }

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
          if (btn) startBtnCooldown(btn, BTN_COOLDOWN_S);
        } else {
          throw new Error('HTTP ' + res.status);
        }
      } catch (fetchErr) {
        setAviso('Error al enviar. Escríbeme directamente al email.', 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Enviar mensaje'; }
      }
    });
  }
})();
