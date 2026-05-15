# Victor Bleda Beneyto — Portfolio Personal

Portfolio profesional de doble perfil: **Actor & Modelo** y **Desarrollador de Software (IA & Big Data)**.
Construido enteramente con HTML, CSS y JavaScript vanilla, sin frameworks de UI ni generadores de sitios.

---

## Paginas

| Ruta | Descripcion |
|------|-------------|
| `index.html` | **Landing orbital** — selector animado entre los dos perfiles |
| `actor.html` | **Portfolio artistico** — CV, galeria, proyectos audiovisuales |
| `software.html` | **CV de desarrollador** — experiencia, stack tecnico, proyectos de IA |

---

## Caracteristicas tecnicas

### Landing `index.html`

- **Animacion orbital SVG** — dos burbujas recorren elipses parametricas con trigonometria `cos/sin`, angulo en radianes actualizado por `requestAnimationFrame`
- **Comet trails** — lineas SVG con gradiente lineal `gradientUnits="userSpaceOnUse"` cuyos extremos se recalculan cada frame
- **Cursor reactivo** — `cursor-dot` + `cursor-ring` con lerp suavizado `*.18` por frame
- **Mouse-proximity** — las burbujas reducen velocidad al 18% cuando el cursor se aproxima a menos de 150 unidades SVG; conversion pantalla a SVG via `getScreenCTM().inverse()`
- **Particulas Canvas** — 200 particulas flotantes con colores tematicos y opacidad aleatoria
- **Easter eggs** — escribir `contratame` activa lluvia Matrix; `Enter` abre la terminal retro (`Escape` para cerrar) con comandos `help`, `skills`, `contact`

### Portfolio artistico `actor.html`

- **Spotlight cursor** — `radial-gradient` dinamico con lerp `*.09`; solo visible en escritorio
- **Film strip gallery** — las tres galerias (Documental, Modelo, Headshots) se transforman en tiras de pelicula horizontales con perforaciones CSS, drag-to-scroll, snap scroll y apertura de lightbox por indice
- **Lightbox** — navegacion click/teclado, transicion `opacity` + `scale`, soporte tactil
- **Scroll reveal** — `IntersectionObserver` con `threshold: 0.12`; filas de tabla con stagger de 55ms via `transitionDelay`
- **Contadores animados** — `IntersectionObserver` + `setInterval` contando desde 0 hasta `data-target` al entrar en viewport
- **Easter egg clapperboard** — escribir `escena` abre una clapperboard; rota 10 frases de director distintas (`ACCION!`, `Masemocion!`, `Perfecto, corten!`...) con animacion CSS `clapSnap`
- **Transiciones de pagina** — overlay `opacity:1` en carga, fade a `0` con doble `requestAnimationFrame`
- **Exportacion CV a PDF** — `html2pdf.js` con canvas escala 2x y CORS habilitado

### CV de software `software.html`

- **Typewriter effect** — rotacion de 5 frases con velocidad diferenciada escritura/borrado (55ms/28ms)
- **Cursor spark trail** — particulas de colores en `mousemove` con throttle 45ms y Web Animations API
- **Skill tag burst** — clic en cualquier skill lanza 14 particulas en explosion radial con `cos/sin`
- **Personaje SVG de inactividad** — stick figure que aparece tras 40s sin interaccion con estados: dormido, sorprendido, bailando
- **Terminal retro** — `Enter` para abrir, `Escape` para cerrar; historial de comandos `contratame`, `skills`, `contact`, `help`, `clear`
- **Easter eggs** — `contratame` activa Matrix en Canvas; doble-clic lanza gravedad CSS; triple-clic fuegos artificiales; escribir `caer` activa gravedad por teclado
- **Exit-intent** — detecta `mouseleave` hacia arriba del viewport y muestra overlay con CTA de contacto
- **Email obfuscado** — reconstruido desde `data-u` / `data-d` en tiempo de ejecucion

---

## Estructura

```
portfolio/
|
+-- index.html          # Landing: selector de perfil
+-- actor.html          # Portfolio artistico
+-- software.html       # CV de desarrollador
|
+-- css/
|   +-- index.css       # Estilos landing orbital
|   +-- actor.css       # Estilos portfolio artistico
|   +-- software.css    # Estilos CV de software
|
+-- js/
|   +-- index.js        # Logica landing (orbitas, particulas, easter eggs)
|   +-- actor.js        # Logica portfolio (film strip, lightbox, spotlight)
|   +-- software.js     # Logica CV (typewriter, terminal, gravity, sparks)
|
+-- images/
    +-- logo/
    +-- fotos/          # Headshots y estudio
    +-- modelo/         # Sesiones moda nupcial (Modelo1-19)
    +-- fusilados/      # Documental Fusilados (Fusilados1-8)
```

Cada pagina tiene su propio CSS y JS externo para cache independiente por archivo en produccion.

---

## Stack

| Capa | Tecnologia |
|------|------------|
| Maquetacion | HTML5 semantico |
| Estilos | CSS3 custom + Tailwind CSS (solo `actor.html`) |
| Animaciones | CSS keyframes, Web Animations API, `requestAnimationFrame` |
| Interactividad | JavaScript ES6+ vanilla (sin dependencias de UI) |
| Graficos | Canvas 2D API, SVG inline animado |
| Tipografias | Space Grotesk, Cormorant Garamond, JetBrains Mono, Be Vietnam Pro |
| Iconos | Material Icons, Font Awesome 6 |
| PDF | html2pdf.js |
| Despliegue | Estatico — GitHub Pages, Netlify, Vercel, Apache |

---

## Responsive

Breakpoint principal: `768px`. Breakpoints secundarios: `480px` y `640px`.

| Pagina | Ajustes movil |
|--------|---------------|
| `index.html` | SVG orbital oculto, titulo de texto alternativo; botones `min(88vw, 340px)`; hint multilinea |
| `actor.html` | Tailwind gestiona el layout; film strip 200x280px en movil; clapperboard ancho `90vw` |
| `software.html` | Hamburger menu animado con cierre automatico; hero stats 2x2; edu/projects columna unica; exit card compacto |

---

## Ejecucion local

No requiere build, bundler ni Node.js:

```bash
# Python
python -m http.server 8080

# npx
npx serve .

# VS Code
# Click derecho en index.html -> Open with Live Server
```

Abrir con `file://` puede bloquear imagenes por CORS. Usar siempre un servidor local.

---

## Decisiones de diseno

**Por que sin frameworks de UI?**
El objetivo es demostrar dominio de las APIs nativas del navegador (Canvas, SVG, IntersectionObserver, Web Animations, requestAnimationFrame) sin abstracciones. Cada efecto esta construido desde cero.

**Por que Tailwind solo en `actor.html`?**
El portfolio artistico tiene muchos componentes (tablas, tarjetas, galeria) donde Tailwind acelera la maquetacion. Las otras dos paginas son layouts cerrados donde CSS custom da mas control.

**Por que dos perfiles en un mismo repositorio?**
Ambos perfiles comparten identidad visual (paleta dorado/cian, tipografias, transiciones) y dominio, por lo que mantenerlos juntos garantiza coherencia y facilita el mantenimiento.

---

## Contacto

**Victor Bleda Beneyto** — Valencia / Madrid

[![LinkedIn](https://img.shields.io/badge/LinkedIn-victor--bleda--beneyto-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/victor-bleda-beneyto-4a9a90237/)
[![GitHub](https://img.shields.io/badge/GitHub-VictorBledaBeneyto-181717?style=flat&logo=github)](https://github.com/VictorBledaBeneyto)

