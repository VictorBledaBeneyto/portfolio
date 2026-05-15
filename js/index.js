'use strict';

// ══════════════════════════════════════════════════════
// PAGE TRANSITIONS
// ══════════════════════════════════════════════════════
(function() {
    const pt = document.getElementById('page-transition');

    function fadeOut() {
        pt.style.transition = 'none';
        pt.style.opacity = '1';
        pt.getBoundingClientRect(); // fuerza reflow síncrono
        pt.style.transition = 'opacity .45s ease';
        pt.style.opacity = '0';
    }

    fadeOut();

    // Antes de entrar en bfcache, guardar el overlay como transparente
    window.addEventListener('pagehide', e => {
        if (e.persisted) { pt.style.transition = 'none'; pt.style.opacity = '0'; }
    });
    // Al restaurar desde bfcache, el overlay ya es 0; solo lo confirmamos
    window.addEventListener('pageshow', e => {
        if (e.persisted) { pt.style.transition = 'none'; pt.style.opacity = '0'; }
    });

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
})();

// ══════════════════════════════════════════════════════
// CONSOLE SIGNATURE
// ══════════════════════════════════════════════════════
console.log('%c👾 Hola, curioso/a!','color:#00c8ff;font-size:22px;font-weight:bold;');
console.log(
    '%c¿Revisando el código fuente? Me gusta tu estilo.\n\n' +
    '  Víctor Bleda Beneyto\n' +
    '  Desarrollador de Software · IA & Big Data\n' +
    '  github.com/VictorBledaBeneyto\n\n' +
    '  → Escribe "contratame" en la página para una sorpresa',
    'color:#94a3b8;font-size:13px;line-height:2;font-family:monospace;'
);

// ══════════════════════════════════════════════════════
// EMAIL OBFUSCATION
// ══════════════════════════════════════════════════════
document.querySelectorAll('.email-obf').forEach(el => {
    el.textContent = el.dataset.u + '@' + el.dataset.d;
    el.addEventListener('click', () => { window.location.href = 'mailto:' + el.dataset.u + '@' + el.dataset.d; });
});

// ══════════════════════════════════════════════════════
// CURSOR
// ══════════════════════════════════════════════════════
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0;
document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function moveCursorRing() {
    const rx = parseFloat(ring.style.left || 0);
    const ry = parseFloat(ring.style.top  || 0);
    ring.style.left = (rx + (mx - rx) * .18) + 'px';
    ring.style.top  = (ry + (my - ry) * .18) + 'px';
    requestAnimationFrame(moveCursorRing);
})();
document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.7)');
    b.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
});

// ══════════════════════════════════════════════════════
// BACKGROUND PARTICLES
// ══════════════════════════════════════════════════════
(function () {
    const c   = document.getElementById('bg-canvas');
    const ctx = c.getContext('2d');
    let W, H, pts = [];
    function resize() { W = c.width = innerWidth; H = c.height = innerHeight; }
    resize(); addEventListener('resize', resize);
    class P {
        constructor() { this.r(); }
        r() {
            this.x = Math.random()*W; this.y = Math.random()*H;
            this.sz = Math.random()*1.4+.3;
            this.vx = (Math.random()-.5)*.18; this.vy = (Math.random()-.5)*.18;
            this.a  = Math.random()*.5+.1;
            const t = Math.random();
            this.col = t>.75?'#cf9b17':t>.5?'#00c8ff':'#ffffff';
        }
        tick() { this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>W||this.y<0||this.y>H) this.r(); }
        draw() { ctx.save();ctx.globalAlpha=this.a;ctx.fillStyle=this.col;ctx.beginPath();ctx.arc(this.x,this.y,this.sz,0,Math.PI*2);ctx.fill();ctx.restore(); }
    }
    for(let i=0;i<200;i++) pts.push(new P());
    (function frame(){
        ctx.fillStyle='rgba(2,2,6,.14)'; ctx.fillRect(0,0,W,H);
        pts.forEach(p=>{p.tick();p.draw();});
        requestAnimationFrame(frame);
    })();
})();

