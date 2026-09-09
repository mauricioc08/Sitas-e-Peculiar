/* ==========================================================================
   indice.js — marca no índice lateral a seção que está sendo lida

   Usado nas páginas longas (dicas, curiosidades). Sem JS o índice continua
   funcionando como lista de âncoras comum; só não acompanha a rolagem.
   ========================================================================== */

(function indice() {
  const indice = document.querySelector('.indice');
  if (!indice || !('IntersectionObserver' in window)) return;

  const links = Array.from(indice.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  const alvos = links
    .map(function (a) {
      const el = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  if (!alvos.length) return;

  const visiveis = new Set();

  function marcar() {
    // entre as seções na faixa de leitura, destaca a que está mais acima
    let escolhida = null;
    alvos.forEach(function (alvo) {
      if (!visiveis.has(alvo.el)) return;
      if (!escolhida || alvo.el.offsetTop < escolhida.el.offsetTop) {
        escolhida = alvo;
      }
    });

    // Nos extremos da página nenhuma seção cai dentro da faixa: no topo
    // ainda não se leu nada, e no fim a última seção já passou dela.
    // Sem isto o índice fica sem marcação justamente onde o leitor está.
    if (!escolhida) {
      const fim = window.scrollY + window.innerHeight >=
                  document.documentElement.scrollHeight - 2;
      if (fim) {
        escolhida = alvos[alvos.length - 1];
      } else {
        // a última seção que já passou do topo da tela
        const limite = window.scrollY + window.innerHeight * 0.3;
        alvos.forEach(function (alvo) {
          if (alvo.el.offsetTop <= limite &&
              (!escolhida || alvo.el.offsetTop > escolhida.el.offsetTop)) {
            escolhida = alvo;
          }
        });
      }
    }

    links.forEach(function (a) { a.classList.remove('ativo'); });
    if (escolhida) escolhida.link.classList.add('ativo');
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) visiveis.add(entrada.target);
      else visiveis.delete(entrada.target);
    });
    marcar();
  }, {
    // a faixa central da tela é o que conta como "sendo lido"
    rootMargin: '-25% 0px -55% 0px',
    threshold: 0
  });

  alvos.forEach(function (alvo) { observador.observe(alvo.el); });

  // o observador só dispara quando uma seção entra ou sai da faixa; nos
  // extremos isso não acontece, então acompanhamos a rolagem também
  let agendado = false;
  window.addEventListener('scroll', function () {
    if (agendado) return;
    agendado = true;
    window.requestAnimationFrame(function () {
      marcar();
      agendado = false;
    });
  }, { passive: true });

  marcar();
})();
