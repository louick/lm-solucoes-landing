/* LM Soluções · interações da landing */
const CONTATO = {
  whatsapp: '5591984791651',
  instagram: 'lm.solucoes_'
};

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wa = msg => `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(msg)}`;
  const igDM = `https://ig.me/m/${CONTATO.instagram}`;

  /* links de WhatsApp */
  $$('[data-wa]').forEach(a => a.href = wa(a.dataset.wa));

  /* toast */
  const toast = $('#toast'); let tT;
  const say = m => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tT); tT = setTimeout(() => toast.classList.remove('show'), 4200); };
  const copy = async txt => {
    try { await navigator.clipboard.writeText(txt); return true; }
    catch { const t = document.createElement('textarea'); t.value = txt; t.style.position = 'fixed'; t.style.opacity = 0; document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch {} t.remove(); return ok; }
  };
  const sendInstagram = async txt => {
    const ok = await copy(txt);
    say(ok ? 'Mensagem copiada! No Direct da LM, é só colar e enviar.' : 'Abrimos o Direct da LM. Escreva sua mensagem por lá.');
    setTimeout(() => window.open(igDM, '_blank', 'noopener'), 650);
  };

  /* nav */
  const nav = $('#nav'), burger = $('#burger'), menu = $('#navMobile');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', String(o)); nav.classList.toggle('open-bg', o); };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* revelar ao rolar */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(el => io.observe(el));
  $$('.ua-chart span').forEach((s, i) => s.style.setProperty('--i', i));
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { $('#steps').style.setProperty('--prog', 1); o.disconnect(); } }, { threshold: 0.3 }).observe($('#steps'));

  /* brilho que segue o mouse nos cards */
  $$('.card').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${e.clientX - r.left}px`);
    c.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));

  /* órbita */
  const orb = $('#orb'), stage = $('#orbStage');
  $$('.orbit span', orb).forEach(s => { s.innerHTML = `<em>${s.textContent}</em>`; });
  const sizeOrb = () => orb.style.setProperty('--R', `${orb.offsetWidth / 2}px`);
  sizeOrb(); addEventListener('resize', sizeOrb);
  if (fine && !reduce) {
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      orb.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
    });
    stage.addEventListener('pointerleave', () => orb.style.transform = '');
  }

  /* código digitando */
  const CODE = [
    ['c', '// sua ideia, em produção'],
    ['k', 'const '], ['', 'app = '], ['k', 'await '], ['f', 'lm.build'], ['', '({\n'],
    ['', '  cliente: '], ['s', "'você'"], ['', ',\n'],
    ['', '  stack: '], ['s', "'sob medida'"], ['', ',\n'],
    ['', '  prazo: '], ['s', "'combinado'"], ['', '\n});\n'],
    ['k', 'await '], ['', 'app.'], ['f', 'deploy'], ['', '();']
  ];
  const pre = $('#typed');
  const typeCode = () => {
    if (reduce) { pre.innerHTML = CODE.map(([c, t]) => c ? `<span class="${c}">${t}</span>` : t).map((h, i) => i === 0 ? h + '\n' : h).join(''); return; }
    let i = 0, j = 0, html = '';
    const step = () => {
      if (i >= CODE.length) { pre.innerHTML = html + '<span class="caret"></span>'; setTimeout(() => { html = ''; i = 0; j = 0; step(); }, 4200); return; }
      const [c, t] = CODE[i];
      j++;
      const part = t.slice(0, j);
      const shown = html + (c ? `<span class="${c}">${part}</span>` : part);
      pre.innerHTML = shown + '<span class="caret"></span>';
      if (j >= t.length) { html += (c ? `<span class="${c}">${t}</span>` : t) + (i === 0 ? '\n' : ''); i++; j = 0; }
      setTimeout(step, t[j - 1] === '\n' ? 140 : 32 + Math.random() * 40);
    };
    step();
  };
  typeCode();

  /* campo de pontos do hero */
  const cv = $('#field'), ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1, t = 0, mx = .5, my = .5, running = true;
  const size = () => { dpr = Math.min(devicePixelRatio || 1, 1.5); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener('resize', size);
  const C1 = [34, 162, 255], C2 = [108, 92, 255], C3 = [224, 43, 255];
  const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
  const colAt = k => k < .5 ? mix(C1, C2, k * 2) : mix(C2, C3, (k - .5) * 2);
  const COLS = 64, ROWS = 26;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const horizon = H * .5, fov = W * .7;
    for (let r = 0; r < ROWS; r++) {
      const z = 1.2 + r * .55;
      for (let c = 0; c < COLS; c++) {
        const xw = (c / (COLS - 1) - .5) * 26;
        const d = Math.hypot(c / COLS - mx, (1 - r / ROWS) - my);
        const yw = Math.sin(xw * .35 + t) * .55 + Math.cos(z * .55 - t * 1.3) * .45 + Math.exp(-d * d * 30) * -1.2;
        const sx = W / 2 + (xw * fov) / (z * 6), sy = horizon + ((2.2 - yw) * fov) / (z * 6);
        if (sx < -10 || sx > W + 10 || sy > H + 10) continue;
        const a = Math.max(0, 1 - r / ROWS) * .85;
        const [R, G, B] = colAt(c / (COLS - 1));
        ctx.fillStyle = `rgba(${R},${G},${B},${a})`;
        const s = Math.max(.6, 2.6 / z * 1.6);
        ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
      }
    }
  };
  const loop = () => { if (running) { t += .012; draw(); } requestAnimationFrame(loop); };
  if (reduce) draw(); else {
    new IntersectionObserver(([e]) => running = e.isIntersecting).observe(cv);
    if (fine) addEventListener('pointermove', e => { mx = e.clientX / innerWidth; my = 1 - e.clientY / innerHeight; }, { passive: true });
    loop();
  }

  /* stack */
  const STACK = [
    ['react', 'React', '#61DAFB'], ['nextdotjs', 'Next.js', '#ffffff'], ['typescript', 'TypeScript', '#3178C6'], ['nodedotjs', 'Node.js', '#5FA04E'],
    ['python', 'Python', '#3776AB'], ['fastapi', 'FastAPI', '#009688'], ['django', 'Django', '#44B78B'], ['laravel', 'Laravel', '#FF2D20'],
    ['flutter', 'Flutter', '#02569B'], ['kotlin', 'Kotlin', '#7F52FF'], ['swift', 'Swift', '#F05138'], ['tailwindcss', 'Tailwind', '#06B6D4'],
    ['postgresql', 'PostgreSQL', '#4169E1'], ['mysql', 'MySQL', '#4479A1'], ['mongodb', 'MongoDB', '#47A248'], ['redis', 'Redis', '#FF4438'],
    ['docker', 'Docker', '#2496ED'], ['kubernetes', 'Kubernetes', '#326CE5'], ['googlecloud', 'Google Cloud', '#4285F4'], ['cloudflare', 'Cloudflare', '#F38020'],
    ['openai', 'OpenAI', '#ffffff'], ['anthropic', 'Claude', '#D97757'], ['whatsapp', 'WhatsApp API', '#25D366'], ['figma', 'Figma', '#F24E1E'],
    ['supabase', 'Supabase', '#3FCF8E'], ['firebase', 'Firebase', '#FFCA28'], ['linux', 'Linux', '#FCC624'], ['nginx', 'Nginx', '#009639'],
    ['github', 'GitHub', '#ffffff'], ['vercel', 'Vercel', '#ffffff']
  ];
  $('#stackGrid').innerHTML = STACK.map(([f, n, c]) => `<div class="tech" style="--c:${c}"><i style="--m:url('assets/stack/${f}.svg')"></i><span>${n}</span></div>`).join('');

  /* ===== monte seu projeto ===== */
  const BASE = {
    'Sistema web': ['sistema-web', 'Next.js + Node.js + PostgreSQL', 2],
    'Aplicativo': ['app', 'Flutter (iOS e Android) + API Node.js', 3],
    'Loja online': ['loja', 'E-commerce com Pix integrado (base Buy+ ou sob medida)', 2],
    'Automação com IA': ['automacao-ia', 'Python + modelos de IA + integrações via API', 2],
    'Site institucional': ['site', 'Next.js estático, SEO e performance', 1],
    'Outra ideia': ['ideia', 'stack definida no diagnóstico', 2]
  };
  const HINT = {
    'Login e usuários': 'autenticação, perfis e permissões',
    'Painel administrativo': 'painel admin com controle total',
    'Pagamentos (Pix e cartão)': 'Pix, cartão e conciliação',
    'Integração com WhatsApp': 'API oficial do WhatsApp',
    'Relatórios e dashboards': 'relatórios e gráficos em tempo real',
    'Assistente com IA': 'agente de IA treinado nos seus dados',
    'Agenda e reservas': 'agenda, horários e lembretes',
    'Notificações push': 'push, e-mail e SMS',
    'Mapa e geolocalização': 'mapas, rotas e raio de busca',
    'Integração com ERP ou nota fiscal': 'ERP e emissão de nota fiscal',
    'Funciona offline': 'sincronização offline-first',
    'Várias empresas ou filiais': 'multiempresa e filiais'
  };
  const st = { tipo: 'Sistema web', recursos: new Set(['Login e usuários', 'Painel administrativo']), prazo: 'Nos próximos meses' };
  const radio = (id, key) => $$(`#${id} button`).forEach(b => b.addEventListener('click', () => {
    $$(`#${id} button`).forEach(x => x.setAttribute('aria-checked', String(x === b)));
    st[key] = b.dataset.v; renderBuild();
  }));
  radio('tipo', 'tipo'); radio('prazo', 'prazo');
  $$('#recursos button').forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    on ? st.recursos.add(b.dataset.v) : st.recursos.delete(b.dataset.v);
    renderBuild();
  }));

  const brief = () => [
    'Olá, LM Soluções! Montei meu projeto pelo site:',
    `• Tipo: ${st.tipo}`,
    `• Recursos: ${st.recursos.size ? [...st.recursos].join(', ') : 'a definir'}`,
    `• Prazo: ${st.prazo}`,
    'Podemos conversar?'
  ].join('\n');

  let typer;
  const renderBuild = () => {
    const [slug, stack, base] = BASE[st.tipo];
    const mods = [...st.recursos];
    const score = base + mods.length;
    const cx = score <= 3 ? 'Baixa' : score <= 7 ? 'Média' : 'Alta';
    const cycles = Math.max(1, Math.ceil(mods.length / 3));
    $('#mMods').textContent = mods.length + 1;
    $('#mCx').textContent = cx;
    $('#mFases').textContent = 3 + cycles;

    const cmd = `lm new seu-projeto --tipo=${slug}`;
    const lines = [
      ['dim', '› lendo requisitos...'],
      ['ok', `✓ base · ${stack}`],
      ...mods.map(m => ['ok', `✓ módulo · ${HINT[m]}`]),
      ['dim', `› segurança, backups e LGPD incluídos`],
      ['bl', `› fases · descoberta → design → ${cycles} ${cycles > 1 ? 'ciclos' : 'ciclo'} de dev → lançamento`],
      ['', `› prazo desejado · ${st.prazo.toLowerCase()}`],
      ['hl', '● projeto pronto para conversar com a equipe LM']
    ];
    const out = $('#tOut'), c = $('#tCmd');
    clearInterval(typer);
    out.innerHTML = '';
    let k = 0;
    const done = () => { out.innerHTML = lines.map(([cl, tx], i) => `<p class="${cl}" style="animation-delay:${i * 70}ms">${tx}</p>`).join(''); };
    if (reduce) { c.textContent = cmd; done(); }
    else typer = setInterval(() => { k += 2; c.textContent = cmd.slice(0, k); if (k >= cmd.length) { clearInterval(typer); done(); } }, 14);

    $('#sendWa').href = wa(brief());
  };
  renderBuild();

  /* formulário → Instagram */
  const form = $('#cForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    let bad = false;
    ['nome', 'msg'].forEach(n => { const el = form.elements[n]; const v = !f[n].trim(); el.classList.toggle('bad', v); if (v) bad = true; });
    if (bad) { say('Preencha seu nome e conte um pouco da ideia.'); form.querySelector('.bad').focus(); return; }
    const txt = [
      `Olá, LM Soluções! Vim pelo site.`,
      `Nome: ${f.nome.trim()}${f.empresa.trim() ? ` (${f.empresa.trim()})` : ''}`,
      f.fone.trim() ? `WhatsApp: ${f.fone.trim()}` : '',
      `Projeto: ${f.tipo}`,
      `Ideia: ${f.msg.trim()}`
    ].filter(Boolean).join('\n');
    window.open(wa(txt), '_blank', 'noopener');
  });
  $$('input,textarea', form).forEach(el => el.addEventListener('input', () => el.classList.remove('bad')));

  /* faq: um aberto por vez */
  $$('.faq details').forEach(d => d.addEventListener('toggle', () => {
    if (d.open) $$('.faq details').forEach(o => { if (o !== d) o.open = false; });
  }));

  $('#year').textContent = new Date().getFullYear();
})();
