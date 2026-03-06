import { ArrowRight, Mail, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClosingSection = () => {
  return (
    <section id="contato" className="section-padding bg-background">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="card-institutional text-center p-6 md:p-12">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>

            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 md:mb-6">
              Construindo o futuro da saúde juntos
            </h2>

            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-8 max-w-2xl mx-auto">
              A Adventist Health Brasil é mais do que uma rede de saúde. É um ambiente de
              aprendizado, cuidado, missão e desenvolvimento humano, aberto a parcerias
              acadêmicas que compartilham do compromisso com a vida, a ética e a excelência.
            </p>

            <div className="flex justify-center">
              <a href="mailto:marketing.ah@adventisthealth.com.br">
                <Button variant="institutional" size="lg">
                  <Mail className="w-5 h-5" />
                  Entre em contato
                </Button>
              </a>
            </div>
          </div>

          {/* Partner Institutions Note */}
          <div className="mt-6 md:mt-8 text-center">
            <p className="text-sm mb-3 md:mb-4 text-primary font-bold">Instituições parceiras:</p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {[
                { name: "UAP", url: "https://uap.edu.ar/" },
                { name: "UPeU", url: "https://upeu.edu.pe/" },
                { name: "FAP", url: "https://faculdadeadventista.edu.br/" },
                { name: "UNASP", url: "https://unasp.br" },
                { name: "FAAMA", url: "https://faama.edu.br" },
                { name: "UNIAENE", url: "https://uniaene.edu.br" },
                { name: "FADMINAS", url: "https://fadminas.edu.br" },
              ].map((inst) => (
                <a
                  key={inst.name}
                  href={inst.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-accent text-accent-foreground text-xs md:text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {inst.name}
                </a>
              ))}
              <a
                href="https://adventistcolleges.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-muted text-muted-foreground text-xs md:text-sm hover:bg-primary/10 hover:text-primary transition-colors"
              >
                e outras IES do Brasil e exterior
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default ClosingSection;