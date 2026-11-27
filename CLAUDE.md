# CLAUDE.md — Portfolio de Joan Ferre Vañó

Memoria del proyecto para futuras sesiones de Claude Code. Describe lo que **existe de verdad** en el repositorio (revisado el 24-11-2026). Si el código cambia, actualiza este archivo.

> Aviso: este repositorio se sirve como sitio estático (ver «Hosting»), así que los archivos de la raíz pueden ser accesibles públicamente, igual que `README.md`. Por eso este documento no incluye datos privados ni internos. No añadas nada sensible aquí.

---

## 1. Descripción del proyecto

Portfolio personal de **Joan Ferre Vañó** (Banyeres de Mariola, Alicante). Presenta dos facetas con una identidad común:

- **Programación** (prioridad estratégica: busca mejores oportunidades como programador).
- **Edición de vídeo** (visible y cuidada, sin mostrar trabajo que no exista).

Sitio **100 % estático**: HTML + CSS + JavaScript sin framework, sin bundler, sin `package.json`, sin dependencias. El idioma es el español (`<html lang="es">`); el inglés está previsto para otra fase, no existe aún.

Sistema visual actual: **«Marfil»** (minimalismo cálido). Está **aprobado** por Joan: no se rediseña ni se reabren propuestas creativas sin que lo pida.

### Páginas (secciones públicas)

| Archivo | Papel |
|---|---|
| `index.html` | Portada: presentación, acceso a las dos áreas, proyecto destacado, una línea de contexto profesional, contacto |
| `dev.html` | Área **Programación**: proyecto principal, otros proyectos, stack, experiencia (resumen) |
| `video.html` | Área **Edición de vídeo**: introducción + estructura lista para piezas (hoy **sin piezas publicadas**, ver §13) |
| `batoilogic.html` | Ficha del proyecto BatoiLOGIC (proyecto final del ciclo DAM) |
| `about.html` | **Sobre mí**: cita propia, trayectoria detallada, formación |
| `contact.html` | Contacto: correo, perfiles, formulario (Formspree) |
| `youtube.html` | **Solo redirige a la portada** (conserva la URL antigua). No tiene contenido |

Git: el rediseño Marfil está en el commit `2f480e1`. Tras él hay cambios sin commitear (contenido, contacto, redirección). Consulta siempre `git status` antes de trabajar.

---

## 2. Reglas de trabajo acordadas con Joan (leer primero)

1. **No hacer `git commit`, `git push` ni despliegue sin autorización explícita.** Cada orden de «implementa» se entiende como cambios locales.
2. **No reabrir la dirección creativa.** Marfil está aprobado. Hay que mantener paleta, tipografías, estructura y las pocas interacciones. Solo ajustes de composición necesarios para integrar contenido.
3. **No inventar contenido**: ni proyectos, ni clientes, ni métricas, ni habilidades, ni fechas, ni funciones, ni tecnologías. Solo se publica lo que Joan confirma. Los campos vacíos, textos entre corchetes o placeholders **no se publican**.
4. **No presentar una revisión de código como prueba visual o de ejecución.** Distinguir siempre lo implementado de lo realmente comprobado.
5. **No borrar recursos originales** (imágenes, CSS/JS antiguos, vídeos) sin su aprobación explícita.
6. **No cambiar el stack** ni instalar dependencias sin permiso.
7. No cambiar el destinatario del correo, el endpoint de Formspree ni los identificadores de servicios.
8. Responde en español.

Reglas de contenido ya decididas (aplican a cualquier cambio):

- Enlaces personales y de contacto públicos **solo**: correo, LinkedIn y GitHub. No añadir otras redes sociales ni promocionar canales personales. Siguen permitidos los enlaces técnicos de proyectos (repositorios, organizaciones de GitHub de un proyecto, GitBook, demos).
- YouTube solo puede aparecer como **alojamiento técnico** de un edit incrustado, nunca como promoción de un canal.
- Nombre público de la empresa actual: **«Ondulados del Papel»** (no «de Papel»). No publicar duraciones calculadas («2 meses»); usar periodos con fechas confirmadas.
- No atribuir a Joan en solitario lo hecho en equipo. No decir que un repositorio está actualizado o revisado.
- No dar a entender que lo estudiado en el ciclo es dominio profesional avanzado.
- No cuantificar beneficios de herramientas propias (por ejemplo «ahorra horas») sin confirmación.

---

## 3. Estructura de archivos

```
joanferre/
├── index.html · dev.html · video.html · about.html · contact.html · batoilogic.html
├── youtube.html                  Redirección a index.html (meta refresh + JS)
├── css/
│   ├── marfil.css                ÚNICA hoja de estilos en uso (tokens + componentes)
│   ├── style.css, components.css, pages.css, animations.css   HEREDADO, sin uso
├── js/
│   ├── marfil.js                 ÚNICO script en uso
│   ├── main.js, nav.js           HEREDADO, sin uso
├── fonts/                        Bricolage Grotesque e Inter (woff2) + licencias OFL
├── images/
│   ├── favicon/                  ico, 16, 32, apple-touch-icon, android-chrome 192/512
│   ├── profile.jpg               0 bytes (vacío), no se usa en ninguna página
│   └── thumbnails/               5 PNG de un uso anterior (~7,3 MB), sin uso
├── banner_linkedin/banner_linkedin_joan_v5.html   Generador de banner (1584×396), independiente
├── preview-dev/                  Muestras de desarrollo (IGNORADA por git; ver §14)
├── .review/                      Capturas de revisión local (IGNORADA por git)
├── README.md                     Resumen y cómo añadir una pieza de vídeo
├── CLAUDE.md                     Este archivo
└── .gitignore                    .claude, preview-dev/, .review/
```

