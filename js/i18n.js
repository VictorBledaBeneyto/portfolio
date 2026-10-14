// selector de idioma ES / EN
// guarda el texto original en data-es y lo cambia por data-en; recuerda la elección
// y también acepta ?lang=en en la URL (útil para enviar el enlace a ofertas en inglés)
(function () {
    const KEY = 'portfolio-lang';
    const els = () => document.querySelectorAll('[data-en]');
    const links = () => document.querySelectorAll('[data-en-href]');

    function apply(lang) {
        els().forEach(el => {
            if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
            el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.es;
        });
        links().forEach(a => {
            if (a.dataset.esHref === undefined) a.dataset.esHref = a.getAttribute('href');
            a.setAttribute('href', lang === 'en' ? a.dataset.enHref : a.dataset.esHref);
        });
        document.documentElement.lang = lang;
        document.querySelectorAll('#lang-toggle .lang-opt').forEach(o =>
            o.classList.toggle('active', o.dataset.l === lang));
        try { localStorage.setItem(KEY, lang); } catch (e) {}
    }

    let lang = 'es';
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'es') lang = q;
    else { try { lang = localStorage.getItem(KEY) || 'es'; } catch (e) {} }
    apply(lang);

    const btn = document.getElementById('lang-toggle');
    if (btn) btn.addEventListener('click', () =>
        apply(document.documentElement.lang === 'en' ? 'es' : 'en'));
})();
