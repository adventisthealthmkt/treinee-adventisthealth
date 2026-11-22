#!/usr/bin/env python3
"""Monta a edição ilustrada completa de O Grande Conflito (PDF + EPUB).

Uso:  python build_livro.py
Requer: weasyprint, pillow

Texto: ../reescrito/ (versão em linguagem simples)
  00-introducao.md, 01-a-08.md (capítulos 1 a 8), 09-capitulo.md … 42-capitulo.md
Ilustrações: imagens/capNN-abertura.png (sem elas, entra um marcador)
Estilos: estilo-pdf.css (PDF) e estilo-epub.css (EPUB) — os mesmos do protótipo.
"""
import html
import re
import shutil
import uuid
import zipfile
from datetime import datetime, timezone
from pathlib import Path

import build as proto  # reaproveita linha do tempo, destaque, CSS de fontes e nota

RAIZ = Path(__file__).resolve().parent
TEXTOS = RAIZ.parent / "reescrito-1911"
IMG = RAIZ / "imagens"
FONTES = RAIZ / "fontes"
SAIDA = RAIZ / "saida"
NOME = "O_Grande_Conflito_Edicao_Ilustrada"

# Divisão de cada título em parte leve (Unbounded 400) e forte (Unbounded 700).
# Sem entrada aqui, a divisão é automática (função dividir).
DIVISAO_MANUAL = {}
PREPS = {"de", "da", "do", "das", "dos", "e", "em", "na", "no", "nas", "nos", "à", "ao", "contra", "entre", "através", "diante"}


def dividir(num, titulo):
    if num in DIVISAO_MANUAL:
        leve, forte = DIVISAO_MANUAL[num]
        assert f"{leve} {forte}".strip() == titulo, (num, titulo)
        return leve, forte
    m = re.match(r"^(.+?[:,])\s+(.+)$", titulo)
    if m:
        return m.group(1), m.group(2)
    w = titulo.split()
    if len(w) == 1:
        return "", titulo
    melhor = None
    for k in range(1, len(w)):
        leve, forte = " ".join(w[:k]), " ".join(w[k:])
        nota = -abs(len(forte) - 14) + (6 if w[k].lower() in PREPS else 0) - (8 if len(forte) > 24 else 0)
        nota -= 4 if len(leve) > 26 else 0
        if melhor is None or nota > melhor[0]:
            melhor = (nota, leve, forte)
    return melhor[1], melhor[2]


KICKER = {1: "Jesus e Jerusalém"}
ALT = {}  # textos alternativos específicos; padrão abaixo


# ---------------------------------------------------------------- leitura dos textos


def carregar():
    """Lista de dicts: num (0 = introdução), titulo, blocos."""
    partes = [TEXTOS / "00-introducao.md"] + [TEXTOS / f"{n:02d}-capitulo.md" for n in range(1, 43)]
    if (TEXTOS / "apendice.md").exists():
        partes.append(TEXTOS / "apendice.md")
    texto = "\n".join(p.read_text(encoding="utf-8") for p in partes)
    caps = []
    for bloco in re.split(r"\n(?=## )", "\n" + texto):
        bloco = bloco.strip("\n")
        if not bloco.startswith("## "):
            continue
        cab, *resto = bloco.split("\n")
        m = re.match(r"## Capítulo (\d+) — (.+)", cab)
        if m:
            num, tit = int(m.group(1)), m.group(2).strip()
        elif "Apêndice" in cab:
            num, tit = 99, "Apêndice"
        else:
            num, tit = 0, "Introdução"
        caps.append({"num": num, "titulo": tit, "linhas": resto})
    nums = [c["num"] for c in caps]
    assert nums[:43] == list(range(0, 43)) and nums[43:] in ([], [99]), nums
    for c in caps:
        c["epigrafe"], c["secoes"] = analisar(c["linhas"])
        if 0 < c["num"] < 99:
            c["divisao"] = dividir(c["num"], c["titulo"])
    return caps


