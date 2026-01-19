import { Target, Eye, Heart, Sparkles, Shield, Users, Leaf, HandHeart } from "lucide-react";

const values = [
  { icon: Heart, label: "Amor a Deus e ao próximo" },
  { icon: Shield, label: "Respeito aos princípios bíblicos" },
  { icon: Sparkles, label: "Integridade, ética e transparência" },
  { icon: Target, label: "Excelência em servir" },
  { icon: HandHeart, label: "Acolhimento, cuidado e compaixão" },
  { icon: Users, label: "Competência técnica com inovação" },
  { icon: Leaf, label: "Sustentabilidade integral" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="section-padding bg-background">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            Quem Somos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Sobre a Adventist Health Brasil
          </h2>
          <p className="text-lg text-muted-foreground">
            Uma tradição centenária de cuidado com a vida
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Mission */}
          <div className="card-institutional">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Missão</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Servir, curar e salvar, promovendo a saúde física, mental, social e espiritual, 
              seguindo o exemplo de Cristo.
            </p>
          </div>

          {/* Vision */}
          <div className="card-institutional">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Visão</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ser uma rede de saúde reconhecida pela excelência na assistência médico-hospitalar, 
              prevenção e promoção de um estilo de vida saudável, integrando fé e ciência.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="card-institutional">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            Nossos Valores
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
              >
                <value.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{value.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="mt-12 max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Nossa História</h3>
          <p className="text-muted-foreground leading-relaxed">
            A Adventist Health Brasil integra uma tradição centenária da Igreja Adventista do Sétimo Dia 
            no cuidado com a vida. Ao longo das décadas, a rede expandiu sua atuação no Brasil, 
            consolidando hospitais, centros médicos, clínicas e spas médicos comprometidos com 
            excelência assistencial, missão cristã, formação profissional e contribuição social, 
            atuando de forma integrada com instituições educacionais no Brasil e no exterior.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
