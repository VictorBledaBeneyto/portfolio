'use strict';

// ══════════════════════════════════════════════════════
// CONSOLE SIGNATURE
// ══════════════════════════════════════════════════════
console.log('%c🚀 Hola, desarrollador/a!','color:#00d4ff;font-size:22px;font-weight:bold;');
console.log(
    '%c¿Inspeccionando el código? Exactamente el perfil que busco.\n\n' +
    '  Víctor Bleda Beneyto — Dev de Software · IA & Big Data\n' +
    '  github.com/VictorBledaBeneyto\n' +
    '  linkedin.com/in/victor-bleda-beneyto\n\n' +
    '  TIP: Pulsa ` para abrir la terminal interactiva del CV',
    'color:#94a3b8;font-size:13px;line-height:2;font-family:monospace;'
);

// ══════════════════════════════════════════════════════
// EMAIL OBFUSCATION
// ══════════════════════════════════════════════════════
document.querySelectorAll('.email-obf').forEach(el => {
    const addr = el.dataset.u + '@' + el.dataset.d;
    if (el.tagName === 'A') {
        el.href = 'mailto:' + addr;
        if (!el.textContent.trim()) el.textContent = addr;
    } else {
        el.textContent = addr;
        el.addEventListener('click', () => { window.location.href = 'mailto:' + addr; });
    }
});

// ══════════════════════════════════════════════════════
// CURSOR
// ══════════════════════════════════════════════════════
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx+'px'; dot.style.top = my+'px'; });
(function moveCursorRing() {
    const rx = parseFloat(ring.style.left||0), ry = parseFloat(ring.style.top||0);
    ring.style.left = (rx+(mx-rx)*.18)+'px'; ring.style.top = (ry+(my-ry)*.18)+'px';
    requestAnimationFrame(moveCursorRing);
})();
document.querySelectorAll('a,button,.skill-tag,.project-card,.edu-card,.soft-card,.contact-pill').forEach(el => {
    el.addEventListener('mouseenter', () => ring.style.transform='translate(-50%,-50%) scale(1.7)');
    el.addEventListener('mouseleave', () => ring.style.transform='translate(-50%,-50%) scale(1)');
});

// ══════════════════════════════════════════════════════
// TYPEWRITER
// ══════════════════════════════════════════════════════
const PHRASES = ['Desarrollador de Software','Especialista en IA & Big Data','Arquitecturas Distribuidas','Visión Artificial · PyTorch','Event-Driven · Kafka · Docker'];
let pIdx=0,cIdx=0,deleting=false;
const typedEl=document.getElementById('typed-text');
function typeWriter(){
    const ph=PHRASES[pIdx];
    if(!deleting){
        typedEl.textContent=ph.slice(0,++cIdx);
        if(cIdx===ph.length){deleting=true;setTimeout(typeWriter,1800);return;}
        setTimeout(typeWriter,55);
    } else {
        typedEl.textContent=ph.slice(0,--cIdx);
        if(cIdx===0){deleting=false;pIdx=(pIdx+1)%PHRASES.length;setTimeout(typeWriter,300);return;}
        setTimeout(typeWriter,28);
    }
}
typeWriter();

// ══════════════════════════════════════════════════════
// SCROLL COUNTERS
// ══════════════════════════════════════════════════════
const counterObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
        if(!e.isIntersecting)return;
        const el=e.target,end=+el.dataset.target,step=Math.ceil(end/30);
        let cur=0;
        const iv=setInterval(()=>{
            cur=Math.min(cur+step,end);
            el.textContent=cur+(end>5?'+':'');
            if(cur>=end)clearInterval(iv);
        },50);
        counterObs.unobserve(el);
    });
},{threshold:.5});
document.querySelectorAll('.stat-num[data-target]').forEach(c=>counterObs.observe(c));

// ══════════════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════════════
const revealObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='none';}});
},{threshold:.1});
document.querySelectorAll('.project-card,.edu-card,.soft-card,.timeline-item').forEach(el=>{
    el.style.opacity='0';el.style.transform='translateY(24px)';
    el.style.transition='opacity .55s ease,transform .55s ease';
    revealObs.observe(el);
});

