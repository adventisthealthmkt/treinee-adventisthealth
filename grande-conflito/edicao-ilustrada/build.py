#!/usr/bin/env python3
"""Monta o protótipo editorial de O Grande Conflito (PDF + EPUB).

Uso:  python build.py            (gera saida/*.pdf, saida/*.epub)
Requer: weasyprint, pillow (pip install weasyprint pillow)

Ilustrações: o script procura em imagens/. Quando um arquivo não existe,
monta no lugar um marcador visível ("ilustração a inserir").
  imagens/capa-aprovada.png      capa aprovada (obrigatória)
  imagens/cap01-abertura.jpg     abertura do capítulo 1 (Jesus contempla Jerusalém)
  imagens/cap01-rodape.jpg       paisagem suave para a 1ª página de leitura (opcional)
"""
import html
import re
import shutil
import uuid
import zipfile
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
IMG = RAIZ / "imagens"
FONTES = RAIZ / "fontes"
SAIDA = RAIZ / "saida"
TEXTO = RAIZ / "texto-cap01.md"

# Título da versão em linguagem simples (primeira linha de texto-cap01.md),
# dividido em parte leve (Unbounded 400) e parte forte (Unbounded 700).
TITULO_CAP = re.sub(r"^## Capítulo \d+ — ", "", TEXTO.read_text(encoding="utf-8").splitlines()[0]).strip()
TITULO_LEVE, TITULO_FORTE = "O destino do mundo", "foi anunciado"
assert f"{TITULO_LEVE} {TITULO_FORTE}" == TITULO_CAP, TITULO_CAP
TITULO_HTML = f'<span class="leve">{TITULO_LEVE}</span> <span class="forte">{TITULO_FORTE}</span>'
KICKER_CAP = "Jesus e Jerusalém"

# ---------------------------------------------------------------- texto


def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)
    return t


def ler_capitulo():
    """Devolve (epigrafe_html, lista de seções [(titulo, [blocos])])."""
    linhas = TEXTO.read_text(encoding="utf-8").splitlines()
    linhas = [l for l in linhas if not l.startswith("## ")]
    blocos, atual = [], []
    for l in linhas + [""]:
        if l.strip() == "":
            if atual:
                blocos.append(atual)
                atual = []
        else:
            atual.append(l)
    epigrafe = None
    secoes = []
    for b in blocos:
        if b[0].startswith("### "):
            secoes.append((b[0][4:].strip(), []))
            continue
        if b[0].startswith(">"):
            paras = [re.sub(r"^>\s?", "", x) for x in b]
            if not secoes:
                epigrafe = " ".join(paras)
                continue
            secoes[-1][1].append(("citacao", paras))
        else:
            secoes[-1][1].append(("p", " ".join(b)))
    return epigrafe, secoes


def separar_ref(t):
    """'“texto” (Lucas 19:42-44)' -> ('“texto”', 'Lucas 19:42-44')."""
    m = re.match(r"^(.*?)\s*\(([^()]+)\)\s*$", t)
    return (m.group(1), m.group(2)) if m else (t, "")


def citacao_html(paras):
    texto = list(paras)
    fonte = ""
    m = re.search(r"\s*\((\*História.*?)\)\s*$", texto[-1])
    if m:
        fonte = m.group(1)
        texto[-1] = texto[-1][: m.start()]
    corpo = "".join(f"<p>{inline(p)}</p>" for p in texto if p.strip())
    fonte_html = f'<p class="fonte">{inline(fonte)}</p>' if fonte else ""
    return f'<blockquote class="historiador">{corpo}{fonte_html}</blockquote>'


