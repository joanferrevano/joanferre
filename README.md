# Joan Ferre — Portfolio

Sitio estático (HTML + CSS + JS sin dependencias ni build). Sistema visual «Marfil».

## Páginas

| Archivo | Papel |
|---|---|
| `index.html` | Portada: presentación, acceso a las dos áreas, proyecto destacado, contexto profesional |
| `dev.html` | Área de Programación |
| `video.html` | Área de Edición de vídeo |
| `batoilogic.html` | Ficha del proyecto BatoiLOGIC |
| `about.html` | Sobre mí |
| `contact.html` | Contacto (formulario Formspree) |
| `youtube.html` | Solo redirige a la portada (meta refresh + JS) para no romper enlaces antiguos. Su contenido anterior está en el historial de git |
| `404.html` | Página de error. Usa URL completas porque GitHub Pages la sirve desde cualquier ruta |

Todas las rutas son **relativas** (sin `/` inicial) para funcionar tanto en `usuario.github.io` como en `usuario.github.io/repo/`; la excepción es `404.html`.

Además: `sitemap.xml`, `images/og.png` (imagen al compartir) y `cv/joan-ferre-cv.pdf`. El cambio a dominio propio está explicado en `CLAUDE.md`.

## Sistema visual

- `css/marfil.css`: tokens (color, tipografía, espaciado, anchos, radios, movimiento) al inicio del archivo y componentes después.
- `js/marfil.js`: año del pie, revelado suave, vídeo bajo demanda y formulario de contacto.
- `fonts/`: Bricolage Grotesque e Inter (autoalojadas, licencia SIL OFL; los textos de licencia están en la misma carpeta).

## Revisar en local

Abre `index.html` directamente en el navegador (no hace falta servidor). `preview-dev/` (ignorada por git) contiene una muestra del componente de vídeo con marcadores.

## Añadir una pieza de vídeo

En `video.html` hay una plantilla comentada (`<!-- PIEZAS ... -->`). Al tener enlace y datos reales:
1. Sube el vídeo a YouTube (en oculto) y copia su ID.
2. Descomenta la sección y rellena ID, título, contexto, «Mi trabajo» y, solo si están confirmadas, «Herramientas».
3. Formato: `piece--h` (horizontal, 16:9) o `piece--v` (vertical, 9:16); para otra proporción, `style="--ratio: 4 / 5"` en `.piece__stage`. El vídeo no se recorta.
4. El reproductor (`youtube-nocookie.com`) solo se carga al pulsar; sin JS el enlace abre YouTube.
