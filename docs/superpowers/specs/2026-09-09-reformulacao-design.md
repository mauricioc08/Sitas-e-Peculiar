# Reformulação do Sitas&Peculiar — design

Data: 2026-09-09
Estado: aprovado (amostra v2 validada pelo autor)

## Objetivo

Reformular o site informativo sobre calopsitas — hoje 3 páginas de HTML/CSS
puro — tornando-o mais útil e mais bonito, sem abandonar o caráter de projeto
estático publicado no GitHub Pages.

## Diagnóstico do estado atual

- **HTML estruturalmente quebrado.** As `div.section-dicas` nunca são fechadas;
  cada dica abre uma div dentro da anterior, gerando 10 níveis de aninhamento em
  `index.html` e tags cruzadas (`</div>` dentro de `<a>`) em `curiosities.html`.
- **IDs duplicados.** `id="1"` aparece 6 vezes em `curiosities.html`.
- **CSS triplicado.** Os três arquivos são ~90% idênticos: 995 linhas onde
  cabem ~450.
- **Imagens inadequadas.** 19 MB no total. Duas falhas distintas: fotos pequenas
  demais (500–750px) sendo ampliadas no layout, e fotos grandes (3000–4400px)
  salvas em qualidade JPEG 73. Uma foto estava em PNG com 2,9 MB.
- **Sem JavaScript.** Nenhum menu mobile, nenhuma navegação nas páginas longas.
- **Acessibilidade.** Todas as 13 imagens com o mesmo `alt="calopsitas"`;
  sem meta description; sem Open Graph; `<br><br>` no lugar de parágrafos.

## Decisões

| Eixo | Decisão |
|---|---|
| Stack | HTML + CSS + JS puro, sem build |
| Arquitetura | Multi-página, CSS em camadas |
| Páginas | 5: Home, Dicas, Alimentação, Curiosidades, Sobre |
| Tipografia | Outfit (títulos) + Karla (corpo) |
| Cor | Paleta amostrada das fotos; laranja como acento pequeno |
| Tema | Claro/escuro com botão, preferência salva |
| Idioma | Só pt-BR |
| Imagens | Fotos Unsplash fornecidas pelo autor + originais aproveitáveis |
| Assinatura | Nenhuma; barra de progresso reta nas páginas longas |

Duas propostas iniciais foram rejeitadas pelo autor e não devem retornar:
uma barra de progresso em forma de crista de calopsita, e a tipografia
Fraunces + Source Serif (lida como "cara de IA").

## Tokens

```
--creme      #FBF7F0   fundo claro
--creme-2    #F4EDE1   fundo alternativo
--manteiga   #F2C94C   primária: botões, barra, item ativo
--manteiga-2 #FBEBBB   fundo de destaque suave
--bochecha   #C4451F   acento pequeno (AA sobre creme)
--perola     #6E6A63   texto terciário
--grafite    #262320   texto principal
--musgo      #4A5D4E   apoio, usado só nos "permitidos"
--linha      #E4DCCD   bordas
```

Escuro não inverte: o fundo vira `#1A1815` (quente), a manteiga dessatura para
`#E8C25C`, a bochecha clareia para `#F08A5F`.

Contraste verificado: AA em todas as combinações, nos dois temas.

## Arquitetura de arquivos

```
index.html          Home
dicas.html          10 dicas de cuidados
alimentacao.html    Ração, frutas, água, tabela permitidos/proibidos
curiosidades.html   Origem, mutações, temperamento, saúde, sexagem
sobre.html          Projeto, fontes, autor

CSS/
  base.css          reset, tokens, tipografia, tema escuro
  layout.css        container, header, footer, grid
  componentes.css   cards, botões, tabela, galeria, índice, acordeão

JS/
  main.js           tema, menu mobile, barra de progresso, topo
  indice.js         índice com scroll-spy (dicas e curiosidades)

img/
  site/             processadas: 3 larguras × 2 formatos
  novas/            originais Unsplash (não versionar)
```

O header e o footer ficam duplicados no HTML das 5 páginas. É o custo aceito de
não ter build; são ~20 linhas. A alternativa (injeção por JS) foi descartada por
prejudicar SEO e tornar a navegação dependente de JavaScript.

## Imagens

Pipeline em `scripts/processar-imagens.sh`: cada foto gera WebP + JPEG nas
larguras 480/960/1600, servidas via `<picture>` com `srcset`. O script nunca
amplia — se o original for menor que o alvo, usa a largura real.

Resultado: 32 MB de originais → 6 MB processados. Uma foto de card pesa 30 KB
em WebP contra 1,3 MB antes.

Fotos originais preservadas: `filhote`, `calopsita5`, `calopsita6` (resolução
suficiente) e `nick.jpg` como favicon 180px.

## Conteúdo

Todo o texto atual é preservado e reorganizado. Seções novas, escritas com base
em conhecimento veterinário estabelecido:

1. **Tabela de alimentos permitidos e proibidos** — abacate, chocolate, cafeína,
   cebola e álcool são tóxicos para psitacídeos. É a informação que mais protege
   a ave e hoje falta no site.
2. **Sinais de alerta de saúde** — quando procurar um veterinário com urgência.
3. **Primeiros dias em casa** — período de adaptação.
4. **FAQ** — em acordeão, reunindo dúvidas que o texto já responde de forma
   dispersa.
5. **Fontes** — crédito aos veterinários e sites citados no README.

Toda página de conteúdo de saúde leva um aviso de que o site é informativo e não
substitui consulta veterinária.

## JavaScript

Progressive enhancement: o site é integralmente navegável e legível sem JS.

- `main.js` — alternância de tema com `localStorage` (dentro de try/catch,
  porque em navegação privada o acesso lança), menu mobile, barra de progresso,
  botão de voltar ao topo
- `indice.js` — índice lateral com scroll-spy via `IntersectionObserver`

`prefers-reduced-motion` desativa transições e scroll suave.

## Qualidade

- HTML válido: divs fechadas, IDs únicos e descritivos (`#dica-gaiola`)
- `alt` real e único por imagem
- Meta description, Open Graph e JSON-LD por página
- Foco de teclado visível em todo elemento interativo
- Responsivo: 3 breakpoints com lógica (860px estrutura, 560px coluna única)

## Fora de escopo

Versão em inglês, busca no conteúdo, sistema de build, e qualquer framework.
