# O Grande Conflito — edição ilustrada · Relatório do protótipo (etapa 1)

## O que foi entregue

| Arquivo | Situação |
| --- | --- |
| `saida/O_Grande_Conflito_Prototipo.pdf` | 26 páginas, 160 × 230 mm, espelhadas, texto selecionável, fontes incorporadas, marcadores navegáveis |
| `saida/O_Grande_Conflito_Prototipo.epub` | EPUB 3 fluido, validado no EPUBCheck 5.1.0: 0 erros, 0 avisos |
| `saida/previas/` | Páginas e duplas em PNG (150 dpi) e telas do EPUB em celular e tablet |
| `build.py`, `estilo-pdf.css`, `estilo-epub.css` | Arquivos-fonte: um comando gera o PDF e o EPUB |
| `fontes/` | Unbounded, Inter e Literata em TTF, com as licenças OFL |

O protótipo contém: capa, página de rosto, créditos, sumário, abertura do capítulo 1 (página par), o capítulo 1 completo em páginas de leitura e uma página especial (linha do tempo).

## Pendente: ilustração de abertura

A abertura do capítulo 1 tem um **marcador** no lugar da ilustração. Por decisão do dono do projeto, ele vai enviar as ilustrações.

- O gerador do Canva testado escrevia o título dentro da imagem e só devolvia miniaturas de 133 × 200 px.
- Basta salvar `imagens/cap01-abertura.jpg` (retrato 2:3, ideal 2400 × 3450 px ou mais) e rodar `python build.py`. A imagem entra sangrada na página par e no topo do capítulo no EPUB.
- O terço inferior deve ficar livre e escuro, porque é onde entra o título.
- Opcional: `imagens/cap01-rodape.jpg` (paisagem larga). O script a esmaece no tom do papel e a aplica no rodapé da primeira página de leitura, como no mockup.

## Decisões tipográficas

- **Títulos:** Unbounded. Na página de rosto e na abertura, mantive o contraste aprovado: "O GRANDE" em 400 e "CONFLITO" em 800. Na abertura, "PREDITO O" em 400 e "DESTINO DO MUNDO" em 700.
- **Intertítulos:** Unbounded 500, 10,6 pt, em caixa baixa, com um fio terracota acima. Em caixa alta, a Unbounded ficava larga demais para títulos longos. Esse é o único ponto em que me afastei do mockup.
- **Texto corrido: Inter 400, 10,6 pt, entrelinha 1,5, alinhado à esquerda, com hifenização em pt-BR.**
  - A Inter tem altura-x grande, e 10,6 pt dela equivale visualmente a 11,5–12 pt de uma serifada.
  - Uso alinhamento à esquerda, sem justificar, para evitar "rios" de espaço em linhas curtas.
  - Coluna de cerca de 64 caracteres.
  - Recomendo manter a Inter: ficou confortável nas telas e nas páginas testadas.
- **Literata Italic** só aparece na epígrafe, no versículo em destaque, no título da linha do tempo, nos fólios e nas notas. A capitular usa Literata 600.
- Referências bíblicas em destaque usam Unbounded 500 em versal pequena espaçada.
- Hifenização limitada a palavras de 8 letras ou mais, com controle de viúvas e órfãs (2 linhas).

## Decisões editoriais

- O texto é o **capítulo 1 aprovado** (do documento do claude.ai), sem alterações.
- Esta linha editorial é a da **versão em linguagem simples** feita neste projeto (`reescrito/`). Por isso os títulos de capítulo são os da versão simples: no capítulo 1, "O destino do mundo foi anunciado" (no original: "Predito o destino do mundo"), com o subtítulo "Jesus e Jerusalém".
- **Citações bíblicas e de historiadores têm estilos diferentes:**
  - versículos em Literata Italic com fio terracota;
  - Milman em bloco recuado com fio claro e a fonte em versal.
- O **destaque** ("Quando se aproximou e viu a cidade, ele chorou por ela", Lucas 19:41) repete um versículo que já está no texto. No EPUB, ele é marcado para não ser lido duas vezes por leitores de tela.
- **Linha do tempo:** usa só fatos narrados no próprio capítulo. Os anos 66 e 70 d.C. vêm de Flávio Josefo, como indica a nota da página. Não criei mapa, porque o capítulo não traz dados geográficos além de Pela e do Jordão.
- **Créditos:** informam que o texto é adaptação, não citação literal, e que a distribuição depende de autorização dos titulares de direitos.

## Limitações conhecidas

1. **Capa:**
   - O arquivo aprovado tem 1024 × 1536 px. Isso dá cerca de 165 dpi no formato 160 × 230 mm: bom para tela, mas abaixo dos 300 dpi de impressão.
   - O título está "desenhado" dentro da imagem.
   - Para a gráfica, será preciso uma arte-mestre em alta resolução, sem texto. O título entra depois em Unbounded real.
   - A proporção da arte (2:3) é um pouco mais alta que a página. O corte tira cerca de 2 mm em cima e 8 mm embaixo, e o nome da autora fica a uns 6 mm da borda.
2. **Impressão:** este PDF é para tela e avaliação. Ainda não tem sangria, marcas de corte nem perfil CMYK, como combinado para a etapa da gráfica.
3. **EPUB:**
   - Testado em Chromium, simulando celular (390 px) e tablet (820 px).
   - Ainda falta testar em aplicativos reais (Apple Books, Google Play Livros, Kindle via Send to Kindle, Kobo).
   - No EPUB, a abertura mostra a imagem e o título em texto real, um abaixo do outro, e não a composição da página dupla.
4. **Direitos:** o protótipo é privado. A licença do PDF de referência restringe obras derivadas e redistribuição, então a autorização precisa ser documentada antes da produção integral.

## Como gerar de novo

```bash
pip install weasyprint pillow
python build.py
```
