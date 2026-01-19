import { 
  Users, 
  Settings, 
  Shield, 
  Leaf, 
  Heart, 
  TrendingUp, 
  GraduationCap, 
  HandHeart,
  Sparkles
} from "lucide-react";

const objectives = [
  {
    icon: Users,
    title: "Desenvolvimento e Retenção de Talentos",
    description: "Formação contínua e valorização dos profissionais da rede",
  },
  {
    icon: Settings,
    title: "Eficiência Operacional",
    description: "Processos assistenciais e administrativos de excelência",
  },
  {
    icon: Shield,
    title: "Governança e Conformidade",
    description: "Fortalecimento regulatório e práticas de compliance",
  },
  {
    icon: Leaf,
    title: "Sustentabilidade Ambiental",
    description: "Compromisso com práticas sustentáveis e meio ambiente",
  },
  {
    icon: Heart,
    title: "Experiência do Paciente",
    description: "Cuidado centrado no paciente e fortalecimento da marca",
  },
  {
    icon: TrendingUp,
    title: "Sustentabilidade Financeira",
    description: "Gestão responsável e viabilidade econômica de longo prazo",
  },
  {
    icon: GraduationCap,
    title: "Educação e Impacto Social",
    description: "Promoção da saúde e parcerias educacionais",
  },
  {
    icon: HandHeart,
    title: "Filantropia e Assistência",
    description: "Compromisso social e atuação filantrópica",
  },
  {
    icon: Sparkles,
    title: "Dimensão Espiritual",
    description: "Integração do cuidado espiritual na assistência",
  },
];

const ObjectivesSection = () => {
  return (
    <section id="objetivos" className="section-padding gradient-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Direcionamento Estratégico
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Objetivos Estratégicos
          </h2>
          <p className="text-lg text-muted-foreground">
            Pilares que guiam nossa atuação e desenvolvimento institucional
          </p>
        </div>

        {/* Objectives Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className="card-institutional group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <objective.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {objective.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {objective.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ObjectivesSection;
