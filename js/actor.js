        // spotlight del cursor — simula un foco teatral que sigue al ratón, me salió bastante chulo
        const spotlight = document.getElementById('spotlight');
        let spotX = window.innerWidth / 2;
        let spotY = window.innerHeight / 2;
        let targetX = spotX, targetY = spotY;

        function updateSpotlight() {
            // interpolación suave — lo mismo que el cursor ring de index.js, esto ya lo tenía controlado
            spotX += (targetX - spotX) * 0.09;
            spotY += (targetY - spotY) * 0.09;
            spotlight.style.background =
                `radial-gradient(circle 320px at ${spotX.toFixed(1)}px ${spotY.toFixed(1)}px,
                 transparent 0%,
                 transparent 45%,
                 rgba(8, 10, 18, 0.28) 100%)`;
            requestAnimationFrame(updateSpotlight);
        }
        document.addEventListener('mousemove', e => { targetX = e.clientX; targetY = e.clientY; });
        // cuando se cierra el lightbox volvemos a mostrar el spotlight — me olvidé esto al principio
        document.getElementById('close-lightbox').addEventListener('click', () => spotlight.style.opacity = '1');
        updateSpotlight();

        // transiciones entre páginas — igual que en index.js, lo reutilicé
        // ────────────────────────────────
        const pt = document.getElementById('page-transition');

        // el overlay empieza invisible gracias al CSS, solo se activa al salir de la página

        // fade a negro al hacer clic en un enlace interno y luego navega
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto') ||
                href.startsWith('http') || link.target === '_blank') return;
            link.addEventListener('click', e => {
                e.preventDefault();
                pt.style.transition = 'opacity .45s ease';
                pt.style.opacity = '1';
                setTimeout(() => window.location.href = href, 420);
            });
        });

        // bfcache: si el navegador cachea la página, reseteamos el overlay para que no quede negro
        window.addEventListener('pagehide', e => {
            if (e.persisted) { pt.style.transition = 'none'; pt.style.opacity = '0'; }
        });
        window.addEventListener('pageshow', e => {
            if (e.persisted) { pt.style.transition = 'none'; pt.style.opacity = '0'; }
        });

        // configuración del lightbox para la galería de fotos — tardé bastante en que funcionara bien
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.getElementById('close-lightbox');
        const prevBtn = document.getElementById('prev-lightbox');
        const nextBtn = document.getElementById('next-lightbox');
        const galleryImages = Array.from(document.querySelectorAll('.masonry-item img'));
        let currentIndex = 0;

        const showImage = (index) => {
            if (index < 0) index = galleryImages.length - 1;
            if (index >= galleryImages.length) index = 0;
            currentIndex = index;
            lightboxImg.src = galleryImages[currentIndex].src;
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentIndex = index;
                showImage(currentIndex);
                lightbox.classList.remove('hidden');
                setTimeout(() => {
                    lightbox.classList.remove('opacity-0');
                    lightboxImg.classList.add('scale-100');
                }, 10);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.add('opacity-0');
            lightboxImg.classList.remove('scale-100');
            setTimeout(() => lightbox.classList.add('hidden'), 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        // scroll reveal para títulos y filas de tabla — esto lo aprendí en clase de interfaces
        // IntersectionObserver mola mucho, antes lo hacía con scroll events y era un desastre
        // ────────────────────────────────
        (function () {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('visible');
                        obs.unobserve(e.target);
                    }
                });
            }, { threshold: 0.12 });

            // los títulos de sección aparecen desde abajo
            document.querySelectorAll('#cv h3, #gallery h2, #gallery h3, #contact h2, #bio h2, #bio h1').forEach(el => {
                el.setAttribute('data-reveal', '');
                obs.observe(el);
            });

            // las filas de la tabla aparecen desde la izquierda con un pequeño delay escalonado
            document.querySelectorAll('tbody tr').forEach((row, i) => {
                row.setAttribute('data-reveal-left', '');
                row.style.transitionDelay = (i % 8) * 0.055 + 's';
                obs.observe(row);
            });
        })();

        // contadores animados — cuando el usuario llega a la sección de stats, los números suben
        // esto lo vi en un video de YouTube y me pareció una pasada para dar vida a la página
        // ────────────────────────────────
        (function () {
            const cObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10);
                    let cur = 0;
                    const step = Math.max(1, Math.ceil(target / 36));
                    const t = setInterval(() => {
                        cur = Math.min(cur + step, target);
                        el.textContent = cur;
                        if (cur >= target) clearInterval(t);
                    }, 38);
                    cObs.unobserve(el);
                });
            }, { threshold: 0.5 });
            document.querySelectorAll('.counter').forEach(el => cObs.observe(el));
        })();

        // film strip para la galería — convierte el masonry en una tira de película 🎞️
        // esto fue lo que más tiempo me llevó de toda la página, pero quedó genial
        // ────────────────────────────────
        (function () {
            function buildFilmStrip(masonryId) {
                const masonry = document.getElementById(masonryId);
                if (!masonry) return;
                const imgs = Array.from(masonry.querySelectorAll('.masonry-item img'));
                if (!imgs.length) return;

                // contenedor principal del film strip
                const wrapper = document.createElement('div');
                wrapper.className = 'film-strip-wrapper';

                // perforaciones arriba y abajo — el detalle que más mola del diseño
                ['film-perfs film-perfs-top', 'film-perfs film-perfs-bottom'].forEach(cls => {
                    const perf = document.createElement('div');
                    perf.className = cls;
                    for (let i = 0; i < 35; i++) perf.appendChild(document.createElement('span'));
                    wrapper.appendChild(perf);
                });

                // track horizontal donde van los fotogramas
                const track = document.createElement('div');
                track.className = 'film-track';

                imgs.forEach((origImg, i) => {
                    const frame = document.createElement('div');
                    frame.className = 'film-frame';

                    const newImg = document.createElement('img');
                    newImg.src = origImg.src;
                    newImg.alt = origImg.alt || (masonryId + ' ' + (i + 1));
                    newImg.loading = 'lazy';

                    // al hacer clic en la foto del film strip abrimos el lightbox con la misma imagen
                    newImg.addEventListener('click', () => {
                        const idx = galleryImages.findIndex(gi => gi.src === newImg.src);
                        showImage(idx !== -1 ? idx : 0);
                        lightbox.classList.remove('hidden');
                        setTimeout(() => {
                            lightbox.classList.remove('opacity-0');
                            lightboxImg.classList.add('scale-100');
                        }, 10);
                    });

                    const num = document.createElement('span');
                    num.className = 'film-frame-num';
                    num.textContent = String(i + 1).padStart(2, '0');

                    frame.appendChild(newImg);
                    frame.appendChild(num);
                    track.appendChild(frame);
                });

                wrapper.appendChild(track);

                // ocultamos el masonry original y ponemos el film strip en su lugar
                masonry.style.display = 'none';
                masonry.parentElement.appendChild(wrapper);

                // arrastrar con el ratón para scrollear — lo saqué de stackoverflow, no sé muy bien por qué funciona pero funciona
                let isDown = false, startX, scrollLeft;
                track.addEventListener('mousedown', e => {
                    isDown = true;
                    track.classList.add('dragging');
                    startX = e.pageX - track.offsetLeft;
                    scrollLeft = track.scrollLeft;
                });
                document.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
                track.addEventListener('mousemove', e => {
                    if (!isDown) return;
                    e.preventDefault();
                    track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX) * 1.4;
                });
                // también funciona con táctil para móvil — importante no olvidarse del touch
                let txStart, slStart;
                track.addEventListener('touchstart', e => { txStart = e.touches[0].pageX; slStart = track.scrollLeft; });
                track.addEventListener('touchmove', e => { track.scrollLeft = slStart + (txStart - e.touches[0].pageX); });
            }

            buildFilmStrip('masonry-fusilados');
            buildFilmStrip('masonry-modelo');
            buildFilmStrip('masonry-headshots');
        })();

        // easter egg: claqueta de director — escribe "escena" para activarlo
        // la idea se me ocurrió porque es la página de actor, tenía que haber algo teatral
        // ────────────────────────────────
        (function () {
            const WORD = 'escena';
            let typed = '';
            let toma = 0;

            // frases del director — rotan con cada toma, me lo pasé bien escribiéndolas
            const FRASES = [
                { accion: '¡ACCIÓN!',           dir: 'TÚ' },
                { accion: '¡Más emoción!',       dir: 'Spielberg (modo fan)' },
                { accion: '¡Desde el principio!',dir: 'El de siempre' },
                { accion: '¡Perfecto, corten!',  dir: 'Almodóvar (en sueños)' },
                { accion: '¡Genial, print!',     dir: 'Stanley Kubrick' },
                { accion: '¡Una más por si acaso!', dir: 'El director nervioso' },
                { accion: '¡Eso es, lo tenemos!',dir: 'Scorsese (casi)' },
                { accion: '¡Silencio en el set!',dir: 'El Asistente de dirección' },
                { accion: '¡Vamos a por otra!',  dir: 'Nadie sabe por qué' },
                { accion: '¡Esta es la buena!',  dir: 'El optimista del equipo' },
            ];

            const overlay  = document.getElementById('clapper-overlay');
            const topEl    = document.getElementById('clapper-top');
            const accionEl = document.getElementById('clapper-accion');
            const sceneEl  = document.getElementById('clapper-scene');
            const tomaEl   = document.getElementById('clapper-toma');
            const dirEl    = document.getElementById('clapper-dir');

            document.addEventListener('keydown', e => {
                if (overlay.classList.contains('show')) return;
                if (e.key.length !== 1) return;
                typed += e.key.toLowerCase();
                if (typed.length > WORD.length) typed = typed.slice(-WORD.length);
                if (typed === WORD) {
                    typed = '';
                    toma++;

                    const frase = FRASES[(toma - 1) % FRASES.length];

                    // actualizamos los datos de la claqueta con la toma actual
                    sceneEl.textContent = String(Math.ceil(toma / FRASES.length)).padStart(3, '0');
                    tomaEl.textContent  = ((toma - 1) % FRASES.length) + 1;
                    dirEl.textContent   = frase.dir;
                    accionEl.textContent = frase.accion;

                    overlay.classList.add('show');

                    // la animación del golpe de claqueta — tardé en que el timing quedara natural
                    topEl.classList.remove('snap');
                    accionEl.classList.remove('flash');
                    accionEl.style.opacity = '0';
                    void topEl.offsetWidth;
                    setTimeout(() => {
                        topEl.classList.add('snap');
                        accionEl.classList.add('flash');
                    }, 180);
                }
            });

            overlay.addEventListener('click', () => overlay.classList.remove('show'));
        })();

        // función para descargar el CV en PDF — esto fue lo más frustrante de todo el proyecto 😤
        // tuve mil problemas con los errores de CORS con las imágenes, al final así es como funciona
        function descargarCV() {
            console.log("Iniciando descarga...");
            const elemento = document.getElementById('cv-template');

            if (!elemento) {
                alert("Error: No se encontró la plantilla.");
                return;
            }

            // opciones de html2pdf — cada parámetro lo fui ajustando a prueba y error
            const opciones = {
                margin: 0,
                filename: 'CV_Victor_Bleda.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false, // esto permite usar imágenes aunque "manchen" el canvas
                    letterRendering: true,
                    logging: true, // para ver errores detallados en consola
                    scrollY: 0
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf()
                .set(opciones)
                .from(elemento)
                .save()
                .catch(err => {
                    console.error("Error detallado:", err);
                    // si falla por la foto avisamos al usuario — me pasó muchas veces en local
                    if (err.message.includes('toDataURL')) {
                        alert("Error de seguridad con la foto. Prueba a subir la web a un servidor o usa un servidor local (Live Server).");
                    }
                });
        }