Tamaños aproximados: `marfil.css` 730 líneas, `marfil.js` 710, páginas entre 140 y 260 líneas.

---

## 4. Hosting y cómo ejecutarlo

- **Hosting previsto:** GitHub Pages desde la rama `main` (raíz), según `README.md` y el remoto `origin = joanferrevano/joanferre`. No hay `CNAME`, workflows ni `_config.yml`. **No se ha verificado la configuración real de Pages.**
- Como el repositorio se llama `joanferre`, el sitio puede servirse bajo un subdirectorio (`usuario.github.io/joanferre/`). Por eso **todas las rutas son relativas** (sin `/` inicial). Mantenlo así.
- No dependas de URLs sin extensión (`/programacion`): con hosting estático la ruta es `dev.html`, `video.html`, etc.

### Ver en local

- **Sin servidor:** abre `index.html` con doble clic (todo funciona con `file://`, incluido el JS).
- En esta máquina **no hay `node`, `python` ni `gh`**. Sí hay **Microsoft Edge** (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`) y Chrome.
- Capturas headless (sin instalar nada):
  ```bash
  msedge.exe --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=5000 --window-size=1440,2400 \
    --screenshot=C:/ruta/captura.png file:///C:/Users/joan.ferre/Desktop/joanferre/index.html
  ```
- **Móvil:** Edge headless impone un ancho mínimo de ventana (~500 px), así que una captura a `--window-size=390,...` sale recortada. Para probar móvil de verdad, carga la página dentro de un `<iframe width="390">` en una página auxiliar (fuera del proyecto) y ábrela con `--allow-file-access-from-files`; así las media queries responden al ancho del iframe. Con el mismo truco se mide el desbordamiento (`documentElement.scrollWidth` vs `clientWidth`) a 320, 390, 768 y 1440 px.
- Guarda archivos temporales fuera del repo (scratchpad de la sesión). Las capturas de revisión, si se guardan en el proyecto, van a `.review/` (ignorada).

---

## 5. HTML

### Esqueleto común (las 6 páginas activas)

1. `<head>`: `charset`, `viewport`, `<title>`, `meta description`, `theme-color #FAF7F2`, favicons (ico, 32, 16, apple-touch), `<link rel="preload">` de `fonts/bricolage-latin.woff2`, `<link rel="stylesheet" href="css/marfil.css">` y un `<script>` inline que añade la clase `js` a `<html>` (ver §7).
2. `<a class="skip-link" href="#contenido">` (enlace de salto).
3. `<header class="site-header">` con `.wordmark` («Joan Ferre») y `<nav class="nav" aria-label="Principal">` con **Programación · Edición · Sobre mí · Contacto**.
4. `<main id="contenido">` con las secciones.
5. `<footer class="site-footer">`: bloque de contacto («¿Tienes algo en mente?», correo, GitHub, LinkedIn, enlace al formulario) y pie con copyright (`<span data-year>`) y navegación secundaria. En `contact.html` el pie es mínimo (sin el bloque de contacto, con unos pocos `style` inline).
6. `<script src="js/marfil.js"></script>` al final del `<body>`.

La cabecera y el pie están **duplicados a mano** en cada página (no hay plantillas). Cualquier cambio de navegación o contacto se hace en las 6 páginas (y mantén `aria-current` correcto).

### Contenido por página

- **`index.html`:** `.hero` (H1 `.hero__title` «Joan Ferre.» con el punto en `.dot`; `.hero__grid` con la línea «Programador y editor de vídeo.» y, a la derecha, la frase «Cuento historias reales. También las programo.» + localidad) → `.areas` con dos `.area` (Programación, Edición de vídeo) → `.feature` con BatoiLOGIC (resumen) → `.context` (una línea de experiencia actual y la anterior, con enlace a Sobre mí) → footer de contacto. Un comentario HTML marca dónde añadir un segundo destacado cuando haya una pieza de edición real.
- **`dev.html`:** `.page-head` (H1 «Programación») → `.feature` «Proyecto principal» (BatoiLOGIC, enlaces a ficha, memoria GitBook y organización GitHub) → «Otros proyectos» en dos `.group` de `.rows` («Herramientas y aplicaciones»; «Videojuegos y realidad virtual») → `dl.stack` (Lenguajes · Frameworks y plataformas · Datos y despliegue) → «Experiencia» (resumen de 2 filas con enlace a Sobre mí) → puente `.areas` hacia Edición.
- **`video.html`:** `.page-head` (H1 «Edición de vídeo») → un bloque «¿Tienes un proyecto de vídeo?» con botón a `contact.html` → puente `.areas` hacia Programación. **La sección de piezas está comentada** (plantilla completa con el componente `.piece`, lista para descomentar). No hay ningún vídeo publicado.
- **`about.html`:** `.page-head` (H1 «Joan Ferre Vañó») → cita propia (`.quote`) → «Trayectoria» (2 `.row--3`: empresa actual y prácticas anteriores, con datos y funciones) → «Formación» (ciclo superior con detalle y proyecto final enlazado; bachillerato como `.row--minor`; inglés) → `.areas` hacia las dos áreas. **No hay foto** todavía.
- **`batoilogic.html`:** breadcrumb «Programación / Proyecto» → `dl.facts` → botones (memoria, GitHub) → «El proyecto» (`.split`) → «Aplicaciones» (5 `.row--3`) → «Tecnología» (`dl.facts`, 9 elementos) → «Mi contribución» (5 `.row--3` con `.row__wide`) → `.areas` hacia Programación y Edición.
- **`contact.html`:** `.page-head` → `.contact-grid` con `.contact-grid__info` (correo, perfiles profesionales GitHub/LinkedIn) y `.contact-grid__form` (formulario). Sin bloque de «otras redes».
- **`youtube.html`:** documento mínimo con `<meta http-equiv="refresh" content="0; url=index.html">`, `location.replace('index.html')` y un enlace de respaldo «Ir a la portada». Enlaza `css/marfil.css` por estética. Su contenido antiguo vive solo en el historial de git.

### Accesibilidad en el marcado

- Un solo `<h1>` por página. Jerarquía: H1 → H2 de sección → H3 de grupo/entrada → H4 de fila de proyecto (`dev.html`).
- Secciones con `aria-labelledby`/`aria-label`. Flechas decorativas con `aria-hidden="true"`. Enlaces externos con `target="_blank" rel="noopener"` y `aria-label` descriptivo en los enlaces «GitHub ↗» de cada proyecto.
- Navegación: la sección actual se marca con `aria-current="page"` en el `<a>` correspondiente (en `batoilogic.html`, `aria-current="true"` sobre «Programación», porque es una ficha de esa área).

---

## 6. CSS — `css/marfil.css`

Una única hoja. Todo el diseño parte de los **tokens de `:root`** (líneas ~34–79). Para cambiar color, tipografía, espaciado, anchos o radios, edita solo ahí.

### Organización del archivo (en orden)

1. `@font-face` ×4 (Bricolage latin/latin-ext, Inter latin/latin-ext; `font-display: swap`).
2. Tokens `:root`.
3. Reset y base (`box-sizing`, `body`, `:focus-visible`, `.wrap`, `.section`, `.sr-only`, `.skip-link`).
4. Tipografía (`h1–h3`, `.lead`, `.muted`, `.eyebrow`, `.meta`, `.dot`).
5. Enlaces y botones (`.link`, `.link-arrow`, `.btn`, `.btn--outline`).
6. Cabecera (`.site-header`, `.wordmark`, `.nav`, `.nav__contact`).
7. Entradas de página (`.hero`, `.hero__grid`, `.page-head`, `.section-head`).
8. Filas de área (`.areas`, `.area`).
9. Proyecto destacado (`.feature`).
10. Contexto en una línea (`.context`).
11. Filas de datos (`.rows`, `.row`, `.row--3`, `.row--minor`, `.row__*`, `.group`).
12. Stack (`.stack`), dos columnas con etiqueta (`.split`, `.quote`).
13. Pie (`.site-footer*`), formulario (`.contact-grid*`, `.form*`).
14. Ficha (`.facts`), piezas de vídeo (`.pieces`, `.piece*`, `.video-facade*`), muestra de desarrollo (`.dev-banner`, `.sample-box`).
15. Animación de entrada (`@keyframes rise`, `.rise`, `.js .reveal`).
16. Responsive (`@media (max-width: 960px)` y `(max-width: 640px)`) y `prefers-reduced-motion`.

### Paleta (tokens)

| Token | Valor | Función |
|---|---|---|
| `--ivory` | `#FAF7F2` | Fondo general |
| `--bone` | `#F1ECE4` | Superficies: `.feature`, escenario de vídeo, hover de filas de área |
| `--sand` | `#E8E1D6` | Hover de botones outline y del contacto de la cabecera |
| `--line` | `#DDD5C8` | Divisores decorativos |
| `--line-strong` | `#8A8176` | Contornos de controles, subrayado de enlaces |
| `--charcoal` | `#24201C` | Texto principal, títulos, botón primario |
| `--stone` | `#5E564D` | Texto secundario, metadatos |
| `--clay` | `#A94A2A` | **Único acento**: foco, indicador de sección actual, punto del H1, hover de enlaces |
| `--clay-deep` | `#8C3B1F` | Acento en hover (botones, enlaces) |
| `--error` / `--ok` | `#B3261E` / `#2F6B3F` | Avisos del formulario |

**Tema oscuro («Marfil de noche»)**, aprobado el 26-11-2026. Mismos tokens con otros valores: `--ivory #1A1714`, `--bone #231F1B`, `--sand #2E2924`, `--line #3A342E`, `--line-strong #7D746A`, `--charcoal #F1ECE4`, `--stone #B8AFA3`, `--clay #E08A66`, `--clay-deep #EDA27F`, `--error #F2968F`, `--ok #8FC9A0`. Los nombres describen el papel en el tema claro (`--charcoal` es «texto», `--ivory` es «fondo»). El bloque está **repetido dos veces** en `marfil.css` (sistema y elección manual): cambia ambos. Solo se aplica en pantalla. Contrastes calculados sobre `--ivory`/`--bone`/`--sand`: texto y acentos entre 5,48:1 y 15,18:1; borde de control entre 3,14:1 y 3,89:1.

Contrastes del tema claro **calculados con fórmula WCAG** (no con herramienta externa), que cumplen AA para texto: carbón/marfil 15,14:1; carbón/hueso 13,75; gris/marfil 6,74; gris/hueso 6,13; gris/arena 5,55; arcilla/marfil 5,31; arcilla/hueso 4,83 (el más ajustado); arcilla oscura/marfil 7,12; marfil/carbón 15,14; borde de control 3,58:1. Si cambias un color, recalcula estas combinaciones.

### Tipografía

- **Titulares y wordmark:** `--font-display` = *Bricolage Grotesque* (variable, pesos 500–800; usa 600 en H2/H3, 700 en H1 y hero). Interlineado ajustado y tracking negativo (`-0.025em` a `-0.045em`).
- **Cuerpo, navegación, metadatos:** `--font-text` = *Inter* (400–600). Cuerpo 17 px (`--fs-body`).
- Escala fluida con `clamp()`: `--fs-hero` (3,5–9,25 rem), `--fs-h1`, `--fs-area`, `--fs-h2`, `--fs-h3`, `--fs-lead`, `--fs-small`, `--fs-meta`.
- `.eyebrow`: Inter 600, 13 px, mayúsculas con tracking 0,09em, color `--stone`. `.meta`: 13 px, minúsculas.
- Fuentes **autoalojadas** en `fonts/` (descargadas de Google Fonts con sus textos de licencia SIL OFL). Si faltan, caen a `Segoe UI`/`system-ui`.
- `text-wrap: balance` en titulares y `pretty` en párrafos; medida de lectura `--w-text: 62ch`.

### Espaciado, anchos y radios

- Escala de 4 px: `--s-1` (0,25 rem) … `--s-10` (8 rem). Separación vertical de sección: `--section: clamp(4rem, 9vw, 8rem)`.
- Contenedor `.wrap`: máximo `--w-page: 1200px`, márgenes laterales `--gutter: clamp(1.25rem, 4vw, 3rem)`.
- Radios: `--r-s` 8 px, `--r-m` 12 px, `--r-l` 24 px. **Las esquinas son un detalle secundario**: no hay que aplicarlas por sistema.

### Componentes (clases reales) y composición

- **Rejillas de 12 columnas** (con `column-gap: var(--s-5)`): `.hero__grid`, `.feature`, `.context`, `.split`, `.site-footer__top`, `.contact-grid`. En la práctica las zonas se reparten así: etiqueta/lateral en columnas 1–3 y contenido en 5–12 (`.feature__side`/`__main`, `.split`, `.context`); título del pie 1–6 y contacto 8–12; contacto: info 1–5 y formulario 7–12. El reparto 7/5 era una orientación; adáptalo al contenido real.
- `.area` (fila grande de acceso): rejilla `6fr / 4fr / auto`, nombre en `--fs-area`, fondo `--bone` al pasar el ratón, flecha que se desplaza 8 px. Separada por filete `--line`.
- `.feature`: superficie `--bone` con `--r-l` y relleno fluido; título con `clamp(2.25rem, 7vw, 5.5rem)` y `overflow-wrap: anywhere` (necesario a 320 px).
- `.rows` / `.row`: filas separadas por filetes. `.row` (proyectos) = 4 columnas `3fr / 5fr / 2.4fr / 6rem` (nombre, descripción, tecnología, enlace). `.row--3` (experiencia, formación, ficha) = `3fr / 5fr / 4.4fr`. `.row__wide` ocupa columnas 2–fin. `.row--minor` reduce peso visual. `.row__facts` (datos en líneas) y `.row__list` (lista con guion fino) se usan en la experiencia detallada.
- `.stack` y `.facts`: 3 columnas → 2 (≤960) → 1 (≤640).
- `.piece` (vídeo): ver §7 y §13.
- Botones: `.btn` (carbón relleno, marfil texto, radio 12 px, hover arcilla oscura) y `.btn--outline`. Enlaces: `.link` (subrayado `--line-strong`, hover arcilla) y `.link-arrow` (flecha que se mueve 4 px).
- Cabecera: `.site-header` sticky en escritorio con filete inferior. `.nav a` tiene un subrayado de 2 px en arcilla que **crece de izquierda a derecha** (`scaleX`) en hover y en la sección actual (`[aria-current]`). `.nav__contact` es un botón outline que, si es la página actual, se rellena de carbón.
- Formulario: campos con borde `--line-strong`, foco con contorno arcilla de 3 px; `.form__trap` = honeypot fuera de pantalla; `.form__aviso.is-error|is-warn|is-ok` coloca el color de los avisos.

### Animaciones

Tokens: `--dur` (220 ms, hover y foco), `--dur-slow` (420 ms, filas y transición entre páginas), `--dur-enter` (600 ms, entradas y filetes), `--stagger` (60 ms), `--ease` y `--ease-out`. Solo `opacity` y `transform` (más los cambios de color en hover).

1. **Entradas al cargar** (CSS puro): `.rise` en cabeceras de página; en la portada, `.mask` (el nombre sube desde una máscara y el punto entra el último) y `.beat` (la frase en dos tiempos, todo por debajo de 1 s); en Edición, `.wipe` (barrido horizontal del título).
2. **Al hacer scroll:** `.js .reveal` (bloques) y `.js .stagger` (sus hijos entran escalonados; en `.row` y `.area` el filete se dibuja de izquierda a derecha y las listas de funciones entran en cascada).
3. **Cita de Sobre mí:** `marfil.js` la divide en palabras, que aparecen una sola vez.
4. **Entre páginas:** View Transitions nativas (`@view-transition`), con fundido, cabecera quieta, subrayado de sección que se desliza y **título compartido**: un acceso con `data-vt-title="destino.html"` dentro de `.area` o `.feature` viaja hasta el `<h1>`. Intervienen el script del `<head>` (`pagereveal`, clases `vt-*`) y el bloque 9 de `marfil.js` (`pageswap`). No funciona con `file://`: hace falta un servidor HTTP. Sin soporte, se navega sin transición.
5. **Hover y foco:** flechas, nombre y «↗» (`.row__arrow`) en filas con enlace, trazo bajo el campo enfocado, entrada del aviso del formulario.

Todos los `:hover` están en el bloque `@media (hover: hover) and (pointer: fine)` de `marfil.css`: añade ahí los nuevos. `prefers-reduced-motion` anula duraciones y retrasos, desactiva la transición entre páginas y deja todo visible.

### Responsive (ver también §9)

Dos puntos de corte: `max-width: 960px` (tablet) y `max-width: 640px` (móvil). No hay estilos mobile-first separados: se parte del diseño de escritorio y se reduce.

---

## 7. JavaScript — `js/marfil.js`

Un solo archivo (IIFE, `'use strict'`, ES5 + un `async/await` en el formulario). **No hay librerías.** Bloques:

1. **Señal de carga:** `document.documentElement.setAttribute('data-ready','1')` al empezar.
2. **Año del pie:** rellena todos los `[data-year]` con el año actual.
3. **Revelado al hacer scroll** (los `.stagger` y la cita van en el bloque 8): `IntersectionObserver` (umbral 0,12, margen inferior −8 %) sobre `.reveal`, que añade `.is-in` una sola vez. Si hay `prefers-reduced-motion` o no existe `IntersectionObserver`, marca todo como visible.
4. **Vídeo bajo demanda:** para cada `a.video-facade[data-video-id]` válido (`/^[A-Za-z0-9_-]{6,20}$/`), añade `role="button"`; al hacer clic (o pulsar **Espacio**; **Enter** ya activa el enlace) sustituye la «fachada» por un `<iframe>` de `https://www.youtube-nocookie.com/embed/<ID>?autoplay=1&rel=0&playsinline=1`, con `title` (de `data-title`), `allow`, `allowFullscreen`, `referrerPolicy` y le da foco. El reproductor **no se carga hasta que el visitante lo pide**; sin JS, el enlace abre YouTube. No hay reproducción automática al cargar la página.
5. **Formulario de contacto** (`#contact-form`, aviso en `#form-aviso`, botón `#form-submit-btn`): lógica heredada del diseño anterior, conservada:
   - Honeypot `name="website"` (si viene relleno, simula éxito sin enviar).
   - Bloqueo por ráfaga: 3 envíos en 2 min → bloqueo de 15 min. Cooldown de 90 s entre envíos. Botón deshabilitado 60 s tras un envío correcto. Estado en `localStorage` (`jfv_form_last`, `jfv_form_times`, `jfv_form_block`).
   - Validación en cliente (campos obligatorios, formato de email, nombre ≥ 2, mensaje ≥ 10 caracteres).
   - Envío por `fetch` (POST, `FormData`) al endpoint de Formspree `https://formspree.io/f/xvzyeobb` (**no cambiar**). Turnstile está desactivado (`TURNSTILE_ENABLED = false`).
   - Los avisos usan **clases** (`is-error`/`is-warn`/`is-ok`), no colores en línea.
   - El `<form>` no tiene atributo `action`: sin JS no se puede enviar (hay un `<noscript>` con el correo directo).
   - **Nunca envíes el formulario real para probar.**

6. **Tema claro/oscuro:** inserta `.theme-toggle` en `.site-header__inner`. Sin elección guardada sigue a `prefers-color-scheme`; la elección se guarda en `localStorage` (`jfv_theme`) solo si difiere del sistema. Actualiza `theme-color` y funde con View Transitions (salvo movimiento reducido o sin soporte).
7. **Copiar correo:** envuelve cada `.site-footer__mail` / `.contact-mail` en `.mail-copy` y añade `.copy-btn` (estados `idle`/`ok`/`error` y aviso para lectores de pantalla).
8. **Hora local:** «Banyeres de Mariola, HH:MM» (`Europe/Madrid`) en `.site-footer__bottom`.

9. **Filas escalonadas y cita por palabras** (bloque 8 del archivo).
10. **Título compartido entre páginas** (bloque 9 del archivo).
11. **Línea de tiempo** (bloque 10): en las páginas con dos o más `<section id="sec-…" data-clip="Nombre">` (`dev`, `about`, `batoilogic`) inserta `nav.timeline` bajo la cabecera. Cada clip mide en proporción a su sección y enlaza a ella; muestra la sección actual y un cabezal. Con el foco dentro, J y L van a la anterior o siguiente. En móvil (≤640) es una raya fija de 3 px, solo informativa (`inert`). No muestra tiempos ni duraciones.
12. **Paleta de comandos** (bloque 11): `<dialog>` que se abre con Ctrl+K / ⌘K o con `.palette-toggle` en la cabecera. Ir a páginas y secciones, copiar correo, cambiar tema, abrir GitHub o LinkedIn (solo esas dos redes). Una página nueva se añade a mano a la lista `commands`.

El formulario, además, enfoca el campo que falla (`aria-invalid` + `aria-describedby`) y muestra «Enviado ✓» antes de la espera.

Los controles de 6 a 8, la línea de tiempo y la paleta se crean con JS (no están en el HTML): sin JS no aparecen botones muertos.

### Script inline del `<head>` y degradación

Cada página incluye un `<script>` en el `<head>` que añade la clase `js` a `<html>`, aplica el tema guardado (`data-theme`, antes de pintar para evitar destellos) y, tras 3 s, añade `reveal-fallback` si `data-ready` no se ha puesto (por si `marfil.js` falla): esa clase fuerza `.reveal` y `.stagger` a visibles. El script del `<head>` también recibe la transición entre páginas (`pagereveal`). Resultado: **el contenido principal siempre se ve**, con o sin JS.

### Lo que NO hay

Ni cursor personalizado, ni scroll secuestrado, ni sonido, ni menú hamburguesa, ni librerías de animación.

---

## 8. Diseño — identidad y criterios

**Concepto:** «Marfil». Papel cálido y tinta de carbón, con una sola marca de color (arcilla). Cercano por la paleta y la tipografía; formal por la alineación, los filetes y la contención.

Decisiones deducibles del código y acordadas con Joan:

- La personalidad sale de la **escala tipográfica** (hero y nombres de área muy grandes, tracking cerrado), la **composición asimétrica** y el reparto de espacio, no de efectos.
- **Programación primero, Edición sin empequeñecerse:** en portada y en puentes, las dos áreas usan el mismo componente `.area` y el mismo tamaño; la prioridad se expresa por el orden.
- Las áreas se distinguen por **cómo se presenta el contenido**, no por colores: Programación = proyectos y soluciones en filas con filetes y metadatos; Edición = visionado, con el vídeo sobre una superficie `--bone` en su proporción real.
- Superficie `--bone` reservada: `.feature` y escenario de vídeo. No convertir todo en bloques beige iguales.
- El **punto arcilla**, las esquinas redondeadas y las animaciones son detalles secundarios: no deben aparecer en todos los elementos por sistema. El punto solo está en el H1 de la portada.
- Sin sombras, sin degradados, sin iconos decorativos, sin tarjetas idénticas en rejilla.
- Hay **un solo acento**; no añadir colores por profesión ni por plataforma.
- Accesibilidad como requisito: foco visible (`:focus-visible` con contorno arcilla de 3 px), enlaces con subrayado, nada importante solo en hover, `prefers-reduced-motion`.

---

## 9. Responsive

- **Escritorio (> 960 px):** rejillas de 12 columnas, cabecera sticky en una línea, `.area` con tres columnas.
- **Tablet (≤ 960 px):** las rejillas de 12 columnas pasan a **una sola columna** (importante: con la suma de huecos de 11 gaps, a anchos pequeños desbordaban); `.area` pasa a 2 columnas (nombre + flecha, descripción debajo); `.row` pasa a nombre + enlace con descripción y tecnología debajo; `.stack` y `.facts` a 2 columnas; escenario vertical de vídeo más estrecho (`20rem`).
- **Móvil (≤ 640 px):** la cabecera deja de ser sticky y se apila en dos líneas (wordmark arriba, los 4 enlaces debajo con `flex-wrap`, sin menú hamburguesa ni JS); `.stack`/`.facts` a 1 columna; formulario a 1 columna; escenario vertical a `min(100%, 22rem)`; `.feature` con radio menor.
- Probado (medido por código) sin desbordamiento horizontal a 320, 390, 768 y 1440 px en todas las páginas activas. Revisión visual hecha con Edge headless; **no** se ha probado en Safari, Firefox ni en dispositivos reales.

---

## 10. Assets

| Recurso | Estado |
|---|---|
| `fonts/*.woff2` (4) + `OFL-*.txt` | En uso (Bricolage e Inter; licencias incluidas) |
| `images/favicon/*` | `favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png` enlazados en el `<head>`; los `android-chrome-*` no se referencian |
| `images/profile.jpg` | **0 bytes**, sin uso. Pendiente la foto de Joan (prevista solo en Sobre mí, en su proporción natural, sin recorte agresivo) |
| `images/thumbnails/*.png` (5) | Sin uso. Son imágenes originales de Joan: **no borrar sin permiso** |
| Vídeos | Ninguno en el repositorio. Los edits se alojarían en YouTube (en oculto) y se incrustarían |
| `banner_linkedin/…v5.html` | Página independiente (no enlazada) para exportar un banner PNG de 1584×396 |

El sitio no usa imágenes de stock. No hay imágenes en las páginas activas salvo los favicons.

---

## 11. Navegación

- Menú principal en el `<header>` (todas las páginas): `Programación` → `dev.html`; `Edición` → `video.html`; `Sobre mí` → `about.html`; `Contacto` → `contact.html` (botón outline). El wordmark enlaza a `index.html`.
- Puentes entre facetas: al final de `dev.html` («También edito vídeo») y de `video.html` («También programo»), con el mismo componente `.area`. `about.html` y `batoilogic.html` cierran con filas hacia las áreas.
- Portada: dos filas `.area` (acceso a las áreas), el destacado enlaza a `batoilogic.html`, la línea de contexto a `about.html`.
- Contacto accesible desde todas las páginas: enlace en la cabecera + bloque de contacto en el pie.
- Sin menú móvil ni scroll suave por JS. La transición entre páginas se describe en §6. Único enlace de ancla interno: `#contenido` (enlace de salto).
- `youtube.html` redirige a `index.html` (no está en ningún menú).

---

## 12. Convenciones de código

- **Nombres de clase:** minúsculas con guiones; patrón BEM ligero `bloque__elemento` y `bloque--variante` (`.row__desc`, `.row--3`, `.site-footer__mail`, `.piece--v`).
- **Estilos en línea:** evitarlos. Quedan unos pocos de ajuste de margen (`contact.html`, `batoilogic.html`, `video.html`); la excepción legítima es `style="--ratio: …"` en `.piece__stage`. Si un patrón se repite, crea una clase en `marfil.css`.
- **Colores, tamaños, espaciados y radios:** siempre mediante tokens (`var(--…)`), nunca valores sueltos.
- **Rutas:** relativas; en `preview-dev/` las rutas llevan `../`.
- **HTML semántico y accesible:** un `<h1>`, secciones con `aria-labelledby`, `aria-current` en la navegación, `alt` en imágenes (decorativas: `alt=""`).
- **JavaScript:** vanilla ES5-compatible dentro de la IIFE de `marfil.js`; sin dependencias; todo debe degradar sin JS.
- **Comentarios:** en español; los bloques de `marfil.css` y `marfil.js` están separados con cabeceras `/* ── Nombre ── */`.
- **Textos:** español, sin lenguaje inflado ni cifras de impacto; en pasado para experiencias finalizadas. Mantén los nombres reales («BatoiLOGIC», «Ondulados del Papel»).

---

## 13. Reglas para futuras modificaciones

### Añadir un proyecto de programación (`dev.html`)
Añade un `<li class="row">` dentro del `<ul class="rows">` del grupo adecuado, con: `<h4 class="row__name">`, `<p class="row__desc">`, `<span class="row__tech">` y `<a class="row__link link" … aria-label="X en GitHub">GitHub ↗</a>`. Antes de escribir la descripción, **revisa el repositorio real** (README, manifiestos, código) y no copies afirmaciones promocionales. No añadas contadores de proyectos. Solo crea una ficha propia (como `batoilogic.html`) si hay contenido real suficiente.

### Añadir una pieza de vídeo (`video.html`)
1. Descomenta la sección «PIEZAS» (plantilla en el propio archivo) y rellena: ID de YouTube, título, contexto, «Mi trabajo» y, **solo si están confirmadas**, «Herramientas».
2. Formato: `piece--h` (horizontal, por defecto 16:9) o `piece--v` (vertical, 9:16). Otra proporción: `style="--ratio: 4 / 5"` en `.piece__stage`. El vídeo **no se recorta** (el escenario adopta su proporción; el póster usa `object-fit: contain`).
3. La fachada es un `<a class="video-facade" href="https://www.youtube.com/watch?v=ID" data-video-id="ID" data-title="…">`. No añadas `autoplay` ni cargues el reproductor al abrir la página.
4. Si hay póster, que sea un fotograma elegido por Joan; nunca stock ni miniaturas antiguas sin su aprobación.
5. No publiques tarjetas vacías ni «próximamente». Cuando exista la primera pieza, valora un segundo destacado en la portada (hay un comentario que marca el sitio).
6. **Antes de publicar vídeos reales hay que revisar** qué muestra el reproductor de un tercero (por ejemplo el nombre del canal que lo aloja): no se puede prometer que oculte la identidad del canal. Y comprobar que la música no provoque bloqueos en la versión incrustada.
7. El vídeo largo de prueba **no** es una pieza terminada: no incorporarlo hasta que Joan lo confirme.

### Añadir una página o sección
- Copia el esqueleto de una página existente (cabecera, `skip-link`, `main#contenido`, pie), actualiza `<title>`, `description`, `aria-current` y la navegación **en todas las páginas**.
- Reutiliza componentes: `.page-head` (entrada), `.section`/`.section--tight`, `.section-head`, `.rows`, `.split`, `.feature`, `.areas`. Una sección nueva = `<section class="section" aria-labelledby="…"><div class="wrap">…</div></section>`.
- Añade `class="reveal"` solo a bloques de contenido (no a todo); el hero usa `.rise`.
- Respeta las rutas relativas y, si la URL es nueva, no asumas URLs sin extensión.

### Modificar estilos
- Cambia primero el **token** (no el valor en el componente). Si hace falta un nuevo componente, añádelo a `marfil.css` en la sección correspondiente, con `var(--…)` y su comportamiento en los dos `@media`.
- No introduzcas más colores de acento, sombras, degradados ni efectos. No reutilices clases ni archivos del CSS heredado.
- Tras cualquier cambio de color, **recalcula los contrastes** de las combinaciones usadas.

### Crear animaciones o interacciones
- Máximo pocas y con función clara. Usa `--dur`/`--ease`, anima solo `opacity`/`transform`, y añade siempre el comportamiento con `prefers-reduced-motion` (el bloque global ya reduce a ~0 las transiciones; revisa que no dependas de ellas).
- Prohibido: cursor personalizado, scroll secuestrado, sonido o vídeo automáticos, retrasos artificiales al navegar, información importante solo disponible en hover.
- Si es una función nueva en JS, añade un bloque numerado dentro de la IIFE de `marfil.js` y garantiza que sin JS el contenido siga visible.

### Cuidar el formulario
No cambies endpoint, destinatario, IDs de campos (`nombre`, `email`, `asunto`, `mensaje`, `website`), ni los IDs `contact-form`, `form-aviso`, `form-submit-btn` sin actualizar `marfil.js` a la vez.

---

## 14. Archivos de apoyo y estado de lo heredado

- **`preview-dev/edicion-componente.html`:** muestra de desarrollo del componente de vídeo (recuadros 16:9 y 9:16 marcados como «muestra», banner superior, `noindex`). Está en `.gitignore`, **no forma parte de la versión publicable**. Enlaza `../css/marfil.css` y `../js/marfil.js`.
- **`.review/`:** capturas de revisión (ignorada por git).
- **Código heredado del diseño anterior** (oscuro, con brillo y neón, Playfair Display + DM Sans): `css/style.css`, `css/components.css`, `css/pages.css`, `css/animations.css`, `js/main.js`, `js/nav.js`. Ninguna página los carga. **No los borres ni los enlaces** sin que Joan lo decida; la decisión (archivar, borrar o dejar) sigue pendiente. Tampoco `images/thumbnails/`.
- `youtube.html` debe seguir siendo solo una redirección; no restaurar su contenido anterior.

---

## 15. Estado del contenido

**Publicado (confirmado por Joan):**
- Experiencia actual: Ondulados del Papel, gestión de pedidos y automatización de procesos, jornada completa, presencial, Banyeres de Mariola, octubre de 2026 – actualidad, con Python y Odoo.
- Prácticas anteriores en ARQU (Desarrollo y Automatización con Odoo), marzo de 2026 – junio de 2026, modalidad híbrida, con cinco funciones redactadas en pasado.
- Formación: Técnico Superior en DAM (CIPFP Batoi, septiembre de 2023 – junio de 2026) con proyecto final BatoiLOGIC; Bachillerato Científico (IES Manuel Broseta, septiembre de 2021 – mayo de 2023); inglés B1 de Cambridge (tal como estaba en la versión anterior).
- Proyecto principal: BatoiLOGIC. Otros 10 proyectos listados en `dev.html` (Cortador de Silencios, Pausa, Organizador de Fotos y su versión App, Descargar Música de YouTube, Chat PSP, Cubatis, Planetas en VR, CluckRun, Indiana Jones Juego). Pausa y Cubatis se redactaron tras revisar sus repositorios públicos, sin atribuir contribución individual. Macro Tracker se retiró a petición de Joan.
- Cortador de Silencios se describe sin afirmar uso diario ni ahorro de horas, hasta que Joan confirme su uso actual.

**Pendiente (no publicar hasta que Joan lo aporte):**
- Foto de perfil (`images/profile.jpg` está vacío).
- Edits de Alemania (existen; faltan enlaces, formato real, títulos, contexto, su trabajo y herramientas). Sin ellos, Edición no tiene piezas.
- Selección final y datos de contribución de algunos proyectos (en especial los de equipo); posibles demos y capturas.
- Decisión sobre archivar o borrar el CSS/JS e imágenes heredados.
- Versión en inglés (otra fase).

Cuando Joan envíe materiales: incorpora solo lo suficientemente definido, pregunta únicamente por ambigüedades que afecten al resultado, y no bloquees un contenido confirmado porque falte otro independiente.
