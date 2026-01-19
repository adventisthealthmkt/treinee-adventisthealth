import { ArrowRight, Mail, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClosingSection = () => {
  return (
    <section id="contato" className="section-padding bg-background">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="card-institutional text-center p-8 md:p-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Construindo o Futuro da Saúde Juntos
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
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
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Instituições parceiras e de interesse incluem:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["UAP", "UPeU", "FAP", "UNASP", "FAAMA", "UNIAENSE"].map((inst) => (
                <span
                  key={inst}
                  className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium"
                >
                  {inst}
                </span>
              ))}
              <span className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
                e outras IES do Brasil e exterior
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingSection;
