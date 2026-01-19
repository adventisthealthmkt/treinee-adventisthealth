import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
const HeroSection = () => {
  return <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="section-container relative z-10 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8 animate-fade-in">
            <span className="text-sm font-medium text-primary-foreground">
              Rede de Saúde Adventista no Brasil
            </span>
          </div>

          {/* Main Title */}
          

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-4 animate-fade-in-up font-semibold md:text-7xl" style={{
          animationDelay: "0.1s"
        }}>
            Cuidado, formação e missão a serviço da vida
          </p>

          {/* Description */}
          <p className="text-lg text-primary-foreground/80 max-w-2xl mb-10 leading-relaxed animate-fade-in-up" style={{
          animationDelay: "0.2s"
        }}>
            Uma rede de saúde comprometida com a excelência assistencial, o desenvolvimento 
            profissional e a integração entre fé, ciência e educação.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{
          animationDelay: "0.3s"
        }}>
            <a href="#rede">
              <Button variant="hero" size="xl" className="group">
                Conheça nossa rede de saúde
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <a href="#instituicoes">
              <Button variant="heroOutline" size="xl">
                <GraduationCap className="w-5 h-5" />
                Explore nossas instituições
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-8 border-t border-primary-foreground/20 animate-fade-in-up" style={{
          animationDelay: "0.4s"
        }}>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary-foreground text-center">16</p>
              <p className="text-sm text-primary-foreground/70 mt-1 text-center">Instituições de saúde</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary-foreground text-center">8</p>
              <p className="text-sm text-primary-foreground/70 mt-1 text-center">Hospitais</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary-foreground text-center">+80</p>
              <p className="text-sm text-primary-foreground/70 mt-1 text-center">Anos de História</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary-foreground text-center">+6.500</p>
              <p className="text-sm text-primary-foreground/70 mt-1 text-center">Colaboradores</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;