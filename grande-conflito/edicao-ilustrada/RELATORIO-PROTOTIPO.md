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

## Ilustrações de abertura

Recebidas e salvas em `imagens/capNN-abertura.png`, com 1890 × 2717 px (160 × 230 mm a 300 dpi): capítulos 1, 2, 4, 6, 7, 9, 11–20. A do capítulo 1 já está no protótipo.

Faltam os capítulos 3, 5, 8, 10 e 21–42. Na produção integral, capítulo sem imagem recebe o marcador "ilustração a inserir".

Pontos de atenção nas imagens recebidas:

- **Capítulo 14:** ao fundo aparecem o Palácio de Westminster e a torre do Big Ben, construídos no século XIX. A cena é dos séculos XIV a XVI, então isso é um anacronismo.
- **Capítulos 4, 6, 7 e 9:** têm o tamanho certo, mas parecem ampliadas de um original menor. Os detalhes ficam borrados e o fundo, pixelado. Na tela funcionam, mas para impressão o ideal é gerar de novo em alta resolução.

## Nota sobre esta edição

O texto enviado pelo dono do projeto entra logo depois dos créditos, como página própria. Ele aparece sem alterações em `nota-edicao.md`.

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
- **Créditos:** informam que o texto é adaptação, não citação literal. A questão de direitos foi para a "Nota sobre esta edição".

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


---

# Etapa 3: edição completa

| Arquivo | Situação |
| --- | --- |
| `saida/O_Grande_Conflito_Edicao_Ilustrada.pdf` | 876 páginas, 160 × 230 mm, cerca de 26 MB, fontes incorporadas, 945 marcadores (capítulos e seções), sumário com números de página |
| `saida/O_Grande_Conflito_Edicao_Ilustrada.epub` | 11 MB, um arquivo por capítulo, validado no EPUBCheck 5.1.0: 0 erros, 0 avisos |
| `build_livro.py` | Gera os dois arquivos (`python build_livro.py`, cerca de 35 segundos) |
| `saida/previas-livro/` | Sumário, introdução e seis aberturas em PNG |

## Estrutura

Capa, rosto, créditos, nota sobre esta edição, sumário, introdução (abertura tipográfica, sem ilustração) e os capítulos 1 a 42.

- Cada capítulo abre com a ilustração em página par, sangrada, e o título em Unbounded como texto real.
- A leitura começa na página ímpar seguinte. O cabeçalho da direita traz o título do capítulo, e a primeira página não tem cabeçalho.
- O texto é o da versão em linguagem simples (`../reescrito/`), sem alterações.

## Decisões

- **Títulos:** a divisão entre a parte leve (400) e a forte (700) foi definida à mão, capítulo por capítulo (dicionário `DIVISAO` em `build_livro.py`). A parte forte diminui de tamanho em quatro passos conforme o comprimento, para caber sem quebrar palavras.
- **Subtítulo nas aberturas:** só o capítulo 1 tem ("Jesus e Jerusalém", do mockup aprovado). Nos outros, o título fica sozinho.
- **Citações em bloco:**
  - versículos bíblicos usam Literata itálica com fio terracota;
  - historiadores e outros autores usam Inter com fio claro;
  - a fonte da citação fica numa linha em versal.
- **Listas:** só onde o texto enumera itens (cláusulas da bula etc.).
- **Linha do tempo e destaque:** continuam apenas no capítulo 1.

## Pendências e limitações

- **Imagens em 166 dpi:** as aberturas dos capítulos 21 a 40 têm 1046 × 1504 px. Servem para tela, mas para impressão precisam ser exportadas em 1890 × 2717 px.
- **Imagens borradas:** as dos capítulos 4, 5, 6, 7, 9 e 10 parecem ampliadas de originais menores.
- **Anacronismos:**
  - Capítulo 14: Palácio de Westminster e Big Ben.
  - Capítulo 3: basílica com cúpula renascentista.
  - Capítulo 8: a imagem mostra as teses, que o texto conta no capítulo 7.
  - Capítulo 25: tábuas da Lei com símbolos no lugar de letras.
- **Nota sobre esta edição:** diz que a edição tem como referência o original em inglês, mas o texto foi reescrito a partir do PDF em português da pasta `original/`.
- **Impressão:** ainda falta a versão com sangria, marcas de corte e perfil CMYK. A capa precisa de uma arte-mestre sem texto e em alta resolução.
- **EPUB:** validado e testado no navegador, mas ainda não testado em aplicativos de leitura (Apple Books, Play Livros, Kindle, Kobo).
