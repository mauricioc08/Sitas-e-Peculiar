/* ==========================================================================
   main.js — tema, menu mobile, barra de progresso, voltar ao topo

   Tudo aqui é melhoria progressiva: sem JS o site continua legível e
   navegável. A classe .sem-js no <html> é removida logo abaixo, e o CSS
   usa isso para decidir como mostrar a navegação em telas pequenas.
   ========================================================================== */

document.documentElement.classList.remove('sem-js');

/* ---------------------------------------------------------------- tema ---- */

(function tema() {
  const btn = document.getElementById('tema-btn');
  if (!btn) return;

  const icone = btn.querySelector('path');
  const LUA = 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z';
  const SOL = 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4';

  function aplicar(valor) {
    document.documentElement.dataset.tema = valor;
    if (icone) icone.setAttribute('d', valor === 'escuro' ? SOL : LUA);
    btn.setAttribute('aria-label',
      valor === 'escuro' ? 'Mudar para tema claro' : 'Mudar para tema escuro');
    // localStorage lança em navegação privada de alguns navegadores
    try { localStorage.setItem('tema', valor); } catch (e) { /* sem persistência */ }
  }

  let salvo = null;
  try { salvo = localStorage.getItem('tema'); } catch (e) { /* idem */ }

  const doSistema = window.matchMedia('(prefers-color-scheme: dark)');
  aplicar(salvo || (doSistema.matches ? 'escuro' : 'claro'));

  btn.addEventListener('click', function () {
    aplicar(document.documentElement.dataset.tema === 'escuro' ? 'claro' : 'escuro');
  });

  // acompanha a troca no sistema enquanto o visitante não escolheu manualmente
  doSistema.addEventListener('change', function (e) {
    let escolhido = null;
    try { escolhido = localStorage.getItem('tema'); } catch (err) { /* idem */ }
    if (!escolhido) aplicar(e.matches ? 'escuro' : 'claro');
  });
})();

/* --------------------------------------------------------- menu mobile ---- */

(function menu() {
  const btn = document.getElementById('menu-btn');
  const painel = document.getElementById('nav-mobile');
  if (!btn || !painel) return;

  function definir(aberto) {
    painel.classList.toggle('aberto', aberto);
    btn.setAttribute('aria-expanded', String(aberto));
  }

  definir(false);

  btn.addEventListener('click', function () {
    definir(!painel.classList.contains('aberto'));
  });

  // fecha ao navegar ou ao apertar Esc
  painel.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') definir(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && painel.classList.contains('aberto')) {
      definir(false);
      btn.focus();
    }
  });
})();

/* ----------------------------------------------- progresso e voltar topo --- */

(function rolagem() {
  const barra = document.querySelector('.progresso i');
  const topoBtn = document.getElementById('topo-btn');
  if (!barra && !topoBtn) return;

  function atualizar() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;

    if (barra) {
      barra.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + '%';
    }
    if (topoBtn) {
      topoBtn.classList.toggle('visivel', y > 600);
    }
  }

  let agendado = false;
  window.addEventListener('scroll', function () {
    if (agendado) return;
    agendado = true;
    window.requestAnimationFrame(function () {
      atualizar();
      agendado = false;
    });
  }, { passive: true });

  window.addEventListener('resize', atualizar);
  atualizar();

  if (topoBtn) {
    topoBtn.addEventListener('click', function () {
      const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: suave ? 'smooth' : 'auto' });
    });
  }
})();
