import { MapPin } from "lucide-react";

const locations = [
  { city: "Pará", state: "Belém e Barcarena", units: 2 },
  { city: "Amazonas", state: "Manaus", units: 1 },
  { city: "Mato Grosso do Sul", state: "Campo Grande", units: 1 },
  { city: "São Paulo", state: "São Paulo, Capão Redondo e Engenheiro Coelho", units: 3 },
  { city: "Rio de Janeiro / Itaboraí", state: "RJ", units: 3 },
  { city: "Curitiba", state: "PR", units: 1 },
  { city: "Porto Alegre", state: "RS", units: 1 },
];

const NetworkMapSection = () => {
  return (
    <section id="rede" className="section-padding bg-background">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            Presença Nacional
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nossa Rede pelo Brasil
          </h2>
          <p className="text-lg text-muted-foreground">
            Hospitais, centros médicos, clínicas e spas médicos em diversas regiões
          </p>
        </div>

        {/* Map Placeholder + Locations */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Interactive Map */}
          <div className="relative w-full max-w-[980px] aspect-square rounded-[28px] overflow-hidden p-3.5 bg-gradient-to-br from-[hsl(var(--primary-light))] to-[hsl(var(--accent))] shadow-[0_20px_40px_rgba(0,0,0,0.18),inset_0_0_0_1px_rgba(255,255,255,0.35)]">
            <iframe
              src="https://josuealvesm.github.io/mapadventisthealth/"
              loading="lazy"
              title="Mapa Adventist Health"
              className="w-full h-full block border-0 rounded-[20px] bg-[hsl(var(--accent))] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
            />
          </div>

          {/* Locations List */}
          <div className="space-y-4">
            {locations.map((location, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{location.city}</p>
                    <p className="text-sm text-muted-foreground">{location.state}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                    {location.units}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
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
