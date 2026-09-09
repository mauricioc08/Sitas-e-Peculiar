# Sitas&Peculiar

Guia de cuidados com calopsitas: alimentação, ambiente, saúde e comportamento,
em linguagem simples para quem tem ou pretende ter uma.

**https://mauricioc08.github.io/Sitas-e-Peculiar/**

Um projeto da CASSIANOTECH.

---

## Para quem vai mexer no site

### Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Home: apresentação, atalhos, o que saber antes de adotar, dúvidas frequentes |
| `dicas.html` | 10 dicas de cuidados, com índice lateral |
| `alimentacao.html` | Alimentos seguros e tóxicos, dieta, sinais de alerta |
| `curiosidades.html` | Origem, mutações, temperamento, adestramento, sexagem |
| `sobre.html` | Por que o site existe, de onde vem a informação, CASSIANOTECH |

### Estrutura

```
CSS/
  base.css          reset, cores, tipografia, tema escuro
  layout.css        cabeçalho, rodapé, navegação
  componentes.css   cards, tabelas, galeria, índice
JS/
  main.js           tema, menu, barra de progresso, voltar ao topo
  indice.js         marca a seção em leitura nas páginas longas
img/
  site/             imagens prontas para uso (3 tamanhos, 2 formatos)
  novas/            fotos originais (não vão para o repositório)
```

Sem framework e sem etapa de build: é só abrir os arquivos. O JavaScript é
melhoria progressiva — sem ele o site continua legível e navegável.

### Imagens

O script gera as versões usadas no site a partir dos originais em `img/novas/`,
em três larguras e dois formatos, sem nunca ampliar além do tamanho real:

```bash
bash scripts/processar-imagens.sh
```

Requer ImageMagick com suporte a WebP. Para trocar ou acrescentar fotos, edite
a lista `MAPA` no início do script.

### Conteúdo

As informações vêm de orientações de médicos-veterinários e de fontes
especializadas na criação de calopsitas. Têm caráter educativo e não substituem
consulta veterinária — o aviso aparece em todas as páginas.

Fotografias do [Unsplash](https://unsplash.com), sob licença de uso livre.
Tipografia Outfit e Karla, sob licença SIL Open Font.
