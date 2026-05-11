# web_movildrive

Landing estática de **movildrive.com**. HTML + CSS + JS, sin build.

## Estructura

```
index.html              ← landing (la única que va a producción de momento)
assets/
  css/main.css
  js/main.js
_archive/               ← ensayos v1..v11 + catálogo previo (no se suben)
```

## Despliegue

Producción: IONOS SFTP. Subir **solo** `index.html` + `assets/`.

```bash
source ~/.env.global
lftp -u "$IONOS_SFTP_USER,$IONOS_SFTP_PASS" sftp://$IONOS_SFTP_HOST \
  -e "mirror -R --exclude-glob _archive/ --exclude-glob .git/ --exclude .gitignore --exclude README.md /Users/alberto/Desktop/SW_AI/web_movildrive/ /web_movildrive/; bye"
```

Luego apuntar el docroot del dominio a `/web_movildrive/` en el panel de IONOS.

## Notas

- Las páginas heredadas (`car-sharing.html`, `fleet-manager-movildrive.html`, `contact.html`, `login-fleet-manager.html`, `condiciones.html`, `privacidad.html`, `contacto.html`) viven en la raíz vieja `/` del FTP. Esta landing las enlaza con URL absoluta a `https://www.movildrive.com/...`.
- Las imágenes (`/img/scr-img/special.png`, `/img/scr-img/video.jpg`) también viven en la raíz vieja. Si futuras versiones llevan imágenes propias, ponerlas en `assets/img/`.
- Dependencias por CDN: GSAP 3.12.5, ScrollTrigger, Lenis 1.3.3, Google Fonts (DM Serif Display + DM Sans).
