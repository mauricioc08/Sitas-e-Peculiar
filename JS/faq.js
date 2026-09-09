/* ==========================================================================
   faq.js — anima a abertura e o fechamento das perguntas frequentes

   O elemento <details> não anima sozinho em nenhum dos dois sentidos:

   - ao abrir, o navegador tira o display:none do conteudo e aplica a altura
     final no mesmo quadro, sem um estado inicial de onde partir;
   - ao fechar, ele remove o conteudo na hora, antes de qualquer transicao.

   Nos dois casos a solucao e a mesma: assumir o controle do atributo `open`
   e deixar um quadro passar entre tornar o conteudo visivel e mudar a
   altura, para o navegador ter de onde animar.

   Sem este arquivo o acordeao continua abrindo e fechando, so que de forma
   instantanea.
   ========================================================================== */

(function faq() {
  const itens = document.querySelectorAll('.faq details');
  if (!itens.length) return;

  const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)');

  itens.forEach(function (item) {
    const resumo = item.querySelector('summary');
    const corpo = item.querySelector('.faq-corpo');
    if (!resumo || !corpo) return;

    let animando = false;

    // Executa `entao` quando a transicao de altura terminar, com um limite
    // de tempo caso o transitionend nao venha (aba em segundo plano, etc).
    function aoTerminar(limite, entao) {
      let pronto = false;

      function encerrar() {
        if (pronto) return;
        pronto = true;
        clearTimeout(reserva);
        corpo.removeEventListener('transitionend', ouvinte);
        entao();
      }

      function ouvinte(ev) {
        if (ev.target === corpo && ev.propertyName === 'grid-template-rows') {
          encerrar();
        }
      }

      const reserva = setTimeout(encerrar, limite);
      corpo.addEventListener('transitionend', ouvinte);
    }

    resumo.addEventListener('click', function (e) {
      if (semAnimacao.matches) return;   // respeita quem pediu menos movimento

      e.preventDefault();
      if (animando) return;
      animando = true;

      if (!item.open) {
        // ABRIR: mostra o conteudo ainda recolhido, espera um quadro para o
        // navegador registrar a altura zero, e so entao solta a expansao.
        item.dataset.abrindo = 'true';
        item.open = true;

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            delete item.dataset.abrindo;
            aoTerminar(900, function () { animando = false; });
          });
        });
      } else {
        // FECHAR: segura o `open` ate a animacao terminar, senao o conteudo
        // desaparece antes de encolher.
        item.dataset.fechando = 'true';

        aoTerminar(700, function () {
          delete item.dataset.fechando;
          item.open = false;
          animando = false;
        });
      }
    });
  });
})();