# Linha do tempo: somente fatos narrados no próprio capítulo 1.
# Anos (66 e 70 d.C.) segundo Flávio Josefo, *Guerra dos Judeus*.
LINHA_DO_TEMPO = [
    ("Páscoa", "Do Monte das Oliveiras, Jesus chora por Jerusalém e anuncia que não ficará pedra sobre pedra.", "Lucas 19:41-44"),
    ("Quase 40 anos", "Deus espera. Por meio dos apóstolos, o evangelho é oferecido também aos filhos dos que rejeitaram Jesus.", ""),
    ("Sinais", "Uma luz sobre o templo, o portão leste que se abre sozinho e um homem que, por sete anos, anuncia a desgraça.", ""),
    ("66 d.C.", "O exército de Céstio cerca a cidade e se retira. Na Festa dos Tabernáculos, os cristãos fogem para Pela, além do Jordão.", "Lucas 21:20, 21"),
    ("70 d.C.", "Tito recomeça o cerco na Páscoa. A fome toma conta da cidade.", ""),
    ("O templo em chamas", "Contra as ordens de Tito, um soldado lança uma tocha, e o templo é tomado pelo fogo.", ""),
    ("O fim", "A cidade e o templo são arrasados. Mais de um milhão de pessoas morrem no cerco.", "Jeremias 26:18"),
]

LINHA_APOS_SECAO = "O fim da cidade"
DESTAQUE_APOS_SECAO = "Jesus chora por Jerusalém"
DESTAQUE = ("“Quando se aproximou e viu a cidade, ele chorou por ela.”", "Lucas 19:41")


def linha_do_tempo_html(tag_titulo="h2"):
    itens = "".join(
        f'<li><p class="lt-marca">{html.escape(a)}</p><p class="lt-texto">{html.escape(b)}'
        + (f' <span class="lt-ref">({html.escape(c)})</span>' if c else "")
        + "</p></li>"
        for a, b, c in LINHA_DO_TEMPO
    )
    return (
        '<aside class="especial linha-do-tempo" id="linha-do-tempo" aria-labelledby="lt-titulo">'
        '<p class="kicker">Linha do tempo</p>'
        f'<{tag_titulo} class="especial-titulo" id="lt-titulo">Do aviso à destruição</{tag_titulo}>'
        f"<ol>{itens}</ol>"
        '<p class="lt-nota">Baseada nos fatos narrados neste capítulo. Anos segundo o historiador judeu Flávio Josefo (<i>Guerra dos Judeus</i>).</p>'
        "</aside>"
    )


def destaque_html():
    q, ref = DESTAQUE
    return (
        '<aside class="destaque" aria-hidden="true">'
        f'<p class="destaque-texto">{html.escape(q)}</p><p class="destaque-ref">{ref}</p></aside>'
    )


def corpo_capitulo(secoes, h="h3", ids=True):
    out = []
    primeiro = True
    for i, (tit, blocos) in enumerate(secoes, 1):
        sid = f' id="s{i:02d}"' if ids else ""
        out.append(f'<section class="secao"{sid}><{h} class="secao-titulo">{inline(tit)}</{h}>')
        for tipo, conteudo in blocos:
            if tipo == "p":
                if primeiro:
                    primeiro = False
                    t = inline(conteudo)
                    out.append(f'<p class="capitular"><span class="letra-capitular">{t[0]}</span>{t[1:]}</p>')
                else:
                    out.append(f"<p>{inline(conteudo)}</p>")
            else:
                out.append(citacao_html(conteudo))
        out.append("</section>")
        if tit == DESTAQUE_APOS_SECAO:
            out.append(destaque_html())
        if tit == LINHA_APOS_SECAO:
            out.append(linha_do_tempo_html())
    return "\n".join(out)


NOTA = RAIZ / "nota-edicao.md"


def nota_html():
    paras = [p.strip() for p in NOTA.read_text(encoding="utf-8").split("\n\n") if p.strip()]
    out = []
    for p in paras:
        t = html.escape(p, quote=False)
        t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
        t = t.replace("O Grande Conflito,", "<i>O Grande Conflito</i>,", 1) if not out else t
        out.append(f"<p>{t}</p>")
    return "".join(out)