// ══════════════════════════════════════════════════════
// CURSOR SPARK TRAIL
// ══════════════════════════════════════════════════════
let lastSpark=0;
const SC=['#00d4ff','#7c3aed','#00ff88','#fff','#f59e0b'];
document.addEventListener('mousemove',e=>{
    const now=Date.now();if(now-lastSpark<45)return;lastSpark=now;
    const el=document.createElement('div');el.className='spark';
    el.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;width:5px;height:5px;background:${SC[Math.random()*5|0]};`;
    document.body.appendChild(el);
    el.animate([{opacity:1,transform:'translate(-50%,-50%) scale(1)'},{opacity:0,transform:`translate(calc(-50% + ${(Math.random()-.5)*24}px),calc(-50% + ${(Math.random()-.5)*24}px)) scale(0)`}],{duration:520,fill:'forwards'}).onfinish=()=>el.remove();
});

// ══════════════════════════════════════════════════════
// SKILL TAG BURST (click any skill tag)
// ══════════════════════════════════════════════════════
const BURSTC=['#00d4ff','#7c3aed','#ff4081','#00ff88','#f59e0b','#fff'];
document.querySelectorAll('.skill-tag').forEach(tag=>{
    tag.addEventListener('click',function(e){
        const rect=this.getBoundingClientRect();
        for(let i=0;i<14;i++){
            const s=document.createElement('div');
            s.style.cssText=`position:fixed;left:${rect.left+rect.width/2}px;top:${rect.top+rect.height/2}px;width:6px;height:6px;border-radius:50%;background:${BURSTC[Math.random()*BURSTC.length|0]};pointer-events:none;z-index:999;`;
            document.body.appendChild(s);
            const angle=(i/14)*2*Math.PI;
            const dist=35+Math.random()*30;
            s.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`,opacity:0}],{duration:550,easing:'ease-out',fill:'forwards'}).onfinish=()=>s.remove();
        }
    });
});

