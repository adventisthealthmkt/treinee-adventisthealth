/**
 * Fotos/vídeos reais opcionais para cada plano.
 *
 * Por padrão (null) cada plano usa a ilustração cinematográfica gerada em código.
 * Para usar uma imagem licenciada, coloque o arquivo em public/images/ e informe
 * o caminho relativo a public/, por exemplo: "images/pastor-campo.jpg".
 * Imagens recebem zoom lento e pan automaticamente (Ken Burns).
 * Vídeos (.mp4/.webm/.mov) são reproduzidos sem som, em loop.
 */
export const PHOTOS: Record<string, string | null> = {
  "cena-1": null, // jovem pastor sentado no campo, de costas, ovelhas, fim de tarde
  "cena-2-casa": null, // interior de casa simples, pessoas reunidas
  "cena-2-campo": null, // Davi em pé no campo, cuidando das ovelhas
  "cena-3-janela": null, // pessoa contemporânea olhando pela janela
  "cena-3-rua": null, // pessoa andando na rua ao entardecer
  "cena-4": null, // pessoa num dia comum, céu nublado que abre para luz dourada
  "cena-5-caderno": null, // caderno aberto, páginas, luz natural
  "cena-5-estrada": null, // estrada no horizonte
  "cena-6": null, // pastor se levanta e caminha rumo ao horizonte
};