CREDITOS = (
    "<p><b>O Grande Conflito</b> — edição ilustrada em linguagem simples.<br/>"
    "Texto de Ellen G. White, adaptado em linguagem simples.</p>"
    "<p>As frases foram reescritas em português simples e não devem ser lidas como citações literais da autora. "
    "As passagens bíblicas também foram reescritas em linguagem atual, sempre com a referência indicada.</p>"
    "<p>Ilustrações e projeto gráfico desenvolvidos para esta edição.</p>"
    "<p>Tipografia: Unbounded, Inter e Literata (SIL Open Font License).</p>"
)


# ---------------------------------------------------------------- imagens


def preparar_imagens():
    from PIL import Image

    dst = SAIDA / "img"
    dst.mkdir(parents=True, exist_ok=True)
    imgs = {}
    capa = Image.open(IMG / "capa-aprovada.png").convert("RGB")
    capa.save(dst / "capa.jpg", quality=92)
    imgs["capa"] = "img/capa.jpg"
    for nome in ("cap01-abertura", "cap01-rodape"):
        src = next((p for p in IMG.glob(nome + ".*")), None)
        if src:
            im = Image.open(src).convert("RGB")
            if nome == "cap01-rodape":
                im = esmaecer(im)
            im.save(dst / f"{nome}.jpg", quality=90)
            imgs[nome] = f"img/{nome}.jpg"
    return imgs


def esmaecer(im):
    """Funde a paisagem no papel (#FAF6EE), forte embaixo e sumindo em cima."""
    from PIL import Image

    papel = Image.new("RGB", im.size, (250, 246, 238))
    mascara = Image.linear_gradient("L").resize(im.size)
    mascara = mascara.point(lambda v: int(v * 0.55))
    return Image.composite(im, papel, mascara)


# ---------------------------------------------------------------- PDF

CSS_FONTES = "\n".join(
    f"@font-face{{font-family:'{fam}';src:url('{(FONTES / arq).as_uri()}');font-weight:{w};font-style:{s}}}"
    for fam, arq, w, s in [
        ("Unbounded", "Unbounded-300.ttf", 300, "normal"),
        ("Unbounded", "Unbounded-400.ttf", 400, "normal"),
        ("Unbounded", "Unbounded-600.ttf", 600, "normal"),
        ("Unbounded", "Unbounded-700.ttf", 700, "normal"),
        ("Unbounded", "Unbounded-800.ttf", 800, "normal"),
        ("Inter", "Inter-400-normal.ttf", 400, "normal"),
        ("Inter", "Inter-400-italic.ttf", 400, "italic"),
        ("Inter", "Inter-500-normal.ttf", 500, "normal"),
        ("Inter", "Inter-600-normal.ttf", 600, "normal"),
        ("Literata", "Literata-400-normal.ttf", 400, "normal"),
        ("Literata", "Literata-400-italic.ttf", 400, "italic"),
        ("Literata", "Literata-500-italic.ttf", 500, "italic"),
        ("Literata", "Literata-600-normal.ttf", 600, "normal"),
    ]
)


def html_pdf(epigrafe, secoes, imgs):
    epi_txt, epi_ref = separar_ref(epigrafe)
    if "cap01-abertura" in imgs:
        abertura_fundo = f"url('{imgs['cap01-abertura']}')"
        marcador = ""
    else:
        abertura_fundo = "none"
        marcador = (
            '<div class="marcador"><p class="marcador-rotulo">Ilustração a inserir</p>'
            "<p>Jesus contempla Jerusalém do alto do Monte das Oliveiras. A cidade e o templo "
            "brilham sob o sol da tarde; atmosfera de beleza e melancolia.</p>"
            "<p>Página inteira, 160 × 230 mm, área de título livre no terço inferior.</p></div>"
        )
    rodape = f"url('{imgs['cap01-rodape']}')" if "cap01-rodape" in imgs else "none"
    return f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>O Grande Conflito — Protótipo editorial</title>