def analisar(linhas):
    """Devolve (epígrafe | None, [(titulo | None, [blocos])]). Blocos: ('p'|'citacao'|'ul'|'ol', conteúdo)."""
    grupos, atual = [], []
    for l in linhas + [""]:
        if l.strip() == "":
            if atual:
                grupos.append(atual)
                atual = []
        else:
            atual.append(l)
    epigrafe, secoes = None, [(None, [])]
    for g in grupos:
        if g[0].startswith("### "):
            secoes.append((g[0][4:].strip(), []))
            continue
        destino = secoes[-1][1]
        if all(x.startswith(">") for x in g):
            paras = [re.sub(r"^>\s?", "", x) for x in g]
            if len(secoes) == 1 and not destino and epigrafe is None:
                epigrafe = " ".join(paras)
            elif destino and destino[-1][0] == "citacao":
                destino[-1][1].extend([""] + paras)  # citação longa com parágrafo vazio entre partes
            else:
                destino.append(("citacao", paras))
        elif all(re.match(r"^[-*] ", x) for x in g):
            destino.append(("ul", [x[2:] for x in g]))
        elif all(re.match(r"^\d+\. ", x) for x in g):
            destino.append(("ol", [re.sub(r"^\d+\. ", "", x) for x in g]))
        else:
            destino.append(("p", " ".join(g)))
    if not secoes[0][1]:
        secoes.pop(0)
    return epigrafe, secoes


def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)
    return t


def citacao_html(paras):
    paras = list(paras)
    # junta linhas de um mesmo parágrafo; "" separa parágrafos
    textos, cur = [], []
    for p in paras:
        if p.strip() == "":
            if cur:
                textos.append(" ".join(cur))
                cur = []
        else:
            cur.append(p)
    if cur:
        textos.append(" ".join(cur))
    fonte = ""
    m = re.search(r"\s*\(([^()]+)\)\.?\s*$", textos[-1])
    if m and (m.group(1)[0].isupper() or m.group(1)[0] in "*0123456789"):
        fonte = m.group(1)
        textos[-1] = textos[-1][: m.start()].rstrip()
    biblica = bool(re.search(r"\d+:\d+", fonte))
    corpo = "".join(f"<p>{inline(t)}</p>" for t in textos if t.strip())
    classe = "biblica" if biblica else "historiador"
    fonte_html = f'<p class="fonte">{inline(fonte)}</p>' if fonte else ""
    return f'<blockquote class="{classe}">{corpo}{fonte_html}</blockquote>'


def corpo_html(cap, h="h3", epub=False):
    out, primeiro = [], True
    for i, (tit, blocos) in enumerate(cap["secoes"], 1):
        sid = f' id="c{cap["num"]:02d}-s{i:02d}"'
        out.append(f'<section class="secao"{sid}>')
        if tit:
            out.append(f'<{h} class="secao-titulo">{inline(tit)}</{h}>')
        for tipo, cont in blocos:
            if tipo == "p":
                t = inline(cont)
                if primeiro and t[0].isalpha():
                    out.append(f'<p class="capitular"><span class="letra-capitular">{t[0]}</span>{t[1:]}</p>')
                else:
                    out.append(f"<p>{t}</p>")
                primeiro = False
            elif tipo == "citacao":
                out.append(citacao_html(cont))
            else:
                itens = "".join(f"<li>{inline(x)}</li>" for x in cont)
                out.append(f'<{tipo} class="lista">{itens}</{tipo}>')
        out.append("</section>")
        if cap["num"] == 1 and i == 1:
            out.append(destaque_cap1(cap))
        if cap["num"] == 1 and i == secao_linha_do_tempo(cap):
            lt = proto.linha_do_tempo_html("h3" if epub else "h2")
            if epub:
                lt = lt.replace('<aside class="especial', '<aside epub:type="sidebar" class="especial')
            out.append(lt)
    return "\n".join(out)


def destaque_cap1(cap):
    """Destaque com o versículo de Lucas 19:41 como está no próprio capítulo."""
    texto = " ".join(x for _, bl in cap["secoes"] for t, x in bl if t == "p")
    m = re.search(r"[“\"]([^”\"]{10,160})[”\"]\s*\(Lucas 19:41\)", texto)
    if not m:
        return proto.destaque_html()
    return ('<aside class="destaque" aria-hidden="true">'
            f'<p class="destaque-texto">“{html.escape(m.group(1).strip())}”</p><p class="destaque-ref">Lucas 19:41</p></aside>')


