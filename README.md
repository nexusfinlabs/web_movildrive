# Movildrive — Coming Soon

Landing negra con cuatro imágenes de los coches de Movildrive, carrusel con transiciones suaves y efecto linterna que sigue al cursor. HTML, CSS y JavaScript sin dependencias de ejecución, servicios externos ni build.

## Vista local

Desde esta carpeta:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Abrir http://localhost:4173. Recargar el navegador después de cada cambio.

## Personalización

- `index.html`: textos, contacto, imágenes y orden del carrusel.
- `assets/css/coming-soon.css`: tipografía, composición, colores, máscara del foco y diseño móvil.
- `assets/js/coming-soon.js`: objeto `SETTINGS` al principio del archivo. Duración de imagen: 6500 ms; radio del foco: 340 px en escritorio y 235 px en móvil.
- `assets/img/coming-soon/`: imágenes originales; el carrusel utiliza las cuatro de los coches. La cabecera muestra solo el nombre; el emblema se utiliza únicamente como favicon.
- `assets/fonts/`: Instrument Sans local; no se realizan peticiones a Google Fonts.

El fondo se revela al mover el cursor. En móvil, el foco recorre suavemente la imagen y responde al dedo. Los controles permiten elegir imagen, avanzar, retroceder y pausar. Las flechas del teclado también cambian de imagen. Se respeta la preferencia de movimiento reducido y se suspende la animación al ocultar la pestaña.

## Publicación

Producción: https://www.movildrive.com/ · alojamiento IONOS SFTP, directorio `/web_movildrive/`.
Repositorio: https://github.com/nexusfinlabs/web_movildrive · rama `main`.

La portada anterior y sus CSS/JS se conservan en `_backup/`, carpeta excluida de Git. La copia del servidor anterior a esta publicación está en `_backup/production-before-coming-soon-20261006/`. Los archivos anteriores `assets/css/main.css` y `assets/js/main.js` siguen intactos, incluyendo los cambios locales previos. `aboutme.html` permanece disponible.

La nueva landing utiliza `index.html`, `assets/css/coming-soon.css`, `assets/js/coming-soon.js`, `assets/fonts/` y las imágenes `four-towers.png`, `city.png`, `concept.png`, `kio.png` y `emblem.png` de `assets/img/coming-soon/`.

Para actualizar, guardar primero una copia local del directorio de producción. Cargar los recursos por SFTP y comprobar sus URLs públicas. Subir el HTML con un nombre temporal para verificarlo y, después, cargarlo como `index.html`: el servidor SFTP de IONOS no permite renombrar sobre un archivo existente. Comprobar la portada pública y retirar el HTML temporal. No sincronizar ni borrar archivos ajenos a esta landing. Las credenciales se obtienen de `~/.env.global` (`IONOS_SFTP_HOST`, `IONOS_SFTP_USER`, `IONOS_SFTP_PASS`) y nunca se guardan en el repositorio. El historial de despliegue anterior se conserva en `_backup/README-before-coming-soon.md`.
