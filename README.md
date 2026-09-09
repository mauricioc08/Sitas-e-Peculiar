# Sitas&Peculiar

Guia de cuidados com calopsitas — alimentação, ambiente, saúde e comportamento,
em linguagem simples para quem tem ou pretende ter uma.

**https://mauricioc08.github.io/Sitas-e-Peculiar/**

Um projeto da CASSIANOTECH.

## As páginas

| Página | O que traz |
|---|---|
| Início | Apresentação, atalhos por assunto, o que saber antes de adotar e dúvidas frequentes |
| Dicas | Dez cuidados essenciais: gaiola, comida, banho, higiene, brincadeiras, sono e veterinário |
| Alimentação | O que pode e o que nunca pode ser oferecido, como montar a dieta e sinais de alerta |
| Curiosidades | Origem, tipos de calopsita, temperamento, adestramento e como saber o sexo da ave |
| Sobre | Por que o site existe, de onde vem a informação e quando procurar ajuda profissional |

## Como mexer no site

Não é preciso instalar nada. Abra qualquer arquivo `.html` no navegador para ver
o resultado, e edite os arquivos direto em um editor de texto.

```
index.html          página inicial
dicas.html          alimentacao.html
curiosidades.html   sobre.html

CSS/    aparência do site
  base.css          cores, letras e o modo escuro
  layout.css        topo, rodapé e menu
  componentes.css   blocos de conteúdo, tabelas, galeria, perguntas

JS/     comportamentos
  main.js           troca de tema, menu do celular, barra de leitura
  indice.js         destaca o item do índice conforme você lê
  faq.js            animação das perguntas frequentes

img/site/           todas as imagens do site
site.webmanifest    ícone e nome ao salvar o site no celular
```

O topo e o rodapé se repetem nas cinco páginas. Ao mudar um deles, lembre de
aplicar a mesma alteração nas outras.

O site funciona mesmo se o JavaScript falhar: o conteúdo continua inteiro, só
sem as animações e sem a troca de tema.

## Imagens

Cada foto está em três larguras (480, 960 e 1600 pixels) e dois formatos. O
navegador escolhe sozinho a menor versão que serve para a tela de quem acessa,
e é isso que faz o site abrir rápido no celular.

Para trocar uma foto, gere as seis versões com o mesmo padrão de nome da atual
e substitua os arquivos em `img/site/`.

## Sobre o conteúdo

As informações vêm de orientações de médicos-veterinários e de fontes
especializadas na criação de calopsitas. São educativas e **não substituem
consulta veterinária** — o aviso aparece em todas as páginas.

Fotografias do Unsplash, de uso livre. Letras Outfit e Karla, do Google Fonts.