// ══════════════════════════════════════════════════════
// ORBITAL ANIMATION — bubbles orbit around buttons
// Each bubble travels an ellipse; comet trails connect
// each bubble back to its respective button.
// ══════════════════════════════════════════════════════
const SVG_EL  = document.getElementById('orbit-svg');
const SVG_CX  = 600, SVG_CY = 350;
const RX_GOLD = 270, RY_GOLD = 115;   // gold ellipse semi-axes
const RX_CYAN = 265, RY_CYAN = 108;   // cyan ellipse semi-axes
const SPD_GOLD =  0.0015;              // rad / frame  (clockwise)
const SPD_CYAN = -0.001;               // rad / frame  (counter-clockwise)

let angleGold = Math.PI;              // gold starts at left (π)
let angleCyan = 0;                    // cyan starts at right (0)

// Covert a screen point to SVG user-space coordinates
function screenToSVG(sx, sy) {
    const pt = SVG_EL.createSVGPoint();
    pt.x = sx; pt.y = sy;
    return pt.matrixTransform(SVG_EL.getScreenCTM().inverse());
}

// Track mouse in SVG space for bubble proximity effect
let mouseInSVG = { x: SVG_CX, y: SVG_CY };
document.addEventListener('mousemove', e => {
    mouseInSVG = screenToSVG(e.clientX, e.clientY);
});

// Get the centre of a button in SVG coordinates
function getBtnCenter(id) {
    const r = document.getElementById(id).getBoundingClientRect();
    return screenToSVG(r.left + r.width / 2, r.top + r.height / 2);
}

// Cache button positions; refresh on resize
let BTN_ART = { x: SVG_CX, y: SVG_CY - 33 };
let BTN_DEV = { x: SVG_CX, y: SVG_CY + 33 };
function refreshBtnPos() {
    try {
        BTN_ART = getBtnCenter('btn-art');
        BTN_DEV = getBtnCenter('btn-dev');
    } catch(e) {}
}
// Wait for layout before first read
requestAnimationFrame(refreshBtnPos);
window.addEventListener('resize', refreshBtnPos);

// SVG element references
const bwGold  = document.getElementById('bw-gold');
const bwCyan  = document.getElementById('bw-cyan');
const ctGold  = document.getElementById('comet-gold');
const ctCyan  = document.getElementById('comet-cyan');
const chGold  = document.getElementById('ch-gold');
const chCyan  = document.getElementById('ch-cyan');
const cgGold  = document.getElementById('cg-gold');
const cgCyan  = document.getElementById('cg-cyan');

// Helper: set all four coords on a <line> or gradient
function setCoords(el, x1, y1, x2, y2) {
    el.setAttribute('x1', x1.toFixed(1));
    el.setAttribute('y1', y1.toFixed(1));
    el.setAttribute('x2', x2.toFixed(1));
    el.setAttribute('y2', y2.toFixed(1));
}

