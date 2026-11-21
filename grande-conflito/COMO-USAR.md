# Como continuar no Claude Code

Este pacote já tem tudo o que o Claude Code precisa: o livro separado por capítulo, as regras de reescrita que usamos até aqui e uma lista de progresso.

## O que tem na pasta

- `CLAUDE.md`: as regras de linguagem e de conteúdo. O Claude Code lê esse arquivo sozinho.
- `original/`: o texto do livro, um arquivo por capítulo (introdução e capítulos 1 a 42).
- `reescrito/`: onde os capítulos novos vão aparecer.
- `progresso.md`: lista do que já foi feito. Os capítulos 1 a 8 já estão marcados.

## Passo a passo

1. Descompacte este arquivo .zip numa pasta do seu computador.
2. Abra o documento "O Grande Conflito — em linguagem fácil" no claude.ai e baixe-o (Word ou Markdown). Salve dentro da pasta `reescrito/` com o nome `01-a-08.docx` ou `01-a-08.md`. Assim o livro final sai completo.
3. Abra o Claude Code nessa pasta. Se ainda não tem o Claude Code instalado, as instruções estão em https://docs.claude.com.
4. Cole este pedido:

> Leia o CLAUDE.md e o progresso.md. Reescreva a introdução e todos os capítulos pendentes, do 9 ao 42, um atrás do outro, sem parar para pedir confirmação. Siga todas as regras do CLAUDE.md, faça a verificação de completude em cada capítulo e atualize o progresso.md. No final, monte o arquivo O-Grande-Conflito-linguagem-facil.md com o livro inteiro.

5. Deixe trabalhar. São 34 capítulos e a introdução, então vai levar bastante tempo.

## Se parar no meio

Se a sessão encerrar ou o Claude Code parar, abra de novo na mesma pasta e escreva:

> Continue de onde parou, conforme o progresso.md.

O `progresso.md` mostra exatamente onde ele está.

## Dica

Depois dos dois ou três primeiros capítulos novos, dê uma lida rápida. Se quiser mudar algo no estilo, peça a mudança e diga para ele anotar a regra no CLAUDE.md. Assim os capítulos seguintes já saem do jeito certo.
