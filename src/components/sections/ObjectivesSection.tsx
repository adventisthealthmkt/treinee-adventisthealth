import {
  Users, Settings, Shield, Leaf, Heart, TrendingUp, GraduationCap, HandHeart, Sparkles, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const objectives = [
  {
    icon: Users,
    title: "Desenvolvimento e Retenção de Talentos",
    description: "Promover a atração, desenvolvimento e retenção de talentos dos colaboradores e corpo clínico.",
  },
  {
    icon: Settings,
    title: "Eficiência Operacional",
    description: "Aprimorar a eficiência dos processos assistenciais e administrativos.",
  },
  {
    icon: Shield,
    title: "Governança e Conformidade",
    description: "Implementar certificações nacionais e internacionais de acordo com a estratégia para cada unidade.",
  },
  {
    icon: Leaf,
    title: "Sustentabilidade Ambiental",
    description: "Reduzir o impacto ambiental das operações por meio de práticas sustentáveis.",
  },
  {
    icon: Heart,
    title: "Experiência do Paciente",
    description: "Melhorar a experiência e a satisfação dos clientes e mercado, gerando valor com ênfase na saúde integral.",
  },
  {
    icon: TrendingUp,
    title: "Sustentabilidade Financeira",
    description: "Garantir a sustentabilidade financeira por meio da gestão de custos e do aumento de receitas.",
  },
  {
    icon: GraduationCap,
    title: "Educação e Impacto Social",
    description: "Engajar a comunidade em programas de prevenção de doenças, hábitos saudáveis e de assistência social em parceria com entidades públicas e privadas.",
  },
  {
    icon: HandHeart,
    title: "Filantropia e Assistência",
    description: "Fortalecer iniciativas e cumprir os requisitos de filantropia.",
  },
  {
    icon: Sparkles,
    title: "Dimensão Espiritual",
    description: "Promover o cumprimento da missão, visão e valores em todos os níveis institucionais, atendendo às necessidades espirituais dos colaboradores, pacientes e beneficiários.",
  },
];

const ObjectivesSection = () => {
  const isMobile = useIsMobile();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = useCallback((index: number) => {
    setCarouselIndex(Math.max(0, Math.min(index, objectives.length - 1)));
  }, []);

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
    <section id="objetivos" className="section-padding gradient-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Direcionamento Estratégico
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Objetivos Estratégicos
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Pilares que guiam nossa atuação e desenvolvimento institucional
          </p>
        </div>

        {/* Mobile: Carousel */}
        {isMobile ? (
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
                {objectives.map((objective, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-1">
                    <div className="card-institutional group">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <objective.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1.5 text-sm">
                            {objective.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {objective.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => goTo(carouselIndex - 1)}
                disabled={carouselIndex === 0}
                className="p-2 rounded-full bg-card border border-border text-foreground disabled:opacity-30 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1.5">
                {objectives.map((_, i) => (
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
                disabled={carouselIndex === objectives.length - 1}
                className="p-2 rounded-full bg-card border border-border text-foreground disabled:opacity-30 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Desktop: Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="card-institutional group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <objective.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5 md:mb-2 text-sm md:text-base">
                      {objective.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {objective.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ObjectivesSection;