(function animOrbits() {
    // Current bubble positions (before advancing angle)
    const gxCur = SVG_CX + RX_GOLD * Math.cos(angleGold);
    const gyCur = SVG_CY + RY_GOLD * Math.sin(angleGold);
    const cxCur = SVG_CX + RX_CYAN * Math.cos(angleCyan);
    const cyCur = SVG_CY + RY_CYAN * Math.sin(angleCyan);

    // Mouse-proximity speed factor: bubbles slow when cursor is within PULL units
    const PULL = 150;
    const dGold = Math.hypot(gxCur - mouseInSVG.x, gyCur - mouseInSVG.y);
    const dCyan = Math.hypot(cxCur - mouseInSVG.x, cyCur - mouseInSVG.y);
    const fGold = dGold < PULL ? Math.max(0.18, dGold / PULL) : 1;
    const fCyan = dCyan < PULL ? Math.max(0.18, dCyan / PULL) : 1;

    angleGold += SPD_GOLD * fGold;
    angleCyan += SPD_CYAN * fCyan;

    // Bubble positions on their ellipses
    const gx = SVG_CX + RX_GOLD * Math.cos(angleGold);
    const gy = SVG_CY + RY_GOLD * Math.sin(angleGold);
    const cx = SVG_CX + RX_CYAN * Math.cos(angleCyan);
    const cy = SVG_CY + RY_CYAN * Math.sin(angleCyan);

    // Move bubble wrappers
    bwGold.setAttribute('transform', `translate(${gx.toFixed(2)},${gy.toFixed(2)})`);
    bwCyan.setAttribute('transform', `translate(${cx.toFixed(2)},${cy.toFixed(2)})`);

    // Comet trails — FROM button (transparent) TO bubble (bright)
    const ax = BTN_ART.x, ay = BTN_ART.y;
    const dx = BTN_DEV.x, dy = BTN_DEV.y;

    setCoords(ctGold, ax, ay, gx, gy);
    setCoords(cgGold, ax, ay, gx, gy);   // gradient matches line

    setCoords(ctCyan, dx, dy, cx, cy);
    setCoords(cgCyan, dx, dy, cx, cy);

    // Glow head circles follow the bubble
    chGold.setAttribute('cx', gx.toFixed(2)); chGold.setAttribute('cy', gy.toFixed(2));
    chCyan.setAttribute('cx', cx.toFixed(2)); chCyan.setAttribute('cy', cy.toFixed(2));

    requestAnimationFrame(animOrbits);
})();

// ══════════════════════════════════════════════════════
// INACTIVITY CHARACTER
// ══════════════════════════════════════════════════════
const idleEl     = document.getElementById('idle-char');
const idleBubble = document.getElementById('idle-bubble');
const cp = {
    chair:document.getElementById('g-chair'), tomb:document.getElementById('g-tomb'),
    beard:document.getElementById('g-beard'), body:document.getElementById('g-body'),
    mouth:document.getElementById('c-mouth'), armR:document.getElementById('c-arm-r'),
    armL:document.getElementById('c-arm-l'),  legLU:document.getElementById('c-leg-lu'),
    legRU:document.getElementById('c-leg-ru'),legLL:document.getElementById('c-leg-ll'),
    legRL:document.getElementById('c-leg-rl'),sweat:document.getElementById('c-sweat'),
};
function a(el,attrs){Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));}
function setCharState(s){
    a(cp.chair,{opacity:0});a(cp.tomb,{opacity:0});a(cp.beard,{opacity:0});a(cp.body,{opacity:1});
    a(cp.armR,{x2:58,y2:52});a(cp.armL,{x2:22,y2:52});
    a(cp.legLU,{x1:40,y1:56,x2:28,y2:82});a(cp.legRU,{x1:40,y1:56,x2:52,y2:82});
    a(cp.legLL,{opacity:0});a(cp.legRL,{opacity:0});a(cp.sweat,{opacity:0});
    a(cp.mouth,{d:'M35,20 Q40,24 45,20'});
    if(s===1){a(cp.armR,{x2:62,y2:22});}
    else if(s===2||s===3){
        a(cp.chair,{opacity:1});
        a(cp.legLU,{x1:40,y1:63,x2:12,y2:63});a(cp.legRU,{x1:40,y1:63,x2:60,y2:63});
        a(cp.legLL,{x1:12,y1:63,x2:12,y2:87,opacity:1});a(cp.legRL,{x1:60,y1:63,x2:60,y2:87,opacity:1});
        a(cp.sweat,{opacity:1});a(cp.mouth,{d:'M35,22 Q40,19 45,22'});a(cp.armL,{x2:18,y2:42});
        if(s===3)a(cp.beard,{opacity:1});
    } else if(s===4){a(cp.body,{opacity:0});a(cp.chair,{opacity:0});a(cp.tomb,{opacity:1});}
}
let idleTimer=null;
const STAGES=[
    {delay:5000,state:1,msg:'¿Hola? ¿Estás ahí? 👋'},
    {delay:5000,state:2,msg:'...mmm, ¿sigues ahí? 🤔'},
    {delay:5000,state:3,msg:'Ya me salió barba de esperar 🧔'},
    {delay:5000,state:4,msg:'R.I.P. — Visitante sin scroll'}
];
function scheduleIdle(idx){
    if(idx>=STAGES.length)return;
    idleTimer=setTimeout(()=>{
        setCharState(STAGES[idx].state);
        idleBubble.textContent=STAGES[idx].msg;
        idleEl.classList.add('show');
        scheduleIdle(idx+1);
    },STAGES[idx].delay);
}
function resetIdle(){
    clearTimeout(idleTimer);idleEl.classList.remove('show');setCharState(0);scheduleIdle(0);
}
['mousemove','mousedown','keydown','scroll','touchstart'].forEach(ev=>
    document.addEventListener(ev,resetIdle,{passive:true})
);
resetIdle();

