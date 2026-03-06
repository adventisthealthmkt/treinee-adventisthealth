import { MapPin } from "lucide-react";

const locations = [
  { city: "Amazonas", state: "Manaus", units: 1 },
  { city: "Mato Grosso do Sul", state: "Campo Grande", units: 3 },
  { city: "Pará", state: "Belém e Barcarena", units: 2 },
  { city: "Paraná", state: "Curitiba", units: 1 },
  { city: "Rio de Janeiro", state: "Rio de Janeiro, Botafogo e Itaboraí", units: 3 },
  { city: "Rio Grande do Sul", state: "Porto Alegre", units: 1 },
  { city: "São Paulo", state: "São Paulo, Capão Redondo e Engenheiro Coelho", units: 5 },
];

const NetworkMapSection = () => {
  return (
    <section id="rede" className="section-padding bg-background">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            Presença Nacional
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nossa Rede pelo Brasil
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Hospitais, centros médicos, clínicas e spas médicos em diversas regiões
          </p>
        </div>

        {/* Map + Locations */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Interactive Map */}
          <div className="relative w-full rounded-2xl md:rounded-[28px] overflow-hidden p-2 md:p-3.5 bg-gradient-to-br from-[hsl(var(--primary-light))] to-[hsl(var(--accent))] shadow-[0_10px_30px_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(255,255,255,0.35)] md:shadow-[0_20px_40px_rgba(0,0,0,0.18),inset_0_0_0_1px_rgba(255,255,255,0.35)]">
            <iframe
              src="https://josuealvesm.github.io/mapadventisthealth/"
              loading="lazy"
              title="Mapa Adventist Health"
              className="w-full h-full block border-0 rounded-xl md:rounded-[20px] bg-[hsl(var(--accent))] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
            />
          </div>

          {/* Locations List */}
          <div className="space-y-2 md:space-y-4">
            {locations.map((location, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base text-foreground">{location.city}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{location.state}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent text-accent-foreground text-xs md:text-sm font-semibold">
                    {location.units}
                  </span>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">
                    {location.units === 1 ? "unidade" : "unidades"}
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

export default NetworkMapSection;