// ══════════════════════════════════════════════════════
// INACTIVITY CHARACTER — SVG stick figure with CHAIR
// ══════════════════════════════════════════════════════
const idleEl=document.getElementById('idle-char');
const idleBubble=document.getElementById('idle-bubble');
const cp={
    chair:document.getElementById('g-chair'),tomb:document.getElementById('g-tomb'),
    beard:document.getElementById('g-beard'),body:document.getElementById('g-body'),
    mouth:document.getElementById('c-mouth'),armR:document.getElementById('c-arm-r'),
    armL:document.getElementById('c-arm-l'),legLU:document.getElementById('c-leg-lu'),
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
        a(cp.sweat,{opacity:1});a(cp.mouth,{d:'M35,22 Q40,19 45,22'});
        a(cp.armL,{x2:18,y2:42});
        if(s===3)a(cp.beard,{opacity:1});
    } else if(s===4){a(cp.body,{opacity:0});a(cp.chair,{opacity:0});a(cp.tomb,{opacity:1});}
}
let idleTimer=null;
const STAGES=[
    {delay:5000,state:1,msg:'¿Sigues ahí? El scroll no se mueve 👀'},
    {delay:5000,state:2,msg:'process.sleep(∞)... ¿Qué está pasando? 🤔'},
    {delay:5000,state:3,msg:'git blame — ¿cuánto llevas sin scroll? 🧔'},
    {delay:5000,state:4,msg:'404: User Not Found. R.I.P.'},
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
['mousemove','mousedown','keydown','scroll','touchstart'].forEach(ev=>document.addEventListener(ev,resetIdle,{passive:true}));
resetIdle();

// ══════════════════════════════════════════════════════
// EGG 1 — GRAVITY: bloques reales de texto de la página caen
// Activación: doble-clic · escribir "caer"
// ══════════════════════════════════════════════════════
let gravityActive=false;
function launchGravity(){
    if(gravityActive)return;
    gravityActive=true;

    // Selectores de todos los bloques de texto con contenido real
    const SEL=[
        '.section-title','.section-label',
        '.timeline-role','.timeline-company','.timeline-date',
        '.timeline-bullets li',
        '.project-title','.project-desc','.project-award','.stack-tag',
        '.skill-tag',
        '.edu-name','.edu-inst','.edu-year',
        '.soft-name',
        '.hero-tag','.hero-desc','.stat-label',
        '.hero-name',
    ].join(',');

    const nodes=[...document.querySelectorAll(SEL)];
    let delay=0;

    nodes.forEach(el=>{
        const rect=el.getBoundingClientRect();
        // Saltar si no es visible en el viewport actual
        if(!rect.width||!rect.height)return;
        if(rect.bottom<-60||rect.top>innerHeight+60)return;

        const cs=getComputedStyle(el);
        setTimeout(()=>{
            const clone=document.createElement('div');
            clone.className='gravity-char';
            clone.textContent=el.textContent.trim().slice(0,90);
            // Posición inicial = posición real en pantalla (fixed)
            clone.style.cssText=`
                left:${rect.left}px;top:${rect.top}px;
                font-size:${cs.fontSize};font-weight:${cs.fontWeight};
                color:${cs.color};font-family:${cs.fontFamily};
                max-width:${rect.width+20}px;line-height:1.4;
                text-shadow:0 0 10px currentColor;white-space:nowrap;overflow:hidden;
            `;
            document.body.appendChild(clone);

            let x=rect.left, y=rect.top;
            let vx=(Math.random()-.5)*5;
            let vy=-(Math.random()*9+2);   // impulso inicial hacia arriba
            let r=0, rv=(Math.random()-.5)*9;

            (function fall(){
                vy+=.42; x+=vx; y+=vy; r+=rv;
                clone.style.left=x+'px';
                clone.style.top=y+'px';
                clone.style.transform=`rotate(${r}deg)`;
                if(y<innerHeight+120) requestAnimationFrame(fall);
                else clone.remove();
            })();
        }, delay);
        delay+=35;
    });

    setTimeout(()=>{gravityActive=false;},9000);
}
let tclickCount=0,tclickTimer=null;
document.addEventListener('click',()=>{
    tclickCount++;clearTimeout(tclickTimer);
    tclickTimer=setTimeout(()=>{tclickCount=0;},420);
    if(tclickCount>=3){tclickCount=0;launchFireworksRandom();}
});

// ══════════════════════════════════════════════════════
// EGG 2 — MATRIX RAIN (Konami code: ↑↑↓↓←→←→BA)
// ══════════════════════════════════════════════════════
const KONAMI=[38,38,40,40,37,39,37,39,66,65];
let kIdx=0,matrixInt=null;
function startMatrix(){
    const cvs=document.getElementById('matrix-canvas');
    if(cvs.style.display==='block'){stopMatrix();return;}
    cvs.style.display='block';cvs.width=innerWidth;cvs.height=innerHeight;
    const ctx=cvs.getContext('2d'),cols=Math.floor(innerWidth/14)|0,drops=new Array(cols).fill(1);
    const TECH='PYTHONKAFKADOCKERAWSYOLOSQLGITMLPFLASKKOTLINJAVAαβγδ01'.split('');
    matrixInt=setInterval(()=>{
        ctx.fillStyle='rgba(0,0,0,.06)';ctx.fillRect(0,0,cvs.width,cvs.height);ctx.font='14px monospace';
        drops.forEach((y,i)=>{
            ctx.fillStyle=i%7===0?'#00ffff':'#00cc44';
            ctx.fillText(TECH[Math.random()*TECH.length|0],i*14,y*14);
            if(y*14>cvs.height&&Math.random()>.975)drops[i]=0;
            drops[i]++;
        });
    },38);
    setTimeout(stopMatrix,8000);
}
function stopMatrix(){
    clearInterval(matrixInt);matrixInt=null;
    const cvs=document.getElementById('matrix-canvas');
    cvs.style.display='none';cvs.getContext('2d').clearRect(0,0,cvs.width,cvs.height);
}

// ══════════════════════════════════════════════════════
// EGG 3 — HIRE ME + CONFETTI (type "contratame")
// ══════════════════════════════════════════════════════
const CONF_COLS=['#00d4ff','#7c3aed','#ff4081','#00ff88','#f59e0b','#fff'];
function showHireOverlay(){document.getElementById('hire-overlay').classList.add('show');for(let i=0;i<90;i++)setTimeout(launchConfetti,Math.random()*1200);}
function closeHire(){document.getElementById('hire-overlay').classList.remove('show');}
function launchConfetti(){
    const el=document.createElement('div');el.className='confetti';
    el.style.cssText=`left:${Math.random()*100}vw;background:${CONF_COLS[Math.random()*CONF_COLS.length|0]};width:${Math.random()*10+5}px;height:${Math.random()*6+4}px;border-radius:${Math.random()>.5?'50%':'3px'};`;
    document.body.appendChild(el);
    el.animate([{transform:`translateY(0) rotate(0deg)`,opacity:1},{transform:`translateY(${innerHeight+20}px) translateX(${(Math.random()-.5)*350}px) rotate(${Math.random()*720}deg)`,opacity:0}],{duration:Math.random()*2000+1400,easing:'cubic-bezier(.25,.46,.45,.94)',fill:'forwards'}).onfinish=()=>el.remove();
}

// ══════════════════════════════════════════════════════
// EGG 4 — FIREWORKS (triple-click → posición aleatoria)
// ══════════════════════════════════════════════════════
const FW_COLS=['#00d4ff','#7c3aed','#ff4081','#00ff88','#f59e0b','#fff','#ff6b6b'];
function launchFireworksRandom(){
    const x=Math.random()*innerWidth;
    const y=Math.random()*innerHeight*.6;
    launchFireworks(x,y);
}
function launchFireworks(x,y){
    for(let i=0;i<22;i++){
        const el=document.createElement('div');
        const sz=Math.random()*7+4;
        el.style.cssText=`position:fixed;left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;background:${FW_COLS[Math.random()*FW_COLS.length|0]};border-radius:50%;pointer-events:none;z-index:450;transform:translate(-50%,-50%);`;
        document.body.appendChild(el);
        const angle=(i/22)*2*Math.PI+Math.random()*.3;
        const dist=60+Math.random()*100;
        el.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`,opacity:0}],{duration:500+Math.random()*400,easing:'ease-out',fill:'forwards'}).onfinish=()=>el.remove();
    }
}
document.addEventListener('dblclick',e=>{
    if(e.target.closest('#retro-overlay')||e.target.closest('#hire-overlay'))return;
    launchGravity();
});

// ══════════════════════════════════════════════════════
// EGG 5 — RETRO TERMINAL CV (press ` or type "terminal")
// ══════════════════════════════════════════════════════
const retroOverlay=document.getElementById('retro-overlay');
const retroBody=document.getElementById('retro-body');
const retroInput=document.getElementById('retro-input');

function rl(type,text){
    const d=document.createElement('div');d.className='rl '+type;d.textContent=text;
    retroBody.appendChild(d);retroBody.scrollTop=retroBody.scrollHeight;
}

const CMDS={
    help:()=>[
        {t:'hi',s:'Comandos disponibles:'},
        {t:'out',s:'  whoami        — quién soy'},
        {t:'out',s:'  skills        — stack tecnológico'},
        {t:'out',s:'  ls projects   — proyectos'},
        {t:'out',s:'  cat exp.txt   — experiencia profesional'},
        {t:'out',s:'  contact       — cómo contactarme'},
        {t:'out',s:'  hire          — ¡activa modo contratación! 🎉'},
        {t:'out',s:'  clear         — limpiar terminal'},
        {t:'out',s:'  exit          — cerrar'},
    ],
    whoami:()=>[
        {t:'out',s:'Víctor Bleda Beneyto'},
        {t:'out',s:'Desarrollador de Software · IA & Big Data'},
        {t:'out',s:'Valencia / Madrid — disponibilidad para viajar'},
        {t:'sys',s:'github.com/VictorBledaBeneyto'},
        {t:'sys',s:'linkedin.com/in/victor-bleda-beneyto-4a9a90237/'},
    ],
    skills:()=>[
        {t:'hi', s:'─── Stack ───────────────────────────────────'},
        {t:'out',s:'Lenguajes:  Python · Java · Kotlin · Flutter · PHP · SQL'},
        {t:'out',s:'IA/Data:    PyTorch · YOLOv8 · ResNet-50 · Spark · MLP'},
        {t:'out',s:'Cloud:      AWS · Kafka · Docker · Firebase · MinIO'},
        {t:'out',s:'Tools:      Git · PostgreSQL · MySQL · Odoo · Power BI'},
    ],
    'ls projects':()=>[
        {t:'hi', s:'─── Proyectos ───────────────────────────────'},
        {t:'out',s:'[1] Detección y Pixelado de Rostros  — Kafka+YOLOv8+PyTorch'},
        {t:'out',s:'[2] Eficiencia Energética IoT         — Medallion+MLP+Flask'},
        {t:'out',s:'[3] VenarIQ 🏆                        — 3er Premio FP'},
        {t:'out',s:'[4] Chatbot IA Fibromark              — Flutter+Firebase'},
        {t:'sys',s:'→ github.com/VictorBledaBeneyto'},
    ],
    'cat exp.txt':()=>[
        {t:'hi', s:'─── Experiencia ─────────────────────────────'},
        {t:'out',s:'2025  Fibromark          — Dev Software (Prácticas)'},
        {t:'out',s:'2025  Grupo Moves        — Dev Software / SEO (Prácticas)'},
        {t:'out',s:'2022  Sermicro           — Técnico Informático'},
        {t:'out',s:'2021  CITAN Lisboa       — Técnico IT (Erasmus+)'},
        {t:'out',s:'2018  Accent/Abast       — Monitor Tiempo Libre'},
        {t:'out',s:'2019  Lems               — Auxiliar Administrativo'},
    ],
    contact:()=>[
        {t:'hi', s:'─── Contacto ────────────────────────────────'},
        {t:'out',s:'Email:    vicblebe [at] gmail.com'},
        {t:'sys',s:'LinkedIn: linkedin.com/in/victor-bleda-beneyto-4a9a90237/'},
        {t:'sys',s:'GitHub:   github.com/VictorBledaBeneyto'},
    ],
    hire:()=>{ setTimeout(()=>{closeRetro();showHireOverlay();},300); return [{t:'sys',s:'Activando modo contratación... 🚀'}]; },
    clear:()=>{retroBody.innerHTML='';return[];},
    exit:()=>{setTimeout(closeRetro,200);return[{t:'sys',s:'Cerrando terminal...'}];},
};

const BOOT=[
    {t:'sys',s:'VICTOR_CV v2026 — Iniciando módulos...'},
    {t:'sys',s:'[OK] IA & Big Data          listo'},
    {t:'sys',s:'[OK] Stack tecnológico      cargado'},
    {t:'sys',s:'[OK] Proyectos              indexados'},
    {t:'sys',s:'──────────────────────────────────────'},
    {t:'hi', s:'Bienvenido/a. Escribe "help" para empezar.'},
];

let retroHistory=[],retroHistIdx=-1;
function openRetro(){
    retroOverlay.classList.add('show');
    if(retroBody.children.length===0) BOOT.forEach((l,i)=>setTimeout(()=>rl(l.t,l.s),i*80));
    setTimeout(()=>retroInput.focus(),120);
}
function closeRetro(){retroOverlay.classList.remove('show');}

retroInput.addEventListener('keydown',e=>{
    if(e.key==='Enter'){
        const raw=retroInput.value.trim();retroInput.value='';
        if(!raw)return;
        retroHistory.unshift(raw);retroHistIdx=-1;
        rl('cmd','$ '+raw);
        const fn=CMDS[raw.toLowerCase()];
        if(fn){const lines=fn();lines.forEach((l,i)=>setTimeout(()=>rl(l.t,l.s),i*40));}
        else rl('err','Comando desconocido: "'+raw+'". Prueba "help".');
    } else if(e.key==='ArrowUp'){
        retroHistIdx=Math.min(retroHistIdx+1,retroHistory.length-1);
        retroInput.value=retroHistory[retroHistIdx]||'';e.preventDefault();
    } else if(e.key==='ArrowDown'){
        retroHistIdx=Math.max(retroHistIdx-1,-1);
        retroInput.value=retroHistIdx>=0?retroHistory[retroHistIdx]:'';e.preventDefault();
    }
});

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
    if(typedBuf.includes('gitpush'))    deployVictor();
});