// ══════════════════════════════════════════════════════
// CURSOR SPARK TRAIL
// ══════════════════════════════════════════════════════
let lastSpark=0;
const SPARK_COLS=['#cf9b17','#00c8ff','#ffffff','#ff9f1c','#b57fff'];
document.addEventListener('mousemove',e=>{
    const now=Date.now();if(now-lastSpark<45)return;lastSpark=now;
    const el=document.createElement('div');el.className='spark';
    el.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;width:5px;height:5px;background:${SPARK_COLS[Math.random()*5|0]};`;
    document.body.appendChild(el);
    el.animate([
        {opacity:1,transform:'translate(-50%,-50%) scale(1)'},
        {opacity:0,transform:`translate(calc(-50% + ${(Math.random()-.5)*26}px),calc(-50% + ${(Math.random()-.5)*26}px)) scale(0)`}
    ],{duration:520,fill:'forwards'}).onfinish=()=>el.remove();
});

// ══════════════════════════════════════════════════════
// EGG 1 — GRAVITY LETTERS  (triple-click · type "caer")
// ══════════════════════════════════════════════════════
let gravityActive=false;
function launchGravity(){
    if(gravityActive)return;gravityActive=true;
    const pool=[...'VÍCTOR BLEDA BENEYTO CV ARTÍSTICO DESARROLLADOR ✦ 🎭 💻 ★'];
    const cols=['#cf9b17','#00c8ff','#ffffff','#b57fff','#ff9f1c'];
    pool.filter(c=>c.trim()).forEach((ch,i)=>{
        setTimeout(()=>{
            const el=document.createElement('div');el.className='gravity-char';el.textContent=ch;
            const px=(10+Math.random()*80)/100*innerWidth;
            const py=(15+Math.random()*35)/100*innerHeight;
            el.style.left=px+'px';el.style.top=py+'px';
            el.style.fontSize=(14+Math.random()*18)+'px';
            el.style.color=cols[Math.random()*cols.length|0];
            document.body.appendChild(el);
            let vx=(Math.random()-.5)*7,vy=-(Math.random()*10+4),x=px,y=py,r=Math.random()*360,rv=(Math.random()-.5)*16;
            (function fall(){
                vy+=.45;x+=vx;y+=vy;r+=rv;
                el.style.left=x+'px';el.style.top=y+'px';el.style.transform=`rotate(${r}deg)`;
                if(y<innerHeight+60)requestAnimationFrame(fall);else el.remove();
            })();
        },i*28);
    });
    setTimeout(()=>{gravityActive=false;},4000);
}
let tclickCount=0,tclickTimer=null;
document.addEventListener('click',()=>{
    tclickCount++;clearTimeout(tclickTimer);
    tclickTimer=setTimeout(()=>{tclickCount=0;},420);
    if(tclickCount>=3){tclickCount=0;launchGravity();}
});

// ══════════════════════════════════════════════════════
// EGG 2 — MATRIX RAIN  (Konami ↑↑↓↓←→←→BA)
// ══════════════════════════════════════════════════════
const KONAMI=[38,38,40,40,37,39,37,39,66,65];
let kIdx=0,matrixInt=null;
function startMatrix(){
    const cvs=document.getElementById('matrix-canvas');
    if(cvs.style.display==='block'){stopMatrix();return;}
    cvs.style.display='block';cvs.width=innerWidth;cvs.height=innerHeight;
    const ctx=cvs.getContext('2d'),cols=Math.floor(innerWidth/14)|0,drops=new Array(cols).fill(1);
    const TECH='YOLOKAFKADOCKERAWSPYTHONJAVAFLUTTERSQLGITMLPαβ01'.split('');
    matrixInt=setInterval(()=>{
        ctx.fillStyle='rgba(0,0,0,.06)';ctx.fillRect(0,0,cvs.width,cvs.height);ctx.font='14px monospace';
        drops.forEach((y,i)=>{ctx.fillStyle=i%7===0?'#00ffff':'#00cc44';ctx.fillText(TECH[Math.random()*TECH.length|0],i*14,y*14);if(y*14>cvs.height&&Math.random()>.975)drops[i]=0;drops[i]++;});
    },38);
    setTimeout(stopMatrix,8000);
}
function stopMatrix(){
    clearInterval(matrixInt);matrixInt=null;
    const cvs=document.getElementById('matrix-canvas');
    cvs.style.display='none';cvs.getContext('2d').clearRect(0,0,cvs.width,cvs.height);
}

// ══════════════════════════════════════════════════════
// EGG 3 — HIRE ME + CONFETTI  (type "contratame")
// ══════════════════════════════════════════════════════
const CONF_COLS=['#cf9b17','#00c8ff','#ff4081','#7c3aed','#69f0ae','#fff','#ff9f1c'];
function showHireOverlay(){
    document.getElementById('hire-overlay').classList.add('show');
    for(let i=0;i<90;i++)setTimeout(launchConfetti,Math.random()*1200);
}
function closeHire(){document.getElementById('hire-overlay').classList.remove('show');}
function launchConfetti(){
    const el=document.createElement('div');el.className='confetti';
    el.style.cssText=`left:${Math.random()*100}vw;background:${CONF_COLS[Math.random()*CONF_COLS.length|0]};width:${Math.random()*10+5}px;height:${Math.random()*6+4}px;border-radius:${Math.random()>.5?'50%':'3px'};`;
    document.body.appendChild(el);
    el.animate([
        {transform:`translateY(0) rotate(0deg)`,opacity:1},
        {transform:`translateY(${innerHeight+20}px) translateX(${(Math.random()-.5)*350}px) rotate(${Math.random()*720}deg)`,opacity:0}
    ],{duration:Math.random()*2000+1400,easing:'cubic-bezier(.25,.46,.45,.94)',fill:'forwards'}).onfinish=()=>el.remove();
}

// ══════════════════════════════════════════════════════
// EGG 4 — FIREWORKS  (double-click)
// ══════════════════════════════════════════════════════
const FW_COLS=['#cf9b17','#00c8ff','#ff4081','#b57fff','#69f0ae','#fff','#ff9f1c','#ff6b6b'];
function launchFireworks(x,y){
    const NUM=24;
    for(let i=0;i<NUM;i++){
        const el=document.createElement('div');el.className='fw-particle';
        const size=Math.random()*7+4;
        el.style.cssText=`left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${FW_COLS[Math.random()*FW_COLS.length|0]};border-radius:50%;transform:translate(-50%,-50%);`;
        document.body.appendChild(el);
        const angle=(i/NUM)*2*Math.PI+Math.random()*.3,dist=60+Math.random()*100;
        el.animate([
            {transform:`translate(-50%,-50%) scale(1)`,opacity:1},
            {transform:`translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`,opacity:0}
        ],{duration:500+Math.random()*400,easing:'ease-out',fill:'forwards'}).onfinish=()=>el.remove();
    }
    for(let i=0;i<8;i++) setTimeout(()=>{
        const el=document.createElement('div');
        el.style.cssText=`position:fixed;left:${x}px;top:${y}px;width:4px;height:4px;background:#fff;border-radius:50%;pointer-events:none;z-index:450;transform:translate(-50%,-50%);`;
        document.body.appendChild(el);
        const ang=Math.random()*2*Math.PI,d=20+Math.random()*40;
        el.animate([{transform:`translate(-50%,-50%) scale(1)`,opacity:.8},{transform:`translate(calc(-50% + ${Math.cos(ang)*d}px),calc(-50% + ${Math.sin(ang)*d}px)) scale(0)`,opacity:0}],{duration:350,easing:'ease-out',fill:'forwards'}).onfinish=()=>el.remove();
    },i*60);
}
document.addEventListener('dblclick',e=>{
    if(e.target.closest('.btn')||e.target.closest('#retro-overlay')||e.target.closest('#hire-overlay'))return;
    launchFireworks(e.clientX,e.clientY);
});

