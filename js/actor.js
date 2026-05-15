        // ── Spotlight cursor (foco teatral) ───────────────────
        const spotlight = document.getElementById('spotlight');
        let spotX = window.innerWidth / 2;
        let spotY = window.innerHeight / 2;
        let targetX = spotX, targetY = spotY;

        function updateSpotlight() {
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
        // Fade out spotlight when lightbox is open (fotos a pantalla completa)
        document.getElementById('close-lightbox').addEventListener('click', () => spotlight.style.opacity = '1');
        updateSpotlight();

        // ── Transiciones entre páginas ────────────────────────
        const pt = document.getElementById('page-transition');

        // El overlay arranca en opacity:0 (CSS). Solo se activa al navegar fuera.

        // Salida: fade a negro y navega
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

        // Seguridad bfcache: guardar overlay transparente antes de cachear
        window.addEventListener('pagehide', e => {
            if (e.persisted) { pt.style.transition = 'none'; pt.style.opacity = '0'; }
        });
        window.addEventListener('pageshow', e => {
            if (e.persisted) { pt.style.transition = 'none'; pt.style.opacity = '0'; }
        });

        // Configuración del Lightbox (Galería)
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

        // ══════════════════════════════════════════════════════
        // SCROLL REVEAL — section headings + table rows
        // ══════════════════════════════════════════════════════
        (function () {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('visible');
                        obs.unobserve(e.target);
                    }
                });
            }, { threshold: 0.12 });

            // Section headings reveal from below
            document.querySelectorAll('#cv h3, #gallery h2, #gallery h3, #contact h2, #bio h2, #bio h1').forEach(el => {
                el.setAttribute('data-reveal', '');
                obs.observe(el);
            });

            // Table rows reveal from the left with stagger
            document.querySelectorAll('tbody tr').forEach((row, i) => {
                row.setAttribute('data-reveal-left', '');
                row.style.transitionDelay = (i % 8) * 0.055 + 's';
                obs.observe(row);
            });
        })();

        // ══════════════════════════════════════════════════════
        // ANIMATED COUNTERS — count up when stats bar enters view
        // ══════════════════════════════════════════════════════
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

        // ══════════════════════════════════════════════════════
        // FILM STRIP — convierte todos los masonry de galería
        // ══════════════════════════════════════════════════════
        (function () {
            function buildFilmStrip(masonryId) {
                const masonry = document.getElementById(masonryId);
                if (!masonry) return;
                const imgs = Array.from(masonry.querySelectorAll('.masonry-item img'));
                if (!imgs.length) return;

                // Wrapper
                const wrapper = document.createElement('div');
                wrapper.className = 'film-strip-wrapper';

                // Perforations top + bottom
                ['film-perfs film-perfs-top', 'film-perfs film-perfs-bottom'].forEach(cls => {
                    const perf = document.createElement('div');
                    perf.className = cls;
                    for (let i = 0; i < 35; i++) perf.appendChild(document.createElement('span'));
                    wrapper.appendChild(perf);
                });

                // Scrollable track
                const track = document.createElement('div');
                track.className = 'film-track';

                imgs.forEach((origImg, i) => {
                    const frame = document.createElement('div');
                    frame.className = 'film-frame';

                    const newImg = document.createElement('img');
                    newImg.src = origImg.src;
                    newImg.alt = origImg.alt || (masonryId + ' ' + (i + 1));
                    newImg.loading = 'lazy';

                    // Open lightbox — find original in galleryImages by src
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

                // Hide original masonry, insert film strip
                masonry.style.display = 'none';
                masonry.parentElement.appendChild(wrapper);

                // Drag-to-scroll (mouse)
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
                // Touch
                let txStart, slStart;
                track.addEventListener('touchstart', e => { txStart = e.touches[0].pageX; slStart = track.scrollLeft; });
                track.addEventListener('touchmove', e => { track.scrollLeft = slStart + (txStart - e.touches[0].pageX); });
            }

            buildFilmStrip('masonry-fusilados');
            buildFilmStrip('masonry-modelo');
            buildFilmStrip('masonry-headshots');
        })();

        // ══════════════════════════════════════════════════════
        // CLAPPERBOARD EASTER EGG — type "escena"
        // ══════════════════════════════════════════════════════
        (function () {
            const WORD = 'escena';
            let typed = '';
            let toma = 0;

            // Frases del director — rotan con cada toma
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

                    // Actualizar claqueta
                    sceneEl.textContent = String(Math.ceil(toma / FRASES.length)).padStart(3, '0');
                    tomaEl.textContent  = ((toma - 1) % FRASES.length) + 1;
                    dirEl.textContent   = frase.dir;
                    accionEl.textContent = frase.accion;

                    overlay.classList.add('show');

                    // Animaciones
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

        // FUNCIÓN DE DESCARGA DEFINITIVA (MÉTODO DE CLONACIÓN)
        function descargarCV() {
            console.log("Iniciando descarga...");
            const elemento = document.getElementById('cv-template');

            if (!elemento) {
                alert("Error: No se encontró la plantilla.");
                return;
            }

            // OPCIONES OPTIMIZADAS PARA EVITAR EL ERROR DE SEGURIDAD
            const opciones = {
                margin: 0,
                filename: 'CV_Victor_Bleda.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false, // Esto permite usar imágenes aunque "manchen" el canvas
                    letterRendering: true,
                    logging: true, // Para ver errores detallados en consola
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
                    // Si falla por la foto, intentamos avisar
                    if (err.message.includes('toDataURL')) {
                        alert("Error de seguridad con la foto. Prueba a subir la web a un servidor o usa un servidor local (Live Server).");
                    }
                });
        }