// ══════════════════════════════════════════════════════
// PITCH CHARACTER — personaje que aparece cada 60 s
// incitando a contratar a Víctor con frases persuasivas
// ══════════════════════════════════════════════════════
(function initPitch() {
    const pitchEl  = document.getElementById('pitch-char');
    const pitchBub = document.getElementById('pitch-bubble');
    const pitchSvg = document.getElementById('pitch-svg');

    // Referencias a partes del SVG
    const P = {
        al: document.getElementById('pal'),   // brazo izquierdo
        ar: document.getElementById('par'),   // brazo derecho
        ll: document.getElementById('pll'),   // pierna izquierda
        lr: document.getElementById('plr'),   // pierna derecha
        mo: document.getElementById('pm'),    // boca
        sg: document.getElementById('p-sign'),  // cartel HIRE ME
        ex: document.getElementById('p-excl'),  // signo !
    };

    // Mensajes + poses
    const PITCHES = [
        { msg:'Estamos hechos el uno para el otro...\ntú con una oferta, yo con código. 💼',      pose:'wide'    },
        { msg:'¿Sabes que me necesitas?\nTu instinto lo sabe. 😏',                                 pose:'hip'     },
        { msg:'Soy como Docker:\nencajo en cualquier entorno. 🐳',                                 pose:'excited' },
        { msg:'¿Has visto mi stack?\nPyTorch · Kafka · AWS ·YOLOv8...\n¿impresionante, verdad? 👀', pose:'point'  },
        { msg:'Tu competencia ya busca perfiles\ncomo el mío. Solo te lo digo. ⚡',               pose:'wide'    },
        { msg:'¿Aún no me has contratado?\ngit blame a tu departamento de RRHH. 😂',              pose:'hip'     },
        { msg:'No soy el héroe que mereces,\nsoy el dev que necesitas. 🦸',                        pose:'sign'    },
        { msg:'Spoiler: al final me contratan.\n¿Por qué no ser tú el primero? 🎬',               pose:'excited' },
        { msg:'Commits limpios,\ncódigo legible\ny disponible. 📬',                               pose:'wide'    },
        { msg:'Entre tú y yo:\nsoy exactamente lo que buscas,\ny lo que no sabías que buscabas. 💡', pose:'point' },
        { msg:'Erasmus+ en Lisboa, premios FP,\nIA & Big Data...\n¿qué más quieres ver? 🚀',      pose:'sign'    },
        { msg:'Cada minuto sin contratarme\nes un minuto perdido.\nEs matemática pura. 📊',       pose:'hip'     },
    ];

    function sp(el, attrs) { Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k,v)); }

    function setPose(pose) {
        // Reset a postura neutral
        sp(P.al, {x1:40,y1:38,x2:22,y2:52});
        sp(P.ar, {x1:40,y1:38,x2:58,y2:52});
        sp(P.ll, {x1:40,y1:62,x2:28,y2:88});
        sp(P.lr, {x1:40,y1:62,x2:52,y2:88});
        sp(P.mo, {d:'M35,20 Q40,24 45,20'});   // sonrisa
        sp(P.sg, {opacity:0}); sp(P.ex, {opacity:0});

        switch (pose) {
            case 'wide':    // brazos abiertos de par en par
                sp(P.al, {x2:6,  y2:36});
                sp(P.ar, {x2:74, y2:36}); break;

            case 'excited': // brazos arriba, piernas separadas, signo !
                sp(P.al, {x2:16, y2:16});
                sp(P.ar, {x2:64, y2:16});
                sp(P.ll, {x2:22, y2:86});
                sp(P.lr, {x2:58, y2:86});
                sp(P.ex, {opacity:1}); break;

            case 'hip':     // un brazo en cadera, otro señalando arriba
                sp(P.al, {x2:26, y2:48});
                sp(P.ar, {x2:66, y2:22}); break;

            case 'point':   // señalando hacia el visitante
                sp(P.al, {x2:22, y2:52});
                sp(P.ar, {x2:70, y2:34}); break;

            case 'sign':    // sosteniendo el cartel HIRE ME
                sp(P.ar, {x2:56, y2:46});
                sp(P.sg, {opacity:1}); break;
        }
    }

    let pitchIdx   = 0;
    let hideTimer  = null;

    function showPitch() {
        const p = PITCHES[pitchIdx % PITCHES.length];
        pitchIdx++;

        // Actualizar texto (soporte salto de línea con <br>)
        pitchBub.innerHTML = p.msg.replace(/\n/g, '<br>');
        setPose(p.pose);

        // Mostrar
        pitchEl.classList.remove('hide');
        pitchEl.classList.add('show');

        // Wobble de entrada al personaje
        pitchSvg.classList.remove('wobble');
        void pitchSvg.offsetWidth; // reflow para resetear animación
        pitchSvg.classList.add('wobble');

        // Auto-ocultar tras 9 segundos
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            pitchEl.classList.remove('show');
            pitchEl.classList.add('hide');
        }, 9000);
    }

    // Primera aparición a los 5 s, luego cada 60 s
    setTimeout(() => {
        showPitch();
        setInterval(showPitch, 60000);
    }, 5000);
})();

