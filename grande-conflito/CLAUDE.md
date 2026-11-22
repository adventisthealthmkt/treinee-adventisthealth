# Projeto: O Grande Conflito em linguagem fácil

Reescrever o livro *O Grande Conflito*, de Ellen G. White, em português simples, para uso pessoal do dono deste projeto. O conteúdo é mantido por inteiro. Só a linguagem muda.

## Pastas

- `original/` tem o texto do livro, um arquivo por capítulo (`00-introducao.txt`, `01-capitulo.txt` … `42-capitulo.txt`). Não edite estes arquivos.
- `reescrito/` recebe a versão nova, um arquivo por capítulo, com o mesmo número: `09-capitulo.md`, `10-capitulo.md` etc.
- `progresso.md` registra o que já foi feito. Atualize depois de cada capítulo.

Os capítulos 1 a 8 já foram reescritos em outro lugar (um documento no claude.ai). O dono vai colocar esse texto em `reescrito/` com o nome `01-a-08.md` ou `01-a-08.docx`. Se vier em .docx, converta para .md antes de montar o arquivo final (por exemplo, com `pandoc`). Não refaça esses capítulos.

## Ordem de trabalho

1. Leia `progresso.md` e descubra o próximo capítulo pendente.
2. Leia o arquivo original inteiro desse capítulo antes de escrever qualquer coisa.
3. Escreva o capítulo reescrito em `reescrito/NN-capitulo.md`.
4. Faça a verificação de completude (seção abaixo) e corrija o que faltar.
5. Marque o capítulo como feito em `progresso.md`, com uma linha de observações (referências corrigidas, por exemplo).
6. Siga direto para o próximo capítulo, sem pedir confirmação, até terminar o capítulo 42 e a introdução.
7. No final, junte tudo em `O-Grande-Conflito-linguagem-facil.md`, nesta ordem: introdução, `01-a-08` (se existir), depois 09 a 42.

Capítulos longos podem ser escritos em partes no mesmo arquivo. Se o contexto ficar cheio, use `/compact` ou continue numa nova sessão: o `progresso.md` diz onde parou.

## Regras de linguagem

- Português do Brasil do dia a dia. Frases curtas (de preferência menos de 25 palavras). Parágrafos de até 3 ou 4 frases.
- Troque palavras difíceis ou antigas por palavras comuns: "apostasia" → "afastamento da fé" ou "desvio"; "hodierno" → "de hoje"; "ignomínia" → "vergonha"; "jactar-se" → "se gabar".
- Quando um termo técnico precisa ficar, explique entre parênteses na primeira vez: "bula (documento oficial do papa)", "excomungar (expulsar da igreja)", "Dieta (assembleia dos príncipes)", "simonia (vender coisas sagradas)".
- Use "você/vocês" no lugar de "tu/vós" nas falas, exceto quando alguém se dirige formalmente a um rei ou imperador ("vossa majestade" pode ficar).
- Mantenha os pronomes de Deus com maiúscula, como no original (Ele, dEle, Seu, Sua).

## Regras de conteúdo (as mais importantes)

- **Nada pode ser cortado.** Todo fato, nome, data, número, exemplo, argumento, aplicação e conclusão do original precisa aparecer. A reescrita pode ficar mais curta só por usar palavras mais simples, nunca por deixar ideias de fora.
- **Mantenha a ordem do original.**
- **Mantenha a voz e as posições da autora.** Não acrescente opiniões, comentários, avisos ou "o livro diz que". Escreva como a autora escreveria se falasse simples.
- **Citações bíblicas:** reescreva em português atual, com o mesmo sentido, e mantenha a referência entre parênteses: (João 3:16). Não copie o texto da tradução Almeida antiga.
- **Citações de historiadores e outros autores** (D'Aubigné, Wylie, Bonnechose, Martyn etc.): mantenha todas, em linguagem simples, com a fonte no fim, assim: (D'Aubigné) ou (Wylie, *História do Protestantismo*). Citações longas vão em bloco `>`.
- **Referências erradas no PDF:** se uma referência bíblica estiver claramente errada (erro de digitação), use a correta e anote em `progresso.md`. Exemplos já encontrados: "2 João 1:51" era João 1:51; "Efésios 1:17" era Neemias 4:18.
- Se o original cita algo sem referência e você souber a referência com certeza, pode acrescentá-la e anotar em `progresso.md`.

## Formato de cada arquivo

```markdown
## Capítulo N — Título em linguagem simples

### Subtítulo da primeira parte

Texto...

### Subtítulo da próxima parte

Texto...
```

- O título do capítulo pode ser levemente simplificado (ex.: "Arautos de uma era melhor" → "Os mensageiros de um tempo melhor").
- Divida o capítulo com subtítulos `###` a cada 3 a 6 parágrafos, quando o assunto muda. Esses subtítulos não existem no original; servem para facilitar a leitura.
- Use listas só quando o original enumera itens (ex.: as condições de um tratado, as cláusulas de uma bula). O resto é texto corrido.
- Itálico só para títulos de livros.

## Exemplo do padrão (trecho do Capítulo 1 já aprovado pelo dono)

Original:

> Do cimo do Monte das Oliveiras, Jesus olhava sobre Jerusalém. Lindo e calmo era o cenário que diante dEle se desdobrava. Era o tempo da Páscoa, e de todas as terras os filhos de Jacó se haviam ali reunido para celebrar a grande festa nacional.

Reescrito:

> Jesus estava no alto do Monte das Oliveiras, olhando para Jerusalém. A vista era linda e tranquila. Era época da Páscoa, e judeus de todos os lugares tinham vindo para a grande festa do país.

Original:

> Satanás, portanto, formulou seus planos para guerrear com mais êxito contra o governo de Deus, hasteando sua bandeira na igreja cristã.

Reescrito:

> Então Satanás fez um novo plano para lutar contra o governo de Deus: levantar a sua bandeira dentro da própria igreja cristã.

## Verificação de completude (obrigatória em todo capítulo)

Depois de escrever, percorra o original parágrafo por parágrafo e confira se cada um tem correspondente no texto novo. Confira em especial:

- todos os nomes de pessoas, lugares, datas e números;
- todas as referências bíblicas (conte quantas há no original e no reescrito);
- todas as citações de historiadores, com a fonte;
- os parágrafos finais de aplicação para os dias de hoje, que costumam ser os mais esquecidos.

Se algo faltar, acrescente no lugar certo antes de marcar o capítulo como feito.

## Fonte da edição (atualizado)

A partir desta revisão, o texto em linguagem simples é feito **a partir do inglês da edição de 1911** (domínio público), que está em `original-en/` (OCR da cópia do Internet Archive, item in.ernet.dli.2015.153256). O resultado vai para `reescrito-1911/`. Não use a tradução em português de `original/` nem a versão antiga de `reescrito/` como base. As mesmas regras de linguagem, conteúdo, formato e completude continuam valendo.
