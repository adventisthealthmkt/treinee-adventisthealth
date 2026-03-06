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
  return (
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

        {/* Diagram */}
        <div className="flex justify-center mb-10 md:mb-14">
          <img
            src={diagramaEcossistema}
            alt="Diagrama do Ecossistema Assistencial da Adventist Health Brasil mostrando camadas concêntricas de cuidado centradas no paciente"
            className="w-full max-w-2xl rounded-2xl"
            loading="lazy"
          />
        </div>

        {/* Layers explanation */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-6 text-center">
            Camadas do Ecossistema
          </h3>
          <div className="grid gap-3 md:gap-4">
            {layers.map((layer, index) => (
              <div
                key={index}
                className="card-institutional flex items-start gap-4"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs md:text-sm font-bold text-primary">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm md:text-base mb-1">
                    {layer.title}
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {layer.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
