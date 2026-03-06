import { useState, useRef, useCallback } from "react";
import { Building2, Stethoscope, Heart, Leaf, MapPin, Calendar, Users, Bed, Briefcase, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { hospitals, medicalCenters, clinics, medicalSpas, type Institution } from "@/data/institutions";
import { institutionImages } from "@/data/institutionImages";
import { useIsMobile } from "@/hooks/use-mobile";

const tabs = [
  { id: "hospitals", label: "Hospitais", icon: Building2, data: hospitals },
  { id: "medical-centers", label: "Centros Médicos", icon: Stethoscope, data: medicalCenters },
  { id: "clinics", label: "Clínicas", icon: Heart, data: clinics },
  { id: "spas", label: "Spas Médicos", icon: Leaf, data: medicalSpas },
];

const PLACEHOLDER = "Informação institucional em atualização";

const InstitutionCard = ({ institution, isMobile }: { institution: Institution; isMobile: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const isPlaceholder = (value: string) => value === PLACEHOLDER || value === "N/A";
  const image = institutionImages[institution.name];

  return (
    <div className="card-institutional overflow-hidden flex-shrink-0 w-full">
      {/* Image */}
      {image && (
        <div className="-mx-6 -mt-6 mb-4 md:-mx-8 md:-mt-8">
          <img
            src={image}
            alt={institution.name}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1">
            {institution.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{institution.city}, {institution.state}</span>
          </div>
        </div>
        {!isPlaceholder(institution.yearFounded) && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
            <Calendar className="w-3 h-3" />
            {institution.yearFounded}
          </div>
        )}
      </div>

      {/* Details Grid - always visible */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {!isPlaceholder(institution.beds) && (
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Leitos</p>
              <p className="text-sm font-medium text-foreground">{institution.beds}</p>
            </div>
          </div>
        )}
        {!isPlaceholder(institution.employees) && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Colaboradores</p>
              <p className="text-sm font-medium text-foreground">{institution.employees}</p>
            </div>
          </div>
        )}
      </div>

      {/* Expandable content on mobile, always visible on desktop */}
      {(!isMobile || expanded) && (
        <>
          {/* Specialties */}
          {!isPlaceholder(institution.specialties) && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Especialidades</p>
              <p className="text-sm text-foreground leading-relaxed">
                {institution.specialties}
              </p>
            </div>
          )}

          {/* Services */}
          {institution.services && !isPlaceholder(institution.services) && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs text-muted-foreground">Serviços</p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {institution.services}
              </p>
            </div>
          )}

          {/* Technical Director */}
          {!isPlaceholder(institution.technicalMedicalDirector) && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">Diretor Técnico-Médico</p>
              <p className="text-sm font-medium text-foreground">{institution.technicalMedicalDirector}</p>
            </div>
          )}

          {/* Placeholder Notice */}
          {isPlaceholder(institution.specialties) && isPlaceholder(institution.technicalMedicalDirector) && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                {PLACEHOLDER}
              </p>
            </div>
          )}
        </>
      )}

      {/* "Ver mais" button - mobile only */}
      {isMobile && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? "Ver menos" : "Ver mais"}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
};

const InstitutionsSection = () => {
  const [activeTab, setActiveTab] = useState("hospitals");
  const isMobile = useIsMobile();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const activeData = tabs.find((tab) => tab.id === activeTab)?.data || [];

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
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
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

        {/* Mobile: Carousel */}
        {isMobile ? (
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
                    <InstitutionCard institution={institution} isMobile={true} />
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
              <InstitutionCard key={index} institution={institution} isMobile={false} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default InstitutionsSection;