def secao_linha_do_tempo(cap):
    """Coloca a linha do tempo depois da seção que narra o fim da cidade (mais de um milhão de mortos)."""
    for i, (_, bl) in enumerate(cap["secoes"], 1):
        if any(t == "p" and re.search(r"milhão", x) for t, x in bl):
            return i
    return max(1, len(cap["secoes"]) - 3)


def titulo_html(cap):
    leve, forte = cap.get("divisao") or ("", cap["titulo"])
    n = len(forte)
    tam = "t1" if n <= 14 else "t2" if n <= 19 else "t3" if n <= 24 else "t4"
    leve_html = f'<span class="leve">{html.escape(leve)}</span> ' if leve else ""
    return f'{leve_html}<span class="forte {tam}">{html.escape(forte)}</span>'


# ---------------------------------------------------------------- imagens


def preparar_imagens():
    from PIL import Image

    dst = SAIDA / "img"
    dst.mkdir(parents=True, exist_ok=True)
    pdf, epub = {}, {}
    Image.open(IMG / "capa-aprovada.png").convert("RGB").save(dst / "capa.jpg", quality=92)
    for n in range(0, 43):
        src = next(iter(sorted(IMG.glob(f"cap{n:02d}-abertura.*"))), None)
        if not src:
            continue
        im = Image.open(src).convert("RGB")
        im.save(dst / f"cap{n:02d}.jpg", quality=90, dpi=(300, 300))
        pdf[n] = f"img/cap{n:02d}.jpg"
        e = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS) if im.width > 1200 else im
        e.save(dst / f"cap{n:02d}-epub.jpg", quality=82)
        epub[n] = dst / f"cap{n:02d}-epub.jpg"
    return pdf, epub


# ---------------------------------------------------------------- PDF


def html_pdf(caps, imgs):
    css_pag = []
    for c in caps:
        nome = f"leitura{c['num']:02d}"
        tit = c["titulo"].replace('"', '\\"')
        css_pag.append(
            f"@page {nome}:right{{@top-right{{content:\"{tit}\"}}}}"
            f"@page :nth(1 of {nome}){{@top-right{{content:none}} @top-left{{content:none}}}}"
            f".pg{c['num']:02d}{{page:{nome}}}"
        )
        if c["num"] in imgs:
            css_pag.append(
                f"#cap{c['num']:02d} .abertura-arte{{background-image:linear-gradient(to bottom, rgba(21,29,51,0) 52%, "
                f"rgba(21,29,51,.55) 70%, #151D33 92%), url('{imgs[c['num']]}')}}"
            )
    sumario = ['<li class="sub0"><a href="#cap00">Introdução</a></li>'] + [
        f'<li><a href="#cap{c["num"]:02d}"><span class="num">{c["num"]:02d}</span> {html.escape(c["titulo"])}</a></li>'
        for c in caps if 0 < c["num"] < 99
    ] + (['<li class="sub0"><a href="#cap99">Apêndice</a></li>'] if caps[-1]["num"] == 99 else [])
    partes = []
    for c in caps:
        n = c["num"]
        if n == 99 or (n == 0 and 0 not in imgs):
            kick, tit = ("Notas históricas", "Apêndice") if n == 99 else ("Antes do capítulo 1", "Introdução")
            partes.append(
                f'<article class="capitulo introducao pg{n:02d}" id="cap{n:02d}">'
                f'<header class="intro-cabeca"><p class="kicker">{kick}</p>'
                f'<h1 class="intro-titulo">{tit}</h1><div class="regua"></div></header>'
                f"{corpo_html(c)}</article>"
            )
            continue
        if n == 0:
            partes.append(
                f'<section class="abertura" id="cap00"><div class="abertura-arte">'
                f'<div class="abertura-titulo"><p class="abertura-num"><span class="traco"></span>Antes do capítulo 1</p>'
                f'<h1 class="cap-titulo" style="bookmark-label: \'Introdução\'"><span class="forte t1">Introdução</span></h1>'
                f"</div></div></section>"
                f'<article class="capitulo pg00">{corpo_html(c)}<p class="fim-cap" aria-hidden="true">· · ·</p></article>'
            )
            continue
        marcador = "" if n in imgs else (
            '<div class="marcador"><p class="marcador-rotulo">Ilustração a inserir</p>'
            f"<p>Abertura do capítulo {n}. Página inteira, 160 × 230 mm.</p></div>"
        )
        kicker = (f'<div class="regua"></div><p class="abertura-kicker">{KICKER[n]}</p>' if n in KICKER else "")
        epi = ""
        if c["epigrafe"]:
            et, er = proto.separar_ref(c["epigrafe"])
            epi = f'<blockquote class="epigrafe"><p>{inline(et)}</p><p class="ref">{er}</p></blockquote>'
        partes.append(
            f'<section class="abertura" id="cap{n:02d}"><div class="abertura-arte">{marcador}'
            f'<div class="abertura-titulo"><p class="abertura-num"><span class="traco"></span>Capítulo {n:02d}</p>'
            f'<h1 class="cap-titulo" style="bookmark-label: \'Capítulo {n} — {c["titulo"]}\'">{titulo_html(c)}</h1>'
            f"{kicker}</div></div></section>"
            f'<article class="capitulo pg{n:02d}">{epi}{corpo_html(c)}'
            '<p class="fim-cap" aria-hidden="true">· · ·</p></article>'
        )
    return f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>O Grande Conflito — Edição ilustrada em linguagem simples</title>
