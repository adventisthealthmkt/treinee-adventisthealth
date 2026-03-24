import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import diagramaEcossistema from "@/assets/diagrama-ecossistema.png";

const layers = [
  {
    title: "Centro — Beneficiários",
    text: "No núcleo está o paciente, simbolizando que toda a estrutura da Adventist Health existe para servir quem busca cuidado.",
  },
  {
    title: "Proasa Saúde",
    text: "Operadora de saúde que envolve diretamente o usuário, promovendo os 8 princípios de saúde integral: alimentação saudável, exercício físico, água, luz solar, temperança, ar puro, repouso e confiança em Deus.",
  },
  {
    title: "7 Grupos de Necessidades",
    text: "Prevenção e acompanhamento do câncer, ansiedade e depressão, dificuldade para dormir, excesso de peso, derrames cerebrais e infartos, distúrbios digestivos, e saúde emocional e espiritual.",
  },
  {
    title: "Clínica Adventista",
    text: "Atenção primária com foco em prevenção e acompanhamento contínuo.",
  },
  {
    title: "Centro de Apoio à Saúde",
    text: "Serviços complementares como atenção domiciliar, linha de cuidado em saúde mental e centros de reabilitação.",
  },
  {
    title: "Centro Médico Adventista",
    text: "Estrutura ambulatorial para consultas especializadas e procedimentos.",
  },
  {
    title: "Hospital Adventista",
    text: "Nível terciário, voltado para internações, cirurgias e tratamentos complexos.",
  },
  {
    title: "Modelo de Gestão",
    text: "Sete perspectivas estratégicas sustentam o ecossistema: Missão (Servir, Curar e Salvar), Espiritual, Sustentabilidade Social, Sustentabilidade Financeira, Clientes e Mercado, Sustentabilidade Ambiental, Processos Internos, e Aprendizagem e Crescimento.",
  },
];

const EcosystemSection = () => {
  const isMobile = useIsMobile();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = (index: number) => {
    setCarouselIndex(Math.max(0, Math.min(index, layers.length - 1)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(carouselIndex + 1);
      else goTo(carouselIndex - 1);
    }
  };

  return (
    <>
      <section id="ecossistema" className="section-padding bg-background">
        <div className="section-container">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              Modelo Assistencial
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Ecossistema Assistencial da Adventist Health Brasil
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Um modelo integrado de cuidado centrado no paciente, que conecta prevenção, atenção primária, especializada e hospitalar sob uma gestão orientada pela missão.
            </p>
          </div>

          {/* Mobile: image above, slider below */}
          {isMobile ? (
            <>
              <div className="flex justify-center mb-8">
                <img
                  src={diagramaEcossistema}
                  alt="Diagrama do Ecossistema Assistencial da Adventist Health Brasil"
                  className="w-full max-w-sm rounded-2xl cursor-zoom-in"
                  loading="lazy"
                  onClick={() => setIsZoomed(true)}
                />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                Camadas do Ecossistema
              </h3>

              <div>
                <div
                  className="overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                  >
                    {layers.map((layer, index) => (
                      <div key={index} className="w-full flex-shrink-0 px-1">
                        <div className="card-institutional flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">
                              {layer.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {layer.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => goTo(carouselIndex - 1)}
                    disabled={carouselIndex === 0}
                    className="p-2 rounded-full bg-card border border-border text-foreground disabled:opacity-30 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-1.5">
                    {layers.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === carouselIndex ? "bg-primary w-6" : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => goTo(carouselIndex + 1)}
                    disabled={carouselIndex === layers.length - 1}
                    className="p-2 rounded-full bg-card border border-border text-foreground disabled:opacity-30 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Desktop: image left, layers right */
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="flex justify-center sticky top-24">
                <img
                  src={diagramaEcossistema}
                  alt="Diagrama do Ecossistema Assistencial da Adventist Health Brasil"
                  className="w-full max-w-md lg:max-w-lg rounded-2xl cursor-zoom-in hover:opacity-90 transition-opacity"
                  loading="lazy"
                  onClick={() => setIsZoomed(true)}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Camadas do Ecossistema
                </h3>
                <div className="grid gap-3">
                  {layers.map((layer, index) => (
                    <div
                      key={index}
                      className="card-institutional flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-base mb-1">
                          {layer.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {layer.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

          {/* Quote */}
          <blockquote className="max-w-4xl mx-auto mt-12 md:mt-16 border-l-4 border-primary pl-6 py-2">
            <p className="text-base md:text-lg text-muted-foreground italic leading-relaxed">
              "O Ecossistema Assistencial da Adventist Health Brasil tem como objetivo colocar nossos beneficiários e pacientes no centro do cuidado, por meio da integração entre os três níveis de atenção à saúde: Clínicas Adventistas, Centros Médicos e Hospitais, além dos Centros de Apoio à Saúde, que incluem as linhas de cuidado, a atenção domiciliar e a Clínica Adventista Digital."
            </p>
            <footer className="mt-3 text-sm font-semibold text-foreground">
              Dr. Davi Reis Lopes
              <span className="block text-muted-foreground font-normal">Diretor Executivo Médico</span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Zoom overlay */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={diagramaEcossistema}
            alt="Diagrama do Ecossistema Assistencial da Adventist Health Brasil"
            className="max-w-full max-h-[90vh] rounded-lg"
          />
        </div>
      )}
    </>
  );
};

export default EcosystemSection;
