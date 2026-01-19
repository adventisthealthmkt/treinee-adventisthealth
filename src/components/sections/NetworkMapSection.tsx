import { MapPin } from "lucide-react";

const locations = [
  { city: "Belém / Barcarena", state: "PA", units: 2 },
  { city: "Manaus", state: "AM", units: 1 },
  { city: "Campo Grande", state: "MS", units: 1 },
  { city: "São Paulo / Engenheiro Coelho", state: "SP", units: 3 },
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
          {/* Map Visual */}
          <div className="card-institutional p-8 md:p-12 flex items-center justify-center min-h-[400px] bg-gradient-to-br from-primary-light to-accent">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Mapa Interativo
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Visualização geográfica das unidades da rede em desenvolvimento
              </p>
            </div>
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