<meta name="author" content="Ellen G. White">
<meta name="description" content="Edição ilustrada em linguagem simples">
<style>{proto.CSS_FONTES}
{chr(10).join(css_pag)}</style>
<link rel="stylesheet" href="estilo-pdf.css">
</head><body>
<section class="capa" aria-label="Capa"><img src="img/capa.jpg" alt="Capa: Jesus e Satanás frente a frente sobre a Terra; título O Grande Conflito."></section>
<section class="pagina-vazia"></section>
<section class="rosto">
  <p class="rosto-autora">Ellen G. White</p>
  <h1 class="rosto-titulo"><span class="leve">O grande</span> <span class="forte">Conflito</span></h1>
  <div class="regua"></div>
  <p class="rosto-sub">Edição ilustrada em linguagem simples</p>
</section>
<section class="creditos">{proto.CREDITOS}<p>Edição gerada em {datetime.now(timezone.utc):%d/%m/%Y}.</p></section>
<section class="nota" id="nota"><p class="kicker">Antes de começar</p><h2 class="nota-titulo">Nota sobre esta edição</h2>{proto.nota_html()}</section>
<nav class="sumario sumario-livro" aria-label="Sumário"><h2 class="sumario-titulo">Sumário</h2><ol>{''.join(sumario)}</ol></nav>
{''.join(partes)}
</body></html>"""


# ---------------------------------------------------------------- EPUB


def montar_epub(caps, imgs_epub):
    from PIL import Image

    tmp = SAIDA / "epub-livro"
    if tmp.exists():
        shutil.rmtree(tmp)
    for d in ("META-INF", "OEBPS/text", "OEBPS/css", "OEBPS/fonts", "OEBPS/img"):
        (tmp / d).mkdir(parents=True)
    (tmp / "mimetype").write_text("application/epub+zip", encoding="ascii")
    (tmp / "META-INF/container.xml").write_text(
        '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">'
        '<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
        encoding="utf-8")
    for f in FONTES.glob("*.ttf"):
        shutil.copy(f, tmp / "OEBPS/fonts" / f.name)
    capa = Image.open(IMG / "capa-aprovada.png").convert("RGB")
    capa.save(tmp / "OEBPS/img/capa.jpg", quality=88)
    for n, p in imgs_epub.items():
        shutil.copy(p, tmp / f"OEBPS/img/cap{n:02d}.jpg")
    css = proto.css_fontes_epub() + "\n" + (RAIZ / "estilo-epub.css").read_text(encoding="utf-8")
    (tmp / "OEBPS/css/epub.css").write_text(css, encoding="utf-8")
    t = tmp / "OEBPS/text"
    x = proto.xhtml
    t.joinpath("capa.xhtml").write_text(x("Capa",
        '<section epub:type="cover" class="capa"><img src="../img/capa.jpg" alt="Capa: Jesus e Satanás frente a frente sobre a Terra; título O Grande Conflito, de Ellen G. White."/></section>',
        "cover", "sem-margem"), encoding="utf-8")
    t.joinpath("rosto.xhtml").write_text(x("Página de rosto",
        '<section epub:type="titlepage" class="rosto"><p class="rosto-autora">Ellen G. White</p>'
        '<h1 class="rosto-titulo"><span class="leve">O grande</span> <span class="forte">Conflito</span></h1>'
        '<div class="regua"></div><p class="rosto-sub">Edição ilustrada em linguagem simples</p></section>', "frontmatter"), encoding="utf-8")
    t.joinpath("creditos.xhtml").write_text(x("Créditos",
        f'<section epub:type="copyright-page" class="creditos">{proto.CREDITOS}</section>', "frontmatter"), encoding="utf-8")
    t.joinpath("nota.xhtml").write_text(x("Nota sobre esta edição",
        '<section epub:type="preface" class="nota" aria-labelledby="nota-titulo"><p class="kicker">Antes de começar</p>'
        f'<h1 class="nota-titulo" id="nota-titulo">Nota sobre esta edição</h1>{proto.nota_html()}</section>', "frontmatter"), encoding="utf-8")

    toc, spine = [], ["capa", "rosto", "creditos", "nota", "nav"]
    for c in caps:
        n = c["num"]
        arq = f"cap{n:02d}"
        spine.append(arq)
        subs = "".join(
            f'<li><a href="text/{arq}.xhtml#c{n:02d}-s{i:02d}">{inline(tit)}</a></li>'
            for i, (tit, _) in enumerate(c["secoes"], 1) if tit)
        if n == 99:
            cab = '<header class="intro-cabeca"><p class="kicker">Notas históricas</p><h1 class="intro-titulo" id="cap99-titulo">Apêndice</h1></header>'
            tipo, rotulo = "appendix", "Apêndice"
        elif n == 0:
            arte = ('<figure class="abertura-arte"><img src="../img/cap00.jpg" alt="Ilustração de abertura da introdução: '
                    'Jesus e Satanás sobre um panorama da história, do Éden à cidade de Deus."/></figure>' if 0 in imgs_epub else "")
            cab = (f'<header class="abertura">{arte}<p class="abertura-num">Antes do capítulo 1</p>'
                   '<h1 class="cap-titulo intro-titulo" id="cap00-titulo"><span class="forte">Introdução</span></h1></header>')
            tipo, rotulo = "introduction", "Introdução"
        else:
            arte = (f'<figure class="abertura-arte"><img src="../img/cap{n:02d}.jpg" '
                    f'alt="{html.escape(ALT.get(n, f"Ilustração de abertura do capítulo {n}: {c["titulo"]}."))}"/></figure>'
                    if n in imgs_epub else "")
            kick = f'<p class="abertura-kicker">{KICKER[n]}</p>' if n in KICKER else ""
            cab = (f'<header class="abertura">{arte}<p class="abertura-num">Capítulo {n:02d}</p>'
                   f'<h1 id="cap{n:02d}-titulo" class="cap-titulo">{titulo_html(c)}</h1>{kick}</header>')
            tipo, rotulo = "chapter", f"Capítulo {n} — {c['titulo']}"
        epi = ""
        if c["epigrafe"]:
            et, er = proto.separar_ref(c["epigrafe"])
            epi = (f'<blockquote class="epigrafe" epub:type="epigraph" role="doc-epigraph"><p>{inline(et)}</p>'
                   f'<p class="ref">{er}</p></blockquote>')
        corpo = (f'<section epub:type="{tipo}" role="doc-{tipo}" aria-labelledby="cap{n:02d}-titulo">'
                 f"{cab}{epi}{corpo_html(c, h='h2', epub=True)}</section>")
        t.joinpath(f"{arq}.xhtml").write_text(x(rotulo, corpo), encoding="utf-8")
        toc.append(f'<li><a href="text/{arq}.xhtml">{html.escape(rotulo)}</a>' + (f"<ol>{subs}</ol>" if subs else "") + "</li>")

    nav = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head><meta charset="utf-8"/><title>Sumário</title><link rel="stylesheet" type="text/css" href="css/epub.css"/></head>
<body>
<nav epub:type="toc" id="toc" role="doc-toc"><h1 class="sumario-titulo">Sumário</h1><ol>
<li><a href="text/rosto.xhtml">Página de rosto</a></li>
<li><a href="text/creditos.xhtml">Créditos</a></li>
<li><a href="text/nota.xhtml">Nota sobre esta edição</a></li>
{''.join(toc)}
</ol></nav>
<nav epub:type="landmarks" hidden=""><ol>
<li><a epub:type="cover" href="text/capa.xhtml">Capa</a></li>
<li><a epub:type="toc" href="nav.xhtml#toc">Sumário</a></li>
<li><a epub:type="bodymatter" href="text/cap00.xhtml">Início da leitura</a></li>
</ol></nav>
</body></html>"""
    (tmp / "OEBPS/nav.xhtml").write_text(nav, encoding="utf-8")
    manifest = [
        '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
        '<item id="css" href="css/epub.css" media-type="text/css"/>',
        '<item id="capa-img" href="img/capa.jpg" media-type="image/jpeg" properties="cover-image"/>',
    ]
    manifest += [f'<item id="img{n:02d}" href="img/cap{n:02d}.jpg" media-type="image/jpeg"/>' for n in imgs_epub]
    manifest += [f'<item id="f{i}" href="fonts/{f.name}" media-type="font/ttf"/>'
                 for i, f in enumerate(sorted((tmp / "OEBPS/fonts").glob("*.ttf")))]
    manifest += [f'<item id="{s}" href="text/{s}.xhtml" media-type="application/xhtml+xml"/>' for s in spine if s != "nav"]
    agora = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    opf = f"""<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="pt-BR">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="uid">urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, 'o-grande-conflito-edicao-ilustrada')}</dc:identifier>
<dc:title>O Grande Conflito — Edição ilustrada em linguagem simples</dc:title>
<dc:creator>Ellen G. White</dc:creator>
<dc:language>pt-BR</dc:language>
<dc:description>Edição ilustrada em linguagem simples.</dc:description>
<meta property="dcterms:modified">{agora}</meta>
<meta property="schema:accessMode">textual</meta>
<meta property="schema:accessMode">visual</meta>
<meta property="schema:accessModeSufficient">textual</meta>
<meta property="schema:accessibilityFeature">structuralNavigation</meta>
<meta property="schema:accessibilityFeature">tableOfContents</meta>
<meta property="schema:accessibilityFeature">alternativeText</meta>
<meta property="schema:accessibilityFeature">readingOrder</meta>
<meta property="schema:accessibilityHazard">none</meta>
<meta property="schema:accessibilitySummary">Texto reflowable com sumário navegável, títulos estruturados e texto alternativo nas imagens.</meta>
</metadata>
<manifest>
{chr(10).join(manifest)}
</manifest>
<spine>
{chr(10).join(f'<itemref idref="{s}"/>' for s in spine)}
</spine>
</package>"""
    (tmp / "OEBPS/content.opf").write_text(opf, encoding="utf-8")
    out = SAIDA / f"{NOME}.epub"
    with zipfile.ZipFile(out, "w") as z:
        z.write(tmp / "mimetype", "mimetype", compress_type=zipfile.ZIP_STORED)
        for p in sorted(tmp.rglob("*")):
            if p.is_file() and p.name != "mimetype":
                z.write(p, p.relative_to(tmp).as_posix(), compress_type=zipfile.ZIP_DEFLATED)
    return out


def main():
    from weasyprint import HTML

    SAIDA.mkdir(exist_ok=True)
    shutil.copy(RAIZ / "estilo-pdf.css", SAIDA / "estilo-pdf.css")
    caps = carregar()
    imgs_pdf, imgs_epub = preparar_imagens()
    print("EPUB:", montar_epub(caps, imgs_epub))
    (SAIDA / "livro-pdf.html").write_text(html_pdf(caps, imgs_pdf), encoding="utf-8")
    pdf = SAIDA / f"{NOME}.pdf"
    HTML(filename=str(SAIDA / "livro-pdf.html")).write_pdf(str(pdf))
    print("PDF:", pdf)


if __name__ == "__main__":
    main()
