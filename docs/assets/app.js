/* Veralba site: language selection, text rendering, scroll reveal, contact form. */
(function () {
  const LANGS = [
    ['tr', 'Türkçe', 'tr-tr'], ['en', 'English', 'en-us'], ['de', 'Deutsch', 'de-de'], ['es', 'Español', 'es-es'],
    ['fr', 'Français', 'fr-fr'], ['it', 'Italiano', 'it-it'], ['pt-BR', 'Português (Brasil)', 'pt-br'],
    ['id', 'Bahasa Indonesia', 'id-id'], ['ja', '日本語', 'ja-jp'], ['ko', '한국어', 'ko-kr'],
    ['zh-Hans', '简体中文', 'zh-cn'], ['ar', 'العربية', 'ar-sa']
  ];
  const CODES = LANGS.map(l => l[0]);
  const APP_URL = 'https://apps.apple.com/app/id6820856000';
  const MAIL = 'ozgurcocuk9@gmail.com';
  const KEY = 'veralba.lang';

  function pickLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q && CODES.includes(q)) return q;
    try { const s = localStorage.getItem(KEY); if (s && CODES.includes(s)) return s; } catch (e) {}
    for (const n of (navigator.languages || [navigator.language || 'en'])) {
      const l = n.toLowerCase();
      if (l.startsWith('zh')) return 'zh-Hans';
      if (l.startsWith('pt')) return 'pt-BR';
      if (l.startsWith('in') || l.startsWith('id')) return 'id';
      const hit = CODES.find(c => c.toLowerCase() === l.split('-')[0]);
      if (hit) return hit;
    }
    return 'en';
  }

  function load(lang) {
    return new Promise((ok, fail) => {
      if (window.I18N && window.I18N[lang]) return ok(window.I18N[lang]);
      const s = document.createElement('script');
      s.src = 'assets/i18n/' + lang + '.js?v=1';
      s.onload = () => ok(window.I18N[lang]);
      s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  const get = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Light inline markup: **bold**, links and the contact address.
  const rich = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(https?:\/\/[^\s<)]+)/g, '<a class="lnk" href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(new RegExp(MAIL.replace('.', '\\.'), 'g'), '<a class="lnk" href="mailto:' + MAIL + '">' + MAIL + '</a>');

  const ICONS = {
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
    alarm: '<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 2M5 4L2.5 6.5M19 4l2.5 2.5"/>',
    home: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 10h8M8 14h5"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    cloud: '<path d="M7 18a4 4 0 0 1-.6-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9H7z"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    wave: '<path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    battery: '<rect x="3" y="7" width="16" height="10" rx="3"/><path d="M22 11v2M7 10v4M11 10v4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>'
  };
  const icon = (n, s = 20) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[n] || ICONS.spark) + '</svg>';
  const phone = (lang, shot, alt, sm) => '<div class="phone' + (sm ? ' sm' : '') + '"><span class="btns"></span><span class="btns v2"></span><div class="screen"><img src="assets/shots/' + lang + '/' + shot + '.webp" alt="' + esc(alt) + '" loading="lazy" decoding="async"></div></div>';

  function badge() {
    const t = window.T || {};
    return '<a class="appstore" href="' + APP_URL + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.86-.76-1.47.02-2.83.86-3.59 2.17-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.59 2.24 2.72 2.2 1.1-.04 1.51-.7 2.83-.7 1.32 0 1.7.7 2.85.68 1.18-.02 1.92-1.07 2.64-2.13.83-1.22 1.17-2.41 1.19-2.47-.03-.01-2.28-.87-2.3-3.46zM14.2 6.13c.6-.73 1-1.74.9-2.75-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.67-.92 2.66.97.07 1.96-.49 2.56-1.22z"/></svg><span><small>' + esc((t.badge || {}).small || 'Download on the') + '</small><b>' + esc((t.badge || {}).big || 'App Store') + '</b></span></a>';
  }

  function render(t, lang) {
    const doc = document.documentElement;
    doc.lang = lang;
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const page = document.body.dataset.page;
    const titles = { home: t.meta.title, privacy: t.privacy.title + ' · Veralba', terms: t.terms.title + ' · Veralba', contact: t.contact.title + ' · Veralba' };
    document.title = titles[page] || t.meta.title;
    const md = document.querySelector('meta[name=description]');
    if (md) md.content = t.meta.desc;

    document.querySelectorAll('[data-i]').forEach(el => { const v = get(t, el.dataset.i); if (v != null) el.textContent = v; });
    document.querySelectorAll('[data-ih]').forEach(el => { const v = get(t, el.dataset.ih); if (v != null) el.innerHTML = rich(v); });
    document.querySelectorAll('[data-ph]').forEach(el => { const v = get(t, el.dataset.ph); if (v != null) el.placeholder = v; });
    window.T = t;
    document.querySelectorAll('[data-badge]').forEach(el => { el.innerHTML = badge(); });
    document.querySelectorAll('[data-lang-label]').forEach(el => { el.textContent = (LANGS.find(l => l[0] === lang) || [])[1]; });
    document.querySelectorAll('.langs button').forEach(b => b.classList.toggle('sel', b.dataset.lang === lang));
    document.querySelectorAll('a[data-keep]').forEach(a => { const u = new URL(a.getAttribute('href'), location.href); u.searchParams.set('lang', lang); a.href = u.pathname.split('/').pop() + u.search + u.hash; });

    if (page === 'home') renderHome(t, lang);
    if (page === 'privacy') renderDoc(t.privacy);
    if (page === 'terms') renderDoc(t.terms);
    if (page === 'contact') renderContact(t);
    reveal();
  }

  function renderHome(t, lang) {
    const hero = document.getElementById('hero-phone');
    if (hero) hero.innerHTML = phone(lang, 'home', t.f[3].t);
    const shots = ['wake', 'onboarding', 'editor', 'home', 'settings', 'night'];
    const icons = ['shield', 'spark', 'alarm', 'home', 'sliders', 'moon'];
    document.getElementById('features').innerHTML = t.f.map((f, i) =>
      '<div class="feat"><div class="feat-text rv"><span class="k"><i>' + icon(icons[i], 16) + '</i>' + esc(f.k) + '</span><h3>' + esc(f.t) + '</h3><p>' + esc(f.d) + '</p><ul>' +
      f.b.map(b => '<li>' + esc(b) + '</li>').join('') + '</ul></div><div class="feat-media rv d1"><div class="halo"></div>' + phone(lang, shots[i], f.t, true) + '</div></div>').join('');
    const gi = ['cloud', 'cal', 'wave', 'music', 'chart', 'lock', 'battery', 'eye', 'globe'];
    document.getElementById('grid').innerHTML = t.grid.items.map((g, i) =>
      '<div class="card rv d' + (i % 3) + '"><div class="ic">' + icon(gi[i], 22) + '</div><h4>' + esc(g.t) + '</h4><p>' + esc(g.d) + '</p></div>').join('');
    document.getElementById('steps').innerHTML = t.how.steps.map((s, i) => '<div class="step rv d' + i + '"><h4>' + esc(s.t) + '</h4><p>' + esc(s.d) + '</p></div>').join('');
    const mark = v => v === true ? '<span class="y">✓</span>' : v === false ? '<span class="n">—</span>' : esc(v);
    document.getElementById('pro-table').innerHTML = '<div class="pro-row"><div></div><div>' + esc(t.pro.free) + '</div><div class="p">Pro</div></div>' +
      t.pro.rows.map(r => '<div class="pro-row"><div>' + esc(r[0]) + '</div><div>' + mark(r[1]) + '</div><div>' + mark(r[2]) + '</div></div>').join('');
    document.getElementById('faq').innerHTML = t.faq.items.map(q => '<details class="rv"><summary>' + esc(q.q) + '</summary><p>' + rich(q.a) + '</p></details>').join('');
    const c = t.loop;
    document.getElementById('loop').innerHTML =
      '<div class="loop-card rv"><h3>' + esc(c.ordinary) + '</h3><div class="chain">' + c.bad.map((n, i) => (i ? '<span class="arr">→</span>' : '') + '<span class="node' + (i === c.bad.length - 1 ? ' bad' : '') + '">' + esc(n) + '</span>').join('') + '</div></div>' +
      '<div class="loop-card win rv d1"><h3>Veralba</h3><div class="chain">' + c.good.map((n, i) => (i ? '<span class="arr">→</span>' : '') + '<span class="node' + (i === c.good.length - 1 ? ' end' : '') + '">' + esc(n) + '</span>').join('') + '</div></div>';
  }

  function renderDoc(d) {
    document.getElementById('doc-body').innerHTML = d.sections.map((s, i) =>
      '<div class="block rv"><h2><span>' + (i + 1) + '</span>' + esc(s.h) + '</h2>' +
      (s.p || []).map(p => '<p>' + rich(p) + '</p>').join('') +
      (s.l ? '<ul>' + s.l.map(x => '<li>' + rich(x) + '</li>').join('') + '</ul>' : '') + '</div>').join('');
  }

  function renderContact(t) {
    const sel = document.getElementById('topic');
    const cur = sel.value;
    sel.innerHTML = t.contact.topics.map((x, i) => '<option value="' + esc(x) + '"' + (i === 0 ? '' : '') + '>' + esc(x) + '</option>').join('');
    if (cur) sel.selectedIndex = Math.max(0, [...sel.options].findIndex(o => o.value === cur));
    document.getElementById('c-list').innerHTML = t.contact.tips.map(x => '<li>' + esc(x) + '</li>').join('');
  }

  function reveal() {
    const els = document.querySelectorAll('.rv:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach(e => io.observe(e));
  }

  function setLang(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    const u = new URL(location.href); u.searchParams.set('lang', lang); history.replaceState(null, '', u);
    return load(lang).then(t => { window.T = t; window.LANG = lang; render(t, lang); });
  }

  function chrome() {
    const nav = document.querySelector('nav.top');
    const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10 || nav.classList.contains('solid'));
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    document.querySelector('.burger').addEventListener('click', () => nav.classList.toggle('menu-open'));
    document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('menu-open')));
    document.querySelectorAll('.dd>button').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      const dd = b.parentElement, open = dd.classList.contains('open');
      document.querySelectorAll('.dd.open').forEach(x => x.classList.remove('open'));
      if (!open) dd.classList.add('open');
    }));
    document.addEventListener('click', () => document.querySelectorAll('.dd.open').forEach(x => x.classList.remove('open')));
    const menu = document.querySelector('.langs');
    menu.innerHTML = LANGS.map(l => '<button type="button" data-lang="' + l[0] + '" lang="' + l[0] + '">' + l[1] + '</button>').join('');
    menu.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { setLang(b.dataset.lang); nav.classList.remove('menu-open'); } });
    const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  }

  function form() {
    const f = document.querySelector('form.cform');
    if (!f) return;
    const st = document.getElementById('fstatus');
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const v = n => (f.elements.namedItem(n) || {}).value || '';
      if (v('_honey')) return;
      const t = window.T.contact, btn = f.querySelector('button[type=submit]');
      const data = { name: v('name').trim(), email: v('email').trim(), topic: v('topic'), device: v('device').trim(), message: v('message').trim(), language: window.LANG };
      if (!data.name || !data.email || !data.message) return;
      btn.disabled = true; btn.textContent = t.sending; st.className = 'fstatus hidden';
      try {
        const r = await fetch('https://formsubmit.co/ajax/' + MAIL, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, _subject: 'Veralba · ' + data.topic + ' · ' + data.name, _replyto: data.email, _template: 'table', _captcha: 'false' })
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || String(j.success) !== 'true') throw new Error('send');
        st.textContent = t.ok; st.className = 'fstatus ok'; f.reset();
      } catch (err) {
        const body = encodeURIComponent(data.message + '\n\n— ' + data.name + ' <' + data.email + '>' + (data.device ? '\n' + data.device : ''));
        st.innerHTML = esc(t.err) + ' <a class="lnk" href="mailto:' + MAIL + '?subject=' + encodeURIComponent('Veralba · ' + data.topic) + '&body=' + body + '">' + MAIL + '</a>';
        st.className = 'fstatus err';
      }
      btn.disabled = false; btn.textContent = t.send;
    });
  }

  document.addEventListener('DOMContentLoaded', () => { chrome(); form(); setLang(pickLang()).catch(() => setLang('en')); });
})();