// ══════════════════════════════════════════════════════
// EGG 5 — RETRO TERMINAL  (press ` · type "terminal")
// ══════════════════════════════════════════════════════
const retroOverlay=document.getElementById('retro-overlay');
const retroBody=document.getElementById('retro-body');
const retroInput=document.getElementById('retro-input');
const RETRO_CMDS={
    help:()=>[{t:'hi',s:'Comandos disponibles:'},{t:'out',s:'  whoami       — quién soy'},{t:'out',s:'  skills       — stack tecnológico'},{t:'out',s:'  ls projects  — proyectos destacados'},{t:'out',s:'  contact      — información de contacto'},{t:'out',s:'  hire         — activa modo contratación 🎉'},{t:'out',s:'  clear        — limpia la terminal'},{t:'out',s:'  exit         — cierra esta ventana'}],
    whoami:()=>[{t:'out',s:'Víctor Bleda Beneyto'},{t:'out',s:'Desarrollador de Software · IA & Big Data'},{t:'out',s:'Valencia / Madrid — disponibilidad para viajar'},{t:'out',s:'github.com/VictorBledaBeneyto'}],
    skills:()=>[{t:'hi',s:'── Stack tecnológico ──────────────────────'},{t:'out',s:'Lenguajes:  Python · Java · Kotlin · Flutter · PHP · SQL'},{t:'out',s:'IA / Data:  PyTorch · YOLOv8 · Spark · Power BI · MLP'},{t:'out',s:'Cloud:      AWS · Kafka · Docker · Firebase · MinIO'},{t:'out',s:'Tools:      Git · PostgreSQL · MySQL · Odoo'}],
    'ls projects':()=>[{t:'hi',s:'── Proyectos ───────────────────────────────'},{t:'out',s:'[1] Detección y Pixelado de Rostros  (Kafka+YOLOv8+PyTorch)'},{t:'out',s:'[2] Eficiencia Energética IoT         (Medallion+MLP+Flask)'},{t:'out',s:'[3] VenarIQ 🏆                        (3er Premio FP)'},{t:'out',s:'[4] Chatbot IA Fibromark              (Flutter+Firebase)'},{t:'sys',s:'Ver todos → github.com/VictorBledaBeneyto'}],
    contact:()=>[{t:'hi',s:'── Contacto ────────────────────────────────'},{t:'out',s:'Email:     vicblebe [at] gmail.com'},{t:'out',s:'LinkedIn:  linkedin.com/in/victor-bleda-beneyto'},{t:'out',s:'GitHub:    github.com/VictorBledaBeneyto'}],
    hire:()=>{setTimeout(()=>{closeRetro();showHireOverlay();},300);return[{t:'sys',s:'Activando modo contratación... 🚀'}];},
    clear:()=>{retroBody.innerHTML='';return[];},
    exit:()=>{setTimeout(closeRetro,200);return[{t:'sys',s:'Cerrando terminal...'}];},
};
const RETRO_BOOT=[{t:'sys',s:'VICTOR_OS v2026.1 — Cargando módulos...'},{t:'sys',s:'[OK] Motor de IA                cargado'},{t:'sys',s:'[OK] Stack tecnológico          listo'},{t:'sys',s:'[OK] Proyectos                  indexados'},{t:'sys',s:'────────────────────────────────────────'},{t:'hi',s:'Bienvenido/a. Escribe "help" para empezar.'}];
function retroLine(type,text){const d=document.createElement('div');d.className='retro-line '+type;d.textContent=text;retroBody.appendChild(d);retroBody.scrollTop=retroBody.scrollHeight;}
let retroHistory=[],retroHistIdx=-1;
function openRetro(){retroOverlay.classList.add('show');if(retroBody.children.length===0)RETRO_BOOT.forEach((l,i)=>setTimeout(()=>retroLine(l.t,l.s),i*80));setTimeout(()=>retroInput.focus(),100);}
function closeRetro(){retroOverlay.classList.remove('show');}
retroInput.addEventListener('keydown',e=>{
    if(e.key==='Enter'){const raw=retroInput.value.trim();retroInput.value='';if(!raw)return;retroHistory.unshift(raw);retroHistIdx=-1;retroLine('cmd','$ '+raw);const fn=RETRO_CMDS[raw.toLowerCase()];if(fn){const lines=fn();lines.forEach((l,i)=>setTimeout(()=>retroLine(l.t,l.s),i*40));}else retroLine('err','Comando no reconocido: "'+raw+'". Prueba "help".');}
    else if(e.key==='ArrowUp'){retroHistIdx=Math.min(retroHistIdx+1,retroHistory.length-1);retroInput.value=retroHistory[retroHistIdx]||'';e.preventDefault();}
    else if(e.key==='ArrowDown'){retroHistIdx=Math.max(retroHistIdx-1,-1);retroInput.value=retroHistIdx>=0?retroHistory[retroHistIdx]:'';e.preventDefault();}
});

