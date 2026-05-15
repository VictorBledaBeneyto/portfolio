# Víctor Bleda Beneyto — Portfolio Personal

> Portfolio profesional de doble perfil: **Actor & Modelo** / **Desarrollador de Software (IA & Big Data)**  
> Construido íntegramente con HTML, CSS y JavaScript vanilla — sin frameworks de UI ni generadores de sitios.

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` `index.html` | **Landing orbital** — selector animado entre los dos perfiles |
| `/actor.html` | **Portfolio artístico** — CV, galería, proyectos audiovisuales |
| `/software.html` | **CV de desarrollador** — experiencia, stack técnico, proyectos de IA |

---

## Características técnicas destacadas

### Landing (`index.html`)
- **Animación orbital SVG** — dos burbujas recorren elipses paramétricas calculadas con trigonometría (`cos/sin`), con ángulo en radianes actualizado por `requestAnimationFrame`
- **Comet trails** — líneas SVG con gradiente lineal (`gradientUnits="userSpaceOnUse"`) cuyos extremos se recalculan cada frame para conectar cada burbuja con su botón
- **Cursor reactivo** — `cursor-dot` + `cursor-ring` con lerp suavizado (`*.18` por frame)
- **Mouse-proximity** — las burbujas reducen velocidad a un mínimo del 18% cuando el cursor se aproxima a ≤150 unidades SVG; conversión de coordenadas pantalla→SVG vía `getScreenCTM().inverse()`
- **Partículas Canvas** — 200 partículas flotantes con colores temáticos, rebote por borde y opacidad aleatoria
- **Easter eggs**: escribir `contratame` activa una lluvia de Matrix; `Enter` abre la terminal retro interactiva (`Escape` para cerrar) con comandos (`help`, `skills`, `contact`...)

### Portfolio artístico (`actor.html`)
- **Spotlight cursor** — `radial-gradient` dinámico centrado en el cursor con lerp (`*.09`) para movimiento suave; solo visible en escritorio
- **Film strip gallery** — las tres galerías (Documental, Modelo, Headshots) se transforman en tiras de película horizontales mediante JS: perforaciones CSS, drag-to-scroll con mouse y touch, snap scroll, apertura de lightbox por índice
- **Lightbox** — navegación por teclado/click, transición `opacity` + `scale`, soporte táctil
- **Scroll reveal** — `IntersectionObserver` con `threshold: 0.12`; filas de tabla con stagger de 55ms por fila vía `transitionDelay`
- **Contadores animados** — `IntersectionObserver` + `setInterval` que cuenta desde 0 hasta el valor `data-target` al entrar en viewport
- **Easter egg clapperboard** — detecta la secuencia de teclado `escena`; cada activación avanza el contador de toma y rota entre 10 frases de director distintas (`¡ACCIÓN!`, `¡Más emoción!`, `¡Perfecto, corten!`…) con animación CSS `@keyframes clapSnap`
- **Transiciones de página** — overlay de color a `opacity:1` en carga → fade a `0` con doble `requestAnimationFrame`; se invierte al navegar con `setTimeout(420ms)`
- **Exportación CV a PDF** — `html2pdf.js` con canvas a escala 2× y CORS habilitado

### CV de software (`software.html`)
- **Typewriter effect** — rotación de 5 frases con velocidad diferenciada escritura/borrado (55ms/28ms) y pausa post-frase (1800ms)
- **Cursor spark trail** — partículas de colores generadas en `mousemove` con throttle de 45ms y animación Web API (`el.animate()`)
- **Skill tag burst** — clic en cualquier skill lanza 14 partículas en explosión radial (`cos/sin` distribuidas en 2π)
- **Personaje SVG de inactividad** — stick figure animado que aparece tras 40s sin interacción, con estados: dormido → sorprendido → bailando
- **Terminal retro interactiva** — `Enter` para abrir, `Escape` para cerrar; prompt con historial de comandos (`contratame`, `skills`, `contact`, `help`, `clear`...) y cursor parpadeante
- **Easter eggs**: `contratame` → overlay con lluvia de letras Matrix en Canvas; doble-clic → gravedad CSS en todos los elementos del DOM; triple-clic → fuegos artificiales canvas; escribir `caer` → activa la gravedad por teclado
- **Exit-intent** — detecta `mouseleave` hacia arriba del viewport y muestra overlay con CTA de contacto
- **Email obfuscado** — dirección reconstruida desde atributos `data-u` / `data-d` en tiempo de ejecución (protección contra scrapers)

---

## Estructura del proyecto

```
portfolio/
│
├── index.html          # Landing: selector de perfil
├── actor.html          # Portfolio artístico
├── software.html       # CV de desarrollador
│
├── css/
│   ├── index.css       # Estilos de la landing orbital
│   ├── actor.css       # Estilos del portfolio artístico
│   └── software.css    # Estilos del CV de software
│
├── js/
│   ├── index.js        # Lógica de la landing (órbitas, partículas, easter eggs)
│   ├── actor.js        # Lógica del portfolio (film strip, lightbox, spotlight...)
│   └── software.js     # Lógica del CV (typewriter, terminal, gravity, sparks...)
│
└── images/
    ├── logo/
    ├── fotos/          # Headshots y estudio
    ├── modelo/         # Sesiones de moda nupcial (Modelo1–19)
    └── fusilados/      # Documental "Fusilados" (Fusilados1–8)
