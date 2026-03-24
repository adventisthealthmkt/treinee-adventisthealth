import { useState } from "react";
import { X } from "lucide-react";
import diagramaGestao from "@/assets/diagrama-gestao.png";

const StrategicPerspectivesSection = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <section id="perspectivas" className="section-padding bg-muted/30">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              Modelo de Gestão
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              7 Perspectivas Estratégicas
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Nosso modelo de gestão é baseado em sete perspectivas estratégicas, representadas neste diagrama de forma integrada e sistêmica, com o objetivo de garantir uma visão integral do cuidado em todo o Ecossistema da Adventist Health Brasil (AHB).
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 flex justify-center">
              <img
                src={diagramaGestao}
                alt="Diagrama das 7 perspectivas estratégicas do modelo de gestão da Adventist Health Brasil"
                className="w-full max-w-md lg:max-w-lg rounded-2xl cursor-zoom-in hover:opacity-90 transition-opacity"
                loading="lazy"
                onClick={() => setIsZoomed(true)}
              />
            </div>

            <div className="flex-1 max-w-xl">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                As sete perspectivas que sustentam esse modelo orientam nossa atuação em todas as dimensões do cuidado: <strong className="text-foreground">espiritual</strong>, <strong className="text-foreground">sustentabilidade social</strong>, <strong className="text-foreground">sustentabilidade financeira</strong>, <strong className="text-foreground">clientes e mercado</strong>, <strong className="text-foreground">sustentabilidade ambiental</strong>, <strong className="text-foreground">processos internos</strong> e <strong className="text-foreground">aprendizado e crescimento</strong>, sempre guiadas pelo propósito maior de <em>servir, curar e salvar</em>.
              </p>
            </div>
          </div>
        </div>
      </section>

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
            src={diagramaGestao}
            alt="Diagrama das 7 perspectivas estratégicas"
            className="max-w-full max-h-[90vh] rounded-lg"
          />
        </div>
      )}
    </>
  );
};

export default StrategicPerspectivesSection;
