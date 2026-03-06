import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="section-container relative z-10 pt-20 pb-8 md:pt-24 md:pb-16">
        <div className="max-w-4xl flex flex-col items-center text-center">
          {/* Badge */}
          <div className="hidden sm:inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6 md:mb-8 animate-fade-in mx-auto">
            <span className="text-xs md:text-sm font-medium text-primary-foreground">
              Somos a rede de instituições adventistas de saúde no Brasil
            </span>
          </div>

          {/* Subtitle / Main Title */}
          <h1
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl text-primary-foreground/90 mb-4 md:mb-4 animate-fade-in-up font-semibold leading-tight"
            style={{ animationDelay: "0.1s" }}
          >
            Cuidado, formação e missão a serviço da vida
          </h1>

          {/* Description */}
          <p
            className="text-sm sm:text-base md:text-lg text-primary-foreground/80 max-w-2xl mb-8 md:mb-10 leading-relaxed animate-fade-in-up text-center px-2"
            style={{ animationDelay: "0.2s" }}
          >
            Uma rede de saúde comprometida com a excelência assistencial, o desenvolvimento
            profissional e a integração entre fé, ciência e educação.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in-up items-center justify-center w-full px-2"
            style={{ animationDelay: "0.3s" }}
          >
            <a href="#rede" className="w-full sm:w-auto">
              <Button variant="hero" size="xl" className="group w-full sm:w-auto text-sm md:text-base">
                Conheça nossa rede de saúde
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <a href="#instituicoes" className="w-full sm:w-auto">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto text-sm md:text-base">
                <GraduationCap className="w-4 h-4 md:w-5 md:h-5" />
                Explore nossas instituições
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mt-10 md:mt-16 pt-6 md:pt-8 border-t border-primary-foreground/20 animate-fade-in-up w-full"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: "16", label: "Instituições de saúde" },
              { value: "8", label: "Hospitais" },
              { value: "+80", label: "Anos de História" },
              { value: "+6.500", label: "Colaboradores" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-4xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-[11px] sm:text-xs md:text-sm text-primary-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