// ══════════════════════════════════════════════════════
// 👋 EXIT-INTENT — overlay cuando el ratón sale por arriba
// ══════════════════════════════════════════════════════
(function initExitIntent() {
    const overlay = document.getElementById('exit-overlay');
    let shown = false;
    let lastY  = 0;

    document.addEventListener('mousemove', e => { lastY = e.clientY; });

    document.addEventListener('mouseleave', e => {
        // Solo si sale por la parte superior (hacia barra del navegador)
        if (shown || e.clientY > 10) return;
        shown = true;
        overlay.classList.add('show');
    });

    // También cerrar con Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && overlay.classList.contains('show')) {
            overlay.classList.remove('show');
        }
    });

    // Click fuera de la card cierra el overlay
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('show');
    });

    // Al cerrar el overlay, resetear "shown" tras 3 min para que pueda volver a aparecer
    const observer = new MutationObserver(() => {
        if (!overlay.classList.contains('show') && shown) {
            setTimeout(() => { shown = false; }, 180000);
        }
    });
    observer.observe(overlay, { attributes:true, attributeFilter:['class'] });
})();

// ══════════════════════════════════════════════════════
// 🔒 HIDDEN EGG — "git push" deploy animation
// Activa escribiendo "gitpush" (sin espacio) con el teclado
// ══════════════════════════════════════════════════════
let deployActive = false;
function deployVictor() {
    if (deployActive) return;
    deployActive = true;

    const toast    = document.getElementById('deploy-toast');
    const lines    = document.getElementById('dt-lines');
    const bar      = document.getElementById('dt-bar');
    const success  = document.getElementById('dt-success');

    // Reset state
    lines.innerHTML = ''; bar.classList.remove('full'); success.style.display = 'none';
    toast.classList.add('show');

    const LOG = [
        { t:320,  txt:'Enumerating objects: 47, done.',       col:'#00ff41' },
        { t:700,  txt:'Compressing objects: 100% ████ done.', col:'#00ff41' },
        { t:1150, txt:'Writing objects: 100% ████ done.',     col:'#00ff41' },
        { t:1600, txt:'',                                      col:'' },
        { t:1800, txt:'remote: Building victor@dev...',       col:'#888' },
        { t:2300, txt:'remote: Running tests .......... ✓',   col:'#888' },
        { t:2900, txt:'remote: Deploying to production...',   col:'#888' },
    ];

    LOG.forEach(({ t, txt, col }) => {
        setTimeout(() => {
            if (!txt) { lines.innerHTML += '<br>'; return; }
            const span = document.createElement('span');
            span.style.color = col;
            span.textContent = txt;
            lines.appendChild(span);
            lines.appendChild(document.createElement('br'));
        }, t);
    });

    // Progress bar
    setTimeout(() => { bar.classList.add('full'); }, 1900);

    // Success line
    setTimeout(() => {
        success.style.display = 'block';
    }, 3300);

    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            lines.innerHTML = ''; bar.classList.remove('full'); success.style.display = 'none';
            deployActive = false;
        }, 400);
    }, 6500);
}

// ══════════════════════════════════════════════════════
// HAMBURGER MENU — mobile nav toggle
// ══════════════════════════════════════════════════════
(function() {
    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open);
    });

    // Close when a nav link is clicked
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
            links.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
})();

// ══════════════════════════════════════════════════════
// PAGE TRANSITIONS
// ══════════════════════════════════════════════════════
(function() {
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
})();