<meta name="author" content="Ellen G. White">
<meta name="description" content="Edição ilustrada em linguagem simples — protótipo do capítulo 1">
<style>{CSS_FONTES}
.abertura-arte{{background-image:linear-gradient(to bottom, rgba(21,29,51,0) 52%, rgba(21,29,51,.55) 70%, #151D33 92%), {abertura_fundo}}}
@page leitura:right{{@top-right{{content:"{TITULO_CAP}"}}}}
@page :nth(1 of leitura){{@top-right{{content:none}} background:#FAF6EE {rodape} no-repeat bottom center / 100% auto}}
</style>
<link rel="stylesheet" href="estilo-pdf.css">
</head><body>

<section class="capa" aria-label="Capa"><img src="{imgs['capa']}" alt="Capa: Jesus e Satanás frente a frente sobre a Terra; título O Grande Conflito."></section>

<section class="pagina-vazia"></section>

<section class="rosto">
  <p class="rosto-autora">Ellen G. White</p>
  <h1 class="rosto-titulo"><span class="leve">O grande</span> <span class="forte">Conflito</span></h1>
  <div class="regua"></div>
  <p class="rosto-sub">Edição ilustrada em linguagem simples</p>
</section>

<section class="creditos">
  {CREDITOS}
  <p>Protótipo gerado em {datetime.now(timezone.utc):%d/%m/%Y}.</p>
</section>

<section class="nota" id="nota">
  <p class="kicker">Antes de começar</p>
  <h2 class="nota-titulo">Nota sobre esta edição</h2>
  {nota_html()}
</section>

<nav class="sumario" aria-label="Sumário">
  <h2 class="sumario-titulo">Sumário</h2>
  <ol>
    <li><a href="#cap01"><span class="num">01</span> {TITULO_CAP}</a></li>
    <li class="sub"><a href="#linha-do-tempo">Linha do tempo: do aviso à destruição</a></li>
  </ol>
  <p class="sumario-nota">Protótipo: capítulo 1. Os capítulos 2 a 42 entram na produção integral.</p>
</nav>

<section class="abertura" id="cap01">
  <div class="abertura-arte">{marcador}
    <div class="abertura-titulo">
      <p class="abertura-num"><span class="traco"></span>Capítulo 01</p>
      <h1 class="cap-titulo" style="bookmark-label: 'Capítulo 1 — {TITULO_CAP}'">{TITULO_HTML}</h1>
      <div class="regua"></div>
      <p class="abertura-kicker">{KICKER_CAP}</p>
    </div>
  </div>
</section>

<article class="capitulo" data-titulo="{TITULO_CAP}">
  <blockquote class="epigrafe"><p>{inline(epi_txt)}</p><p class="ref">{epi_ref}</p></blockquote>
  {corpo_capitulo(secoes)}
  <p class="fim-cap" aria-hidden="true">· · ·</p>
</article>
</body></html>"""


# ---------------------------------------------------------------- EPUB


def css_fontes_epub():
    regras = []
    for f in sorted(FONTES.glob("*.ttf")):
        nome = f.stem
        fam, resto = nome.split("-", 1)
        w = int(re.match(r"\d+", resto).group())
        s = "italic" if "italic" in resto else "normal"
        regras.append(f"@font-face{{font-family:'{fam}';src:url('../fonts/{f.name}');font-weight:{w};font-style:{s}}}")
    return "\n".join(regras)


def xhtml(titulo, corpo, tipo="bodymatter", classe=""):
    cls = f' class="{classe}"' if classe else ""
    return f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head><meta charset="utf-8"/><title>{titulo}</title><link rel="stylesheet" type="text/css" href="../css/epub.css"/></head>
<body epub:type="{tipo}"{cls}>
{corpo}
</body></html>"""


def montar_epub(epigrafe, secoes, imgs):
    from PIL import Image

    tmp = SAIDA / "epub-src"
    if tmp.exists():
        shutil.rmtree(tmp)
    for d in ("META-INF", "OEBPS/text", "OEBPS/css", "OEBPS/fonts", "OEBPS/img"):
        (tmp / d).mkdir(parents=True)
    (tmp / "mimetype").write_text("application/epub+zip", encoding="ascii")
    (tmp / "META-INF/container.xml").write_text(
        '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">'
        '<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
        encoding="utf-8",
    )
    for f in FONTES.glob("*.ttf"):
        shutil.copy(f, tmp / "OEBPS/fonts" / f.name)
    # capa reduzida para leitores digitais
    capa = Image.open(IMG / "capa-aprovada.png").convert("RGB")
    capa.save(tmp / "OEBPS/img/capa.jpg", quality=88)
    tem_abertura = "cap01-abertura" in imgs
    if tem_abertura:
        shutil.copy(SAIDA / imgs["cap01-abertura"], tmp / "OEBPS/img/cap01-abertura.jpg")
    css = css_fontes_epub() + "\n" + (RAIZ / "estilo-epub.css").read_text(encoding="utf-8")
    (tmp / "OEBPS/css/epub.css").write_text(css, encoding="utf-8")

    t = tmp / "OEBPS/text"
    t.joinpath("capa.xhtml").write_text(xhtml("Capa",
        '<section epub:type="cover" class="capa"><img src="../img/capa.jpg" alt="Capa: Jesus e Satanás frente a frente sobre a Terra; título O Grande Conflito, de Ellen G. White."/></section>',
        "cover", "sem-margem"), encoding="utf-8")
    t.joinpath("rosto.xhtml").write_text(xhtml("Página de rosto",
        '<section epub:type="titlepage" class="rosto"><p class="rosto-autora">Ellen G. White</p>'
        '<h1 class="rosto-titulo"><span class="leve">O grande</span> <span class="forte">Conflito</span></h1>'
        '<div class="regua"></div><p class="rosto-sub">Edição ilustrada em linguagem simples</p></section>', "frontmatter"), encoding="utf-8")
    t.joinpath("creditos.xhtml").write_text(xhtml("Créditos",
        f'<section epub:type="copyright-page" class="creditos">{CREDITOS}</section>', "frontmatter"), encoding="utf-8")
    t.joinpath("nota.xhtml").write_text(xhtml("Nota sobre esta edição",
        '<section epub:type="preface" class="nota" aria-labelledby="nota-titulo"><p class="kicker">Antes de começar</p>'
        f'<h1 class="nota-titulo" id="nota-titulo">Nota sobre esta edição</h1>{nota_html()}</section>', "frontmatter"), encoding="utf-8")

    epi_txt, epi_ref = separar_ref(epigrafe)
    if tem_abertura:
        arte = ('<figure class="abertura-arte"><img src="../img/cap01-abertura.jpg" '
                'alt="Jesus, sentado no Monte das Oliveiras, contempla Jerusalém iluminada pelo sol da tarde."/></figure>')
    else:
        arte = ('<div class="marcador" role="note"><p class="marcador-rotulo">Ilustração a inserir</p>'
                "<p>Jesus contempla Jerusalém do alto do Monte das Oliveiras.</p></div>")
    cap = (
        f'<section epub:type="chapter" role="doc-chapter" aria-labelledby="cap01-titulo">'
        f'<header class="abertura">{arte}'
        '<p class="abertura-num">Capítulo 01</p>'
        f'<h1 id="cap01-titulo" class="cap-titulo">{TITULO_HTML}</h1>'
        f'<p class="abertura-kicker">{KICKER_CAP}</p></header>'
        f'<blockquote class="epigrafe" epub:type="epigraph" role="doc-epigraph"><p>{inline(epi_txt)}</p><p class="ref">{epi_ref}</p></blockquote>'
        + corpo_capitulo(secoes, h="h2").replace('<aside class="especial', '<aside epub:type="sidebar" class="especial')
        .replace('<h2 class="especial-titulo"', '<h3 class="especial-titulo"').replace("à destruição</h2>", "à destruição</h3>")
        + "</section>"
    )
    t.joinpath("cap01.xhtml").write_text(xhtml(TITULO_CAP, cap), encoding="utf-8")

    itens = []
    for i, (tit, _) in enumerate(secoes, 1):
        itens.append(f'<li><a href="text/cap01.xhtml#s{i:02d}">{inline(tit)}</a></li>')
        if tit == LINHA_APOS_SECAO:
            itens.append('<li><a href="text/cap01.xhtml#linha-do-tempo">Linha do tempo: do aviso à destruição</a></li>')
    itens_secoes = "".join(itens)
    nav = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR">
<head><meta charset="utf-8"/><title>Sumário</title><link rel="stylesheet" type="text/css" href="css/epub.css"/></head>
<body>
<nav epub:type="toc" id="toc" role="doc-toc"><h1 class="sumario-titulo">Sumário</h1><ol>
<li><a href="text/rosto.xhtml">Página de rosto</a></li>
<li><a href="text/creditos.xhtml">Créditos</a></li>
<li><a href="text/nota.xhtml">Nota sobre esta edição</a></li>
<li><a href="text/cap01.xhtml">Capítulo 1 — {TITULO_CAP}</a><ol>{itens_secoes}</ol></li>
</ol></nav>
<nav epub:type="landmarks" hidden=""><ol>
<li><a epub:type="cover" href="text/capa.xhtml">Capa</a></li>
<li><a epub:type="toc" href="nav.xhtml#toc">Sumário</a></li>
<li><a epub:type="bodymatter" href="text/cap01.xhtml">Início da leitura</a></li>
</ol></nav>
</body></html>"""
    (tmp / "OEBPS/nav.xhtml").write_text(nav, encoding="utf-8")

    manifest = [
        '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
        '<item id="css" href="css/epub.css" media-type="text/css"/>',
        '<item id="capa-img" href="img/capa.jpg" media-type="image/jpeg" properties="cover-image"/>',
    ]
    if tem_abertura:
        manifest.append('<item id="cap01-img" href="img/cap01-abertura.jpg" media-type="image/jpeg"/>')
    for i, f in enumerate(sorted((tmp / "OEBPS/fonts").glob("*.ttf"))):
        manifest.append(f'<item id="f{i}" href="fonts/{f.name}" media-type="font/ttf"/>')
    spine = ["capa", "rosto", "creditos", "nota", "nav", "cap01"]
    for s in [x for x in spine if x != "nav"]:
        manifest.append(f'<item id="{s}" href="text/{s}.xhtml" media-type="application/xhtml+xml"/>')
    agora = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    opf = f"""<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="pt-BR">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="uid">urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, 'o-grande-conflito-prototipo')}</dc:identifier>
<dc:title>O Grande Conflito — Protótipo editorial</dc:title>
<dc:creator>Ellen G. White</dc:creator>
<dc:language>pt-BR</dc:language>
<dc:description>Edição ilustrada em linguagem simples. Protótipo do capítulo 1, para avaliação interna.</dc:description>
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

    out = SAIDA / "O_Grande_Conflito_Prototipo.epub"
    with zipfile.ZipFile(out, "w") as z:
        z.write(tmp / "mimetype", "mimetype", compress_type=zipfile.ZIP_STORED)
        for p in sorted(tmp.rglob("*")):
            if p.is_file() and p.name != "mimetype":
                z.write(p, p.relative_to(tmp).as_posix(), compress_type=zipfile.ZIP_DEFLATED)
    return out


# ---------------------------------------------------------------- main


def main():
    from weasyprint import HTML

    SAIDA.mkdir(exist_ok=True)
    shutil.copy(RAIZ / "estilo-pdf.css", SAIDA / "estilo-pdf.css")
    imgs = preparar_imagens()
    epigrafe, secoes = ler_capitulo()
    doc = html_pdf(epigrafe, secoes, imgs)
    (SAIDA / "prototipo-pdf.html").write_text(doc, encoding="utf-8")
    pdf = SAIDA / "O_Grande_Conflito_Prototipo.pdf"
    HTML(filename=str(SAIDA / "prototipo-pdf.html")).write_pdf(str(pdf), pdf_variant=None)
    print("PDF:", pdf)
    print("EPUB:", montar_epub(epigrafe, secoes, imgs))


if __name__ == "__main__":
    main()