// SVG name glitch on click
const nameSvg=document.getElementById('name-svg-el');
if(nameSvg){
    nameSvg.style.pointerEvents='auto';nameSvg.style.cursor='pointer';
    let glitching=false;
    nameSvg.addEventListener('click',()=>{
        if(glitching)return;glitching=true;
        const orig=nameSvg.textContent,gc='█▓▒░▄▌▐■□▀▙';let steps=0;
        const iv=setInterval(()=>{nameSvg.textContent=[...orig].map(c=>c===' '?' ':(Math.random()>.5?gc[Math.random()*gc.length|0]:c)).join('');if(++steps>12){clearInterval(iv);nameSvg.textContent=orig;glitching=false;}},65);
    });
}

// ══════════════════════════════════════════════════════
// KEYBOARD LISTENER
// ══════════════════════════════════════════════════════
let typedBuf='';
document.addEventListener('keydown',e=>{
    if(e.target===retroInput)return;
    if(e.key==='Escape' && retroOverlay.classList.contains('show')){closeRetro();return;}
    if(e.key==='Enter'  && !retroOverlay.classList.contains('show')){openRetro();return;}
    if(e.key==='Enter'  &&  retroOverlay.classList.contains('show')){closeRetro();return;}
    if(e.keyCode===KONAMI[kIdx]){kIdx++;if(kIdx===KONAMI.length){kIdx=0;startMatrix();}}else kIdx=0;
    typedBuf=(typedBuf+e.key.toLowerCase()).slice(-20);
    if(typedBuf.includes('caer'))       launchGravity();
    if(typedBuf.includes('contratame')) showHireOverlay();
    if(typedBuf.includes('matrix'))     startMatrix();
    if(typedBuf.includes('terminal'))   openRetro();
});
