import { useState, useRef, useCallback, useMemo } from "react";
import { Building2, Stethoscope, Heart, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import { hospitals, medicalCenters, clinics, medicalSpas, type Institution } from "@/data/institutions";
import { useIsMobile } from "@/hooks/use-mobile";
import InstitutionCard from "./InstitutionCard";
import InstitutionFilters, { type Filters } from "./InstitutionFilters";

const PLACEHOLDER = "Informação institucional em atualização";

const tabs = [
  { id: "hospitals", label: "Hospitais", icon: Building2, data: hospitals },
  { id: "medical-centers", label: "Centros Médicos", icon: Stethoscope, data: medicalCenters },
  { id: "clinics", label: "Clínicas", icon: Heart, data: clinics },
  { id: "spas", label: "Spas Médicos", icon: Leaf, data: medicalSpas },
];

const parseList = (value: string): string[] =>
  value.split(",").map((s) => s.trim()).filter(Boolean);

const InstitutionsSection = () => {
  const [activeTab, setActiveTab] = useState("hospitals");
  const [filters, setFilters] = useState<Filters>({ state: "", specialty: "", service: "" });
  const isMobile = useIsMobile();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const tabData = tabs.find((tab) => tab.id === activeTab)?.data || [];

  const activeData = useMemo(() => {
    return tabData.filter((inst) => {
      if (filters.state && inst.state !== filters.state) return false;
      if (filters.specialty) {
        if (inst.specialties === PLACEHOLDER) return false;
        const list = parseList(inst.specialties);
        if (!list.includes(filters.specialty)) return false;
      }
      if (filters.service) {
        if (!inst.services || inst.services === PLACEHOLDER) return false;
        const list = parseList(inst.services);
        if (!list.includes(filters.service)) return false;
      }
      return true;
    });
  }, [tabData, filters]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCarouselIndex(0);
  };

  const goTo = useCallback((index: number) => {
    setCarouselIndex(Math.max(0, Math.min(index, activeData.length - 1)));
  }, [activeData.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(carouselIndex + 1);
      else goTo(carouselIndex - 1);
    }
  };

  return (
    <section id="instituicoes" className="section-padding gradient-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nossas Instituições
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Instituições da Adventist Health Brasil
          </h2>
          <p className="text-lg text-muted-foreground">
            Conheça as unidades que compõem nossa rede de saúde
          </p>
        </div>

        {/* Tabs */}
        <div className="flex md:flex-wrap md:justify-center gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap snap-start flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {tab.data.length}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <InstitutionFilters
          filters={filters}
          onFiltersChange={setFilters}
          activeTab={activeTab}
        />

        {/* Empty state */}
        {activeData.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Nenhuma instituição encontrada com os filtros selecionados.</p>
          </div>
        ) : isMobile ? (
          /* Mobile: Carousel */
          <div>
            <div
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {activeData.map((institution, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-1">
                    <InstitutionCard institution={institution} />
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => goTo(carouselIndex - 1)}
                disabled={carouselIndex === 0}
                className="p-2 rounded-full bg-card border border-border text-foreground disabled:opacity-30 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1.5">
                {activeData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === carouselIndex ? "bg-primary w-6" : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => goTo(carouselIndex + 1)}
                disabled={carouselIndex === activeData.length - 1}
                className="p-2 rounded-full bg-card border border-border text-foreground disabled:opacity-30 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Desktop: Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeData.map((institution, index) => (
              <InstitutionCard key={index} institution={institution} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default InstitutionsSection;