```

> **Separación limpia de responsabilidades**: cada página tiene su propio CSS y JS externo, lo que permite caché independiente por archivo en producción. El único fragmento inline que permanece es el bloque `tailwind-config` en `actor.html`, requerido por el CDN de Tailwind para leer la configuración antes de procesar las clases.

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Maquetación | HTML5 semántico |
| Estilos | CSS3 custom + [Tailwind CSS](https://tailwindcss.com/) (solo `actor.html`) |
| Animaciones | CSS `@keyframes`, Web Animations API, `requestAnimationFrame` |
| Interactividad | JavaScript ES6+ vanilla (sin dependencias de UI) |
| Gráficos | Canvas 2D API, SVG inline animado |
| Tipografías | Google Fonts (Space Grotesk, Cormorant Garamond, JetBrains Mono, Be Vietnam Pro) |
| Iconos | Material Icons, Font Awesome 6 |
| PDF | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) |
| Despliegue | Estático — compatible con cualquier hosting (GitHub Pages, Netlify, Vercel, Apache...) |

---

## Despliegue local

No requiere build, bundler ni Node.js. Basta con servir los archivos estáticos:

```bash
# Opción 1 — Python (viene instalado en macOS/Linux)
python -m http.server 8080

# Opción 2 — extensión Live Server de VS Code
# Click derecho sobre index.html → "Open with Live Server"

# Opción 3 — npx
npx serve .
```

Abre `http://localhost:8080` en el navegador.

> Abrir los archivos directamente con `file://` puede bloquear la carga de imágenes en algunos navegadores por política CORS. Usar siempre un servidor local.

---

## 📱 Responsive

Breakpoint principal: `768px`. Breakpoint secundario: `480px` / `640px`.

| Página | Ajustes móvil |
|--------|--------------|
| `index.html` | SVG orbital oculto → título de texto alternativo visible; botones adaptados a `min(88vw, 340px)`; hint multilínea |
| `actor.html` | Tailwind gestiona el layout; film strip reduce frames a 200×280 px; clapperboard a ancho `90vw` |
| `software.html` | Hamburger menu animado (≤768px) con cierre al pulsar enlace o clic exterior; hero stats en grid 2×2; edu/projects en columna única; exit card con padding reducido |

---

## 📐 Decisiones de diseño

**¿Por qué sin frameworks de UI?**  
El objetivo era demostrar dominio de las APIs nativas del navegador — Canvas, SVG, IntersectionObserver, Web Animations, `requestAnimationFrame` — sin abstracciones. Cada efecto está construido desde cero.

**¿Por qué Tailwind solo en `actor.html`?**  
El portfolio artístico prioriza velocidad de maquetación y consistencia visual en un documento largo con muchos componentes (tablas de CV, tarjetas, galería). Las otras dos páginas son layouts más cerrados donde CSS custom ofrece más control.

**¿Por qué dos perfiles en un mismo repositorio?**  
Ambos perfiles comparten identidad visual (paleta dorado/cian, tipografías, transiciones de página) y el mismo dominio, por lo que mantenerlos juntos garantiza coherencia y facilita el mantenimiento.

---

## Contacto

**Víctor Bleda Beneyto**  
Valencia / Madrid · Disponibilidad para viajar

[![LinkedIn](https://img.shields.io/badge/LinkedIn-victor--bleda--beneyto-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/victor-bleda-beneyto-4a9a90237/)
[![GitHub](https://img.shields.io/badge/GitHub-VictorBledaBeneyto-181717?style=flat&logo=github)](https://github.com/VictorBledaBeneyto)
[![Instagram](https://img.shields.io/badge/Instagram-viktor__bleda-E4405F?style=flat&logo=instagram)](https://www.instagram.com/viktor_bleda)
#   p o r t f o l i o  
 